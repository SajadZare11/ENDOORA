"use client";

import { useEffect, useState } from "react";
import { DEFAULT_SITE_CONTENT, type SiteContentData } from "./site-cms-content";

let cachedLiveContent: SiteContentData | null = null;
let listeners: Array<(data: SiteContentData) => void> = [];

export function useSiteContent() {
  const [content, setContent] = useState<SiteContentData>(cachedLiveContent || DEFAULT_SITE_CONTENT);
  const [isLoading, setIsLoading] = useState<boolean>(() => !cachedLiveContent);

  useEffect(() => {
    let isMounted = true;

    const handleUpdate = (data: SiteContentData) => {
      if (isMounted) setContent(data);
    };
    listeners.push(handleUpdate);

    async function loadContent() {
      try {
        const res = await fetch("/api/site-content");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.content) {
            cachedLiveContent = json.content;
            if (isMounted) {
              setContent(json.content);
              listeners.forEach((cb) => cb(json.content));
            }
          }
        }
      } catch (err) {
        console.warn("Could not fetch dynamic site content, using fallback:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    if (!cachedLiveContent) {
      loadContent();
    }

    return () => {
      isMounted = false;
      listeners = listeners.filter((cb) => cb !== handleUpdate);
    };
  }, []);

  return { content, isLoading };
}
