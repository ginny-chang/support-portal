import { Check, Minus } from "lucide-react";

type CheckboxProps = {
  checked: boolean;
  mixed?: boolean;
  label: string;
  onChange: () => void;
};

export function Checkbox({ checked, mixed = false, label, onChange }: CheckboxProps) {
  const active = checked || mixed;
  return (
    <button
      type="button"
      className="check-hit"
      role="checkbox"
      aria-checked={mixed ? "mixed" : checked}
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onChange();
      }}
    >
      <span className={active ? "checkbox is-checked" : "checkbox"}>
        {mixed ? <Minus size={12} strokeWidth={3} /> : null}
        {checked && !mixed ? <Check size={12} strokeWidth={3} /> : null}
      </span>
    </button>
  );
}
