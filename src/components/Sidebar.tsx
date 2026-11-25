import {
  ArrowLeftRight,
  ClipboardList,
  Cpu,
  FileText,
  Network,
  Package,
  Settings,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
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
    label: "服務作業",
    items: [
      { id: "bom", label: "服務 BOM", icon: Network, to: "/bom" },
      { id: "work-orders", label: "服務工單", icon: ClipboardList },
      { id: "claims", label: "品質索賠", icon: ShieldAlert },
      { id: "replacement", label: "備品更換", icon: ArrowLeftRight },
    ],
  },
  {
    label: "庫存與文件",
    items: [
      { id: "stock", label: "備品庫存", icon: Package },
      { id: "docs", label: "技術文件", icon: FileText },
      { id: "firmware", label: "韌體庫", icon: Cpu },
    ],
  },
  {
    label: "系統",
    items: [
      { id: "assistant", label: "AI 助理", icon: Sparkles },
      { id: "admin", label: "管理", icon: Settings },
    ],
  },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <img src={wordmark} alt="Giant" width={128} height={24} />
      </div>
      <nav className="nav" aria-label="主選單">
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
    </aside>
  );
}
