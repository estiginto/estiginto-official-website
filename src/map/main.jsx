import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MapExperience from "./MapExperience.jsx";
import "maplibre-gl/dist/maplibre-gl.css";
import "./map.css";

createRoot(document.getElementById("map-root")).render(
  <StrictMode>
    <MapExperience />
  </StrictMode>,
);
