import { ArrowLeft } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link, Outlet, useLocation, useSearchParams } from "react-router-dom";
import { boms } from "../data/bom";
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
  const onList = location.pathname === "/bom";
  const detail = location.pathname.startsWith("/bom/");
  const backTo = `/bom${listFrom(location.state)}`;
  const countParams = onList ? params : new URLSearchParams(listFrom(location.state).replace(/^\?/, ""));
  const count = filterBoms(boms, parseQuery(countParams)).length;
  const [topbarSlot, setTopbarSlot] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    document.title = detail ? "Service BOM detail · Giant Support Portal" : "Service BOM · Giant Support Portal";
  }, [detail]);

  return (
    <div className="app-frame">
      <TopbarSlotContext.Provider value={topbarSlot}>
      <div className="shell">
        <Sidebar />
        <div className="main">
          <header className="topbar">
            <div className="topbar-title">
              {detail ? (
                <Link className="crumb" to={backTo}>
                  <ArrowLeft size={18} aria-hidden="true" />
                  Service BOM
                </Link>
              ) : (
                <h1>Service BOM</h1>
              )}
              <span className="title-count" aria-label={`${count} Service BOM`}>
                {count}
              </span>
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
