import type { Serviceability } from "./bom";

export interface SparePart {
  partId: string;
  description: string;
  quantity: number;
  unit: string;
  location: string;
  serviceability: Serviceability;
  owner: string;
  updatedAt: string;
}

export const parts: SparePart[] = [
  {
    partId: "SP-FR-4418",
    description: "Rear dropout, right",
    quantity: 24,
    unit: "ea",
    location: "Taipei A-12",
    serviceability: "replaceable",
    owner: "Roger Lo",
    updatedAt: "2026-11-12T10:24",
  },
  {
    partId: "SP-FR-4419",
    description: "Rear dropout, left",
    quantity: 6,
    unit: "ea",
    location: "Taipei A-12",
    serviceability: "replaceable",
    owner: "Roger Lo",
    updatedAt: "2026-11-12T10:24",
  },
  {
    partId: "SP-FR-4422",
    description: "Headset, upper",
    quantity: 16,
    unit: "set",
    location: "Taipei A-04",
    serviceability: "serviceable",
    owner: "Mars Lin",
    updatedAt: "2026-11-04T16:42",
  },
  {
    partId: "SP-FR-4428",
    description: "Bottle cage bolt",
    quantity: 80,
    unit: "ea",
    location: "Taipei A-04",
    serviceability: "consumable",
    owner: "Mars Lin",
    updatedAt: "2026-11-02T09:15",
  },
  {
    partId: "SP-FR-4431",
    description: "Seat clamp",
    quantity: 4,
    unit: "ea",
    location: "Taipei A-18",
    serviceability: "replaceable",
    owner: "Kevin Huang",
    updatedAt: "2026-10-28T14:40",
  },
  {
    partId: "SP-BR-5128",
    description: "Brake hose",
    quantity: 40,
    unit: "set",
    location: "Taichung B-02",
    serviceability: "serviceable",
    owner: "Iris Chang",
    updatedAt: "2026-10-02T09:18",
  },
  {
    partId: "SP-BR-5120",
    description: "Disc brake caliper",
    quantity: 11,
    unit: "ea",
    location: "Taichung B-02",
    serviceability: "replaceable",
    owner: "Iris Chang",
    updatedAt: "2026-09-18T11:05",
  },
  {
    partId: "SP-WH-7722",
    description: "Front hub",
    quantity: 8,
    unit: "ea",
    location: "Kaohsiung C-07",
    serviceability: "replaceable",
    owner: "Kevin Huang",
    updatedAt: "2026-09-01T14:11",
  },
  {
    partId: "SP-WH-7723",
    description: "Rear hub",
    quantity: 3,
    unit: "ea",
    location: "Kaohsiung C-07",
    serviceability: "replaceable",
    owner: "Brian Wu",
    updatedAt: "2026-08-22T16:30",
  },
  {
    partId: "SP-DR-6501",
    description: "Crank",
    quantity: 14,
    unit: "ea",
    location: "Taichung B-09",
    serviceability: "serviceable",
    owner: "Roger Lo",
    updatedAt: "2026-08-11T10:02",
  },
  {
    partId: "SP-FK-3301",
    description: "Fork",
    quantity: 5,
    unit: "ea",
    location: "Kaohsiung C-01",
    serviceability: "assembly",
    owner: "Brian Wu",
    updatedAt: "2026-07-30T09:44",
  },
  {
    partId: "SP-RS-8812",
    description: "Shock bushing",
    quantity: 36,
    unit: "ea",
    location: "Taipei A-18",
    serviceability: "consumable",
    owner: "Iris Chang",
    updatedAt: "2026-07-22T10:46",
  },
];
