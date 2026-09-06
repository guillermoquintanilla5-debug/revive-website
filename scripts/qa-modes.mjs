import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";

const CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9333;
const ORIGIN = process.env.QA_ORIGIN || "http://127.0.0.1:3000";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function cdp(ws, method, params = {}, sessionId) {
  const id = cdp._i = (cdp._i || 0) + 1;
  const msg = { id, method, params };
  if (sessionId) msg.sessionId = sessionId;
  ws.send(JSON.stringify(msg));
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`CDP timeout ${method}`)), 20000);
    const on = (raw) => {
      const data = JSON.parse(raw.toString());
      if (data.id !== id) return;
      clearTimeout(t);
      ws.removeListener("message", on);
      if (data.error) reject(new Error(JSON.stringify(data.error)));
      else resolve(data.result);
    };
    ws.on("message", on);
  });
}

async function evaluate(ws, sessionId, expression) {
  const result = await cdp(
    ws,
    "Runtime.evaluate",
    { expression, returnByValue: true, awaitPromise: true },
    sessionId,
  );
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "eval failed");
  }
  return result.result.value;
}

const PROBE = `(() => {
  const cs = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const s = getComputedStyle(el);
    return {
      display: s.display,
      opacity: s.opacity,
      visibility: s.visibility,
      height: s.height,
      minHeight: s.minHeight,
      maxWidth: s.maxWidth,
      width: s.width,
      clipPath: s.clipPath,
      fontSize: s.fontSize,
      position: s.position,
    };
  };
  const rect = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height), t: Math.round(r.top) };
  };
  const imgs = [...document.querySelectorAll(".legacy-gallery img, .gallery-card img")].map((img) => ({
    src: img.currentSrc || img.src,
    w: img.naturalWidth,
    h: img.naturalHeight,
    cw: img.clientWidth,
    ch: img.clientHeight,
    display: getComputedStyle(img).display,
  }));
  const qualifyNums = [...document.querySelectorAll(".qualify-num")].map((el) => getComputedStyle(el).opacity);
  return {
    htmlClass: document.documentElement.className,
    hasJs: document.documentElement.classList.contains("js"),
    modern: document.documentElement.classList.contains("modern-css"),
    legacy: document.documentElement.classList.contains("legacy-css"),
    docH: document.documentElement.scrollHeight,
    docW: document.documentElement.scrollWidth,
    vw: window.innerWidth,
    vh: window.innerHeight,
    navLogo: cs(".nav-logo"),
    navLogoRect: rect(".nav-logo"),
    desktopNav: cs(".site-nav-desktop"),
    hero: cs(".hero"),
    heroRect: rect(".hero"),
    heroTitleMobile: cs(".hero-title-mobile"),
    heroTitleDesktop: cs(".hero-title-desktop"),
    heroBadgeUsda: cs(".hero-badge-usda"),
    heroBadgeSoy: cs(".hero-badge-soy"),
    hiwStage: cs(".hiw-viewport-stage"),
    hiwStack: cs(".hiw-card-stack"),
    hiwCard: cs(".hiw-proto-card"),
    alt: cs(".alt"),
    altShell: cs(".alt-shell"),
    altReveal: cs(".alt-reveal"),
    altPhoto: cs(".alt-photo"),
    altPhotoRect: rect(".alt-photo"),
    warranty: cs(".warranty"),
    qualify: cs(".qualify"),
    qualifyRect: rect(".qualify"),
    qualifyNums,
    gallery: cs(".gallery"),
    galleryFrame: cs(".gallery-frame"),
    legacyGallery: cs(".legacy-gallery"),
    imgs,
    process: cs(".process"),
    experience: cs(".experience"),
    overflowX: document.documentElement.scrollWidth > window.innerWidth + 2,
  };
})()`;

async function runPage(ws, browserWS, url, viewport, outShot) {
  const { targetId } = await cdp(ws, "Target.createTarget", { url: "about:blank" });
  const { sessionId } = await cdp(ws, "Target.attachToTarget", {
    targetId,
    flatten: true,
  });
  await cdp(ws, "Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 2,
    mobile: viewport.width < 768,
  }, sessionId);
  await cdp(ws, "Page.enable", {}, sessionId);
  await cdp(ws, "Page.navigate", { url }, sessionId);
  await evaluate(
    ws,
    sessionId,
    `new Promise((r) => { if (document.readyState === "complete") r(); else window.addEventListener("load", () => r(), { once: true }); })`,
  );
  await sleep(700);
  const data = await evaluate(ws, sessionId, PROBE);
  if (outShot) {
    const shot = await cdp(ws, "Page.captureScreenshot", { format: "png" }, sessionId);
    await writeFile(outShot, Buffer.from(shot.data, "base64"));
  }
  await cdp(ws, "Target.closeTarget", { targetId });
  return data;
}

const chrome = spawn(CHROME, [
  `--remote-debugging-port=${PORT}`,
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  "--user-data-dir=/tmp/revive-qa-chrome",
], { stdio: ["ignore", "pipe", "pipe"] });
chrome.stderr.on("data", (d) => process.stderr.write(d));
chrome.on("exit", (code) => {
  if (!version) process.stderr.write(`chrome exited ${code}\n`);
});

let version;
for (let i = 0; i < 25; i++) {
  await sleep(200);
  try {
    version = await fetch(`http://127.0.0.1:${PORT}/json/version`).then((r) => r.json());
    break;
  } catch {}
}
if (!version) {
  chrome.kill("SIGKILL");
  throw new Error("Chrome debug port did not open");
}
const ws = new WebSocket(version.webSocketDebuggerUrl);

await new Promise((resolve, reject) => {
  ws.addEventListener("open", resolve);
  ws.addEventListener("error", reject);
});

const cases = [
  { name: "modern-390", url: `${ORIGIN}/`, viewport: { width: 390, height: 844 }, shot: "/tmp/revive-modern-390.png" },
  { name: "modern-430", url: `${ORIGIN}/`, viewport: { width: 430, height: 932 }, shot: "/tmp/revive-modern-430.png" },
  { name: "modern-768", url: `${ORIGIN}/`, viewport: { width: 768, height: 1024 }, shot: "/tmp/revive-modern-768.png" },
  { name: "modern-1440", url: `${ORIGIN}/`, viewport: { width: 1440, height: 900 }, shot: "/tmp/revive-modern-1440.png" },
  { name: "legacy-320", url: `${ORIGIN}/?legacy=1`, viewport: { width: 320, height: 640 }, shot: "/tmp/revive-legacy-320.png" },
  { name: "legacy-360", url: `${ORIGIN}/?legacy=1`, viewport: { width: 360, height: 740 }, shot: "/tmp/revive-legacy-360.png" },
  { name: "legacy-390", url: `${ORIGIN}/?legacy=1`, viewport: { width: 390, height: 844 }, shot: "/tmp/revive-legacy-390.png" },
  { name: "legacy-430", url: `${ORIGIN}/?legacy=1`, viewport: { width: 430, height: 932 }, shot: "/tmp/revive-legacy-430.png" },
  { name: "legacy-768", url: `${ORIGIN}/?legacy=1`, viewport: { width: 768, height: 1024 }, shot: "/tmp/revive-legacy-768.png" },
];

const report = {};
for (const c of cases) {
  report[c.name] = await runPage(ws, version.webSocketDebuggerUrl, c.url, c.viewport, c.shot);
}

ws.close();
chrome.kill("SIGKILL");
console.log(JSON.stringify(report, null, 2));
