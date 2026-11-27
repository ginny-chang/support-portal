import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import type { Column } from "../components/DataTable";
import { DataTable } from "../components/DataTable";
import { SelectMenu } from "../components/SelectMenu";
import { StatusTag } from "../components/StatusTag";
import { formatDateTime } from "../data/format";
import { workOrderStatusLabel, workOrderStatusTone } from "../data/labels";
import type { WorkOrderAssignment, WorkOrderAttachment, WorkOrderLine, WorkOrderMessage, WorkOrderRecord, WorkOrderStatusEvent } from "../data/workOrders";
import type { WorkOrderCommand } from "../data/workOrderCatalog";
import { useWorkOrders } from "../data/workOrderCatalog";
import { canRun, currentAssignee, INTERNAL_ASSIGNEES, linkedWorkOrders, possibleDuplicates, transitionRules, type WorkOrderAction } from "../data/workOrderRules";

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

function OrderActions({ record }: { record: WorkOrderRecord }) {
  const { currentUser, runAction } = useWorkOrders();
  const [action, setAction] = useState<WorkOrderAction | "">("");
  const [reason, setReason] = useState("");
  const [assignee, setAssignee] = useState(INTERNAL_ASSIGNEES.find((name) => name !== currentAssignee(record)) ?? INTERNAL_ASSIGNEES[0]);
  const [partId, setPartId] = useState(record.lines[0]?.partId ?? "");
  const [quantity, setQuantity] = useState(String(record.lines[0]?.approvedQuantity ?? record.lines[0]?.quantity ?? ""));
  const [amount, setAmount] = useState(String(record.lines[0]?.approvedAmount ?? ""));
  const [error, setError] = useState("");
  const available = transitionRules.filter((rule) => canRun(rule.action, record, currentUser));
  const selected = record.lines.find((line) => line.partId === partId) ?? record.lines[0];

  function choose(next: WorkOrderAction) {
    setAction(next);
    setReason("");
    setError("");
    const line = record.lines[0];
    if (line) {
      setPartId(line.partId);
      setQuantity(String(line.approvedQuantity ?? line.quantity));
      setAmount(line.approvedAmount == null ? "" : String(line.approvedAmount));
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!action) return;
    const rule = transitionRules.find((item) => item.action === action);
    if (rule?.reason && !reason.trim()) {
      setError("Reason is required.");
      return;
    }
    let command: WorkOrderCommand;
    if (action === "reassign") {
      command = { action, assignee, reason };
    } else if (action === "change_approved") {
      const nextQuantity = Number(quantity);
      const nextAmount = Number(amount);
      if (!selected || !Number.isFinite(nextQuantity) || nextQuantity <= 0 || !Number.isFinite(nextAmount) || nextAmount < 0) {
        setError("Approved quantity must be a positive number, and amount must be zero or greater.");
        return;
      }
      command = { action, partId: selected.partId, quantity: nextQuantity, amount: nextAmount, reason };
    } else if (action === "reject" || action === "cancel" || action === "reopen") {
      command = { action, reason };
    } else {
      command = { action };
    }
    const saved = runAction(record.id, command);
    if (!saved) {
      setError("Reason is required.");
      return;
    }
    setAction("");
    setReason("");
    setError("");
  }

  return (
    <>
      {available.length > 0 ? (
        <div className="wo-actions">
          {available.map((rule) => (
            <Button key={rule.action} variant={action === rule.action ? "primary" : "secondary"} onClick={() => choose(rule.action)}>
              {rule.label}
            </Button>
          ))}
        </div>
      ) : null}
      {action ? (
        <form className="action-panel" onSubmit={submit}>
          {action === "reassign" ? (
            <label className="field">
              <span className="field-label">Assignment</span>
              <SelectMenu
                label="Assignment"
                value={assignee}
                options={INTERNAL_ASSIGNEES.filter((name) => name !== currentAssignee(record)).map((name) => ({ value: name, label: name }))}
                onChange={setAssignee}
              />
            </label>
          ) : null}
          {action === "change_approved" ? (
            <>
              <label className="field">
                <span className="field-label">Part ID</span>
                <SelectMenu
                  label="Part ID"
                  value={partId}
                  options={record.lines.map((line) => ({ value: line.partId, label: `${line.partId} ${line.description}` }))}
                  onChange={(value) => {
                    setPartId(value);
                    const line = record.lines.find((item) => item.partId === value);
                    if (!line) return;
                    setQuantity(String(line.approvedQuantity ?? line.quantity));
                    setAmount(line.approvedAmount == null ? "" : String(line.approvedAmount));
                  }}
                />
              </label>
              <label className="field">
                <span className="field-label">Approved quantity</span>
                <input className="control" inputMode="decimal" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
              </label>
              <label className="field">
                <span className="field-label">Amount</span>
                <input className="control" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} />
              </label>
            </>
          ) : null}
          {transitionRules.find((rule) => rule.action === action)?.reason ? (
            <label className="field field-wide">
              <span className="field-label">Reason</span>
              <input className="control" value={reason} onChange={(event) => setReason(event.target.value)} />
            </label>
          ) : null}
          <Button type="submit">{transitionRules.find((rule) => rule.action === action)?.label}</Button>
          {error ? <p className="form-errors">{error}</p> : null}
        </form>
      ) : null}
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
          <OrderActions record={record} />
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
