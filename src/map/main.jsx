import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MapExperience from "./MapExperience.jsx";
import "./map.css";
import "maplibre-gl/dist/maplibre-gl.css";

createRoot(document.getElementById("map-root")).render(
  <StrictMode>
    <MapExperience />
  </StrictMode>,
);
