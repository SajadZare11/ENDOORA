import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const tokenPath = path.join(root, "packages", "ui", "src", "tokens.css");
const tokenCss = fs.readFileSync(tokenPath, "utf8");

function blockFor(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = tokenCss.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`, "m"));
  if (!match) throw new Error(`Could not find theme block: ${selector}`);
  return match[1];
}

function parseVariables(block) {
  return Object.fromEntries(
    [...block.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map((match) => [match[1].replace(/^color-/, ""), match[2]])
  );
}

function linearize(channel) {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const value = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16));
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrast(foreground, background) {
  const a = luminance(foreground);
  const b = luminance(background);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const light = parseVariables(blockFor('[data-theme="light"]'));
const dark = parseVariables(blockFor('[data-theme="dark"]'));

const required = [
  "deep-navy",
  "endoora-blue",
  "learning-teal",
  "achievement-amber",
  "success-green",
  "warning-orange",
  "error-red",
  "canvas",
  "surface",
  "text",
  "muted",
  "border",
  "action",
  "action-text",
];

for (const name of required) {
  assert(light[name], `Missing required light token --color-${name}`);
}

const pairs = [
  ["light text/canvas", light.text, light.canvas],
  ["light muted/surface", light.muted, light.surface],
  ["light action text/action", light["action-text"], light.action],
  ["Deep Navy/Learning Teal", light["deep-navy"], light["learning-teal"]],
  ["Deep Navy/Achievement Amber", light["deep-navy"], light["achievement-amber"]],
  ["light success", light["success-text"], light["success-bg"]],
  ["light warning", light["warning-text"], light["warning-bg"]],
  ["light error", light["error-text"], light["error-bg"]],
  ["dark text/canvas", dark.text, dark.canvas],
  ["dark muted/surface", dark.muted, dark.surface],
  ["dark link/canvas", dark.link, dark.canvas],
  ["dark success", dark["success-text"], dark["success-bg"]],
  ["dark warning", dark["warning-text"], dark["warning-bg"]],
  ["dark error", dark["error-text"], dark["error-bg"]],
];

for (const [label, foreground, background] of pairs) {
  assert(foreground && background, `Missing colors for contrast pair: ${label}`);
  const ratio = contrast(foreground, background);
  assert(ratio >= 4.5, `${label} contrast ${ratio.toFixed(2)} is below WCAG AA 4.5:1`);
}

assert(tokenCss.includes(":focus-visible"), "Visible focus token/rule is missing");
assert(tokenCss.includes("prefers-reduced-motion: reduce"), "Reduced-motion handling is missing");
assert(!/color:\s*var\(--color-achievement-amber\)/i.test(tokenCss), "Achievement Amber must not be body text color");

const cssFiles = [
  tokenPath,
  path.join(root, "apps", "web", "app", "globals.css"),
  path.join(root, "apps", "web", "app", "design-system", "design-system.module.css"),
];

for (const file of cssFiles) {
  const css = fs.readFileSync(file, "utf8");
  const physicalProperty = /(^|[;{}]\s*)(?:margin|padding|border)-(?:left|right)\s*:|(^|[;{}]\s*)(?:left|right)\s*:/im;
  assert(!physicalProperty.test(css), `Physical left/right CSS property found in ${path.relative(root, file)}; use logical properties`);
  if (file !== tokenPath) {
    assert(!/#[0-9a-f]{3,8}\b/i.test(css), `Raw color literal found outside tokens.css in ${path.relative(root, file)}`);
  }
}

console.log(`Design token checks passed: ${pairs.length} AA contrast pairs, focus, reduced motion, logical CSS, and centralized colors.`);
