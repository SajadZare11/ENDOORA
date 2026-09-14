from django.urls import path
from ielts.views import (
    AdminIELTSTestListCreateView,
    AdminIELTSTestDetailView,
    AdminSubmitReviewView,
    AdminApproveReviewView,
    AdminPublishTestView,
    AdminCloneNewVersionView,
    IELTSBandDescriptorListView,
    PublicIELTSTestListView,
)

urlpatterns = [
    # Admin / Editor Studio endpoints
    path("tests/", AdminIELTSTestListCreateView.as_view(), name="admin-ielts-tests-list"),
    path("tests/<uuid:test_id>/", AdminIELTSTestDetailView.as_view(), name="admin-ielts-test-detail"),
    path("tests/<uuid:test_id>/submit-review/", AdminSubmitReviewView.as_view(), name="admin-ielts-submit-review"),
    path("tests/<uuid:test_id>/approve/", AdminApproveReviewView.as_view(), name="admin-ielts-approve-review"),
    path("tests/<uuid:test_id>/publish/", AdminPublishTestView.as_view(), name="admin-ielts-publish-test"),
    path("tests/<uuid:test_id>/clone/", AdminCloneNewVersionView.as_view(), name="admin-ielts-clone-version"),

    # Public Band Descriptors & Catalog
    path("band-descriptors/", IELTSBandDescriptorListView.as_view(), name="ielts-band-descriptors"),
    path("public/tests/", PublicIELTSTestListView.as_view(), name="public-ielts-tests-list"),
]
