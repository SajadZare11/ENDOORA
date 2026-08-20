from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "api/placement/",
        include("placement.urls"),
    ),
    path("api/", include("core.urls")),
    path("api/waitlist/", include("waitlist.urls")),
    path("api/auth/", include("accounts.urls")),
    path("api/profiles/", include("profiles.urls")),
    path("api/dashboard/", include("dashboard.urls")),
    path("api/teachers/", include("teachers.urls")),
    path("api/taxonomy/", include("taxonomy.urls")),
    path("api/questions/", include("questions.urls")),
]
