import { isIPv4, isIPv6 } from "net";
import dns from "dns/promises";

export interface SSRFCheckResult {
  isSafe: boolean;
  error?: string;
  url?: URL;
  resolvedIp?: string;
}

/**
 * Checks whether an IPv4 or IPv6 string represents a loopback, private,
 * link-local, multicast, or cloud metadata address.
 */
export function isPrivateOrReservedIp(ip: string): boolean {
  let cleanIp = ip.trim().toLowerCase();

  // Normalize IPv4-mapped IPv6 (e.g. ::ffff:127.0.0.1)
  if (cleanIp.startsWith("::ffff:")) {
    cleanIp = cleanIp.slice(7);
  }

  // IPv4 Check
  if (isIPv4(cleanIp)) {
    const parts = cleanIp.split(".").map(Number);
    const [b0, b1, b2, b3] = parts;

    // 0.0.0.0/8 (Current network)
    if (b0 === 0) return true;

    // 10.0.0.0/8 (Private RFC 1918)
    if (b0 === 10) return true;

    // 100.64.0.0/10 (Carrier-Grade NAT / Shared Space RFC 6598)
    if (b0 === 100 && b1 >= 64 && b1 <= 127) return true;

    // 127.0.0.0/8 (Loopback)
    if (b0 === 127) return true;

    // 169.254.0.0/16 (Link-local & AWS/Cloud IMDS 169.254.169.254)
    if (b0 === 169 && b1 === 254) return true;

    // 172.16.0.0/12 (Private RFC 1918: 172.16.0.0 - 172.31.255.255)
    if (b0 === 172 && b1 >= 16 && b1 <= 31) return true;

    // 192.0.0.0/24 (IETF Protocol Assignments)
    if (b0 === 192 && b1 === 0 && b2 === 0) return true;

    // 192.0.2.0/24 (TEST-NET-1)
    if (b0 === 192 && b1 === 0 && b2 === 2) return true;

    // 192.88.99.0/24 (6to4 Relay Anycast)
    if (b0 === 192 && b1 === 88 && b2 === 99) return true;

    // 192.168.0.0/16 (Private RFC 1918)
    if (b0 === 192 && b1 === 168) return true;

    // 198.18.0.0/15 (Network Benchmark Tests)
    if (b0 === 198 && (b1 === 18 || b1 === 19)) return true;

    // 198.51.100.0/24 (TEST-NET-2)
    if (b0 === 198 && b1 === 51 && b2 === 100) return true;

    // 203.0.113.0/24 (TEST-NET-3)
    if (b0 === 203 && b1 === 0 && b2 === 113) return true;

    // 224.0.0.0/4 (Multicast)
    if (b0 >= 224 && b0 <= 239) return true;

    // 240.0.0.0/4 (Reserved / Broadcast)
    if (b0 >= 240) return true;

    return false;
  }

  // IPv6 Check
  if (isIPv6(cleanIp)) {
    // ::1 (Loopback)
    if (cleanIp === "::1" || cleanIp === "0:0:0:0:0:0:0:1") return true;

    // :: (Unspecified)
    if (cleanIp === "::" || cleanIp === "0:0:0:0:0:0:0:0") return true;

    // fe80::/10 (Link-local)
    if (/^fe[89ab]/i.test(cleanIp)) return true;

    // fc00::/7 (Unique Local Address / ULA)
    if (/^f[cd]/i.test(cleanIp)) return true;

    // ff00::/8 (Multicast)
    if (/^ff/i.test(cleanIp)) return true;

    // 2001:db8::/32 (Documentation)
    if (cleanIp.startsWith("2001:db8:") || cleanIp.startsWith("2001:0db8:")) return true;

    // Discard prefix 100::/64
    if (cleanIp.startsWith("100:")) return true;

    return false;
  }

  // Reject unrecognized IP formats
  return true;
}

/**
 * Validates a webhook URL against SSRF vulnerabilities including DNS resolution.
 */
export async function validateWebhookUrl(rawUrl: string): Promise<SSRFCheckResult> {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { isSafe: false, error: "آدرس وب‌هوک الزامی است." };
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return { isSafe: false, error: "ساختار آدرس اینترنتی (URL) نامعتبر است." };
  }

  // 1. Enforce http / https scheme only
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { isSafe: false, error: "تنها پروتکل‌های مجاز http و https می‌باشند." };
  }

  // 2. Reject credentials in URL
  if (parsed.username || parsed.password) {
    return { isSafe: false, error: "درج نام کاربری یا کلمه عبور در آدرس اینترنتی مجاز نیست." };
  }

  // 3. Port restrictions
  const port = parsed.port ? parseInt(parsed.port, 10) : (parsed.protocol === "https:" ? 443 : 80);
  const forbiddenPorts = [21, 22, 23, 25, 53, 110, 111, 135, 137, 138, 139, 143, 445, 1433, 1521, 2049, 3306, 3389, 5432, 5900, 6379, 8000, 9200, 11211, 27017];
  if (forbiddenPorts.includes(port)) {
    return { isSafe: false, error: `پورت ${port} به دلایل امنیتی مسدود است.` };
  }

  const hostname = parsed.hostname.toLowerCase().trim();

  // 4. Forbidden internal hostnames
  const forbiddenHostnames = [
    "localhost",
    "ip6-localhost",
    "ip6-loopback",
    "metadata.google.internal",
    "instance-data",
  ];
  if (
    forbiddenHostnames.includes(hostname) ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname.endsWith(".lan")
  ) {
    return { isSafe: false, error: "ارسال درخواست به دامنه‌های لوکال یا شبکه داخلی مجاز نیست." };
  }

  // 5. Hostname is a raw IP literal
  if (isIPv4(hostname) || isIPv6(hostname)) {
    if (isPrivateOrReservedIp(hostname)) {
      return {
        isSafe: false,
        error: "ارسال وب‌هوک به آدرس‌های IP خصوصی، لوکال (Localhost) یا متادیتا سرور ابری مجاز نمی‌باشد.",
      };
    }
    return { isSafe: true, url: parsed, resolvedIp: hostname };
  }

  // 6. Authoritative DNS resolution to prevent DNS rebinding
  try {
    const records = await dns.lookup(hostname, { all: true });
    if (!records || records.length === 0) {
      return { isSafe: false, error: "دامنه وب‌هوک قابل تحلیل (DNS Resolve) نمی‌باشد." };
    }

    for (const record of records) {
      if (isPrivateOrReservedIp(record.address)) {
        return {
          isSafe: false,
          error: `دامنه به یک آدرس IP خصوصی یا نامعتبر (${record.address}) اشاره دارد که به دلایل امنیتی مسدود است.`,
        };
      }
    }

    return { isSafe: true, url: parsed, resolvedIp: records[0].address };
  } catch (dnsErr: any) {
    return {
      isSafe: false,
      error: `خطا در تحلیل دی‌ان‌اس دامنه: ${dnsErr?.message || "دامنه یافت نشد"}`,
    };
  }
}
