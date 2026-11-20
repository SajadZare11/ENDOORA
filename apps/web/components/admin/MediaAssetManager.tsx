"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./media-asset-manager.module.css";

export interface MediaAssetItem {
  id: string;
  title: string;
  url: string;
  fileType: string;
  fileSizeBytes: number;
  uploadedBy?: string;
  createdAt?: string;
}

interface MediaAssetManagerProps {
  onSelectAsset?: (url: string) => void;
  selectionMode?: boolean;
}

export function MediaAssetManager({ onSelectAsset, selectionMode = false }: MediaAssetManagerProps) {
  const [assets, setAssets] = useState<MediaAssetItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const q = encodeURIComponent(search);
      const res = await fetch(`/api/admin/media?q=${q}`);
      if (res.ok) {
        const data = await res.json();
        if (data.assets) {
          setAssets(data.assets);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch media assets:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [search]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);

    setIsUploading(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.asset) {
          setAssets((prev) => [data.asset, ...prev]);
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("آیا از حذف این فایل اطمینان دارید؟")) return;

    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAssets((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleCopyUrl = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopyFeedback(url);
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h2>🖼️ استودیو و گالری رسانه‌های سایت (Media Manager)</h2>
          <p>بارگذاری مستقیم تصاویر، لوگوها و بنرهای تبلیغاتی با قابلیت تولید لینک مستقیم</p>
        </div>
      </div>

      <div
        className={styles.dropzone}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileUpload(e.dataTransfer.files);
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.svg,.webp"
          className={styles.fileInput}
          onChange={(e) => handleFileUpload(e.target.files)}
        />
        <div className={styles.dropzoneIcon}>{isUploading ? "⏳" : "📤"}</div>
        <div className={styles.dropzoneTitle}>
          {isUploading ? "در حال آپلود و بهینه‌سازی فایل..." : "برای آپلود تصویر کلیک کنید یا فایل را اینجا رها کنید"}
        </div>
        <div className={styles.dropzoneSubtitle}>پشتیبانی از PNG, JPG, WebP, SVG تا سقف ۱۰ مگابایت</div>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="🔍 جستجو در نام فایل‌ها و پسوندها..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>در حال دریافت گالری تصاویر...</div>
      ) : assets.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📁</div>
          <p>هنوز تصویری بارگذاری نشده است. اولین فایل خود را با کشیدن و رها کردن در کادر بالا اضافه کنید.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {assets.map((asset) => (
            <div
              key={asset.id}
              className={styles.card}
              onClick={() => onSelectAsset && onSelectAsset(asset.url)}
              style={{ cursor: selectionMode ? "pointer" : "default" }}
            >
              <div className={styles.cardImageWrapper}>
                {asset.url ? (
                  <img src={asset.url} alt={asset.title} className={styles.cardImage} />
                ) : (
                  <div className={styles.cardPlaceholder}>🖼️</div>
                )}
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardTitle} title={asset.title}>
                  {asset.title}
                </div>
                <div className={styles.cardMeta}>
                  <span>{formatSize(asset.fileSizeBytes)}</span>
                  <span>{asset.fileType.split("/")[1]?.toUpperCase() || "IMG"}</span>
                </div>
                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={styles.btnCopy}
                    onClick={(e) => handleCopyUrl(asset.url, e)}
                  >
                    <span>{copyFeedback === asset.url ? "✅ کپی شد" : "📋 کپی لینک"}</span>
                  </button>
                  {selectionMode && (
                    <button
                      type="button"
                      className={styles.btnCopy}
                      style={{ background: "#4f46e5", color: "#ffffff", borderColor: "#4f46e5" }}
                      onClick={() => onSelectAsset && onSelectAsset(asset.url)}
                    >
                      انتخاب
                    </button>
                  )}
                  <button
                    type="button"
                    className={styles.btnDelete}
                    onClick={(e) => handleDelete(asset.id, e)}
                    title="حذف فایل"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
