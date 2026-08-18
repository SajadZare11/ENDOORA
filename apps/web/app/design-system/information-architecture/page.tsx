import Link from "next/link";
import { EndooraWordmark } from "@endoora/ui";
import styles from "./information-architecture.module.css";

type NavItem = { label: string; href: string };
type Flow = { title: string; path: string; target: string };

const publicNavigation: NavItem[] = [
  { label: "Home", href: "#public-home" },
  { label: "How it works", href: "#public-how" },
  { label: "Placement", href: "#placement" },
  { label: "Teachers", href: "#teachers" },
  { label: "Classes", href: "#classes" },
  { label: "Courses", href: "#courses" },
  { label: "IELTS", href: "#ielts" },
  { label: "Pricing", href: "#pricing" },
  { label: "Help", href: "#help" },
];

const learnerNavigation: NavItem[] = [
  { label: "Home", href: "#learner-home" },
  { label: "Learn", href: "#learner-learn" },
  { label: "Practice", href: "#learner-practice" },
  { label: "Teachers & Classes", href: "#learner-teachers" },
  { label: "Account", href: "#learner-account" },
];

const teacherNavigation: NavItem[] = [
  { label: "Home", href: "#teacher-home" },
  { label: "Teach", href: "#teacher-teach" },
  { label: "Marketplace", href: "#teacher-marketplace" },
  { label: "Resources", href: "#teacher-resources" },
  { label: "Account", href: "#teacher-account" },
];

const learnerAccount: NavItem[] = [
  { label: "Library", href: "#account-library" },
  { label: "Usage", href: "#account-usage" },
  { label: "Premium", href: "#account-premium" },
  { label: "Billing", href: "#billing" },
  { label: "Profile", href: "#account-profile" },
  { label: "Sessions", href: "#account-sessions" },
  { label: "Notifications", href: "#account-notifications" },
  { label: "Privacy / Data Controls", href: "#account-privacy" },
  { label: "Settings", href: "#account-settings" },
  { label: "Support", href: "#account-support" },
];

const flows: Flow[] = [
  { title: "Placement → Path", path: "Home → Placement → Result → Path → Today", target: "Start personal learning path" },
  { title: "Daily Mission", path: "Learner Home → Today → Task → Feedback → Next action", target: "Complete useful practice" },
  { title: "Learn Now", path: "Teachers & Classes → Learn Now → Request → Offers → Booking", target: "Reach an eligible teacher offer" },
  { title: "Teacher Assignment", path: "Teach → Assignments → Create → Review → Publish", target: "Publish reviewed assignment" },
  { title: "Fixed Class", path: "Classes → Detail → Enroll → Capacity/payment → Confirmation", target: "Confirmed enrollment or waitlist" },
  { title: "IELTS Attempt", path: "IELTS → Practice → Instructions → Attempt → Submit → Report", target: "Safe submitted practice attempt" },
];

function Nav({ label, items }: { label: string; items: NavItem[] }) {
  return (
    <nav className={styles.nav} aria-label={label}>
      <ul>
        {items.map((item) => (
          <li key={`${label}-${item.label}`}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Destination({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={styles.destination} tabIndex={-1}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h3>{title}</h3>
      {children}
    </section>
  );
}

export default function InformationArchitecturePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <EndooraWordmark compact />
        <nav className={styles.utilityNav} aria-label="Design system">
          <Link href="/design-system">Tokens</Link>
          <Link href="/design-system/components">Components</Link>
          <Link href="/design-system/information-architecture" aria-current="page">Information architecture</Link>
          <Link href="/">Local home</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>DAY 05 · PRODUCT UX</p>
            <h1 className="text-hero">Information architecture and critical-flow prototype</h1>
            <p className="text-body">
              This developer-only page freezes where users start, where Account tools live, and how six critical journeys are found.
              It is not a claim that the later product routes are implemented yet.
            </p>
          </div>
          <aside className={styles.gateCard}>
            <strong>Findability gate</strong>
            <span>Core tasks: ≤ 3 navigation decisions</span>
            <span>Mobile primary nav: ≤ 5 items per signed-in role</span>
          </aside>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>01 · ROLE NAVIGATION</p>
            <h2>One calm navigation model per role</h2>
          </div>

          <div className={styles.roleGrid}>
            <article className={styles.roleCard}>
              <h3>Public</h3>
              <Nav label="Public primary navigation prototype" items={publicNavigation} />
            </article>
            <article className={styles.roleCard}>
              <h3>Learner</h3>
              <Nav label="Learner primary navigation prototype" items={learnerNavigation} />
            </article>
            <article className={styles.roleCard}>
              <h3>Teacher</h3>
              <Nav label="Teacher primary navigation prototype" items={teacherNavigation} />
            </article>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>02 · FINDABILITY TARGETS</p>
            <h2>Use these anchors for the five hallway-test tasks</h2>
          </div>
          <div className={styles.destinationGrid}>
            <Destination id="placement" eyebrow="PUBLIC / LEARNER" title="Placement Test">
              <p>Prominent from public navigation and the learner first-time Home state.</p>
              <code>/placement</code>
            </Destination>

            <Destination id="learner-home" eyebrow="LEARNER · HOME" title="Today">
              <p>Home exposes one dominant next action instead of a grid of all Endoora features.</p>
              <a className={styles.action} href="#daily-mission">Continue today&apos;s mission</a>
            </Destination>

            <Destination id="teacher-teach" eyebrow="TEACHER · TEACH" title="Teaching work">
              <p>Classes, students, assignments, grading and question-bank work live together.</p>
              <a className={styles.action} href="#create-assignment">Assignments → Create Assignment</a>
            </Destination>

            <Destination id="create-assignment" eyebrow="TEACHER · TEACH · ASSIGNMENTS" title="Create Assignment">
              <p>Long workflow: choose learners/objectives → content → settings → review → publish.</p>
              <code>/teacher/assignments</code>
            </Destination>

            <Destination id="learner-teachers" eyebrow="LEARNER · TEACHERS & CLASSES" title="Teachers & Classes">
              <p>Human-learning options stay distinct from the personal learning path.</p>
              <a className={styles.action} href="#learn-now">Learn Now</a>
              <a href="#classes">Browse fixed classes</a>
            </Destination>

            <Destination id="learn-now" eyebrow="VALIDATED BETA · LATER DAY" title="Learn Now">
              <p>Request → safe matching → teacher offer → booking. No instant-dispatch promise.</p>
              <code>/marketplace/requests</code>
            </Destination>

            <Destination id="learner-account" eyebrow="LEARNER · ACCOUNT" title="Account hub">
              <p>Administrative tools are grouped here so they do not compete with Today.</p>
              <Nav label="Learner Account prototype" items={learnerAccount} />
            </Destination>

            <Destination id="billing" eyebrow="ACCOUNT" title="Billing">
              <p>Receipts, order history and payment recovery live in Account.</p>
              <code>/account/billing</code>
            </Destination>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>03 · SECONDARY DESTINATIONS</p>
            <h2>Prototype context without turning Home into a mega-dashboard</h2>
          </div>
          <div className={styles.destinationGrid}>
            <Destination id="public-home" eyebrow="PUBLIC" title="Home"><p>Promise, trust and one clear CTA hierarchy.</p></Destination>
            <Destination id="public-how" eyebrow="PUBLIC" title="How it works"><p>Assess → Twin → Plan → Practise → Adapt → Teacher → Progress.</p></Destination>
            <Destination id="teachers" eyebrow="PUBLIC" title="Teachers"><p>Discovery and verified public information.</p></Destination>
            <Destination id="classes" eyebrow="PUBLIC / LEARNER" title="Classes"><p>Fixed-class discovery; enrollment is a later-day beta flow.</p></Destination>
            <Destination id="courses" eyebrow="PUBLIC" title="Courses"><p>Original/licensed learning content.</p></Destination>
            <Destination id="ielts" eyebrow="PUBLIC / LEARNER" title="IELTS"><p>Practice context only; no official-score claim.</p></Destination>
            <Destination id="pricing" eyebrow="PUBLIC" title="Pricing"><p>Premium offer presentation; value comes from backend configuration later.</p></Destination>
            <Destination id="help" eyebrow="PUBLIC" title="Help"><p>FAQ, support entry and limitations.</p></Destination>
            <Destination id="learner-learn" eyebrow="LEARNER" title="Learn"><p>Personal path, vocabulary and progress.</p></Destination>
            <Destination id="learner-practice" eyebrow="LEARNER" title="Practice"><p>Mission and later writing/roleplay/voice practice.</p></Destination>
            <Destination id="teacher-home" eyebrow="TEACHER" title="Teacher Home"><p>One urgency-driven action: verify, teach, respond or grade.</p></Destination>
            <Destination id="teacher-marketplace" eyebrow="TEACHER" title="Marketplace"><p>Eligible requests, offers and bookings.</p></Destination>
            <Destination id="teacher-resources" eyebrow="TEACHER" title="Resources"><p>Reviewed teacher resources.</p></Destination>
            <Destination id="teacher-account" eyebrow="TEACHER" title="Teacher Account"><p>Verification, history, usage, earnings, privacy, settings and support.</p></Destination>
          </div>
        </section>

        <section className={styles.section} id="daily-mission">
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>04 · SIX CRITICAL FLOWS</p>
            <h2>Implementation-independent journey wireframes</h2>
          </div>
          <div className={styles.flowGrid}>
            {flows.map((flow) => (
              <article className={styles.flowCard} key={flow.title}>
                <h3>{flow.title}</h3>
                <p>{flow.path}</p>
                <strong>{flow.target}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>05 · REQUIRED ROUTE STATES</p>
            <h2>Recovery is part of the route contract</h2>
          </div>
          <ul className={styles.stateList}>
            <li>Loading</li>
            <li>Empty</li>
            <li>Error / Retry</li>
            <li>Offline / Interrupted</li>
            <li>Expired session</li>
            <li>Permission denied</li>
          </ul>
          <p>
            Deep links authenticate and authorize before returning to the requested destination.
            Wrong-role access gets explicit denial; it is never “fixed” by silently switching role.
          </p>
        </section>
      </main>
    </div>
  );
}
