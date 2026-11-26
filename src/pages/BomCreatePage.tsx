import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { revisions } from "../data/bom";
import type { BomLine, Serviceability } from "../data/bom";
import { useBomCatalog } from "../data/bomCatalog";
import { serviceabilityLabel } from "../data/labels";

const serviceabilityOptions: Serviceability[] = ["serviceable", "replaceable", "consumable", "assembly"];
const units = ["ea", "set", "pc", "pr"];

function emptyLine(level: number): BomLine {
  return {
    level,
    partId: "",
    description: "",
    quantity: 1,
    unit: "ea",
    serviceability: "replaceable",
    obsolete: false,
  };
}

export function BomCreatePage() {
  const navigate = useNavigate();
  const { addBom } = useBomCatalog();
  const [product, setProduct] = useState("");
  const [assembly, setAssembly] = useState("");
  const [revision, setRevision] = useState<string>(revisions[0]);
  const [lines, setLines] = useState<BomLine[]>([emptyLine(0)]);
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("");
  const [modelYears, setModelYears] = useState("");
  const [sizes, setSizes] = useState("");
  const [market, setMarket] = useState("Taiwan");

  function updateLine(index: number, patch: Partial<BomLine>) {
    setLines((current) => current.map((line, lineIndex) => (lineIndex === index ? { ...line, ...patch } : line)));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextLines = lines
      .map((line) => ({ ...line, partId: line.partId.trim(), description: line.description.trim() }))
      .filter((line) => line.partId && line.description);
    if (!product.trim() || !assembly.trim() || nextLines.length === 0) return;
    const id = addBom({
      product: product.trim(),
      assembly: assembly.trim(),
      revision,
      lines: nextLines,
      applicability: {
        model: model.trim() || product.trim(),
        category: category.trim(),
        modelYears: modelYears.trim(),
        sizes: sizes.trim(),
        market: market.trim() || "Taiwan",
      },
    });
    navigate(`/bom/${id}`);
  }

  return (
    <form className="page create" onSubmit={submit}>
      <div className="create-head">
        <div className="summary-tools">
          <Link className="btn btn-secondary" to="/bom">
            Cancel
          </Link>
          <Button type="submit">Save draft</Button>
        </div>
      </div>

      <div className="create-grid">
        <label className="field">
          <span className="field-label">Product</span>
          <input className="control" value={product} required onChange={(event) => setProduct(event.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Assembly</span>
          <input className="control" value={assembly} required onChange={(event) => setAssembly(event.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Revision</span>
          <select className="control" value={revision} onChange={(event) => setRevision(event.target.value)}>
            {revisions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="field-label">Status</span>
          <input className="control" value="Draft" readOnly />
        </label>
      </div>

      <h2 className="section-title">Lines</h2>
      <div className="line-head">
        <span>Level</span>
        <span>Part ID</span>
        <span>Description</span>
        <span>Quantity</span>
        <span>Unit</span>
        <span>Serviceability</span>
        <span />
      </div>
      {lines.map((line, index) => (
        <div className="line-editor" key={index}>
          <input
            className="control"
            type="number"
            min={0}
            aria-label="Level"
            value={line.level}
            onChange={(event) => updateLine(index, { level: Number(event.target.value) })}
          />
          <input
            className="control"
            aria-label="Part ID"
            value={line.partId}
            required={index === 0}
            onChange={(event) => updateLine(index, { partId: event.target.value })}
          />
          <input
            className="control"
            aria-label="Description"
            value={line.description}
            required={index === 0}
            onChange={(event) => updateLine(index, { description: event.target.value })}
          />
          <input
            className="control"
            type="number"
            min={1}
            aria-label="Quantity"
            value={line.quantity}
            onChange={(event) => updateLine(index, { quantity: Number(event.target.value) })}
          />
          <select
            className="control"
            aria-label="Unit"
            value={line.unit}
            onChange={(event) => updateLine(index, { unit: event.target.value })}
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          <select
            className="control"
            aria-label="Serviceability"
            value={line.serviceability}
            onChange={(event) => updateLine(index, { serviceability: event.target.value as Serviceability })}
          >
            {serviceabilityOptions.map((option) => (
              <option key={option} value={option}>
                {serviceabilityLabel(option)}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="icon-btn"
            aria-label="Remove line"
            disabled={lines.length === 1}
            onClick={() => setLines((current) => current.filter((_, lineIndex) => lineIndex !== index))}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <Button
        variant="secondary"
        icon={<Plus size={16} />}
        onClick={() => setLines((current) => [...current, emptyLine(current.length === 0 ? 0 : 1)])}
      >
        Add line
      </Button>

      <h2 className="section-title">Applicability</h2>
      <div className="create-grid">
        <label className="field">
          <span className="field-label">Model</span>
          <input className="control" value={model} onChange={(event) => setModel(event.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Category</span>
          <input className="control" value={category} onChange={(event) => setCategory(event.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Model year</span>
          <input className="control" value={modelYears} onChange={(event) => setModelYears(event.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Size</span>
          <input className="control" value={sizes} onChange={(event) => setSizes(event.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Market</span>
          <input className="control" value={market} onChange={(event) => setMarket(event.target.value)} />
        </label>
      </div>
    </form>
  );
}
