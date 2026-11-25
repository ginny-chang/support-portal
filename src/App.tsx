import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { BomDetailPage } from "./pages/BomDetailPage";
import { BomListPage } from "./pages/BomListPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Navigate to="/bom" replace />} />
          <Route path="/bom" element={<BomListPage />} />
          <Route path="/bom/:bomId" element={<BomDetailPage />} />
          <Route path="*" element={<Navigate to="/bom" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
