import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const htmlEntry = (path) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: htmlEntry("./index.html"),
        about: htmlEntry("./about.html"),
        case: htmlEntry("./case.html"),
        contact: htmlEntry("./contact.html"),
        consulting: htmlEntry("./consulting.html"),
        "systems-consulting": htmlEntry("./systems-consulting.html"),
        "visual-design": htmlEntry("./visual-design.html"),
        "international-marketing": htmlEntry("./international-marketing.html"),
        "international-finance": htmlEntry("./international-finance.html"),
        "digital-integration": htmlEntry("./digital-integration.html"),
        faq: htmlEntry("./faq.html"),
        map: htmlEntry("./map.html"),
        solutions: htmlEntry("./solutions.html"),
      },
    },
  },
});
