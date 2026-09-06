from __future__ import annotations

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.core.exceptions import PermissionDenied, ValidationError

from .models import CommunityPost, UserBlock
from .serializers import (
    CommunityPostSerializer,
    CommunityPostCreateSerializer,
    PostCommentSerializer,
    UserBlockSerializer,
)
from .services import CommunityService


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def posts_list_create_view(request):
    if request.method == 'GET':
        post_type = request.query_params.get('post_type')
        audience = request.query_params.get('audience')
        tag = request.query_params.get('tag')
        query = request.query_params.get('q')
        featured_only = request.query_params.get('featured') == 'true'

        posts = CommunityService.list_posts(
            user=request.user if request.user.is_authenticated else None,
            post_type=post_type,
            audience=audience,
            tag=tag,
            query=query,
            featured_only=featured_only,
        )
        serializer = CommunityPostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return Response(
                {'detail': 'برای ارسال پست باید وارد حساب شوید.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = CommunityPostCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            post = CommunityService.create_post(request.user, serializer.validated_data)
            return Response(
                CommunityPostSerializer(post, context={'request': request}).data,
                status=status.HTTP_201_CREATED
            )
        except ValidationError as e:
            return Response(e.message_dict if hasattr(e, 'message_dict') else {'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except PermissionDenied as e:
            return Response({'detail': str(e)}, status=status.HTTP_403_FORBIDDEN)


@api_view(['GET', 'DELETE'])
@permission_classes([AllowAny])
def post_detail_view(request, post_id):
    if request.method == 'GET':
        try:
            post = CommunityService.get_post_detail(
                post_id,
                user=request.user if request.user.is_authenticated else None
            )
            return Response(CommunityPostSerializer(post, context={'request': request}).data)
        except ValidationError as e:
            return Response({'detail': str(e)}, status=status.HTTP_404_NOT_FOUND)
        except PermissionDenied as e:
            return Response({'detail': str(e)}, status=status.HTTP_403_FORBIDDEN)

    elif request.method == 'DELETE':
        if not request.user.is_authenticated:
            return Response({'detail': 'احراز هویت الزامی است.'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            post = CommunityPost.objects.get(id=post_id)
            if post.author_id != request.user.id and not request.user.is_staff:
                return Response({'detail': 'اجازه حذف این پست را ندارید.'}, status=status.HTTP_403_FORBIDDEN)
            post.status = 'removed'
            post.save(update_fields=['status'])
            return Response({'status': 'removed'}, status=status.HTTP_200_OK)
        except CommunityPost.DoesNotExist:
            return Response({'detail': 'پست یافت نشد.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_reaction_view(request, post_id):
    reaction_type = request.data.get('reaction_type', 'like')
    try:
        result = CommunityService.toggle_reaction(post_id, request.user, reaction_type=reaction_type)
        return Response(result, status=status.HTTP_200_OK)
    except CommunityPost.DoesNotExist:
        return Response({'detail': 'پست یافت نشد.'}, status=status.HTTP_404_NOT_FOUND)
    except ValidationError as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def post_comments_view(request, post_id):
    if request.method == 'GET':
        try:
            post = CommunityPost.objects.get(id=post_id)
            comments = post.comments.filter(status='published').order_by('created_at')
            serializer = PostCommentSerializer(comments, many=True)
            return Response({
                'enabled': CommunityService.are_comments_enabled(),
                'comments': serializer.data
            })
        except CommunityPost.DoesNotExist:
            return Response({'detail': 'پست یافت نشد.'}, status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return Response({'detail': 'ورود به حساب الزامی است.'}, status=status.HTTP_401_UNAUTHORIZED)

        content = request.data.get('content', '')
        parent_id = request.data.get('parent_id')

        try:
            comment = CommunityService.add_comment(post_id, request.user, content, parent_id=parent_id)
            return Response(PostCommentSerializer(comment).data, status=status.HTTP_201_CREATED)
        except PermissionDenied as e:
            return Response({'detail': str(e)}, status=status.HTTP_403_FORBIDDEN)
        except ValidationError as e:
            return Response(e.message_dict if hasattr(e, 'message_dict') else {'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def featured_post_view(request):
    post = CommunityService.get_monthly_featured_post()
    if not post:
        return Response({'featured_post': None})
    return Response({'featured_post': CommunityPostSerializer(post, context={'request': request}).data})


@api_view(['POST'])
@permission_classes([IsAdminUser])
def feature_post_editorial_view(request, post_id):
    note = request.data.get('editorial_note', '')
    try:
        post = CommunityService.feature_post_editorial(post_id, request.user, editorial_note=note)
        return Response(CommunityPostSerializer(post, context={'request': request}).data)
    except PermissionDenied as e:
        return Response({'detail': str(e)}, status=status.HTTP_403_FORBIDDEN)
    except ValidationError as e:
        return Response(e.message_dict if hasattr(e, 'message_dict') else {'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def user_block_view(request):
    if request.method == 'GET':
        blocks = UserBlock.objects.filter(blocker=request.user)
        return Response(UserBlockSerializer(blocks, many=True).data)

    elif request.method == 'POST':
        target_id = request.data.get('target_user_id')
        reason = request.data.get('reason', '')
        is_mute = request.data.get('is_mute', False)

        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            target_user = User.objects.get(id=target_id)
            block = CommunityService.block_user(request.user, target_user, reason=reason, is_mute_only=is_mute)
            return Response(UserBlockSerializer(block).data, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({'detail': 'کاربر هدف یافت نشد.'}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return Response(e.message_dict if hasattr(e, 'message_dict') else {'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_unblock_view(request, target_user_id):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    try:
        target_user = User.objects.get(id=target_user_id)
        success = CommunityService.unblock_user(request.user, target_user)
        return Response({'unblocked': success})
    except User.DoesNotExist:
        return Response({'detail': 'کاربر یافت نشد.'}, status=status.HTTP_404_NOT_FOUND)
