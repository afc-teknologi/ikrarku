import { useState } from "react";
import type { DesignerLayout, Dock } from "./designerLayout";
type Props = {
  feature: DesignerLayout & { id: string; type: string };
  update: (patch: Partial<DesignerLayout>) => void;
};
export default function DesignerControls({ feature, update }: Props) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const layout = {
    ...feature,
    ...(device === "mobile" ? feature.mobileLayout : {}),
  };
  const change = (patch: Partial<Dock>) =>
    update(
      device === "mobile"
        ? { mobileLayout: { ...feature.mobileLayout, ...patch } }
        : patch,
    );
  const number = (
    label: string,
    key: keyof Dock,
    value: number,
    min: number,
    max: number,
    step = 1,
  ) => (
    <label>
      {label}
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) =>
          change({
            [key]: Math.min(max, Math.max(min, Number(e.target.value))),
          })
        }
      />
    </label>
  );
  const canPosition = !["sound", "invitation-cover"].includes(feature.type);
  if (!canPosition) return null;
  return (
    <div className="free-position-controls">
      <div className="group-heading">
        <strong>Layout & motion</strong>
      </div>
      {canPosition && (
        <>
          <label>
            <input
              type="checkbox"
              checked={!!feature.freePosition}
              onChange={(e) => update({ freePosition: e.target.checked })}
            />{" "}
            Posisi bebas
          </label>
          {feature.freePosition && (
            <>
              <label>
                Area posisi
                <select
                  value={feature.positionScope || "column"}
                  onChange={(e) =>
                    update({
                      positionScope: e.target.value as "canvas" | "column",
                    })
                  }
                >
                  <option value="column">Di dalam column</option>
                  <option value="canvas">Seluruh canvas</option>
                </select>
              </label>
              <label>
                Atur tampilan
                <select
                  value={device}
                  onChange={(e) =>
                    setDevice(e.target.value as "desktop" | "mobile")
                  }
                >
                  <option value="desktop">Desktop (default)</option>
                  <option value="mobile">Mobile (override)</option>
                </select>
              </label>
              <p className="layout-help">
                Dock ke sisi canvas. Mobile mewarisi desktop sampai Anda
                mengubah nilainya.
              </p>
              <div className="designer-docks" aria-label="Docking posisi">
                {(["top", "center", "bottom"] as const).flatMap(
                  (vertical, row) =>
                    (["left", "center", "right"] as const).map(
                      (horizontal, col) => (
                        <button
                          key={`${vertical}-${horizontal}`}
                          aria-label={`Dock ${vertical} ${horizontal}`}
                          aria-pressed={
                            (layout.anchorX || "left") === horizontal &&
                            (layout.anchorY || "top") === vertical
                          }
                          onClick={() =>
                            change({
                              anchorX: horizontal,
                              anchorY: vertical,
                              posX: 0,
                              posY: 0,
                            })
                          }
                        >
                          {
                            [
                              ["↖", "↑", "↗"],
                              ["←", "·", "→"],
                              ["↙", "↓", "↘"],
                            ][row][col]
                          }
                        </button>
                      ),
                    ),
                )}
              </div>
              <div className="designer-grid">
                {number(
                  "Offset X (%)",
                  "posX",
                  layout.posX ?? 5,
                  -100,
                  100,
                  0.5,
                )}
                {number(
                  "Offset Y (px)",
                  "posY",
                  layout.posY ?? 12,
                  -5000,
                  5000,
                )}
                {number(
                  "Lebar (%)",
                  "boxWidth",
                  layout.boxWidth ?? 60,
                  5,
                  100,
                  0.5,
                )}
                {number(
                  "Tinggi (0 = auto)",
                  "boxHeight",
                  layout.boxHeight ?? 0,
                  0,
                  5000,
                )}
                {number(
                  "Rotasi (derajat)",
                  "rotation",
                  layout.rotation ?? 0,
                  -180,
                  180,
                )}
                <label>
                  Layer
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={feature.layer ?? 4}
                    onChange={(e) =>
                      update({
                        layer: Math.max(
                          0,
                          Math.min(99, Number(e.target.value)),
                        ),
                      })
                    }
                  />
                </label>
              </div>
              {device === "mobile" && (
                <button
                  className="secondary-btn"
                  onClick={() => update({ mobileLayout: undefined })}
                >
                  Reset ke desktop
                </button>
              )}
            </>
          )}
        </>
      )}
      <div className="designer-grid">
        <label>
          Opacity (%)
          <input
            type="number"
            min="0"
            max="100"
            value={feature.opacity ?? 100}
            onChange={(e) =>
              update({
                opacity: Math.max(0, Math.min(100, Number(e.target.value))),
              })
            }
          />
        </label>
      </div>
      <label>
        <input
          type="checkbox"
          checked={!!feature.hideDesktop}
          onChange={(e) => update({ hideDesktop: e.target.checked })}
        />{" "}
        Sembunyikan di desktop
      </label>
      <label>
        <input
          type="checkbox"
          checked={!!feature.hideMobile}
          onChange={(e) => update({ hideMobile: e.target.checked })}
        />{" "}
        Sembunyikan di mobile
      </label>
      <div className="designer-motion">
        <strong>Timing animasi</strong>
        <p className="layout-help">
          Pilih efek pada tab Advanced, lalu atur timing di sini. Reduced motion
          mengikuti preferensi perangkat tamu.
        </p>
        <div className="designer-grid">
          {(
            [
              ["Durasi (ms)", "motionDuration", 700, 100, 5000],
              ["Delay (ms)", "motionDelay", 0, 0, 5000],
              ["Pengulangan", "motionRepeat", 1, 1, 10],
            ] as const
          ).map(([label, key, fallback, min, max]) => (
            <label key={key}>
              {label}
              <input
                type="number"
                value={feature[key] ?? fallback}
                min={min}
                max={max}
                onChange={(e) =>
                  update({
                    [key]: Math.max(min, Math.min(max, Number(e.target.value))),
                  })
                }
              />
            </label>
          ))}
          <label>
            Easing
            <select
              value={feature.motionEasing || "ease-out"}
              onChange={(e) =>
                update({
                  motionEasing: e.target
                    .value as DesignerLayout["motionEasing"],
                })
              }
            >
              {["ease", "ease-in", "ease-out", "ease-in-out", "linear"].map(
                (v) => (
                  <option key={v}>{v}</option>
                ),
              )}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
