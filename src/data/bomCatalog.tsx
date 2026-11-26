import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { boms } from "./bom";
import type { Applicability, BomLine, BomRecord, BomStatus } from "./bom";
import { nextRevision } from "./bomRules";

const CURRENT_USER = "陳宜安";

export interface BomWriteInput {
  product: string;
  assembly: string;
  revision: string;
  reason: string;
  lines: BomLine[];
  applicability: Applicability;
}

interface BomCatalogValue {
  records: BomRecord[];
  addBom: (input: BomWriteInput) => string;
  updateBom: (id: string, input: BomWriteInput) => string;
  submitForReview: (id: string, reason: string) => void;
  releaseBom: (id: string, input: { approver: string; effectiveDate: string; change: string }) => void;
}

const BomCatalogContext = createContext<BomCatalogValue | null>(null);

function nextId(records: BomRecord[]): string {
  const highest = records.reduce((max, record) => {
    const value = Number(record.id.replace("BOM-SB-", ""));
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);
  return `BOM-SB-${String(highest + 1).padStart(5, "0")}`;
}

function taipeiStamp(date = new Date()): string {
  const shifted = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  return shifted.toISOString().slice(0, 16);
}

function draftFrom(id: string, input: BomWriteInput, updatedAt: string, action: string): BomRecord {
  return {
    id,
    product: input.product.trim(),
    assembly: input.assembly.trim(),
    revision: input.revision,
    status: "draft",
    owner: CURRENT_USER,
    effectiveDate: null,
    updatedAt,
    lines: input.lines,
    applicability: input.applicability,
    supersessions: [],
    audit: [{ at: updatedAt, actor: CURRENT_USER, action }],
  };
}

export function BomCatalogProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<BomRecord[]>(boms);
  const value = useMemo<BomCatalogValue>(
    () => ({
      records,
      addBom(input) {
        const id = nextId(records);
        const updatedAt = taipeiStamp();
        const record = draftFrom(id, input, updatedAt, `Create draft — ${input.reason.trim()}`);
        setRecords((current) => [record, ...current]);
        return id;
      },
      updateBom(id, input) {
        const source = records.find((record) => record.id === id);
        if (!source) return id;
        const updatedAt = taipeiStamp();
        if (source.status === "released" || source.status === "superseded" || source.status === "obsolete") {
          const next = nextId(records);
          const record = draftFrom(
            next,
            {
              ...input,
              product: source.product,
              assembly: source.assembly,
              revision: input.revision.trim() || nextRevision(source.revision),
            },
            updatedAt,
            `New revision from ${source.id} ${source.revision} — ${input.reason.trim()}`,
          );
          setRecords((current) => [record, ...current]);
          return next;
        }
        setRecords((current) =>
          current.map((record) =>
            record.id === id
              ? {
                  ...record,
                  product: input.product.trim(),
                  assembly: input.assembly.trim(),
                  revision: input.revision,
                  lines: input.lines,
                  applicability: input.applicability,
                  updatedAt,
                  audit: [...record.audit, { at: updatedAt, actor: CURRENT_USER, action: `Update — ${input.reason.trim()}` }],
                }
              : record,
          ),
        );
        return id;
      },
      submitForReview(id, reason) {
        const updatedAt = taipeiStamp();
        setRecords((current) =>
          current.map((record) =>
            record.id === id && record.status === "draft"
              ? {
                  ...record,
                  status: "in_review",
                  updatedAt,
                  audit: [...record.audit, { at: updatedAt, actor: CURRENT_USER, action: `Submit for review — ${reason.trim()}` }],
                }
              : record,
          ),
        );
      },
      releaseBom(id, input) {
        const source = records.find((record) => record.id === id);
        if (!source || source.status !== "in_review") return;
        const updatedAt = taipeiStamp();
        const action = `Release — ${input.approver.trim()}, effective ${input.effectiveDate}. ${input.change.trim()}`;
        setRecords((current) =>
          current.map((record) => {
            if (record.id === id) {
              return {
                ...record,
                status: "released" as BomStatus,
                effectiveDate: input.effectiveDate,
                updatedAt,
                audit: [...record.audit, { at: updatedAt, actor: input.approver.trim(), action }],
              };
            }
            if (
              record.product === source.product &&
              record.assembly === source.assembly &&
              record.status === "released"
            ) {
              return {
                ...record,
                status: "superseded" as BomStatus,
                supersededBy: id,
                updatedAt,
                audit: [...record.audit, { at: updatedAt, actor: input.approver.trim(), action: `Superseded by ${id}` }],
              };
            }
            return record;
          }),
        );
      },
    }),
    [records],
  );
  return <BomCatalogContext.Provider value={value}>{children}</BomCatalogContext.Provider>;
}

export function useBomCatalog(): BomCatalogValue {
  const value = useContext(BomCatalogContext);
  if (!value) throw new Error("BOM catalog is missing");
  return value;
}
