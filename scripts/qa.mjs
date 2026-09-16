/**
 * Headless QA helper (Chrome DevTools Protocol).
 *
 * Usage: node scripts/qa.mjs <url> <outPrefix> [width] [height]
 * Captures console/exception errors and saves a screenshot.
 */
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const url = process.argv[2] || 'http://localhost:4173/';
const prefix = process.argv[3] || 'qa';
const width = Number(process.argv[4] || 1440);
const height = Number(process.argv[5] || 900);

const chrome = spawn('google-chrome', [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--use-angle=swiftshader',
  '--enable-unsafe-swiftshader',
  '--remote-debugging-port=9223',
  '--window-size=1920,1080',
  '--hide-scrollbars',
  'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9223/json/list');
      const tabs = await res.json();
      const page = tabs.find((t) => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch { /* retry */ }
    await sleep(300);
  }
  throw new Error('chrome did not start');
}

const ws = new WebSocket(await getWsUrl());
await new Promise((r, s) => { ws.onopen = r; ws.onerror = s; });

let id = 0;
const pending = new Map();
const logs = [];
ws.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  if (msg.method === 'Runtime.consoleAPICalled') {
    const { type, args } = msg.params;
    if (['error', 'warning'].includes(type)) {
      logs.push(`[${type}] ${args.map((a) => a.value ?? a.description ?? '').join(' ')}`);
    }
  }
  if (msg.method === 'Runtime.exceptionThrown') {
    logs.push(`[exception] ${msg.params.exceptionDetails.text} ${msg.params.exceptionDetails.exception?.description ?? ''}`);
  }
};
const send = (method, params = {}) => new Promise((resolve) => {
  const mid = ++id;
  pending.set(mid, resolve);
  ws.send(JSON.stringify({ id: mid, method, params }));
});

await send('Runtime.enable');
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 700 });
await send('Page.navigate', { url });
await sleep(4200); // allow 3D + animations to settle

const shot = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync(`${prefix}-${width}x${height}.png`, Buffer.from(shot.result.data, 'base64'));

const evalRes = await send('Runtime.evaluate', {
  expression: `JSON.stringify({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    h1: document.querySelector('h1')?.innerText?.slice(0,60),
    canvas: !!document.querySelector('canvas'),
    sections: [...document.querySelectorAll('section[id]')].map(s=>s.id),
  })`,
  returnByValue: true,
});
const metrics = JSON.parse(evalRes.result?.result?.value || '{}');
if (metrics.scrollW > metrics.clientW + 2) {
  logs.push(`[layout] horizontal overflow: scrollW=${metrics.scrollW} clientW=${metrics.clientW}`);
}

console.log('URL:', url);
console.log('METRICS:', JSON.stringify(metrics, null, 2));
console.log(logs.length ? `ISSUES (${logs.length}):\n` + [...new Set(logs)].join('\n') : 'NO CONSOLE ISSUES');

ws.close();
chrome.kill();
process.exit(0);
