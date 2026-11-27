export type ArticleHeading = { id: string; text: string; level: 2 | 3 };

export function prepareArticleReading(html: string) {
  if (typeof DOMParser === "undefined") return { html, headings: [] as ArticleHeading[], minutes: 1 };
  const doc = new DOMParser().parseFromString(html, "text/html");
  const headings: ArticleHeading[] = [];
  const occupied = new Set(
    Array.from(doc.body.querySelectorAll("[id]:not(h2):not(h3)"), node => node.id),
  );
  for (const heading of Array.from(doc.body.querySelectorAll("h2, h3"))) {
    const text = (heading.textContent || "").replace(/\s+/g, " ").trim();
    if (!text) continue;
    const slug = text.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "")
      .replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "");
    const base = heading.id.trim() || `bagian-${slug || headings.length + 1}`;
    let id = base;
    let suffix = 2;
    while (occupied.has(id)) id = `${base}-${suffix++}`;
    occupied.add(id);
    heading.id = id;
    headings.push({ id, text, level: heading.tagName === "H2" ? 2 : 3 });
  }
  const words = (doc.body.innerText || doc.body.textContent || "").trim().split(/\s+/).length;
  return { html: doc.body.innerHTML, headings, minutes: Math.max(1, Math.ceil(words / 220)) };
}
