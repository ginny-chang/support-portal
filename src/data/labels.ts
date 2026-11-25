import type { BomStatus, Serviceability } from "./bom";

export type TagTone =
  | "draft"
  | "review"
  | "released"
  | "superseded"
  | "obsolete"
  | "serviceable"
  | "replaceable"
  | "consumable"
  | "assembly";

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
