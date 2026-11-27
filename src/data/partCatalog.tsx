import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { Serviceability } from "./bom";
import type { SparePart } from "./parts";
import { parts } from "./parts";

const CURRENT_USER = "Roger Lo";

export interface NewPartInput {
  partId: string;
  description: string;
  quantity: number;
  unit: string;
  location: string;
  serviceability: Serviceability;
}

interface PartCatalogValue {
  records: SparePart[];
  addPart: (input: NewPartInput) => string;
}

const PartCatalogContext = createContext<PartCatalogValue>({
  records: parts,
  addPart: () => "",
});

function taipeiStamp(date = new Date()): string {
  const shifted = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  return shifted.toISOString().slice(0, 16);
}

export function PartCatalogProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<SparePart[]>(parts);
  const value = useMemo<PartCatalogValue>(
    () => ({
      records,
      addPart(input) {
        const partId = input.partId.trim();
        const record: SparePart = {
          partId,
          description: input.description.trim(),
          quantity: input.quantity,
          unit: input.unit,
          location: input.location.trim(),
          serviceability: input.serviceability,
          owner: CURRENT_USER,
          updatedAt: taipeiStamp(),
        };
        setRecords((current) => [record, ...current.filter((item) => item.partId !== partId)]);
        return partId;
      },
    }),
    [records],
  );
  return <PartCatalogContext.Provider value={value}>{children}</PartCatalogContext.Provider>;
}

export function useParts(): PartCatalogValue {
  return useContext(PartCatalogContext);
}
