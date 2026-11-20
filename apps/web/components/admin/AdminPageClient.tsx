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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8fafc",
          color: "#475569",
          fontSize: "1rem",
          gap: "1rem",
        }}
        dir="rtl"
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "3px solid #e2e8f0",
            borderTopColor: "#4f46e5",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <span style={{ fontWeight: 700, color: "#1e293b" }}>
          در حال بررسی دسترسی مدیریت... لطفاً شکیبا باشید ✨
        </span>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginGate onLoginSuccess={handleLoginSuccess} />;
  }

  return <MasterAdminConsole onLogout={handleLogout} />;
}
