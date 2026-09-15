export interface SecurityProbeResult {
  id: string;
  name: string;
  name_fa: string;
  status: "PASS" | "FAIL" | "WARN";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  details: string;
  details_fa: string;
  test_vector: string;
  defense_mechanism: string;
}

export interface SecurityScanReport {
  scan_id: string;
  score: number;
  total_probes: number;
  passed_count: number;
  failed_count: number;
  status: string;
  certification: string;
  scanned_at: string;
  duration_ms: number;
  probes: SecurityProbeResult[];
}

const mockReport: SecurityScanReport = {
  scan_id: "SEC-SCAN-90210",
  score: 100,
  total_probes: 10,
  passed_count: 10,
  failed_count: 0,
  status: "SECURE",
  certification: "SEC-003 IMPENETRABILITY VERIFIED",
  scanned_at: new Date().toISOString(),
  duration_ms: 12450,
  probes: [
    {
      id: "A01:2021",
      name: "Broken Access Control",
      name_fa: "نقص در کنترل دسترسی",
      status: "PASS",
      severity: "CRITICAL",
      details: "No unauthorized resource access possible.",
      details_fa: "هیچ دسترسی غیرمجاز به منابع امکان‌پذیر نیست. مجوزها به درستی اعمال می‌شوند.",
      test_vector: "Attempted IDOR, Path Traversal, and Privilege Escalation.",
      defense_mechanism: "RBAC Middleware & Strict Authz Checks",
    },
    {
      id: "A02:2021",
      name: "Cryptographic Failures",
      name_fa: "نقایص رمزنگاری",
      status: "PASS",
      severity: "HIGH",
      details: "All sensitive data is encrypted at rest and in transit.",
      details_fa: "تمامی داده‌های حساس در حالت استراحت و انتقال رمزنگاری شده‌اند.",
      test_vector: "Analyzed TLS configurations, hashing algorithms, and key management.",
      defense_mechanism: "AES-256-GCM & TLS 1.3 Strict",
    },
    {
      id: "A03:2021",
      name: "Injection",
      name_fa: "تزریق",
      status: "PASS",
      severity: "CRITICAL",
      details: "No SQLi, XSS, or Command Injection vectors found.",
      details_fa: "هیچ‌گونه مسیر تزریق SQL، XSS یا دستورات یافت نشد.",
      test_vector: "Fuzzed input fields with SQLi payloads, tested XSS vectors in UI.",
      defense_mechanism: "Prepared Statements & Content Security Policy (CSP)",
    },
    {
      id: "A04:2021",
      name: "Insecure Design",
      name_fa: "طراحی ناامن",
      status: "PASS",
      severity: "HIGH",
      details: "Architecture follows secure by design principles.",
      details_fa: "معماری از اصول امنیت در طراحی پیروی می‌کند.",
      test_vector: "Threat modeling analysis against current architecture.",
      defense_mechanism: "Secure Development Lifecycle (SDLC) & Threat Modeling",
    },
    {
      id: "A05:2021",
      name: "Security Misconfiguration",
      name_fa: "پیکربندی امنیتی نادرست",
      status: "PASS",
      severity: "HIGH",
      details: "Headers, cloud policies, and default accounts secured.",
      details_fa: "هدرها، سیاست‌های ابری و حساب‌های پیش‌فرض ایمن شده‌اند.",
      test_vector: "Scanned headers, default credentials, and cloud permissions.",
      defense_mechanism: "Automated Hardening & Security Headers Config",
    },
    {
      id: "A06:2021",
      name: "Vulnerable and Outdated Components",
      name_fa: "اجزای آسیب‌پذیر و منسوخ",
      status: "PASS",
      severity: "HIGH",
      details: "All dependencies are up to date and scanned.",
      details_fa: "تمامی وابستگی‌ها به‌روز بوده و اسکن شده‌اند.",
      test_vector: "Software Composition Analysis (SCA).",
      defense_mechanism: "Dependabot & Snyk Integration",
    },
    {
      id: "A07:2021",
      name: "Identification and Authentication Failures",
      name_fa: "نقایص شناسایی و احراز هویت",
      status: "PASS",
      severity: "HIGH",
      details: "MFA enforced and session management secure.",
      details_fa: "احراز هویت چندمرحله‌ای الزامی است و مدیریت نشست ایمن می‌باشد.",
      test_vector: "Brute-force testing, session fixation attempts, credential stuffing.",
      defense_mechanism: "JWT with strict expiration, Rate Limiting & MFA",
    },
    {
      id: "A08:2021",
      name: "Software and Data Integrity Failures",
      name_fa: "نقایص یکپارچگی نرم‌افزار و داده‌ها",
      status: "PASS",
      severity: "HIGH",
      details: "CI/CD pipeline and auto-updates are cryptographically signed.",
      details_fa: "خط لوله CI/CD و به‌روزرسانی‌های خودکار دارای امضای رمزنگاری هستند.",
      test_vector: "Verified signatures on updates and artifacts.",
      defense_mechanism: "Sigstore & Verified Commits",
    },
    {
      id: "A09:2021",
      name: "Security Logging and Monitoring Failures",
      name_fa: "نقایص در ثبت و نظارت امنیتی",
      status: "PASS",
      severity: "MEDIUM",
      details: "Comprehensive audit trails with real-time alerting.",
      details_fa: "مسیرهای حسابرسی جامع با هشدار در زمان واقعی.",
      test_vector: "Simulated attacks to verify log generation and alert triggering.",
      defense_mechanism: "Centralized SIEM & Audit Logging Module",
    },
    {
      id: "A10:2021",
      name: "Server-Side Request Forgery (SSRF)",
      name_fa: "جعل درخواست سمت سرور (SSRF)",
      status: "PASS",
      severity: "HIGH",
      details: "Strict validation on outbound requests and internal isolation.",
      details_fa: "اعتبارسنجی دقیق روی درخواست‌های خروجی و ایزوله‌سازی داخلی.",
      test_vector: "Attempted to access internal metadata services and private subnets.",
      defense_mechanism: "Network Policies & URL Allowlisting",
    }
  ]
};

export async function fetchSecurityScanReport(): Promise<SecurityScanReport> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockReport), 400);
  });
}

export async function triggerSecurityScan(): Promise<SecurityScanReport> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockReport), 2000);
  });
}
