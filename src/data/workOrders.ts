export type WorkOrderStatus = "draft" | "in_review" | "approved" | "rejected" | "cancelled" | "reopened";

export interface WorkOrderLine {
  partId: string;
  description: string;
  quantity: number;
  unit: string;
  approvedQuantity: number | null;
  approvedAmount: number | null;
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
    lines: [{ partId: "SP-FR-4418", description: "Rear dropout, right", quantity: 1, unit: "ea", approvedQuantity: null, approvedAmount: null }],
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
    statusHistory: [
      { at: "2026-11-18T09:05", actor: "Elena Wu", status: "draft", change: "Submitted the request" },
      { at: "2026-11-20T14:12", actor: "Roger Lo", status: "in_review", change: "Submitted for review" },
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
    lines: [{ partId: "SP-WH-7722", description: "Front hub", quantity: 1, unit: "ea", approvedQuantity: null, approvedAmount: null }],
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
    statusHistory: [{ at: "2026-11-18T09:12", actor: "Chris Yeh", status: "draft", change: "Submitted the request" }],
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
    lines: [{ partId: "SP-BR-5128", description: "Brake hose", quantity: 1, unit: "set", approvedQuantity: 1, approvedAmount: 1860 }],
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
    statusHistory: [
      { at: "2026-09-28T11:00", actor: "Nina Kuo", status: "draft", change: "Submitted the request" },
      { at: "2026-09-29T09:30", actor: "Mars Lin", status: "in_review", change: "Submitted for review" },
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
    lines: [{ partId: "SP-FR-4418", description: "Rear dropout, right", quantity: 1, unit: "ea", approvedQuantity: null, approvedAmount: null }],
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
    statusHistory: [
      { at: "2026-11-21T08:50", actor: "Elena Wu", status: "draft", change: "Submitted the request" },
      { at: "2026-11-21T09:18", actor: "Iris Chang", status: "in_review", change: "Submitted for review" },
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
    status: "rejected",
    owner: "Kevin Huang",
    updatedAt: "2026-11-12T16:40",
    lines: [{ partId: "SP-FK-3301", description: "Fork", quantity: 1, unit: "ea", approvedQuantity: null, approvedAmount: null }],
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
    statusHistory: [
      { at: "2026-11-12T09:40", actor: "Elena Wu", status: "draft", change: "Submitted the request" },
      { at: "2026-11-12T10:05", actor: "Kevin Huang", status: "in_review", change: "Submitted for review" },
      { at: "2026-11-12T16:40", actor: "Kevin Huang", status: "rejected", change: "Rejected", reason: "Fork crown damage is outside this work order." },
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
    lines: [{ partId: "SP-WH-7723", description: "Rear hub", quantity: 1, unit: "ea", approvedQuantity: null, approvedAmount: null }],
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
    statusHistory: [
      { at: "2026-11-08T09:02", actor: "Chris Yeh", status: "draft", change: "Submitted the request" },
      { at: "2026-11-08T11:22", actor: "Chris Yeh", status: "cancelled", change: "Cancelled", reason: "The rider withdrew the request." },
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
    status: "reopened",
    owner: "Roger Lo",
    updatedAt: "2026-11-26T15:05",
    lines: [{ partId: "SP-BR-5120", description: "Disc brake caliper", quantity: 1, unit: "ea", approvedQuantity: 1, approvedAmount: 420 }],
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
    statusHistory: [
      { at: "2026-11-02T09:12", actor: "Nina Kuo", status: "draft", change: "Submitted the request" },
      { at: "2026-11-02T11:00", actor: "Mars Lin", status: "in_review", change: "Submitted for review" },
      { at: "2026-11-03T16:10", actor: "Brian Wu", status: "approved", change: "Approved" },
      { at: "2026-11-04T09:30", actor: "Nina Kuo", status: "cancelled", change: "Cancelled", reason: "The shop closed the visit early." },
      { at: "2026-11-26T15:05", actor: "Roger Lo", status: "reopened", change: "Reopened", reason: "The approved caliper was never fitted." },
    ],
  },
];
