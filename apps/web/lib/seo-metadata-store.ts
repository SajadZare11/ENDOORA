import fs from "fs";
import path from "path";
export * from "./seo-metadata-content.ts";
import {
  type PageSeoMetadata,
  type UrlRedirectRule,
  type SchemaJsonLdItem,
  type SeoStudioStats,
  type RedirectType,
  INITIAL_PAGE_METAS,
  INITIAL_REDIRECT_RULES,
  INITIAL_SCHEMAS,
} from "./seo-metadata-content.ts";

interface SeoStoragePayload {
  pages: PageSeoMetadata[];
  redirects: UrlRedirectRule[];
  schemas: SchemaJsonLdItem[];
}

let inMemorySeo: SeoStoragePayload | null = null;

function resolveStoragePath(): string {
  const candidateWeb = path.join(
    process.cwd(),
    "apps",
    "web",
    "data",
    "seo-metadata-operations.json"
  );
  const candidateLocal = path.join(
    process.cwd(),
    "data",
    "seo-metadata-operations.json"
  );
  if (fs.existsSync(path.dirname(candidateWeb))) {
    return candidateWeb;
  }
  return candidateLocal;
}

function persistToDisk(): void {
  if (!inMemorySeo) return;
  try {
    const filePath = resolveStoragePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(inMemorySeo, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not persist SEO operations data to disk:", err);
  }
}

export function getSeoMetadataStorage(): SeoStoragePayload {
  if (inMemorySeo) {
    return inMemorySeo;
  }

  const filePath = resolveStoragePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      inMemorySeo = JSON.parse(raw);
      return inMemorySeo!;
    }
  } catch (err) {
    console.warn("Could not read seo-metadata-operations.json, seeding initial data:", err);
  }

  inMemorySeo = {
    pages: [...INITIAL_PAGE_METAS],
    redirects: [...INITIAL_REDIRECT_RULES],
    schemas: [...INITIAL_SCHEMAS],
  };

  persistToDisk();
  return inMemorySeo;
}

export function getSeoStudioStats(): SeoStudioStats {
  const storage = getSeoMetadataStorage();
  const activeRedirects = storage.redirects.filter((r) => r.isActive);
  const totalHits = storage.redirects.reduce((sum, r) => sum + r.hitCount, 0);

  const avgTitle =
    storage.pages.length > 0
      ? Math.round(
          storage.pages.reduce((sum, p) => sum + p.metaTitle.length, 0) / storage.pages.length
        )
      : 0;

  const avgDesc =
    storage.pages.length > 0
      ? Math.round(
          storage.pages.reduce((sum, p) => sum + p.metaDescription.length, 0) / storage.pages.length
        )
      : 0;

  return {
    totalPagesConfigured: storage.pages.length,
    totalActiveRedirects: activeRedirects.length,
    totalRedirectHits: totalHits,
    totalSchemasGenerated: storage.schemas.length,
    avgTitleLength: avgTitle,
    avgDescLength: avgDesc,
  };
}

export function getSeoMetadataData() {
  const storage = getSeoMetadataStorage();
  const stats = getSeoStudioStats();
  return {
    pages: storage.pages,
    redirects: storage.redirects,
    schemas: storage.schemas,
    stats,
  };
}

export function updatePageSeoMetadata(
  pagePath: string,
  updates: Partial<PageSeoMetadata>,
  updatedBy: string = "مدیر ارشد سئو"
): ({ success: true; page: PageSeoMetadata; message: string } | { success: false; page: null; message: string }) {
  const storage = getSeoMetadataStorage();
  const page = storage.pages.find((p) => p.pagePath === pagePath);

  if (!page) {
    return { success: false, page: null, message: "صفحه مورد نظر یافت نشد." };
  }

  Object.assign(page, updates, {
    updatedAt: new Date().toISOString(),
    updatedBy,
  });

  persistToDisk();
  return { success: true, page, message: `متادیتای سئو برای مسیر "${pagePath}" با موفقیت ذخیره گردید.` };
}

export function createRedirectRule(params: {
  sourcePath: string;
  destinationPath: string;
  redirectType?: RedirectType;
  notes?: string;
}): ({ success: true; rule: UrlRedirectRule; error?: string } | { success: false; rule: null; error?: string }) {
  const storage = getSeoMetadataStorage();
  let src = params.sourcePath.trim();
  let dest = params.destinationPath.trim();

  if (!src.startsWith("/")) src = "/" + src;
  if (!dest.startsWith("/")) dest = "/" + dest;

  // 1. Loop detection check: Self-reference
  if (src === dest) {
    return {
      success: false,
      rule: null,
      error: "مسیر مبدا و مقصد نمی‌توانند یکسان باشند (ایجاد حلقه بی‌پایان).",
    };
  }

  // 2. Loop detection check: 2-step circular redirect (dest -> src exists)
  const circularRule = storage.redirects.find(
    (r) => r.sourcePath === dest && r.destinationPath === src && r.isActive
  );
  if (circularRule) {
    return {
      success: false,
      rule: null,
      error: `این تغییر مسیر باعث ایجاد یک حلقه متقابل با قاعده موجود (${dest} ← ${src}) خواهد شد.`,
    };
  }

  const existingRule = storage.redirects.find((r) => r.sourcePath === src);
  if (existingRule) {
    existingRule.destinationPath = dest;
    existingRule.redirectType = params.redirectType || "301_permanent";
    existingRule.notes = params.notes || existingRule.notes;
    existingRule.isActive = true;
    persistToDisk();
    return { success: true, rule: existingRule };
  }

  const newRule: UrlRedirectRule = {
    id: `redir-${Date.now()}`,
    sourcePath: src,
    destinationPath: dest,
    redirectType: params.redirectType || "301_permanent",
    isActive: true,
    hitCount: 0,
    notes: params.notes || "",
    createdAt: new Date().toISOString(),
  };

  storage.redirects.unshift(newRule);
  persistToDisk();
  return { success: true, rule: newRule };
}

export function toggleRedirectRule(
  ruleId: string,
  isActive: boolean
): { success: boolean; rule?: UrlRedirectRule; message: string } {
  const storage = getSeoMetadataStorage();
  const rule = storage.redirects.find((r) => r.id === ruleId);

  if (!rule) {
    return { success: false, message: "قاعده ریدایرکت یافت نشد." };
  }

  rule.isActive = isActive;
  persistToDisk();
  return {
    success: true,
    rule,
    message: `وضعیت ریدایرکت ${rule.sourcePath} به ${isActive ? "فعال" : "غیرفعال"} تغییر یافت.`,
  };
}

export function deleteRedirectRule(ruleId: string): { success: boolean; message: string } {
  const storage = getSeoMetadataStorage();
  const initLen = storage.redirects.length;
  storage.redirects = storage.redirects.filter((r) => r.id !== ruleId);

  if (storage.redirects.length < initLen) {
    persistToDisk();
    return { success: true, message: "قاعده ریدایرکت با موفقیت حذف گردید." };
  }
  return { success: false, message: "قاعده مورد نظر یافت نشد." };
}

export function updateSchemaJsonLd(
  schemaId: string,
  jsonLdPayload: Record<string, unknown>
): { success: boolean; schema?: SchemaJsonLdItem; message: string } {
  const storage = getSeoMetadataStorage();
  const schema = storage.schemas.find((s) => s.id === schemaId);

  if (!schema) {
    return { success: false, message: "اسکیمای مورد نظر یافت نشد." };
  }

  schema.jsonLdPayload = jsonLdPayload;
  schema.updatedAt = new Date().toISOString();
  persistToDisk();

  return { success: true, schema, message: "کد اسکیما با موفقیت ذخیره و به‌روزرسانی شد." };
}

export function resetSeoMetadataDataToInitial(): void {
  inMemorySeo = {
    pages: JSON.parse(JSON.stringify(INITIAL_PAGE_METAS)),
    redirects: JSON.parse(JSON.stringify(INITIAL_REDIRECT_RULES)),
    schemas: JSON.parse(JSON.stringify(INITIAL_SCHEMAS)),
  };
  persistToDisk();
}
