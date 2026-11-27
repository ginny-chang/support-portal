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

const LOW_STOCK = 10;

function cityOf(location: string): string {
  return location.split(" ")[0] || location;
}

export function PartListPage() {
  const navigate = useNavigate();
  const { records } = useParts();
  const [query, setQuery] = useState("");
  const onHand = records.reduce((sum, record) => sum + record.quantity, 0);
  const lowStock = records.filter((record) => record.quantity <= LOW_STOCK).length;
  const locations = new Set(records.map((record) => cityOf(record.location)));
  const byLocation = [...locations].map((city) => ({
    city,
    quantity: records.filter((record) => cityOf(record.location) === city).reduce((sum, record) => sum + record.quantity, 0),
  }));
  const maxLocation = Math.max(...byLocation.map((item) => item.quantity), 1);
  const serviceability = (["serviceable", "replaceable", "consumable", "assembly"] as const).map((value) => ({
    value,
    count: records.filter((record) => record.serviceability === value).length,
  }));
  const maxServiceability = Math.max(...serviceability.map((item) => item.count), 1);
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
    <div className="page parts-dashboard">
      <TopbarSlot>
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => navigate("/parts/new")}>
          Create Spare Part
        </Button>
      </TopbarSlot>
      <section className="dash-stats" aria-label="Stock summary">
        <article>
          <span>SKUs</span>
          <strong>{records.length}</strong>
        </article>
        <article>
          <span>On hand</span>
          <strong>{onHand}</strong>
        </article>
        <article>
          <span>Low stock</span>
          <strong>{lowStock}</strong>
        </article>
        <article>
          <span>Locations</span>
          <strong>{locations.size}</strong>
        </article>
      </section>
      <section className="dash-charts">
        <article>
          <h2>On hand by location</h2>
          <ul>
            {byLocation.map((item) => (
              <li key={item.city}>
                <span>{item.city}</span>
                <span className="dash-track" aria-hidden="true">
                  <span style={{ width: `${(item.quantity / maxLocation) * 100}%` }} />
                </span>
                <strong>{item.quantity}</strong>
              </li>
            ))}
          </ul>
        </article>
        <article>
          <h2>Serviceability</h2>
          <ul>
            {serviceability.map((item) => (
              <li key={item.value}>
                <StatusTag tone={serviceabilityTone(item.value)}>{serviceabilityLabel(item.value)}</StatusTag>
                <span className="dash-track" aria-hidden="true">
                  <span className={`is-${item.value}`} style={{ width: `${(item.count / maxServiceability) * 100}%` }} />
                </span>
                <strong>{item.count}</strong>
              </li>
            ))}
          </ul>
        </article>
      </section>
      <section className="dash-query" aria-label="Spare part lookup">
        <div className="dash-query-bar">
          <SearchField label="part number, description, or location." value={query} onValueChange={setQuery} />
          <span>
            {rows.length} of {records.length}
          </span>
        </div>
        <DataTable
          caption="Spare Part Management"
          columns={columns}
          rows={rows}
          rowKey={(row) => row.partId}
          empty="No matching spare part"
          onRowClick={(row) => navigate(`/parts/${row.partId}`)}
        />
      </section>
    </div>
  );
}
