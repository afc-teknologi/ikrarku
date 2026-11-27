// Run against a local Vite dev server. Not executed in the authoring environment:
// its supported browser refuses localhost (ERR_BLOCKED_BY_CLIENT).
import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
const base = process.env.QA_BASE_URL || "http://127.0.0.1:5173";
test("Landing: mobile menu, viewport, keyboard FAQ and reduced motion", async (t) => {
  const browser = await chromium.launch();
  t.after(() => browser.close());
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  await page.route("**/api/**", (route) =>
    route.fulfill({
      json: route.request().url().endsWith("/public/bootstrap")
        ? { templates: [], articles: [], paymentMethods: [], sounds: [] }
        : { ok: true },
    }),
  );
  await page.goto(base);
  await page.locator(".ikr-hero h1").waitFor();
  const fits = await page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth,
  );
  assert.equal(fits, true);
  await page.getByRole("button", { name: "Buka menu", exact: true }).click();
  assert.equal(
    await page
      .getByRole("button", { name: "Tutup menu", exact: true })
      .getAttribute("aria-expanded"),
    "true",
  );
  await page.keyboard.press("Escape");
  assert.equal(
    await page
      .getByRole("button", { name: "Buka menu", exact: true })
      .getAttribute("aria-expanded"),
    "false",
  );
  const faq = page.locator("#faq summary").first();
  await faq.focus();
  await page.keyboard.press("Enter");
  assert.equal(
    await page.locator("#faq details").first().getAttribute("open"),
    "",
  );
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      true,
      `overflow at ${width}px`,
    );
  }
});
test("Designer: actual CSS docks image to corners, mobile inherits and overrides", async (t) => {
  const browser = await chromium.launch();
  t.after(() => browser.close());
  const page = await browser.newPage({
    viewport: { width: 1200, height: 900 },
  });
  await page.goto(base + "/QA/designer.html");
  const ornament = page.getByTestId("ornament"),
    canvas = page.getByTestId("canvas");
  await ornament.waitFor();
  await page
    .getByRole("button", { name: "Dock top right", exact: true })
    .click();
  let box = await ornament.boundingBox(),
    outer = await canvas.boundingBox();
  assert.ok(Math.abs(box.x + box.width - (outer.x + outer.width)) < 2);
  await page.getByLabel("Atur tampilan").selectOption("mobile");
  await page
    .getByRole("button", { name: "Dock top left", exact: true })
    .click();
  await page.setViewportSize({ width: 390, height: 900 });
  box = await ornament.boundingBox();
  outer = await canvas.boundingBox();
  assert.ok(Math.abs(box.x - outer.x) < 2);
  await page.setViewportSize({ width: 1200, height: 900 });
  box = await ornament.boundingBox();
  outer = await canvas.boundingBox();
  assert.ok(
    Math.abs(box.x + box.width - (outer.x + outer.width)) < 2,
    "mobile override must not move desktop",
  );
});

test("Landing on touch: design follows the finger, and the journal reaches its last card", async (t) => {
  const browser = await chromium.launch();
  t.after(() => browser.close());
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const titles = ["Alpha", "Beta", "Gamma", "Delta"];
  await page.route("**/api/**", route => route.fulfill({
    json: route.request().url().endsWith("/public/bootstrap") ? {
      templates: titles.map((name, index) => ({
        id: `design-${index}`, name, category: "Modern", package: "Basic", price: 79000,
      })),
      articles: titles.map((title, index) => ({
        id: `article-${index}`, slug: title.toLowerCase(), title, category: "Planning", status: "Published",
      })),
      sounds: [],
      paymentMethods: [],
    } : { ok: true },
  }));
  await page.goto(base);
  const stage = page.locator(".ikr-carousel-stage");
  await stage.scrollIntoViewIfNeeded();
  const box = await stage.boundingBox();
  assert.ok(box);
  const session = await page.context().newCDPSession(page);
  const touch = (type, x) => session.send("Input.dispatchTouchEvent", {
    type,
    touchPoints: type === "touchEnd" ? [] : [{ x, y: Math.round(box.y + box.height / 2) }],
  });
  await touch("touchStart", 245);
  await touch("touchMove", 225);
  await touch("touchMove", 200);
  await touch("touchMove", 155);
  assert.ok(await stage.evaluate(el => parseFloat(el.style.getPropertyValue("--drag-x")) < -20));
  await touch("touchEnd");
  await page.locator(".ikr-carousel-position").filter({ hasText: "Beta" }).waitFor();
  assert.equal(new URL(page.url()).pathname, "/");

  const dots = page.locator(".ikr-journal-dots button");
  assert.equal(await dots.count(), titles.length);
  await dots.last().scrollIntoViewIfNeeded();
  await page.waitForFunction(() =>
    getComputedStyle(document.querySelector(".ikr-journal-dots")).opacity === "1",
  );
  await dots.last().tap();
  await page.waitForFunction(() => {
    const rail = document.querySelector(".ikr-journal-viewport");
    const card = rail?.querySelector(".ikr-journal-card:last-child");
    return card && Math.abs(card.getBoundingClientRect().left - rail.getBoundingClientRect().left) < 3;
  });
  await page.waitForFunction(() => document.querySelector(".ikr-journal-nav.next")?.disabled);
});
