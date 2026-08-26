import { access, readFile } from "node:fs/promises";

const requiredFiles = [
  "apps/api/profiles/models.py",
  "apps/api/profiles/serializers.py",
  "apps/api/profiles/views.py",
  "apps/api/profiles/urls.py",
  "apps/web/app/auth/register/page.tsx",
  "apps/web/app/auth/login/page.tsx",
  "apps/web/app/auth/forgot-password/page.tsx",
  "apps/web/app/onboarding/page.tsx",
  "apps/web/app/account/page.tsx",
  "apps/web/app/account/profile/page.tsx",
  "apps/web/app/account/sessions/page.tsx",
  "apps/web/app/account/data-controls/page.tsx",
];

await Promise.all(requiredFiles.map((file) => access(file)));

const sources = Object.fromEntries(
  await Promise.all(
    requiredFiles.map(async (file) => [file, await readFile(file, "utf8")]),
  ),
);

const assertions = [
  ["apps/api/profiles/models.py", "class LearnerProfile", "learner profile model"],
  ["apps/api/profiles/models.py", "class TeacherProfile", "teacher profile model"],
  ["apps/api/profiles/models.py", "class OnboardingProgress", "resumable onboarding model"],
  ["apps/api/profiles/models.py", "class DataExportRequest", "data-export request model"],
  ["apps/api/profiles/views.py", "settings.ENDOORA_TERMS_VERSION", "current Terms consent gate"],
  ["apps/api/profiles/views.py", "settings.ENDOORA_PRIVACY_VERSION", "current Privacy consent gate"],
  ["apps/api/profiles/views.py", "request.user.role", "server-side role separation"],
  ["apps/web/app/onboarding/page.tsx", "autosaveReady", "onboarding autosave"],
  ["apps/web/app/onboarding/page.tsx", "persistPreferredLocale", "onboarding locale persistence"],
  ["apps/web/app/onboarding/page.tsx", 'isLearner ? "/dashboard" : "/teacher"', "role-specific completion destination"],
  ["apps/web/app/account/page.tsx", 'href: "/account/profile"', "Account profile destination"],
  ["apps/web/app/account/page.tsx", 'href: "/account/sessions"', "Account sessions destination"],
  ["apps/web/app/account/page.tsx", 'href: "/account/data-controls"', "Account data-controls destination"],
  ["apps/web/app/account/data-controls/page.tsx", 'confirmation !== "DELETE"', "guarded deletion confirmation"],
  ["apps/web/app/account/sessions/page.tsx", '"/auth/logout/"', "current-session sign-out"],
];

const failures = [];

for (const [file, text, label] of assertions) {
  if (!sources[file].includes(text)) {
    failures.push(`${label} is missing from ${file}`);
  }
}

if (failures.length > 0) {
  console.error("Day 08 contract check failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Day 08 account, onboarding, profile, locale, session, and data-control contracts pass.");
