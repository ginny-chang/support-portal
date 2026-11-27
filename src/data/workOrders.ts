export type WorkOrderStatus =
  | "draft"
  | "submitted"
  | "in_review"
  | "awaiting_information"
  | "approved"
  | "in_fulfillment"
  | "resolved"
  | "closed"
  | "cancelled";

export type TicketDecision = "approved" | "partially_approved" | "rejected";

export type FulfillmentEvidence = "Credit posted" | "Replacement delivered";

export interface WorkOrderLine {
  partId: string;
  description: string;
  quantity: number;
  unit: string;
  approvedQuantity: number | null;
  approvedAmount: number | null;
  decision: TicketDecision | null;
  decisionQuantity: number | null;
  decisionReason: string;
}

export interface WorkOrderFulfillment {
  evidence: FulfillmentEvidence;
  at: string;
  actor: string;
}

export interface WorkOrderAssignment {
  at: string;
  actor: string;
  assignee: string;
  reason?: string;
}

export interface WorkOrderMessage {
  at: string;
  author: string;
  body: string;
}

export interface WorkOrderAttachment {
  name: string;
  at: string;
  addedBy: string;
}

export interface WorkOrderStatusEvent {
  at: string;
  actor: string;
  status: WorkOrderStatus;
  change: string;
  reason?: string;
}

export interface WorkOrderRecord {
  id: string;
  bomId: string;
  product: string;
  assembly: string;
  serialNumber: string;
  dealer: string;
  applicant: string;
  request: string;
  status: WorkOrderStatus;
  owner: string;
  updatedAt: string;
  lines: WorkOrderLine[];
  relatedIds: string[];
  assignments: WorkOrderAssignment[];
  internalNotes: WorkOrderMessage[];
  applicantMessages: WorkOrderMessage[];
  attachments: WorkOrderAttachment[];
  fulfillment: WorkOrderFulfillment[];
  statusHistory: WorkOrderStatusEvent[];
}

export const workOrders: WorkOrderRecord[] = [
  {
    id: "WO-SB-26021",
    bomId: "BOM-SB-26014",
    product: "TCR Advanced SL",
    assembly: "Frame assembly",
    serialNumber: "YS482193",
    dealer: "Giant Taipei",
    applicant: "Elena Wu",
    request: "Rear dropout play after a crash",
    status: "in_review",
    owner: "Roger Lo",
    updatedAt: "2026-11-20T14:12",
    lines: [{ partId: "SP-FR-4418", description: "Rear dropout, right", quantity: 1, unit: "ea", approvedQuantity: null, approvedAmount: null, decision: null, decisionQuantity: null, decisionReason: "" }],
    relatedIds: ["WO-SB-26019"],
    assignments: [
      { at: "2026-11-18T09:40", actor: "Kevin Huang", assignee: "Kevin Huang" },
      { at: "2026-11-18T11:20", actor: "Kevin Huang", assignee: "Roger Lo" },
    ],
    internalNotes: [
      {
        at: "2026-11-19T15:10",
        author: "Roger Lo",
        body: "Dropout threads are stripped. Hold the right-side dropout from BOM-SB-26014 until the shop confirms the frame is still on site.",
      },
      {
        at: "2026-11-20T14:05",
        author: "Roger Lo",
        body: "Shop confirmation is in. Ready to send this for review.",
      },
    ],
    applicantMessages: [
      {
        at: "2026-11-18T09:05",
        author: "Elena Wu",
        body: "Rear dropout play after a crash. The wheel no longer sits straight.",
      },
      {
        at: "2026-11-20T10:02",
        author: "Roger Lo",
        body: "We can replace the right rear dropout. Please confirm the bike is still at Giant Taipei.",
      },
      {
        at: "2026-11-20T13:40",
        author: "Elena Wu",
        body: "The bike is at the shop. Please proceed.",
      },
    ],
    attachments: [
      { name: "dropout-right.jpg", at: "2026-11-19T15:12", addedBy: "Roger Lo" },
      { name: "dropout-left.png", at: "2026-11-19T15:14", addedBy: "Roger Lo" },
      { name: "inspection-notes.txt", at: "2026-11-19T16:02", addedBy: "Roger Lo" },
      { name: "shop-check.pdf", at: "2026-11-20T13:41", addedBy: "Elena Wu" },
      { name: "estimate.docx", at: "2026-11-20T13:48", addedBy: "Elena Wu" },
      { name: "dropout-play.mp4", at: "2026-11-20T13:55", addedBy: "Elena Wu" },
      { name: "shop-walkthrough.mov", at: "2026-11-20T14:02", addedBy: "Elena Wu" },
    ],
    fulfillment: [],
    statusHistory: [
      { at: "2026-11-18T09:05", actor: "Elena Wu", status: "draft", change: "Saved draft" },
      { at: "2026-11-18T09:40", actor: "Kevin Huang", status: "submitted", change: "Submitted" },
      { at: "2026-11-20T14:12", actor: "Roger Lo", status: "in_review", change: "Assigned for review" },
    ],
  },
  {
    id: "WO-SB-26018",
    bomId: "BOM-SB-26031",
    product: "Propel Advanced SL",
    assembly: "Wheelset assembly",
    serialNumber: "YP220184",
    dealer: "Giant Taichung",
    applicant: "Chris Yeh",
    request: "Replace the front hub after bearing wear",
    status: "draft",
    owner: "Iris Chang",
    updatedAt: "2026-11-18T10:15",
    lines: [{ partId: "SP-WH-7722", description: "Front hub", quantity: 1, unit: "ea", approvedQuantity: null, approvedAmount: null, decision: null, decisionQuantity: null, decisionReason: "" }],
    relatedIds: [],
    assignments: [{ at: "2026-11-18T09:40", actor: "Iris Chang", assignee: "Iris Chang" }],
    internalNotes: [
      {
        at: "2026-11-18T10:15",
        author: "Iris Chang",
        body: "Hub bearings are rough. Serial check is still open, so this stays a draft.",
      },
    ],
    applicantMessages: [
      {
        at: "2026-11-18T09:12",
        author: "Chris Yeh",
        body: "Replace the front hub after bearing wear. The wheel clicks under load.",
      },
    ],
    attachments: [],
    fulfillment: [],
    statusHistory: [{ at: "2026-11-18T09:12", actor: "Chris Yeh", status: "draft", change: "Saved draft" }],
  },
  {
    id: "WO-SB-26011",
    bomId: "BOM-SB-26022",
    product: "Defy Advanced Pro",
    assembly: "Disc brake assembly",
    serialNumber: "YD109332",
    dealer: "Giant Kaohsiung",
    applicant: "Nina Kuo",
    request: "Brake hose leak",
    status: "approved",
    owner: "Mars Lin",
    updatedAt: "2026-10-02T16:05",
    lines: [{ partId: "SP-BR-5128", description: "Brake hose", quantity: 2, unit: "set", approvedQuantity: 1, approvedAmount: 1860, decision: "partially_approved", decisionQuantity: 1, decisionReason: "One hose approved for the leak. The second hose is wear." }],
    relatedIds: [],
    assignments: [{ at: "2026-09-28T14:10", actor: "Kevin Huang", assignee: "Mars Lin" }],
    internalNotes: [
      {
        at: "2026-09-29T11:20",
        author: "Mars Lin",
        body: "Leak is at the caliper fitting. Hose from BOM-SB-26022 matches this serial.",
      },
    ],
    applicantMessages: [
      {
        at: "2026-09-28T11:00",
        author: "Nina Kuo",
        body: "Brake hose leak on the front caliper. The lever goes soft after a ride.",
      },
      {
        at: "2026-10-02T16:20",
        author: "Mars Lin",
        body: "The hose replacement is approved. Giant Kaohsiung can fit SP-BR-5128.",
      },
    ],
    attachments: [{ name: "brake-hose-leak.jpg", at: "2026-09-28T11:04", addedBy: "Nina Kuo" }],
    fulfillment: [],
    statusHistory: [
      { at: "2026-09-28T11:00", actor: "Nina Kuo", status: "draft", change: "Saved draft" },
      { at: "2026-09-28T14:10", actor: "Kevin Huang", status: "submitted", change: "Submitted" },
      { at: "2026-09-29T09:30", actor: "Mars Lin", status: "in_review", change: "Assigned for review" },
      { at: "2026-10-02T16:05", actor: "Brian Wu", status: "approved", change: "Approved" },
    ],
  },
  {
    id: "WO-SB-26019",
    bomId: "BOM-SB-26014",
    product: "TCR Advanced SL",
    assembly: "Frame assembly",
    serialNumber: "YS482193",
    dealer: "Giant Taipei",
    applicant: "Elena Wu",
    request: "Rear dropout play after a second impact",
    status: "in_review",
    owner: "Iris Chang",
    updatedAt: "2026-11-21T09:18",
    lines: [{ partId: "SP-FR-4418", description: "Rear dropout, right", quantity: 1, unit: "ea", approvedQuantity: null, approvedAmount: null, decision: null, decisionQuantity: null, decisionReason: "" }],
    relatedIds: ["WO-SB-26021"],
    assignments: [{ at: "2026-11-21T09:18", actor: "Kevin Huang", assignee: "Iris Chang" }],
    internalNotes: [
      {
        at: "2026-11-21T09:30",
        author: "Iris Chang",
        body: "Same serial and the same dropout as WO-SB-26021. The second impact is a separate failure, so this stays open.",
      },
    ],
    applicantMessages: [
      {
        at: "2026-11-21T08:50",
        author: "Elena Wu",
        body: "The dropout is loose again after another impact. This is a new request, not a replacement for the first one.",
      },
    ],
    attachments: [],
    fulfillment: [],
    statusHistory: [
      { at: "2026-11-21T08:50", actor: "Elena Wu", status: "draft", change: "Saved draft" },
      { at: "2026-11-21T09:00", actor: "Kevin Huang", status: "submitted", change: "Submitted" },
      { at: "2026-11-21T09:18", actor: "Iris Chang", status: "in_review", change: "Assigned for review" },
    ],
  },
  {
    id: "WO-SB-26008",
    bomId: "BOM-SB-26014",
    product: "TCR Advanced SL",
    assembly: "Frame assembly",
    serialNumber: "YS770441",
    dealer: "Giant Taipei",
    applicant: "Elena Wu",
    request: "Fork crown crack",
    status: "resolved",
    owner: "Kevin Huang",
    updatedAt: "2026-11-12T16:40",
    lines: [{ partId: "SP-FK-3301", description: "Fork", quantity: 1, unit: "ea", approvedQuantity: null, approvedAmount: null, decision: "rejected", decisionQuantity: 0, decisionReason: "Fork crown damage is outside this work order." }],
    relatedIds: [],
    assignments: [{ at: "2026-11-12T10:05", actor: "Kevin Huang", assignee: "Kevin Huang" }],
    internalNotes: [
      {
        at: "2026-11-12T16:20",
        author: "Kevin Huang",
        body: "The crack is in the fork crown, which this work order does not cover.",
      },
    ],
    applicantMessages: [
      {
        at: "2026-11-12T16:40",
        author: "Kevin Huang",
        body: "This request is rejected. The fork crown crack needs its own work order.",
      },
    ],
    attachments: [],
    fulfillment: [],
    statusHistory: [
      { at: "2026-11-12T09:40", actor: "Elena Wu", status: "draft", change: "Saved draft" },
      { at: "2026-11-12T10:00", actor: "Kevin Huang", status: "submitted", change: "Submitted" },
      { at: "2026-11-12T10:05", actor: "Kevin Huang", status: "in_review", change: "Assigned for review" },
      { at: "2026-11-12T16:40", actor: "Kevin Huang", status: "resolved", change: "Rejected", reason: "Fork crown damage is outside this work order." },
    ],
  },
  {
    id: "WO-SB-26005",
    bomId: "BOM-SB-26031",
    product: "Propel Advanced SL",
    assembly: "Wheelset assembly",
    serialNumber: "YP880210",
    dealer: "Giant Taichung",
    applicant: "Chris Yeh",
    request: "Replace the rear hub",
    status: "cancelled",
    owner: "Iris Chang",
    updatedAt: "2026-11-08T11:22",
    lines: [{ partId: "SP-WH-7723", description: "Rear hub", quantity: 1, unit: "ea", approvedQuantity: null, approvedAmount: null, decision: null, decisionQuantity: null, decisionReason: "" }],
    relatedIds: [],
    assignments: [{ at: "2026-11-08T09:10", actor: "Iris Chang", assignee: "Iris Chang" }],
    internalNotes: [],
    applicantMessages: [
      {
        at: "2026-11-08T11:22",
        author: "Chris Yeh",
        body: "Please cancel this request. The rider is keeping the wheel as it is.",
      },
    ],
    attachments: [],
    fulfillment: [],
    statusHistory: [
      { at: "2026-11-08T09:02", actor: "Chris Yeh", status: "draft", change: "Saved draft" },
      { at: "2026-11-08T09:10", actor: "Iris Chang", status: "submitted", change: "Submitted" },
      { at: "2026-11-08T11:22", actor: "Iris Chang", status: "cancelled", change: "Cancelled", reason: "The rider withdrew the request." },
    ],
  },
  {
    id: "WO-SB-26024",
    bomId: "BOM-SB-26022",
    product: "Defy Advanced Pro",
    assembly: "Disc brake assembly",
    serialNumber: "YD441908",
    dealer: "Giant Kaohsiung",
    applicant: "Nina Kuo",
    request: "Brake pad wear",
    status: "in_review",
    owner: "Roger Lo",
    updatedAt: "2026-11-26T15:05",
    lines: [{ partId: "SP-BR-5120", description: "Disc brake caliper", quantity: 1, unit: "ea", approvedQuantity: 1, approvedAmount: 420, decision: "approved", decisionQuantity: 1, decisionReason: "Caliper quantity approved before the visit was reopened." }],
    relatedIds: [],
    assignments: [
      { at: "2026-11-02T10:00", actor: "Kevin Huang", assignee: "Mars Lin" },
      { at: "2026-11-26T15:05", actor: "Roger Lo", assignee: "Roger Lo", reason: "Mars Lin is out. The pad quantity still needs a check." },
    ],
    internalNotes: [
      {
        at: "2026-11-26T15:05",
        author: "Roger Lo",
        body: "Reopened after the rider came back. The approved caliper was never fitted.",
      },
    ],
    applicantMessages: [
      {
        at: "2026-11-02T09:12",
        author: "Nina Kuo",
        body: "The front disc brake caliper is leaking.",
      },
      {
        at: "2026-11-26T14:40",
        author: "Nina Kuo",
        body: "Please reopen this. The replacement set was not fitted.",
      },
    ],
    attachments: [],
    fulfillment: [{ evidence: "Replacement delivered", at: "2026-11-04T08:10", actor: "Brian Wu" }],
    statusHistory: [
      { at: "2026-11-02T09:12", actor: "Nina Kuo", status: "draft", change: "Saved draft" },
      { at: "2026-11-02T10:00", actor: "Kevin Huang", status: "submitted", change: "Submitted" },
      { at: "2026-11-02T11:00", actor: "Mars Lin", status: "in_review", change: "Assigned for review" },
      { at: "2026-11-03T16:10", actor: "Brian Wu", status: "approved", change: "Approved" },
      { at: "2026-11-03T17:00", actor: "Brian Wu", status: "in_fulfillment", change: "Fulfill replacement" },
      { at: "2026-11-04T08:40", actor: "Mars Lin", status: "resolved", change: "Resolved" },
      { at: "2026-11-04T09:30", actor: "Mars Lin", status: "closed", change: "Closed" },
      { at: "2026-11-26T15:05", actor: "Roger Lo", status: "in_review", change: "Reopened", reason: "The approved caliper was never fitted." },
    ],
  },
  {
    id: "WO-SB-26016",
    bomId: "BOM-SB-26031",
    product: "Propel Advanced SL",
    assembly: "Wheelset assembly",
    serialNumber: "YP330118",
    dealer: "Giant Taichung",
    applicant: "Chris Yeh",
    request: "Spoke break on the rear wheel",
    status: "submitted",
    owner: "Kevin Huang",
    updatedAt: "2026-11-16T10:20",
    lines: [{ partId: "SP-WH-7723", description: "Rear hub", quantity: 1, unit: "ea", approvedQuantity: null, approvedAmount: null, decision: null, decisionQuantity: null, decisionReason: "" }],
    relatedIds: [],
    assignments: [{ at: "2026-11-16T10:20", actor: "Kevin Huang", assignee: "Kevin Huang" }],
    internalNotes: [],
    applicantMessages: [{ at: "2026-11-16T10:05", author: "Chris Yeh", body: "A rear spoke broke on the ride into the shop." }],
    attachments: [],
    fulfillment: [],
    statusHistory: [
      { at: "2026-11-16T10:05", actor: "Chris Yeh", status: "draft", change: "Saved draft" },
      { at: "2026-11-16T10:20", actor: "Kevin Huang", status: "submitted", change: "Submitted" },
    ],
  },
  {
    id: "WO-SB-26015",
    bomId: "BOM-SB-26014",
    product: "TCR Advanced SL",
    assembly: "Frame assembly",
    serialNumber: "YS229001",
    dealer: "Giant Taipei",
    applicant: "Elena Wu",
    request: "Seat cluster paint crack",
    status: "awaiting_information",
    owner: "Roger Lo",
    updatedAt: "2026-11-14T15:10",
    lines: [{ partId: "SP-FR-4418", description: "Rear dropout, right", quantity: 1, unit: "ea", approvedQuantity: null, approvedAmount: null, decision: null, decisionQuantity: null, decisionReason: "" }],
    relatedIds: [],
    assignments: [{ at: "2026-11-14T11:00", actor: "Kevin Huang", assignee: "Roger Lo" }],
    internalNotes: [{ at: "2026-11-14T15:10", author: "Roger Lo", body: "Waiting on a photo of the seat cluster before review can continue." }],
    applicantMessages: [{ at: "2026-11-14T15:12", author: "Roger Lo", body: "Please send a photo of the seat cluster." }],
    attachments: [],
    fulfillment: [],
    statusHistory: [
      { at: "2026-11-14T09:40", actor: "Elena Wu", status: "draft", change: "Saved draft" },
      { at: "2026-11-14T10:10", actor: "Kevin Huang", status: "submitted", change: "Submitted" },
      { at: "2026-11-14T11:00", actor: "Kevin Huang", status: "in_review", change: "Assigned for review" },
      { at: "2026-11-14T15:10", actor: "Roger Lo", status: "awaiting_information", change: "Await information" },
    ],
  },
  {
    id: "WO-SB-26012",
    bomId: "BOM-SB-26022",
    product: "Defy Advanced Pro",
    assembly: "Disc brake assembly",
    serialNumber: "YD552010",
    dealer: "Giant Kaohsiung",
    applicant: "Nina Kuo",
    request: "Front brake pad set",
    status: "in_fulfillment",
    owner: "Mars Lin",
    updatedAt: "2026-11-10T16:40",
    lines: [{ partId: "SP-BR-5120", description: "Disc brake caliper", quantity: 1, unit: "ea", approvedQuantity: 1, approvedAmount: 420, decision: "approved", decisionQuantity: 1, decisionReason: "Replacement quantity approved." }],
    relatedIds: [],
    assignments: [{ at: "2026-11-10T09:20", actor: "Kevin Huang", assignee: "Mars Lin" }],
    internalNotes: [],
    applicantMessages: [{ at: "2026-11-10T09:00", author: "Nina Kuo", body: "The front brake pad set is worn through." }],
    attachments: [],
    fulfillment: [],
    statusHistory: [
      { at: "2026-11-10T09:00", actor: "Nina Kuo", status: "draft", change: "Saved draft" },
      { at: "2026-11-10T09:10", actor: "Kevin Huang", status: "submitted", change: "Submitted" },
      { at: "2026-11-10T09:20", actor: "Kevin Huang", status: "in_review", change: "Assigned for review" },
      { at: "2026-11-10T14:00", actor: "Brian Wu", status: "approved", change: "Approved" },
      { at: "2026-11-10T16:40", actor: "Brian Wu", status: "in_fulfillment", change: "Fulfill replacement" },
    ],
  },
  {
    id: "WO-SB-26007",
    bomId: "BOM-SB-26022",
    product: "Defy Advanced Pro",
    assembly: "Disc brake assembly",
    serialNumber: "YD100442",
    dealer: "Giant Kaohsiung",
    applicant: "Nina Kuo",
    request: "Warranty credit for a leaking caliper",
    status: "closed",
    owner: "Mars Lin",
    updatedAt: "2026-09-20T11:15",
    lines: [{ partId: "SP-BR-5120", description: "Disc brake caliper", quantity: 1, unit: "ea", approvedQuantity: 1, approvedAmount: 960, decision: "approved", decisionQuantity: 1, decisionReason: "Credit amount approved for the leaking caliper." }],
    relatedIds: [],
    assignments: [{ at: "2026-09-18T10:00", actor: "Kevin Huang", assignee: "Mars Lin" }],
    internalNotes: [],
    applicantMessages: [{ at: "2026-09-20T11:20", author: "Mars Lin", body: "The credit has been posted." }],
    attachments: [],
    fulfillment: [{ evidence: "Credit posted", at: "2026-09-20T11:00", actor: "Brian Wu" }],
    statusHistory: [
      { at: "2026-09-18T09:00", actor: "Nina Kuo", status: "draft", change: "Saved draft" },
      { at: "2026-09-18T09:30", actor: "Kevin Huang", status: "submitted", change: "Submitted" },
      { at: "2026-09-18T10:00", actor: "Kevin Huang", status: "in_review", change: "Assigned for review" },
      { at: "2026-09-19T15:00", actor: "Brian Wu", status: "approved", change: "Approved" },
      { at: "2026-09-20T11:00", actor: "Mars Lin", status: "resolved", change: "Resolved" },
      { at: "2026-09-20T11:15", actor: "Mars Lin", status: "closed", change: "Closed" },
    ],
  },
];
