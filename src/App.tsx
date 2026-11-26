import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { BomCatalogProvider } from "./data/bomCatalog";
import { BomCreatePage } from "./pages/BomCreatePage";
import { BomDetailPage } from "./pages/BomDetailPage";
import { BomListPage } from "./pages/BomListPage";

export default function App() {
  return (
    <BrowserRouter>
      <BomCatalogProvider>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/bom" replace />} />
            <Route path="/bom" element={<BomListPage />} />
            <Route path="/bom/new" element={<BomCreatePage />} />
            <Route path="/bom/:bomId" element={<BomDetailPage />} />
            <Route path="*" element={<Navigate to="/bom" replace />} />
          </Route>
        </Routes>
      </BomCatalogProvider>
    </BrowserRouter>
  );
}
