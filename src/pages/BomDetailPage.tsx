import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TopbarSlot } from "../components/AppShell";
import { Button } from "../components/Button";
import { SelectMenu } from "../components/SelectMenu";
import type { BomLine, Supersession } from "../data/bom";
import { useBomCatalog } from "../data/bomCatalog";
import { formatDate, formatDateTime } from "../data/format";
import { serviceabilityLabel, serviceabilityTone, statusLabel, statusTone } from "../data/labels";
import type { Column } from "../components/DataTable";
import { DataTable } from "../components/DataTable";
import { StatusTag } from "../components/StatusTag";

export function BomDetailPage() {
  const navigate = useNavigate();
  const { bomId = "" } = useParams();
  const { records, submitForReview, releaseBom } = useBomCatalog();
  const record = records.find((item) => item.id === bomId);
  const [panel, setPanel] = useState<"review" | "release" | null>(null);
  const [reason, setReason] = useState("");
  const [change, setChange] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const approvers = [...new Set(records.map((item) => item.owner))];
  const [approver, setApprover] = useState(approvers[0] ?? "");
  const history = useMemo(() => (record ? [...record.audit].reverse() : []), [record]);

  const lineColumns = useMemo<Column<BomLine>[]>(
    () => [
      { id: "level", header: "Level", width: "72px", render: (line) => line.level },
      {
        id: "part",
        header: "Part ID",
        width: "150px",
        render: (line) => <span className={line.obsolete ? "strike" : undefined}>{line.partId}</span>,
      },
      {
        id: "description",
        header: "Description",
        render: (line) => (
          <span className={line.level > 0 ? "indent-1" : undefined}>
            <span className={line.obsolete ? "strike" : undefined}>{line.description}</span>
          </span>
        ),
      },
      {
        id: "quantity",
        header: "Quantity",
        width: "80px",
        align: "right",
        render: (line) => line.quantity,
      },
      { id: "unit", header: "Unit", width: "72px", render: (line) => line.unit },
      {
        id: "parent",
        header: "Parent",
        width: "140px",
        render: (line) => line.parentPartId || "—",
      },
      {
        id: "serviceability",
        header: "Serviceability",
        width: "180px",
        render: (line) => (
          <span className="tag-row">
            <StatusTag tone={serviceabilityTone(line.serviceability)}>
              {serviceabilityLabel(line.serviceability)}
            </StatusTag>
            {line.obsolete ? <StatusTag tone="obsolete">Obsolete</StatusTag> : null}
          </span>
        ),
      },
    ],
    [],
  );

  const supersessionColumns = useMemo<Column<Supersession>[]>(
    () => [
      { id: "from", header: "Original part ID", render: (item) => item.fromPartId },
      { id: "to", header: "Superseding part ID", render: (item) => item.toPartId },
      { id: "relation", header: "Relation", width: "120px", render: (item) => item.relation },
      {
        id: "effective",
        header: "Effective Date",
        width: "124px",
        render: (item) => formatDate(item.effectiveDate),
      },
    ],
    [],
  );

  if (!record) {
    return (
      <div className="empty-page">
        <p>Service BOM not found</p>
        <Link to="/bom">Back to list</Link>
      </div>
    );
  }
  const bom = record;

  function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reason.trim()) return;
    submitForReview(bom.id, reason);
    setPanel(null);
    setReason("");
  }

  function submitRelease(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!approver.trim() || !effectiveDate || !change.trim()) return;
    releaseBom(bom.id, { approver, effectiveDate, change });
    setPanel(null);
  }

  return (
    <div className="page">
      <TopbarSlot>
        <Button variant="secondary" onClick={() => navigate(`/bom/${bom.id}/edit`)}>
          Update
        </Button>
        {bom.status === "draft" ? (
          <Button onClick={() => setPanel("review")}>Submit for review</Button>
        ) : null}
        {bom.status === "in_review" ? <Button onClick={() => setPanel("release")}>Release</Button> : null}
      </TopbarSlot>
      {panel === "review" ? (
        <form className="action-panel" onSubmit={submitReview}>
          <label className="field">
            <span className="field-label">Reason</span>
            <input className="control" value={reason} onChange={(event) => setReason(event.target.value)} />
          </label>
          <Button type="submit">Submit for review</Button>
        </form>
      ) : null}
      {panel === "release" ? (
        <form className="action-panel" onSubmit={submitRelease}>
          <label className="field">
            <span className="field-label">Approver</span>
            <SelectMenu
              label="Approver"
              value={approver}
              options={approvers.map((name) => ({ value: name, label: name }))}
              onChange={setApprover}
            />
          </label>
          <label className="field">
            <span className="field-label">Effective date</span>
            <input className="control" type="date" value={effectiveDate} onChange={(event) => setEffectiveDate(event.target.value)} />
          </label>
          <label className="field field-wide">
            <span className="field-label">Change</span>
            <input className="control" value={change} onChange={(event) => setChange(event.target.value)} />
          </label>
          <Button type="submit">Release</Button>
        </form>
      ) : null}
      <div className="detail">
        <div>
          <h1>{record.product || record.assembly}</h1>
          {record.product && record.assembly ? <p className="detail-assembly">{record.assembly}</p> : null}
          <div className="detail-idline">
            {record.product && record.assembly ? null : <span>{record.product ? "Product" : "Assembly"}</span>}
            <span>{record.id}</span>
            <span>Revision {record.revision}</span>
            <StatusTag tone={statusTone(record.status)}>{statusLabel(record.status)}</StatusTag>
          </div>
          <dl className="meta-grid">
            <div>
              <dt>Owner</dt>
              <dd>{record.owner}</dd>
            </div>
            <div>
              <dt>Effective date</dt>
              <dd>{formatDate(record.effectiveDate)}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>{formatDateTime(record.updatedAt)}</dd>
            </div>
            <div>
              <dt>Superseded by</dt>
              <dd>
                {record.supersededBy ? (
                  <Link to={`/bom/${record.supersededBy}`}>{record.supersededBy}</Link>
                ) : (
                  "—"
                )}
              </dd>
            </div>
          </dl>

          <h2 className="section-title">Lines</h2>
          <DataTable
            caption="Lines"
            columns={lineColumns}
            rows={record.lines}
            rowKey={(line) => line.partId}
            rowClassName={(line) => (line.obsolete ? "is-obsolete" : undefined)}
            empty="None"
          />

          <section className="scope-card" aria-label="Applicability">
            <h2 className="section-title">Applicability</h2>
            <dl className="spec-grid">
              <div>
                <dt>Model</dt>
                <dd>{record.applicability.model}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{record.applicability.category}</dd>
              </div>
              <div>
                <dt>Model year</dt>
                <dd>{record.applicability.modelYears}</dd>
              </div>
              <div>
                <dt>Size</dt>
                <dd>{record.applicability.sizes}</dd>
              </div>
              <div>
                <dt>Market</dt>
                <dd>{record.applicability.market}</dd>
              </div>
            </dl>
          </section>

          <h2 className="section-title">Substitutes / supersession</h2>
          <DataTable
            caption="Substitutes / supersession"
            columns={supersessionColumns}
            rows={record.supersessions}
            rowKey={(item) => `${item.fromPartId}-${item.toPartId}`}
            empty="None"
          />
        </div>
        <aside className="audit-panel" aria-label="Audit history">
          <h2 className="section-title">Audit history</h2>
          <ol className="audit-list">
            {history.map((item, index) => (
              <li key={`${item.at}-${item.action}`} className={index === 0 ? "audit-item is-latest" : "audit-item"}>
                <span className="audit-dot" aria-hidden="true" />
                <time className="audit-time" dateTime={item.at}>
                  {formatDateTime(item.at)}
                </time>
                <span className="audit-actor">{item.actor}</span>
                <span className="audit-action">{item.action}</span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
