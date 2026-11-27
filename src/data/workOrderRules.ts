import type { WorkOrderRecord, WorkOrderStatus } from "./workOrders";

export const WORK_ORDER_ACTOR = "Roger Lo";

export const INTERNAL_ASSIGNEES = ["Roger Lo", "Mars Lin", "Kevin Huang", "Iris Chang", "Brian Wu"];

export type WorkOrderAction = "submit" | "approve" | "reject" | "cancel" | "reassign" | "reopen" | "change_approved";

export interface TransitionRule {
  action: WorkOrderAction;
  label: string;
  from: WorkOrderStatus[];
  to: string;
  who: string;
  reason: boolean;
}

export const transitionRules: TransitionRule[] = [
  {
    action: "submit",
    label: "Submit for review",
    from: ["draft", "reopened"],
    to: "In Review",
    who: "Current assignee",
    reason: false,
  },
  {
    action: "approve",
    label: "Approve",
    from: ["in_review"],
    to: "Approved",
    who: "Internal user, not the applicant",
    reason: false,
  },
  {
    action: "reject",
    label: "Reject",
    from: ["in_review", "reopened"],
    to: "Rejected",
    who: "Current assignee, not the applicant",
    reason: true,
  },
  {
    action: "cancel",
    label: "Cancel",
    from: ["draft", "in_review", "reopened"],
    to: "Cancelled",
    who: "Applicant or current assignee",
    reason: true,
  },
  {
    action: "reassign",
    label: "Reassign",
    from: ["draft", "in_review", "approved", "reopened"],
    to: "Same status",
    who: "Current assignee, not the applicant",
    reason: true,
  },
  {
    action: "reopen",
    label: "Reopen",
    from: ["rejected", "cancelled", "approved"],
    to: "Reopened",
    who: "Current assignee or owner, not the applicant",
    reason: true,
  },
  {
    action: "change_approved",
    label: "Change approved quantity or amount",
    from: ["approved", "reopened"],
    to: "Same status",
    who: "Current assignee, not the applicant",
    reason: true,
  },
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
      return isAssignee;
    case "approve":
      return internal && !isApplicant;
    case "reject":
    case "reassign":
    case "change_approved":
      return isAssignee && !isApplicant;
    case "cancel":
      return isApplicant || isAssignee;
    case "reopen":
      return (isAssignee || isOwner) && !isApplicant;
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
