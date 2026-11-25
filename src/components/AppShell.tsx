import { Bell, CircleHelp } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { defaultQuery, parseQuery, toSearchParams } from "../data/query";
import { SearchField } from "./Fields";
import { Sidebar } from "./Sidebar";

function listFrom(state: unknown): string {
  if (state && typeof state === "object" && "from" in state && typeof state.from === "string") {
    return state.from;
  }
  return "";
}

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const onList = location.pathname === "/bom";
  const detail = location.pathname.startsWith("/bom/");
  const backTo = `/bom${listFrom(location.state)}`;
  const [draft, setDraft] = useState(() => parseQuery(params).q);

  useEffect(() => {
    document.title = detail ? "Service BOM detail · Giant Support Portal" : "Service BOM · Giant Support Portal";
  }, [detail]);

  function updateQuery(value: string) {
    setDraft(value);
    if (onList) {
      setParams((current) => toSearchParams({ ...parseQuery(current), q: value }), { replace: true });
      return;
    }
    navigate({ pathname: "/bom", search: toSearchParams({ ...defaultQuery, q: value }).toString() });
  }

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
            </div>
            <SearchField
              label="Search by product, model, assembly, or part number"
              value={draft}
              onValueChange={updateQuery}
            />
            <div className="topbar-actions">
              <button type="button" className="icon-btn" disabled aria-label="Notifications">
                <Bell size={18} />
              </button>
              <button type="button" className="icon-btn" disabled aria-label="Help">
                <CircleHelp size={18} />
              </button>
              <div className="user">
                <div className="avatar" aria-hidden="true">
                  陳
                </div>
                <div>
                  <div className="user-name">陳宜安</div>
                  <div className="user-role">Service engineer</div>
                </div>
              </div>
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
