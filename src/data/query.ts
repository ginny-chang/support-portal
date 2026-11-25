import type { BomRecord, BomStatus } from "./bom";
import { normalizeSearch } from "./format";

export type SortKey = "updated" | "effective" | "id";
export type SortDir = "asc" | "desc";

export interface BomQuery {
  q: string;
  revisions: string[];
  statuses: BomStatus[];
  product: string;
  sort: SortKey;
  dir: SortDir;
}

export const defaultQuery: BomQuery = {
  q: "",
  revisions: [],
  statuses: [],
  product: "",
  sort: "updated",
  dir: "desc",
};

const statuses = new Set<BomStatus>(["draft", "in_review", "released", "superseded", "obsolete"]);
const sorts = new Set<SortKey>(["updated", "effective", "id"]);

function splitList(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

export function parseQuery(params: URLSearchParams): BomQuery {
  const sort = params.get("sort");
  const dir = params.get("dir");
  return {
    q: params.get("q") ?? "",
    revisions: splitList(params.get("rev")),
    statuses: splitList(params.get("status")).filter((item): item is BomStatus => statuses.has(item as BomStatus)),
    product: params.get("product") ?? "",
    sort: sort && sorts.has(sort as SortKey) ? (sort as SortKey) : "updated",
    dir: dir === "asc" || dir === "desc" ? dir : "desc",
  };
}

export function toSearchParams(query: BomQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.revisions.length) params.set("rev", query.revisions.join(","));
  if (query.statuses.length) params.set("status", query.statuses.join(","));
  if (query.product) params.set("product", query.product);
  if (query.sort !== "updated") params.set("sort", query.sort);
  if (query.dir !== "desc") params.set("dir", query.dir);
  return params;
}

function haystack(record: BomRecord): string {
  return normalizeSearch(
    [
      record.id,
      record.product,
      record.assembly,
      record.applicability.model,
      ...record.lines.flatMap((line) => [line.partId, line.description]),
    ].join(" "),
  );
}

export function filterBoms(records: BomRecord[], query: BomQuery): BomRecord[] {
  const needle = normalizeSearch(query.q);
  return records.filter((record) => {
    if (query.revisions.length && !query.revisions.includes(record.revision)) return false;
    if (query.statuses.length && !query.statuses.includes(record.status)) return false;
    if (query.product.startsWith("product:") && record.product !== query.product.slice("product:".length)) return false;
    if (query.product.startsWith("assembly:") && record.assembly !== query.product.slice("assembly:".length)) return false;
    if (needle && !haystack(record).includes(needle)) return false;
    return true;
  });
}

function compareText(left: string, right: string): number {
  return left.localeCompare(right, "en");
}

export function sortBoms(records: BomRecord[], query: BomQuery): BomRecord[] {
  const direction = query.dir === "asc" ? 1 : -1;
  return [...records].sort((left, right) => {
    let result = 0;
    switch (query.sort) {
      case "id":
        result = compareText(left.id, right.id);
        break;
      case "effective":
        if (!left.effectiveDate && !right.effectiveDate) result = 0;
        else if (!left.effectiveDate) return 1;
        else if (!right.effectiveDate) return -1;
        else result = left.effectiveDate < right.effectiveDate ? -1 : left.effectiveDate > right.effectiveDate ? 1 : 0;
        break;
      case "updated":
        result = left.updatedAt < right.updatedAt ? -1 : left.updatedAt > right.updatedAt ? 1 : 0;
        break;
    }
    if (result === 0) result = compareText(left.id, right.id);
    return result * direction;
  });
}
