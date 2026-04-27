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
        faq: htmlEntry("./faq.html"),
        solutions: htmlEntry("./solutions.html"),
      },
    },
  },
});
