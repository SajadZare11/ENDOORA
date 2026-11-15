import fs from "fs";
import path from "path";
export * from "./site-cms-content";
import { SiteContentData, SiteContentVersionRecord, DEFAULT_SITE_CONTENT } from "./site-cms-content";

// In-memory cache for fast runtime access with disk sync fallback
let inMemoryLiveContent: SiteContentData | null = null;
let inMemoryDraftContent: SiteContentData | null = null;
let inMemoryVersions: SiteContentVersionRecord[] = [];

function getStorageFilePath(): string {
  return path.join(process.cwd(), "data", "site-content.json");
}

function getVersionsFilePath(): string {
  return path.join(process.cwd(), "data", "site-content-versions.json");
}

function getDraftFilePath(): string {
  return path.join(process.cwd(), "data", "site-content-draft.json");
}

export function getLiveSiteContent(): SiteContentData {
  if (inMemoryLiveContent) {
    return inMemoryLiveContent;
  }

  const filePath = getStorageFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      inMemoryLiveContent = JSON.parse(raw);
      return inMemoryLiveContent!;
    }
  } catch (err) {
    console.warn("Could not read site-content.json from disk, using DEFAULT_SITE_CONTENT:", err);
  }

  inMemoryLiveContent = { ...DEFAULT_SITE_CONTENT };
  return inMemoryLiveContent;
}

export function getDraftSiteContent(): SiteContentData | null {
  if (inMemoryDraftContent) {
    return inMemoryDraftContent;
  }

  const draftPath = getDraftFilePath();
  try {
    if (fs.existsSync(draftPath)) {
      const raw = fs.readFileSync(draftPath, "utf-8");
      inMemoryDraftContent = JSON.parse(raw);
      return inMemoryDraftContent;
    }
  } catch {
    // Draft does not exist or invalid
  }

  return null;
}

export function saveDraftSiteContent(data: SiteContentData, user: string = "مدیر ارشد"): { success: boolean; draft: SiteContentData } {
  const updatedDraft: SiteContentData = {
    ...data,
    lastUpdated: new Date().toISOString(),
    updatedBy: user,
  };

  inMemoryDraftContent = updatedDraft;

  try {
    const draftPath = getDraftFilePath();
    const dir = path.dirname(draftPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(draftPath, JSON.stringify(updatedDraft, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to write draft to disk, keeping in memory:", err);
  }

  return { success: true, draft: updatedDraft };
}

export function publishDraftSiteContent(user: string = "مدیر ارشد", summary: string = "انتشار تغییرات جدید"): { success: boolean; published: SiteContentData } {
  const contentToPublish = inMemoryDraftContent || getDraftSiteContent() || getLiveSiteContent();
  const currentLive = getLiveSiteContent();

  const newVersion = (currentLive.version || 1) + 1;
  const publishedData: SiteContentData = {
    ...contentToPublish,
    version: newVersion,
    lastUpdated: new Date().toISOString(),
    updatedBy: user,
  };

  // Archive current version to versions history
  const history = getSiteContentVersions();
  const historyRecord: SiteContentVersionRecord = {
    version: currentLive.version,
    savedAt: currentLive.lastUpdated || new Date().toISOString(),
    savedBy: currentLive.updatedBy || user,
    changeSummary: summary,
    data: currentLive,
  };

  const updatedHistory = [historyRecord, ...history].slice(0, 20); // Keep last 20 versions

  inMemoryLiveContent = publishedData;
  inMemoryDraftContent = null;
  inMemoryVersions = updatedHistory;

  try {
    const storagePath = getStorageFilePath();
    const versionsPath = getVersionsFilePath();
    const draftPath = getDraftFilePath();

    const dir = path.dirname(storagePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(storagePath, JSON.stringify(publishedData, null, 2), "utf-8");
    fs.writeFileSync(versionsPath, JSON.stringify(updatedHistory, null, 2), "utf-8");
    if (fs.existsSync(draftPath)) {
      fs.unlinkSync(draftPath);
    }
  } catch (err) {
    console.warn("Failed to write published content to disk, keeping in memory:", err);
  }

  return { success: true, published: publishedData };
}

export function rollbackSiteContentVersion(targetVersion: number, user: string = "مدیر ارشد"): { success: boolean; rolledBackTo: SiteContentData } {
  const history = getSiteContentVersions();
  const targetRecord = history.find((h) => h.version === targetVersion);

  if (!targetRecord) {
    throw new Error(`نسخه شماره ${targetVersion} در تاریخچه سیستم یافت نشد.`);
  }

  const currentLive = getLiveSiteContent();
  const newVersion = currentLive.version + 1;
  const rolledBackData: SiteContentData = {
    ...targetRecord.data,
    version: newVersion,
    lastUpdated: new Date().toISOString(),
    updatedBy: `${user} (بازگشت از نسخه ${targetVersion})`,
  };

  const historyRecord: SiteContentVersionRecord = {
    version: currentLive.version,
    savedAt: currentLive.lastUpdated,
    savedBy: currentLive.updatedBy,
    changeSummary: `قبل از بازگشت به نسخه ${targetVersion}`,
    data: currentLive,
  };

  const updatedHistory = [historyRecord, ...history].slice(0, 20);

  inMemoryLiveContent = rolledBackData;
  inMemoryDraftContent = null;
  inMemoryVersions = updatedHistory;

  try {
    const storagePath = getStorageFilePath();
    const versionsPath = getVersionsFilePath();
    fs.writeFileSync(storagePath, JSON.stringify(rolledBackData, null, 2), "utf-8");
    fs.writeFileSync(versionsPath, JSON.stringify(updatedHistory, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to persist rollback to disk:", err);
  }

  return { success: true, rolledBackTo: rolledBackData };
}

export function discardDraftSiteContent(): { success: boolean } {
  inMemoryDraftContent = null;
  try {
    const draftPath = getDraftFilePath();
    if (fs.existsSync(draftPath)) {
      fs.unlinkSync(draftPath);
    }
  } catch (err) {
    console.warn("Could not remove draft file:", err);
  }
  return { success: true };
}

export function getSiteContentVersions(): SiteContentVersionRecord[] {
  if (inMemoryVersions.length > 0) {
    return inMemoryVersions;
  }

  const versionsPath = getVersionsFilePath();
  try {
    if (fs.existsSync(versionsPath)) {
      const raw = fs.readFileSync(versionsPath, "utf-8");
      inMemoryVersions = JSON.parse(raw);
      return inMemoryVersions;
    }
  } catch {
    // No versions yet
  }

  return [];
}
