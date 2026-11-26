import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { boms } from "./bom";
import type { Applicability, BomLine, BomRecord } from "./bom";

const CURRENT_USER = "陳宜安";

export interface NewBomInput {
  product: string;
  assembly: string;
  revision: string;
  lines: BomLine[];
  applicability: Applicability;
}

interface BomCatalogValue {
  records: BomRecord[];
  addBom: (input: NewBomInput) => string;
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

export function BomCatalogProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<BomRecord[]>(boms);
  const value = useMemo<BomCatalogValue>(
    () => ({
      records,
      addBom(input) {
        const id = nextId(records);
        const updatedAt = taipeiStamp();
        const record: BomRecord = {
          id,
          product: input.product,
          assembly: input.assembly,
          revision: input.revision,
          status: "draft",
          owner: CURRENT_USER,
          effectiveDate: null,
          updatedAt,
          lines: input.lines,
          applicability: input.applicability,
          supersessions: [],
          audit: [{ at: updatedAt, actor: CURRENT_USER, action: "Create draft" }],
        };
        setRecords((current) => [record, ...current]);
        return id;
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
