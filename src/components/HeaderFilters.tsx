import { Check, ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import type { BomStatus } from "../data/bom";
import { statusLabel } from "../data/labels";
import type { SortDir, SortKey } from "../data/query";

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
            <label key={status} className="menu-check">
              <input type="checkbox" checked={selected.includes(status)} onChange={() => onToggle(status)} />
              {statusLabel(status)}
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

export function ProductFilter({
  products,
  assemblies,
  selected,
  onChange,
}: {
  products: string[];
  assemblies: string[];
  selected: string;
  onChange: (value: string) => void;
}) {
  return (
    <HeaderMenu label="Product or Assembly" active={selected !== ""} icon={<ChevronDown size={12} aria-hidden="true" />}>
      {(close) => (
        <>
          <button
            type="button"
            className={selected === "" ? "menu-option is-active" : "menu-option"}
            onClick={() => {
              onChange("");
              close();
            }}
          >
            All
          </button>
          <div className="menu-label">Product</div>
          {products.map((product) => {
            const value = `product:${product}`;
            return (
              <button
                key={value}
                type="button"
                className={selected === value ? "menu-option is-active" : "menu-option"}
                onClick={() => {
                  onChange(value);
                  close();
                }}
              >
                {product}
              </button>
            );
          })}
          <div className="menu-label">Assembly</div>
          {assemblies.map((assembly) => {
            const value = `assembly:${assembly}`;
            return (
              <button
                key={value}
                type="button"
                className={selected === value ? "menu-option is-active" : "menu-option"}
                onClick={() => {
                  onChange(value);
                  close();
                }}
              >
                {assembly}
              </button>
            );
          })}
        </>
      )}
    </HeaderMenu>
  );
}

export function SortFilter({
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
    <HeaderMenu label={label} active={active} icon={icon}>
      {(close) => (
        <>
          <SortChoice
            label="Newest to oldest"
            selected={active && dir === "desc"}
            onClick={() => {
              onChange(sortKey, "desc");
              close();
            }}
          />
          <SortChoice
            label="Oldest to newest"
            selected={active && dir === "asc"}
            onClick={() => {
              onChange(sortKey, "asc");
              close();
            }}
          />
        </>
      )}
    </HeaderMenu>
  );
}

function SortChoice({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" className={selected ? "menu-option is-active" : "menu-option"} onClick={onClick}>
      {selected ? <Check size={14} aria-hidden="true" /> : <span className="menu-option-gap" />}
      {label}
    </button>
  );
}
