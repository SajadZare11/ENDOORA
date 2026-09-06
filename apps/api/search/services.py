"""
Search services:
1. SearchIndexingService: Normalizes and indexes platform resources.
   - Excludes raw private messages (safety guard).
2. SearchService: Permission-aware search execution, zero-result logging,
   recent searches, and popular suggestions.
"""

from typing import Optional, List, Dict, Any
from django.conf import settings
from django.db import models
from django.db.models import Q, F, Count
from django.utils import timezone

from search.models import (
    SearchDocument,
    SearchQueryLog,
    RecentSearch,
    SearchContentType,
    SearchVisibility,
)
from search.normalizer import normalize_text, tokenize


DEFAULT_POPULAR_SEARCHES = [
    "تعیین سطح",
    "آیلتس آکادمیک",
    "گرامر زمان‌ها",
    "طرح درس",
    "مکالمه روزمره",
    "واژگان کنکور",
]


class SearchIndexingService:
    @staticmethod
    def index_document(
        target_id: str,
        content_type: str,
        title: str,
        content: str,
        target_url: str,
        visibility: str = SearchVisibility.PUBLIC,
        owner_id: Optional[str] = None,
        tags: Optional[List[str]] = None,
        popularity_score: int = 0,
    ) -> SearchDocument:
        doc, _ = SearchDocument.objects.update_or_create(
            target_id=str(target_id),
            content_type=content_type,
            defaults={
                "title": title,
                "content": content,
                "target_url": target_url,
                "visibility": visibility,
                "owner_id": owner_id,
                "tags": tags or [],
                "popularity_score": popularity_score,
            },
        )
        return doc

    @staticmethod
    def index_course(course) -> SearchDocument:
        return SearchIndexingService.index_document(
            target_id=str(getattr(course, "slug", course.id)),
            content_type=SearchContentType.COURSE,
            title=getattr(course, "title", str(course)),
            content=getattr(course, "description", ""),
            target_url=f"/courses/{getattr(course, 'slug', course.id)}",
            visibility=SearchVisibility.PUBLIC,
            tags=getattr(course, "tags", []),
            popularity_score=getattr(course, "enrollment_count", 0),
        )

    @staticmethod
    def index_community_post(post) -> SearchDocument:
        # Only index active public posts
        if getattr(post, "status", "active") != "active":
            SearchDocument.objects.filter(
                target_id=str(post.id),
                content_type=SearchContentType.COMMUNITY_POST,
            ).delete()
            return None

        content_type = (
            SearchContentType.LESSON_PLAN
            if getattr(post, "category", "") == "lesson_plan"
            else SearchContentType.COMMUNITY_POST
        )

        return SearchIndexingService.index_document(
            target_id=str(post.id),
            content_type=content_type,
            title=post.title,
            content=post.content,
            target_url=f"/community#post-{post.id}",
            visibility=SearchVisibility.PUBLIC,
            owner_id=getattr(post, "author_id", None),
            tags=[post.category] if getattr(post, "category", None) else [],
            popularity_score=getattr(post, "likes_count", 0),
        )

    @staticmethod
    def index_faq(faq_item) -> SearchDocument:
        if not getattr(faq_item, "is_published", True):
            SearchDocument.objects.filter(
                target_id=str(faq_item.id),
                content_type=SearchContentType.FAQ,
            ).delete()
            return None

        return SearchIndexingService.index_document(
            target_id=str(faq_item.id),
            content_type=SearchContentType.FAQ,
            title=faq_item.question,
            content=faq_item.answer,
            target_url=f"/support#faq-{faq_item.id}",
            visibility=SearchVisibility.PUBLIC,
            tags=getattr(faq_item, "tags", []),
            popularity_score=getattr(faq_item, "helpful_count", 0),
        )

    @staticmethod
    def index_assignment(assignment, owner_id: str) -> SearchDocument:
        """Indexes user-specific private assignment (only accessible by owner)."""
        return SearchIndexingService.index_document(
            target_id=str(assignment.id),
            content_type=SearchContentType.ASSIGNMENT,
            title=getattr(assignment, "title", "تکلیف اختصاصی"),
            content=getattr(assignment, "description", ""),
            target_url=f"/assignments/{assignment.id}",
            visibility=SearchVisibility.PRIVATE_OWNER,
            owner_id=owner_id,
            popularity_score=0,
        )

    @staticmethod
    def index_private_message(*args, **kwargs):
        """CRITICAL FAILURE TRAP GUARD: Raw private messages must never be indexed."""
        raise ValueError(
            "Security & Safety Violation: Raw private messages must NEVER be indexed in unified search."
        )

    @staticmethod
    def remove_document(target_id: str, content_type: str) -> None:
        SearchDocument.objects.filter(
            target_id=str(target_id),
            content_type=content_type,
        ).delete()


class SearchService:
    @staticmethod
    def build_permission_filter(user) -> Q:
        """
        Builds strict permission filter before ranking query.
        Ensures private records NEVER leak to unauthorized users.
        """
        if not user or not user.is_authenticated:
            # Anonymous users can ONLY see public documents
            return Q(visibility=SearchVisibility.PUBLIC)

        # Authenticated users can see:
        # 1. Public documents
        # 2. Authenticated-only documents
        # 3. Private items owned by this specific user
        perm_filter = (
            Q(visibility=SearchVisibility.PUBLIC)
            | Q(visibility=SearchVisibility.AUTHENTICATED)
            | Q(visibility=SearchVisibility.PRIVATE_OWNER, owner_id=user.id)
        )

        # Teacher specific documents
        if getattr(user, "is_verified_teacher", False) or getattr(user, "role", "") == "teacher":
            perm_filter |= Q(visibility=SearchVisibility.TEACHER_ONLY)

        # Learner specific documents
        if getattr(user, "role", "") == "learner" or not getattr(user, "is_staff", False):
            perm_filter |= Q(visibility=SearchVisibility.STUDENT_ONLY)

        # Staff can see all except strictly private owner items of other users
        if getattr(user, "is_staff", False):
            perm_filter |= Q(visibility__in=[
                SearchVisibility.PUBLIC,
                SearchVisibility.AUTHENTICATED,
                SearchVisibility.TEACHER_ONLY,
                SearchVisibility.STUDENT_ONLY,
            ])

        return perm_filter

    @staticmethod
    def search(
        query: str,
        user=None,
        content_type: Optional[str] = None,
        page: int = 1,
        page_size: int = 20,
    ) -> Dict[str, Any]:
        """
        Executes permission-aware unified search with Persian/English normalization.
        Logs queries and tracks zero-result terms.
        """
        clean_q = (query or "").strip()
        norm_q = normalize_text(clean_q)
        tokens = tokenize(clean_q)

        # 1. Base query with permission filter
        perm_filter = SearchService.build_permission_filter(user)
        queryset = SearchDocument.objects.filter(perm_filter)

        # 2. Filter by category if requested
        if content_type:
            queryset = queryset.filter(content_type=content_type)

        # 3. Text search
        if not norm_q:
            # Empty query: return popular / recent public documents
            results = queryset.order_by("-popularity_score", "-updated_at")[:page_size]
            total_count = queryset.count()
            return {
                "query": "",
                "total_count": total_count,
                "is_zero_result": False,
                "results": results,
                "popular_searches": SearchService.get_popular_searches(),
                "recent_searches": SearchService.get_recent_searches(user),
            }

        # Multi-term token matching
        match_query = (
            Q(normalized_title__icontains=norm_q)
            | Q(normalized_content__icontains=norm_q)
        )
        for token in tokens:
            match_query |= (
                Q(normalized_title__icontains=token)
                | Q(normalized_content__icontains=token)
            )

        matched_qs = queryset.filter(match_query)

        # Relevance prioritization: exact title match > partial title > content > popularity
        # Using conditional annotations for ranking
        annotated_qs = matched_qs.annotate(
            exact_title_match=models.Case(
                models.When(normalized_title=norm_q, then=models.Value(100)),
                models.When(normalized_title__istartswith=norm_q, then=models.Value(50)),
                models.When(normalized_title__icontains=norm_q, then=models.Value(30)),
                default=models.Value(10),
                output_field=models.IntegerField(),
            )
        ).order_by("-exact_title_match", "-popularity_score", "-updated_at")

        total_count = annotated_qs.count()
        start = (page - 1) * page_size
        end = start + page_size
        results = list(annotated_qs[start:end])

        # 4. Log search query & track zero results
        is_zero = total_count == 0
        SearchQueryLog.objects.create(
            query=clean_q,
            normalized_query=norm_q,
            user=user if user and user.is_authenticated else None,
            results_count=total_count,
            is_zero_result=is_zero,
            filter_applied=content_type or "",
        )

        # 5. Save recent search for authenticated user
        if user and user.is_authenticated and clean_q:
            RecentSearch.objects.update_or_create(
                user=user,
                query=clean_q,
                defaults={"created_at": timezone.now()},
            )
            # Cap recent searches at 10 items
            excess = RecentSearch.objects.filter(user=user).order_by("-created_at")[10:]
            if excess:
                RecentSearch.objects.filter(id__in=[e.id for e in excess]).delete()

        return {
            "query": clean_q,
            "normalized_query": norm_q,
            "total_count": total_count,
            "is_zero_result": is_zero,
            "results": results,
            "popular_searches": SearchService.get_popular_searches(),
            "recent_searches": SearchService.get_recent_searches(user),
            "zero_result_suggestions": (
                DEFAULT_POPULAR_SEARCHES if is_zero else []
            ),
        }

    @staticmethod
    def get_popular_searches(limit: int = 6) -> List[str]:
        """Returns popular non-zero search queries aggregated from logs, falling back to defaults."""
        logs = (
            SearchQueryLog.objects.filter(is_zero_result=False)
            .values("query")
            .annotate(query_count=Count("id"))
            .order_by("-query_count")[:limit]
        )
        popular = [item["query"] for item in logs if item["query"].strip()]
        if len(popular) < limit:
            for d in DEFAULT_POPULAR_SEARCHES:
                if d not in popular:
                    popular.append(d)
                if len(popular) >= limit:
                    break
        return popular[:limit]

    @staticmethod
    def get_recent_searches(user, limit: int = 5) -> List[str]:
        """Returns recent searches for authenticated user."""
        if not user or not user.is_authenticated:
            return []
        return list(
            RecentSearch.objects.filter(user=user)
            .order_by("-created_at")
            .values_list("query", flat=True)[:limit]
        )

    @staticmethod
    def clear_recent_searches(user) -> None:
        if user and user.is_authenticated:
            RecentSearch.objects.filter(user=user).delete()

    @staticmethod
    def get_zero_result_analytics(limit: int = 50):
        """Staff analytics for terms that returned zero results."""
        return (
            SearchQueryLog.objects.filter(is_zero_result=True)
            .values("query")
            .annotate(search_count=Count("id"), last_searched=models.Max("created_at"))
            .order_by("-search_count")[:limit]
        )
