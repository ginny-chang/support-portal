import { FileImage, FileText, FileType, FileVideo } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import type { Column } from "../components/DataTable";
import { DataTable } from "../components/DataTable";
import { StatusTag } from "../components/StatusTag";
import { Tabs } from "../components/Tabs";
import { formatDateTime } from "../data/format";
import { decisionLabel, decisionTone, workOrderStatusLabel, workOrderStatusTone } from "../data/labels";
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

const decisionColumns: Column<WorkOrderLine>[] = [
  { id: "part", header: "Part ID", width: "160px", render: (line) => line.partId },
  {
    id: "decision",
    header: "Decision",
    width: "180px",
    render: (line) =>
      line.decision ? <StatusTag tone={decisionTone(line.decision)}>{decisionLabel(line.decision)}</StatusTag> : "—",
  },
  { id: "quantity", header: "Quantity", width: "96px", align: "right", render: (line) => line.decisionQuantity ?? "—" },
  { id: "reason", header: "Reason", render: (line) => line.decisionReason || "—" },
];

function newestFirst<T extends { at: string }>(items: T[]): T[] {
  return [...items].sort((left, right) => right.at.localeCompare(left.at));
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0].slice(0, 1)}${parts[parts.length - 1].slice(0, 1)}`.toUpperCase();
}

function MessageList({ notes, applicant }: { notes: WorkOrderMessage[]; applicant?: string }) {
  const rows = [...notes].sort((left, right) => left.at.localeCompare(right.at));
  if (rows.length === 0) return <p className="record-empty">None</p>;
  return (
    <ol className="chat-list">
      {rows.map((note) => {
        const external = applicant != null && note.author === applicant;
        return (
          <li key={`${note.at}-${note.author}`} className={external ? "chat-row is-external" : "chat-row"}>
            <span className={external ? "avatar is-external" : "avatar"} aria-hidden="true">
              {initials(note.author)}
            </span>
            <div>
              <div className="message-meta">
                <strong>{note.author}</strong>
                <time dateTime={note.at}>{formatDateTime(note.at)}</time>
              </div>
              <p className="chat-bubble">{note.body}</p>
            </div>
          </li>
        );
      })}
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
            <span className="file-card-copy">
              <strong>{file.name}</strong>
              <span>
                {format.label} · {file.addedBy} · <time dateTime={file.at}>{formatDateTime(file.at)}</time>
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function MessageCard({
  internal,
  external,
  applicant,
}: {
  internal: WorkOrderMessage[];
  external: WorkOrderMessage[];
  applicant: string;
}) {
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
        <MessageList notes={notes} applicant={tab === "external" ? applicant : undefined} />
      </div>
    </section>
  );
}

const statusByLabel: Record<string, WorkOrderStatus> = {
  Draft: "draft",
  Submitted: "submitted",
  "In review": "in_review",
  "Awaiting information": "awaiting_information",
  Approved: "approved",
  "In fulfillment": "in_fulfillment",
  Resolved: "resolved",
  Closed: "closed",
  Cancelled: "cancelled",
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

          <MessageCard internal={record.internalNotes} external={record.applicantMessages} applicant={record.applicant} />

          <h2 className="section-title">Attachments</h2>
          <AttachmentList files={record.attachments} />

          <h2 className="section-title">Decision</h2>
          <DataTable
            caption="Decision"
            columns={decisionColumns}
            rows={record.lines}
            rowKey={(line) => line.partId}
            empty="None"
          />

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

          <h2 className="section-title">Lines</h2>
          <DataTable caption="Lines" columns={lineColumns} rows={record.lines} rowKey={(line) => line.partId} empty="None" />
        </div>
      </div>
    </div>
  );
}
