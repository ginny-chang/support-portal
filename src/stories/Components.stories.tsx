import { Plus } from "lucide-react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../components/Button";
import type { Column } from "../components/DataTable";
import { DataTable, TableSkeleton } from "../components/DataTable";
import { SearchField, SelectField, TextField } from "../components/Fields";
import { ProductFilter, RevisionFilter, SortHeader, StatusFilter } from "../components/HeaderFilters";
import { StatusTag } from "../components/StatusTag";
import { Tabs } from "../components/Tabs";
import type { TagTone } from "../data/labels";
import type { BomStatus } from "../data/bom";
import type { ColumnFocus, SortDir, SortKey } from "../data/query";

const meta = {
  title: "Components/Library",
} satisfies Meta;

export default meta;

export const Buttons: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Button icon={<Plus size={16} />}>Add BOM</Button>
      <Button variant="secondary">Filters</Button>
      <Button variant="ghost">Clear</Button>
      <Button disabled>Disabled</Button>
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
      <SearchField label="product, model, assembly, or part number." value={search} onValueChange={setSearch} />
      <TextField label="BOM ID" value={text} onChange={(event) => setText(event.target.value)} />
      <SelectField
        label="Revision"
        value={rev}
        options={[
          { value: "", label: "All revisions" },
          { value: "A", label: "A" },
          { value: "B", label: "B" },
          { value: "C", label: "C" },
        ]}
        onChange={(event) => setRev(event.target.value)}
      />
      <TextField label="Effective date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
    </div>
  );
}

const tabItems = [
  { id: "all", label: "All" },
  { id: "draft", label: "Draft" },
  { id: "in_review", label: "In Review" },
  { id: "released", label: "Released" },
  { id: "retired", label: "Superseded or Obsolete" },
];

export const TabBar: StoryObj = { render: () => <TabsDemo /> };

function TabsDemo() {
  const [value, setValue] = useState("released");
  return <Tabs label="BOM status" items={tabItems} value={value} onChange={setValue} />;
}

const tones: { tone: TagTone; label: string }[] = [
  { tone: "draft", label: "Draft" },
  { tone: "review", label: "In Review" },
  { tone: "released", label: "Released" },
  { tone: "superseded", label: "Superseded" },
  { tone: "obsolete", label: "Obsolete" },
  { tone: "serviceable", label: "Serviceable" },
  { tone: "replaceable", label: "Replaceable" },
  { tone: "consumable", label: "Consumable" },
  { tone: "assembly", label: "Assembly replacement" },
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
  { id: "name", header: "Product or assembly", sortable: true, render: (row) => row.name },
  { id: "revision", header: "Revision", sortable: true, render: (row) => row.revision },
];

export const Table: StoryObj = { render: () => <TableDemo /> };
export const TableEmpty: StoryObj = {
  render: () => (
    <DataTable caption="Service BOM" columns={sampleColumns} rows={[]} rowKey={(row) => row.id} empty="No matching Service BOM" />
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
      caption="Service BOM"
      columns={sampleColumns}
      rows={rows}
      rowKey={(row) => row.id}
      empty="No matching Service BOM"
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
  const [revisions, setRevisions] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<BomStatus[]>([]);
  const [column, setColumn] = useState<ColumnFocus>("");
  const [sort, setSort] = useState<SortKey>("updated");
  const [dir, setDir] = useState<SortDir>("desc");
  return (
    <div className="summary-tools">
      <RevisionFilter
        revisions={["A", "B", "C"]}
        selected={revisions}
        onToggle={(revision) =>
          setRevisions((current) =>
            current.includes(revision) ? current.filter((item) => item !== revision) : [...current, revision],
          )
        }
        onClear={() => setRevisions([])}
      />
      <StatusFilter
        selected={statuses}
        onToggle={(status) =>
          setStatuses((current) =>
            current.includes(status) ? current.filter((item) => item !== status) : [...current, status],
          )
        }
        onClear={() => setStatuses([])}
      />
      <ProductFilter selected={column} onChange={setColumn} />
      <SortHeader label="Last Update" sortKey="updated" activeKey={sort} dir={dir} onChange={(next, order) => { setSort(next); setDir(order); }} />
      <SortHeader label="Effective Date" sortKey="effective" activeKey={sort} dir={dir} onChange={(next, order) => { setSort(next); setDir(order); }} />
      <SortHeader label="BOM ID" sortKey="id" activeKey={sort} dir={dir} onChange={(next, order) => { setSort(next); setDir(order); }} />
    </div>
  );
}
