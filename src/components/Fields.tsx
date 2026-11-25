import { Search } from "lucide-react";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { useId } from "react";

type FieldProps = {
  label: string;
  children: ReactNode;
};

export function Field({ label, children }: FieldProps) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}

type TextFieldProps = {
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function TextField({ label, ...rest }: TextFieldProps) {
  const id = useId();
  return (
    <Field label={label}>
      <input id={id} className="control" {...rest} />
    </Field>
  );
}

type SelectFieldProps = {
  label: string;
  options: { value: string; label: string }[];
} & SelectHTMLAttributes<HTMLSelectElement>;

export function SelectField({ label, options, ...rest }: SelectFieldProps) {
  const id = useId();
  return (
    <Field label={label}>
      <select id={id} className="control" {...rest}>
        {options.map((option) => (
          <option key={option.value || "all"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

type SearchFieldProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
};

export function SearchField({ label, value, onValueChange }: SearchFieldProps) {
  return (
    <label className="search">
      <Search size={16} aria-hidden="true" />
      <input
        value={value}
        aria-label={label}
        placeholder={label}
        onChange={(event) => onValueChange(event.target.value)}
      />
    </label>
  );
}
