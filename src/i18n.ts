import { useCallback, useSyncExternalStore } from "react";

/**
 * QA 15 (TC-348–353, TC-362) — satu pilihan bahasa untuk seluruh situs.
 *
 * Dulu pilihan ID/EN hanya hidup di landing page, sehingga halaman lain
 * (jurnal, login, daftar, lupa password, template, checkout, dashboard)
 * tetap berbahasa Indonesia atau campuran. Pilihan kini disimpan di satu
 * tempat (localStorage, kunci yang sama dengan landing sebelumnya) dan semua
 * halaman berlangganan ke perubahan yang sama.
 */
export type SiteLang = "id" | "en";

const LANG_KEY = "ikrarku.landingLang";
const EVENT = "ikrarku-lang-change";

function read(): SiteLang {
  try {
    const saved = window.localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "id") return saved;
  } catch {
    /* storage tidak tersedia */
  }
  return "id";
}

let current: SiteLang = typeof window === "undefined" ? "id" : read();

export function getSiteLang(): SiteLang {
  return current;
}

export function setSiteLang(next: SiteLang) {
  current = next;
  try {
    window.localStorage.setItem(LANG_KEY, next);
  } catch {
    /* storage tidak tersedia */
  }
  try {
    document.documentElement.lang = next;
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === LANG_KEY) {
      current = read();
      callback();
    }
  };
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function useSiteLang(): [SiteLang, (next: SiteLang) => void] {
  const lang = useSyncExternalStore(subscribe, getSiteLang, () => "id" as SiteLang);
  return [lang, setSiteLang];
}

/** `t("Teks Indonesia", "English text")` — memilih teks sesuai bahasa aktif. */
export function useT() {
  const [lang] = useSiteLang();
  return useCallback(
    (id: string, en: string) => (lang === "en" ? en : id),
    [lang],
  );
}
