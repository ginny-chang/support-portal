import { Plus } from "lucide-react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../components/Button";
import type { Column } from "../components/DataTable";
import { DataTable, TableSkeleton } from "../components/DataTable";
import { SearchField, SelectField, TextField } from "../components/Fields";
import { FilterForm } from "../components/FilterPopover";
import { StatusTag } from "../components/StatusTag";
import { Tabs } from "../components/Tabs";
import type { TagTone } from "../data/labels";
import { defaultQuery } from "../data/query";
import type { BomQuery } from "../data/query";

const meta = {
  title: "Components/Library",
} satisfies Meta;

export default meta;

export const Buttons: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Button icon={<Plus size={16} />}>新增 BOM</Button>
      <Button variant="secondary">篩選</Button>
      <Button variant="ghost">清除條件</Button>
      <Button disabled>停用</Button>
    </div>
  ),
};

export const Fields: StoryObj = {
  render: () => <FieldsDemo />,
};

function FieldsDemo() {
  const [text, setText] = useState("");
  const [rev, setRev] = useState("");
  const [date, setDate] = useState("2026-03-01");
  const [search, setSearch] = useState("");
  return (
    <div style={{ display: "grid", gap: 16, width: 360 }}>
      <SearchField label="搜尋產品、車型、總成或料號" value={search} onValueChange={setSearch} />
      <TextField label="BOM ID" value={text} onChange={(event) => setText(event.target.value)} />
      <SelectField
        label="版本"
        value={rev}
        options={[
          { value: "", label: "全部版本" },
          { value: "A", label: "A" },
          { value: "B", label: "B" },
          { value: "C", label: "C" },
        ]}
        onChange={(event) => setRev(event.target.value)}
      />
      <TextField label="生效日" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
    </div>
  );
}

const tabItems = [
  { id: "all", label: "全部" },
  { id: "draft", label: "草稿" },
  { id: "in_review", label: "審查中" },
  { id: "released", label: "已發行" },
  { id: "retired", label: "已取代或已停用" },
];

export const TabBar: StoryObj = { render: () => <TabsDemo /> };

function TabsDemo() {
  const [value, setValue] = useState("released");
  return <Tabs label="BOM 狀態" items={tabItems} value={value} onChange={setValue} />;
}

const tones: { tone: TagTone; label: string }[] = [
  { tone: "draft", label: "草稿" },
  { tone: "review", label: "審查中" },
  { tone: "released", label: "已發行" },
  { tone: "superseded", label: "已取代" },
  { tone: "obsolete", label: "已停用" },
  { tone: "serviceable", label: "可維修" },
  { tone: "replaceable", label: "可更換" },
  { tone: "consumable", label: "耗材" },
  { tone: "assembly", label: "總成更換" },
];

export const StatusTags: StoryObj = {
  render: () => (
    <div className="tag-row">
      {tones.map((item) => (
        <StatusTag key={item.tone} tone={item.tone}>
          {item.label}
        </StatusTag>
      ))}
    </div>
  ),
};

interface SampleRow {
  id: string;
  name: string;
  revision: string;
}

const sampleRows: SampleRow[] = [
  { id: "BOM-SB-26014", name: "TCR Advanced SL", revision: "C" },
  { id: "BOM-SB-26022", name: "Defy Advanced Pro", revision: "B" },
  { id: "BOM-SB-26040", name: "Revolt Advanced", revision: "A" },
];

const sampleColumns: Column<SampleRow>[] = [
  { id: "id", header: "BOM ID", sortable: true, render: (row) => row.id },
  { id: "name", header: "產品或組件", sortable: true, render: (row) => row.name },
  { id: "revision", header: "版本", sortable: true, render: (row) => row.revision },
];

export const Table: StoryObj = { render: () => <TableDemo /> };
export const TableEmpty: StoryObj = {
  render: () => (
    <DataTable caption="服務 BOM" columns={sampleColumns} rows={[]} rowKey={(row) => row.id} empty="沒有符合的服務 BOM" />
  ),
};
export const TableLoading: StoryObj = { render: () => <TableSkeleton /> };

function TableDemo() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<{ id: string; dir: "asc" | "desc" }>({ id: "id", dir: "asc" });
  const rows = [...sampleRows].sort((left, right) => {
    const key = sort.id as keyof SampleRow;
    const result = left[key].localeCompare(right[key], "zh-Hant");
    return sort.dir === "asc" ? result : -result;
  });
  return (
    <DataTable
      caption="服務 BOM"
      columns={sampleColumns}
      rows={rows}
      rowKey={(row) => row.id}
      empty="沒有符合的服務 BOM"
      selectable
      selectedKeys={selected}
      onToggleRow={(key) => {
        setSelected((current) => {
          const next = new Set(current);
          if (next.has(key)) next.delete(key);
          else next.add(key);
          return next;
        });
      }}
      onToggleAll={() => {
        setSelected((current) => (current.size === rows.length ? new Set() : new Set(rows.map((row) => row.id))));
      }}
      sort={sort}
      onSort={(id) => {
        setSort((current) =>
          current.id === id ? { id, dir: current.dir === "asc" ? "desc" : "asc" } : { id, dir: "asc" },
        );
      }}
    />
  );
}

export const Filters: StoryObj = { render: () => <FilterDemo /> };

function FilterDemo() {
  const [query, setQuery] = useState<BomQuery>(defaultQuery);
  return (
    <FilterForm
      staticPanel
      query={query}
      onChange={(partial) => setQuery((current) => ({ ...current, ...partial }))}
    />
  );
}
