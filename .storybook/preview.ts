import { definePreview } from "@storybook/react-vite";
import "@fontsource/noto-sans-tc/latin-400.css";
import "@fontsource/noto-sans-tc/latin-500.css";
import "@fontsource/noto-sans-tc/latin-600.css";
import "@fontsource/noto-sans-tc/latin-700.css";
import "@fontsource/noto-sans-tc/chinese-traditional-400.css";
import "@fontsource/noto-sans-tc/chinese-traditional-500.css";
import "@fontsource/noto-sans-tc/chinese-traditional-600.css";
import "@fontsource/noto-sans-tc/chinese-traditional-700.css";
import "../src/dls/base.css";
import "../src/dls/ui.css";

export default definePreview({
  parameters: {
    layout: "padded",
    options: {
      storySort: {
        order: ["Foundations", "Components", "Screens"],
      },
    },
  },
});
