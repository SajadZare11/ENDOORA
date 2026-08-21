# Day 20 Install

1. Copy the patch files into Endoora.
2. Add `missions` to INSTALLED_APPS in apps/api/endoora_api/settings/base.py.
3. Add `path("api/missions/", include("missions.urls")),` in endoora_api/urls.py.
4. Run:

python manage.py makemigrations missions
python manage.py migrate

5. Run checks:

python manage.py check
npm run lint

6. Open:

/today

Success:
A learner receives one daily mission with a visible explanation of why it was selected.
