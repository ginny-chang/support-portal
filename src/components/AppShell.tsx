import { ArrowLeft } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link, Outlet, useLocation, useSearchParams } from "react-router-dom";
import { useBomCatalog } from "../data/bomCatalog";
import { filterBoms, parseQuery } from "../data/query";
import { Sidebar } from "./Sidebar";

const TopbarSlotContext = createContext<HTMLDivElement | null>(null);

export function TopbarSlot({ children }: { children: ReactNode }) {
  const slot = useContext(TopbarSlotContext);
  if (!slot) return null;
  return createPortal(children, slot);
}

function listFrom(state: unknown): string {
  if (state && typeof state === "object" && "from" in state && typeof state.from === "string") {
    return state.from;
  }
  return "";
}

export function AppShell() {
  const location = useLocation();
  const [params] = useSearchParams();
  const { records } = useBomCatalog();
  const onList = location.pathname === "/bom";
  const editMatch = location.pathname.match(/^\/bom\/([^/]+)\/edit$/);
  const creating = location.pathname === "/bom/new";
  const editing = Boolean(editMatch);
  const detail = location.pathname.startsWith("/bom/") && !creating && !editing;
  const backTo = `/bom${listFrom(location.state)}`;
  const countParams = onList ? params : new URLSearchParams(listFrom(location.state).replace(/^\?/, ""));
  const count = filterBoms(records, parseQuery(countParams)).length;
  const [topbarSlot, setTopbarSlot] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    document.title = creating
      ? "Add BOM · Giant Support Portal"
      : editing
        ? "Update BOM · Giant Support Portal"
        : detail
          ? "Service BOM detail · Giant Support Portal"
          : "Service BOM · Giant Support Portal";
  }, [creating, detail, editing]);

  return (
    <div className="app-frame">
      <TopbarSlotContext.Provider value={topbarSlot}>
      <div className="shell">
        <Sidebar />
        <div className="main">
          <header className="topbar">
            <div className="topbar-title">
              {creating || editing ? (
                <Link className="crumb" to={editing ? `/bom/${editMatch?.[1]}` : "/bom"} aria-label="Back">
                  <ArrowLeft size={18} aria-hidden="true" />
                </Link>
              ) : null}
              {detail ? (
                <Link className="crumb crumb-parent" to={backTo}>
                  <ArrowLeft size={14} aria-hidden="true" />
                  Service BOM
                </Link>
              ) : (
                <h1>{creating ? "Add BOM" : editing ? "Update BOM" : "Service BOM"}</h1>
              )}
              {onList ? (
                <span className="title-count" aria-label={`${count} Service BOM`}>
                  {count}
                </span>
              ) : null}
            </div>
            <div className="topbar-actions" ref={setTopbarSlot} />
          </header>
          <div className="content">
            <Outlet />
          </div>
        </div>
      </div>
      </TopbarSlotContext.Provider>
    </div>
  );
}
