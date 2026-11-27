import type { BomStatus } from "./bom";

export interface WorkOrderLine {
  partId: string;
  description: string;
  quantity: number;
  unit: string;
}

export interface WorkOrderAssignment {
  at: string;
  actor: string;
  assignee: string;
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
  status: BomStatus;
  change: string;
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
  status: BomStatus;
  owner: string;
  updatedAt: string;
  lines: WorkOrderLine[];
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
    lines: [{ partId: "SP-FR-4418", description: "Rear dropout, right", quantity: 1, unit: "ea" }],
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
      { name: "shop-check.pdf", at: "2026-11-20T13:41", addedBy: "Elena Wu" },
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
    lines: [{ partId: "SP-WH-7722", description: "Front hub", quantity: 1, unit: "ea" }],
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
    status: "released",
    owner: "Mars Lin",
    updatedAt: "2026-10-02T16:05",
    lines: [{ partId: "SP-BR-5128", description: "Brake hose", quantity: 1, unit: "set" }],
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
        body: "The hose replacement is released. Giant Kaohsiung can fit SP-BR-5128.",
      },
    ],
    attachments: [{ name: "brake-hose-leak.jpg", at: "2026-09-28T11:04", addedBy: "Nina Kuo" }],
    statusHistory: [
      { at: "2026-09-28T11:00", actor: "Nina Kuo", status: "draft", change: "Submitted the request" },
      { at: "2026-09-29T09:30", actor: "Mars Lin", status: "in_review", change: "Submitted for review" },
      { at: "2026-10-02T16:05", actor: "Brian Wu", status: "released", change: "Released" },
    ],
  },
];
