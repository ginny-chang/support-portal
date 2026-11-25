export interface TabItem {
  id: string;
  label: string;
}

type TabsProps = {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  label: string;
};

export function Tabs({ items, value, onChange, label }: TabsProps) {
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {items.map((item) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            className={selected ? "tab is-active" : "tab"}
            aria-selected={selected}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
