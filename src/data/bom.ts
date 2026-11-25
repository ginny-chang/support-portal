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
  return { model, category, modelYears, sizes, market: "台灣" };
}

function event(at: string, actor: string, action: string): AuditEvent {
  return { at, actor, action };
}

export const revisions = ["A", "B", "C", "D", "E"] as const;

export const boms: BomRecord[] = [
  {
    id: "BOM-SB-26014",
    product: "TCR Advanced SL",
    assembly: "車架總成",
    revision: "C",
    status: "released",
    owner: "陳宜安",
    effectiveDate: "2026-03-01",
    updatedAt: "2026-11-12T10:24",
    applicability: scope("TCR Advanced SL", "公路車", "2025–2026", "XS–XL"),
    lines: [
      line(0, "SP-FR-4410", "車架本體", 1, "個", "assembly"),
      line(1, "SP-FR-4418", "後勾爪（右）", 1, "個", "replaceable"),
      line(1, "SP-FR-4419", "後勾爪（左）", 1, "個", "replaceable"),
      line(1, "SP-FR-3302", "後勾爪（右，舊版）", 1, "個", "replaceable", true),
      line(1, "SP-FR-4422", "前叉上碗組", 1, "組", "serviceable"),
      line(1, "SP-FR-4428", "水壺架固定螺栓", 2, "個", "replaceable"),
      line(1, "SP-FR-2188", "下管護片", 1, "個", "replaceable", true),
      line(1, "SP-FR-4436", "下管護片", 1, "個", "replaceable"),
      line(1, "SP-FR-4431", "座管束", 1, "個", "replaceable"),
    ],
    supersessions: [
      { fromPartId: "SP-FR-3302", toPartId: "SP-FR-4418", relation: "停產取代", effectiveDate: "2026-03-01" },
      { fromPartId: "SP-FR-2188", toPartId: "SP-FR-4436", relation: "規格取代", effectiveDate: "2026-06-15" },
    ],
    audit: [
      event("2026-01-08T09:40", "陳宜安", "建立草稿"),
      event("2026-01-22T15:10", "林書庭", "送出審查"),
      event("2026-02-03T11:26", "黃子謙", "退回審查"),
      event("2026-02-18T16:05", "陳宜安", "再送審查"),
      event("2026-03-01T10:00", "黃子謙", "核准發行"),
      event("2026-11-12T10:24", "陳宜安", "登錄料號取代"),
    ],
  },
  {
    id: "BOM-SB-26022",
    product: "Defy Advanced Pro",
    assembly: "碟煞總成",
    revision: "B",
    status: "released",
    owner: "林書庭",
    effectiveDate: "2026-04-15",
    updatedAt: "2026-10-02T09:18",
    applicability: scope("Defy Advanced Pro", "公路車", "2025–2026", "XS–XL"),
    lines: [
      line(0, "SP-BR-5100", "碟煞總成", 1, "組", "assembly"),
      line(1, "SP-BR-5112", "前卡鉗", 1, "個", "replaceable"),
      line(1, "SP-BR-5113", "後卡鉗", 1, "個", "replaceable"),
      line(1, "SP-BR-5120", "來令片", 2, "對", "consumable"),
      line(1, "SP-BR-5128", "煞車油管", 1, "組", "serviceable"),
      line(1, "SP-BR-4904", "來令片（舊配方）", 2, "對", "consumable", true),
    ],
    supersessions: [
      { fromPartId: "SP-BR-4904", toPartId: "SP-BR-5120", relation: "規格取代", effectiveDate: "2026-04-15" },
    ],
    audit: [
      event("2026-03-02T10:12", "林書庭", "建立草稿"),
      event("2026-03-18T14:40", "林書庭", "送出審查"),
      event("2026-04-15T09:05", "黃子謙", "核准發行"),
      event("2026-10-02T09:18", "林書庭", "更新耗材料號"),
    ],
  },
  {
    id: "BOM-SB-26031",
    product: "Propel Advanced SL",
    assembly: "輪組總成",
    revision: "A",
    status: "in_review",
    owner: "張詠慈",
    effectiveDate: null,
    updatedAt: "2026-11-04T16:42",
    applicability: scope("Propel Advanced SL", "公路車", "2026", "XS–L"),
    lines: [
      line(0, "SP-WH-7701", "輪組", 1, "組", "assembly"),
      line(1, "SP-WH-7710", "前輪圈", 1, "個", "replaceable"),
      line(1, "SP-WH-7711", "後輪圈", 1, "個", "replaceable"),
      line(1, "SP-WH-7722", "前花鼓", 1, "個", "serviceable"),
      line(1, "SP-WH-7723", "後花鼓", 1, "個", "serviceable"),
      line(1, "SP-WH-7730", "鋼絲", 48, "支", "replaceable"),
    ],
    supersessions: [],
    audit: [
      event("2026-10-09T11:20", "張詠慈", "建立草稿"),
      event("2026-10-28T15:33", "張詠慈", "送出審查"),
      event("2026-11-04T16:42", "黃子謙", "審查中"),
    ],
  },
  {
    id: "BOM-SB-25108",
    product: "TCR Advanced",
    assembly: "前叉總成",
    revision: "D",
    status: "superseded",
    owner: "黃子謙",
    effectiveDate: "2025-02-01",
    updatedAt: "2026-08-19T13:10",
    supersededBy: "BOM-SB-26055",
    applicability: scope("TCR Advanced", "公路車", "2024–2025", "XS–XL"),
    lines: [
      line(0, "SP-FK-2204", "前叉本體", 1, "支", "assembly", true),
      line(1, "SP-FK-2210", "前叉內管", 1, "支", "replaceable", true),
      line(1, "SP-FK-2216", "叉肩固定螺栓", 2, "個", "replaceable"),
    ],
    supersessions: [
      { fromPartId: "SP-FK-2204", toPartId: "SP-FK-3301", relation: "停產取代", effectiveDate: "2026-08-19" },
    ],
    audit: [
      event("2025-01-06T09:00", "黃子謙", "建立草稿"),
      event("2025-02-01T10:30", "陳宜安", "核准發行"),
      event("2026-08-19T13:10", "黃子謙", "標記已取代"),
    ],
  },
  {
    id: "BOM-SB-26055",
    product: "TCR Advanced",
    assembly: "前叉總成",
    revision: "E",
    status: "released",
    owner: "黃子謙",
    effectiveDate: "2026-08-19",
    updatedAt: "2026-08-19T13:12",
    applicability: scope("TCR Advanced", "公路車", "2025–2026", "XS–XL"),
    lines: [
      line(0, "SP-FK-3301", "前叉本體", 1, "支", "assembly"),
      line(1, "SP-FK-3310", "前叉內管", 1, "支", "replaceable"),
      line(1, "SP-FK-2216", "叉肩固定螺栓", 2, "個", "replaceable"),
      line(1, "SP-FK-3318", "前叉吊芯", 1, "個", "serviceable"),
    ],
    supersessions: [],
    audit: [
      event("2026-07-02T10:15", "黃子謙", "建立草稿"),
      event("2026-07-21T14:02", "林書庭", "送出審查"),
      event("2026-08-19T13:12", "陳宜安", "核准發行"),
    ],
  },
  {
    id: "BOM-SB-24116",
    product: "Escape 2 Disc",
    assembly: "變速總成",
    revision: "B",
    status: "obsolete",
    owner: "吳柏霖",
    effectiveDate: "2024-05-01",
    updatedAt: "2025-11-30T17:40",
    applicability: scope("Escape 2 Disc", "健身車", "2022–2024", "XS–XL"),
    lines: [
      line(0, "SP-ES-1800", "變速總成", 1, "組", "assembly", true),
      line(1, "SP-ES-1812", "後變速器", 1, "個", "replaceable", true),
      line(1, "SP-ES-1818", "變速內線", 2, "條", "consumable", true),
      line(1, "SP-ES-1820", "變速外管", 1, "組", "consumable", true),
    ],
    supersessions: [],
    audit: [
      event("2024-04-11T09:24", "吳柏霖", "建立草稿"),
      event("2024-05-01T11:00", "陳宜安", "核准發行"),
      event("2025-11-30T17:40", "吳柏霖", "標記已停用"),
    ],
  },
  {
    id: "BOM-SB-26040",
    product: "Revolt Advanced",
    assembly: "驅動總成",
    revision: "A",
    status: "draft",
    owner: "陳宜安",
    effectiveDate: null,
    updatedAt: "2026-11-20T18:05",
    applicability: scope("Revolt Advanced", "礫石車", "2026", "XS–XL"),
    lines: [
      line(0, "SP-DR-6400", "驅動總成", 1, "組", "assembly"),
      line(1, "SP-DR-6410", "曲柄", 1, "組", "replaceable"),
      line(1, "SP-DR-6416", "大齒盤", 1, "個", "consumable"),
      line(1, "SP-DR-6422", "鏈條", 1, "條", "consumable"),
      line(1, "SP-DR-6430", "中軸", 1, "個", "serviceable"),
    ],
    supersessions: [],
    audit: [
      event("2026-11-11T09:48", "陳宜安", "建立草稿"),
      event("2026-11-20T18:05", "陳宜安", "更新明細"),
    ],
  },
  {
    id: "BOM-SB-26018",
    product: "Trance X Advanced",
    assembly: "避震連桿總成",
    revision: "B",
    status: "released",
    owner: "林書庭",
    effectiveDate: "2026-05-06",
    updatedAt: "2026-09-14T11:27",
    applicability: scope("Trance X Advanced", "登山車", "2025–2026", "S–XL"),
    lines: [
      line(0, "SP-RS-3600", "避震連桿總成", 1, "組", "assembly"),
      line(1, "SP-RS-3612", "上連桿", 1, "個", "replaceable"),
      line(1, "SP-RS-3613", "下連桿", 1, "個", "replaceable"),
      line(1, "SP-RS-3620", "連桿軸承", 4, "個", "serviceable"),
      line(1, "SP-RS-3628", "連桿螺栓", 6, "個", "replaceable"),
      line(1, "SP-RS-3011", "上連桿（舊版）", 1, "個", "replaceable", true),
    ],
    supersessions: [
      { fromPartId: "SP-RS-3011", toPartId: "SP-RS-3612", relation: "規格取代", effectiveDate: "2026-05-06" },
    ],
    audit: [
      event("2026-04-01T10:05", "林書庭", "建立草稿"),
      event("2026-04-20T13:44", "張詠慈", "送出審查"),
      event("2026-05-06T09:30", "黃子謙", "核准發行"),
      event("2026-09-14T11:27", "林書庭", "更正數量"),
    ],
  },
  {
    id: "BOM-SB-26044",
    product: "Explore E+",
    assembly: "電輔驅動單元",
    revision: "A",
    status: "draft",
    owner: "張詠慈",
    effectiveDate: null,
    updatedAt: "2026-11-18T15:16",
    applicability: scope("Explore E+", "電輔車", "2026", "S–L"),
    lines: [
      line(0, "SP-EB-8100", "電輔驅動單元", 1, "個", "assembly"),
      line(1, "SP-EB-8114", "力矩感測器", 1, "個", "replaceable"),
      line(1, "SP-EB-8120", "主配線束", 1, "條", "replaceable"),
      line(1, "SP-EB-8128", "顯示單元", 1, "個", "replaceable"),
      line(1, "SP-EB-8133", "固定螺栓", 4, "個", "replaceable"),
    ],
    supersessions: [],
    audit: [
      event("2026-11-06T14:22", "張詠慈", "建立草稿"),
      event("2026-11-18T15:16", "張詠慈", "補上配線束"),
    ],
  },
  {
    id: "BOM-SB-25190",
    product: "Contend AR",
    assembly: "輪組總成",
    revision: "C",
    status: "released",
    owner: "吳柏霖",
    effectiveDate: "2025-09-12",
    updatedAt: "2026-06-03T08:55",
    applicability: scope("Contend AR", "公路車", "2024–2026", "XS–XL"),
    lines: [
      line(0, "SP-WH-5400", "輪組", 1, "組", "assembly"),
      line(1, "SP-WH-5410", "前輪圈", 1, "個", "replaceable"),
      line(1, "SP-WH-5411", "後輪圈", 1, "個", "replaceable"),
      line(1, "SP-WH-5420", "快拆", 2, "支", "replaceable"),
      line(1, "SP-WH-5202", "快拆（舊規格）", 2, "支", "replaceable", true),
    ],
    supersessions: [
      { fromPartId: "SP-WH-5202", toPartId: "SP-WH-5420", relation: "規格取代", effectiveDate: "2025-09-12" },
    ],
    audit: [
      event("2025-08-04T09:16", "吳柏霖", "建立草稿"),
      event("2025-08-26T16:08", "陳宜安", "送出審查"),
      event("2025-09-12T10:40", "黃子謙", "核准發行"),
      event("2026-06-03T08:55", "吳柏霖", "確認適用年式"),
    ],
  },
  {
    id: "BOM-SB-26027",
    product: "FastRoad Advanced",
    assembly: "車手總成",
    revision: "A",
    status: "in_review",
    owner: "黃子謙",
    effectiveDate: null,
    updatedAt: "2026-11-08T12:03",
    applicability: scope("FastRoad Advanced", "健身車", "2026", "XS–L"),
    lines: [
      line(0, "SP-HB-4500", "車手總成", 1, "組", "assembly"),
      line(1, "SP-HB-4510", "車手", 1, "支", "replaceable"),
      line(1, "SP-HB-4518", "豎管", 1, "支", "replaceable"),
      line(1, "SP-HB-4524", "把帶", 1, "組", "consumable"),
      line(1, "SP-HB-4530", "豎管螺栓", 2, "個", "replaceable"),
    ],
    supersessions: [],
    audit: [
      event("2026-10-14T11:11", "黃子謙", "建立草稿"),
      event("2026-11-02T09:47", "吳柏霖", "送出審查"),
      event("2026-11-08T12:03", "陳宜安", "審查中"),
    ],
  },
  {
    id: "BOM-SB-23102",
    product: "Talon 2",
    assembly: "煞車總成",
    revision: "A",
    status: "obsolete",
    owner: "林書庭",
    effectiveDate: "2023-06-01",
    updatedAt: "2026-01-09T15:28",
    applicability: scope("Talon 2", "登山車", "2021–2023", "XS–L"),
    lines: [
      line(0, "SP-TL-0900", "煞車總成", 1, "組", "assembly", true),
      line(1, "SP-TL-0912", "煞車把手", 1, "對", "replaceable", true),
      line(1, "SP-TL-0918", "煞車皮", 2, "對", "consumable", true),
      line(1, "SP-TL-0924", "煞車內線", 2, "條", "consumable", true),
    ],
    supersessions: [],
    audit: [
      event("2023-05-08T10:00", "林書庭", "建立草稿"),
      event("2023-06-01T09:30", "陳宜安", "核准發行"),
      event("2026-01-09T15:28", "林書庭", "標記已停用"),
    ],
  },
  {
    id: "BOM-SB-26008",
    product: "Reign Advanced",
    assembly: "後避震總成",
    revision: "B",
    status: "released",
    owner: "張詠慈",
    effectiveDate: "2026-01-20",
    updatedAt: "2026-07-22T10:46",
    applicability: scope("Reign Advanced", "登山車", "2025–2026", "S–XL"),
    lines: [
      line(0, "SP-RS-8800", "後避震器", 1, "支", "assembly"),
      line(1, "SP-RS-8812", "避震襯套", 2, "個", "serviceable"),
      line(1, "SP-RS-8818", "安裝螺栓", 2, "個", "replaceable"),
      line(1, "SP-RS-8824", "氣嘴蓋", 1, "個", "replaceable"),
      line(1, "SP-RS-8606", "避震襯套（舊規格）", 2, "個", "serviceable", true),
    ],
    supersessions: [
      { fromPartId: "SP-RS-8606", toPartId: "SP-RS-8812", relation: "規格取代", effectiveDate: "2026-01-20" },
    ],
    audit: [
      event("2025-12-09T13:18", "張詠慈", "建立草稿"),
      event("2026-01-06T10:22", "黃子謙", "送出審查"),
      event("2026-01-20T09:10", "陳宜安", "核准發行"),
      event("2026-07-22T10:46", "張詠慈", "登錄襯套取代"),
    ],
  },
  {
    id: "BOM-SB-26036",
    product: "Anthem Advanced Pro",
    assembly: "車架總成",
    revision: "A",
    status: "in_review",
    owner: "陳宜安",
    effectiveDate: null,
    updatedAt: "2026-11-21T09:37",
    applicability: scope("Anthem Advanced Pro", "登山車", "2026", "S–XL"),
    lines: [
      line(0, "SP-FR-9100", "車架本體", 1, "個", "assembly"),
      line(1, "SP-FR-9114", "後勾爪（右）", 1, "個", "replaceable"),
      line(1, "SP-FR-9115", "後勾爪（左）", 1, "個", "replaceable"),
      line(1, "SP-FR-9122", "走線導管", 1, "組", "replaceable"),
      line(1, "SP-FR-9130", "五通套筒", 1, "個", "serviceable"),
    ],
    supersessions: [],
    audit: [
      event("2026-10-30T08:54", "陳宜安", "建立草稿"),
      event("2026-11-14T16:19", "林書庭", "送出審查"),
      event("2026-11-21T09:37", "黃子謙", "審查中"),
    ],
  },
  {
    id: "BOM-SB-25066",
    product: "Stance",
    assembly: "前叉總成",
    revision: "C",
    status: "superseded",
    owner: "吳柏霖",
    effectiveDate: "2025-04-01",
    updatedAt: "2026-09-01T14:08",
    supersededBy: "BOM-SB-26061",
    applicability: scope("Stance", "登山車", "2024–2025", "S–L"),
    lines: [
      line(0, "SP-FK-1503", "避震前叉", 1, "支", "assembly", true),
      line(1, "SP-FK-1510", "防塵套", 2, "個", "consumable"),
      line(1, "SP-FK-1516", "前叉固定螺栓", 1, "個", "replaceable"),
    ],
    supersessions: [
      { fromPartId: "SP-FK-1503", toPartId: "SP-FK-2601", relation: "停產取代", effectiveDate: "2026-09-01" },
    ],
    audit: [
      event("2025-03-03T11:42", "吳柏霖", "建立草稿"),
      event("2025-04-01T10:05", "陳宜安", "核准發行"),
      event("2026-09-01T14:08", "吳柏霖", "標記已取代"),
    ],
  },
  {
    id: "BOM-SB-26061",
    product: "Stance",
    assembly: "前叉總成",
    revision: "D",
    status: "released",
    owner: "吳柏霖",
    effectiveDate: "2026-09-01",
    updatedAt: "2026-09-01T14:11",
    applicability: scope("Stance", "登山車", "2026", "S–L"),
    lines: [
      line(0, "SP-FK-2601", "避震前叉", 1, "支", "assembly"),
      line(1, "SP-FK-2610", "防塵套", 2, "個", "consumable"),
      line(1, "SP-FK-1516", "前叉固定螺栓", 1, "個", "replaceable"),
      line(1, "SP-FK-2618", "氣壓氣嘴", 1, "個", "serviceable"),
    ],
    supersessions: [],
    audit: [
      event("2026-08-06T09:33", "吳柏霖", "建立草稿"),
      event("2026-08-20T15:17", "張詠慈", "送出審查"),
      event("2026-09-01T14:11", "黃子謙", "核准發行"),
    ],
  },
];

export function getBom(id: string): BomRecord | undefined {
  return boms.find((record) => record.id === id);
}
