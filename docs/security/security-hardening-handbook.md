# Platform Security Hardening, Rate Limiting & Penetration Defense Handbook (SEC-001)

## Overview

Day 51 implements high-grade defense-in-depth security architectures across both backend (Django/DRF) and frontend (Next.js) layers to protect Iranian English learners, educators, and administrative operators from injection, brute-force attacks, session hijacking, cross-site scripting (XSS), and automated denial-of-service attempts.

---

## 1. HTTP Security Headers

### Backend (`SecurityHeadersMiddleware`)
Every HTTP response dispatched by the Django REST API incorporates production-grade HTTP security headers:
- `X-Content-Type-Options: nosniff` — Prevents MIME-type sniffing by browsers.
- `X-Frame-Options: DENY` — Prohibits clickjacking by preventing framing of any Endoora API or administrative view.
- `X-XSS-Protection: 1; mode=block` — Enables browser-level reflective XSS protection.
- `Referrer-Policy: strict-origin-when-cross-origin` — Restricts sensitive referrer leakage across origins.
- `Permissions-Policy: camera=(), microphone=(self), geolocation=()` — Restricts unauthorized hardware capabilities to validated domain boundaries (microphone permitted strictly for Voice Lab / Speaking evaluations).
- `Content-Security-Policy`: Default-src `'self'`; report-only during development and strictly enforced in staging/production environments.
- `Strict-Transport-Security`: Enforces TLS encryption with `includeSubDomains; preload` outside local development environments.

### Frontend (`next.config.ts`)
Next.js applies symmetric security headers globally across all 178 routes, explicitly preventing inline script exploitation, external asset injection, or clickjacking.

---

## 2. Dynamic Rate Limiting & Anti-Brute-Force Architecture

### Role-Based Throttling (`RoleBasedThrottle`)
Throttling is tiered dynamically based on authenticated identity:
- **Anonymous Guests**: `30 requests/minute` — Protects public endpoints from automated scrapers and brute-force scanners.
- **Learners**: `60 requests/minute` — Adequate for interactive exercises, SRS reviews, and real-time mission execution.
- **Teachers**: `100 requests/minute` — Accommodates high-volume gradebook scoring, assignment creation, and roster analytics.
- **Content Editors & Support Staff**: `200 requests/minute` — Supports continuous CMS authoring, taxonomy management, and ticket triage.
- **Administrators**: `500 requests/minute` — Allows intensive operational monitoring, bulk updates, and telemetric aggregation.

### Burst Protection (`BurstProtectionThrottle`)
Detects rapid-fire identical requests (same route and user within an ultra-short window) to guard against duplicate accidental submissions, double billing, or rapid click-spamming (`10 requests/second` limit).

### IP Rate Limiting (`IPRateLimitMiddleware`)
An IP-based circuit breaker tracking connection velocity per IP address within 60-second sliding windows, returning HTTP 429 (`Too Many Requests`) with a compliant `Retry-After` header when volume exceeds `ENDOORA_IP_RATE_LIMIT_PER_MINUTE` (default: 120 req/min).

---

## 3. Input Sanitization & Threat Neutralization

### Request Body Scanner (`InputSanitizationMiddleware`)
Scans all non-GET mutation requests (`POST`, `PUT`, `PATCH`) for hostile signatures:
- `<script` and `javascript:` payload injection.
- Unescaped inline event handlers (`onload=`, `onerror=`, etc.).
- SQL injection patterns (`UNION SELECT`, `DROP TABLE`, `INSERT INTO...VALUES`, `DELETE FROM...WHERE 1=1`, `OR 1=1`, `'; --`).
- Non-compliant payloads are immediately terminated with HTTP 400 and structured error code `DANGEROUS_INPUT_DETECTED`.

### Input Validators (`security/validators.py`)
- `sanitize_text_input`: Sanitizes string inputs by stripping unsafe HTML and javascript protocol handlers.
- `validate_no_injection`: Validates field inputs against SQL injection and shell escape sequences.
- `validate_content_length`: Enforces strict payload byte constraints to prevent buffer consumption or memory exhaustion.

---

## 4. Security Operations & Telemetry

### Security Operations Dashboard (`/operations/security`)
An executive operations view integrated seamlessly into the 8-tab operational ribbon:
1. **Security Posture KPIs**: Active rate limit rules, role-based throttle tiers, password validator strength, and CORS origin controls.
2. **Security Headers Compliance Matrix**: Real-time evaluation of headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`, `CSP`, `HSTS`).
3. **Cookie Security Posture**: Enforces `HttpOnly`, `SameSite=Lax`, and secure session cookies.
4. **Role Throttling Matrix**: Real-time visibility into throttle rates assigned to learners, teachers, editors, and admins.
5. **API Endpoints**:
   - `GET /api/security/audit/` — Authenticated audit of platform security parameters (Admin/Staff only).
   - `GET /api/security/health/` — Lightweight public health indicator for monitoring probes.
