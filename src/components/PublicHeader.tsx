import { useEffect, useState, type MouseEvent } from "react";
import { ArrowRight, Globe, LogIn, Menu, UserRound, X } from "lucide-react";
import { useSiteLang } from "../i18n";
import "./LandingPage.css";

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
  },
};

type Props = {
  accountName?: string;
  onHome: () => void;
  onSection: (id: string) => void;
  onJournal: () => void;
  onAccount: () => void;
};

export default function PublicHeader({ accountName, onHome, onSection, onJournal, onAccount }: Props) {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useSiteLang();
  const tx = COPY[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const follow = (event: MouseEvent<HTMLAnchorElement>, navigate: () => void) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setMenu(false);
    navigate();
  };

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
  return (
    <>
      <a className="ikr-skip" href="#main-content">
        {tx.skip}
      </a>
      <header className={`ikr-nav${scrolled ? " is-scrolled" : ""}`}>
        <a href="/" onClick={event => follow(event, onHome)} aria-label={tx.home} className="ikr-brand">
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
          id="public-menu"
        >
          <a href="/#templates" onClick={event => follow(event, () => onSection("templates"))}>
            {tx.navDesigns}
          </a>
          <a href="/#how-it-works" onClick={event => follow(event, () => onSection("how-it-works"))}>
            {tx.navHow}
          </a>
          <a href="/#features" onClick={event => follow(event, () => onSection("features"))}>
            {tx.navFeatures}
          </a>
          <a href="/#faq" onClick={event => follow(event, () => onSection("faq"))}>
            FAQ
          </a>
          <a
            href="/jurnal"
            onClick={event => follow(event, onJournal)}
          >
            {tx.navJournal}
          </a>
          {langSwitch("ikr-lang-menu")}
        </nav>
        <div className="ikr-nav-actions">
          {langSwitch("ikr-lang-header")}
          {accountName ? (
            <button
              className="ikr-login is-account"
              onClick={onAccount}
              title={tx.workspace}
            >
              <UserRound size={15} />
              <span>{accountName}</span>
            </button>
          ) : (
            <button className="ikr-login" onClick={onAccount}>
              <LogIn size={15} />
              <span>{tx.login}</span>
            </button>
          )}
          <button
            className="ikr-btn ikr-nav-cta"
            onClick={() => { setMenu(false); onSection("templates"); }}
          >
            {tx.findDesign} <ArrowRight size={16} />
          </button>
          <button
            className="ikr-menu"
            aria-label={menu ? tx.menuClose : tx.menuOpen}
            aria-expanded={menu}
            aria-controls="public-menu"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
    </>
  );
}
