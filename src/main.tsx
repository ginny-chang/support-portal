import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/noto-sans-tc/latin-400.css";
import "@fontsource/noto-sans-tc/latin-500.css";
import "@fontsource/noto-sans-tc/latin-600.css";
import "@fontsource/noto-sans-tc/latin-700.css";
import "@fontsource/noto-sans-tc/chinese-traditional-400.css";
import "@fontsource/noto-sans-tc/chinese-traditional-500.css";
import "@fontsource/noto-sans-tc/chinese-traditional-600.css";
import "@fontsource/noto-sans-tc/chinese-traditional-700.css";
import "./dls/base.css";
import "./dls/ui.css";
import "./dls/tailwind.css";
import App from "./App";

const root = document.getElementById("root");
if (!root) {
  throw new Error("root missing");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
