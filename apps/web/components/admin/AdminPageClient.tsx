"use client";

import React, { useEffect, useState } from "react";
import { AdminLoginGate } from "./AdminLoginGate";
import { MasterAdminConsole } from "./MasterAdminConsole";

export function AdminPageClient() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const session = localStorage.getItem("endoora_admin_session");
    if (session && session.startsWith("authenticated_")) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("endoora_admin_session");
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
      >
        در حال بررسی مجوزهای امنیتی مدیر ارشد...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginGate onLoginSuccess={handleLoginSuccess} />;
  }

  return <MasterAdminConsole onLogout={handleLogout} />;
}
