import type { Applicability, BomLine } from "./bom";

export interface BomDraftInput {
  product: string;
  assembly: string;
  revision: string;
  reason: string;
  lines: BomLine[];
  applicability: Applicability;
}

export function validateBomDraft(input: BomDraftInput, options?: { exclusiveTarget?: boolean }): string[] {
  const errors: string[] = [];
  const product = input.product.trim();
  const assembly = input.assembly.trim();
  if (options?.exclusiveTarget !== false) {
    if (product && assembly) errors.push("Choose Product or Assembly.");
    else if (!product && !assembly) errors.push("Product or Assembly is required.");
  } else if (!product && !assembly) {
    errors.push("Product or Assembly is required.");
  }
  if (!input.revision.trim()) errors.push("Revision is required.");
  if (!input.reason.trim()) errors.push("Reason is required.");
  if (!input.applicability.model.trim()) errors.push("Model is required.");
  if (!input.applicability.category.trim()) errors.push("Category is required.");
  if (!input.applicability.modelYears.trim()) errors.push("Model year is required.");
  if (!input.applicability.sizes.trim()) errors.push("Size is required.");
  if (!input.applicability.market.trim()) errors.push("Market is required.");
  if (input.lines.length === 0) errors.push("At least one line is required.");

  const seen = new Set<string>();
  const byId = new Map<string, BomLine>();
  for (const line of input.lines) {
    const partId = line.partId.trim();
    if (!partId) {
      errors.push("Part ID is required.");
      continue;
    }
    if (/\s/.test(partId)) errors.push(`Part ID ${partId} cannot contain spaces.`);
    if (seen.has(partId)) errors.push(`Duplicate part ID ${partId}.`);
    seen.add(partId);
    byId.set(partId, line);
    if (!line.description.trim()) errors.push(`Description is required for ${partId}.`);
    if (!Number.isFinite(line.quantity) || line.quantity <= 0) {
      errors.push(`Quantity for ${partId} must be a positive number.`);
    }
  }

  for (const line of input.lines) {
    const partId = line.partId.trim();
    if (!partId) continue;
    const parent = line.parentPartId?.trim() ?? "";
    if (line.level < 0 || !Number.isInteger(line.level)) {
      errors.push(`Level for ${partId} must be zero or a positive integer.`);
      continue;
    }
    if (line.level === 0 && parent) errors.push(`${partId} is level 0 and cannot have a parent.`);
    if (line.level > 0 && !parent) errors.push(`${partId} needs a parent part.`);
    if (!parent) continue;
    if (parent === partId) {
      errors.push(`${partId} cannot reference itself.`);
      continue;
    }
    const parentLine = byId.get(parent);
    if (!parentLine) {
      errors.push(`${partId} parent ${parent} is not in this BOM.`);
      continue;
    }
    if (parentLine.level !== line.level - 1) {
      errors.push(`${partId} must sit directly under a level ${line.level - 1} part.`);
    }
  }

  for (const line of input.lines) {
    const start = line.partId.trim();
    if (!start) continue;
    const walked = new Set<string>();
    let current = start;
    while (current) {
      if (walked.has(current)) {
        errors.push(`Circular reference at ${start}.`);
        break;
      }
      walked.add(current);
      current = byId.get(current)?.parentPartId?.trim() ?? "";
    }
  }

  return errors;
}

export function nextRevision(revision: string): string {
  const letter = revision.trim().toUpperCase();
  if (/^[A-Y]$/.test(letter)) return String.fromCharCode(letter.charCodeAt(0) + 1);
  return `${letter}2`;
}
