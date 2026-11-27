import { Bike, Cog, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TopbarSlot } from "../components/AppShell";
import { Button } from "../components/Button";
import type { Column } from "../components/DataTable";
import { DataTable } from "../components/DataTable";
import { SearchField } from "../components/Fields";
import { StatusTag } from "../components/StatusTag";
import type { QualityClaim } from "../data/claims";
import { useClaims } from "../data/claimCatalog";
import { formatDateTime } from "../data/format";
import { workOrderStatusLabel, workOrderStatusTone } from "../data/labels";

export function ClaimListPage() {
  const navigate = useNavigate();
  const { records } = useClaims();
  const [query, setQuery] = useState("");
  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matched = needle
      ? records.filter((record) =>
          [record.id, record.product, record.assembly, record.claimType, record.dealer, record.description, record.owner]
            .join(" ")
            .toLowerCase()
            .includes(needle),
        )
      : records;
    return [...matched].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }, [query, records]);

  const columns = useMemo<Column<QualityClaim>[]>(
    () => [
      {
        id: "id",
        header: "Claim ID",
        width: "148px",
        render: (row) => (
          <Link className="id-link" to={`/claims/${row.id}`}>
            {row.id}
          </Link>
        ),
      },
      {
        id: "subject",
        header: "Product or Assembly",
        width: "260px",
        render: (row) => {
          const assemblyOnly = !row.product && Boolean(row.assembly);
          const Icon = assemblyOnly ? Cog : Bike;
          return (
            <Link to={`/claims/${row.id}`}>
              <span className="name-with-icon">
                <Icon size={14} aria-hidden="true" />
                {row.product || row.assembly}
              </span>
            </Link>
          );
        },
      },
      { id: "type", header: "Type", width: "120px", render: (row) => row.claimType },
      {
        id: "status",
        header: "Status",
        width: "176px",
        render: (row) => <StatusTag tone={workOrderStatusTone(row.status)}>{workOrderStatusLabel(row.status)}</StatusTag>,
      },
      { id: "dealer", header: "Dealer", render: (row) => row.dealer },
      { id: "owner", header: "Owner", width: "120px", render: (row) => row.owner },
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
        <SearchField label="product, assembly, dealer, or claim." value={query} onValueChange={setQuery} />
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => navigate("/claims/new")}>
          Create Quality Claim
        </Button>
      </TopbarSlot>
      <DataTable
        caption="Quality Claim"
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        empty="No matching Quality Claim"
        onRowClick={(row) => navigate(`/claims/${row.id}`)}
      />
    </div>
  );
}
