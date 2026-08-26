import { readFile } from "node:fs/promises";

const files = {
  models: "apps/api/accounts/models.py",
  services: "apps/api/accounts/services.py",
  views: "apps/api/accounts/views.py",
  urls: "apps/api/accounts/urls.py",
  settings: "apps/api/endoora_api/settings/base.py",
  production: "apps/api/endoora_api/settings/production.py",
  authShell: "apps/web/components/auth/AuthShell.tsx",
  authStyles: "apps/web/components/auth/auth.module.css",
  rootLayout: "apps/web/app/layout.tsx",
  themeToggle: "apps/web/components/theme/ThemeToggle.tsx",
  passwordField: "apps/web/components/auth/PasswordField.tsx",
  login: "apps/web/app/auth/login/page.tsx",
  recovery: "apps/web/app/auth/forgot-password/page.tsx",
  threatModel: "docs/security/auth-threat-model.md",
  permissionMatrix: "docs/security/permission-matrix.md",
  designSpec: "docs/uiux/day07-auth-security/README.md",
};

const source = Object.fromEntries(
  await Promise.all(
    Object.entries(files).map(async ([key, path]) => [
      key,
      await readFile(path, "utf8"),
    ]),
  ),
);

const failures = [];

function requireText(fileKey, text, reason) {
  if (!source[fileKey].includes(text)) {
    failures.push(`${files[fileKey]}: ${reason}`);
  }
}

requireText("models", "class User(AbstractUser)", "custom user model is missing");
requireText("models", "username = None", "email-first identity is not explicit");
requireText("models", "email_verified_at", "email verification state is missing");
requireText("models", "code_hash", "OTP hash storage is missing");
requireText("models", "accounts_unique_consent_version", "versioned consent uniqueness is missing");
requireText("services", "secrets.randbelow", "cryptographically secure OTP generation is missing");
requireText("services", "make_password(raw_code)", "OTP hashing is missing");
requireText("services", "expected_user", "OTP ownership binding is missing");
requireText("services", "cancel_account_deletion", "deletion cancellation is missing");
requireText("views", "account_exists", "generic unknown-account recovery branch is missing");
requireText("views", "otp_login_unavailable", "email/password-first login strategy is not enforced");
requireText("views", "throttle_scope = \"auth_login\"", "login throttle is missing");
requireText("views", "throttle_scope = \"otp_request\"", "OTP request throttle is missing");
requireText("urls", "deletion-request/cancel/", "deletion cancellation route is missing");
requireText("settings", "AUTH_USER_MODEL = \"accounts.User\"", "custom user setting is missing");
requireText("settings", "SESSION_COOKIE_HTTPONLY = True", "HttpOnly session cookie is missing");
requireText("settings", "CSRF_COOKIE_HTTPONLY = True", "HttpOnly CSRF cookie is missing");
requireText("settings", "\"auth_login\": \"10/minute\"", "bounded login rate is missing");
requireText("settings", "ENDOORA_TERMS_VERSION", "terms consent version setting is missing");
requireText("settings", "ENDOORA_PRIVACY_VERSION", "privacy consent version setting is missing");
requireText("production", "SESSION_COOKIE_SECURE = True", "secure production session cookie is missing");
requireText("production", "X_FRAME_OPTIONS = \"DENY\"", "frame denial is missing");
requireText("authShell", "variant?: \"auth\" | \"wide\"", "responsive AuthShell variants are missing");
requireText("rootLayout", "endoora-theme-v1", "persistent Endoora color theme bootstrap is missing");
requireText("themeToggle", "document.documentElement.dataset.theme", "global color-theme control is missing");
requireText("authStyles", "backdrop-filter", "learning-glass treatment is missing");
requireText("authStyles", "@media (max-width: 36rem)", "360px responsive contract is missing");
requireText("authStyles", "prefers-reduced-motion", "reduced-motion support is missing");
requireText("passwordField", "aria-pressed", "accessible password visibility state is missing");
requireText("login", "PasswordField", "login password visibility control is missing");
requireText("recovery", "If an active account matches", "generic recovery copy is missing");
requireText("threatModel", "User enumeration", "user-enumeration threat is undocumented");
requireText("permissionMatrix", "Change own role", "self-promotion boundary is undocumented");
requireText("designSpec", "360px mobile", "mobile design contract is undocumented");

if (failures.length > 0) {
  console.error("Day 07 contract check failed:\n");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Day 07 auth, security, responsive UI, and documentation contracts pass.");
