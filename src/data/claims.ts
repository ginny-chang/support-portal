import type { BomStatus } from "./bom";

export type ClaimType = "Warranty" | "Quality" | "Damage";

export interface QualityClaim {
  id: string;
  product: string;
  assembly: string;
  claimType: ClaimType;
  dealer: string;
  description: string;
  status: BomStatus;
  owner: string;
  updatedAt: string;
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
  },
  {
    id: "QC-SB-26009",
    product: "Propel Advanced SL",
    assembly: "",
    claimType: "Damage",
    dealer: "Giant Kaohsiung",
    description: "Rear wheel impact damage reported by the rider",
    status: "released",
    owner: "Iris Chang",
    updatedAt: "2026-10-02T16:05",
  },
];
