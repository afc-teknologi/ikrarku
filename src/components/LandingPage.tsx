import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  Palette,
  Heart,
  MapPin,
  MousePointer2,
  ChevronLeft,
  ChevronRight,
  Star,
  LogIn,
  UserRound,
  Globe,
} from "lucide-react";
import type { Template, ArticleItem, View } from "../App";
import "./LandingPage.css";

/** TC-246 — teks landing page dalam dua bahasa. Pilihan tersimpan per
 *  pengunjung (localStorage) dan ditandai pada <html lang>. */
export type LandingLang = "id" | "en";
const COPY = {
  id: {
    skip: "Lewati ke konten",
    home: "Ikrarku beranda",
    mainNav: "Navigasi utama",
    navDesigns: "Desain undangan",
    navHow: "Cara memulai",
    navFeatures: "Fitur",
    navJournal: "Jurnal ikrarku",
    workspace: "Buka workspace ikrarku",
    login: "Masuk",
    findDesign: "Temukan desain",
    menuOpen: "Buka menu",
    menuClose: "Tutup menu",
    langLabel: "Pilih bahasa",
    heroLines: ["Sebuah janji.", "Sebuah cerita.", "Sebuah undangan."],
    heroBody:
      "Hadirkan hari istimewa kalian dalam undangan digital yang personal. Pilih desain, ceritakan kisahnya, dan sambut setiap tamu dengan hangat.",
    heroCta: "Pilih desain kalian",
    heroHow: "Lihat cara kerjanya",
    heroArt: "Ilustrasi undangan digital",
    inviteTagline: "Bersama, memulai selamanya.",
    inviteOpen: "Buka undangan",
    strip: ["Cerita kalian, satu tautan.", "RSVP online", "Galeri kenangan", "Lokasi acara", "Musik pilihan"],
    tplEyebrow: "TEMUKAN YANG TERASA SEPERTI KALIAN",
    tplTitle: ["Berawal dari desain", "yang kalian sukai."],
    tplBody:
      "Eksplorasi gaya, lihat preview, dan temukan detail harga sebelum melangkah lebih jauh.",
    tplFilter: "Filter kategori desain",
    all: "Semua",
    viewDesign: "Lihat desain",
    styleIllustration: "ILUSTRASI GAYA",
    tplEmpty: "Desain untuk kategori ini belum tersedia.",
    tplOffline:
      "Katalog belum dapat dimuat. Silakan muat ulang atau coba beberapa saat lagi.",
    seeAllDesigns: "Lihat semua desain",
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
    skip: "Skip to content",
    home: "ikrarku home",
    mainNav: "Main navigation",
    navDesigns: "Invitation designs",
    navHow: "How it works",
    navFeatures: "Features",
    navJournal: "ikrarku Journal",
    workspace: "Open ikrarku workspace",
    login: "Log in",
    findDesign: "Find a design",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    langLabel: "Choose language",
    heroLines: ["A promise.", "A story.", "An invitation."],
    heroBody:
      "Bring your special day to life with a personal digital invitation. Choose a design, tell your story, and welcome every guest warmly.",
    heroCta: "Choose your design",
    heroHow: "See how it works",
    heroArt: "Digital invitation illustration",
    inviteTagline: "Together, beginning forever.",
    inviteOpen: "Open invitation",
    strip: ["Your story, one link.", "Online RSVP", "Memory gallery", "Event location", "Your music"],
    tplEyebrow: "FIND THE ONE THAT FEELS LIKE YOU",
    tplTitle: ["It starts with a design", "you love."],
    tplBody:
      "Explore styles, view previews, and check pricing details before taking the next step.",
    tplFilter: "Filter design categories",
    all: "All",
    viewDesign: "View design",
    styleIllustration: "STYLE ILLUSTRATION",
    tplEmpty: "No designs in this category yet.",
    tplOffline: "The catalog could not be loaded. Please reload or try again shortly.",
    seeAllDesigns: "See all designs",
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
const LANG_KEY = "ikrarku.landingLang";
function readLang(): LandingLang {
  try {
    const saved = window.localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "id") return saved;
  } catch {
    /* storage tidak tersedia */
  }
  return "id";
}

type Props = {
  setView: (view: View) => void;
  templates: Template[];
  articles: ArticleItem[];
  onTemplate: (template: Template) => void;
  onArticle: (article: ArticleItem) => void;
  accountName?: string;
  onOpenWorkspace?: () => void;
  scrollTarget?: string | null;
  onScrolled?: () => void;
  databaseOnline: boolean;
  renderPreview: (template: Template) => ReactNode;
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
        <small>{article.category}</small>
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
      </span>
      <span className="ikr-journal-foot">
        {readLabel} <ArrowRight size={16} />
      </span>
    </a>
  );
}

// Menampilkan maksimal 10 artikel, bergeser otomatis tiga-tiga
// (1,2,3 → 2,3,4 → …) lalu kembali ke awal.
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
  const perView = 3;
  const maxStart = Math.max(0, visible.length - perView);
  const [start, setStart] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => setStart(0), [category]);
  useEffect(() => {
    if (paused || visible.length <= perView) return;
    const timer = window.setInterval(
      () => setStart((previous) => (previous >= maxStart ? 0 : previous + 1)),
      4000,
    );
    return () => window.clearInterval(timer);
  }, [paused, maxStart, visible.length]);
  const safeStart = Math.min(start, maxStart);
  // Geser manual: tombol panah, swipe, dan klik indikator.
  const dragRef = useRef<{ x: number; handled: boolean } | null>(null);
  const step = (direction: 1 | -1) =>
    setStart((previous) => {
      const next = Math.min(maxStart, Math.max(0, previous)) + direction;
      if (next < 0) return maxStart;
      if (next > maxStart) return 0;
      return next;
    });
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
            onClick={() => setCategory(item)}
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
            onClick={() => step(-1)}
          >
            <ChevronLeft size={18} />
          </button>
        )}
        <div
          className="ikr-journal-viewport"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onPointerDown={(event) => {
            dragRef.current = { x: event.clientX, handled: false };
            setPaused(true);
          }}
          onPointerMove={(event) => {
            const drag = dragRef.current;
            if (!drag || drag.handled) return;
            const delta = event.clientX - drag.x;
            if (Math.abs(delta) > 48) {
              step(delta < 0 ? 1 : -1);
              drag.handled = true;
            }
          }}
          onPointerUp={() => {
            dragRef.current = null;
            setPaused(false);
          }}
          onPointerLeave={() => {
            dragRef.current = null;
          }}
        >
          <div
            className="ikr-journal-track"
            style={{
              transform: `translateX(calc(-${safeStart} * (100% + 22px) / ${perView}))`,
            }}
          >
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
            onClick={() => step(1)}
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
              onClick={() => setStart(index)}
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
const rupiah = (value = 0) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
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
  accountName,
  onOpenWorkspace,
  scrollTarget,
  onScrolled,
  databaseOnline,
  renderPreview,
}: Props) {
  const [menu, setMenu] = useState(false),
    [category, setCategory] = useState(ALL);
  const [lang, setLangState] = useState<LandingLang>(readLang);
  const tx = COPY[lang];
  const setLang = (next: LandingLang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(LANG_KEY, next);
    } catch {
      /* storage tidak tersedia */
    }
  };
  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = previous || "id";
    };
  }, [lang]);
  const root = useRef<HTMLDivElement>(null);
  const categories = useMemo(
    () => [ALL, ...new Set(templates.map((t) => t.category))],
    [templates],
  );
  // QA TC-151: desain rekomendasi tampil lebih dulu supaya customer yang
  // bingung memilih langsung melihatnya.
  const visible = useMemo(() => {
    const filtered = templates.filter(
      (t) => category === ALL || t.category === category,
    );
    return [
      ...filtered.filter((t) => t.recommended),
      ...filtered.filter((t) => !t.recommended),
    ];
  }, [templates, category]);
  useEffect(() => {
    if (scrollTarget) {
      scrollToSection(scrollTarget);
      onScrolled?.();
    }
  }, [scrollTarget, onScrolled]);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  useEffect(() => {
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
      { threshold: 0.08 },
    );
    root.current?.querySelectorAll("[data-reveal]").forEach((el) => {
      el.classList.add("will-reveal");
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  const langSwitch = (variant: string) => (
    <div className={`ikr-lang ${variant}`} role="group" aria-label={tx.langLabel}>
      <Globe size={14} aria-hidden />
      {(["id", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={lang === code}
          className={lang === code ? "is-active" : ""}
          onClick={() => setLang(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
  const nav = (id: string) => {
    setMenu(false);
    scrollToSection(id);
  };
  return (
    <div className="ikr-landing" ref={root}>
      <a className="ikr-skip" href="#main-content">
        {tx.skip}
      </a>
      <header className="ikr-nav">
        <a href="#" aria-label={tx.home} className="ikr-brand">
          <img
            src="/brand/ikrarku-logo.png"
            alt="ikrarku"
            width="152"
            height="46"
          />
        </a>
        <nav
          aria-label={tx.mainNav}
          className={menu ? "is-open" : ""}
          id="landing-menu"
        >
          <a href="#templates" onClick={() => nav("templates")}>
            {tx.navDesigns}
          </a>
          <a href="#how-it-works" onClick={() => nav("how-it-works")}>
            {tx.navHow}
          </a>
          <a href="#features" onClick={() => nav("features")}>
            {tx.navFeatures}
          </a>
          <a href="#faq" onClick={() => nav("faq")}>
            FAQ
          </a>
          <a
            href="/jurnal"
            onClick={(event) => {
              event.preventDefault();
              setMenu(false);
              setView("journal");
            }}
          >
            {tx.navJournal}
          </a>
          {langSwitch("ikr-lang-menu")}
        </nav>
        {/* Revisi 24 Okt (2) — pilihan bahasa, Masuk, dan CTA satu baris
            sejajar dengan logo & menu. Di ponsel pilihan bahasa pindah ke
            menu agar targetnya bisa 48 px tanpa membuat header sesak. */}
        <div className="ikr-nav-actions">
          {langSwitch("ikr-lang-header")}
          {/* Pengunjung yang sudah login melihat namanya, dan klik namanya
              membawa langsung ke workspace. */}
          {accountName ? (
            <button
              className="ikr-login is-account"
              onClick={() => onOpenWorkspace?.()}
              title={tx.workspace}
            >
              <UserRound size={15} />
              <span>{accountName}</span>
            </button>
          ) : (
            <button className="ikr-login" onClick={() => setView("login")}>
              <LogIn size={15} />
              <span>{tx.login}</span>
            </button>
          )}
          <button
            className="ikr-btn ikr-nav-cta"
            onClick={() => nav("templates")}
          >
            {tx.findDesign} <ArrowRight size={16} />
          </button>
          <button
            className="ikr-menu"
            aria-label={menu ? tx.menuClose : tx.menuOpen}
            aria-expanded={menu}
            aria-controls="landing-menu"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main id="main-content">
        <section className="ikr-hero">
          <div className="ikr-hero-copy">
            <h1>
              {tx.heroLines[0]}
              <br />
              {tx.heroLines[1]}
              <br />
              <em>{tx.heroLines[2]}</em>
            </h1>
            <p>{tx.heroBody}</p>
            <div className="ikr-actions">
              <button className="ikr-btn" onClick={() => nav("templates")}>
                {tx.heroCta} <ArrowRight size={18} />
              </button>
              <button
                className="ikr-text-button"
                onClick={() => nav("how-it-works")}
              >
                {tx.heroHow} <ChevronDown size={16} />
              </button>
            </div>
          </div>
          <div className="ikr-hero-art" aria-label={tx.heroArt}>
            <div className="ikr-art-caption">
              A LITTLE PREVIEW OF YOUR FOREVER
            </div>
            <div className="ikr-invitation">
              <svg
                className="ikr-botanical"
                viewBox="0 0 360 420"
                fill="none"
                aria-hidden="true"
              >
                <g stroke="currentColor" strokeWidth="1.2">
                  <path d="M16 410C52 290 4 158 95 12M340 414C299 293 361 170 270 18" />
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <g
                      key={i}
                      transform={`translate(${i % 2 ? 12 : 0},${i * 55})`}
                    >
                      <path d="M41 78C7 47 5 32 14 22C43 24 59 42 41 78ZM42 79C69 58 87 52 96 60C94 87 69 98 42 79M315 80C348 52 352 28 340 20C313 29 301 53 315 80M316 82C291 57 270 54 263 65C273 90 296 99 316 82" />
                    </g>
                  ))}
                </g>
              </svg>
              <span className="ikr-invite-kicker">THE WEDDING OF</span>
              <h2>
                Alya <i>&</i> Raka
              </h2>
              <span className="ikr-invite-rule" />
              <p>{tx.inviteTagline}</p>
              <strong>20 . 12 . 2026</strong>
              <span className="ikr-invite-location">BANDUNG, INDONESIA</span>
              <span className="ikr-invite-open">
                {tx.inviteOpen} <ArrowRight size={13} />
              </span>
            </div>
          </div>
        </section>
        <div className="ikr-benefit-strip">
          <span>{tx.strip[0]}</span>
          <p>{tx.strip[1]}</p>
          <i />
          <p>{tx.strip[2]}</p>
          <i />
          <p>{tx.strip[3]}</p>
          <i />
          <p>{tx.strip[4]}</p>
        </div>
        <section id="templates" className="ikr-section" data-reveal>
          <div className="ikr-section-heading">
            <div>
              <span className="ikr-eyebrow">{tx.tplEyebrow}</span>
              <h2>
                {tx.tplTitle[0]}
                <br />
                <em>{tx.tplTitle[1]}</em>
              </h2>
            </div>
            <p>{tx.tplBody}</p>
          </div>
          <div className="ikr-filters" aria-label={tx.tplFilter}>
            {categories.map((c) => (
              <button
                key={c}
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
              >
                {c === ALL ? tx.all : c}
              </button>
            ))}
          </div>
          <div className="ikr-template-grid">
            {visible.slice(0, 9).map((t) => (
              <article className="ikr-template" key={t.id}>
                <button
                  className="ikr-template-preview"
                  aria-label={`${tx.viewDesign} ${t.name}`}
                  onClick={() => onTemplate(t)}
                >
                  {t.sampleImage || t.preview ? (
                    /* QA TC-135: gambar sample yang baru diunggah langsung dipakai
                       sebagai thumbnail di halaman Templates. */
                    <div
                      className="ikr-template-sample"
                      style={{
                        backgroundImage: `url(${t.sampleImage || t.preview})`,
                      }}
                      role="img"
                      aria-label={`Sample ${t.name}`}
                    />
                  ) : t.canvasSections?.length ? (
                    renderPreview(t)
                  ) : (
                    <div
                      className="ikr-template-fallback"
                      style={{ background: t.bg, color: t.accent }}
                    >
                      <small>{t.category}</small>
                      <span>
                        Our story,
                        <br />
                        <i>beautifully told.</i>
                      </span>
                      <Heart size={24} />
                      <small>{tx.styleIllustration}</small>
                    </div>
                  )}
                  <span className="ikr-preview-action">
                    {tx.viewDesign} <ArrowRight size={16} />
                  </span>
                  {t.recommended && (
                    <span className="ikr-template-badge">
                      <Star size={12} /> Recommended
                    </span>
                  )}
                </button>
                <div className="ikr-template-info">
                  <div>
                    <small>{t.category}</small>
                    <h3>{t.name}</h3>
                  </div>
                  <span>{rupiah(t.price)}</span>
                </div>
              </article>
            ))}
          </div>
          {!visible.length && (
            <div className="ikr-empty" role="status">
              {databaseOnline
                ? tx.tplEmpty
                : tx.tplOffline}
            </div>
          )}
          {/* Landing menampilkan 9 desain; selebihnya dibuka di halaman khusus. */}
          {visible.length > 9 && (
            <div className="ikr-template-more">
              <button className="ikr-btn" onClick={() => setView("designs")}>
                {tx.seeAllDesigns} ({visible.length}) <ArrowRight size={16} />
              </button>
            </div>
          )}
        </section>
        <section id="features" className="ikr-features" data-reveal>
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
        {!!articles.length && (
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
        <section className="ikr-final">
          <span className="ikr-eyebrow">YOUR STORY STARTS HERE</span>
          <h2>
            {tx.finalTitle[0]}
            <br />
            <em>{tx.finalTitle[1]}</em>
          </h2>
          <button className="ikr-btn" onClick={() => nav("templates")}>
            {tx.finalCta} <ArrowRight size={18} />
          </button>
        </section>
      </main>
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
    </div>
  );
}
