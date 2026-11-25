export const colorTokens = [
  { name: "畫布", variable: "--color-canvas" },
  { name: "表面", variable: "--color-surface" },
  { name: "下凹表面", variable: "--color-surface-sunken" },
  { name: "懸停", variable: "--color-surface-hover" },
  { name: "選取", variable: "--color-selected" },
  { name: "框線", variable: "--color-border" },
  { name: "強調框線", variable: "--color-border-strong" },
  { name: "文字", variable: "--color-text" },
  { name: "次要文字", variable: "--color-text-secondary" },
  { name: "輔助文字", variable: "--color-text-muted" },
  { name: "主色", variable: "--color-primary" },
  { name: "主色懸停", variable: "--color-primary-hover" },
  { name: "主色上的文字", variable: "--color-on-primary" },
  { name: "草稿底", variable: "--status-draft-bg" },
  { name: "草稿字", variable: "--status-draft-fg" },
  { name: "審查中底", variable: "--status-review-bg" },
  { name: "審查中字", variable: "--status-review-fg" },
  { name: "已發行底", variable: "--status-released-bg" },
  { name: "已發行字", variable: "--status-released-fg" },
  { name: "已取代底", variable: "--status-superseded-bg" },
  { name: "已取代字", variable: "--status-superseded-fg" },
  { name: "已停用底", variable: "--status-obsolete-bg" },
  { name: "已停用字", variable: "--status-obsolete-fg" },
  { name: "可維修底", variable: "--status-serviceable-bg" },
  { name: "可維修字", variable: "--status-serviceable-fg" },
  { name: "可更換底", variable: "--status-replaceable-bg" },
  { name: "可更換字", variable: "--status-replaceable-fg" },
] as const;

export const typeTokens = [
  { name: "12", variable: "--font-size-12", sample: "篩選條件" },
  { name: "13", variable: "--font-size-13", sample: "表格次要資訊" },
  { name: "14", variable: "--font-size-14", sample: "服務 BOM 內文" },
  { name: "16", variable: "--font-size-16", sample: "區段標題" },
  { name: "20", variable: "--font-size-20", sample: "頁面標題" },
  { name: "24", variable: "--font-size-24", sample: "明細標題" },
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
