import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { WorkOrderLine, WorkOrderRecord, WorkOrderStatus } from "./workOrders";
import { workOrders } from "./workOrders";
import { canRun, ruleFor, WORK_ORDER_ACTOR } from "./workOrderRules";

const CURRENT_USER = WORK_ORDER_ACTOR;

export type WorkOrderCommand =
  | { action: "submit" }
  | { action: "approve" }
  | { action: "reject"; reason: string }
  | { action: "cancel"; reason: string }
  | { action: "reassign"; assignee: string; reason: string }
  | { action: "reopen"; reason: string }
  | { action: "change_approved"; partId: string; quantity: number; amount: number; reason: string };

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
  currentUser: string;
  addWorkOrder: (input: NewWorkOrderInput) => string;
  runAction: (id: string, command: WorkOrderCommand) => boolean;
}

const WorkOrderCatalogContext = createContext<WorkOrderCatalogValue>({
  records: workOrders,
  currentUser: CURRENT_USER,
  addWorkOrder: () => "",
  runAction: () => false,
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
      currentUser: CURRENT_USER,
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
          lines: input.lines.map((line) => ({ ...line, approvedQuantity: null, approvedAmount: null })),
          relatedIds: [],
          assignments: [{ at: updatedAt, actor: CURRENT_USER, assignee: CURRENT_USER }],
          internalNotes: [],
          applicantMessages: [{ at: updatedAt, author: dealer, body: request }],
          attachments: [],
          statusHistory: [{ at: updatedAt, actor: CURRENT_USER, status: "draft", change: "Saved draft" }],
        };
        setRecords((current) => [record, ...current]);
        return id;
      },
      runAction(id, command) {
        const source = records.find((item) => item.id === id);
        if (!source || !canRun(command.action, source, CURRENT_USER)) return false;
        if (ruleFor(command.action).reason && !reasonOf(command)) return false;
        const at = taipeiStamp();
        setRecords((current) => current.map((record) => (record.id === id ? applyCommand(record, command, at) : record)));
        return true;
      },
    }),
    [records],
  );
  return <WorkOrderCatalogContext.Provider value={value}>{children}</WorkOrderCatalogContext.Provider>;
}

function reasonOf(command: WorkOrderCommand): string {
  if (command.action === "reject" || command.action === "cancel" || command.action === "reopen" || command.action === "reassign" || command.action === "change_approved") {
    return command.reason.trim();
  }
  return "";
}

function withStatus(record: WorkOrderRecord, status: WorkOrderStatus, change: string, at: string, reason?: string): WorkOrderRecord {
  return {
    ...record,
    status,
    updatedAt: at,
    statusHistory: [...record.statusHistory, { at, actor: CURRENT_USER, status, change, reason: reason || undefined }],
  };
}

function applyCommand(record: WorkOrderRecord, command: WorkOrderCommand, at: string): WorkOrderRecord {
  switch (command.action) {
    case "submit":
      return withStatus(record, "in_review", "Submitted for review", at);
    case "approve":
      return withStatus(
        {
          ...record,
          lines: record.lines.map((line) => ({
            ...line,
            approvedQuantity: line.approvedQuantity ?? line.quantity,
          })),
        },
        "approved",
        "Approved",
        at,
      );
    case "reject":
      return withStatus(record, "rejected", "Rejected", at, command.reason.trim());
    case "cancel":
      return withStatus(record, "cancelled", "Cancelled", at, command.reason.trim());
    case "reopen":
      return withStatus(record, "reopened", "Reopened", at, command.reason.trim());
    case "reassign": {
      const reason = command.reason.trim();
      return withStatus(
        {
          ...record,
          assignments: [...record.assignments, { at, actor: CURRENT_USER, assignee: command.assignee, reason }],
        },
        record.status,
        `Reassigned to ${command.assignee}`,
        at,
        reason,
      );
    }
    case "change_approved": {
      const reason = command.reason.trim();
      const previous = record.lines.find((line) => line.partId === command.partId);
      return withStatus(
        {
          ...record,
          lines: record.lines.map((line) =>
            line.partId === command.partId ? { ...line, approvedQuantity: command.quantity, approvedAmount: command.amount } : line,
          ),
        },
        record.status,
        `Changed approved quantity or amount for ${command.partId}`,
        at,
        `${reason} Quantity ${previous?.approvedQuantity ?? "—"} to ${command.quantity}. Amount ${previous?.approvedAmount ?? "—"} to ${command.amount}.`,
      );
    }
  }
}

export function useWorkOrders(): WorkOrderCatalogValue {
  return useContext(WorkOrderCatalogContext);
}
