import { ArrowLeft } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link, Outlet, useLocation, useSearchParams } from "react-router-dom";
import { useBomCatalog } from "../data/bomCatalog";
import { useClaims } from "../data/claimCatalog";
import { useParts } from "../data/partCatalog";
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
  const { records: claims } = useClaims();
  const { records: parts } = useParts();
  const editMatch = location.pathname.match(/^\/bom\/([^/]+)\/edit$/);
  const creatingBom = location.pathname === "/bom/new";
  const editing = Boolean(editMatch);
  const bomDetail = location.pathname.startsWith("/bom/") && !creatingBom && !editing;
  const creatingWork = location.pathname === "/work-orders/new";
  const workDetail = /^\/work-orders\/(?!new$)[^/]+$/.test(location.pathname);
  const creatingClaim = location.pathname === "/claims/new";
  const claimDetail = /^\/claims\/(?!new$)[^/]+$/.test(location.pathname);
  const creatingPart = location.pathname === "/parts/new";
  const partDetail = /^\/parts\/(?!new$)[^/]+$/.test(location.pathname);
  const onBomList = location.pathname === "/bom";
  const onWorkList = location.pathname === "/work-orders";
  const onClaimList = location.pathname === "/claims";
  const onPartList = location.pathname === "/parts";
  const backTo = `/bom${listFrom(location.state)}`;
  const countParams = onBomList ? params : new URLSearchParams(listFrom(location.state).replace(/^\?/, ""));
  const count = onWorkList
    ? workOrders.length
    : onClaimList
      ? claims.length
      : onPartList
        ? parts.length
        : filterBoms(records, parseQuery(countParams)).length;
  const countLabel = onWorkList
    ? "Service Work Order"
    : onClaimList
      ? "Quality Claim"
      : onPartList
        ? "Spare Part Management"
        : "Service BOM";
  const pageTitle = creatingPart
    ? "Create Spare Part"
    : onPartList
      ? "Spare Part Management"
      : partDetail
        ? "Spare Part Management detail"
        : creatingClaim
          ? "Create Quality Claim"
          : onClaimList
            ? "Quality Claim"
            : claimDetail
              ? "Quality Claim detail"
              : creatingWork
                ? "Create Service Work Order"
                : onWorkList
                  ? "Service Work Order"
                  : workDetail
                    ? "Service Work Order detail"
                    : creatingBom
                      ? "Create BOM"
                      : editing
                        ? "Update BOM"
                        : bomDetail
                          ? "Service BOM detail"
                          : "Service BOM";
  const crumb = partDetail
    ? { to: "/parts", label: "Spare Part Management" }
    : claimDetail
      ? { to: "/claims", label: "Quality Claim" }
      : workDetail
        ? { to: "/work-orders", label: "Service Work Order" }
        : bomDetail
          ? { to: backTo, label: "Service BOM" }
          : null;
  const [topbarSlot, setTopbarSlot] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    document.title = `${pageTitle} · Giant Support Portal`;
  }, [pageTitle]);

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
              {crumb ? (
                <Link className="crumb crumb-parent" to={crumb.to}>
                  <ArrowLeft size={14} aria-hidden="true" />
                  {crumb.label}
                </Link>
              ) : (
                <h1>{pageTitle}</h1>
              )}
              {onBomList || onWorkList || onClaimList || onPartList ? (
                <span className="title-count" aria-label={`${count} ${countLabel}`}>
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
