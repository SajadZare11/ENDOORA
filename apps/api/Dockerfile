FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    ENDOORA_STATIC_ROOT=/app/staticfiles \
    ENDOORA_MEDIA_ROOT=/app/media

WORKDIR /app/apps/api
COPY data/ /app/data/
COPY apps/api/ ./

ARG ENDOORA_LOCAL_SEARCH=0
RUN --mount=type=secret,id=build_ca,target=/run/secrets/build_ca \
    set -eu; \
    if [ -s /run/secrets/build_ca ]; then export PIP_CERT=/run/secrets/build_ca; fi; \
    apt-get update; \
    apt-get install -y --no-install-recommends curl postgresql-client; \
    rm -rf /var/lib/apt/lists/*; \
    pip install -r requirements.txt gunicorn 'uvicorn[standard]'; \
    if [ "$ENDOORA_LOCAL_SEARCH" = "1" ]; then pip install -r search/requirements-local.txt; fi; \
    DJANGO_SETTINGS_MODULE=endoora_api.settings.test python manage.py collectstatic --noinput; \
    chmod -R a+rX /app/apps/api /app/data /app/staticfiles; \
    addgroup --system --gid 1001 django; \
    adduser --system --uid 1001 --ingroup django django; \
    install -d -o django -g django /app/media /app/vault/backups

USER django
EXPOSE 8000
ENV DJANGO_SETTINGS_MODULE=endoora_api.settings.production \
    WEB_CONCURRENCY=4
CMD ["gunicorn", "endoora_api.wsgi:application", "--bind", "0.0.0.0:8000", "--timeout", "60"]
