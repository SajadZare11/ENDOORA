import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const componentIndex = read("packages", "ui", "src", "components", "index.ts");
const componentCss = read("packages", "ui", "src", "components.css");
const tokenCss = read("packages", "ui", "src", "tokens.css");
const button = read("packages", "ui", "src", "components", "Button.tsx");
const forms = read("packages", "ui", "src", "components", "FormControls.tsx");
const tabs = read("packages", "ui", "src", "components", "Tabs.tsx");
const dialog = read("packages", "ui", "src", "components", "Dialog.tsx");
const dataTable = read("packages", "ui", "src", "components", "DataTable.tsx");
const chart = read("packages", "ui", "src", "components", "AccessibleChart.tsx");
const aiResult = read("packages", "ui", "src", "components", "AIResultCard.tsx");
const states = read("packages", "ui", "src", "components", "States.tsx");
const navigation = read("packages", "ui", "src", "components", "Navigation.tsx");
const stepper = read("packages", "ui", "src", "components", "Stepper.tsx");
const preview = read("apps", "web", "app", "design-system", "components", "page.tsx");
const previewCss = read("apps", "web", "app", "design-system", "components", "components-preview.module.css");

const expectedExports = [
  "AIResultCard", "AccessibleChart", "Button", "Card", "DataTable", "Dialog", "Feedback",
  "FormControls", "Navigation", "ProviderStatus", "States", "Stepper", "Tabs", "Toast",
];
for (const moduleName of expectedExports) {
  assert(componentIndex.includes(`./${moduleName}`), `Missing component module export: ${moduleName}`);
}

assert(tokenCss.includes("--target-min: 2.75rem"), "44px minimum target token is missing");
assert(componentCss.includes("min-block-size: var(--target-min)"), "Interactive components do not use the 44px target token");
assert(button.includes('aria-label={label}'), "IconButton must require an accessible label");
assert(button.includes('aria-busy={loading || undefined}'), "Loading button must expose aria-busy");

assert(forms.includes('htmlFor={id}'), "Form controls need explicit visible labels");
assert(forms.includes('aria-invalid={Boolean(error)}'), "Invalid form fields need aria-invalid");
assert(forms.includes('aria-describedby={describedBy'), "Helper/error text must be programmatically associated");
assert(forms.includes('role="alert"'), "Inline errors/error summary need an alert path");
assert(forms.includes('href={`#${error.fieldId}`}'), "Error summary must link back to invalid fields");

for (const required of ['role="tablist"', 'role="tab"', 'aria-selected={selected}', 'role="tabpanel"', 'ArrowRight', 'ArrowLeft', 'Home', 'End']) {
  assert(tabs.includes(required), `Tabs accessibility behavior missing: ${required}`);
}

for (const required of ['<dialog', 'showModal()', 'onCancel=', 'previousFocusRef', 'aria-labelledby={titleId}']) {
  assert(dialog.includes(required), `Dialog accessibility behavior missing: ${required}`);
}

assert(dataTable.includes("<table>"), "DataTable must preserve a semantic table on larger screens");
assert(dataTable.includes("endoora-data-table__cards"), "DataTable needs a mobile card fallback");
assert(chart.includes("<figcaption>"), "AccessibleChart needs a text summary");
assert(chart.includes("endoora-chart__table"), "AccessibleChart needs a data table fallback");
assert(aiResult.includes("AI-generated"), "AIResultCard needs a visible AI label");
assert(aiResult.includes("Evidence"), "AIResultCard needs evidence");
assert(aiResult.includes("Limitations"), "AIResultCard needs limitations");

for (const stateName of ["EmptyState", "PermissionDeniedState", "OfflineState", "RetryState"]) {
  assert(states.includes(`function ${stateName}`), `Missing standardized recovery state: ${stateName}`);
}

assert(stepper.includes("window.localStorage"), "Stepper must preserve resumable progress");
assert(stepper.includes("Save and continue later"), "Stepper must expose Save and Continue Later");
assert(stepper.includes(">Back<"), "Stepper must expose Back");
assert(stepper.includes(">Cancel<"), "Stepper must expose Cancel");

assert(navigation.includes("endoora-role-shell__sidebar"), "Role shell needs desktop sidebar navigation");
assert(navigation.includes("endoora-role-shell__bottom"), "Role shell needs mobile bottom navigation");
assert(navigation.includes("aria-current"), "Navigation needs current-page semantics");

const visualNames = [
  "Button", "IconButton", "TextInput", "TextArea", "Select", "MultiSelect", "Checkbox", "RadioGroup", "ErrorSummary",
  "Tabs", "Card", "Badge", "Dialog", "Drawer", "ToastRegion", "Skeleton", "ProgressBar", "StatusMessage", "ResumableStepper",
  "DataTable", "AccessibleChart", "AIResultCard", "EmptyState", "PermissionDeniedState", "OfflineState", "RetryState",
  "ProviderStatus", "AccountNavigation", "RoleShell",
];
for (const component of visualNames) {
  assert(preview.includes(`<${component}`), `Component preview missing visual example for ${component}`);
}
assert(visualNames.length >= 25, "Day 04 requires at least 25 visual component examples");

for (const [name, css] of [["components.css", componentCss], ["components preview CSS", previewCss]]) {
  const physicalProperty = /(^|[;{}]\s*)(?:margin|padding|border)-(?:left|right)\s*:|(^|[;{}]\s*)(?:left|right)\s*:/im;
  assert(!physicalProperty.test(css), `Physical left/right CSS property found in ${name}; use logical CSS`);
  assert(!/#[0-9a-f]{3,8}\b/i.test(css), `Raw color literal found in ${name}; use design tokens`);
}

assert(componentCss.includes("@media (max-width: 48rem)"), "Responsive mobile component rules are missing");
assert(componentCss.includes(".endoora-data-table__cards"), "Mobile table-card CSS is missing");
assert(componentCss.includes(".endoora-role-shell__bottom"), "Mobile bottom navigation CSS is missing");

console.log(`Day 04 component checks passed: ${visualNames.length} visual examples, labels/errors, keyboard tabs, modal focus semantics, 44px targets, responsive table/cards, chart table fallback, recovery states, and logical CSS.`);
