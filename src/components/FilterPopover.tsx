import { ListFilter } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { revisions } from "../data/bom";
import type { BomQuery } from "../data/query";
import { statusPartial, statusValue } from "../data/query";
import { Button } from "./Button";

type FilterPopoverProps = {
  query: BomQuery;
  activeCount: number;
  onChange: (partial: Partial<BomQuery>) => void;
  forceOpen?: boolean;
};

const statusOptions: { value: string; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "draft", label: "草稿" },
  { value: "in_review", label: "審查中" },
  { value: "released", label: "已發行" },
  { value: "retired", label: "已取代或已停用" },
  { value: "superseded", label: "已取代" },
  { value: "obsolete", label: "已停用" },
];

export function FilterPopover({ query, activeCount, onChange, forceOpen = false }: FilterPopoverProps) {
  const [open, setOpen] = useState(forceOpen);
  const ref = useRef<HTMLDivElement>(null);
  const shown = forceOpen || open;

  useEffect(() => {
    if (!shown || forceOpen) return;
    function onPointer(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [forceOpen, shown]);

  return (
    <div className="filter-anchor" ref={ref}>
      <Button
        variant="secondary"
        className={activeCount > 0 ? "is-active" : undefined}
        icon={<ListFilter size={16} />}
        aria-expanded={shown}
        aria-controls="bom-filters"
        onClick={() => setOpen((value) => !value)}
      >
        篩選
        {activeCount > 0 ? <span className="badge">{activeCount}</span> : null}
      </Button>
      {shown ? (
        <FilterForm id="bom-filters" query={query} onChange={onChange} staticPanel={forceOpen} />
      ) : null}
    </div>
  );
}

type FilterFormProps = {
  id?: string;
  query: BomQuery;
  onChange: (partial: Partial<BomQuery>) => void;
  staticPanel?: boolean;
};

export function FilterForm({ id, query, onChange, staticPanel = false }: FilterFormProps) {
  const baseId = useId();
  return (
    <div id={id} className={staticPanel ? "popover popover-static" : "popover"}>
      <label className="field" htmlFor={`${baseId}-rev`}>
        <span className="field-label">版本</span>
        <select
          id={`${baseId}-rev`}
          className="control"
          value={query.rev}
          onChange={(event) => onChange({ rev: event.target.value })}
        >
          <option value="">全部版本</option>
          {revisions.map((revision) => (
            <option key={revision} value={revision}>
              {revision}
            </option>
          ))}
        </select>
      </label>
      <label className="field" htmlFor={`${baseId}-status`}>
        <span className="field-label">狀態</span>
        <select
          id={`${baseId}-status`}
          className="control"
          value={statusValue(query)}
          onChange={(event) => onChange(statusPartial(event.target.value))}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <div className="date-row">
        <label className="field" htmlFor={`${baseId}-from`}>
          <span className="field-label">生效日起</span>
          <input
            id={`${baseId}-from`}
            className="control"
            type="date"
            value={query.from}
            max={query.to || undefined}
            onChange={(event) => onChange({ from: event.target.value })}
          />
        </label>
        <label className="field" htmlFor={`${baseId}-to`}>
          <span className="field-label">生效日迄</span>
          <input
            id={`${baseId}-to`}
            className="control"
            type="date"
            value={query.to}
            min={query.from || undefined}
            onChange={(event) => onChange({ to: event.target.value })}
          />
        </label>
      </div>
      <Button
        variant="ghost"
        onClick={() => onChange({ rev: "", from: "", to: "", exact: "" })}
      >
        清除條件
      </Button>
    </div>
  );
}
