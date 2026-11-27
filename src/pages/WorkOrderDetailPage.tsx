import { Link, useParams } from "react-router-dom";
import type { Column } from "../components/DataTable";
import { DataTable } from "../components/DataTable";
import { StatusTag } from "../components/StatusTag";
import { formatDateTime } from "../data/format";
import { workOrderStatusLabel, workOrderStatusTone } from "../data/labels";
import type { WorkOrderAssignment, WorkOrderAttachment, WorkOrderLine, WorkOrderMessage, WorkOrderRecord, WorkOrderStatusEvent } from "../data/workOrders";
import { useWorkOrders } from "../data/workOrderCatalog";
import { currentAssignee, linkedWorkOrders, possibleDuplicates, transitionRules } from "../data/workOrderRules";

const lineColumns: Column<WorkOrderLine>[] = [
  { id: "part", header: "Part ID", width: "160px", render: (line) => line.partId },
  { id: "description", header: "Description", render: (line) => line.description },
  { id: "quantity", header: "Quantity", width: "88px", align: "right", render: (line) => line.quantity },
  { id: "approvedQuantity", header: "Approved quantity", width: "140px", align: "right", render: (line) => line.approvedQuantity ?? "—" },
  { id: "amount", header: "Amount", width: "96px", align: "right", render: (line) => line.approvedAmount ?? "—" },
  { id: "unit", header: "Unit", width: "72px", render: (line) => line.unit },
];

function newestFirst<T extends { at: string }>(items: T[]): T[] {
  return [...items].sort((left, right) => right.at.localeCompare(left.at));
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
          <span className="audit-action">
            Assigned by {item.actor}
            {item.reason ? ` — ${item.reason}` : ""}
          </span>
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
            <StatusTag tone={workOrderStatusTone(item.status)}>{workOrderStatusLabel(item.status)}</StatusTag>
            <span>
              {item.change}
              {item.reason ? ` — ${item.reason}` : ""}
            </span>
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

function RelatedOrders({ record, records }: { record: WorkOrderRecord; records: WorkOrderRecord[] }) {
  const linked = linkedWorkOrders(record, records);
  const duplicates = possibleDuplicates(record, records);
  const shown = [...linked];
  for (const item of duplicates) {
    if (!shown.some((row) => row.id === item.id)) shown.push(item);
  }
  const duplicateIds = new Set(duplicates.map((item) => item.id));
  if (shown.length === 0) return <p className="record-empty">None</p>;
  return (
    <ul className="linked-list">
      {shown.map((item) => (
        <li key={item.id}>
          <Link to={`/work-orders/${item.id}`}>{item.id}</Link>
          <span>{item.request}</span>
          {duplicateIds.has(item.id) ? <span>Possible duplicate</span> : null}
          <StatusTag tone={workOrderStatusTone(item.status)}>{workOrderStatusLabel(item.status)}</StatusTag>
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
            <StatusTag tone={workOrderStatusTone(record.status)}>{workOrderStatusLabel(record.status)}</StatusTag>
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
              <dd>{currentAssignee(record)}</dd>
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

          <h2 className="section-title">Related work orders</h2>
          <section className="record-card" aria-label="Related work orders">
            <RelatedOrders record={record} records={records} />
          </section>

          <h2 className="section-title">Status transitions</h2>
          <section className="record-card" aria-label="Status transitions">
            <table className="transition-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Who</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {transitionRules.map((rule) => (
                  <tr key={rule.action}>
                    <td>{rule.label}</td>
                    <td>{rule.from.map((status) => workOrderStatusLabel(status)).join(", ")}</td>
                    <td>{rule.to}</td>
                    <td>{rule.who}</td>
                    <td>{rule.reason ? "Required" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

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
