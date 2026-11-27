import { BrowserRouter, HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { BomCatalogProvider } from "./data/bomCatalog";
import { ClaimCatalogProvider } from "./data/claimCatalog";
import { PartCatalogProvider } from "./data/partCatalog";
import { WorkOrderCatalogProvider } from "./data/workOrderCatalog";
import { BomCreatePage } from "./pages/BomCreatePage";
import { BomDetailPage } from "./pages/BomDetailPage";
import { BomListPage } from "./pages/BomListPage";
import { ClaimCreatePage } from "./pages/ClaimCreatePage";
import { ClaimDetailPage } from "./pages/ClaimDetailPage";
import { ClaimListPage } from "./pages/ClaimListPage";
import { PartCreatePage } from "./pages/PartCreatePage";
import { PartDetailPage } from "./pages/PartDetailPage";
import { PartListPage } from "./pages/PartListPage";
import { WorkOrderCreatePage } from "./pages/WorkOrderCreatePage";
import { WorkOrderDetailPage } from "./pages/WorkOrderDetailPage";
import { WorkOrderListPage } from "./pages/WorkOrderListPage";

const pagesBuild = import.meta.env.BASE_URL !== "/";
const Router = pagesBuild ? HashRouter : BrowserRouter;

export default function App() {
  return (
    <Router basename={pagesBuild ? undefined : import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <BomCatalogProvider>
        <WorkOrderCatalogProvider>
          <ClaimCatalogProvider>
            <PartCatalogProvider>
              <Routes>
                <Route element={<AppShell />}>
                  <Route path="/" element={<Navigate to="/bom" replace />} />
                  <Route path="/bom" element={<BomListPage />} />
                  <Route path="/bom/new" element={<BomCreatePage />} />
                  <Route path="/bom/:bomId/edit" element={<BomCreatePage />} />
                  <Route path="/bom/:bomId" element={<BomDetailPage />} />
                  <Route path="/work-orders" element={<WorkOrderListPage />} />
                  <Route path="/work-orders/new" element={<WorkOrderCreatePage />} />
                  <Route path="/work-orders/:workOrderId" element={<WorkOrderDetailPage />} />
                  <Route path="/claims" element={<ClaimListPage />} />
                  <Route path="/claims/new" element={<ClaimCreatePage />} />
                  <Route path="/claims/:claimId" element={<ClaimDetailPage />} />
                  <Route path="/parts" element={<PartListPage />} />
                  <Route path="/parts/new" element={<PartCreatePage />} />
                  <Route path="/parts/:partId" element={<PartDetailPage />} />
                  <Route path="*" element={<Navigate to="/bom" replace />} />
                </Route>
              </Routes>
            </PartCatalogProvider>
          </ClaimCatalogProvider>
        </WorkOrderCatalogProvider>
      </BomCatalogProvider>
    </Router>
  );
}
