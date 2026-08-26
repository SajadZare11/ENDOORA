import { access, readFile } from "node:fs/promises";

const requiredFiles = [
  "apps/api/dashboard/services.py",
  "apps/api/dashboard/serializers.py",
  "apps/api/dashboard/views.py",
  "apps/api/dashboard/tests.py",
  "apps/web/app/(learner)/layout.tsx",
  "apps/web/app/(learner)/dashboard/page.tsx",
  "apps/web/app/(learner)/today/page.tsx",
  "apps/web/components/learner/LearnerShell.tsx",
  "apps/web/components/learner/LearnerDashboard.tsx",
  "apps/web/components/learner/learner.css",
  "apps/web/lib/learner-dashboard.ts",
  "apps/web/public/images/dashboard/placement-path.png",
];

await Promise.all(requiredFiles.map((file) => access(file)));

const textFiles = requiredFiles.filter((file) => !file.endsWith(".png"));
const sources = Object.fromEntries(
  await Promise.all(
    textFiles.map(async (file) => [file, await readFile(file, "utf8")]),
  ),
);

const assertions = [
  ["apps/api/dashboard/services.py", "PlacementSession.objects.filter", "real placement aggregation"],
  ["apps/api/dashboard/services.py", "DailyMission.objects.filter", "real mission aggregation"],
  ["apps/api/dashboard/services.py", "SrsItem.objects.filter", "real SRS aggregation"],
  ["apps/api/dashboard/services.py", "LearnerTwin.objects.filter", "evidence-backed skill snapshot"],
  ["apps/api/dashboard/services.py", '"path_progress_percent": None', "unsupported precision guard"],
  ["apps/api/dashboard/services.py", '"start_placement"', "first-time placement action"],
  ["apps/api/dashboard/views.py", "learner_dashboard.view", "dashboard view instrumentation"],
  ["apps/api/dashboard/views.py", "learner_dashboard.%s", "CTA instrumentation"],
  ["apps/api/dashboard/serializers.py", "TodayMissionSerializer", "typed mission contract"],
  ["apps/api/dashboard/serializers.py", "SkillSnapshotSerializer", "typed skill contract"],
  ["apps/web/app/(learner)/layout.tsx", "<LearnerShell>", "role-protected learner shell"],
  ["apps/web/app/(learner)/dashboard/page.tsx", "<LearnerDashboard />", "real dashboard route"],
  ["apps/web/components/learner/LearnerShell.tsx", "persistPreferredLocale", "persistent locale switch"],
  ["apps/web/components/learner/LearnerShell.tsx", 'href: "/dashboard"', "learner Home navigation"],
  ["apps/web/components/learner/LearnerShell.tsx", 'href: "/account"', "Account navigation"],
  ["apps/web/components/learner/LearnerDashboard.tsx", "trackPrimaryAction", "primary CTA instrumentation"],
  ["apps/web/components/learner/LearnerDashboard.tsx", "learner-today-card", "dominant Today action"],
  ["apps/web/components/learner/LearnerDashboard.tsx", "data.path_steps", "path preview"],
  ["apps/web/components/learner/LearnerDashboard.tsx", "data.skills", "skill snapshot"],
  ["apps/web/components/learner/LearnerDashboard.tsx", "learner-overview-grid", "assignment/SRS/class/course overview"],
  ["apps/web/components/learner/learner.css", "repeat(5, minmax(0, 1fr))", "five-item mobile navigation"],
  ["apps/web/components/learner/learner.css", "prefers-reduced-motion", "reduced-motion support"],
];

const failures = [];
for (const [file, expected, label] of assertions) {
  if (!sources[file].includes(expected)) {
    failures.push(`${label} is missing from ${file}`);
  }
}

const shell = sources["apps/web/app/(learner)/layout.tsx"];
if (shell.includes("EndooraShell")) {
  failures.push("public marketing shell must not wrap the learner application");
}

const dashboard = sources["apps/web/components/learner/LearnerDashboard.tsx"];
for (const unsupported of ["82%", "1,250 XP", "12 day streak"]) {
  if (dashboard.includes(unsupported)) {
    failures.push(`unsupported dashboard value found: ${unsupported}`);
  }
}

if (failures.length > 0) {
  console.error("Day 09 contract check failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Day 09 learner shell, aggregated dashboard, next-action, evidence, responsive, and instrumentation contracts pass.");
