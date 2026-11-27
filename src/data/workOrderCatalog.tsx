import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { WorkOrderLine, WorkOrderRecord } from "./workOrders";
import { workOrders } from "./workOrders";

const CURRENT_USER = "Roger Lo";

export interface NewWorkOrderInput {
  bomId: string;
  product: string;
  assembly: string;
  serialNumber: string;
  dealer: string;
  request: string;
  lines: WorkOrderLine[];
}

interface WorkOrderCatalogValue {
  records: WorkOrderRecord[];
  addWorkOrder: (input: NewWorkOrderInput) => string;
}

const WorkOrderCatalogContext = createContext<WorkOrderCatalogValue>({
  records: workOrders,
  addWorkOrder: () => "",
});

function nextId(records: WorkOrderRecord[]): string {
  const highest = records.reduce((max, record) => {
    const value = Number(record.id.replace("WO-SB-", ""));
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);
  return `WO-SB-${String(highest + 1).padStart(5, "0")}`;
}

function taipeiStamp(date = new Date()): string {
  const shifted = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  return shifted.toISOString().slice(0, 16);
}

export function WorkOrderCatalogProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<WorkOrderRecord[]>(workOrders);
  const value = useMemo<WorkOrderCatalogValue>(
    () => ({
      records,
      addWorkOrder(input) {
        const id = nextId(records);
        const updatedAt = taipeiStamp();
        const dealer = input.dealer.trim();
        const request = input.request.trim();
        const record: WorkOrderRecord = {
          id,
          bomId: input.bomId,
          product: input.product,
          assembly: input.assembly,
          serialNumber: input.serialNumber.trim(),
          dealer,
          applicant: dealer,
          request,
          status: "draft",
          owner: CURRENT_USER,
          updatedAt,
          lines: input.lines,
          assignments: [{ at: updatedAt, actor: CURRENT_USER, assignee: CURRENT_USER }],
          internalNotes: [],
          applicantMessages: [{ at: updatedAt, author: dealer, body: request }],
          attachments: [],
          statusHistory: [{ at: updatedAt, actor: CURRENT_USER, status: "draft", change: "Saved draft" }],
        };
        setRecords((current) => [record, ...current]);
        return id;
      },
    }),
    [records],
  );
  return <WorkOrderCatalogContext.Provider value={value}>{children}</WorkOrderCatalogContext.Provider>;
}

export function useWorkOrders(): WorkOrderCatalogValue {
  return useContext(WorkOrderCatalogContext);
}
