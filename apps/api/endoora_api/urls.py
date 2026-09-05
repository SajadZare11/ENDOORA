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

    path(
        "api/mistakes/",
        include("mistake_genome.urls")
    ),
    path("api/taxonomy/", include("taxonomy.urls")),
    path(
        "api/ai/",
        include("ai_gateway.urls")
    ),
    path(
        "api/exercises/",
        include("ai_gateway.urls")
    ),
    path("api/questions/", include("questions.urls")),
    path(
        "api/srs/",
        include("srs.urls")
    ),
    path("api/learner-twin/", include("learner_twin.urls")),
    path("api/path/", include("learner_twin.urls")),
    path(
        "api/missions/",
        include("missions.urls")
    ),
    path(
        "api/writing/",
        include("writing_mentor.urls")
    ),
    path(
        "api/writing-mentor/",
        include("writing_mentor.urls")
    ),
    path(
        "api/roleplay/",
        include("roleplay.urls")
    ),
    path(
        "api/voice/",
        include("voice_lab.urls")
    ),
    path(
        "api/speech/",
        include("speech.urls")
    ),
    path(
        "api/pronunciation/",
        include("pronunciation.urls")
    ),
    path(
        "api/gamification/",
        include("gamification.urls")
    ),
    path(
        "api/content/",
        include("content.urls")
    ),
    path(
        "api/courses/",
        include("courses.urls")
    ),
]
