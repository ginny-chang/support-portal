import { Link, useParams } from "react-router-dom";
import { StatusTag } from "../components/StatusTag";
import { formatDateTime } from "../data/format";
import { serviceabilityLabel, serviceabilityTone } from "../data/labels";
import { useParts } from "../data/partCatalog";

export function PartDetailPage() {
  const { partId = "" } = useParams();
  const { records } = useParts();
  const record = records.find((item) => item.partId === partId);

  if (!record) {
    return (
      <div className="empty-page">
        <p>Spare part not found</p>
        <Link to="/parts">Back to list</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="detail">
        <div>
          <div className="detail-title">
            <h1>{record.description}</h1>
            <StatusTag tone={serviceabilityTone(record.serviceability)}>{serviceabilityLabel(record.serviceability)}</StatusTag>
          </div>
          <dl className="meta-grid">
            <div>
              <dt>Part ID</dt>
              <dd>{record.partId}</dd>
            </div>
            <div>
              <dt>Quantity</dt>
              <dd>
                {record.quantity} {record.unit}
              </dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{record.location}</dd>
            </div>
            <div>
              <dt>Owner</dt>
              <dd>{record.owner}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>{formatDateTime(record.updatedAt)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
