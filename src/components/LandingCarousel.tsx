import { useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { Template } from "../App";
import { ALL_TEMPLATE_CATEGORIES, matchesTemplateCategory, templateCategories } from "../templateCatalog";
import "./LandingCarousel.css";

const featured = ["Soft Bloom", "Sunda 02", "Lumiere"];
const portraits = import.meta.glob<string>("../assets/carousel/*.webp", { eager: true, import: "default" });
const portraitBySample: Record<string, string> = {
  "/uploads/media_1795360584461_02da08bb_Ikrarku_Base_01_TriScreen_Showcase.png": "soft-bloom",
  "/uploads/media_1795361430871_06618d50_Sample_Thumbnail_Sunda_02.png": "sunda-02",
  "/uploads/media_1795360008637_03c1df30_Sample_Thumbnail_Lumaire.png": "lumiere",
  "/uploads/media_1795360078293_3eb571a2_Sample_Thumbnail_Velvet_Bloom.png": "velvet-bloom",
  "/uploads/media_1795360602923_e98d961a_Sample_Thumbnail_Sunda_01.png": "sunda-01",
  "/uploads/media_1795360693701_f66b96a5_Sample_Thumbnail_Jawa_01.png": "jawa-01",
};
const currency = new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0,
});

function artwork(template: Template) {
  const source = template.sampleImage || template.preview;
  if (!source) return;
  const sample = Object.keys(portraitBySample).find(path => source.endsWith(path));
  const portrait = sample && portraits[`../assets/carousel/${portraitBySample[sample]}.webp`];
  return portrait || source;
}

export default function LandingCarousel({
  templates, lang, databaseOnline, onTemplate, onSeeAll, renderPreview,
}: {
  templates: Template[];
  lang: "id" | "en";
  databaseOnline: boolean;
  onTemplate: (template: Template, preview?: boolean) => void;
  onSeeAll: () => void;
  renderPreview: (template: Template) => ReactNode;
}) {
  const t = (id: string, en: string) => lang === "id" ? id : en;
  const [style, setStyle] = useState(ALL_TEMPLATE_CATEGORIES);
  const [free, setFree] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const gesture = useRef<{ id: number; x: number; y: number; dragging: boolean } | null>(null);
  const suppressClick = useRef(false);
  const stage = useRef<HTMLDivElement>(null);
  const categories = templateCategories(templates).filter(item => item !== "Free");
  const rank = (item: Template) => {
    const index = featured.indexOf(item.name);
    return item.recommended ? -1 : index < 0 ? featured.length : index;
  };
  const visible = templates.filter(item => matchesTemplateCategory(item, style) && (!free || item.isFree))
    .sort((a, b) => rank(a) - rank(b));
  const index = Math.max(0, visible.findIndex(item => item.id === selectedId));
  const active = visible[index];
  const oldPrice = active?.originalPrice ?? 0;
  const price = active?.price ?? 0;
  const discount = oldPrice > price && price >= 0 && !active?.isFree
    ? Math.round((1 - price / oldPrice) * 100) : 0;

  useLayoutEffect(() => {
    stage.current?.querySelectorAll<HTMLElement>(".ikr-carousel-poster").forEach(card => {
      const offset = Number(card.dataset.offset);
      const previous = Number(card.dataset.previousOffset ?? offset);
      card.classList.toggle("is-wrapping", Math.abs(offset - previous) > 2);
      card.dataset.previousOffset = String(offset);
    });
  });
  const select = (next: number) => {
    const item = visible[(next + visible.length) % visible.length];
    if (item) setSelectedId(item.id);
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    const x = event.clientX - start.x;
    const y = event.clientY - start.y;
    if (!start.dragging) {
      if (Math.abs(y) > 8 && Math.abs(y) >= Math.abs(x)) {
        gesture.current = null;
        return;
      }
      if (Math.abs(x) < 8 || Math.abs(x) < Math.abs(y) * 1.25) return;
      start.dragging = true;
      suppressClick.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.dataset.dragging = "true";
    }
    const stageWidth = event.currentTarget.clientWidth;
    const offset = Math.max(-stageWidth * .28, Math.min(stageWidth * .28, x * .82));
    event.currentTarget.style.setProperty("--drag-x", `${offset}px`);
  };
  const finish = (event: PointerEvent<HTMLDivElement>) => {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    gesture.current = null;
    delete event.currentTarget.dataset.dragging;
    event.currentTarget.style.removeProperty("--drag-x");
    if (event.type !== "pointerup" || !start.dragging) return;
    const x = event.clientX - start.x;
    const threshold = Math.min(64, event.currentTarget.clientWidth * .11);
    if (Math.abs(x) >= threshold) select(index + (x < 0 ? 1 : -1));
  };
  const filter = (next: string) => {
    setStyle(next);
    setSelectedId("");
  };
  return (
    <section id="templates" className="ikr-carousel" aria-labelledby="ikr-carousel-heading">
      <div className="ikr-carousel-intro" data-reveal>
        <h2 id="ikr-carousel-heading">
          {t("Satu undangan.", "One invitation.")} <em>{t("Satu kesan pertama.", "One first impression.")}</em>
        </h2>
        <p>{t("Temukan desain undangan pernikahan yang terasa seperti kalian.", "Find a wedding invitation design that feels like you.")}</p>
        <div className="ikr-carousel-toolbar">
          <div className="ikr-carousel-filters" role="group" aria-label={t("Gaya undangan", "Invitation style")}>
            {categories.map(item => <button key={item} type="button" aria-pressed={style === item}
              onClick={() => filter(item)}>{item === ALL_TEMPLATE_CATEGORIES ? t("Semua gaya", "All styles") : item}</button>)}
          </div>
          <select aria-label={t("Gaya undangan", "Invitation style")} value={style} onChange={event => filter(event.target.value)}>
            {categories.map(item => <option key={item} value={item}>{item === ALL_TEMPLATE_CATEGORIES ? t("Semua gaya", "All styles") : item}</option>)}
          </select>
          <button type="button" aria-pressed={free} onClick={() => {setFree(!free);setSelectedId("");}}>{t("Gratis saja", "Free only")}</button>
        </div>
      </div>
      {active ? (
        <div role="region" aria-roledescription={t("karusel", "carousel")} aria-label={t("Galeri desain", "Design gallery")} data-reveal
          onKeyDown={event => {
            if (!["ArrowLeft", "ArrowRight"].includes(event.key) || visible.length < 2) return;
            event.preventDefault();
            const next = (index + (event.key === "ArrowRight" ? 1 : -1) + visible.length) % visible.length;
            const focusCard = stage.current?.contains(document.activeElement);
            select(next);
            if (focusCard) stage.current?.querySelectorAll("button")[next]?.focus({ preventScroll: true });
          }}>
          <div className="ikr-carousel-stage" ref={stage} style={{"--glow": active.accent || "#a77188"} as CSSProperties}
            onPointerDown={event => {
              if (!event.isPrimary || event.button !== 0) return;
              suppressClick.current = false;
              if (visible.length > 1) {
                gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, dragging: false };
              }
            }}
            onPointerMove={move}
            onPointerCancel={finish}
            onLostPointerCapture={event => {
              if (event.target === event.currentTarget) finish(event);
            }}
            onPointerLeave={event => {
              if (!gesture.current?.dragging && event.pointerType === "mouse") finish(event);
            }}
            onPointerUp={finish}>
            <div className="ikr-carousel-arc" aria-hidden="true" />
            <div className="ikr-carousel-deck">
              {visible.map((item, i) => {
                let offset = i - index;
                if (offset > visible.length / 2) offset -= visible.length;
                if (offset < -visible.length / 2) offset += visible.length;
                const distance = Math.abs(offset);
                const src = artwork(item);
                return <button key={item.id} type="button" className="ikr-carousel-poster"
                  data-distance={Math.min(3, distance)} data-offset={offset}
                  aria-current={distance === 0 ? "true" : undefined}
                  aria-hidden={distance > 2 || undefined}
                  tabIndex={distance === 0 ? 0 : -1}
                  aria-label={`${distance === 0 ? t("Pratinjau", "Preview") : t("Fokuskan", "Focus on")} ${item.name}`}
                  style={{
                    "--x": `calc(var(--step) * ${offset})`, "--y": `${21 * distance + 10 * distance ** 2}px`,
                    "--rotation": `${Math.max(-25, Math.min(25, offset * 12))}deg`, "--scale": Math.max(.57, 1 - .15 * distance),
                    "--tone": item.bg, "--depth": 10 - distance,
                  } as CSSProperties}
                  onClick={event => {
                    if (event.detail && suppressClick.current) return;
                    if (distance === 0) onTemplate(item, true);
                    else select(i);
                  }}>
                  {src ? <img src={src} alt="" draggable={false} loading="lazy" /> : item.canvasSections?.length && distance < 3
                    ? <div className="ikr-carousel-rendered">{renderPreview(item)}</div> : <span>{item.name}</span>}
                </button>;
              })}
            </div>
          </div>
          <div className="ikr-carousel-panel">
            <button className="ikr-carousel-arrow previous" type="button" aria-label={t("Desain sebelumnya", "Previous design")} disabled={visible.length < 2} onClick={() => select(index - 1)}><ChevronLeft /></button>
            <button className="ikr-carousel-arrow next" type="button" aria-label={t("Desain berikutnya", "Next design")} disabled={visible.length < 2} onClick={() => select(index + 1)}><ChevronRight /></button>
            <div className="ikr-carousel-label">{[active.category, active.package].filter(Boolean).join(" · ")}</div>
            <h3>{active.name}</h3>
            <div className="ikr-carousel-price">
              <strong>{active.isFree ? t("Gratis", "Free") : currency.format(price)}</strong>
              {discount > 0 && <><s>{currency.format(oldPrice)}</s><span className="ikr-carousel-sale">{t("Diskon", "Save")} {discount}%</span></>}
            </div>
            {(active.recommended || active.isNew) && <div className="ikr-carousel-badges">
              {active.recommended && <span><Star size={13} /> {t("Rekomendasi", "Recommended")}</span>}
              {active.isNew && <span>{t("Baru", "New")}</span>}
            </div>}
            <div className="ikr-carousel-actions">
              <button type="button" className="ikr-carousel-primary" onClick={() => onTemplate(active, true)}>{t("Pratinjau desain", "Preview design")} <ArrowRight size={15} /></button>
              <button type="button" onClick={() => onTemplate(active)}>{t("Detail", "Details")}</button>
            </div>
            <div className="ikr-carousel-position" role="status">{active.name} · {index + 1} {t("dari", "of")} {visible.length}</div>
            {visible.length > 1 && <div className="ikr-carousel-stepper" role="group" aria-label={t("Pilih desain", "Choose design")}>
              {visible.map((item, i) => <button key={item.id} type="button" aria-label={`${t("Tampilkan", "Show")} ${item.name}`}
                aria-current={i === index ? "true" : undefined} onClick={() => select(i)} />)}
            </div>}
          </div>
        </div>
      ) : <p className="ikr-carousel-empty" role="status">{databaseOnline
        ? t("Belum ada desain yang cocok dengan filter ini.", "No designs match these filters.")
        : t("Katalog belum dapat dimuat.", "The catalog could not be loaded.")}</p>}
      {templates.length > 0 && <button className="ikr-carousel-all" data-reveal type="button" onClick={onSeeAll}>{t("Lihat semua desain", "See all designs")} <ArrowRight size={16} /></button>}
    </section>
  );
}
