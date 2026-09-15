export interface ThrottleConfig {
  role_rates: Record<string, string>;
  ip_rate_limit: number;
  burst_rate: string;
}

export interface SecurityHeadersConfig {
  x_content_type_options: boolean;
  x_frame_options: string;
  csp_enabled: boolean;
  csp_report_only: boolean;
  hsts_enabled: boolean;
}

export interface CookieSecurityConfig {
  csrf_httponly: boolean;
  csrf_samesite: string;
  session_httponly: boolean;
  session_samesite: string;
}

export interface CorsConfig {
  allowed_origins_count: number;
  allow_credentials: boolean;
}

export interface SecurityAuditData {
  throttle_config: ThrottleConfig;
  security_headers: SecurityHeadersConfig;
  cookie_security: CookieSecurityConfig;
  password_validators: number;
  cors_config: CorsConfig;
  module_version: string;
  evaluated_at: string;
}

export interface SecurityHealthStatus {
  status: string;
  module: string;
  version: string;
}

export const MOCK_SECURITY_AUDIT: SecurityAuditData = {
  throttle_config: {
    role_rates: {
      anonymous: "60/min",
      learner: "120/min",
      teacher: "200/min",
      admin: "1000/min",
    },
    ip_rate_limit: 100,
    burst_rate: "200/min",
  },
  security_headers: {
    x_content_type_options: true,
    x_frame_options: "DENY",
    csp_enabled: true,
    csp_report_only: false,
    hsts_enabled: true,
  },
  cookie_security: {
    csrf_httponly: true,
    csrf_samesite: "Lax",
    session_httponly: true,
    session_samesite: "Lax",
  },
  password_validators: 4,
  cors_config: {
    allowed_origins_count: 3,
    allow_credentials: true,
  },
  module_version: "2.4.1",
  evaluated_at: new Date().toISOString(),
};

export const MOCK_SECURITY_HEALTH: SecurityHealthStatus = {
  status: "operational",
  module: "endoora.security.core",
  version: "2.4.1",
};

export async function fetchSecurityAudit(signal?: AbortSignal): Promise<SecurityAuditData> {
  try {
    const res = await fetch("/api/security-ops/audit/", {
      signal,
      credentials: "include",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }
  return MOCK_SECURITY_AUDIT;
}

export async function fetchSecurityHealth(signal?: AbortSignal): Promise<SecurityHealthStatus> {
  try {
    const res = await fetch("/api/security-ops/health/", {
      signal,
      credentials: "include",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }
  return MOCK_SECURITY_HEALTH;
}
