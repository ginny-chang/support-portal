export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const [year, month, day] = iso.slice(0, 10).split("-");
  if (!year || !month || !day) return "—";
  return `${year}/${month}/${day}`;
}

export function formatDateTime(iso: string): string {
  const date = formatDate(iso);
  const time = iso.length >= 16 ? iso.slice(11, 16) : "";
  return time ? `${date} ${time}` : date;
}

export function normalizeSearch(value: string): string {
  return value.trim().toLowerCase().replace(/-/g, "");
}
