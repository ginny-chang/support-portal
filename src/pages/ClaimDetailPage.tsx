import { Link, useParams } from "react-router-dom";
import { StatusTag } from "../components/StatusTag";
import { useClaims } from "../data/claimCatalog";
import { formatDateTime } from "../data/format";
import { decisionLabel, decisionTone, workOrderStatusLabel, workOrderStatusTone } from "../data/labels";

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
            <StatusTag tone={workOrderStatusTone(record.status)}>{workOrderStatusLabel(record.status)}</StatusTag>
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
          <h2 className="section-title">Decision</h2>
          {record.decisions.length === 0 ? (
            <p className="record-empty">None</p>
          ) : (
            <ul className="linked-list">
              {record.decisions.map((item) => (
                <li key={`${item.description}-${item.decision}`}>
                  <span>{item.description}</span>
                  <StatusTag tone={decisionTone(item.decision)}>{decisionLabel(item.decision)}</StatusTag>
                  <span>{item.quantity}</span>
                  <span>{item.reason}</span>
                </li>
              ))}
            </ul>
          )}
          <h2 className="section-title">Fulfillment</h2>
          {record.fulfillment.length === 0 ? (
            <p className="record-empty">None</p>
          ) : (
            <ul className="linked-list">
              {record.fulfillment.map((item) => (
                <li key={`${item.at}-${item.evidence}`}>
                  <strong>{item.evidence}</strong>
                  <span>{item.actor}</span>
                  <time dateTime={item.at}>{formatDateTime(item.at)}</time>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
