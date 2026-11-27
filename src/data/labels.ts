import type { BomStatus, Serviceability } from "./bom";
import type { WorkOrderStatus } from "./workOrders";

export type TagTone =
  | "draft"
  | "review"
  | "released"
  | "superseded"
  | "obsolete"
  | "serviceable"
  | "replaceable"
  | "consumable"
  | "assembly"
  | "approved"
  | "rejected"
  | "cancelled"
  | "submitted"
  | "awaiting"
  | "fulfillment"
  | "resolved"
  | "closed";

export function statusLabel(status: BomStatus): string {
  switch (status) {
    case "draft":
      return "Draft";
    case "in_review":
      return "In Review";
    case "released":
      return "Released";
    case "superseded":
      return "Superseded";
    case "obsolete":
      return "Obsolete";
  }
}

export function workOrderStatusLabel(status: WorkOrderStatus): string {
  switch (status) {
    case "draft":
      return "Draft";
    case "submitted":
      return "Submitted";
    case "in_review":
      return "In review";
    case "awaiting_information":
      return "Awaiting information";
    case "approved":
      return "Approved";
    case "in_fulfillment":
      return "In fulfillment";
    case "resolved":
      return "Resolved";
    case "closed":
      return "Closed";
    case "cancelled":
      return "Cancelled";
  }
}

export function workOrderStatusTone(status: WorkOrderStatus): TagTone {
  switch (status) {
    case "draft":
      return "draft";
    case "submitted":
      return "submitted";
    case "in_review":
      return "review";
    case "awaiting_information":
      return "awaiting";
    case "approved":
      return "approved";
    case "in_fulfillment":
      return "fulfillment";
    case "resolved":
      return "resolved";
    case "closed":
      return "closed";
    case "cancelled":
      return "cancelled";
  }
}

export function decisionLabel(decision: "approved" | "partially_approved" | "rejected"): string {
  switch (decision) {
    case "approved":
      return "Approved";
    case "partially_approved":
      return "Partially approved";
    case "rejected":
      return "Rejected";
  }
}

export function decisionTone(decision: "approved" | "partially_approved" | "rejected"): TagTone {
  switch (decision) {
    case "approved":
      return "approved";
    case "partially_approved":
      return "awaiting";
    case "rejected":
      return "rejected";
  }
}

export function statusTone(status: BomStatus): TagTone {
  switch (status) {
    case "draft":
      return "draft";
    case "in_review":
      return "review";
    case "released":
      return "released";
    case "superseded":
      return "superseded";
    case "obsolete":
      return "obsolete";
  }
}

export function serviceabilityLabel(value: Serviceability): string {
  switch (value) {
    case "serviceable":
      return "Serviceable";
    case "replaceable":
      return "Replaceable";
    case "consumable":
      return "Consumable";
    case "assembly":
      return "Assembly replacement";
  }
}

export function serviceabilityTone(value: Serviceability): TagTone {
  switch (value) {
    case "serviceable":
      return "serviceable";
    case "replaceable":
      return "replaceable";
    case "consumable":
      return "consumable";
    case "assembly":
      return "assembly";
  }
}

export const STATUS_SORT: Record<BomStatus, number> = {
  draft: 0,
  in_review: 1,
  released: 2,
  superseded: 3,
  obsolete: 4,
};
