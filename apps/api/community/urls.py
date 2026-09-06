from __future__ import annotations

from django.urls import path
from .views import (
    posts_list_create_view,
    post_detail_view,
    post_reaction_view,
    post_comments_view,
    featured_post_view,
    feature_post_editorial_view,
    user_block_view,
    user_unblock_view,
)

app_name = 'community'

urlpatterns = [
    path('posts/', posts_list_create_view, name='posts_list_create'),
    path('posts/featured/', featured_post_view, name='featured_post'),
    path('posts/<uuid:post_id>/', post_detail_view, name='post_detail'),
    path('posts/<uuid:post_id>/reactions/', post_reaction_view, name='post_reactions'),
    path('posts/<uuid:post_id>/comments/', post_comments_view, name='post_comments'),
    path('posts/<uuid:post_id>/feature/', feature_post_editorial_view, name='feature_post_editorial'),
    path('users/block/', user_block_view, name='user_block'),
    path('users/unblock/<uuid:target_user_id>/', user_unblock_view, name='user_unblock'),
]
