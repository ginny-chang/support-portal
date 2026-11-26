import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TopbarSlot } from "../components/AppShell";
import { Button } from "../components/Button";
import { SelectMenu } from "../components/SelectMenu";
import type { BomLine } from "../data/bom";
import { useBomCatalog } from "../data/bomCatalog";
import type { WorkOrderLine } from "../data/workOrders";
import { useWorkOrders } from "../data/workOrderCatalog";

function bomName(product: string, assembly: string): string {
  return product || assembly;
}

function lineFromBom(source: BomLine): WorkOrderLine {
  return {
    partId: source.partId,
    description: source.description,
    quantity: source.quantity,
    unit: source.unit,
  };
}

export function WorkOrderCreatePage() {
  const navigate = useNavigate();
  const { records } = useBomCatalog();
  const { addWorkOrder } = useWorkOrders();
  const released = records.filter((record) => record.status === "released");
  const [bomId, setBomId] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [dealer, setDealer] = useState("");
  const [request, setRequest] = useState("");
  const [lines, setLines] = useState<WorkOrderLine[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const bom = released.find((record) => record.id === bomId);
  const partSources = (bom?.lines ?? []).filter((line) => line.partId.trim() && !line.obsolete);
  const partOptions = partSources.map((line) => ({
    value: line.partId,
    label: line.description ? `${line.partId} ${line.description}` : line.partId,
  }));
  const pristine = useMemo(
    () => !bomId && !serialNumber.trim() && !dealer.trim() && !request.trim() && lines.length === 0,
    [bomId, dealer, lines.length, request, serialNumber],
  );

  function chooseBom(nextId: string) {
    setBomId(nextId);
    setLines([]);
  }

  function updateLine(index: number, partId: string) {
    const source = partSources.find((line) => line.partId === partId);
    if (!source) return;
    setLines((current) => current.map((line, lineIndex) => (lineIndex === index ? lineFromBom(source) : line)));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: string[] = [];
    if (!bom) nextErrors.push("Service BOM is required.");
    if (!serialNumber.trim()) nextErrors.push("Serial number is required.");
    if (!dealer.trim()) nextErrors.push("Dealer is required.");
    if (!request.trim()) nextErrors.push("Request is required.");
    if (lines.length === 0) nextErrors.push("At least one line is required.");
    const seen = new Set<string>();
    for (const line of lines) {
      if (!line.partId) nextErrors.push("Part ID is required.");
      else if (seen.has(line.partId)) nextErrors.push(`Duplicate part ID ${line.partId}.`);
      seen.add(line.partId);
      if (!Number.isFinite(line.quantity) || line.quantity <= 0) {
        nextErrors.push(`Quantity for ${line.partId || "a line"} must be a positive number.`);
      }
    }
    setErrors(nextErrors);
    if (nextErrors.length > 0 || !bom) return;
    const id = addWorkOrder({
      bomId: bom.id,
      product: bom.product,
      assembly: bom.assembly,
      serialNumber,
      dealer,
      request,
      lines,
    });
    navigate(`/work-orders/${id}`);
  }

  return (
    <form className="page create" id="work-order-draft" onSubmit={submit}>
      <TopbarSlot>
        {pristine ? (
          <Link className="btn btn-secondary" to="/work-orders">
            Cancel
          </Link>
        ) : null}
        <Button type="submit" form="work-order-draft">
          Save draft
        </Button>
      </TopbarSlot>
      {errors.length > 0 ? (
        <ul className="form-errors" role="alert">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}
      <div className="create-grid">
        <label className="field field-wide">
          <span className="field-label">Service BOM</span>
          <SelectMenu
            label="Service BOM"
            value={bomId}
            options={[{ value: "", label: "—" }, ...released.map((record) => ({ value: record.id, label: `${bomName(record.product, record.assembly)} · ${record.id} ${record.revision}` }))]}
            onChange={chooseBom}
          />
        </label>
        <label className="field">
          <span className="field-label">Product or Assembly</span>
          <input className="control" value={bom ? bomName(bom.product, bom.assembly) : ""} readOnly />
        </label>
        <label className="field">
          <span className="field-label">Serial number</span>
          <input className="control" value={serialNumber} onChange={(event) => setSerialNumber(event.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Dealer</span>
          <input className="control" value={dealer} onChange={(event) => setDealer(event.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Status</span>
          <input className="control" value="Draft" readOnly />
        </label>
        <label className="field field-wide">
          <span className="field-label">Request</span>
          <input className="control" value={request} onChange={(event) => setRequest(event.target.value)} />
        </label>
      </div>

      <h2 className="section-title">Lines</h2>
      {lines.length > 0 ? (
        <div className="work-line-head">
          <span>Part ID</span>
          <span>Description</span>
          <span>Quantity</span>
          <span>Unit</span>
          <span />
        </div>
      ) : null}
      {lines.map((line, index) => (
        <div className="work-line-editor" key={index}>
          <SelectMenu
            label="Part ID"
            value={line.partId}
            options={partOptions}
            onChange={(partId) => updateLine(index, partId)}
          />
          <input className="control" value={line.description} readOnly aria-label="Description" />
          <input
            className="control"
            type="number"
            min={1}
            aria-label="Quantity"
            value={line.quantity}
            onChange={(event) =>
              setLines((current) =>
                current.map((item, lineIndex) =>
                  lineIndex === index ? { ...item, quantity: Number(event.target.value) } : item,
                ),
              )
            }
          />
          <input className="control" value={line.unit} readOnly aria-label="Unit" />
          <button
            type="button"
            className="icon-btn"
            aria-label="Remove line"
            onClick={() => setLines((current) => current.filter((_, lineIndex) => lineIndex !== index))}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <Button
        variant="secondary"
        icon={<Plus size={16} />}
        disabled={!bom || partOptions.length === 0}
        onClick={() => {
          const source = partSources.find((item) => !lines.some((line) => line.partId === item.partId)) ?? partSources[0];
          if (!source) return;
          setLines((current) => [...current, lineFromBom(source)]);
        }}
      >
        Add line
      </Button>
    </form>
  );
}
