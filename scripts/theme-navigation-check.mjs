import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";

const baseUrl = process.argv.find((argument) => argument.startsWith("http"))
  ?? "http://127.0.0.1:4321";
const profile = await mkdtemp(join(tmpdir(), "blog-theme-check-"));
const chrome = spawn("google-chrome", [
  "--headless",
  "--disable-gpu",
  "--no-sandbox",
  "--remote-debugging-port=0",
  `--user-data-dir=${profile}`,
  "about:blank",
], { stdio: ["ignore", "ignore", "pipe"] });

const timeout = (ms) => new Promise((_, reject) =>
  setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms));

const debuggerUrl = Promise.race([
  new Promise((resolve, reject) => {
    let output = "";
    chrome.stderr.setEncoding("utf8");
    chrome.stderr.on("data", (chunk) => {
      output += chunk;
      const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) resolve(match[1]);
    });
    chrome.once("exit", (code) => reject(new Error(`Chrome exited with ${code}`)));
  }),
  timeout(10_000),
]);

let socket;

try {
  socket = new WebSocket(await debuggerUrl);
  await Promise.race([
    new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    }),
    timeout(5_000),
  ]);

  let nextId = 0;
  const pending = new Map();
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id) return;
    const callback = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) callback.reject(new Error(message.error.message));
    else callback.resolve(message.result);
  });

  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params, sessionId }));
  });

  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  await send("Page.enable", {}, sessionId);
  await send("Emulation.setEmulatedMedia", {
    media: "screen",
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  }, sessionId);

  const evaluate = async (expression) => {
    const { result, exceptionDetails } = await send("Runtime.evaluate", {
      expression,
      returnByValue: true,
    }, sessionId);
    if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text);
    return result.value;
  };

  const waitFor = async (expression, expected) => {
    const deadline = Date.now() + 8_000;
    while (Date.now() < deadline) {
      try {
        if (await evaluate(expression) === expected) return;
      } catch {}
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    throw new Error(`Expected ${expression} to equal ${JSON.stringify(expected)}`);
  };

  await send("Page.navigate", { url: `${baseUrl}/?theme=units` }, sessionId);
  await waitFor("document.readyState", "complete");
  await waitFor("Boolean(document.querySelector('[data-theme-toggle]'))", true);
  await waitFor("localStorage.getItem('site-theme')", "units");
  await waitFor("document.querySelector('[data-theme-transition][data-phase]').dataset.phase", "idle");
  console.log(`reduced motion:          ${await evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches")}`);
  await evaluate("document.querySelector('[data-theme-toggle]').click()");
  const initialPhase = await evaluate("document.querySelector('[data-theme-transition][data-phase]').dataset.phase");
  if (!["exit", "cover"].includes(initialPhase)) throw new Error(`Expected an active transition phase, got ${initialPhase}`);
  await waitFor("document.documentElement.dataset.theme", "newspaper");
  await waitFor("localStorage.getItem('site-theme')", "newspaper");
  await waitFor("document.querySelector('[data-theme-transition][data-phase]').dataset.phase", "idle");
  const before = await evaluate("document.documentElement.dataset.theme");
  const storedBefore = await evaluate("localStorage.getItem('site-theme')");

  await evaluate("document.querySelector('.np-desk__article-stack > a').click()");
  await waitFor("location.pathname.startsWith('/posts/')", true);
  await waitFor("document.readyState", "complete");
  await waitFor("document.documentElement.dataset.theme", "newspaper");
  const after = await evaluate("document.documentElement.dataset.theme");
  const storedAfter = await evaluate("localStorage.getItem('site-theme')");

  console.log(`theme before navigation: ${before}/${storedBefore}`);
  console.log(`theme after navigation:  ${after}/${storedAfter}`);
  if (after !== "newspaper" || storedAfter !== "newspaper") process.exitCode = 1;

  await evaluate("document.querySelector('.newspaper-theme-switch').click()");
  await waitFor("document.documentElement.dataset.theme", "units");
  await waitFor("localStorage.getItem('site-theme')", "units");
  await waitFor("document.querySelector('[data-theme-transition][data-phase]').dataset.phase", "idle");
  console.log("article switch back:     units/units");

  await send("Page.navigate", { url: `${baseUrl}/?theme=newspaper#np-articles` }, sessionId);
  await waitFor("document.readyState", "complete");
  await waitFor("document.documentElement.dataset.theme", "newspaper");
  await waitFor("Math.abs(document.querySelector('#np-articles').getBoundingClientRect().top) < 120", true);
  console.log("direct section anchor:   visible");

  await send("Emulation.setDeviceMetricsOverride", {
    width: 360,
    height: 800,
    deviceScaleFactor: 1,
    mobile: true,
  }, sessionId);
  await send("Page.navigate", { url: `${baseUrl}/?theme=newspaper` }, sessionId);
  await waitFor("document.documentElement.dataset.theme", "newspaper");
  await waitFor("document.documentElement.scrollWidth <= window.innerWidth", true);
  console.log("mobile page overflow:    none");

  await send("Emulation.setEmulatedMedia", {
    media: "screen",
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  }, sessionId);
  await send("Page.navigate", { url: `${baseUrl}/?theme=units` }, sessionId);
  await waitFor("localStorage.getItem('site-theme')", "units");
  await evaluate("document.querySelector('[data-theme-toggle]').click()");
  await waitFor("document.documentElement.dataset.theme", "newspaper");
  await waitFor("document.querySelector('[data-theme-transition][data-phase]').dataset.phase", "idle");
  console.log("reduced motion switch:   immediate/newspaper");
} finally {
  socket?.close();
  const exited = new Promise((resolve) => chrome.once("exit", resolve));
  chrome.kill();
  if (chrome.exitCode === null) {
    await Promise.race([
      exited,
      new Promise((resolve) => setTimeout(resolve, 2_000)),
    ]);
  }
  await new Promise((resolve) => setTimeout(resolve, 200));
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}
