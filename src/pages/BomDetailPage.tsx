import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { getBom } from "../data/bom";
import type { BomLine, Supersession } from "../data/bom";
import { formatDate, formatDateTime } from "../data/format";
import { serviceabilityLabel, serviceabilityTone, statusLabel, statusTone } from "../data/labels";
import type { Column } from "../components/DataTable";
import { DataTable } from "../components/DataTable";
import { StatusTag } from "../components/StatusTag";

export function BomDetailPage() {
  const { bomId = "" } = useParams();
  const record = getBom(bomId);
  const history = useMemo(() => (record ? [...record.audit].reverse() : []), [record]);

  const lineColumns = useMemo<Column<BomLine>[]>(
    () => [
      { id: "level", header: "層級", width: "72px", render: (line) => line.level },
      {
        id: "part",
        header: "料號",
        width: "150px",
        render: (line) => <span className={line.obsolete ? "strike" : undefined}>{line.partId}</span>,
      },
      {
        id: "description",
        header: "說明",
        render: (line) => (
          <span className={line.level > 0 ? "indent-1" : undefined}>
            <span className={line.obsolete ? "strike" : undefined}>{line.description}</span>
          </span>
        ),
      },
      {
        id: "quantity",
        header: "數量",
        width: "80px",
        align: "right",
        render: (line) => line.quantity,
      },
      { id: "unit", header: "單位", width: "72px", render: (line) => line.unit },
      {
        id: "serviceability",
        header: "可維修性",
        width: "180px",
        render: (line) => (
          <span className="tag-row">
            <StatusTag tone={serviceabilityTone(line.serviceability)}>
              {serviceabilityLabel(line.serviceability)}
            </StatusTag>
            {line.obsolete ? <StatusTag tone="obsolete">已停用</StatusTag> : null}
          </span>
        ),
      },
    ],
    [],
  );

  const supersessionColumns = useMemo<Column<Supersession>[]>(
    () => [
      { id: "from", header: "原料號", render: (item) => item.fromPartId },
      { id: "to", header: "取代料號", render: (item) => item.toPartId },
      { id: "relation", header: "關係", width: "120px", render: (item) => item.relation },
      {
        id: "effective",
        header: "生效日",
        width: "124px",
        render: (item) => formatDate(item.effectiveDate),
      },
    ],
    [],
  );

  if (!record) {
    return (
      <div className="empty-page">
        <p>找不到這筆服務 BOM</p>
        <Link to="/bom">返回列表</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="detail">
        <div>
          <h1>{record.product}</h1>
          <p className="detail-assembly">{record.assembly}</p>
          <div className="detail-idline">
            <span>{record.id}</span>
            <span>版本 {record.revision}</span>
            <StatusTag tone={statusTone(record.status)}>{statusLabel(record.status)}</StatusTag>
          </div>
          <dl className="meta-grid">
            <div>
              <dt>負責人</dt>
              <dd>{record.owner}</dd>
            </div>
            <div>
              <dt>生效日</dt>
              <dd>{formatDate(record.effectiveDate)}</dd>
            </div>
            <div>
              <dt>最後更新</dt>
              <dd>{formatDateTime(record.updatedAt)}</dd>
            </div>
            <div>
              <dt>取代為</dt>
              <dd>
                {record.supersededBy ? (
                  <Link to={`/bom/${record.supersededBy}`}>{record.supersededBy}</Link>
                ) : (
                  "—"
                )}
              </dd>
            </div>
          </dl>

          <h2 className="section-title">明細</h2>
          <DataTable
            caption="明細"
            columns={lineColumns}
            rows={record.lines}
            rowKey={(line) => line.partId}
            rowClassName={(line) => (line.obsolete ? "is-obsolete" : undefined)}
            empty="無"
          />

          <h2 className="section-title">適用範圍</h2>
          <dl className="spec-grid">
            <div>
              <dt>車型</dt>
              <dd>{record.applicability.model}</dd>
            </div>
            <div>
              <dt>車種</dt>
              <dd>{record.applicability.category}</dd>
            </div>
            <div>
              <dt>年式</dt>
              <dd>{record.applicability.modelYears}</dd>
            </div>
            <div>
              <dt>尺寸</dt>
              <dd>{record.applicability.sizes}</dd>
            </div>
            <div>
              <dt>市場</dt>
              <dd>{record.applicability.market}</dd>
            </div>
          </dl>

          <h2 className="section-title">取代與停用</h2>
          <DataTable
            caption="取代與停用"
            columns={supersessionColumns}
            rows={record.supersessions}
            rowKey={(item) => `${item.fromPartId}-${item.toPartId}`}
            empty="無"
          />
        </div>
        <aside className="audit-panel" aria-label="異動紀錄">
          <h2 className="section-title">異動紀錄</h2>
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
