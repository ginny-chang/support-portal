import { Link, useParams } from "react-router-dom";
import { StatusTag } from "../components/StatusTag";
import { useClaims } from "../data/claimCatalog";
import { formatDateTime } from "../data/format";
import { statusLabel, statusTone } from "../data/labels";

export function ClaimDetailPage() {
  const { claimId = "" } = useParams();
  const { records } = useClaims();
  const record = records.find((item) => item.id === claimId);

  if (!record) {
    return (
      <div className="empty-page">
        <p>Quality Claim not found</p>
        <Link to="/claims">Back to list</Link>
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
          <dl className="meta-grid">
            <div>
              <dt>Claim ID</dt>
              <dd>{record.id}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>{record.claimType}</dd>
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
              <dt>Description</dt>
              <dd>{record.description}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
