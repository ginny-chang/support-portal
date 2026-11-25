import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import type { ReactNode } from "react";
import { Checkbox } from "./Checkbox";

export interface Column<T> {
  id: string;
  header: string;
  width?: string;
  align?: "left" | "right";
  sortable?: boolean;
  render: (row: T) => ReactNode;
}

type DataTableProps<T> = {
  caption: string;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  rowClassName?: (row: T) => string | undefined;
  empty: string;
  selectable?: boolean;
  selectedKeys?: ReadonlySet<string>;
  onToggleRow?: (key: string) => void;
  onToggleAll?: () => void;
  sort?: { id: string; dir: "asc" | "desc" } | null;
  onSort?: (id: string) => void;
  onRowClick?: (row: T) => void;
  trailing?: (row: T) => ReactNode;
};

export function DataTable<T>({
  caption,
  columns,
  rows,
  rowKey,
  rowClassName,
  empty,
  selectable = false,
  selectedKeys,
  onToggleRow,
  onToggleAll,
  sort,
  onSort,
  onRowClick,
  trailing,
}: DataTableProps<T>) {
  const keys = rows.map(rowKey);
  const selectedCount = keys.filter((key) => selectedKeys?.has(key)).length;
  const allSelected = keys.length > 0 && selectedCount === keys.length;
  const mixed = selectedCount > 0 && !allSelected;
  const colSpan = columns.length + (selectable ? 1 : 0) + (trailing ? 1 : 0);

  return (
    <div className="table-wrap">
      <table className="data">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {selectable ? (
              <th style={{ width: 48 }}>
                <Checkbox
                  checked={allSelected}
                  mixed={mixed}
                  label="選取全部"
                  onChange={() => onToggleAll?.()}
                />
              </th>
            ) : null}
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                style={{ width: column.width }}
                className={column.align === "right" ? "align-right" : undefined}
                aria-sort={
                  sort?.id === column.id ? (sort.dir === "asc" ? "ascending" : "descending") : "none"
                }
              >
                {column.sortable && onSort ? (
                  <button type="button" className="sort-btn" onClick={() => onSort(column.id)}>
                    {column.header}
                    <SortIcon active={sort?.id === column.id} dir={sort?.dir} />
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
            {trailing ? <th style={{ width: 56 }} /> : null}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="empty-cell" colSpan={colSpan}>
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const key = rowKey(row);
              const selected = selectedKeys?.has(key) ?? false;
              const extra = rowClassName?.(row);
              const className = [onRowClick ? "is-clickable" : "", selected ? "is-selected" : "", extra]
                .filter(Boolean)
                .join(" ");
              return (
                <tr key={key} className={className || undefined} onClick={() => onRowClick?.(row)}>
                  {selectable ? (
                    <td>
                      <Checkbox
                        checked={selected}
                        label={`選取 ${key}`}
                        onChange={() => onToggleRow?.(key)}
                      />
                    </td>
                  ) : null}
                  {columns.map((column) => (
                    <td key={column.id} className={column.align === "right" ? "align-right" : undefined}>
                      {column.render(row)}
                    </td>
                  ))}
                  {trailing ? (
                    <td onClick={(event) => event.stopPropagation()}>{trailing(row)}</td>
                  ) : null}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

function SortIcon({ active, dir }: { active: boolean; dir?: "asc" | "desc" }) {
  if (!active) return <ChevronsUpDown size={12} aria-hidden="true" />;
  if (dir === "asc") return <ChevronUp size={12} aria-hidden="true" />;
  return <ChevronDown size={12} aria-hidden="true" />;
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="skeleton" aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <div className="skeleton-row" key={index}>
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}
