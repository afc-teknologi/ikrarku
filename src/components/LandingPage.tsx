import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Menu,
  X,
  Palette,
  Heart,
  MapPin,
  MousePointer2,
} from "lucide-react";
import type { Template, ArticleItem, View } from "../App";
import "./LandingPage.css";

type Props = {
  setView: (view: View) => void;
  templates: Template[];
  articles: ArticleItem[];
  onTemplate: (template: Template) => void;
  onArticle: (article: ArticleItem) => void;
  scrollTarget?: string | null;
  onScrolled?: () => void;
  databaseOnline: boolean;
  renderPreview: (template: Template) => ReactNode;
};
const rupiah = (value = 0) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
const scrollToSection = (id: string) =>
  document
    .getElementById(id)
    ?.scrollIntoView({
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
  renderPreview,
}: Props) {
  const [menu, setMenu] = useState(false),
    [category, setCategory] = useState("Semua");
  const root = useRef<HTMLDivElement>(null);
  const categories = useMemo(
    () => ["Semua", ...new Set(templates.map((t) => t.category))],
    [templates],
  );
  const visible = templates.filter(
    (t) => category === "Semua" || t.category === category,
  );
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
  const nav = (id: string) => {
    setMenu(false);
    scrollToSection(id);
  };
  return (
    <div className="ikr-landing" ref={root}>
      <a className="ikr-skip" href="#main-content">
        Lewati ke konten
      </a>
      <header className="ikr-nav">
        <a href="#" aria-label="Ikrarku beranda" className="ikr-brand">
          <img
            src="/brand/ikrarku-logo.png"
            alt="ikrarku"
            width="152"
            height="46"
          />
        </a>
        <nav
          aria-label="Navigasi utama"
          className={menu ? "is-open" : ""}
          id="landing-menu"
        >
          <a href="#templates" onClick={() => nav("templates")}>
            Desain undangan
          </a>
          <a href="#how-it-works" onClick={() => nav("how-it-works")}>
            Cara memulai
          </a>
          <a href="#features" onClick={() => nav("features")}>
            Fitur
          </a>
          <a href="#faq" onClick={() => nav("faq")}>
            FAQ
          </a>
        </nav>
        <div className="ikr-nav-actions">
          <button className="ikr-login" onClick={() => setView("login")}>
            Masuk
          </button>
          <button
            className="ikr-btn ikr-nav-cta"
            onClick={() => nav("templates")}
          >
            Temukan desain <ArrowRight size={16} />
          </button>
          <button
            className="ikr-menu"
            aria-label={menu ? "Tutup menu" : "Buka menu"}
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
            <span className="ikr-eyebrow">
              <i /> UNTUK CERITA YANG HANYA MILIK KALIAN
            </span>
            <h1>
              Sebuah janji.
              <br />
              Sebuah cerita.
              <br />
              <em>Sebuah undangan.</em>
            </h1>
            <p>
              Hadirkan hari istimewa kalian dalam undangan digital yang
              personal. Pilih desain, ceritakan kisahnya, dan sambut setiap tamu
              dengan hangat.
            </p>
            <div className="ikr-actions">
              <button className="ikr-btn" onClick={() => nav("templates")}>
                Pilih desain kalian <ArrowRight size={18} />
              </button>
              <button
                className="ikr-text-button"
                onClick={() => nav("how-it-works")}
              >
                Lihat cara kerjanya <ChevronDown size={16} />
              </button>
            </div>
            <div className="ikr-hero-points">
              <span>
                <Check size={15} /> Tanpa coding
              </span>
              <span>
                <Check size={15} /> Preview sebelum pesan
              </span>
              <span>
                <Check size={15} /> Dibantu tim
              </span>
            </div>
          </div>
          <div className="ikr-hero-art" aria-label="Ilustrasi undangan digital">
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
              <p>Bersama, memulai selamanya.</p>
              <strong>20 . 12 . 2026</strong>
              <span className="ikr-invite-location">BANDUNG, INDONESIA</span>
              <span className="ikr-invite-open">
                Buka undangan <ArrowRight size={13} />
              </span>
            </div>
            <div className="ikr-art-foot">
              <span>
                <Heart size={15} /> Dirancang untuk terasa personal
              </span>
              <small>ILUSTRASI DESAIN</small>
            </div>
          </div>
        </section>
        <div className="ikr-benefit-strip">
          <span>Cerita kalian, satu tautan.</span>
          <p>RSVP online</p>
          <i />
          <p>Galeri kenangan</p>
          <i />
          <p>Lokasi acara</p>
          <i />
          <p>Musik pilihan</p>
        </div>
        <section id="templates" className="ikr-section" data-reveal>
          <div className="ikr-section-heading">
            <div>
              <span className="ikr-eyebrow">
                TEMUKAN YANG TERASA SEPERTI KALIAN
              </span>
              <h2>
                Berawal dari desain
                <br />
                <em>yang kalian sukai.</em>
              </h2>
            </div>
            <p>
              Eksplorasi gaya, lihat preview, dan temukan detail harga sebelum
              melangkah lebih jauh.
            </p>
          </div>
          <div className="ikr-filters" aria-label="Filter kategori desain">
            {categories.map((c) => (
              <button
                key={c}
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="ikr-template-grid">
            {visible.map((t) => (
              <article className="ikr-template" key={t.id}>
                <button
                  className="ikr-template-preview"
                  aria-label={`Lihat desain ${t.name}`}
                  onClick={() => onTemplate(t)}
                >
                  {t.canvasSections?.length ? (
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
                      <small>ILUSTRASI GAYA</small>
                    </div>
                  )}
                  <span className="ikr-preview-action">
                    Lihat desain <ArrowRight size={16} />
                  </span>
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
                ? "Desain untuk kategori ini belum tersedia."
                : "Katalog belum dapat dimuat. Silakan muat ulang atau coba beberapa saat lagi."}
            </div>
          )}
        </section>
        <section id="features" className="ikr-features" data-reveal>
          <div className="ikr-feature-lead">
            <span className="ikr-eyebrow">INDAH DILIHAT. MUDAH DIGUNAKAN.</span>
            <h2>
              Detail kecil.
              <br />
              <em>Arti yang besar.</em>
            </h2>
            <p>
              Semua informasi penting dalam satu tempat, agar kalian bisa lebih
              menikmati perjalanan menuju hari bahagia.
            </p>
          </div>
          <div className="ikr-feature-grid">
            {[
              [
                Palette,
                "Sesuai karakter kalian",
                "Personalisasi warna, foto, tipografi, dan animasi.",
              ],
              [
                Heart,
                "Lebih dekat dengan tamu",
                "Terima konfirmasi kehadiran dan ucapan secara online.",
              ],
              [
                MapPin,
                "Informasi yang mudah ditemukan",
                "Bagikan waktu dan lokasi acara tanpa pesan berulang.",
              ],
              [
                MousePointer2,
                "Didampingi dari awal",
                "CS dan Web Designer membantu proses personalisasi.",
              ],
            ].map(([Icon, title, description]) => {
              const I = Icon as typeof Heart;
              return (
                <article key={String(title)}>
                  <I size={23} />
                  <h3>{String(title)}</h3>
                  <p>{String(description)}</p>
                </article>
              );
            })}
          </div>
        </section>
        <section id="how-it-works" className="ikr-section" data-reveal>
          <span className="ikr-eyebrow">DARI IDE MENJADI UNDANGAN</span>
          <h2>
            Tiga langkah.
            <br />
            <em>Satu awal yang indah.</em>
          </h2>
          <div className="ikr-steps">
            {[
              [
                "01",
                "Pilih desain",
                "Lihat koleksi dan preview. Pilih desain yang paling dekat dengan cerita kalian.",
              ],
              [
                "02",
                "Personalisasi bersama",
                "Lengkapi pemesanan, lalu sesuaikan isi dan tampilan bersama tim.",
              ],
              [
                "03",
                "Bagikan kebahagiaan",
                "Periksa hasilnya di desktop dan mobile, lalu bagikan tautan undangan.",
              ],
            ].map(([n, t, d]) => (
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
            <span className="ikr-eyebrow">SEBELUM MEMULAI</span>
            <h2>
              Ada yang ingin
              <br />
              <em>kalian tanyakan?</em>
            </h2>
          </div>
          <div>
            {[
              [
                "Apakah perlu bisa coding?",
                "Tidak. Konten dan desain dapat diatur melalui editor visual. Tim CS dan Web Designer juga mendampingi prosesnya.",
              ],
              [
                "Bisa melihat desain sebelum memesan?",
                "Bisa. Buka desain yang kalian sukai untuk melihat preview, informasi template, dan harga.",
              ],
              [
                "Apakah undangan bisa dibuka dari HP?",
                "Undangan dapat dibuka melalui browser. Gunakan preview mobile sebelum publikasi untuk memeriksa susunan setiap elemen.",
              ],
              [
                "Apa yang perlu disiapkan?",
                "Nama pasangan, waktu dan lokasi acara, foto pilihan, serta cerita atau informasi lain yang ingin dibagikan.",
              ],
            ].map(([q, a]) => (
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
            <span className="ikr-eyebrow">JURNAL IKRARKU</span>
            <h2>
              Inspirasi untuk
              <br />
              <em>hari istimewa kalian.</em>
            </h2>
            <div className="ikr-journal">
              {articles
                .filter((a) => a.status === "Published")
                .slice(0, 3)
                .map((a) => (
                  <button key={a.id} onClick={() => onArticle(a)}>
                    {a.coverUrl && (
                      <img
                        loading="lazy"
                        decoding="async"
                        src={a.coverUrl}
                        alt=""
                        width="400"
                        height="240"
                      />
                    )}
                    <small>{a.category}</small>
                    <h3>{a.title}</h3>
                    <span>
                      Baca cerita <ArrowRight size={16} />
                    </span>
                  </button>
                ))}
            </div>
          </section>
        )}
        <section className="ikr-final">
          <span className="ikr-eyebrow">YOUR STORY STARTS HERE</span>
          <h2>
            Siap merangkai
            <br />
            <em>cerita kalian?</em>
          </h2>
          <button className="ikr-btn" onClick={() => nav("templates")}>
            Temukan desain pilihan <ArrowRight size={18} />
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
        <p>Undangan digital. Cerita yang personal.</p>
        <small>© {new Date().getFullYear()} ikrarku</small>
      </footer>
    </div>
  );
}
