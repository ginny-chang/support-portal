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
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "in_review", label: "In Review" },
  { value: "released", label: "Released" },
  { value: "retired", label: "Superseded or Obsolete" },
  { value: "superseded", label: "Superseded" },
  { value: "obsolete", label: "Obsolete" },
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
        Filters
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
        <span className="field-label">Revision</span>
        <select
          id={`${baseId}-rev`}
          className="control"
          value={query.rev}
          onChange={(event) => onChange({ rev: event.target.value })}
        >
          <option value="">All revisions</option>
          {revisions.map((revision) => (
            <option key={revision} value={revision}>
              {revision}
            </option>
          ))}
        </select>
      </label>
      <label className="field" htmlFor={`${baseId}-status`}>
        <span className="field-label">Status</span>
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
          <span className="field-label">Effective from</span>
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
          <span className="field-label">Effective to</span>
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
        Clear
      </Button>
    </div>
  );
}
