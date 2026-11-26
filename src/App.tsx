import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { BomCatalogProvider } from "./data/bomCatalog";
import { WorkOrderCatalogProvider } from "./data/workOrderCatalog";
import { BomCreatePage } from "./pages/BomCreatePage";
import { BomDetailPage } from "./pages/BomDetailPage";
import { BomListPage } from "./pages/BomListPage";
import { WorkOrderCreatePage } from "./pages/WorkOrderCreatePage";
import { WorkOrderDetailPage } from "./pages/WorkOrderDetailPage";
import { WorkOrderListPage } from "./pages/WorkOrderListPage";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <BomCatalogProvider>
        <WorkOrderCatalogProvider>
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
              <Route path="*" element={<Navigate to="/bom" replace />} />
            </Route>
          </Routes>
        </WorkOrderCatalogProvider>
      </BomCatalogProvider>
    </BrowserRouter>
  );
}
