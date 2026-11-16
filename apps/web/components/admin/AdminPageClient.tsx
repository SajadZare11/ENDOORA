"use client";

import React, { useEffect, useState } from "react";
import { AdminLoginGate } from "./AdminLoginGate";
import { MasterAdminConsole } from "./MasterAdminConsole";

export function AdminPageClient() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAdminSession() {
      try {
        const res = await fetch("/api/auth/me/", {
          credentials: "include",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        if (res.ok) {
          const userData = await res.json();
          if (
            userData.role === "administrator" ||
            Boolean(userData.is_staff) ||
            Boolean(userData.is_superuser)
          ) {
            setIsAuthenticated(true);
            return;
          }
        }
        setIsAuthenticated(false);
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkAdminSession();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      const csrfRes = await fetch("/api/auth/csrf/", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const csrfData = await csrfRes.json().catch(() => ({}));
      const csrfToken = csrfData.csrf_token || "";

      await fetch("/api/auth/logout/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
      });
    } catch {
      // ignore network errors on logout
    }
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          color: "#94a3b8",
          fontSize: "1rem",
        }}
        dir="rtl"
      >
        در حال بررسی مجوزهای نشست سرور مدیر ارشد...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginGate onLoginSuccess={handleLoginSuccess} />;
  }

  return <MasterAdminConsole onLogout={handleLogout} />;
}
