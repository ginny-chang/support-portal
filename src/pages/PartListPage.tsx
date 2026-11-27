import L from "leaflet";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { TopbarSlot } from "../components/AppShell";
import { Button } from "../components/Button";
import type { Column } from "../components/DataTable";
import { DataTable } from "../components/DataTable";
import { SearchField } from "../components/Fields";
import { EChartsPieChart, type ChartConfig } from "@/registry/charts/echarts-pie-chart";
import { cn } from "@/lib/utils";
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

function cityOf(location: string): string {
  return location.split(" ")[0] || location;
}

const SERVICEABILITY_CHART = [
  { key: "serviceable", swatch: "bg-[#0e5f68]", colors: ["#0e5f68", "#3d9aa3"] },
  { key: "replaceable", swatch: "bg-[#243e8c]", colors: ["#243e8c", "#5d78c4"] },
  { key: "consumable", swatch: "bg-[#5c3e00]", colors: ["#5c3e00", "#a67c2d"] },
  { key: "assembly", swatch: "bg-[#3e3278]", colors: ["#3e3278", "#6d62a8"] },
] as const;

function LocationMap({ places }: { places: { city: string; quantity: number }[] }) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!nodeRef.current || mapRef.current) return;
    const map = L.map(nodeRef.current, {
      center: [23.7, 120.9],
      zoom: 7,
      scrollWheelZoom: true,
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    const points: L.LatLngExpression[] = [];
    for (const place of places) {
      const latlng = CITY_LATLNG[place.city];
      if (!latlng) continue;
      points.push(latlng);
      L.circleMarker(latlng, {
        radius: 6,
        color: "#16181d",
        weight: 1,
        fillColor: "#16181d",
        fillOpacity: 1,
      })
        .bindTooltip(`${place.city} ${place.quantity}`, { permanent: true, direction: "right", className: "stock-map-label" })
        .addTo(layer);
    }
    if (points.length > 0) map.fitBounds(L.latLngBounds(points), { padding: [36, 36] });
  }, [places]);

  return <div ref={nodeRef} className="stock-map" />;
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
  const serviceability = SERVICEABILITY_CHART.map((item) => ({
    ...item,
    label: serviceabilityLabel(item.key),
    count: records.filter((record) => record.serviceability === item.key).length,
  })).filter((item) => item.count > 0);
  const pieData = serviceability.map((item) => ({ type: item.key, value: item.count }));
  const pieTotal = serviceability.reduce((sum, item) => sum + item.count, 0);
  const pieConfig = Object.fromEntries(
    serviceability.map((item) => [item.key, { label: item.label, colors: { light: [...item.colors], dark: [...item.colors] } }]),
  ) satisfies ChartConfig;
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
          <LocationMap places={byLocation} />
        </article>
        <article>
          <h2>Serviceability</h2>
          <div className="flex h-64 w-full items-center gap-3">
            <div className="relative aspect-square h-full max-w-72 shrink-0">
              <EChartsPieChart data={pieData} config={pieConfig} dataKey="value" nameKey="type" className="h-full w-full">
                <EChartsPieChart.Tooltip />
                <EChartsPieChart.Pie innerRadius="62%" outerRadius="92%" paddingAngle={6} cornerRadius={12} startAngle={90} endAngle={-270} />
              </EChartsPieChart>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="flex aspect-square w-[56%] flex-col items-center justify-center rounded-full border border-dashed border-border">
                  <span className="text-lg leading-none font-semibold tracking-tight text-primary">{pieTotal}</span>
                  <span className="mt-1 text-xs text-muted-foreground">SKUs</span>
                </div>
              </div>
            </div>
            <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center">
              {serviceability.map((item) => (
                <div key={item.key} className="flex items-center gap-2 py-1.5">
                  <span className={cn("size-2.5 shrink-0 rounded-[3px]", item.swatch)} />
                  <span className="truncate text-xs text-muted-foreground">{item.label}</span>
                  <span className="ml-auto text-xs font-semibold text-primary">{item.count}</span>
                </div>
              ))}
            </div>
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
