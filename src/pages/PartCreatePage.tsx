import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TopbarSlot } from "../components/AppShell";
import { Button } from "../components/Button";
import { SelectMenu } from "../components/SelectMenu";
import type { Serviceability } from "../data/bom";
import { useParts } from "../data/partCatalog";
import { serviceabilityLabel } from "../data/labels";

const units = ["ea", "set", "pc", "pr"];
const serviceabilityOptions: Serviceability[] = ["serviceable", "replaceable", "consumable", "assembly"];

export function PartCreatePage() {
  const navigate = useNavigate();
  const { records, addPart } = useParts();
  const [partId, setPartId] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("ea");
  const [location, setLocation] = useState("");
  const [serviceability, setServiceability] = useState<Serviceability>("replaceable");
  const [errors, setErrors] = useState<string[]>([]);
  const pristine = useMemo(
    () => !partId.trim() && !description.trim() && quantity === 1 && unit === "ea" && !location.trim() && serviceability === "replaceable",
    [description, location, partId, quantity, serviceability, unit],
  );

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: string[] = [];
    const id = partId.trim();
    if (!id) nextErrors.push("Part ID is required.");
    if (/\s/.test(id)) nextErrors.push("Part ID cannot contain spaces.");
    if (records.some((record) => record.partId === id)) nextErrors.push(`Part ID ${id} already exists.`);
    if (!description.trim()) nextErrors.push("Description is required.");
    if (!Number.isFinite(quantity) || quantity <= 0) nextErrors.push("Quantity must be a positive number.");
    if (!location.trim()) nextErrors.push("Location is required.");
    setErrors(nextErrors);
    if (nextErrors.length > 0) return;
    addPart({ partId: id, description, quantity, unit, location, serviceability });
    navigate(`/parts/${id}`);
  }

  return (
    <form className="page create" id="part-draft" onSubmit={submit}>
      <TopbarSlot>
        {pristine ? (
          <Link className="btn btn-secondary" to="/parts">
            Cancel
          </Link>
        ) : null}
        <Button type="submit" form="part-draft">
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
        <label className="field">
          <span className="field-label">Part ID</span>
          <input className="control" value={partId} onChange={(event) => setPartId(event.target.value)} />
        </label>
        <label className="field field-wide">
          <span className="field-label">Description</span>
          <input className="control" value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Quantity</span>
          <input
            className="control"
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
          />
        </label>
        <label className="field">
          <span className="field-label">Unit</span>
          <SelectMenu label="Unit" value={unit} options={units.map((item) => ({ value: item, label: item }))} onChange={setUnit} />
        </label>
        <label className="field">
          <span className="field-label">Location</span>
          <input className="control" value={location} onChange={(event) => setLocation(event.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Serviceability</span>
          <SelectMenu
            label="Serviceability"
            value={serviceability}
            options={serviceabilityOptions.map((option) => ({ value: option, label: serviceabilityLabel(option) }))}
            onChange={(value) => setServiceability(value as Serviceability)}
          />
        </label>
      </div>
    </form>
  );
}
