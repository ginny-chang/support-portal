import { Plus } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { revisions } from "../data/bom";
import type { BomRecord } from "../data/bom";
import { formatDate, formatDateTime } from "../data/format";
import { statusLabel, statusTone } from "../data/labels";
import { useBomCatalog } from "../data/bomCatalog";
import { filterBoms, parseQuery, sortBoms, toSearchParams } from "../data/query";
import type { BomQuery } from "../data/query";
import { TopbarSlot } from "../components/AppShell";
import { Button } from "../components/Button";
import type { Column } from "../components/DataTable";
import { DataTable } from "../components/DataTable";
import { SearchField } from "../components/Fields";
import { ProductFilter, RevisionFilter, SortHeader, StatusFilter } from "../components/HeaderFilters";
import { KebabMenu } from "../components/KebabMenu";
import { StatusTag } from "../components/StatusTag";

export function BomListPage() {
  const { records } = useBomCatalog();
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

  const rows = useMemo(() => sortBoms(filterBoms(records, query), query), [query, records]);
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
        header: (
          <SortHeader
            label="BOM ID"
            sortKey="id"
            activeKey={query.sort}
            dir={query.dir}
            onChange={(sort, dir) => update({ sort, dir })}
          />
        ),
        width: "156px",
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
        header: (
          <ProductFilter selected={query.column} onChange={(column) => update({ column })} />
        ),
        render: (row) => {
          const primary = query.column === "assembly" ? row.assembly : row.product;
          const secondary = query.column === "" ? row.assembly : null;
          return (
            <div className="product-cell">
              <Link
                to={`/bom/${row.id}`}
                state={{ from: location.search }}
                onClick={(event) => event.stopPropagation()}
              >
                {primary}
              </Link>
              {secondary ? <span>{secondary}</span> : null}
            </div>
          );
        },
      },
      {
        id: "revision",
        header: (
          <RevisionFilter
            revisions={revisions}
            selected={query.revisions}
            onToggle={(revision) => {
              const current = queryRef.current.revisions;
              update({
                revisions: current.includes(revision)
                  ? current.filter((item) => item !== revision)
                  : [...current, revision],
              });
            }}
            onClear={() => update({ revisions: [] })}
          />
        ),
        width: "120px",
        render: (row) => row.revision,
      },
      {
        id: "status",
        header: (
          <StatusFilter
            selected={query.statuses}
            onToggle={(status) => {
              const current = queryRef.current.statuses;
              update({
                statuses: current.includes(status) ? current.filter((item) => item !== status) : [...current, status],
              });
            }}
            onClear={() => update({ statuses: [] })}
          />
        ),
        width: "140px",
        render: (row) => <StatusTag tone={statusTone(row.status)}>{statusLabel(row.status)}</StatusTag>,
      },
      {
        id: "owner",
        header: "Owner",
        width: "104px",
        render: (row) => row.owner,
      },
      {
        id: "effective",
        header: (
          <SortHeader
            label="Effective Date"
            sortKey="effective"
            activeKey={query.sort}
            dir={query.dir}
            onChange={(sort, dir) => update({ sort, dir })}
          />
        ),
        width: "156px",
        render: (row) => formatDate(row.effectiveDate),
      },
      {
        id: "updated",
        header: (
          <SortHeader
            label="Last Update"
            sortKey="updated"
            activeKey={query.sort}
            dir={query.dir}
            onChange={(sort, dir) => update({ sort, dir })}
          />
        ),
        width: "168px",
        render: (row) => formatDateTime(row.updatedAt),
      },
    ],
    [location.search, query.column, query.dir, query.revisions, query.sort, query.statuses],
  );

  return (
    <div className="page">
      <TopbarSlot>
        <SearchField
          label="Search by product, model, assembly, or part number."
          value={draft}
          onValueChange={(value) => {
            setDraft(value);
            update({ q: value });
          }}
        />
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => navigate("/bom/new")}>
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
        onRowClick={(row) => openDetail(row.id)}
        trailing={(row) => <KebabMenu label="View detail" onSelect={() => openDetail(row.id)} />}
      />
    </div>
  );
}
