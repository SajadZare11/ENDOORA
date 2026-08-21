# Day 21 Install

1. Backup:

```powershell
git add .
git commit -m "Before Day 21 SRS"
```

2. Copy patch files into Endoora.

3. Add `srs` to `INSTALLED_APPS`:

```
"srs",
```

4. Add URL:

```
path("api/srs/", include("srs.urls")),
```

5. Run:

```powershell
cd apps/api
python manage.py makemigrations
python manage.py migrate
python manage.py check
```

6. Run frontend:

```powershell
cd apps/web
npm run dev
```

7. Verify:

`/review`

8. Commit:

```powershell
git add .
git commit -m "Day 21: Build SRS vocabulary engine"
git push
```
