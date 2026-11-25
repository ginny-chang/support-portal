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
      return "草稿";
    case "in_review":
      return "審查中";
    case "released":
      return "已發行";
    case "superseded":
      return "已取代";
    case "obsolete":
      return "已停用";
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
      return "可維修";
    case "replaceable":
      return "可更換";
    case "consumable":
      return "耗材";
    case "assembly":
      return "總成更換";
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
