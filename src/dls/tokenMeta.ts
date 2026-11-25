export const colorTokens = [
  { name: "Canvas", variable: "--color-canvas" },
  { name: "Surface", variable: "--color-surface" },
  { name: "Sunken surface", variable: "--color-surface-sunken" },
  { name: "Hover", variable: "--color-surface-hover" },
  { name: "Selected", variable: "--color-selected" },
  { name: "Border", variable: "--color-border" },
  { name: "Strong border", variable: "--color-border-strong" },
  { name: "Text", variable: "--color-text" },
  { name: "Secondary text", variable: "--color-text-secondary" },
  { name: "Muted text", variable: "--color-text-muted" },
  { name: "Primary", variable: "--color-primary" },
  { name: "Primary hover", variable: "--color-primary-hover" },
  { name: "Text on primary", variable: "--color-on-primary" },
  { name: "Draft background", variable: "--status-draft-bg" },
  { name: "Draft text", variable: "--status-draft-fg" },
  { name: "In Review background", variable: "--status-review-bg" },
  { name: "In Review text", variable: "--status-review-fg" },
  { name: "Released background", variable: "--status-released-bg" },
  { name: "Released text", variable: "--status-released-fg" },
  { name: "Superseded background", variable: "--status-superseded-bg" },
  { name: "Superseded text", variable: "--status-superseded-fg" },
  { name: "Obsolete background", variable: "--status-obsolete-bg" },
  { name: "Obsolete text", variable: "--status-obsolete-fg" },
  { name: "Serviceable background", variable: "--status-serviceable-bg" },
  { name: "Serviceable text", variable: "--status-serviceable-fg" },
  { name: "Replaceable background", variable: "--status-replaceable-bg" },
  { name: "Replaceable text", variable: "--status-replaceable-fg" },
] as const;

export const typeTokens = [
  { name: "12", variable: "--font-size-12", sample: "Filters" },
  { name: "13", variable: "--font-size-13", sample: "Secondary table text" },
  { name: "14", variable: "--font-size-14", sample: "Service BOM text" },
  { name: "16", variable: "--font-size-16", sample: "Section title" },
  { name: "20", variable: "--font-size-20", sample: "Page title" },
  { name: "24", variable: "--font-size-24", sample: "Detail title" },
] as const;

export const spaceTokens = [
  { name: "4", variable: "--space-1" },
  { name: "8", variable: "--space-2" },
  { name: "12", variable: "--space-3" },
  { name: "16", variable: "--space-4" },
  { name: "20", variable: "--space-5" },
  { name: "24", variable: "--space-6" },
  { name: "32", variable: "--space-8" },
  { name: "40", variable: "--space-10" },
] as const;

export const radiusTokens = [
  { name: "6", variable: "--radius-sm" },
  { name: "8", variable: "--radius-md" },
  { name: "12", variable: "--radius-lg" },
  { name: "16", variable: "--radius-xl" },
  { name: "pill", variable: "--radius-pill" },
] as const;

export function readToken(variable: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}
