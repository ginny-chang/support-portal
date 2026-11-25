import type { BomRecord, BomStatus } from "./bom";
import { STATUS_SORT } from "./labels";
import { normalizeSearch } from "./format";

export type TabId = "all" | "draft" | "in_review" | "released" | "retired";
export type ExactStatus = "" | "superseded" | "obsolete";
export type SortKey = "id" | "product" | "revision" | "status" | "owner" | "effective" | "updated";
export type SortDir = "asc" | "desc";

export interface BomQuery {
  tab: TabId;
  q: string;
  rev: string;
  from: string;
  to: string;
  exact: ExactStatus;
  sort: SortKey;
  dir: SortDir;
}

export const defaultQuery: BomQuery = {
  tab: "all",
  q: "",
  rev: "",
  from: "",
  to: "",
  exact: "",
  sort: "updated",
  dir: "desc",
};

const tabs = new Set<TabId>(["all", "draft", "in_review", "released", "retired"]);
const sorts = new Set<SortKey>(["id", "product", "revision", "status", "owner", "effective", "updated"]);

export function parseQuery(params: URLSearchParams): BomQuery {
  const tab = params.get("tab");
  const sort = params.get("sort");
  const dir = params.get("dir");
  const exact = params.get("exact");
  return {
    tab: tab && tabs.has(tab as TabId) ? (tab as TabId) : "all",
    q: params.get("q") ?? "",
    rev: params.get("rev") ?? "",
    from: params.get("from") ?? "",
    to: params.get("to") ?? "",
    exact: exact === "superseded" || exact === "obsolete" ? exact : "",
    sort: sort && sorts.has(sort as SortKey) ? (sort as SortKey) : "updated",
    dir: dir === "asc" || dir === "desc" ? dir : "desc",
  };
}

export function toSearchParams(query: BomQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.tab !== "all") params.set("tab", query.tab);
  if (query.q) params.set("q", query.q);
  if (query.rev) params.set("rev", query.rev);
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  if (query.exact) params.set("exact", query.exact);
  if (query.sort !== "updated") params.set("sort", query.sort);
  if (query.dir !== "desc") params.set("dir", query.dir);
  return params;
}

export function activeFilterCount(query: BomQuery): number {
  return [query.rev, query.from, query.to, query.exact].filter(Boolean).length;
}

export function statusValue(query: BomQuery): string {
  if (query.exact) return query.exact;
  return query.tab;
}

export function statusPartial(value: string): Partial<BomQuery> {
  if (value === "superseded" || value === "obsolete") {
    return { tab: "retired", exact: value };
  }
  const tab: TabId = value === "draft" || value === "in_review" || value === "released" || value === "retired" ? value : "all";
  return { tab, exact: "" };
}

function matchesTab(status: BomStatus, query: BomQuery): boolean {
  if (query.exact === "superseded") return status === "superseded";
  if (query.exact === "obsolete") return status === "obsolete";
  if (query.tab === "all") return true;
  if (query.tab === "retired") return status === "superseded" || status === "obsolete";
  return status === query.tab;
}

function haystack(record: BomRecord): string {
  return normalizeSearch(
    [
      record.id,
      record.product,
      record.assembly,
      record.owner,
      record.revision,
      record.applicability.model,
      record.applicability.category,
      ...record.lines.flatMap((line) => [line.partId, line.description]),
      ...record.supersessions.flatMap((item) => [item.fromPartId, item.toPartId]),
    ].join(" "),
  );
}

export function filterBoms(records: BomRecord[], query: BomQuery): BomRecord[] {
  const needle = normalizeSearch(query.q);
  return records.filter((record) => {
    if (!matchesTab(record.status, query)) return false;
    if (query.rev && record.revision !== query.rev) return false;
    if (query.from || query.to) {
      if (!record.effectiveDate) return false;
      if (query.from && record.effectiveDate < query.from) return false;
      if (query.to && record.effectiveDate > query.to) return false;
    }
    if (needle && !haystack(record).includes(needle)) return false;
    return true;
  });
}

function compareText(left: string, right: string): number {
  return left.localeCompare(right, "zh-Hant");
}

export function sortBoms(records: BomRecord[], query: BomQuery): BomRecord[] {
  const direction = query.dir === "asc" ? 1 : -1;
  return [...records].sort((left, right) => {
    let result = 0;
    switch (query.sort) {
      case "id":
        result = compareText(left.id, right.id);
        break;
      case "product":
        result = compareText(left.product, right.product) || compareText(left.assembly, right.assembly);
        break;
      case "revision":
        result = compareText(left.revision, right.revision);
        break;
      case "status":
        result = STATUS_SORT[left.status] - STATUS_SORT[right.status];
        break;
      case "owner":
        result = compareText(left.owner, right.owner);
        break;
      case "effective":
        if (left.effectiveDate === right.effectiveDate) result = 0;
        else if (!left.effectiveDate) return 1;
        else if (!right.effectiveDate) return -1;
        else result = left.effectiveDate < right.effectiveDate ? -1 : 1;
        break;
      case "updated":
        result = left.updatedAt < right.updatedAt ? -1 : left.updatedAt > right.updatedAt ? 1 : 0;
        break;
    }
    if (result === 0) result = compareText(left.id, right.id);
    return result * direction;
  });
}
