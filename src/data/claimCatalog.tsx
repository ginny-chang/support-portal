import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { ClaimType, QualityClaim } from "./claims";
import { claims } from "./claims";

const CURRENT_USER = "Roger Lo";

export interface NewClaimInput {
  product: string;
  assembly: string;
  claimType: ClaimType;
  dealer: string;
  description: string;
}

interface ClaimCatalogValue {
  records: QualityClaim[];
  addClaim: (input: NewClaimInput) => string;
}

const ClaimCatalogContext = createContext<ClaimCatalogValue>({
  records: claims,
  addClaim: () => "",
});

function nextId(records: QualityClaim[]): string {
  const highest = records.reduce((max, record) => {
    const value = Number(record.id.replace("QC-SB-", ""));
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);
  return `QC-SB-${String(highest + 1).padStart(5, "0")}`;
}

function taipeiStamp(date = new Date()): string {
  const shifted = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  return shifted.toISOString().slice(0, 16);
}

export function ClaimCatalogProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<QualityClaim[]>(claims);
  const value = useMemo<ClaimCatalogValue>(
    () => ({
      records,
      addClaim(input) {
        const id = nextId(records);
        const record: QualityClaim = {
          id,
          product: input.product.trim(),
          assembly: input.assembly.trim(),
          claimType: input.claimType,
          dealer: input.dealer.trim(),
          description: input.description.trim(),
          status: "draft",
          owner: CURRENT_USER,
          updatedAt: taipeiStamp(),
          decisions: [],
          fulfillment: [],
        };
        setRecords((current) => [record, ...current]);
        return id;
      },
    }),
    [records],
  );
  return <ClaimCatalogContext.Provider value={value}>{children}</ClaimCatalogContext.Provider>;
}

export function useClaims(): ClaimCatalogValue {
  return useContext(ClaimCatalogContext);
}
