import { Bike, Cog, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TopbarSlot } from "../components/AppShell";
import { Button } from "../components/Button";
import type { Column } from "../components/DataTable";
import { DataTable } from "../components/DataTable";
import { SearchField } from "../components/Fields";
import { StatusTag } from "../components/StatusTag";
import { formatDateTime } from "../data/format";
import { statusLabel, statusTone } from "../data/labels";
import type { WorkOrderRecord } from "../data/workOrders";
import { useWorkOrders } from "../data/workOrderCatalog";

export function WorkOrderListPage() {
  const navigate = useNavigate();
  const { records } = useWorkOrders();
  const [query, setQuery] = useState("");
  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matched = needle
      ? records.filter((record) =>
          [record.id, record.product, record.assembly, record.bomId, record.serialNumber, record.dealer, record.request, ...record.lines.map((line) => line.partId)]
            .join(" ")
            .toLowerCase()
            .includes(needle),
        )
      : records;
    return [...matched].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }, [query, records]);

  const columns = useMemo<Column<WorkOrderRecord>[]>(
    () => [
      {
        id: "id",
        header: "Work Order ID",
        width: "156px",
        render: (row) => (
          <Link className="id-link" to={`/work-orders/${row.id}`}>
            {row.id}
          </Link>
        ),
      },
      {
        id: "subject",
        header: "Product or Assembly",
        width: "280px",
        render: (row) => {
          const assemblyOnly = !row.product && Boolean(row.assembly);
          const Icon = assemblyOnly ? Cog : Bike;
          return (
            <Link to={`/work-orders/${row.id}`}>
              <span className="name-with-icon">
                <Icon size={14} aria-hidden="true" />
                {row.product || row.assembly}
              </span>
            </Link>
          );
        },
      },
      {
        id: "bom",
        header: "Service BOM",
        width: "156px",
        render: (row) => (
          <Link className="id-link" to={`/bom/${row.bomId}`}>
            {row.bomId}
          </Link>
        ),
      },
      {
        id: "status",
        header: "Status",
        width: "124px",
        render: (row) => <StatusTag tone={statusTone(row.status)}>{statusLabel(row.status)}</StatusTag>,
      },
      { id: "dealer", header: "Dealer", render: (row) => row.dealer },
      {
        id: "updated",
        header: "Last Update",
        width: "156px",
        render: (row) => formatDateTime(row.updatedAt),
      },
    ],
    [],
  );

  return (
    <div className="page">
      <TopbarSlot>
        <SearchField label="product, assembly, dealer, or part number." value={query} onValueChange={setQuery} />
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => navigate("/work-orders/new")}>
          Create Service Work Order
        </Button>
      </TopbarSlot>
      <DataTable
        caption="Service Work Order"
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        empty="No matching Service Work Order"
        onRowClick={(row) => navigate(`/work-orders/${row.id}`)}
      />
    </div>
  );
}
