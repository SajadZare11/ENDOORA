"use client";

import type { ReactNode } from "react";
import { Dialog } from "./Dialog";
import { Button } from "./Button";
import { Badge } from "./Card";

export type RoadmapMilestoneModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureTitle: string;
  milestoneDay?: number | string;
  description?: string;
  benefits?: string[];
  ctaLabel?: string;
  onConfirmInterest?: () => void;
};

export function RoadmapMilestoneModal({
  open,
  onOpenChange,
  featureTitle,
  milestoneDay = "51+",
  description,
  benefits = [
    "تحت پیاده‌سازی طبق نقشه راه محصول Endoora",
    "تضمین پایداری، امنیت و انطباق با نیاز زبان‌آموزان ایرانی",
    "اطلاع‌رسانی خودکار به محض فعال‌سازی در نسخه آزمایشی",
  ],
  ctaLabel = "متوجه شدم",
  onConfirmInterest,
}: RoadmapMilestoneModalProps) {
  const milestoneText = typeof milestoneDay === "number" ? `روز ${milestoneDay}` : `روزهای ${milestoneDay}`;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={featureTitle}
      description={`این قابلیت در برنامه توسعه ${milestoneText} قرار دارد.`}
      closeLabel="بستن پنجره"
      footer={
        <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "flex-end", width: "100%" }}>
          {onConfirmInterest && (
            <Button
              variant="secondary"
              onClick={() => {
                onConfirmInterest();
                onOpenChange(false);
              }}
            >
              علاقه‌مند به دریافت نسخه آزمایشی
            </Button>
          )}
          <Button variant="primary" onClick={() => onOpenChange(false)}>
            {ctaLabel}
          </Button>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <Badge tone="info">نقشه راه {milestoneText}</Badge>
          <Badge tone="neutral">در حال توسعه</Badge>
        </div>

        <p style={{ margin: 0, color: "var(--color-text)", fontSize: "var(--font-size-body)", lineHeight: "var(--line-height-body-persian)" }}>
          {description ||
            `قابلیت «${featureTitle}» طبق نقشه راه ۵۰+ روزه ایندورا برای مرحله بعد از نسخه بتای کنترل‌شده طراحی شده و هم‌اکنون معماری زیرساخت آن در حال آماده‌سازی است.`}
        </p>

        {benefits && benefits.length > 0 && (
          <ul
            style={{
              margin: 0,
              paddingInlineStart: "var(--space-5)",
              color: "var(--color-muted)",
              fontSize: "var(--font-size-meta)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)",
            }}
          >
            {benefits.map((b, idx) => (
              <li key={idx}>{b}</li>
            ))}
          </ul>
        )}
      </div>
    </Dialog>
  );
}
