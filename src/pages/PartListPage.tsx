import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TopbarSlot } from "../components/AppShell";
import { Button } from "../components/Button";
import type { Column } from "../components/DataTable";
import { DataTable } from "../components/DataTable";
import { SearchField } from "../components/Fields";
import { StockGlobe } from "../components/StockGlobe";
import { EvilPieChart } from "@/registry/charts/recharts-pie-chart";
import type { ChartConfig } from "@/registry/ui/recharts-chart";
import { StatusTag } from "../components/StatusTag";
import { formatDateTime } from "../data/format";
import { serviceabilityLabel, serviceabilityTone } from "../data/labels";
import type { SparePart } from "../data/parts";
import { useParts } from "../data/partCatalog";

const LOW_STOCK = 10;

const CITY_LATLNG: Record<string, [number, number]> = {
  Taipei: [25.033, 121.5654],
  Taichung: [24.1477, 120.6736],
  Kaohsiung: [22.6273, 120.3014],
};

const SERVICEABILITY_COLORS = {
  serviceable: ["#0e5f68", "#8fd0d6"],
  replaceable: ["#243e8c", "#9aafdf"],
  consumable: ["#5c3e00", "#e4c57a"],
  assembly: ["#3e3278", "#b7aee0"],
} as const;

function cityOf(location: string): string {
  return location.split(" ")[0] || location;
}

function serviceabilityChart(): ChartConfig {
  return {
    serviceable: { label: serviceabilityLabel("serviceable"), colors: { light: [...SERVICEABILITY_COLORS.serviceable], dark: [...SERVICEABILITY_COLORS.serviceable] } },
    replaceable: { label: serviceabilityLabel("replaceable"), colors: { light: [...SERVICEABILITY_COLORS.replaceable], dark: [...SERVICEABILITY_COLORS.replaceable] } },
    consumable: { label: serviceabilityLabel("consumable"), colors: { light: [...SERVICEABILITY_COLORS.consumable], dark: [...SERVICEABILITY_COLORS.consumable] } },
    assembly: { label: serviceabilityLabel("assembly"), colors: { light: [...SERVICEABILITY_COLORS.assembly], dark: [...SERVICEABILITY_COLORS.assembly] } },
  };
}

export function PartListPage() {
  const navigate = useNavigate();
  const { records } = useParts();
  const [query, setQuery] = useState("");
  const onHand = records.reduce((sum, record) => sum + record.quantity, 0);
  const lowStock = records.filter((record) => record.quantity <= LOW_STOCK).length;
  const locations = useMemo(() => new Set(records.map((record) => cityOf(record.location))), [records]);
  const byLocation = useMemo(
    () =>
      [...new Set(records.map((record) => cityOf(record.location)))].flatMap((city) => {
        const latlng = CITY_LATLNG[city];
        if (!latlng) return [];
        return [
          {
            city,
            latitude: latlng[0],
            longitude: latlng[1],
            quantity: records.filter((record) => cityOf(record.location) === city).reduce((sum, record) => sum + record.quantity, 0),
          },
        ];
      }),
    [records],
  );
  const serviceability = (["serviceable", "replaceable", "consumable", "assembly"] as const)
    .map((value) => ({
      value,
      count: records.filter((record) => record.serviceability === value).length,
    }))
    .filter((item) => item.count > 0);
  const pieData = serviceability.map((item) => ({ type: item.value, count: item.count }));
  const pieConfig = serviceabilityChart();
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
          <StockGlobe places={byLocation} />
        </article>
        <article>
          <h2>Serviceability</h2>
          <div className="parts-pie">
            <EvilPieChart className="h-full w-full" data={pieData} dataKey="count" nameKey="type" config={pieConfig}>
              <EvilPieChart.Legend variant="circle" />
              <EvilPieChart.Tooltip />
              <EvilPieChart.Pie paddingAngle={3} cornerRadius={8} />
            </EvilPieChart>
          </div>
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
