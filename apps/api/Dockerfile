# Production build for Endoora Django REST API
# Designed for self-contained, offline-resilient execution in domestic Iranian datacenters
FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY apps/api/requirements.txt ./
RUN pip install --upgrade pip && \
    pip install -r requirements.txt && \
    pip install gunicorn uvicorn[standard]

COPY apps/api/ ./

RUN addgroup --system --gid 1001 django && \
    adduser --system --uid 1001 --ingroup django django && \
    chown -R django:django /app

USER django

EXPOSE 8000

ENV DJANGO_SETTINGS_MODULE=endoora_api.settings.production

CMD ["gunicorn", "endoora_api.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4", "--timeout", "60"]
