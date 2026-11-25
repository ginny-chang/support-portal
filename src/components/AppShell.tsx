import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { Link, Outlet, useLocation, useSearchParams } from "react-router-dom";
import { boms } from "../data/bom";
import { filterBoms, parseQuery } from "../data/query";
import { Sidebar } from "./Sidebar";

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

  useEffect(() => {
    document.title = detail ? "Service BOM detail · Giant Support Portal" : "Service BOM · Giant Support Portal";
  }, [detail]);

  return (
    <div className="app-frame">
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
          </header>
          <div className="content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
