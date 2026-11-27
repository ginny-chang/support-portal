import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TopbarSlot } from "../components/AppShell";
import { Button } from "../components/Button";
import type { Column } from "../components/DataTable";
import { DataTable } from "../components/DataTable";
import { SearchField } from "../components/Fields";
import { StatusTag } from "../components/StatusTag";
import { formatDateTime } from "../data/format";
import { serviceabilityLabel, serviceabilityTone } from "../data/labels";
import type { SparePart } from "../data/parts";
import { useParts } from "../data/partCatalog";

export function PartListPage() {
  const navigate = useNavigate();
  const { records } = useParts();
  const [query, setQuery] = useState("");
  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matched = needle
      ? records.filter((record) =>
          [record.partId, record.description, record.location, record.unit, record.owner].join(" ").toLowerCase().includes(needle),
        )
      : records;
    return [...matched].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }, [query, records]);

  const columns = useMemo<Column<SparePart>[]>(
    () => [
      {
        id: "id",
        header: "Part ID",
        width: "150px",
        render: (row) => (
          <Link className="id-link" to={`/parts/${row.partId}`}>
            {row.partId}
          </Link>
        ),
      },
      {
        id: "description",
        header: "Description",
        render: (row) => <Link to={`/parts/${row.partId}`}>{row.description}</Link>,
      },
      { id: "quantity", header: "Quantity", width: "96px", align: "right", render: (row) => row.quantity },
      { id: "unit", header: "Unit", width: "72px", render: (row) => row.unit },
      { id: "location", header: "Location", width: "160px", render: (row) => row.location },
      {
        id: "serviceability",
        header: "Serviceability",
        width: "160px",
        render: (row) => <StatusTag tone={serviceabilityTone(row.serviceability)}>{serviceabilityLabel(row.serviceability)}</StatusTag>,
      },
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
        <SearchField label="part number, description, or location." value={query} onValueChange={setQuery} />
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => navigate("/parts/new")}>
          Create Spare Part
        </Button>
      </TopbarSlot>
      <DataTable
        caption="Spare Part Management"
        columns={columns}
        rows={rows}
        rowKey={(row) => row.partId}
        empty="No matching spare part"
        onRowClick={(row) => navigate(`/parts/${row.partId}`)}
      />
    </div>
  );
}
