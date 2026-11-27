import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  ChevronDown,
  Palette,
  Heart,
  MapPin,
  MousePointer2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Template, ArticleItem, View } from "../App";
import { useSiteLang } from "../i18n";
import LandingCarousel from "./LandingCarousel";
import weddingHero from "../assets/wedding-home.webp";
import softBloomPreview from "../assets/carousel/soft-bloom.webp";
import sundaPreview from "../assets/carousel/sunda-02.webp";
import "./LandingPage.css";

/** TC-246 — teks landing page dalam dua bahasa. Pilihan tersimpan per
 *  pengunjung (localStorage) dan ditandai pada <html lang>. */
export type LandingLang = "id" | "en";
const COPY = {
  id: {
    heroLines: ["Sebuah janji.", "Sebuah cerita.", "Sebuah undangan."],
    heroBody:
      "Hadirkan hari istimewa kalian dalam undangan digital yang personal. Pilih desain, ceritakan kisahnya, dan sambut setiap tamu dengan hangat.",
    heroCta: "Pilih desain kalian",
    heroHow: "Lihat cara kerjanya",
    heroArt: "Pasangan pengantin Indonesia tertawa bersama di hari pernikahan mereka",
    strip: ["Cerita kalian, satu tautan.", "RSVP online", "Galeri kenangan", "Lokasi acara", "Musik pilihan"],
    all: "Semua",
    featEyebrow: "INDAH DILIHAT. MUDAH DIGUNAKAN.",
    featTitle: ["Detail kecil.", "Arti yang besar."],
    featBody:
      "Semua informasi penting dalam satu tempat, agar kalian bisa lebih menikmati perjalanan menuju hari bahagia.",
    features: [
      ["Sesuai karakter kalian", "Personalisasi warna, foto, tipografi, dan animasi."],
      ["Lebih dekat dengan tamu", "Terima konfirmasi kehadiran dan ucapan secara online."],
      ["Informasi yang mudah ditemukan", "Bagikan waktu dan lokasi acara tanpa pesan berulang."],
      ["Didampingi dari awal", "CS dan Web Designer membantu proses personalisasi."],
    ],
    howEyebrow: "DARI IDE MENJADI UNDANGAN",
    howTitle: ["Tiga langkah.", "Satu awal yang indah."],
    steps: [
      ["Pilih desain", "Lihat koleksi dan preview. Pilih desain yang paling dekat dengan cerita kalian."],
      ["Personalisasi bersama", "Lengkapi pemesanan, lalu sesuaikan isi dan tampilan bersama tim."],
      ["Bagikan kebahagiaan", "Periksa hasilnya di desktop dan mobile, lalu bagikan tautan undangan."],
    ],
    faqEyebrow: "SEBELUM MEMULAI",
    faqTitle: ["Ada yang ingin", "kalian tanyakan?"],
    faq: [
      ["Apakah perlu bisa coding?", "Tidak. Konten dan desain dapat diatur melalui editor visual. Tim CS dan Web Designer juga mendampingi prosesnya."],
      ["Bisa melihat desain sebelum memesan?", "Bisa. Buka desain yang kalian sukai untuk melihat preview, informasi template, dan harga."],
      ["Apakah undangan bisa dibuka dari HP?", "Undangan dapat dibuka melalui browser. Gunakan preview mobile sebelum publikasi untuk memeriksa susunan setiap elemen."],
      ["Apa yang perlu disiapkan?", "Nama pasangan, waktu dan lokasi acara, foto pilihan, serta cerita atau informasi lain yang ingin dibagikan."],
    ],
    jrEyebrow: "JURNAL IKRARKU",
    jrTitle: ["Inspirasi untuk", "hari istimewa kalian."],
    jrFilter: "Filter kategori jurnal",
    jrEmpty: "Belum ada artikel pada kategori ini.",
    jrPrev: "Artikel sebelumnya",
    jrNext: "Artikel berikutnya",
    jrGroup: "Ke kelompok artikel",
    jrAll: "Lihat semua Jurnal ikrarku",
    jrRead: "Baca cerita",
    finalTitle: ["Siap merangkai", "cerita kalian?"],
    finalCta: "Temukan desain pilihan",
    footer: "Undangan digital. Cerita yang personal.",
  },
  en: {
    heroLines: ["A promise.", "A story.", "An invitation."],
    heroBody:
      "Bring your special day to life with a personal digital invitation. Choose a design, tell your story, and welcome every guest warmly.",
    heroCta: "Choose your design",
    heroHow: "See how it works",
    heroArt: "Indonesian newlyweds laughing together on their wedding day",
    strip: ["Your story, one link.", "Online RSVP", "Memory gallery", "Event location", "Your music"],
    all: "All",
    tplOffline: "The catalog could not be loaded. Please reload or try again shortly.",
    featEyebrow: "BEAUTIFUL TO SEE. EASY TO USE.",
    featTitle: ["Small details.", "Big meaning."],
    featBody:
      "Every important detail in one place, so you can enjoy the journey to your big day.",
    features: [
      ["True to your character", "Personalize colors, photos, typography, and animation."],
      ["Closer to your guests", "Receive RSVPs and wishes online."],
      ["Information that's easy to find", "Share the time and venue without repeating messages."],
      ["Supported from the start", "Our CS and Web Designers help you personalize it."],
    ],
    howEyebrow: "FROM IDEA TO INVITATION",
    howTitle: ["Three steps.", "One beautiful beginning."],
    steps: [
      ["Choose a design", "Browse the collection and previews. Pick the design closest to your story."],
      ["Personalize together", "Complete your order, then adjust content and look with our team."],
      ["Share the joy", "Check the result on desktop and mobile, then share your invitation link."],
    ],
    faqEyebrow: "BEFORE YOU START",
    faqTitle: ["Anything you'd", "like to ask?"],
    faq: [
      ["Do I need to know how to code?", "No. Content and design are managed in a visual editor, and our CS and Web Designer team guide you through it."],
      ["Can I see a design before ordering?", "Yes. Open any design you like to see its preview, template details, and price."],
      ["Can the invitation be opened on a phone?", "The invitation opens in any browser. Use the mobile preview before publishing to check every element."],
      ["What do I need to prepare?", "The couple's names, event time and venue, favorite photos, and any story or details you want to share."],
    ],
    jrEyebrow: "IKRARKU JOURNAL",
    jrTitle: ["Inspiration for", "your special day."],
    jrFilter: "Filter journal categories",
    jrEmpty: "No articles in this category yet.",
    jrPrev: "Previous articles",
    jrNext: "Next articles",
    jrGroup: "Go to article group",
    jrAll: "See all ikrarku Journal",
    jrRead: "Read story",
    finalTitle: ["Ready to tell", "your story?"],
    finalCta: "Find your design",
    footer: "Digital invitations. Personal stories.",
  },
};
type Copy = (typeof COPY)["id"];
type Props = {
  setView: (view: View) => void;
  templates: Template[];
  articles: ArticleItem[];
  onTemplate: (template: Template, preview?: boolean) => void;
  renderPreview: (template: Template) => ReactNode;
  onArticle: (article: ArticleItem) => void;
  scrollTarget?: string | null;
  onScrolled?: () => void;
  databaseOnline: boolean;
  /** QA 15 TC-354 — footer lengkap (navigasi, bantuan, legal, kontak). */
  renderFooter?: (scrollTo: (id: string) => void) => ReactNode;
};
// Kartu artikel dipakai bersama oleh landing dan halaman Jurnal supaya
// layout-nya seragam berapa pun panjang judulnya.
export function JournalCard({
  article,
  onOpen,
  readLabel = "Baca cerita",
}: {
  article: ArticleItem;
  onOpen: (article: ArticleItem) => void;
  readLabel?: string;
}) {
  return (
    /* SEO — dulu ini <button>, jadi crawler tidak melihat tautan apa pun ke
       artikel dan pengguna tidak bisa klik-tengah / salin alamat. Sekarang
       anchor sungguhan ke /articles/<slug>; navigasi tetap client-side
       kecuali pengguna menahan modifier atau klik tengah. Daftar jurnalnya
       sendiri tetap di /jurnal — lihat tautan "Lihat semua" di bawah. */
    <a
      className="ikr-journal-card"
      href={`/articles/${encodeURIComponent(article.slug)}`}
      onClick={(event) => {
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        event.preventDefault();
        onOpen(article);
      }}
    >
      <span className="ikr-journal-thumb">
        {article.coverUrl ? (
          <img
            loading="lazy"
            decoding="async"
            src={article.coverUrl}
            alt=""
            width="400"
            height="240"
          />
        ) : (
          <em>{article.category}</em>
        )}
      </span>
      <span className="ikr-journal-body">
        <small>
          {article.category}
          {article.langFallback && (
            <em className="ikr-lang-badge" title="Available in Indonesian only">
              ID
            </em>
          )}
        </small>
        <h3 lang={article.langFallback ? "id" : undefined}>{article.title}</h3>
        <p>{article.excerpt}</p>
      </span>
      <span className="ikr-journal-foot">
        {readLabel} <ArrowRight size={16} />
      </span>
    </a>
  );
}

// Geser artikel dengan scrolling bawaan browser dan snap per kartu.
function JournalCarousel({
  articles,
  onArticle,
  onSeeAll,
  tx,
}: {
  articles: ArticleItem[];
  onArticle: (article: ArticleItem) => void;
  onSeeAll: () => void;
  tx: Copy;
}) {
  const published = useMemo(
    () => articles.filter((item) => item.status === "Published"),
    [articles],
  );
  const categories = useMemo(
    () => [ALL, ...new Set(published.map((item) => item.category))],
    [published],
  );
  const [category, setCategory] = useState(ALL);
  const visible = useMemo(
    () =>
      (category === ALL
        ? published
        : published.filter((item) => item.category === category)
      ).slice(0, 10),
    [published, category],
  );
  const viewport = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(0);
  const [perView, setPerView] = useState(3);
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 900px)");
    const update = () => setPerView(mobile.matches ? 1 : 3);
    update();
    mobile.addEventListener("change", update);
    return () => mobile.removeEventListener("change", update);
  }, []);

  const maxStart = Math.max(0, visible.length - perView);
  const safeStart = Math.min(start, maxStart);
  const move = (next: number) => {
    const rail = viewport.current;
    const card = rail?.querySelectorAll(".ikr-journal-card")[next];
    if (!rail || !card) return;
    rail.scrollTo({
      left: rail.scrollLeft + card.getBoundingClientRect().left - rail.getBoundingClientRect().left,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };
  const syncPosition = () => {
    const rail = viewport.current;
    if (!rail) return;
    const cards = rail.querySelectorAll(".ikr-journal-card");
    if (cards.length < 2) return;
    const distance = cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
    if (distance) setStart(Math.max(0, Math.min(maxStart, Math.round(rail.scrollLeft / distance))));
  };
  const changeCategory = (next: string) => {
    if (next === category) return;
    viewport.current?.scrollTo({ left: 0, behavior: "instant" });
    setStart(0);
    setCategory(next);
  };
  if (!visible.length)
    return (
      <div className="ikr-journal-empty">
        {tx.jrEmpty}
      </div>
    );
  return (
    <>
      {/* Gaya tombol disamakan dengan filter pada bagian desain undangan. */}
      <div className="ikr-filters" aria-label={tx.jrFilter}>
        {categories.map((item) => (
          <button
            key={item}
            aria-pressed={category === item}
            onClick={() => changeCategory(item)}
          >
            {item === ALL ? tx.all : item}
          </button>
        ))}
      </div>
      <div className="ikr-journal-stage">
        {visible.length > perView && (
          <button
            className="ikr-journal-nav prev"
            aria-label={tx.jrPrev}
            disabled={safeStart === 0}
            onClick={() => move(safeStart - 1)}
          >
            <ChevronLeft size={18} />
          </button>
        )}
        <div className="ikr-journal-viewport" ref={viewport} onScroll={syncPosition}>
          <div className="ikr-journal-track">
            {visible.map((article) => (
              <JournalCard
                key={article.id}
                article={article}
                onOpen={onArticle}
                readLabel={tx.jrRead}
              />
            ))}
          </div>
        </div>
        {visible.length > perView && (
          <button
            className="ikr-journal-nav next"
            aria-label={tx.jrNext}
            disabled={safeStart === maxStart}
            onClick={() => move(safeStart + 1)}
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>
      {visible.length > perView && (
        <div className="ikr-journal-dots">
          {Array.from({ length: maxStart + 1 }).map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`${tx.jrGroup} ${index + 1}`}
              className={index === safeStart ? "is-active" : ""}
              aria-current={index === safeStart ? "true" : undefined}
              onClick={() => move(index)}
            />
          ))}
        </div>
      )}
      <div className="ikr-journal-more">
        <button className="ikr-btn" onClick={onSeeAll}>
          {tx.jrAll} <ArrowRight size={16} />
        </button>
      </div>
    </>
  );
}

/** Nilai internal kategori "semua"; labelnya diterjemahkan saat render. */
const ALL = "Semua";
const scrollToSection = (id: string) =>
  document.getElementById(id)?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
  });
export default function LandingPage({
  setView,
  templates,
  articles,
  onTemplate,
  onArticle,
  scrollTarget,
  onScrolled,
  databaseOnline,
  renderFooter,
  renderPreview,
}: Props) {
  const [heroVisible, setHeroVisible] = useState(false);
  const hero = useRef<HTMLElement>(null);
  // QA 15 — bahasa dipakai bersama seluruh situs (src/i18n.ts).
  const [lang] = useSiteLang();
  const tx = COPY[lang];
  const root = useRef<HTMLDivElement>(null);
  const hasArticles = articles.length > 0;
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window) || !hero.current)
      return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setHeroVisible(true);
      observer.disconnect();
    }, { threshold: 0.05 });
    observer.observe(hero.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const section = window.location.hash.slice(1);
    if (section) scrollToSection(section);
  }, []);
  useEffect(() => {
    if (scrollTarget) {
      scrollToSection(scrollTarget);
      onScrolled?.();
    }
  }, [scrollTarget, onScrolled]);
  useLayoutEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            observer.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px 40px", threshold: 0 },
    );
    root.current?.querySelectorAll("[data-reveal]").forEach((el) => {
      if (!el.classList.contains("is-visible")) {
        el.classList.add("will-reveal");
        observer.observe(el);
      }
    });
    return () => observer.disconnect();
  }, [hasArticles, templates.length]);
  return (
    <div className="ikr-landing" ref={root}>
      <main id="main-content">
        <section ref={hero} className={`ikr-hero${heroVisible ? " is-introduced" : ""}`}>
          <div className="ikr-hero-copy">
            <h1>
              <span>{tx.heroLines[0]}</span>{" "}
              <span>{tx.heroLines[1]}</span>{" "}
              <span><em>{tx.heroLines[2]}</em></span>
            </h1>
            <p>{tx.heroBody}</p>
            <div className="ikr-actions">
              <button className="ikr-btn" onClick={() => scrollToSection("templates")}>
                {tx.heroCta} <ArrowRight size={18} />
              </button>
              <button
                className="ikr-text-button"
                onClick={() => scrollToSection("how-it-works")}
              >
                {tx.heroHow} <ChevronDown size={16} />
              </button>
            </div>
          </div>
          <div className="ikr-hero-art">
            <img src={weddingHero} alt={tx.heroArt} fetchPriority="high" width={1122} height={1402} />
          </div>
        </section>
        <div className="ikr-benefit-strip" data-reveal>
          <span>{tx.strip[0]}</span>
          <p>{tx.strip[1]}</p>
          <i />
          <p>{tx.strip[2]}</p>
          <i />
          <p>{tx.strip[3]}</p>
          <i />
          <p>{tx.strip[4]}</p>
        </div>
        <LandingCarousel
          templates={templates} lang={lang} databaseOnline={databaseOnline}
          onTemplate={onTemplate} renderPreview={renderPreview} onSeeAll={() => setView("designs")}
        />
        <section id="features" className="ikr-features" data-reveal>
          <div>
            <div className="ikr-feature-lead">
              <span className="ikr-eyebrow">{tx.featEyebrow}</span>
              <h2>
                {tx.featTitle[0]}
                <br />
                <em>{tx.featTitle[1]}</em>
              </h2>
              <p>{tx.featBody}</p>
            </div>
            <div className="ikr-feature-grid">
              {[Palette, Heart, MapPin, MousePointer2].map((Icon, index) => {
                const I = Icon as typeof Heart;
                const [title, description] = tx.features[index];
                return (
                  <article key={index}>
                    <I size={23} />
                    <h3>{String(title)}</h3>
                    <p>{String(description)}</p>
                  </article>
                );
              })}
            </div>
          </div>
          <figure className="ikr-feature-preview">
            <div className="ikr-feature-screens">
              <img src={sundaPreview} alt="Sunda 02" width={392} height={830} loading="lazy" decoding="async" />
              <img src={softBloomPreview} alt="Soft Bloom" width={392} height={830} loading="lazy" decoding="async" />
            </div>
            <figcaption>
              {lang === "id" ? "Preview undangan dari Canvas Ikrarku" : "Invitation previews from Ikrarku Canvas"}
            </figcaption>
          </figure>
        </section>
        <section id="how-it-works" className="ikr-section" data-reveal>
          <span className="ikr-eyebrow">{tx.howEyebrow}</span>
          <h2>
            {tx.howTitle[0]}
            <br />
            <em>{tx.howTitle[1]}</em>
          </h2>
          <div className="ikr-steps">
            {tx.steps.map(([t, d], index) => [`0${index + 1}`, t, d]).map(([n, t, d]) => (
              <article key={n}>
                <span>{n}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="faq" className="ikr-faq ikr-section" data-reveal>
          <div>
            <span className="ikr-eyebrow">{tx.faqEyebrow}</span>
            <h2>
              {tx.faqTitle[0]}
              <br />
              <em>{tx.faqTitle[1]}</em>
            </h2>
          </div>
          <div>
            {tx.faq.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <ChevronDown size={18} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        {hasArticles && (
          <section id="articles" className="ikr-section" data-reveal>
            <span className="ikr-eyebrow">{tx.jrEyebrow}</span>
            <h2>
              {tx.jrTitle[0]}
              <br />
              <em>{tx.jrTitle[1]}</em>
            </h2>
            <JournalCarousel
              articles={articles}
              onArticle={onArticle}
              onSeeAll={() => setView("journal")}
              tx={tx}
            />
          </section>
        )}
        <section className="ikr-final" data-reveal>
          <span className="ikr-eyebrow">YOUR STORY STARTS HERE</span>
          <h2>
            {tx.finalTitle[0]}
            <br />
            <em>{tx.finalTitle[1]}</em>
          </h2>
          <button className="ikr-btn" onClick={() => scrollToSection("templates")}>
            {tx.finalCta} <ArrowRight size={18} />
          </button>
        </section>
      </main>
      {renderFooter ? (
        renderFooter(scrollToSection)
      ) : (
        <footer className="ikr-footer">
          <img
            src="/brand/ikrarku-logo.png"
            alt="ikrarku"
            width="130"
            height="39"
          />
          <p>{tx.footer}</p>
          <small>© {new Date().getFullYear()} ikrarku</small>
        </footer>
      )}
    </div>
  );
}
