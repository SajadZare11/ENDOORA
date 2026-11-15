export * from "./admin-users-content";
import { AdminUser360Record, INITIAL_USERS_360 } from "./admin-users-content";

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "learner" | "teacher" | "editor" | "support" | "administrator";
  isTeacherVerified: boolean;
  marketplaceEligible: boolean;
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
  learningLevel?: string;
  classesAttended?: number;
}

export const INITIAL_USERS: AdminUserRecord[] = INITIAL_USERS_360.map((u: AdminUser360Record) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  role: u.role,
  isTeacherVerified: u.isTeacherVerified,
  marketplaceEligible: u.marketplaceEligible,
  isActive: u.isActive,
  createdAt: u.createdAt,
  lastLogin: u.lastLogin,
  learningLevel: u.learningLevel,
  classesAttended: u.sessionHistory?.length || 0,
}));
