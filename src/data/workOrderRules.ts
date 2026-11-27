import type { WorkOrderRecord, WorkOrderStatus } from "./workOrders";

export const WORK_ORDER_ACTOR = "Roger Lo";

export const INTERNAL_ASSIGNEES = ["Roger Lo", "Mars Lin", "Kevin Huang", "Iris Chang", "Brian Wu"];

export type WorkOrderAction =
  | "submit"
  | "review"
  | "await_information"
  | "review_claim"
  | "approve"
  | "reject"
  | "fulfill_replacement"
  | "close"
  | "cancel"
  | "reassign"
  | "reopen"
  | "change_approved";

export interface TransitionRule {
  action: WorkOrderAction;
  label: string;
  from: WorkOrderStatus[];
  to: string;
  who: string;
  reason: boolean;
}

export const transitionRules: TransitionRule[] = [
  { action: "submit", label: "Submit", from: ["draft"], to: "Submitted", who: "Service Operations", reason: false },
  { action: "review", label: "Assign for review", from: ["submitted", "awaiting_information"], to: "In review", who: "Service Operations", reason: false },
  { action: "review_claim", label: "Review claim", from: ["submitted", "awaiting_information"], to: "In review", who: "Quality", reason: false },
  { action: "await_information", label: "Await information", from: ["in_review"], to: "Awaiting information", who: "Service Operations", reason: false },
  { action: "approve", label: "Approve", from: ["in_review"], to: "Approved", who: "Finance", reason: false },
  { action: "reject", label: "Reject", from: ["in_review"], to: "Resolved", who: "Quality", reason: true },
  { action: "fulfill_replacement", label: "Fulfill replacement", from: ["approved"], to: "In fulfillment", who: "Parts and Logistics", reason: false },
  { action: "close", label: "Close", from: ["resolved"], to: "Closed", who: "Service Operations", reason: false },
  { action: "cancel", label: "Cancel", from: ["draft", "submitted", "in_review", "awaiting_information"], to: "Cancelled", who: "Service Operations", reason: true },
  { action: "reassign", label: "Reassign", from: ["submitted", "in_review", "awaiting_information", "approved", "in_fulfillment"], to: "Same status", who: "Service Operations", reason: true },
  { action: "reopen", label: "Reopen", from: ["resolved", "closed"], to: "In review", who: "Service Operations", reason: true },
  { action: "change_approved", label: "Change approved quantity or amount", from: ["approved", "in_fulfillment"], to: "Same status", who: "Finance", reason: true },
];

export function currentAssignee(record: WorkOrderRecord): string {
  const latest = [...record.assignments].sort((left, right) => right.at.localeCompare(left.at))[0];
  return latest?.assignee ?? record.owner;
}

export function ruleFor(action: WorkOrderAction): TransitionRule {
  const rule = transitionRules.find((item) => item.action === action);
  if (!rule) throw new Error(`Missing transition rule for ${action}`);
  return rule;
}

export function canRun(action: WorkOrderAction, record: WorkOrderRecord, actor: string): boolean {
  const rule = ruleFor(action);
  if (!rule.from.includes(record.status)) return false;
  const assignee = currentAssignee(record);
  const isApplicant = actor === record.applicant;
  const isAssignee = actor === assignee;
  const isOwner = actor === record.owner;
  const internal = INTERNAL_ASSIGNEES.includes(actor);
  switch (action) {
    case "submit":
    case "review":
    case "await_information":
    case "cancel":
    case "reassign":
    case "close":
    case "reopen":
      return isAssignee || isOwner;
    case "review_claim":
    case "reject":
      return internal && !isApplicant;
    case "approve":
    case "change_approved":
    case "fulfill_replacement":
      return internal && !isApplicant;
  }
}

export function possibleDuplicates(record: WorkOrderRecord, records: WorkOrderRecord[]): WorkOrderRecord[] {
  const parts = new Set(record.lines.map((line) => line.partId));
  return records.filter((other) => {
    if (other.id === record.id) return false;
    if (other.serialNumber !== record.serialNumber) return false;
    const sharesPart = other.lines.some((line) => parts.has(line.partId));
    const sameRequest = other.request.trim().toLowerCase() === record.request.trim().toLowerCase();
    return sharesPart || sameRequest;
  });
}

export function linkedWorkOrders(record: WorkOrderRecord, records: WorkOrderRecord[]): WorkOrderRecord[] {
  const ids = new Set(record.relatedIds);
  return records.filter((other) => other.id !== record.id && (ids.has(other.id) || other.relatedIds.includes(record.id)));
}
