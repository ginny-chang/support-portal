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

function cityOf(location: string): string {
  return location.split(" ")[0] || location;
}

function serviceabilityChart(counts: Record<string, number>): ChartConfig {
  const tone = {
    serviceable: "var(--status-serviceable-fg)",
    replaceable: "var(--status-replaceable-fg)",
    consumable: "var(--status-consumable-fg)",
    assembly: "var(--status-assembly-fg)",
  } as const;
  return {
    serviceable: { label: <span className="whitespace-nowrap">{serviceabilityLabel("serviceable")} {counts.serviceable ?? 0}</span>, colors: { light: [tone.serviceable], dark: [tone.serviceable] } },
    replaceable: { label: <span className="whitespace-nowrap">{serviceabilityLabel("replaceable")} {counts.replaceable ?? 0}</span>, colors: { light: [tone.replaceable], dark: [tone.replaceable] } },
    consumable: { label: <span className="whitespace-nowrap">{serviceabilityLabel("consumable")} {counts.consumable ?? 0}</span>, colors: { light: [tone.consumable], dark: [tone.consumable] } },
    assembly: { label: <span className="whitespace-nowrap">{serviceabilityLabel("assembly")} {counts.assembly ?? 0}</span>, colors: { light: [tone.assembly], dark: [tone.assembly] } },
  };
}

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
  const serviceability = (["serviceable", "replaceable", "consumable", "assembly"] as const)
    .map((value) => ({
      value,
      count: records.filter((record) => record.serviceability === value).length,
    }))
    .filter((item) => item.count > 0);
  const pieData = serviceability.map((item) => ({ type: item.value, count: item.count }));
  const pieConfig = serviceabilityChart(Object.fromEntries(serviceability.map((item) => [item.value, item.count])));
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
          <EvilPieChart className="aspect-auto h-64 w-full" data={pieData} dataKey="count" nameKey="type" config={pieConfig}>
            <EvilPieChart.Legend isClickable variant="circle" />
            <EvilPieChart.Tooltip />
            <EvilPieChart.Pie isClickable />
          </EvilPieChart>
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
