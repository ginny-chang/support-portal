import { Layers, Plus } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { boms } from "../data/bom";
import type { BomRecord } from "../data/bom";
import { formatDate, formatDateTime } from "../data/format";
import { statusLabel, statusTone } from "../data/labels";
import { activeFilterCount, filterBoms, parseQuery, sortBoms, toSearchParams } from "../data/query";
import type { BomQuery, SortKey, TabId } from "../data/query";
import { Button } from "../components/Button";
import type { Column } from "../components/DataTable";
import { DataTable } from "../components/DataTable";
import { FilterPopover } from "../components/FilterPopover";
import { KebabMenu } from "../components/KebabMenu";
import { StatusTag } from "../components/StatusTag";
import { Tabs } from "../components/Tabs";

const tabs: { id: TabId; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "draft", label: "草稿" },
  { id: "in_review", label: "審查中" },
  { id: "released", label: "已發行" },
  { id: "retired", label: "已取代或已停用" },
];

export function BomListPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const search = params.toString();
  const query = useMemo(() => parseQuery(new URLSearchParams(search)), [search]);
  const queryRef = useRef(query);
  queryRef.current = query;
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
        header: "產品或組件",
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
        header: "版本",
        width: "84px",
        sortable: true,
        render: (row) => row.revision,
      },
      {
        id: "status",
        header: "狀態",
        width: "120px",
        sortable: true,
        render: (row) => <StatusTag tone={statusTone(row.status)}>{statusLabel(row.status)}</StatusTag>,
      },
      {
        id: "owner",
        header: "負責人",
        width: "104px",
        sortable: true,
        render: (row) => row.owner,
      },
      {
        id: "effective",
        header: "生效日",
        width: "124px",
        sortable: true,
        render: (row) => formatDate(row.effectiveDate),
      },
      {
        id: "updated",
        header: "最後更新",
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
      <Tabs
        label="BOM 狀態"
        items={tabs}
        value={query.tab}
        onChange={(id) => update({ tab: id as TabId, exact: "" })}
      />
      <div className="summary">
        <div className="summary-count">
          <span className="count-icon">
            <Layers size={16} aria-hidden="true" />
          </span>
          <span aria-live="polite">{rows.length} 筆服務 BOM</span>
        </div>
        <div className="summary-actions">
          <FilterPopover query={query} activeCount={activeFilterCount(query)} onChange={update} />
          <Button variant="primary" icon={<Plus size={16} />}>
            新增 BOM
          </Button>
        </div>
      </div>
      <DataTable
        caption="服務 BOM"
        columns={columns}
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
          setSelected((current) => {
            if (rows.every((row) => current.has(row.id))) return new Set();
            return new Set(rows.map((row) => row.id));
          });
        }}
        sort={{ id: query.sort, dir: query.dir }}
        onSort={onSort}
        onRowClick={(row) => openDetail(row.id)}
        trailing={(row) => <KebabMenu label="查看明細" onSelect={() => openDetail(row.id)} />}
      />
    </div>
  );
}
