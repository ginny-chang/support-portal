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
    partId: "SP-WH-7722",
    description: "Front hub",
    quantity: 8,
    unit: "ea",
    location: "Kaohsiung C-07",
    serviceability: "replaceable",
    owner: "Kevin Huang",
    updatedAt: "2026-09-01T14:11",
  },
];
