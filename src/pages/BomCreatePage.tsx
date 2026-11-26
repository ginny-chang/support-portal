import { Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TopbarSlot } from "../components/AppShell";
import { Button } from "../components/Button";
import { SelectMenu } from "../components/SelectMenu";
import type { BomLine, Serviceability, Supersession } from "../data/bom";
import { useBomCatalog } from "../data/bomCatalog";
import { nextRevision, revisionForTarget, validateBomDraft } from "../data/bomRules";
import { serviceabilityLabel } from "../data/labels";

const serviceabilityOptions: Serviceability[] = ["serviceable", "replaceable", "consumable", "assembly"];
const units = ["ea", "set", "pc", "pr"];
const relations = ["Discontinued supersession", "Specification supersession"];

function emptySupersession(fromPartId = ""): Supersession {
  return { fromPartId, toPartId: "", relation: relations[0], effectiveDate: "" };
}

function emptyLine(level: number): BomLine {
  return {
    level,
    partId: "",
    description: "",
    quantity: 1,
    unit: "ea",
    serviceability: "replaceable",
    obsolete: false,
    parentPartId: "",
  };
}

export function BomCreatePage() {
  const navigate = useNavigate();
  const { bomId } = useParams();
  const { records, addBom, updateBom } = useBomCatalog();
  const source = bomId ? records.find((record) => record.id === bomId) : undefined;
  const locked = source ? source.status === "released" || source.status === "superseded" || source.status === "obsolete" : false;
  const [target, setTarget] = useState<"product" | "assembly">(
    source && !source.product && source.assembly ? "assembly" : "product",
  );
  const [product, setProduct] = useState(source?.product ?? "");
  const [assembly, setAssembly] = useState(source?.assembly ?? "");
  const revision = useMemo(() => {
    if (locked && source) {
      const fromSource = nextRevision(source.revision);
      const fromFamily = revisionForTarget(records, {
        product: source.product,
        assembly: source.assembly,
        excludeId: source.id,
      });
      return fromSource.localeCompare(fromFamily) >= 0 ? fromSource : fromFamily;
    }
    if (source) return source.revision;
    return revisionForTarget(records, {
      product: target === "product" ? product : "",
      assembly: target === "assembly" ? assembly : "",
    });
  }, [assembly, locked, product, records, source, target]);
  const [reason, setReason] = useState("");
  const [lines, setLines] = useState<BomLine[]>(
    source?.lines.map((line) => ({ ...line, parentPartId: line.parentPartId ?? "" })) ?? [emptyLine(0)],
  );
  const [supersessions, setSupersessions] = useState<Supersession[]>(source?.supersessions ?? []);
  const [model, setModel] = useState(source?.applicability.model ?? "");
  const [category, setCategory] = useState(source?.applicability.category ?? "");
  const [modelYears, setModelYears] = useState(source?.applicability.modelYears ?? "");
  const [sizes, setSizes] = useState(source?.applicability.sizes ?? "");
  const [market, setMarket] = useState(source?.applicability.market ?? "Taiwan");
  const [errors, setErrors] = useState<string[]>([]);
  const pristine = useMemo(() => {
    if (source) return false;
    const line = lines[0];
    const untouchedLine =
      lines.length === 1 &&
      line.level === 0 &&
      !line.partId.trim() &&
      !line.description.trim() &&
      line.quantity === 1 &&
      line.unit === "ea" &&
      line.serviceability === "replaceable" &&
      !(line.parentPartId ?? "").trim() &&
      !line.obsolete;
    return (
      !product.trim() &&
      !assembly.trim() &&
      !reason.trim() &&
      !model.trim() &&
      !category.trim() &&
      !modelYears.trim() &&
      !sizes.trim() &&
      (market.trim() === "Taiwan" || !market.trim()) &&
      supersessions.length === 0 &&
      untouchedLine
    );
  }, [assembly, category, lines, market, model, modelYears, product, reason, sizes, source, supersessions.length]);

  function updateLine(index: number, patch: Partial<BomLine>) {
    setLines((current) => current.map((line, lineIndex) => (lineIndex === index ? { ...line, ...patch } : line)));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextLines = lines.map((line) => ({
      ...line,
      partId: line.partId.trim(),
      description: line.description.trim(),
      parentPartId: line.parentPartId?.trim() ?? "",
    }));
    const nextSupersessions = supersessions
      .map((item) => ({
        fromPartId: item.fromPartId.trim(),
        toPartId: item.toPartId.trim(),
        relation: item.relation.trim(),
        effectiveDate: item.effectiveDate,
      }))
      .filter((item) => item.fromPartId || item.toPartId || item.effectiveDate);
    const nextProduct = locked ? (source?.product ?? "") : target === "product" ? product.trim() : "";
    const nextAssembly = locked ? (source?.assembly ?? "") : target === "assembly" ? assembly.trim() : "";
    const input = {
      product: nextProduct,
      assembly: nextAssembly,
      revision,
      reason,
      lines: nextLines,
      supersessions: nextSupersessions,
      applicability: {
        model: model.trim() || nextProduct || nextAssembly,
        category,
        modelYears,
        sizes,
        market,
      },
    };
    const nextErrors = validateBomDraft(input, { exclusiveTarget: !locked });
    setErrors(nextErrors);
    if (nextErrors.length > 0) return;
    const id = source ? updateBom(source.id, input) : addBom(input);
    navigate(`/bom/${id}`);
  }

  return (
    <form className="page create" id="bom-draft" onSubmit={submit}>
      <TopbarSlot>
        {source || pristine ? (
          <Link className="btn btn-secondary" to={source ? `/bom/${source.id}` : "/bom"}>
            Cancel
          </Link>
        ) : null}
        <Button type="submit" form="bom-draft">
          {locked ? "Save new revision" : source ? "Save" : "Save draft"}
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
        {locked ? (
          <>
            {source?.product ? (
              <label className="field">
                <span className="field-label">Product</span>
                <input className="control" value={source.product} readOnly />
              </label>
            ) : null}
            {source?.assembly ? (
              <label className="field">
                <span className="field-label">Assembly</span>
                <input className="control" value={source.assembly} readOnly />
              </label>
            ) : null}
          </>
        ) : (
          <div className="field field-wide">
            <span className="field-label">Product or Assembly</span>
            <div className="target-row">
              <div className="segment" role="radiogroup" aria-label="Product or Assembly">
                <button
                  type="button"
                  role="radio"
                  aria-checked={target === "product"}
                  className={target === "product" ? "is-selected" : undefined}
                  onClick={() => setTarget("product")}
                >
                  Product
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={target === "assembly"}
                  className={target === "assembly" ? "is-selected" : undefined}
                  onClick={() => setTarget("assembly")}
                >
                  Assembly
                </button>
              </div>
              <input
                className="control"
                aria-label={target === "product" ? "Product" : "Assembly"}
                value={target === "product" ? product : assembly}
                onChange={(event) =>
                  target === "product" ? setProduct(event.target.value) : setAssembly(event.target.value)
                }
              />
            </div>
          </div>
        )}
      </div>

      <div className="create-grid">
        <label className="field">
          <span className="field-label">Revision</span>
          <input className="control" value={revision} readOnly aria-label="Revision" />
        </label>
        <label className="field">
          <span className="field-label">Status</span>
          <input className="control" value="Draft" readOnly />
        </label>
        <label className="field field-wide">
          <span className="field-label">Reason</span>
          <input className="control" value={reason} onChange={(event) => setReason(event.target.value)} />
        </label>
      </div>

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

      <h2 className="section-title">Lines</h2>
      <div className="line-head">
        <span>Level</span>
        <span>Part ID</span>
        <span>Description</span>
        <span>Quantity</span>
        <span>Unit</span>
        <span>Serviceability</span>
        <span>Parent</span>
        <span />
      </div>
      {lines.map((line, index) => {
        const parentOptions = [
          { value: "", label: "None" },
          ...lines
            .filter((item, itemIndex) => itemIndex !== index && item.partId.trim())
            .map((item) => ({ value: item.partId.trim(), label: item.partId.trim() })),
        ];
        return (
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
              onChange={(event) => updateLine(index, { partId: event.target.value })}
            />
            <input
              className="control"
              aria-label="Description"
              value={line.description}
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
            <SelectMenu
              label="Unit"
              value={line.unit}
              options={units.map((unit) => ({ value: unit, label: unit }))}
              onChange={(unit) => updateLine(index, { unit })}
            />
            <SelectMenu
              label="Serviceability"
              value={line.serviceability}
              options={serviceabilityOptions.map((option) => ({ value: option, label: serviceabilityLabel(option) }))}
              onChange={(serviceability) => updateLine(index, { serviceability: serviceability as Serviceability })}
            />
            <SelectMenu
              label="Parent"
              value={line.parentPartId ?? ""}
              options={parentOptions}
              onChange={(parentPartId) => updateLine(index, { parentPartId })}
            />
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
        );
      })}
      <Button
        variant="secondary"
        icon={<Plus size={16} />}
        onClick={() => setLines((current) => [...current, emptyLine(current.length === 0 ? 0 : 1)])}
      >
        Create line
      </Button>

      <h2 className="section-title">Substitutes / supersession</h2>
      {(() => {
        const partOptions = [
          ...new Map(
            lines
              .filter((line) => line.partId.trim())
              .map((line) => [line.partId.trim(), line.description.trim()] as const),
          ).entries(),
        ].map(([id, description]) => ({ value: id, label: description ? `${id} ${description}` : id }));
        return (
          <>
      {supersessions.length > 0 ? (
        <div className="sub-head">
          <span>Original part ID</span>
          <span>Superseding part ID</span>
          <span>Relation</span>
          <span>Effective Date</span>
          <span />
        </div>
      ) : null}
      {supersessions.map((item, index) => (
        <div className="sub-editor" key={index}>
          <SelectMenu
            label="Original part ID"
            value={item.fromPartId}
            options={
              item.fromPartId && !partOptions.some((option) => option.value === item.fromPartId)
                ? [{ value: item.fromPartId, label: item.fromPartId }, ...partOptions]
                : partOptions
            }
            onChange={(fromPartId) =>
              setSupersessions((current) =>
                current.map((row, rowIndex) => (rowIndex === index ? { ...row, fromPartId } : row)),
              )
            }
          />
          <input
            className="control"
            aria-label="Superseding part ID"
            value={item.toPartId}
            onChange={(event) =>
              setSupersessions((current) =>
                current.map((row, rowIndex) => (rowIndex === index ? { ...row, toPartId: event.target.value } : row)),
              )
            }
          />
          <SelectMenu
            label="Relation"
            value={item.relation}
            options={relations.map((relation) => ({ value: relation, label: relation }))}
            onChange={(relation) =>
              setSupersessions((current) => current.map((row, rowIndex) => (rowIndex === index ? { ...row, relation } : row)))
            }
          />
          <input
            className="control"
            type="date"
            aria-label="Effective Date"
            value={item.effectiveDate}
            onChange={(event) =>
              setSupersessions((current) =>
                current.map((row, rowIndex) => (rowIndex === index ? { ...row, effectiveDate: event.target.value } : row)),
              )
            }
          />
          <button
            type="button"
            className="icon-btn"
            aria-label="Remove substitute"
            onClick={() => setSupersessions((current) => current.filter((_, rowIndex) => rowIndex !== index))}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <Button
        variant="secondary"
        icon={<Plus size={16} />}
        disabled={partOptions.length === 0}
        onClick={() => setSupersessions((current) => [...current, emptySupersession(partOptions[0]?.value ?? "")])}
      >
        Create substitute
      </Button>
          </>
        );
      })()}
    </form>
  );
}
