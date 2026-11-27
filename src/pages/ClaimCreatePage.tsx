import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TopbarSlot } from "../components/AppShell";
import { Button } from "../components/Button";
import { SelectMenu } from "../components/SelectMenu";
import type { ClaimType } from "../data/claims";
import { useClaims } from "../data/claimCatalog";

const claimTypes: ClaimType[] = ["Warranty", "Quality", "Damage"];

export function ClaimCreatePage() {
  const navigate = useNavigate();
  const { addClaim } = useClaims();
  const [target, setTarget] = useState<"product" | "assembly">("product");
  const [name, setName] = useState("");
  const [claimType, setClaimType] = useState<ClaimType>("Warranty");
  const [dealer, setDealer] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const pristine = useMemo(
    () => !name.trim() && !dealer.trim() && !description.trim() && claimType === "Warranty",
    [claimType, dealer, description, name],
  );

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: string[] = [];
    if (!name.trim()) nextErrors.push("Product or Assembly is required.");
    if (!dealer.trim()) nextErrors.push("Dealer is required.");
    if (!description.trim()) nextErrors.push("Description is required.");
    setErrors(nextErrors);
    if (nextErrors.length > 0) return;
    const id = addClaim({
      product: target === "product" ? name : "",
      assembly: target === "assembly" ? name : "",
      claimType,
      dealer,
      description,
    });
    navigate(`/claims/${id}`);
  }

  return (
    <form className="page create" id="claim-draft" onSubmit={submit}>
      <TopbarSlot>
        {pristine ? (
          <Link className="btn btn-secondary" to="/claims">
            Cancel
          </Link>
        ) : null}
        <Button type="submit" form="claim-draft">
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
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
        </div>
        <label className="field">
          <span className="field-label">Type</span>
          <SelectMenu
            label="Type"
            value={claimType}
            options={claimTypes.map((type) => ({ value: type, label: type }))}
            onChange={(value) => setClaimType(value as ClaimType)}
          />
        </label>
        <label className="field">
          <span className="field-label">Status</span>
          <input className="control" value="Draft" readOnly />
        </label>
        <label className="field">
          <span className="field-label">Dealer</span>
          <input className="control" value={dealer} onChange={(event) => setDealer(event.target.value)} />
        </label>
        <label className="field field-wide">
          <span className="field-label">Description</span>
          <input className="control" value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
      </div>
    </form>
  );
}
