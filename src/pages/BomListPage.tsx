import { Plus } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { boms } from "../data/bom";
import type { BomRecord } from "../data/bom";
import { formatDate, formatDateTime } from "../data/format";
import { statusLabel, statusTone } from "../data/labels";
import { activeFilterCount, filterBoms, parseQuery, sortBoms, toSearchParams } from "../data/query";
import type { BomQuery, SortKey } from "../data/query";
import { TopbarSlot } from "../components/AppShell";
import { Button } from "../components/Button";
import type { Column } from "../components/DataTable";
import { DataTable } from "../components/DataTable";
import { SearchField } from "../components/Fields";
import { FilterPopover } from "../components/FilterPopover";
import { KebabMenu } from "../components/KebabMenu";
import { StatusTag } from "../components/StatusTag";

export function BomListPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const search = params.toString();
  const query = useMemo(() => parseQuery(new URLSearchParams(search)), [search]);
  const queryRef = useRef(query);
  queryRef.current = query;
  const [draft, setDraft] = useState(query.q);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function update(partial: Partial<BomQuery>) {
    const next = { ...queryRef.current, ...partial };
    queryRef.current = next;
    setParams(toSearchParams(next), { replace: true });
  }

  const rows = useMemo(() => sortBoms(filterBoms(boms, query), query), [query]);
  const visibleKey = rows.map((row) => row.id).join("|");
  const [selectionScope, setSelectionScope] = useState(visibleKey);
  if (selectionScope !== visibleKey) {
    setSelectionScope(visibleKey);
    setSelected(new Set());
  }

  function openDetail(id: string) {
    navigate(`/bom/${id}`, { state: { from: location.search } });
  }

  const columns = useMemo<Column<BomRecord>[]>(
    () => [
      {
        id: "id",
        header: "BOM ID",
        width: "156px",
        sortable: true,
        render: (row) => (
          <Link
            className="id-link"
            to={`/bom/${row.id}`}
            state={{ from: location.search }}
            onClick={(event) => event.stopPropagation()}
          >
            {row.id}
          </Link>
        ),
      },
      {
        id: "product",
        header: "Product or Assembly",
        sortable: true,
        render: (row) => (
          <div className="product-cell">
            <Link
              to={`/bom/${row.id}`}
              state={{ from: location.search }}
              onClick={(event) => event.stopPropagation()}
            >
              {row.product}
            </Link>
            <span>{row.assembly}</span>
          </div>
        ),
      },
      {
        id: "revision",
        header: "Revision",
        width: "84px",
        sortable: true,
        render: (row) => row.revision,
      },
      {
        id: "status",
        header: "Status",
        width: "120px",
        sortable: true,
        render: (row) => <StatusTag tone={statusTone(row.status)}>{statusLabel(row.status)}</StatusTag>,
      },
      {
        id: "owner",
        header: "Owner",
        width: "104px",
        sortable: true,
        render: (row) => row.owner,
      },
      {
        id: "effective",
        header: "Effective Date",
        width: "124px",
        sortable: true,
        render: (row) => formatDate(row.effectiveDate),
      },
      {
        id: "updated",
        header: "Last Updated",
        width: "168px",
        sortable: true,
        render: (row) => formatDateTime(row.updatedAt),
      },
    ],
    [location.search],
  );

  function onSort(id: string) {
    const key = id as SortKey;
    if (query.sort === key) {
      update({ dir: query.dir === "asc" ? "desc" : "asc" });
      return;
    }
    const textKeys = new Set<SortKey>(["id", "product", "revision", "status", "owner"]);
    update({ sort: key, dir: textKeys.has(key) ? "asc" : "desc" });
  }

  return (
    <div className="page">
      <TopbarSlot>
        <SearchField
          label="Search by product, model, assembly, or part number"
          value={draft}
          onValueChange={(value) => {
            setDraft(value);
            update({ q: value });
          }}
        />
        <FilterPopover query={query} activeCount={activeFilterCount(query)} onChange={update} />
        <Button variant="primary" icon={<Plus size={16} />}>
          Add BOM
        </Button>
      </TopbarSlot>
      <DataTable
        caption="Service BOM"
        columns={columns}
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
          setSelected((current) => {
            if (rows.every((row) => current.has(row.id))) return new Set();
            return new Set(rows.map((row) => row.id));
          });
        }}
        sort={{ id: query.sort, dir: query.dir }}
        onSort={onSort}
        onRowClick={(row) => openDetail(row.id)}
        trailing={(row) => <KebabMenu label="View detail" onSelect={() => openDetail(row.id)} />}
      />
    </div>
  );
}
