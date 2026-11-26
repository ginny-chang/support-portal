import type { BomStatus } from "./bom";

export interface WorkOrderLine {
  partId: string;
  description: string;
  quantity: number;
  unit: string;
}

export interface WorkOrderRecord {
  id: string;
  bomId: string;
  product: string;
  assembly: string;
  serialNumber: string;
  dealer: string;
  request: string;
  status: BomStatus;
  owner: string;
  updatedAt: string;
  lines: WorkOrderLine[];
}

export const workOrders: WorkOrderRecord[] = [
  {
    id: "WO-SB-26021",
    bomId: "BOM-SB-26014",
    product: "TCR Advanced SL",
    assembly: "Frame assembly",
    serialNumber: "YS482193",
    dealer: "Giant Taipei",
    request: "Rear dropout play after a crash",
    status: "in_review",
    owner: "陳宜安",
    updatedAt: "2026-11-20T14:12",
    lines: [{ partId: "SP-FR-4418", description: "Rear dropout, right", quantity: 1, unit: "ea" }],
  },
  {
    id: "WO-SB-26018",
    bomId: "BOM-SB-26031",
    product: "Propel Advanced SL",
    assembly: "Wheelset assembly",
    serialNumber: "YP220184",
    dealer: "Giant Taichung",
    request: "Replace the front hub after bearing wear",
    status: "draft",
    owner: "張詠慈",
    updatedAt: "2026-11-18T09:40",
    lines: [{ partId: "SP-WH-7722", description: "Front hub", quantity: 1, unit: "ea" }],
  },
  {
    id: "WO-SB-26011",
    bomId: "BOM-SB-26022",
    product: "Defy Advanced Pro",
    assembly: "Disc brake assembly",
    serialNumber: "YD109332",
    dealer: "Giant Kaohsiung",
    request: "Brake hose leak",
    status: "released",
    owner: "林書庭",
    updatedAt: "2026-10-02T16:05",
    lines: [{ partId: "SP-BR-5128", description: "Brake hose", quantity: 1, unit: "set" }],
  },
];
