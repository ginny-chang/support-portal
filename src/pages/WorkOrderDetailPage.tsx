import { FileImage, FileText, FileType, FileVideo } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import type { Column } from "../components/DataTable";
import { DataTable } from "../components/DataTable";
import { StatusTag } from "../components/StatusTag";
import { Tabs } from "../components/Tabs";
import { formatDateTime } from "../data/format";
import { workOrderStatusLabel, workOrderStatusTone } from "../data/labels";
import type { WorkOrderAttachment, WorkOrderLine, WorkOrderMessage, WorkOrderRecord, WorkOrderStatus, WorkOrderStatusEvent } from "../data/workOrders";
import { useWorkOrders } from "../data/workOrderCatalog";
import { possibleDuplicates, transitionRules } from "../data/workOrderRules";

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

function fileFormat(name: string): { label: string; icon: ReactNode } {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "jpg" || ext === "jpeg") return { label: "JPEG", icon: <FileImage size={18} /> };
  if (ext === "png") return { label: "PNG", icon: <FileImage size={18} /> };
  if (ext === "txt") return { label: "TXT", icon: <FileText size={18} /> };
  if (ext === "pdf") return { label: "PDF", icon: <FileText size={18} /> };
  if (ext === "doc" || ext === "docx") return { label: "Word", icon: <FileType size={18} /> };
  if (ext === "mp4") return { label: "MP4", icon: <FileVideo size={18} /> };
  if (ext === "mov") return { label: "MOV", icon: <FileVideo size={18} /> };
  return { label: ext.toUpperCase() || "File", icon: <FileText size={18} /> };
}

function AttachmentList({ files }: { files: WorkOrderAttachment[] }) {
  const rows = newestFirst(files);
  if (rows.length === 0) return <p className="record-empty">None</p>;
  return (
    <ul className="file-cards">
      {rows.map((file) => {
        const format = fileFormat(file.name);
        return (
          <li key={`${file.at}-${file.name}`} className="file-card">
            <span className="file-card-icon" aria-hidden="true">
              {format.icon}
            </span>
            <strong>{file.name}</strong>
            <span>
              {format.label} · {file.addedBy} · <time dateTime={file.at}>{formatDateTime(file.at)}</time>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function MessageCard({ internal, external }: { internal: WorkOrderMessage[]; external: WorkOrderMessage[] }) {
  const [tab, setTab] = useState("internal");
  const notes = tab === "internal" ? internal : external;
  return (
    <section className="record-card message-card" aria-label="Messages">
      <Tabs
        label="Messages"
        value={tab}
        onChange={setTab}
        items={[
          { id: "internal", label: "Internal notes" },
          { id: "external", label: "Messages visible to the applicant" },
        ]}
      />
      <div role="tabpanel">
        <MessageList notes={notes} />
      </div>
    </section>
  );
}

const statusByLabel: Record<string, WorkOrderStatus> = {
  Draft: "draft",
  "In Review": "in_review",
  Approved: "approved",
  Rejected: "rejected",
  Cancelled: "cancelled",
  Reopened: "reopened",
};

function StatusTags({ labels }: { labels: string[] }) {
  return (
    <span className="tag-row">
      {labels.map((label) => {
        const status = statusByLabel[label];
        return (
          <StatusTag key={label} tone={status ? workOrderStatusTone(status) : "draft"}>
            {label}
          </StatusTag>
        );
      })}
    </span>
  );
}

function PossibleDuplicates({ record, records }: { record: WorkOrderRecord; records: WorkOrderRecord[] }) {
  const shown = possibleDuplicates(record, records);
  if (shown.length === 0) return null;
  return (
    <>
      <h2 className="section-title">Possible duplicate</h2>
      <section className="record-card" aria-label="Possible duplicate">
        <ul className="linked-list">
          {shown.map((item) => (
            <li key={item.id}>
              <Link to={`/work-orders/${item.id}`}>{item.id}</Link>
              <span>{item.request}</span>
              <StatusTag tone={workOrderStatusTone(item.status)}>{workOrderStatusLabel(item.status)}</StatusTag>
            </li>
          ))}
        </ul>
      </section>
    </>
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

          <PossibleDuplicates record={record} records={records} />

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
                    <td>
                      <StatusTags labels={rule.from.map((status) => workOrderStatusLabel(status))} />
                    </td>
                    <td>
                      <StatusTags labels={[rule.to]} />
                    </td>
                    <td>{rule.who}</td>
                    <td>{rule.reason ? "Required" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <h2 className="section-title status-history-title">Status history</h2>
          <section className="record-card status-history" aria-label="Status history">
            <StatusHistory events={record.statusHistory} />
          </section>

          <MessageCard internal={record.internalNotes} external={record.applicantMessages} />

          <h2 className="section-title">Attachments</h2>
          <AttachmentList files={record.attachments} />

          <h2 className="section-title">Lines</h2>
          <DataTable caption="Lines" columns={lineColumns} rows={record.lines} rowKey={(line) => line.partId} empty="None" />
        </div>
      </div>
    </div>
  );
}
