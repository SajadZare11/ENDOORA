from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import WritingDraft
from .serializers import (
    WritingAnalysisSerializer,
    WritingDraftDetailSerializer,
    WritingDraftSerializer,
)
from .services import WritingMentorService


class PromptListView(APIView):
    """
    Returns the curated library of writing prompts across CEFR levels and IELTS tasks.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        prompts = WritingMentorService.get_prompts()
        return Response(prompts, status=status.HTTP_200_OK)


class DraftListCreateView(APIView):
    """
    Lists learner drafts or creates/autosaves a new draft.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        drafts = WritingDraft.objects.filter(learner=request.user).order_by("-updated_at")
        serializer = WritingDraftSerializer(drafts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        draft_id = data.get("draft_id")
        try:
            draft = WritingMentorService.save_draft(
                learner=request.user,
                data=data,
                draft_id=int(draft_id) if draft_id else None,
            )
            serializer = WritingDraftDetailSerializer(draft)
            return Response(serializer.data, status=status.HTTP_200_OK if draft_id else status.HTTP_201_CREATED)
        except WritingDraft.DoesNotExist:
            return Response(
                {"error": "Draft not found or unauthorized."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DraftDetailView(APIView):
    """
    Retrieves a draft with its complete analysis and revision history.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, draft_id):
        try:
            draft = WritingDraft.objects.get(id=draft_id, learner=request.user)
            serializer = WritingDraftDetailSerializer(draft)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except WritingDraft.DoesNotExist:
            return Response(
                {"error": "Draft not found or unauthorized."},
                status=status.HTTP_404_NOT_FOUND,
            )


class DraftAnalyzeView(APIView):
    """
    Runs diagnostic writing analysis for a submitted draft.
    Requires submit-for-analysis confirmation.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, draft_id):
        try:
            analysis = WritingMentorService.analyze_writing(
                learner=request.user,
                draft_id=draft_id,
            )
            serializer = WritingAnalysisSerializer(analysis)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except WritingDraft.DoesNotExist:
            return Response(
                {"error": "Draft not found or unauthorized."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DraftReviseView(APIView):
    """
    Creates a new draft revision linked to the parent draft.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, draft_id):
        new_text = request.data.get("text", "")
        try:
            revision = WritingMentorService.create_revision(
                learner=request.user,
                parent_draft_id=draft_id,
                new_text=new_text,
            )
            serializer = WritingDraftDetailSerializer(revision)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except WritingDraft.DoesNotExist:
            return Response(
                {"error": "Parent draft not found or unauthorized."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AcceptCorrectionView(APIView):
    """
    Accepts a specific error correction item and feeds it to the Mistake Genome.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, draft_id):
        error_id = request.data.get("error_id")
        if not error_id:
            return Response(
                {"error": "error_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            updated_error = WritingMentorService.accept_correction(
                learner=request.user,
                draft_id=draft_id,
                error_id=error_id,
            )
            return Response(updated_error, status=status.HTTP_200_OK)
        except (WritingDraft.DoesNotExist, ValueError) as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DismissCorrectionView(APIView):
    """
    Dismisses a specific error correction item.
    Guarantees it is NOT recorded to the Mistake Genome.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, draft_id):
        error_id = request.data.get("error_id")
        if not error_id:
            return Response(
                {"error": "error_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            updated_error = WritingMentorService.dismiss_correction(
                learner=request.user,
                draft_id=draft_id,
                error_id=error_id,
            )
            return Response(updated_error, status=status.HTTP_200_OK)
        except (WritingDraft.DoesNotExist, ValueError) as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
