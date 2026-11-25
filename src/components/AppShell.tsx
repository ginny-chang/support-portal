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
    document.title = detail ? "服務 BOM 明細 · Giant Support Portal" : "服務 BOM · Giant Support Portal";
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
                  服務 BOM
                </Link>
              ) : (
                <h1>服務 BOM</h1>
              )}
            </div>
            <SearchField
              label="搜尋產品、車型、總成或料號"
              value={draft}
              onValueChange={updateQuery}
            />
            <div className="topbar-actions">
              <button type="button" className="icon-btn" disabled aria-label="通知">
                <Bell size={18} />
              </button>
              <button type="button" className="icon-btn" disabled aria-label="說明">
                <CircleHelp size={18} />
              </button>
              <div className="user">
                <div className="avatar" aria-hidden="true">
                  陳
                </div>
                <div>
                  <div className="user-name">陳宜安</div>
                  <div className="user-role">服務工程</div>
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
