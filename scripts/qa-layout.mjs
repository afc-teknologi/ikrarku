import { test } from "node:test";
import assert from "node:assert/strict";
import { designerStyle } from "../src/components/designerLayout.ts";

test("Image docks to either top corner with explicit inset and width", () => {
  for (const anchorX of ["left", "right"]) {
    const css = designerStyle({
      freePosition: true,
      anchorX,
      anchorY: "top",
      posX: 0,
      posY: 0,
      boxWidth: 20,
    });
    assert.equal(css[`--d-${anchorX}`], "0%");
    assert.equal(css[`--d-${anchorX === "left" ? "right" : "left"}`], "auto");
    assert.equal(css["--d-top"], "0px");
    assert.equal(css["--d-width"], "20%");
  }
});
test("Center docking accepts signed offsets; bottom docking preserves inset", () => {
  const center = designerStyle({
    freePosition: true,
    anchorX: "center",
    anchorY: "center",
    posX: -5,
    posY: 20,
  });
  assert.equal(center["--d-left"], "calc(50% + -5%)");
  assert.equal(center["--d-top"], "calc(50% + 20px)");
  assert.equal(center["--d-translate"], "-50% -50%");
  const bottom = designerStyle({
    freePosition: true,
    anchorY: "bottom",
    posY: 40,
  });
  assert.equal(bottom["--d-top"], "auto");
  assert.equal(bottom["--d-bottom"], "40px");
});
test("Mobile inherits desktop and can override independently without mutating stored data", () => {
  const feature = {
    freePosition: true,
    anchorX: "right",
    posX: 2,
    boxWidth: 25,
    mobileLayout: { anchorX: "left", boxWidth: 45 },
  };
  const snapshot = structuredClone(feature),
    css = designerStyle(feature);
  assert.equal(css["--d-right"], "2%");
  assert.equal(css["--m-left"], "2%");
  assert.equal(css["--d-width"], "25%");
  assert.equal(css["--m-width"], "45%");
  assert.deepEqual(feature, snapshot);
  assert.equal(
    designerStyle({ ...feature, mobileLayout: undefined })["--m-right"],
    "2%",
  );
});
test("Nonfinite and out-of-range persisted values produce bounded valid CSS", () => {
  const css = designerStyle({
    freePosition: true,
    posX: NaN,
    posY: Infinity,
    rotation: 700,
    boxWidth: 0,
    opacity: 250,
    layer: -3,
    motionDuration: 0,
    motionRepeat: 100,
  });
  assert.equal(css["--d-left"], "5%");
  assert.equal(css["--d-top"], "12px");
  assert.equal(css["--d-rotate"], "180deg");
  assert.equal(css["--d-width"], "5%");
  assert.equal(css["--designer-opacity"], 1);
  assert.equal(css["--designer-layer"], 0);
  assert.equal(css["--motion-duration"], "100ms");
  assert.equal(css["--motion-repeat"], 10);
});
test("Flow layout has no absolute positioning variables and keeps custom motion", () => {
  const css = designerStyle({
    freePosition: false,
    motionDuration: 1200,
    motionDelay: 300,
    motionRepeat: 2,
    motionEasing: "linear",
    opacity: 55,
  });
  assert.equal(css["--d-left"], undefined);
  assert.equal(css["--motion-duration"], "1200ms");
  assert.equal(css["--motion-delay"], "300ms");
  assert.equal(css["--motion-easing"], "linear");
  assert.equal(css["--designer-opacity"], 0.55);
});
