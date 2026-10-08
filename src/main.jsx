import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { getLegacyConsultingDestination } from "./consultingPages.js";
import { getHiddenSolutionsDestination } from "./serviceImplementation.js";
import App from "./App.jsx";
import "./App.css";

const legacyDestination = getLegacyConsultingDestination(window.location.pathname, window.location.hash, window.location.search)
  || getHiddenSolutionsDestination(window.location.pathname, window.location.hash, window.location.search);
if (legacyDestination) {
  window.location.replace(legacyDestination);
} else {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
