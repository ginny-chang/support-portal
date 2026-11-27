import { ClipboardList, Cpu, FileText, Network, Package, ShieldAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import wordmark from "../assets/giant-wordmark.svg";

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  to?: string;
}

const groups: { label: string; items: NavItem[] }[] = [
  {
    label: "Service operations",
    items: [
      { id: "bom", label: "Service BOM", icon: Network, to: "/bom" },
      { id: "work-orders", label: "Service Work Order", icon: ClipboardList, to: "/work-orders" },
      { id: "claims", label: "Quality Claim", icon: ShieldAlert, to: "/claims" },
    ],
  },
  {
    label: "Inventory and documents",
    items: [
      { id: "parts", label: "Spare Part Management", icon: Package, to: "/parts" },
      { id: "docs", label: "Technical Document", icon: FileText },
      { id: "firmware", label: "Firmware Library", icon: Cpu },
    ],
  },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <img src={wordmark} alt="Giant" width={128} height={24} />
      </div>
      <nav className="nav" aria-label="Main">
        {groups.map((group) => (
          <div className="nav-group" key={group.label}>
            <div className="nav-group-label">{group.label}</div>
            {group.items.map((item) => {
              const Icon = item.icon;
              if (!item.to) {
                return (
                  <button key={item.id} type="button" className="nav-item" disabled>
                    <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                    {item.label}
                  </button>
                );
              }
              return (
                <NavLink
                  key={item.id}
                  to={item.to}
                  className={({ isActive }) => (isActive ? "nav-item is-active" : "nav-item")}
                >
                  <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="sidebar-account">
        <div className="avatar" aria-hidden="true">
          R
        </div>
        <div>
          <div className="user-name">Roger Lo</div>
          <div className="user-role">Service engineer</div>
        </div>
      </div>
    </aside>
  );
}
