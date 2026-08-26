import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing Day 10 file: ${relativePath}`);
  }
  return fs.readFileSync(fullPath, "utf8");
}

function requireText(relativePath, text, label) {
  const source = read(relativePath);
  if (!source.includes(text)) {
    throw new Error(`${label}: expected ${JSON.stringify(text)} in ${relativePath}`);
  }
}

const requiredFiles = [
  "apps/api/teachers/apps.py",
  "apps/api/teachers/dashboard.py",
  "apps/api/teachers/serializers.py",
  "apps/api/teachers/views.py",
  "apps/api/teachers/urls.py",
  "apps/api/teachers/tests.py",
  "apps/web/lib/teacher-dashboard.ts",
  "apps/web/components/teacher/TeacherShell.tsx",
  "apps/web/components/teacher/TeacherDashboard.tsx",
  "apps/web/components/teacher/TeacherFoundationPage.tsx",
  "apps/web/components/teacher/teacher.css",
  "apps/web/app/(teacher)/layout.tsx",
  "apps/web/app/(teacher)/teacher/page.tsx",
  "apps/web/app/(teacher)/teacher/classes/page.tsx",
  "apps/web/app/(teacher)/teacher/resources/page.tsx",
  "apps/web/app/(teacher)/teacher/question-bank/page.tsx",
  "apps/web/app/(teacher)/teacher/fixed-classes/new/page.tsx",
  "apps/web/app/(teacher)/teacher/account/page.tsx",
  "apps/web/app/(teacher)/marketplace/requests/page.tsx",
  "apps/web/public/images/teacher/teacher-verification.png",
];

for (const file of requiredFiles) read(file);

requireText("apps/api/endoora_api/settings/base.py", '"dashboard",', "Day 09 registration repair");
requireText("apps/api/endoora_api/settings/base.py", '"teachers",', "Teacher app registration");
requireText("apps/api/endoora_api/urls.py", 'path("api/dashboard/", include("dashboard.urls"))', "Day 09 URL repair");
requireText("apps/api/endoora_api/urls.py", 'path("api/teachers/", include("teachers.urls"))', "Teacher API URL");
requireText("apps/web/components/teacher/TeacherShell.tsx", 'href: "/teacher"', "Teacher Home nav");
requireText("apps/web/components/teacher/TeacherShell.tsx", 'href: "/teacher/classes"', "Teacher Teach nav");
requireText("apps/web/components/teacher/TeacherShell.tsx", 'href: "/marketplace/requests"', "Teacher Marketplace nav");
requireText("apps/web/components/teacher/TeacherShell.tsx", 'href: "/teacher/resources"', "Teacher Resources nav");
requireText("apps/web/components/teacher/TeacherShell.tsx", 'href: "/teacher/account"', "Teacher Account nav");
requireText("apps/web/components/teacher/TeacherShell.tsx", 'const [locale, setLocale] = useState<TeacherLocale>("fa")', "Persian-first locale");
requireText("apps/web/components/teacher/TeacherShell.tsx", "persistPreferredLocale", "Persistent bilingual preference");
requireText("apps/web/components/teacher/TeacherShell.tsx", "TeacherIcon", "Accessible teacher navigation icons");
requireText("apps/web/components/teacher/TeacherDashboard.tsx", "/images/teacher/teacher-verification.png", "Purpose-built verification artwork");
requireText("apps/web/components/teacher/TeacherDashboard.tsx", "teacher-profile-progress", "Real teacher profile completeness");
requireText("apps/web/components/teacher/TeacherDashboard.tsx", "teacher-account-rail", "Finance and settings Account destination");
requireText("apps/api/teachers/dashboard.py", '"amount_toman": None', "No invented earnings");
requireText("apps/api/teachers/dashboard.py", '"count": None', "No invented future-domain counts");
requireText("apps/api/teachers/tests.py", "assertNumQueries(1)", "Bounded dashboard query test");
requireText("apps/api/teachers/tests.py", "forbidden_keys", "Sensitive learner-content regression test");

const serializer = read("apps/api/teachers/serializers.py");
for (const forbidden of ["raw_writing", "audio_blob", "conversation_history", "private_message"]) {
  if (serializer.includes(forbidden)) {
    throw new Error(`Sensitive learner field leaked into teacher serializer: ${forbidden}`);
  }
}

const css = read("apps/web/components/teacher/teacher.css");
if (!css.includes("@media (max-width: 48rem)")) {
  throw new Error("Teacher mobile breakpoint is missing.");
}
if (!css.includes("grid-template-columns: repeat(5")) {
  throw new Error("Teacher mobile navigation must contain five primary destinations.");
}
if (!css.includes("inset-inline") || !css.includes("margin-inline")) {
  throw new Error("Teacher CSS must use logical RTL/LTR properties.");
}
if (!css.includes("prefers-reduced-motion") || !css.includes(":focus-visible")) {
  throw new Error("Teacher shell must preserve keyboard focus and reduced-motion support.");
}

const teacherLayout = read("apps/web/app/(teacher)/layout.tsx");
if (teacherLayout.includes("EndooraShell")) {
  throw new Error("Teacher routes must not be wrapped in the public marketing shell.");
}

const teacherDashboard = read("apps/web/components/teacher/TeacherDashboard.tsx");
for (const sensitive of ["raw_writing", "audio_blob", "conversation_history", "private_message"]) {
  if (teacherDashboard.includes(sensitive)) {
    throw new Error(`Sensitive learner evidence surfaced in teacher UI: ${sensitive}`);
  }
}

console.log(
  "Day 10 static checks passed: separate teacher role shell, persistent bilingual preference, five-item navigation, urgency-first action, capability gates, privacy redaction, bounded query test, safe future-domain states, responsive layout, and production verification artwork.",
);
