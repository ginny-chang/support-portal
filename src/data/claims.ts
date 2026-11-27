import type { FulfillmentEvidence, TicketDecision, WorkOrderStatus } from "./workOrders";

export type ClaimType = "Warranty" | "Quality" | "Damage";

export interface ClaimDecision {
  description: string;
  decision: TicketDecision;
  quantity: number;
  reason: string;
}

export interface ClaimFulfillment {
  evidence: FulfillmentEvidence;
  at: string;
  actor: string;
}

export interface QualityClaim {
  id: string;
  product: string;
  assembly: string;
  claimType: ClaimType;
  dealer: string;
  description: string;
  status: WorkOrderStatus;
  owner: string;
  updatedAt: string;
  decisions: ClaimDecision[];
  fulfillment: ClaimFulfillment[];
}

export const claims: QualityClaim[] = [
  {
    id: "QC-SB-26018",
    product: "TCR Advanced SL",
    assembly: "",
    claimType: "Warranty",
    dealer: "Giant Taipei",
    description: "Frame crack at the seat cluster within the warranty period",
    status: "in_review",
    owner: "Roger Lo",
    updatedAt: "2026-11-18T11:20",
    decisions: [],
    fulfillment: [],
  },
  {
    id: "QC-SB-26014",
    product: "",
    assembly: "Disc brake assembly",
    claimType: "Quality",
    dealer: "Giant Taichung",
    description: "Brake hose weep after the first service",
    status: "draft",
    owner: "Mars Lin",
    updatedAt: "2026-11-12T09:40",
    decisions: [],
    fulfillment: [],
  },
  {
    id: "QC-SB-26009",
    product: "Propel Advanced SL",
    assembly: "",
    claimType: "Damage",
    dealer: "Giant Kaohsiung",
    description: "Rear wheel impact damage reported by the rider",
    status: "resolved",
    owner: "Iris Chang",
    updatedAt: "2026-10-02T16:05",
    decisions: [
      {
        description: "Rear wheel",
        decision: "rejected",
        quantity: 0,
        reason: "Impact damage is outside the quality claim.",
      },
    ],
    fulfillment: [],
  },
  {
    id: "QC-SB-26006",
    product: "Defy Advanced Pro",
    assembly: "",
    claimType: "Warranty",
    dealer: "Giant Kaohsiung",
    description: "Warranty credit for a leaking caliper",
    status: "closed",
    owner: "Mars Lin",
    updatedAt: "2026-09-20T11:15",
    decisions: [
      {
        description: "Disc brake caliper",
        decision: "approved",
        quantity: 1,
        reason: "Credit amount approved for the leaking caliper.",
      },
    ],
    fulfillment: [{ evidence: "Credit posted", at: "2026-09-20T11:00", actor: "Brian Wu" }],
  },
];
