import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import type { BomStatus } from "../data/bom";
import { statusLabel, statusTone } from "../data/labels";
import type { ColumnFocus, SortDir, SortKey } from "../data/query";
import { StatusTag } from "./StatusTag";

const statusChoices: BomStatus[] = ["draft", "in_review", "released", "superseded", "obsolete"];

function useDismiss(open: boolean, onClose: () => void, ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) onClose();
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, ref]);
}

function HeaderMenu({
  label,
  active,
  icon,
  children,
}: {
  label: string;
  active: boolean;
  icon: ReactNode;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss(open, () => setOpen(false), ref);
  return (
    <div className="header-filter" ref={ref}>
      <button
        type="button"
        className={active ? "sort-btn is-active" : "sort-btn"}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
      >
        {label}
        {icon}
      </button>
      {open ? (
        <div className="header-menu" role="group" aria-label={label}>
          {children(() => setOpen(false))}
        </div>
      ) : null}
    </div>
  );
}

export function RevisionFilter({
  revisions,
  selected,
  onToggle,
  onClear,
}: {
  revisions: readonly string[];
  selected: string[];
  onToggle: (revision: string) => void;
  onClear: () => void;
}) {
  return (
    <HeaderMenu label="Revision" active={selected.length > 0} icon={<ChevronDown size={12} aria-hidden="true" />}>
      {() => (
        <>
          {revisions.map((revision) => (
            <label key={revision} className="menu-check">
              <input type="checkbox" checked={selected.includes(revision)} onChange={() => onToggle(revision)} />
              {revision}
            </label>
          ))}
          <button type="button" className="menu-clear" onClick={onClear}>
            Clear
          </button>
        </>
      )}
    </HeaderMenu>
  );
}

export function StatusFilter({
  selected,
  onToggle,
  onClear,
}: {
  selected: BomStatus[];
  onToggle: (status: BomStatus) => void;
  onClear: () => void;
}) {
  return (
    <HeaderMenu label="Status" active={selected.length > 0} icon={<ChevronDown size={12} aria-hidden="true" />}>
      {() => (
        <>
          {statusChoices.map((status) => (
            <label key={status} className={selected.includes(status) ? "menu-check is-checked" : "menu-check"}>
              <input type="checkbox" checked={selected.includes(status)} onChange={() => onToggle(status)} />
              <StatusTag tone={statusTone(status)}>{statusLabel(status)}</StatusTag>
            </label>
          ))}
          <button type="button" className="menu-clear" onClick={onClear}>
            Clear
          </button>
        </>
      )}
    </HeaderMenu>
  );
}

const columnChoices: { value: Exclude<ColumnFocus, "">; label: string }[] = [
  { value: "product", label: "Product" },
  { value: "assembly", label: "Assembly" },
];

export function ProductFilter({
  selected,
  onChange,
}: {
  selected: ColumnFocus;
  onChange: (value: ColumnFocus) => void;
}) {
  return (
    <HeaderMenu label="Product or Assembly" active={selected !== ""} icon={<ChevronDown size={12} aria-hidden="true" />}>
      {(close) => (
        <>
          {columnChoices.map((choice) => (
            <button
              key={choice.value}
              type="button"
              className={selected === choice.value ? "menu-option is-active" : "menu-option"}
              onClick={() => {
                onChange(choice.value);
                close();
              }}
            >
              {choice.label}
            </button>
          ))}
        </>
      )}
    </HeaderMenu>
  );
}

export function SortHeader({
  label,
  sortKey,
  activeKey,
  dir,
  onChange,
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  dir: SortDir;
  onChange: (sort: SortKey, dir: SortDir) => void;
}) {
  const active = activeKey === sortKey;
  const icon = !active ? (
    <ChevronsUpDown size={12} aria-hidden="true" />
  ) : dir === "asc" ? (
    <ChevronUp size={12} aria-hidden="true" />
  ) : (
    <ChevronDown size={12} aria-hidden="true" />
  );
  return (
    <button
      type="button"
      className={active ? "sort-btn is-active" : "sort-btn"}
      onClick={() => onChange(sortKey, active && dir === "desc" ? "asc" : "desc")}
    >
      {label}
      {icon}
    </button>
  );
}
