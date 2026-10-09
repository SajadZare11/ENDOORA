# Project: Endoora English Skills Hub & 6 Skill Detail Pages Redesign

## Architecture
- **Application Target**: `apps/web` (Next.js 16 App Router, React 19, monorepo with `@endoora/ui` and `@endoora/contracts`).
- **Data Layer**:
  - `apps/web/data/skills/skills-content.ts`: Single source of truth containing strongly typed datasets for all 6 skills (`listening`, `speaking`, `reading`, `writing`, `vocabulary`, `grammar`). Contains production-grade practical content across the 4 pillars without any placeholders.
- **Component Layer (`apps/web/components/skills/`)**:
  - `SkillHeroSection.tsx`: Friendly hero section with CEFR badge, energetic catchphrase, and quick anchor navigation.
  - `SkillQuickToolkit.tsx`: Golden phrases, practical idioms, pronunciation tips, and copy actions.
  - `SkillMiniPractice.tsx`: Client-side interactive practice engine replicating the proven "تمرین تا ۲۰" feedback loop (instant green/red button feedback, dashed revealed answer border, and expandable pedagogical explanation accordion).
  - `SkillL1FixesSection.tsx`: Detailed side-by-side (❌ vs ✅) Persian learner traps with sympathetic explanations.
  - `SkillActionPlanSection.tsx`: 3-tier actionable roadmap from beginner to advanced with daily routines and links to Endoora tools.
  - `SkillRelatedLinks.tsx`: Navigation bridges to other relevant sections.
  - `skills-components.module.css`: Fully tokenized CSS module adhering to CSS logical properties for RTL layout.
- **Page / Routing Layer**:
  - `apps/web/app/(public)/skills/page.tsx`: Rewritten with colloquial Persian tone, visual roadmap for the 6 core skills, and dedicated spotlight banners for "تمرین تا ۲۰ (زبان دوازدهم)" and "Small Talk (فرهنگ و روابط اجتماعی)".
  - `apps/web/app/(public)/skills/skills.module.css`: Updated modular styling for the hub and spotlights.
  - `apps/web/app/(public)/skills/[skill]/page.tsx`: Server Component rendering the 4 practical pillars using `generateStaticParams()` for all 6 skills.
- **Verification & Testing Layer**:
  - `scripts/check-skills-revamp.mjs`: Node ESM automated verification script checking route generation, content non-emptiness, interactive question data integrity, option validity, and link resolution.
  - Registered script in `package.json`: `"check:skills"`.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Colloquial Hub Copywriting | Rewrite `/skills` hero, banners, and descriptions with warm, energetic, friendly Persian tone ("خودمونی و پرانرژی") | M2 | R1 §69 |
| 2 | 6 Core Skills Visual Roadmap | Interactive and modern cards on `/skills` for Listening, Speaking, Reading, Writing, Vocabulary, and Grammar | M2 | R1 §70 |
| 3 | Spotlight for "تمرین تا ۲۰" | Prominent gradient spotlight card linking directly to `/high-school/grade-12/tamrin20` with key stats | M2 | R1 §77 |
| 4 | Spotlight for "Small Talk" | Prominent card for cultural communication & ice-breaking linking to `/skills/culture` | M2 | R1 §77 |
| 5 | Strongly Typed Skills Data Contract | Types for `SkillPageData`, `QuickToolItem`, `MiniPracticeQuestion`, `PersianL1Fix`, `ActionPlanMilestone` | M1 | R2 §81 |
| 6 | 6 Skills Rich Practical Datasets | Complete, non-empty, production-grade content for all 6 skills in `apps/web/data/skills/skills-content.ts` | M1 | R2 §80 |
| 7 | Pillar 1: Quick Toolkit | Real-world ready phrases with Persian contexts and pronunciation cues | M1 | R2 §82 |
| 8 | Pillar 2: Interactive Mini-Practice Engine | Instant green/red feedback, auto-revealed answers, and collapsible pedagogical explanations | M1 | R2 §83 |
| 9 | Pillar 3: L1 Fixes (چالش‌های ما فارسی‌زبان‌ها) | Common Iranian English errors with sympathetic breakdown, root cause, and fixes | M1 | R2 §84 |
| 10 | Pillar 4: Action Plan (نقشه راه تسلط) | Step-by-step practical roadmap from A1-A2 to C1-C2 with daily routines | M1 | R2 §85 |
| 11 | Skill Detail Page Rendering | Integration of components and datasets into `apps/web/app/(public)/skills/[skill]/page.tsx` | M2 | R2 §80 |
| 12 | Visual UI/UX & Responsive Layout | Tokenized CSS, RTL logical properties, no raw hex colors, mobile-friendly touch targets | M1, M2 | R3 §88-90 |
| 13 | Dedicated Verification Script | `scripts/check-skills-revamp.mjs` verifying all 6 routes, data validity, and pillar completeness | M3 | R4 §93 |
| 14 | Production Build & Typecheck Clean Pass | `npm run typecheck` and `npm run build` exit code 0 without errors | M3 | R4 §94 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Skills Data & Component Architecture | Create `apps/web/data/skills/skills-content.ts` (4 pillars for 6 skills) and `apps/web/components/skills/` (interactive mini-practice engine with instant green/red feedback) | None | IN_PROGRESS |
| M2 | Hub & Detail Pages Redesign | Revamp `/skills` (warm colloquial tone, roadmap cards, spotlights for Tamrin 20 & Small Talk) and `/skills/[skill]` (wire 4 pillars) | M1 | PLANNED |
| M3 | E2E Testing & Production Verification | Author `scripts/check-skills-revamp.mjs`, verify all 6 routes, run typecheck and production build | M1, M2 | PLANNED |

## Interface Contracts
### Data Schema (`apps/web/data/skills/skills-content.ts`)
```typescript
export type SkillKey = "listening" | "speaking" | "reading" | "writing" | "vocabulary" | "grammar";

export interface QuickToolItem {
  id: string;
  phraseEn: string;
  phraseFa: string;
  contextFa: string;
  pronunciationTipFa?: string;
  categoryTag: string;
}

export interface MiniPracticeQuestion {
  id: string;
  orderNumber: number;
  promptFa: string;
  promptEn?: string;
  passage?: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: {
    briefFa: string;
    detailedFa: string;
    goldenRuleFa: string;
  };
}

export interface PersianL1Fix {
  id: string;
  titleFa: string;
  persianRootFa: string;
  wrongEn: string;
  correctEn: string;
  whyFixFa: string;
  goldenTipFa: string;
}

export interface ActionPlanMilestone {
  step: number;
  levelBadge: string;
  titleFa: string;
  dailyRoutineFa: string;
  coreActionsFa: string[];
  recommendedTool: {
    titleFa: string;
    href: string;
    icon: string;
  };
}

export interface SkillPageData {
  slug: SkillKey;
  icon: string;
  titleFa: string;
  titleEn: string;
  cefrRange: string;
  heroBadgeFa: string;
  heroCatchphraseFa: string;
  heroDescriptionFa: string;
  quickToolkit: {
    sectionTitleFa: string;
    sectionDescFa: string;
    items: QuickToolItem[];
  };
  miniPractice: {
    sectionTitleFa: string;
    sectionDescFa: string;
    questions: MiniPracticeQuestion[];
  };
  l1Fixes: {
    sectionTitleFa: string;
    sectionDescFa: string;
    fixes: PersianL1Fix[];
  };
  actionPlan: {
    sectionTitleFa: string;
    sectionDescFa: string;
    milestones: ActionPlanMilestone[];
  };
  relatedModules: Array<{
    title: string;
    desc: string;
    href: string;
    badge: string;
    icon: string;
  }>;
}
```

## Code Layout
- `apps/web/data/skills/skills-content.ts` (Data layer)
- `apps/web/components/skills/` (UI components)
  - `SkillHeroSection.tsx`
  - `SkillQuickToolkit.tsx`
  - `SkillMiniPractice.tsx`
  - `SkillL1FixesSection.tsx`
  - `SkillActionPlanSection.tsx`
  - `SkillRelatedLinks.tsx`
  - `index.ts`
  - `skills-components.module.css`
- `apps/web/app/(public)/skills/page.tsx` & `skills.module.css` (Hub page)
- `apps/web/app/(public)/skills/[skill]/page.tsx` (Dynamic skill detail route)
- `scripts/check-skills-revamp.mjs` (Verification script)
- `package.json` (Test script registration)
