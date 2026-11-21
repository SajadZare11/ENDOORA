import { NextRequest } from "next/server.js";

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  is_staff: boolean;
  is_superuser: boolean;
  first_name?: string;
  last_name?: string;
}

export interface AdminAuthResult {
  authorized: boolean;
  status: number;
  error?: string;
  user?: AdminUser;
}

export async function verifyAdminSession(req: NextRequest): Promise<AdminAuthResult> {
  const cookieHeader = req.headers.get("cookie") || "";
  const sessionId =
    req.cookies.get("endoora_sessionid")?.value ||
    req.cookies.get("sessionid")?.value;

  if (!sessionId && !cookieHeader.includes("sessionid=")) {
    return {
      authorized: false,
      status: 401,
      error: "احراز هویت انجام نشده است. دسترسی به پنل مدیریت نیازمند نشست معتبر مدیر ارشد است.",
    };
  }

  // Mutating requests must have valid CSRF protection
  const method = req.method.toUpperCase();
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const csrfCookie =
      req.cookies.get("endoora_csrftoken")?.value ||
      req.cookies.get("csrftoken")?.value;
    const csrfHeader =
      req.headers.get("x-csrftoken") ||
      req.headers.get("X-CSRFToken") ||
      req.headers.get("x-csrf-token");

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      return {
        authorized: false,
        status: 403,
        error: "توکن امنیتی CSRF معتبر نیست یا ارسال نشده است.",
      };
    }
  }

  const backendUrl = (
    process.env.ENDOORA_API_INTERNAL_URL ?? "http://127.0.0.1:8000"
  ).replace(/\/+$/, "");

  try {
    const res = await fetch(`${backendUrl}/api/auth/me/`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        authorized: false,
        status: 401,
        error: "نشست کاربری نامعتبر است یا منقضی شده است.",
      };
    }

    const userData = await res.json();
    const isSuperuser = Boolean(userData.is_superuser);
    const isStaff = Boolean(userData.is_staff);
    const isAdmin = userData.role === "administrator";

    if (!isAdmin && !isStaff && !isSuperuser) {
      return {
        authorized: false,
        status: 403,
        error: "کاربر مجاز به دسترسی به پنل مدیریت نیست.",
      };
    }

    return {
      authorized: true,
      status: 200,
      user: {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        is_staff: isStaff,
        is_superuser: isSuperuser,
        first_name: userData.first_name,
        last_name: userData.last_name,
      },
    };
  } catch (err: unknown) {
    return {
      authorized: false,
      status: 503,
      error: "خطا در برقراری ارتباط با سرور اعتبارسنجی مرکزی.",
    };
  }
}
