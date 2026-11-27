import { Link, useParams } from "react-router-dom";
import type { Column } from "../components/DataTable";
import { DataTable } from "../components/DataTable";
import { StatusTag } from "../components/StatusTag";
import { formatDateTime } from "../data/format";
import { statusLabel, statusTone } from "../data/labels";
import type { WorkOrderAssignment, WorkOrderAttachment, WorkOrderLine, WorkOrderMessage, WorkOrderStatusEvent } from "../data/workOrders";
import { useWorkOrders } from "../data/workOrderCatalog";

const lineColumns: Column<WorkOrderLine>[] = [
  { id: "part", header: "Part ID", width: "160px", render: (line) => line.partId },
  { id: "description", header: "Description", render: (line) => line.description },
  { id: "quantity", header: "Quantity", width: "88px", align: "right", render: (line) => line.quantity },
  { id: "unit", header: "Unit", width: "72px", render: (line) => line.unit },
];

function newestFirst<T extends { at: string }>(items: T[]): T[] {
  return [...items].sort((left, right) => right.at.localeCompare(left.at));
}

function currentAssignee(assignments: WorkOrderAssignment[]): string {
  const latest = newestFirst(assignments)[0];
  return latest?.assignee ?? "—";
}

function MessageList({ notes }: { notes: WorkOrderMessage[] }) {
  const rows = newestFirst(notes);
  if (rows.length === 0) return <p className="record-empty">None</p>;
  return (
    <ol className="message-list">
      {rows.map((note) => (
        <li key={`${note.at}-${note.author}`}>
          <div className="message-meta">
            <strong>{note.author}</strong>
            <time dateTime={note.at}>{formatDateTime(note.at)}</time>
          </div>
          <p>{note.body}</p>
        </li>
      ))}
    </ol>
  );
}

function AssignmentList({ assignments }: { assignments: WorkOrderAssignment[] }) {
  const rows = newestFirst(assignments);
  if (rows.length === 0) return <p className="record-empty">None</p>;
  return (
    <ol className="audit-list">
      {rows.map((item, index) => (
        <li key={`${item.at}-${item.assignee}`} className={index === 0 ? "audit-item is-latest" : "audit-item"}>
          <span className="audit-dot" aria-hidden="true" />
          <time className="audit-time" dateTime={item.at}>
            {formatDateTime(item.at)}
          </time>
          <span className="audit-actor">{item.assignee}</span>
          <span className="audit-action">Assigned by {item.actor}</span>
        </li>
      ))}
    </ol>
  );
}

function StatusHistory({ events }: { events: WorkOrderStatusEvent[] }) {
  const rows = newestFirst(events);
  if (rows.length === 0) return <p className="record-empty">None</p>;
  return (
    <ol className="audit-list">
      {rows.map((item, index) => (
        <li key={`${item.at}-${item.status}`} className={index === 0 ? "audit-item is-latest" : "audit-item"}>
          <span className="audit-dot" aria-hidden="true" />
          <time className="audit-time" dateTime={item.at}>
            {formatDateTime(item.at)}
          </time>
          <span className="audit-actor">{item.actor}</span>
          <span className="status-change">
            <StatusTag tone={statusTone(item.status)}>{statusLabel(item.status)}</StatusTag>
            <span>{item.change}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

function AttachmentList({ files }: { files: WorkOrderAttachment[] }) {
  const rows = newestFirst(files);
  if (rows.length === 0) return <p className="record-empty">None</p>;
  return (
    <ul className="file-list">
      {rows.map((file) => (
        <li key={`${file.at}-${file.name}`}>
          <strong>{file.name}</strong>
          <span>{file.addedBy}</span>
          <time dateTime={file.at}>{formatDateTime(file.at)}</time>
        </li>
      ))}
    </ul>
  );
}

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
              <dt>Applicant</dt>
              <dd>{record.applicant}</dd>
            </div>
            <div>
              <dt>Assignment</dt>
              <dd>{currentAssignee(record.assignments)}</dd>
            </div>
            <div>
              <dt>Owner</dt>
              <dd>{record.owner}</dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>{formatDateTime(record.updatedAt)}</dd>
            </div>
            <div className="meta-span">
              <dt>Request</dt>
              <dd>{record.request}</dd>
            </div>
          </dl>

          <h2 className="section-title">Status history</h2>
          <section className="record-card" aria-label="Status history">
            <StatusHistory events={record.statusHistory} />
          </section>

          <div className="record-grid">
            <section className="record-card" aria-label="Assignment">
              <h2 className="section-title">Assignment</h2>
              <AssignmentList assignments={record.assignments} />
            </section>
            <section className="record-card" aria-label="Attachments">
              <h2 className="section-title">Attachments</h2>
              <AttachmentList files={record.attachments} />
            </section>
            <section className="record-card is-internal" aria-label="Internal notes">
              <h2 className="section-title">Internal notes</h2>
              <MessageList notes={record.internalNotes} />
            </section>
            <section className="record-card" aria-label="Messages visible to the applicant">
              <h2 className="section-title">Messages visible to the applicant</h2>
              <MessageList notes={record.applicantMessages} />
            </section>
          </div>

          <h2 className="section-title">Lines</h2>
          <DataTable caption="Lines" columns={lineColumns} rows={record.lines} rowKey={(line) => line.partId} empty="None" />
        </div>
      </div>
    </div>
  );
}
