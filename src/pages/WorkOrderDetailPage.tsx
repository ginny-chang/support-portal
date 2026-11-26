import { Link, useParams } from "react-router-dom";
import type { Column } from "../components/DataTable";
import { DataTable } from "../components/DataTable";
import { StatusTag } from "../components/StatusTag";
import { formatDateTime } from "../data/format";
import { statusLabel, statusTone } from "../data/labels";
import type { WorkOrderLine } from "../data/workOrders";
import { useWorkOrders } from "../data/workOrderCatalog";

const lineColumns: Column<WorkOrderLine>[] = [
  { id: "part", header: "Part ID", width: "160px", render: (line) => line.partId },
  { id: "description", header: "Description", render: (line) => line.description },
  { id: "quantity", header: "Quantity", width: "88px", align: "right", render: (line) => line.quantity },
  { id: "unit", header: "Unit", width: "72px", render: (line) => line.unit },
];

export function WorkOrderDetailPage() {
  const { workOrderId = "" } = useParams();
  const { records } = useWorkOrders();
  const record = records.find((item) => item.id === workOrderId);

  if (!record) {
    return (
      <div className="empty-page">
        <p>Service Work Order not found</p>
        <Link to="/work-orders">Back to list</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="detail">
        <div>
          <div className="detail-title">
            <h1>{record.product || record.assembly}</h1>
            <StatusTag tone={statusTone(record.status)}>{statusLabel(record.status)}</StatusTag>
          </div>
          {record.product && record.assembly ? <p className="detail-assembly">{record.assembly}</p> : null}
          <dl className="meta-grid">
            <div>
              <dt>Work Order ID</dt>
              <dd>{record.id}</dd>
            </div>
            <div>
              <dt>Service BOM</dt>
              <dd>
                <Link to={`/bom/${record.bomId}`}>{record.bomId}</Link>
              </dd>
            </div>
            <div>
              <dt>Serial number</dt>
              <dd>{record.serialNumber}</dd>
            </div>
            <div>
              <dt>Dealer</dt>
              <dd>{record.dealer}</dd>
            </div>
            <div>
              <dt>Owner</dt>
              <dd>{record.owner}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>{formatDateTime(record.updatedAt)}</dd>
            </div>
            <div>
              <dt>Request</dt>
              <dd>{record.request}</dd>
            </div>
          </dl>
          <h2 className="section-title">Lines</h2>
          <DataTable caption="Lines" columns={lineColumns} rows={record.lines} rowKey={(line) => line.partId} empty="None" />
        </div>
      </div>
    </div>
  );
}
