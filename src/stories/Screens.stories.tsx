import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { BomDetailPage } from "../pages/BomDetailPage";
import { BomListPage } from "../pages/BomListPage";

const meta = {
  title: "Screens/BOM",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

function Screen({ path }: { path: string }) {
  return (
    <MemoryRouter initialEntries={[path]}>
      <div className="screen-host">
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/bom" element={<BomListPage />} />
            <Route path="/bom/:bomId" element={<BomDetailPage />} />
          </Route>
        </Routes>
      </div>
    </MemoryRouter>
  );
}

export const List: StoryObj = { render: () => <Screen path="/bom" /> };
export const Detail: StoryObj = { render: () => <Screen path="/bom/BOM-SB-26014" /> };
