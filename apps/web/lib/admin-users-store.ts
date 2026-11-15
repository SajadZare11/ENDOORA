import fs from "fs";
import path from "path";
export * from "./admin-users-content.ts";
import {
  type AdminUser360Record,
  type UserOperationsStats,
  type CEFRLevel,
  type UserRole,
  type UserWalletTransaction,
  type WarningStrikeRecord,
  AVAILABLE_COURSES_CATALOG,
  INITIAL_USERS_360,
} from "./admin-users-content.ts";

let inMemoryUsers: AdminUser360Record[] | null = null;

function resolveStoragePath(): string {
  const candidateWeb = path.join(process.cwd(), "apps", "web", "data", "users-360.json");
  const candidateLocal = path.join(process.cwd(), "data", "users-360.json");
  if (fs.existsSync(path.dirname(candidateWeb))) {
    return candidateWeb;
  }
  return candidateLocal;
}

export function getUsers360(): AdminUser360Record[] {
  if (inMemoryUsers) {
    return inMemoryUsers;
  }

  const filePath = resolveStoragePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      inMemoryUsers = JSON.parse(raw);
      return inMemoryUsers!;
    }
  } catch (err) {
    console.warn("Could not read users-360.json from disk, seeding with initial data:", err);
  }

  inMemoryUsers = [...INITIAL_USERS_360];
  saveUsers360ToDisk(inMemoryUsers);
  return inMemoryUsers;
}

export function saveUsers360ToDisk(users: AdminUser360Record[]): boolean {
  inMemoryUsers = users;
  try {
    const filePath = resolveStoragePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.warn("Failed to write users-360.json to disk:", err);
    return false;
  }
}

export function getUser360ById(id: string): AdminUser360Record | null {
  const all = getUsers360();
  return all.find((u) => u.id === id || u.email.toLowerCase() === id.toLowerCase()) || null;
}

export function getUserOperationsStats(): UserOperationsStats {
  const all = getUsers360();
  const total = all.length;
  const learners = all.filter((u) => u.role === "learner" && u.isActive).length;
  const teachers = all.filter((u) => u.role === "teacher" && u.isTeacherVerified).length;
  const proVip = all.filter((u) => u.subscriptionTier === "pro_vip").length;
  const activeStrikes = all.filter((u) => u.warningStrikes.some((s) => s.isActive)).length;
  const totalWallet = all.reduce((sum, u) => sum + (u.walletBalanceToman || 0), 0);

  return {
    totalUsers: total,
    activeLearners: learners,
    verifiedTeachers: teachers,
    proVipSubscribers: proVip,
    usersWithActiveStrikes: activeStrikes,
    totalWalletBalancesToman: totalWallet,
  };
}

// 1. Wallet Adjustment
export function adjustUserWallet(
  userId: string,
  data: {
    amountToman: number;
    reasonCategory: "compensation" | "loyalty_gift" | "refund" | "accounting_adjustment" | "class_booking";
    adminNote: string;
    actor?: string;
  }
): { success: boolean; user?: AdminUser360Record; error?: string } {
  const all = getUsers360();
  const user = all.find((u) => u.id === userId);
  if (!user) {
    return { success: false, error: `کاربر با شناسه ${userId} یافت نشد.` };
  }

  const currentBalance = user.walletBalanceToman || 0;
  const newBalance = currentBalance + data.amountToman;

  if (newBalance < 0) {
    return { success: false, error: "موجودی کیف پول نمی‌تواند منفی شود." };
  }

  const tx: UserWalletTransaction = {
    id: `tx-${Date.now()}`,
    amountToman: data.amountToman,
    type: data.amountToman >= 0 ? "credit_manual" : "debit_manual",
    reasonCategory: data.reasonCategory,
    adminNote: data.adminNote,
    adminActor: data.actor || "مدیر ارشد ایندورا",
    balanceAfterToman: newBalance,
    createdAt: new Date().toISOString(),
  };

  user.walletBalanceToman = newBalance;
  user.walletTransactions = [tx, ...(user.walletTransactions || [])];

  saveUsers360ToDisk(all);
  return { success: true, user };
}

// 2. Issue Warning Strike with automated 3-strike escalation
export function issueWarningStrike(
  userId: string,
  data: {
    reasonPreset: string;
    detailMessage: string;
    actor?: string;
  }
): { success: boolean; user?: AdminUser360Record; strike?: WarningStrikeRecord; error?: string } {
  const all = getUsers360();
  const user = all.find((u) => u.id === userId);
  if (!user) {
    return { success: false, error: `کاربر با شناسه ${userId} یافت نشد.` };
  }

  const activeCount = user.warningStrikes.filter((s) => s.isActive).length;
  const nextStrikeNumber = Math.min(activeCount + 1, 3) as 1 | 2 | 3;

  const strike: WarningStrikeRecord = {
    id: `strk-${Date.now()}`,
    strikeNumber: nextStrikeNumber,
    reasonPreset: data.reasonPreset,
    detailMessage: data.detailMessage,
    issuedAt: new Date().toISOString(),
    issuedBy: data.actor || "مدیر ارشد ایندورا",
    isActive: true,
  };

  user.warningStrikes = [strike, ...(user.warningStrikes || [])];

  // Automated Escalation:
  if (nextStrikeNumber === 2) {
    // Freeze bookings for 7 days
    const freezeUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    user.accountRestrictions = {
      ...user.accountRestrictions,
      bookingFrozenUntil: freezeUntil,
    };
  } else if (nextStrikeNumber === 3) {
    // Auto-Ban account permanently
    user.isActive = false;
    user.accountRestrictions = {
      ...user.accountRestrictions,
      isPermanentlyBanned: true,
      banReason: `مسدودسازی خودکار بر اثر دریافت ۳ اخطار فعال انضباطی: ${data.detailMessage}`,
    };
  }

  saveUsers360ToDisk(all);
  return { success: true, user, strike };
}

// 3. Pardon Warning Strike
export function pardonWarningStrike(
  userId: string,
  strikeId: string,
  data: {
    pardonReason: string;
    actor?: string;
  }
): { success: boolean; user?: AdminUser360Record; error?: string } {
  const all = getUsers360();
  const user = all.find((u) => u.id === userId);
  if (!user) {
    return { success: false, error: `کاربر با شناسه ${userId} یافت نشد.` };
  }

  const strike = user.warningStrikes.find((s) => s.id === strikeId);
  if (!strike) {
    return { success: false, error: `اخطار با شناسه ${strikeId} یافت نشد.` };
  }

  strike.isActive = false;
  strike.pardonedAt = new Date().toISOString();
  strike.pardonedBy = data.actor || "مدیر ارشد ایندورا";
  strike.pardonReason = data.pardonReason;

  // If active strikes are now less than 3, restore account if banned due to strikes
  const remainingActive = user.warningStrikes.filter((s) => s.isActive).length;
  if (remainingActive < 3 && user.accountRestrictions?.isPermanentlyBanned) {
    user.isActive = true;
    user.accountRestrictions.isPermanentlyBanned = false;
    user.accountRestrictions.banReason = "";
  }
  if (remainingActive < 2 && user.accountRestrictions?.bookingFrozenUntil) {
    user.accountRestrictions.bookingFrozenUntil = null;
  }

  saveUsers360ToDisk(all);
  return { success: true, user };
}

// 4. Grant Course Access
export function grantUserCourse(
  userId: string,
  courseId: string,
  actor?: string
): { success: boolean; user?: AdminUser360Record; error?: string } {
  const all = getUsers360();
  const user = all.find((u) => u.id === userId);
  if (!user) {
    return { success: false, error: `کاربر با شناسه ${userId} یافت نشد.` };
  }

  if (user.enrolledCourses.some((c) => c.id === courseId)) {
    return { success: false, error: "کاربر قبلاً در این دوره ثبت‌نام کرده است." };
  }

  const catalogItem = AVAILABLE_COURSES_CATALOG.find((c) => c.id === courseId);
  if (!catalogItem) {
    return { success: false, error: `دوره با شناسه ${courseId} در کاتالوگ یافت نشد.` };
  }

  const now = new Date().toISOString();
  user.enrolledCourses.push({
    id: catalogItem.id,
    courseTitle: catalogItem.title,
    category: catalogItem.category,
    progressPercent: 0,
    completedLessons: 0,
    totalLessons: catalogItem.totalLessons,
    enrolledAt: now,
    lastAccessedAt: now,
    quizScoreAverage: 0,
    certificateEarned: false,
  });

  saveUsers360ToDisk(all);
  return { success: true, user };
}

// 5. Reset Course Quiz Attempts
export function resetUserCourseQuiz(
  userId: string,
  courseId: string
): { success: boolean; user?: AdminUser360Record; error?: string } {
  const all = getUsers360();
  const user = all.find((u) => u.id === userId);
  if (!user) {
    return { success: false, error: `کاربر با شناسه ${userId} یافت نشد.` };
  }

  const course = user.enrolledCourses.find((c) => c.id === courseId);
  if (!course) {
    return { success: false, error: "دوره مورد نظر در سوابق کاربر یافت نشد." };
  }

  course.quizScoreAverage = 0;
  saveUsers360ToDisk(all);
  return { success: true, user };
}

// 6. Update CEFR Learning Level
export function updateUserLevel(
  userId: string,
  level: CEFRLevel
): { success: boolean; user?: AdminUser360Record; error?: string } {
  const all = getUsers360();
  const user = all.find((u) => u.id === userId);
  if (!user) {
    return { success: false, error: `کاربر با شناسه ${userId} یافت نشد.` };
  }

  user.learningLevel = level;
  saveUsers360ToDisk(all);
  return { success: true, user };
}

// 7. Update User Role
export function updateUserRole(
  userId: string,
  role: UserRole
): { success: boolean; user?: AdminUser360Record; error?: string } {
  const all = getUsers360();
  const user = all.find((u) => u.id === userId);
  if (!user) {
    return { success: false, error: `کاربر با شناسه ${userId} یافت نشد.` };
  }

  user.role = role;
  saveUsers360ToDisk(all);
  return { success: true, user };
}

// 8. Toggle User Active / Banned
export function toggleUserActive(
  userId: string
): { success: boolean; user?: AdminUser360Record; error?: string } {
  const all = getUsers360();
  const user = all.find((u) => u.id === userId);
  if (!user) {
    return { success: false, error: `کاربر با شناسه ${userId} یافت نشد.` };
  }

  user.isActive = !user.isActive;
  if (!user.isActive) {
    user.accountRestrictions = {
      ...user.accountRestrictions,
      isPermanentlyBanned: true,
      banReason: "مسدودسازی دستی توسط مدیر ارشد پلتفرم.",
    };
  } else {
    user.accountRestrictions = {
      ...user.accountRestrictions,
      isPermanentlyBanned: false,
      banReason: "",
    };
  }

  saveUsers360ToDisk(all);
  return { success: true, user };
}
