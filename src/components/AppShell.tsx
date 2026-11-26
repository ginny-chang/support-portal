import { ArrowLeft } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link, Outlet, useLocation, useSearchParams } from "react-router-dom";
import { useBomCatalog } from "../data/bomCatalog";
import { filterBoms, parseQuery } from "../data/query";
import { useWorkOrders } from "../data/workOrderCatalog";
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
  const { records: workOrders } = useWorkOrders();
  const onList = location.pathname === "/bom";
  const onWorkList = location.pathname === "/work-orders";
  const editMatch = location.pathname.match(/^\/bom\/([^/]+)\/edit$/);
  const creating = location.pathname === "/bom/new";
  const creatingWork = location.pathname === "/work-orders/new";
  const editing = Boolean(editMatch);
  const detail = location.pathname.startsWith("/bom/") && !creating && !editing;
  const workDetail = /^\/work-orders\/(?!new$)[^/]+$/.test(location.pathname);
  const backTo = `/bom${listFrom(location.state)}`;
  const countParams = onList ? params : new URLSearchParams(listFrom(location.state).replace(/^\?/, ""));
  const count = onWorkList ? workOrders.length : filterBoms(records, parseQuery(countParams)).length;
  const [topbarSlot, setTopbarSlot] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const pageTitle = creatingWork
      ? "Add Service Work Order"
      : onWorkList
        ? "Service Work Order"
        : workDetail
          ? "Service Work Order detail"
          : creating
            ? "Add BOM"
            : editing
              ? "Update BOM"
              : detail
                ? "Service BOM detail"
                : "Service BOM";
    document.title = `${pageTitle} · Giant Support Portal`;
  }, [creating, creatingWork, detail, editing, onWorkList, workDetail]);

  return (
    <div className="app-frame">
      <TopbarSlotContext.Provider value={topbarSlot}>
      <div className="shell">
        <Sidebar />
        <div className="main">
          <header className="topbar">
            <div className="topbar-title">
              {editing ? (
                <Link className="crumb" to={`/bom/${editMatch?.[1]}`} aria-label="Back">
                  <ArrowLeft size={18} aria-hidden="true" />
                </Link>
              ) : null}
              {detail || workDetail ? (
                <Link className="crumb crumb-parent" to={workDetail ? "/work-orders" : backTo}>
                  <ArrowLeft size={14} aria-hidden="true" />
                  {workDetail ? "Service Work Order" : "Service BOM"}
                </Link>
              ) : (
                <h1>
                  {creatingWork
                    ? "Add Service Work Order"
                    : creating
                      ? "Add BOM"
                      : editing
                        ? "Update BOM"
                        : onWorkList
                          ? "Service Work Order"
                          : "Service BOM"}
                </h1>
              )}
              {onList || onWorkList ? (
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
