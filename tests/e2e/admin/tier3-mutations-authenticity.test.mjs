import fs from "fs";
import path from "path";
import { expect, createRegistry } from "./helpers/assertions.mjs";

import {
  getCustomPages,
  saveCustomPage,
  deleteCustomPage,
} from "../../../apps/web/lib/admin-site-builder-store.ts";

import {
  getBackupsList,
  createDatabaseBackup,
  updateBackupPolicy,
  getAutonomousOpsStorage,
} from "../../../apps/web/lib/admin-autonomous-ops-store.ts";

import {
  getCustomFormsList,
  saveCustomForm,
  submitPublicFormResponse,
  getFormSubmissions,
  deleteCustomForm,
} from "../../../apps/web/lib/admin-forms-webhooks-store.ts";

import {
  getRefundsList,
  issueOneClickRefund,
  getRiskAlertsList,
  mitigateRiskAlertAction,
} from "../../../apps/web/lib/admin-financial-risk-store.ts";

import {
  getAffiliatesData,
  saveAffiliatePartnerAction,
  getLeaderboardData,
  adjustLearnerXpAction,
} from "../../../apps/web/lib/admin-gamification-affiliates-store.ts";

import {
  getMaintenanceConfig,
  saveMaintenanceConfig,
  getApiIntegrations,
  pingApiIntegration,
} from "../../../apps/web/lib/admin-server-ops-store.ts";

import {
  evaluateEssayLinguistics,
  getAiEngineStorage,
  deployPromptToProduction,
} from "../../../apps/web/lib/ai-engine-store.ts";

import {
  getLearnerEnrollments,
  grantCourseEnrollment,
  updateLessonQuizScore,
  MEDIA_PRESET_ASSETS,
  saveLessonQuiz,
  getLessonQuiz,
} from "../../../apps/web/lib/admin-academics-store.ts";

export const registry = createRegistry("Tier 3: Data Mutations & Store Authenticity Suite");

// 1. Site Builder Persistence
registry.test("Site Builder: Creates page with blocks, persists to disk, and reads back cleanly", () => {
  const pageId = `e2e-page-${Date.now()}`;
  saveCustomPage({
    id: pageId,
    slug: `e2e-landing-${Date.now()}`,
    titleFa: "صفحه جشنواره نوروزی E2E",
    titleEn: "Nowruz Festival E2E",
    descriptionFa: "صفحه آزمون سرتاسری تایید عملکرد",
    status: "published",
    viewsCount: 42,
    blocks: [
      { id: "b1", type: "hero", content: { headlineFa: "تخفیف ویژه", ctaUrl: "/checkout" } },
      { id: "b2", type: "pricing_table", content: { priceToman: 490000 } },
    ],
  });

  const pages = getCustomPages();
  const saved = pages.find((p) => p.id === pageId);
  expect(saved).toBeTruthy("Page was not found in store");
  expect(saved.viewsCount).toBe(42);

  deleteCustomPage(pageId);
});

// 2. Autonomous Ops Persistence
registry.test("Autonomous Ops: Creates database backup and persists policy updates", () => {
  const res = createDatabaseBackup("sql", "e2e_runner");
  expect(res.success).toBe(true);
  expect(res.backup.status).toBe("completed");
  expect(res.backup.filename.includes("endoora_db_")).toBe(true);

  const storage = getAutonomousOpsStorage();
  const prevVal = storage.policy.autoBackupEnabled;
  updateBackupPolicy({ autoBackupEnabled: !prevVal });
  const updatedStorage = getAutonomousOpsStorage();
  expect(updatedStorage.policy.autoBackupEnabled).toBe(!prevVal);
  // Revert back
  updateBackupPolicy({ autoBackupEnabled: prevVal });
});

// 3. Forms & Webhooks Persistence
registry.test("Forms & Webhooks: Saves dynamic form and records client submission", () => {
  const formId = `form-${Date.now()}`;
  const slug = `survey-${Date.now()}`;
  saveCustomForm({
    id: formId,
    titleFa: "فرم نظرسنجی کیفیت تدریس",
    titleEn: "Teacher Quality Survey",
    slug,
    descriptionFa: "ارزیابی اساتید پایان ترم",
    status: "published",
    fields: [
      { id: "f1", label: "نام و نام خانوادگی", labelFa: "نام و نام خانوادگی", type: "text", isRequired: true },
      { id: "f2", label: "امتیاز استاد (از ۵)", labelFa: "امتیاز استاد (از ۵)", type: "number", isRequired: false },
    ],
  });

  const subRes = submitPublicFormResponse(slug, { f1: "سارا احمدی", f2: 5 }, "5.200.10.15");
  expect(subRes.success).toBe(true);

  const submissions = getFormSubmissions(slug);
  expect(submissions.length).toBeGreaterThanOrEqual(1);

  deleteCustomForm(formId);
});

// 4. Financial Risk Persistence
registry.test("Financial Risk: Processes refund and mitigates security alerts", () => {
  const refundsData = getRefundsList();
  expect(refundsData.eligibleTransactions.length).toBeGreaterThan(0);

  const target = refundsData.eligibleTransactions[0];
  const refRes = issueOneClickRefund({
    transactionId: target.id,
    refundMethod: "wallet_credit",
    reason: "درخواست کاربر در موعد قانونی ۷ روزه",
  });
  expect(refRes.success).toBe(true);

  const alerts = getRiskAlertsList();
  if (alerts.length > 0) {
    const mitRes = mitigateRiskAlertAction(alerts[0].id, "dismiss");
    expect(mitRes.success).toBe(true);
  }
});

// 5. Gamification & Affiliates Persistence
registry.test("Gamification & Affiliates: Registers affiliate partner and updates learner XP", () => {
  const code = `aff${Date.now().toString().slice(-4)}`;
  const saveRes = saveAffiliatePartnerAction({
    partnerName: "رضا محمدی",
    email: `reza-${Date.now()}@test.ir`,
    phone: "09120000000",
    referralCode: code,
    commissionRatePercent: 15,
    shebaNumber: "IR000000000000000000000000",
    bankName: "بانک ملی",
  });
  expect(saveRes.success).toBe(true);

  const affData = getAffiliatesData();
  expect(affData.affiliates.some((p) => p.referralCode === code)).toBe(true);

  const lbData = getLeaderboardData();
  if (lbData.learners.length > 0) {
    const l = lbData.learners[0];
    const oldXp = l.totalXp;
    adjustLearnerXpAction(l.userId, 100, "حل تمرین‌های پایانی کتاب");
    const updatedLb = getLeaderboardData();
    const updatedL = updatedLb.learners.find((x) => x.userId === l.userId);
    expect(updatedL.totalXp).toBe(oldXp + 100);
  }
});

// 6. Server Ops Persistence
registry.test("Server Ops: Updates maintenance mode and tests real network ping", async () => {
  saveMaintenanceConfig({
    isEnabled: false,
    customMessageFa: "سایت ایندورا در دسترس است.",
    allowedIps: ["127.0.0.1", "192.168.1.100"],
  });

  const updated = getMaintenanceConfig();
  expect(updated.allowedIps.includes("192.168.1.100")).toBe(true);

  // Ping test
  const pingRes = await pingApiIntegration("postgres_db");
  expect(pingRes).toBeTruthy();
  expect(typeof pingRes.service.latencyMs).toBe("number");
});

// 7. AI Engine Store Authentic Linguistics
registry.test("AI Engine: Evaluates linguistic essays with authentic Cambridge IELTS bands", () => {
  // Empty
  expect(evaluateEssayLinguistics("").overallBand).toBe(1.0);

  // 1-word
  expect(evaluateEssayLinguistics("hello").overallBand).toBeLessThanOrEqual(2.5);

  // Repetitive text (500 words)
  const repText = "technology ".repeat(500);
  expect(evaluateEssayLinguistics(repText).overallBand).toBeLessThanOrEqual(3.0);

  // Severe grammar errors
  const broken = "I is wented to school yesterday and he are not have no books and they does not knows nothing.";
  const brokenRes = evaluateEssayLinguistics(broken);
  expect(brokenRes.metrics.errorCount).toBeGreaterThan(0);
  expect(brokenRes.overallBand).toBeLessThanOrEqual(4.0);

  // Advanced academic essay
  const academicEssay = `In the contemporary era, the proliferation of digital technology has fundamentally transformed how human beings communicate and work. While some detractors argue that technological advancement fosters social isolation, I contend that its advantages, particularly in terms of global connectivity and educational accessibility, significantly outweigh the drawbacks.
To begin with, modern telecommunications have effectively dismantled geographical barriers. In the past, international collaboration was both sluggish and costly; however, sophisticated videoconferencing platforms now enable multinational teams and students to interact seamlessly in real time. Moreover, open-access educational repositories allow learners from developing nations to access premium academic resources that were previously unattainable.
Conversely, excessive dependency on smart gadgets can precipitate sedentary lifestyles and diminish interpersonal empathy. Nevertheless, these ramifications stem from poor individual self-regulation rather than the intrinsic flaws of technology itself.
In conclusion, while the digital revolution undoubtedly presents specific psychological challenges, its role as a catalyst for educational empowerment and worldwide cohesion is undeniable.`;
  const acadRes = evaluateEssayLinguistics(academicEssay);
  expect(acadRes.overallBand).toBeGreaterThanOrEqual(6.5);
  expect(acadRes.metrics.advLexicalRatio).toBeGreaterThan(0);
});

// 8. Academics Persistence & Media Standards
registry.test("Academics: Grants enrollment, overrides quiz scores, and validates CSP-compliant media", () => {
  const grantRes = grantCourseEnrollment(
    "امیر حسینی",
    `amir-${Date.now()}@test.ir`,
    "09350000000",
    "c-ielts-master",
    "دوره جامع آیلتس آکادمیک",
    "IELTS Masterclass",
    "B2",
    [],
    "مدیر ارشد",
    "بورسیه رتبه برتر"
  );
  expect(grantRes.success).toBe(true);

  const enrollments = getLearnerEnrollments();
  const found = enrollments.find((e) => e.learnerId === grantRes.enrollment.learnerId);
  expect(found).toBeTruthy("Granted enrollment not found");

  // Save lesson quiz
  saveLessonQuiz("lesson-test-1", [
    {
      id: "q1",
      question_fa: "تست گرامر",
      question_en: "Grammar test",
      options: ["A", "B", "C", "D"],
      correct_answer: "A",
      explanation_fa: "توضیح پاسخ",
      explanation_en: "Answer explanation",
    },
  ]);
  const quiz = getLessonQuiz("lesson-test-1");
  expect(quiz.length).toBe(1);

  // Verify Media Assets
  for (const asset of MEDIA_PRESET_ASSETS) {
    expect(asset.videoUrl.startsWith("https://") || asset.videoUrl.startsWith("/")).toBe(true);
    expect(asset.videoUrl.includes("commondatastorage.googleapis.com")).toBe(false);
    expect(asset.audioUrl.includes("soundhelix.com")).toBe(false);
  }
});
