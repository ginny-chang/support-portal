export type BomStatus = "draft" | "in_review" | "released" | "superseded" | "obsolete";
export type Serviceability = "serviceable" | "replaceable" | "consumable" | "assembly";

export interface BomLine {
  level: number;
  partId: string;
  description: string;
  quantity: number;
  unit: string;
  serviceability: Serviceability;
  obsolete: boolean;
  parentPartId?: string;
}

export interface Applicability {
  model: string;
  category: string;
  modelYears: string;
  sizes: string;
  market: string;
}

export interface Supersession {
  fromPartId: string;
  toPartId: string;
  relation: string;
  effectiveDate: string;
}

export interface AuditEvent {
  at: string;
  actor: string;
  action: string;
}

export interface BomRecord {
  id: string;
  product: string;
  assembly: string;
  revision: string;
  status: BomStatus;
  owner: string;
  effectiveDate: string | null;
  updatedAt: string;
  supersededBy?: string;
  lines: BomLine[];
  applicability: Applicability;
  supersessions: Supersession[];
  audit: AuditEvent[];
}

function line(
  level: number,
  partId: string,
  description: string,
  quantity: number,
  unit: string,
  serviceability: Serviceability,
  obsolete = false,
): BomLine {
  return { level, partId, description, quantity, unit, serviceability, obsolete };
}

function scope(model: string, category: string, modelYears: string, sizes: string): Applicability {
  return { model, category, modelYears, sizes, market: "Taiwan" };
}

function event(at: string, actor: string, action: string): AuditEvent {
  return { at, actor, action };
}

export const revisions = ["A", "B", "C", "D", "E"] as const;

export const boms: BomRecord[] = [
  {
    id: "BOM-SB-26014",
    product: "TCR Advanced SL",
    assembly: "Frame assembly",
    revision: "C",
    status: "released",
    owner: "Roger Lo",
    effectiveDate: "2026-03-01",
    updatedAt: "2026-11-12T10:24",
    applicability: scope("TCR Advanced SL", "Road", "2025–2026", "XS–XL"),
    lines: [
      line(0, "SP-FR-4410", "Frame", 1, "ea", "assembly"),
      line(1, "SP-FR-4418", "Rear dropout, right", 1, "ea", "replaceable"),
      line(1, "SP-FR-4419", "Rear dropout, left", 1, "ea", "replaceable"),
      line(1, "SP-FR-3302", "Rear dropout, right, previous", 1, "ea", "replaceable", true),
      line(1, "SP-FR-4422", "Headset, upper", 1, "set", "serviceable"),
      line(1, "SP-FR-4428", "Bottle cage bolt", 2, "ea", "replaceable"),
      line(1, "SP-FR-2188", "Downtube guard", 1, "ea", "replaceable", true),
      line(1, "SP-FR-4436", "Downtube guard", 1, "ea", "replaceable"),
      line(1, "SP-FR-4431", "Seat clamp", 1, "ea", "replaceable"),
    ],
    supersessions: [
      { fromPartId: "SP-FR-3302", toPartId: "SP-FR-4418", relation: "Discontinued supersession", effectiveDate: "2026-03-01" },
      { fromPartId: "SP-FR-2188", toPartId: "SP-FR-4436", relation: "Specification supersession", effectiveDate: "2026-06-15" },
    ],
    audit: [
      event("2026-01-08T09:40", "Roger Lo", "Create draft"),
      event("2026-01-22T15:10", "Mars Lin", "Submit for review"),
      event("2026-02-03T11:26", "Kevin Huang", "Return from review"),
      event("2026-02-18T16:05", "Roger Lo", "Resubmit for review"),
      event("2026-03-01T10:00", "Kevin Huang", "Approve release"),
      event("2026-11-12T10:24", "Roger Lo", "Record part supersession"),
    ],
  },
  {
    id: "BOM-SB-26022",
    product: "Defy Advanced Pro",
    assembly: "Disc brake assembly",
    revision: "B",
    status: "released",
    owner: "Mars Lin",
    effectiveDate: "2026-04-15",
    updatedAt: "2026-10-02T09:18",
    applicability: scope("Defy Advanced Pro", "Road", "2025–2026", "XS–XL"),
    lines: [
      line(0, "SP-BR-5100", "Disc brake assembly", 1, "set", "assembly"),
      line(1, "SP-BR-5112", "Front caliper", 1, "ea", "replaceable"),
      line(1, "SP-BR-5113", "Rear caliper", 1, "ea", "replaceable"),
      line(1, "SP-BR-5120", "Brake pad", 2, "pr", "consumable"),
      line(1, "SP-BR-5128", "Brake hose", 1, "set", "serviceable"),
      line(1, "SP-BR-4904", "Brake pad, previous compound", 2, "pr", "consumable", true),
    ],
    supersessions: [
      { fromPartId: "SP-BR-4904", toPartId: "SP-BR-5120", relation: "Specification supersession", effectiveDate: "2026-04-15" },
    ],
    audit: [
      event("2026-03-02T10:12", "Mars Lin", "Create draft"),
      event("2026-03-18T14:40", "Mars Lin", "Submit for review"),
      event("2026-04-15T09:05", "Kevin Huang", "Approve release"),
      event("2026-10-02T09:18", "Mars Lin", "Update consumable part"),
    ],
  },
  {
    id: "BOM-SB-26031",
    product: "Propel Advanced SL",
    assembly: "Wheelset assembly",
    revision: "A",
    status: "in_review",
    owner: "Iris Chang",
    effectiveDate: null,
    updatedAt: "2026-11-04T16:42",
    applicability: scope("Propel Advanced SL", "Road", "2026", "XS–L"),
    lines: [
      line(0, "SP-WH-7701", "Wheelset", 1, "set", "assembly"),
      line(1, "SP-WH-7710", "Front rim", 1, "ea", "replaceable"),
      line(1, "SP-WH-7711", "Rear rim", 1, "ea", "replaceable"),
      line(1, "SP-WH-7722", "Front hub", 1, "ea", "serviceable"),
      line(1, "SP-WH-7723", "Rear hub", 1, "ea", "serviceable"),
      line(1, "SP-WH-7730", "Spoke", 48, "pc", "replaceable"),
    ],
    supersessions: [],
    audit: [
      event("2026-10-09T11:20", "Iris Chang", "Create draft"),
      event("2026-10-28T15:33", "Iris Chang", "Submit for review"),
      event("2026-11-04T16:42", "Kevin Huang", "In Review"),
    ],
  },
  {
    id: "BOM-SB-25108",
    product: "TCR Advanced",
    assembly: "Fork assembly",
    revision: "D",
    status: "superseded",
    owner: "Kevin Huang",
    effectiveDate: "2025-02-01",
    updatedAt: "2026-08-19T13:10",
    supersededBy: "BOM-SB-26055",
    applicability: scope("TCR Advanced", "Road", "2024–2025", "XS–XL"),
    lines: [
      line(0, "SP-FK-2204", "Fork", 1, "pc", "assembly", true),
      line(1, "SP-FK-2210", "Fork steerer", 1, "pc", "replaceable", true),
      line(1, "SP-FK-2216", "Fork crown bolt", 2, "ea", "replaceable"),
    ],
    supersessions: [
      { fromPartId: "SP-FK-2204", toPartId: "SP-FK-3301", relation: "Discontinued supersession", effectiveDate: "2026-08-19" },
    ],
    audit: [
      event("2025-01-06T09:00", "Kevin Huang", "Create draft"),
      event("2025-02-01T10:30", "Roger Lo", "Approve release"),
      event("2026-08-19T13:10", "Kevin Huang", "Mark superseded"),
    ],
  },
  {
    id: "BOM-SB-26055",
    product: "TCR Advanced",
    assembly: "Fork assembly",
    revision: "E",
    status: "released",
    owner: "Kevin Huang",
    effectiveDate: "2026-08-19",
    updatedAt: "2026-08-19T13:12",
    applicability: scope("TCR Advanced", "Road", "2025–2026", "XS–XL"),
    lines: [
      line(0, "SP-FK-3301", "Fork", 1, "pc", "assembly"),
      line(1, "SP-FK-3310", "Fork steerer", 1, "pc", "replaceable"),
      line(1, "SP-FK-2216", "Fork crown bolt", 2, "ea", "replaceable"),
      line(1, "SP-FK-3318", "Fork expander", 1, "ea", "serviceable"),
    ],
    supersessions: [],
    audit: [
      event("2026-07-02T10:15", "Kevin Huang", "Create draft"),
      event("2026-07-21T14:02", "Mars Lin", "Submit for review"),
      event("2026-08-19T13:12", "Roger Lo", "Approve release"),
    ],
  },
  {
    id: "BOM-SB-24116",
    product: "Escape 2 Disc",
    assembly: "Shifting assembly",
    revision: "B",
    status: "obsolete",
    owner: "Brian Wu",
    effectiveDate: "2024-05-01",
    updatedAt: "2025-11-30T17:40",
    applicability: scope("Escape 2 Disc", "Fitness", "2022–2024", "XS–XL"),
    lines: [
      line(0, "SP-ES-1800", "Shifting assembly", 1, "set", "assembly", true),
      line(1, "SP-ES-1812", "Rear derailleur", 1, "ea", "replaceable", true),
      line(1, "SP-ES-1818", "Shift inner cable", 2, "pc", "consumable", true),
      line(1, "SP-ES-1820", "Shift housing", 1, "set", "consumable", true),
    ],
    supersessions: [],
    audit: [
      event("2024-04-11T09:24", "Brian Wu", "Create draft"),
      event("2024-05-01T11:00", "Roger Lo", "Approve release"),
      event("2025-11-30T17:40", "Brian Wu", "Mark obsolete"),
    ],
  },
  {
    id: "BOM-SB-26040",
    product: "Revolt Advanced",
    assembly: "Drivetrain assembly",
    revision: "A",
    status: "draft",
    owner: "Roger Lo",
    effectiveDate: null,
    updatedAt: "2026-11-20T18:05",
    applicability: scope("Revolt Advanced", "Gravel", "2026", "XS–XL"),
    lines: [
      line(0, "SP-DR-6400", "Drivetrain assembly", 1, "set", "assembly"),
      line(1, "SP-DR-6410", "Crank", 1, "set", "replaceable"),
      line(1, "SP-DR-6416", "Chainring", 1, "ea", "consumable"),
      line(1, "SP-DR-6422", "Chain", 1, "pc", "consumable"),
      line(1, "SP-DR-6430", "Bottom bracket", 1, "ea", "serviceable"),
    ],
    supersessions: [],
    audit: [
      event("2026-11-11T09:48", "Roger Lo", "Create draft"),
      event("2026-11-20T18:05", "Roger Lo", "Update lines"),
    ],
  },
  {
    id: "BOM-SB-26018",
    product: "Trance X Advanced",
    assembly: "Suspension linkage assembly",
    revision: "B",
    status: "released",
    owner: "Mars Lin",
    effectiveDate: "2026-05-06",
    updatedAt: "2026-09-14T11:27",
    applicability: scope("Trance X Advanced", "Mountain", "2025–2026", "S–XL"),
    lines: [
      line(0, "SP-RS-3600", "Suspension linkage assembly", 1, "set", "assembly"),
      line(1, "SP-RS-3612", "Upper link", 1, "ea", "replaceable"),
      line(1, "SP-RS-3613", "Lower link", 1, "ea", "replaceable"),
      line(1, "SP-RS-3620", "Linkage bearing", 4, "ea", "serviceable"),
      line(1, "SP-RS-3628", "Linkage bolt", 6, "ea", "replaceable"),
      line(1, "SP-RS-3011", "Upper link, previous", 1, "ea", "replaceable", true),
    ],
    supersessions: [
      { fromPartId: "SP-RS-3011", toPartId: "SP-RS-3612", relation: "Specification supersession", effectiveDate: "2026-05-06" },
    ],
    audit: [
      event("2026-04-01T10:05", "Mars Lin", "Create draft"),
      event("2026-04-20T13:44", "Iris Chang", "Submit for review"),
      event("2026-05-06T09:30", "Kevin Huang", "Approve release"),
      event("2026-09-14T11:27", "Mars Lin", "Correct quantity"),
    ],
  },
  {
    id: "BOM-SB-26044",
    product: "Explore E+",
    assembly: "E-bike drive unit",
    revision: "A",
    status: "draft",
    owner: "Iris Chang",
    effectiveDate: null,
    updatedAt: "2026-11-18T15:16",
    applicability: scope("Explore E+", "E-bike", "2026", "S–L"),
    lines: [
      line(0, "SP-EB-8100", "E-bike drive unit", 1, "ea", "assembly"),
      line(1, "SP-EB-8114", "Torque sensor", 1, "ea", "replaceable"),
      line(1, "SP-EB-8120", "Main wiring harness", 1, "pc", "replaceable"),
      line(1, "SP-EB-8128", "Display unit", 1, "ea", "replaceable"),
      line(1, "SP-EB-8133", "Mounting bolt", 4, "ea", "replaceable"),
    ],
    supersessions: [],
    audit: [
      event("2026-11-06T14:22", "Iris Chang", "Create draft"),
      event("2026-11-18T15:16", "Iris Chang", "Add wiring harness"),
    ],
  },
  {
    id: "BOM-SB-25190",
    product: "Contend AR",
    assembly: "Wheelset assembly",
    revision: "C",
    status: "released",
    owner: "Brian Wu",
    effectiveDate: "2025-09-12",
    updatedAt: "2026-06-03T08:55",
    applicability: scope("Contend AR", "Road", "2024–2026", "XS–XL"),
    lines: [
      line(0, "SP-WH-5400", "Wheelset", 1, "set", "assembly"),
      line(1, "SP-WH-5410", "Front rim", 1, "ea", "replaceable"),
      line(1, "SP-WH-5411", "Rear rim", 1, "ea", "replaceable"),
      line(1, "SP-WH-5420", "Quick release", 2, "pc", "replaceable"),
      line(1, "SP-WH-5202", "Quick release, previous spec", 2, "pc", "replaceable", true),
    ],
    supersessions: [
      { fromPartId: "SP-WH-5202", toPartId: "SP-WH-5420", relation: "Specification supersession", effectiveDate: "2025-09-12" },
    ],
    audit: [
      event("2025-08-04T09:16", "Brian Wu", "Create draft"),
      event("2025-08-26T16:08", "Roger Lo", "Submit for review"),
      event("2025-09-12T10:40", "Kevin Huang", "Approve release"),
      event("2026-06-03T08:55", "Brian Wu", "Confirm model year"),
    ],
  },
  {
    id: "BOM-SB-26027",
    product: "FastRoad Advanced",
    assembly: "Handlebar assembly",
    revision: "A",
    status: "in_review",
    owner: "Kevin Huang",
    effectiveDate: null,
    updatedAt: "2026-11-08T12:03",
    applicability: scope("FastRoad Advanced", "Fitness", "2026", "XS–L"),
    lines: [
      line(0, "SP-HB-4500", "Handlebar assembly", 1, "set", "assembly"),
      line(1, "SP-HB-4510", "Handlebar", 1, "pc", "replaceable"),
      line(1, "SP-HB-4518", "Stem", 1, "pc", "replaceable"),
      line(1, "SP-HB-4524", "Bar tape", 1, "set", "consumable"),
      line(1, "SP-HB-4530", "Stem bolt", 2, "ea", "replaceable"),
    ],
    supersessions: [],
    audit: [
      event("2026-10-14T11:11", "Kevin Huang", "Create draft"),
      event("2026-11-02T09:47", "Brian Wu", "Submit for review"),
      event("2026-11-08T12:03", "Roger Lo", "In Review"),
    ],
  },
  {
    id: "BOM-SB-23102",
    product: "Talon 2",
    assembly: "Brake assembly",
    revision: "A",
    status: "obsolete",
    owner: "Mars Lin",
    effectiveDate: "2023-06-01",
    updatedAt: "2026-01-09T15:28",
    applicability: scope("Talon 2", "Mountain", "2021–2023", "XS–L"),
    lines: [
      line(0, "SP-TL-0900", "Brake assembly", 1, "set", "assembly", true),
      line(1, "SP-TL-0912", "Brake lever", 1, "pr", "replaceable", true),
      line(1, "SP-TL-0918", "Brake shoe", 2, "pr", "consumable", true),
      line(1, "SP-TL-0924", "Brake inner cable", 2, "pc", "consumable", true),
    ],
    supersessions: [],
    audit: [
      event("2023-05-08T10:00", "Mars Lin", "Create draft"),
      event("2023-06-01T09:30", "Roger Lo", "Approve release"),
      event("2026-01-09T15:28", "Mars Lin", "Mark obsolete"),
    ],
  },
  {
    id: "BOM-SB-26008",
    product: "Reign Advanced",
    assembly: "Rear shock assembly",
    revision: "B",
    status: "released",
    owner: "Iris Chang",
    effectiveDate: "2026-01-20",
    updatedAt: "2026-07-22T10:46",
    applicability: scope("Reign Advanced", "Mountain", "2025–2026", "S–XL"),
    lines: [
      line(0, "SP-RS-8800", "Rear shock", 1, "pc", "assembly"),
      line(1, "SP-RS-8812", "Shock bushing", 2, "ea", "serviceable"),
      line(1, "SP-RS-8818", "Mounting bolt", 2, "ea", "replaceable"),
      line(1, "SP-RS-8824", "Valve cap", 1, "ea", "replaceable"),
      line(1, "SP-RS-8606", "Shock bushing, previous spec", 2, "ea", "serviceable", true),
    ],
    supersessions: [
      { fromPartId: "SP-RS-8606", toPartId: "SP-RS-8812", relation: "Specification supersession", effectiveDate: "2026-01-20" },
    ],
    audit: [
      event("2025-12-09T13:18", "Iris Chang", "Create draft"),
      event("2026-01-06T10:22", "Kevin Huang", "Submit for review"),
      event("2026-01-20T09:10", "Roger Lo", "Approve release"),
      event("2026-07-22T10:46", "Iris Chang", "Record bushing supersession"),
    ],
  },
  {
    id: "BOM-SB-26036",
    product: "Anthem Advanced Pro",
    assembly: "Frame assembly",
    revision: "A",
    status: "in_review",
    owner: "Roger Lo",
    effectiveDate: null,
    updatedAt: "2026-11-21T09:37",
    applicability: scope("Anthem Advanced Pro", "Mountain", "2026", "S–XL"),
    lines: [
      line(0, "SP-FR-9100", "Frame", 1, "ea", "assembly"),
      line(1, "SP-FR-9114", "Rear dropout, right", 1, "ea", "replaceable"),
      line(1, "SP-FR-9115", "Rear dropout, left", 1, "ea", "replaceable"),
      line(1, "SP-FR-9122", "Cable guide", 1, "set", "replaceable"),
      line(1, "SP-FR-9130", "Bottom bracket shell", 1, "ea", "serviceable"),
    ],
    supersessions: [],
    audit: [
      event("2026-10-30T08:54", "Roger Lo", "Create draft"),
      event("2026-11-14T16:19", "Mars Lin", "Submit for review"),
      event("2026-11-21T09:37", "Kevin Huang", "In Review"),
    ],
  },
  {
    id: "BOM-SB-25066",
    product: "Stance",
    assembly: "Fork assembly",
    revision: "C",
    status: "superseded",
    owner: "Brian Wu",
    effectiveDate: "2025-04-01",
    updatedAt: "2026-09-01T14:08",
    supersededBy: "BOM-SB-26061",
    applicability: scope("Stance", "Mountain", "2024–2025", "S–L"),
    lines: [
      line(0, "SP-FK-1503", "Suspension fork", 1, "pc", "assembly", true),
      line(1, "SP-FK-1510", "Dust seal", 2, "ea", "consumable"),
      line(1, "SP-FK-1516", "Fork mounting bolt", 1, "ea", "replaceable"),
    ],
    supersessions: [
      { fromPartId: "SP-FK-1503", toPartId: "SP-FK-2601", relation: "Discontinued supersession", effectiveDate: "2026-09-01" },
    ],
    audit: [
      event("2025-03-03T11:42", "Brian Wu", "Create draft"),
      event("2025-04-01T10:05", "Roger Lo", "Approve release"),
      event("2026-09-01T14:08", "Brian Wu", "Mark superseded"),
    ],
  },
  {
    id: "BOM-SB-26061",
    product: "Stance",
    assembly: "Fork assembly",
    revision: "D",
    status: "released",
    owner: "Brian Wu",
    effectiveDate: "2026-09-01",
    updatedAt: "2026-09-01T14:11",
    applicability: scope("Stance", "Mountain", "2026", "S–L"),
    lines: [
      line(0, "SP-FK-2601", "Suspension fork", 1, "pc", "assembly"),
      line(1, "SP-FK-2610", "Dust seal", 2, "ea", "consumable"),
      line(1, "SP-FK-1516", "Fork mounting bolt", 1, "ea", "replaceable"),
      line(1, "SP-FK-2618", "Air valve", 1, "ea", "serviceable"),
    ],
    supersessions: [],
    audit: [
      event("2026-08-06T09:33", "Brian Wu", "Create draft"),
      event("2026-08-20T15:17", "Iris Chang", "Submit for review"),
      event("2026-09-01T14:11", "Kevin Huang", "Approve release"),
    ],
  },
];

export function getBom(id: string): BomRecord | undefined {
  return boms.find((record) => record.id === id);
}
