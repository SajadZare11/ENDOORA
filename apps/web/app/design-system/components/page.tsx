"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AIInsight,
  AIResultCard,
  AIThinkingState,
  AccessibleChart,
  AccountNavigation,
  Badge,
  Button,
  Card,
  Checkbox,
  DataTable,
  Dialog,
  DialogActions,
  Drawer,
  EmptyState,
  EndooraWordmark,
  ErrorSummary,
  GrowthCard,
  IconButton,
  LearnerTwinCard,
  MissionCard,
  MultiSelect,
  OfflineState,
  PermissionDeniedState,
  ProgressBar,
  ProviderStatus,
  RadioGroup,
  ResumableStepper,
  RetryState,
  RoleShell,
  Select,
  Skeleton,
  StatusMessage,
  Tabs,
  TextArea,
  TextInput,
  ToastRegion,
  type DataColumn,
} from "@endoora/ui";
import styles from "./components-preview.module.css";

type LearnerRow = {
  id: string;
  learner: string;
  nextAction: string;
  status: "Ready" | "Review" | "Paused";
};

const learnerRows: LearnerRow[] = [
  { id: "1", learner: "سارا", nextAction: "Vocabulary review", status: "Ready" },
  { id: "2", learner: "امیر", nextAction: "Writing revision", status: "Review" },
  { id: "3", learner: "نیکا", nextAction: "Resume placement", status: "Paused" },
];

const learnerColumns: DataColumn<LearnerRow>[] = [
  { key: "learner", header: "Learner", cell: (row) => row.learner },
  { key: "next", header: "Next action", cell: (row) => <span className="ltr-isolate">{row.nextAction}</span> },
  {
    key: "status",
    header: "Status",
    cell: (row) => (
      <Badge tone={row.status === "Ready" ? "success" : row.status === "Review" ? "warning" : "neutral"}>
        {row.status}
      </Badge>
    ),
  },
];

const accountItems = [
  { href: "#library", label: "Library", icon: "▤" },
  { href: "#usage", label: "Usage", icon: "◴" },
  { href: "#plan", label: "Premium", icon: "◆", badge: "90 days" },
  { href: "#billing", label: "Billing", icon: "₮" },
  { href: "#privacy", label: "Privacy & data", icon: "◉" },
  { href: "#support", label: "Support", icon: "?" },
];

const learnerNavigation = [
  { href: "#home", label: "Home", icon: "⌂", current: true },
  { href: "#learn", label: "Learn", icon: "◇" },
  { href: "#practice", label: "Practice", icon: "✦" },
  { href: "#teachers", label: "Teachers", icon: "◎" },
  { href: "#account", label: "Account", icon: "○" },
];

const providerItems = [
  { id: "ai", label: "AI learning tools", state: "degraded" as const, message: "Generation is slower than usual. Reviewed exercises remain available." },
  { id: "payments", label: "Payments", state: "operational" as const, message: "Payment services are available." },
  { id: "notifications", label: "Notifications", state: "unavailable" as const, message: "SMS delivery is unavailable. In-app notices remain available." },
];

export default function ComponentPreviewPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(true);
  const [lastAction, setLastAction] = useState("No action yet");

  return (
    <div className={styles.preview}>
      <header className={styles.header}>
        <EndooraWordmark compact />
        <nav className={styles.headerLinks} aria-label="Design system pages">
          <Link href="/design-system">Tokens</Link>
          <Link href="/design-system/components" aria-current="page">Components</Link>
          <Link href="/">Local home</Link>
        </nav>
      </header>

      <main className={styles.content}>
        <section className={styles.hero} aria-labelledby="component-title">
          <div className={styles.heroMain}>
            <p className={styles.meta}>DAY 04 · ACCESSIBLE COMPONENT LIBRARY</p>
            <h1 id="component-title" className="text-hero">اجزای قابل‌استفاده و قابل‌دسترسی Endoora</h1>
            <p className="text-body">
              این مرجع، رفتار واقعی فرم‌ها، ناوبری، بازخورد، داده و نتایج هوش مصنوعی را نشان می‌دهد.
              English learning content stays isolated as <span className="ltr-isolate font-latin">LTR</span>.
            </p>
          </div>
          <aside className={styles.heroAside}>
            <h2 className="text-card-title">Day 4 quality gate</h2>
            <p>Every primitive has a named, keyboard-accessible example and a safe recovery path.</p>
            <div className={styles.metric}><strong>29+</strong><span>core examples</span></div>
            <div className={styles.metric}><strong>44px</strong><span>minimum target</span></div>
          </aside>
        </section>

        <section className={styles.section} aria-labelledby="actions-title">
          <div className={styles.sectionHeader}>
            <div><p className={styles.meta}>01 · ACTIONS</p><h2 id="actions-title">Buttons and action hierarchy</h2></div>
            <p className={styles.sectionIntro}>Loading and disabled states retain names while preventing accidental activation.</p>
          </div>
          <div className={styles.buttonRow}>
            <Button onClick={() => setLastAction("Primary action")}>Primary action</Button>
            <Button variant="secondary" onClick={() => setLastAction("Secondary action")}>Secondary</Button>
            <Button variant="tertiary" onClick={() => setLastAction("Tertiary action")}>Tertiary</Button>
            <Button variant="destructive" onClick={() => setLastAction("Delete requested")}>Delete draft</Button>
            <Button loading>Saving</Button>
            <Button disabled>Disabled</Button>
            <IconButton label="Open notifications" icon={<span aria-hidden="true">●</span>} onClick={() => setLastAction("Notifications opened")} />
          </div>
          <p className={styles.meta} role="status" aria-live="polite">Demo status: {lastAction}</p>
        </section>

        <section className={styles.section} aria-labelledby="forms-title">
          <div className={styles.sectionHeader}>
            <div><p className={styles.meta}>02 · FORMS</p><h2 id="forms-title">Labels, guidance and recovery</h2></div>
            <p className={styles.sectionIntro}>Every field has a visible label and programmatically connected help or error text.</p>
          </div>
          <div className={styles.grid2}>
            <div className={styles.formDemo}>
              <TextInput id="full-name" label="نام نمایشی" helperText="این نام در پروفایل عمومی دیده می‌شود." placeholder="مثلاً سارا" />
              <TextInput id="email-demo" label="Email" helperText="English email input remains LTR." type="email" defaultValue="learner@example.com" className="ltr-isolate font-latin" />
              <TextArea id="goal" label="هدف یادگیری" helperText="در یک یا دو جمله بنویسید." defaultValue="می‌خواهم برای مکالمه دانشگاه آماده شوم." />
              <Select id="level" label="سطح فعلی" placeholder="انتخاب کنید" options={[{ value: "a2", label: "A2" }, { value: "b1", label: "B1" }, { value: "b2", label: "B2" }]} />
              <MultiSelect id="skills" label="مهارت‌های هدف" helperText="برای انتخاب چند مورد از Ctrl یا Command استفاده کنید." options={[{ value: "speaking", label: "Speaking" }, { value: "writing", label: "Writing" }, { value: "listening", label: "Listening" }]} />
            </div>
            <div className={styles.formDemo}>
              <ErrorSummary title="دو مورد نیاز به اصلاح دارد" errors={[{ fieldId: "invalid-name", message: "نام نمایشی را کامل کنید." }, { fieldId: "invalid-time", message: "زمان مطالعه را انتخاب کنید." }]} />
              <TextInput id="invalid-name" label="نام نمایشی" required error="این فیلد الزامی است." />
              <Select id="invalid-time" label="زمان مطالعه روزانه" required error="یک گزینه انتخاب کنید." placeholder="انتخاب کنید" options={[{ value: "15", label: "15 minutes" }, { value: "30", label: "30 minutes" }]} />
              <Checkbox id="consent-demo" label="شرایط استفاده را خوانده‌ام." description="این نمونه فقط رابط کاربری است." defaultChecked />
              <RadioGroup legend="زبان رابط" name="interface-language" defaultValue="fa" options={[{ value: "fa", label: "فارسی", description: "Persian-first RTL" }, { value: "en", label: "English", description: "English LTR" }]} />
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="structure-title">
          <div className={styles.sectionHeader}>
            <div><p className={styles.meta}>03 · STRUCTURE</p><h2 id="structure-title">Tabs, cards and badges</h2></div>
            <p className={styles.sectionIntro}>Tabs support Arrow keys, Home and End in both text directions.</p>
          </div>
          <div className={styles.grid2}>
            <Tabs label="Learner evidence" items={[
              { id: "today", label: "Today", content: <p>Complete five vocabulary reviews.</p> },
              { id: "evidence", label: "Evidence", content: <p>Evidence count is shown without fake precision.</p> },
              { id: "locked", label: "Locked", content: <p>Locked content</p>, disabled: true },
            ]} />
            <Card title="Daily mission" description="One clear learning outcome." actions={<Badge tone="success">Ready</Badge>}>
              <p>5 vocabulary reviews · 1 short conversation</p>
              <div className={styles.buttonRow}><Button>Continue mission</Button><Button variant="tertiary">Why this?</Button></div>
            </Card>
          </div>
          <div className={styles.buttonRow} style={{ marginBlockStart: "var(--space-4)" }}>
            <Badge>Neutral</Badge><Badge tone="info">Info</Badge><Badge tone="success">Success</Badge><Badge tone="warning">Warning</Badge><Badge tone="error">Error</Badge>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="overlay-title">
          <div className={styles.sectionHeader}>
            <div><p className={styles.meta}>04 · OVERLAYS</p><h2 id="overlay-title">Dialog, drawer and toast</h2></div>
            <p className={styles.sectionIntro}>Native modal behavior makes the background inert and restores focus to the opener.</p>
          </div>
          <div className={styles.buttonRow}>
            <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
            <Button variant="secondary" onClick={() => setDrawerOpen(true)}>Open drawer</Button>
            <Button variant="tertiary" onClick={() => setToastVisible((visible) => !visible)}>{toastVisible ? "Hide toast" : "Show toast"}</Button>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen} title="Confirm learning goal" description="Review this preference before saving." footer={<DialogActions onCancel={() => setDialogOpen(false)} onConfirm={() => { setLastAction("Dialog confirmed"); setDialogOpen(false); }} />}>
            <TextInput id="dialog-goal" label="Goal" defaultValue="IELTS writing improvement" className="ltr-isolate font-latin" />
          </Dialog>
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} title="Account" description="Secondary administrative tools live here.">
            <AccountNavigation items={accountItems} />
          </Drawer>
          {toastVisible ? <ToastRegion messages={[{ id: "saved", title: "Draft saved", message: "You can continue later.", tone: "success" }]} /> : null}
        </section>

        <section className={styles.section} aria-labelledby="feedback-title">
          <div className={styles.sectionHeader}>
            <div><p className={styles.meta}>05 · FEEDBACK</p><h2 id="feedback-title">Loading, progress and semantic feedback</h2></div>
          </div>
          <div className={styles.grid2}>
            <div className={styles.skeletonStack}><Skeleton width="42%" height="1.5rem" /><Skeleton /><Skeleton width="80%" /><ProgressBar label="Daily mission" value={3} max={5} /></div>
            <div className={styles.stack}>
              <StatusMessage tone="success" title="Saved">Your draft can be resumed.</StatusMessage>
              <StatusMessage tone="warning" title="Connection is slow">Audio will upload when the connection improves.</StatusMessage>
              <StatusMessage tone="error" title="Analysis failed">Your original writing is still safe.</StatusMessage>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="stepper-title">
          <div className={styles.sectionHeader}>
            <div><p className={styles.meta}>06 · LONG WORKFLOWS</p><h2 id="stepper-title">Resumable stepper</h2></div>
          </div>
          <ResumableStepper storageKey="endoora-day04-stepper-demo" onSave={(stepId) => setLastAction(`Saved step ${stepId}`)} onCancel={() => setLastAction("Stepper cancelled")} onComplete={() => setLastAction("Stepper completed")} steps={[
            { id: "goal", title: "Goal", description: "Choose an immediate learning goal.", content: <Select id="step-goal" label="Goal" options={[{ value: "conversation", label: "Conversation" }, { value: "ielts", label: "IELTS" }]} placeholder="Choose" /> },
            { id: "time", title: "Time", description: "Set a realistic daily budget.", content: <RadioGroup legend="Available time" name="step-time" options={[{ value: "15", label: "15 minutes" }, { value: "30", label: "30 minutes" }]} /> },
            { id: "review", title: "Review", description: "Confirm before continuing.", content: <p>You can change these settings later.</p> },
          ]} />
        </section>

        <section className={styles.section} aria-labelledby="data-title">
          <div className={styles.sectionHeader}>
            <div><p className={styles.meta}>07 · DATA</p><h2 id="data-title">Responsive table and accessible chart</h2></div>
            <p className={styles.sectionIntro}>At 360px, records become labelled cards. Charts always retain a factual text and table fallback.</p>
          </div>
          <div className={styles.grid2}>
            <DataTable caption="Learner next actions" columns={learnerColumns} rows={learnerRows} rowKey={(row) => row.id} />
            <AccessibleChart title="Practice evidence" summary="Speaking has the least recent evidence. These are evidence counts, not skill scores." data={[{ label: "Reading", value: 8 }, { label: "Writing", value: 6 }, { label: "Listening", value: 5 }, { label: "Speaking", value: 3 }]} />
          </div>
        </section>

        <section className={styles.section} aria-labelledby="ai-title">
          <div className={styles.sectionHeader}>
            <div><p className={styles.meta}>08 · AI RESULTS</p><h2 id="ai-title">Transparent AI output</h2></div>
            <p className={styles.sectionIntro}>Evidence, limitations and control actions prevent unexplained AI authority.</p>
          </div>
          <AIResultCard title="Writing feedback sample" confidence="medium" evidence="Two recurring article errors in this draft." limitations="Learning feedback, not an official IELTS score." onRetry={() => setLastAction("AI retry requested")} onSave={() => setLastAction("AI result saved")} onReport={() => setLastAction("AI result reported")} onHumanReview={() => setLastAction("Human review requested")}>
            <p>Strength: your main idea is clear. Priority: review articles before singular countable nouns.</p>
          </AIResultCard>
          <div className={styles.grid2} style={{ marginBlockStart: "var(--space-4)" }}><AIInsight /><AIThinkingState /></div>
        </section>

        <section className={styles.section} aria-labelledby="states-title">
          <div className={styles.sectionHeader}>
            <div><p className={styles.meta}>09 · RECOVERY</p><h2 id="states-title">Predictable recovery states</h2></div>
          </div>
          <div className={styles.grid4}>
            <EmptyState title="No saved words yet" description="Approved words will appear here." action={<Button variant="secondary">Start practice</Button>} />
            <PermissionDeniedState onBack={() => setLastAction("Permission state back")} />
            <OfflineState onRetry={() => setLastAction("Offline retry")} />
            <RetryState onRetry={() => setLastAction("Request retry")} />
          </div>
        </section>

        <section className={styles.section} aria-labelledby="providers-title">
          <div className={styles.sectionHeader}>
            <div><p className={styles.meta}>10 · PROVIDERS</p><h2 id="providers-title">Public-safe provider status</h2></div>
          </div>
          <ProviderStatus items={providerItems} />
        </section>

        <section className={styles.section} aria-labelledby="learning-title">
          <div className={styles.sectionHeader}>
            <div><p className={styles.meta}>11 · EXPERIENCE</p><h2 id="learning-title">Endoora learning components</h2></div>
            <p className={styles.sectionIntro}>Experience components compose the same accessible primitives instead of creating a second design system.</p>
          </div>
          <div className={styles.grid3}><MissionCard /><GrowthCard /><LearnerTwinCard /></div>
        </section>

        <section className={styles.section} aria-labelledby="navigation-title">
          <div className={styles.sectionHeader}>
            <div><p className={styles.meta}>12 · NAVIGATION</p><h2 id="navigation-title">Account hub and role-aware shell</h2></div>
          </div>
          <div className={styles.navigationDemo}>
            <div className={styles.sampleBox}><h3>Account navigation</h3><AccountNavigation items={accountItems} /></div>
            <div className={styles.shellDemo}>
              <RoleShell role="learner" title="Learner" navigation={learnerNavigation} topBar={<strong>Today · 20 minutes available</strong>} contentLandmark={false}>
                <Card title="Continue today’s mission" description="One dominant action stays above the fold."><p>Review five words, then complete a short speaking task.</p><Button>Continue</Button></Card>
              </RoleShell>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
