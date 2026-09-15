import { useState } from "react";
import { createRoot } from "react-dom/client";
import DesignerControls from "../src/components/DesignerControls";
import {
  designerStyle,
  type DesignerLayout,
} from "../src/components/designerLayout";
import "../src/components/Designer.css";
export default function Fixture() {
  const [feature, setFeature] = useState<
    DesignerLayout & { id: string; type: string }
  >({
    id: "ornament",
    type: "image",
    freePosition: true,
    positionScope: "canvas",
    anchorX: "left",
    anchorY: "top",
    posX: 0,
    posY: 0,
    boxWidth: 20,
    boxHeight: 60,
  });
  return (
    <>
      <div
        className="canvas-section"
        data-testid="canvas"
        style={{ height: 500, width: "100%", background: "#eee" }}
      >
        <div className="canvas-decoration-layer">
          <div
            data-testid="ornament"
            className="feature-block free-positioned"
            style={{ ...designerStyle(feature), background: "#165943" }}
          />
        </div>
      </div>
      <DesignerControls
        feature={feature}
        update={(patch) => setFeature((old) => ({ ...old, ...patch }))}
      />
    </>
  );
}
createRoot(document.getElementById("root")!).render(<Fixture />);
