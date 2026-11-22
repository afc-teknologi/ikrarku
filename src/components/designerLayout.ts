import type { CSSProperties } from "react";
export type Dock = {
  posX?: number;
  posY?: number;
  boxWidth?: number;
  boxHeight?: number;
  anchorX?: "left" | "center" | "right";
  anchorY?: "top" | "center" | "bottom";
  rotation?: number;
};
export type DesignerLayout = Dock & {
  freePosition?: boolean;
  positionScope?: "column" | "canvas";
  layer?: number;
  opacity?: number;
  hideDesktop?: boolean;
  hideMobile?: boolean;
  mobileLayout?: Dock;
  motionDuration?: number;
  motionDelay?: number;
  motionEasing?: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear";
  motionRepeat?: number;
};
const clamp = (n: number | undefined, f: number, min: number, max: number) =>
  Number.isFinite(n) ? Math.max(min, Math.min(max, n!)) : f;
function dock(d: Dock) {
  const x = clamp(d.posX, 5, -100, 100),
    y = clamp(d.posY, 12, -5000, 5000);
  return {
    left:
      d.anchorX === "right"
        ? "auto"
        : d.anchorX === "center"
          ? `calc(50% + ${x}%)`
          : `${x}%`,
    right: d.anchorX === "right" ? `${x}%` : "auto",
    top:
      d.anchorY === "bottom"
        ? "auto"
        : d.anchorY === "center"
          ? `calc(50% + ${y}px)`
          : `${y}px`,
    bottom: d.anchorY === "bottom" ? `${y}px` : "auto",
    translate: `${d.anchorX === "center" ? "-50%" : "0"} ${d.anchorY === "center" ? "-50%" : "0"}`,
    width: `${clamp(d.boxWidth, 60, 5, 100)}%`,
    height: d.boxHeight ? `${clamp(d.boxHeight, 0, 30, 5000)}px` : "auto",
    rotate: `${clamp(d.rotation, 0, -180, 180)}deg`,
  };
}
export function designerStyle(feature: DesignerLayout): CSSProperties {
  const desktop = dock(feature),
    mobile = dock({ ...feature, ...feature.mobileLayout });
  const vars: Record<string, string | number> = {
    "--designer-layer": clamp(feature.layer, 4, 0, 99),
    "--designer-opacity": clamp(feature.opacity, 100, 0, 100) / 100,
  };
  // 22 Nov — timing hanya dikirim bila diisi (lihat .motion-custom).
  if (feature.motionDuration !== undefined)
    vars["--motion-duration"] = `${clamp(feature.motionDuration, 700, 100, 5000)}ms`;
  if (feature.motionDelay !== undefined)
    vars["--motion-delay"] = `${clamp(feature.motionDelay, 0, 0, 5000)}ms`;
  if (feature.motionEasing) vars["--motion-easing"] = feature.motionEasing;
  if (feature.motionRepeat !== undefined)
    vars["--motion-repeat"] = clamp(feature.motionRepeat, 1, 1, 10);
  if (feature.freePosition)
    for (const key of Object.keys(desktop) as (keyof typeof desktop)[]) {
      vars[`--d-${key}`] = desktop[key];
      vars[`--m-${key}`] = mobile[key];
    }
  return vars as CSSProperties;
}

/** 22 Nov — Web Designer mengisi timing animasi sendiri. */
export function hasCustomMotion(feature: DesignerLayout) {
  return (
    feature.motionDuration !== undefined ||
    Boolean(feature.motionEasing) ||
    feature.motionRepeat !== undefined
  );
}
