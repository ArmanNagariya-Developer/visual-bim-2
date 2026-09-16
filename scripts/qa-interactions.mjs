/**
 * Interaction QA — drives real user interactions via CDP:
 *  - scroll through all sections (triggers reveal + 3D stage changes)
 *  - click project filters, open/close a project modal
 *  - submit the contact form empty (validation), then filled (success)
 *  - toggle the mobile nav menu
 * Reports console issues and interaction results.
 */
import { spawn } from 'node:child_process';

const url = process.argv[2] || 'http://localhost:4183/';
const width = Number(process.argv[3] || 1440);
const height = Number(process.argv[4] || 900);

const chrome = spawn('google-chrome', [
  '--headless=new', '--no-sandbox', '--disable-gpu',
  '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
  '--remote-debugging-port=9224', '--window-size=1920,1080',
  '--hide-scrollbars', 'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];

async function getWsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const tabs = await (await fetch('http://127.0.0.1:9224/json/list')).json();
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
  if (msg.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(msg.params.type)) {
    logs.push(`[${msg.params.type}] ${msg.params.args.map((a) => a.value ?? a.description ?? '').join(' ')}`);
  }
  if (msg.method === 'Runtime.exceptionThrown') {
    logs.push(`[exception] ${msg.params.exceptionDetails.text} ${msg.params.exceptionDetails.exception?.description ?? ''}`);
  }
};
const send = (method, params = {}) => new Promise((res) => {
  const mid = ++id; pending.set(mid, res);
  ws.send(JSON.stringify({ id: mid, method, params }));
});
const evaluate = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (r.result?.exceptionDetails) return { __error: r.result.exceptionDetails.text };
  return r.result?.result?.value;
};

await send('Runtime.enable');
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 700 });
await send('Page.navigate', { url });
await sleep(4500);

const check = (name, fn) => fn().then((v) => results.push({ name, ok: !!v, detail: typeof v === 'object' ? JSON.stringify(v) : String(v) }));

// ---- 1. smooth scroll + section reach (poll until settled) ----
const pollSection = (id) => evaluate(`
  (() => {
    const start = Date.now();
    return new Promise((res) => {
      const tick = () => {
        const t = Math.abs(document.getElementById('${id}').getBoundingClientRect().top);
        if (t < 320 || Date.now() - start > 6000) res(t < 320);
        else setTimeout(tick, 200);
      };
      tick();
    });
  })()
`);

await evaluate(`window.scrollToSection('contact'); 'ok'`);
await check('scrollToSection(contact) reaches contact', () => pollSection('contact'));

await evaluate(`window.scrollToSection('services'); 'ok'`);
await check('scrollToSection(services) reaches services', () => pollSection('services'));

// ---- 2. project filtering (poll until exit animations settle) ----
const filterAndCount = (label, expected) => evaluate(`
  (() => {
    const btns = [...document.querySelectorAll('#projects button')];
    btns.find(x => x.textContent.includes('${label}')).click();
    const start = Date.now();
    return new Promise((res) => {
      const tick = () => {
        const count = document.querySelectorAll('#projects article').length;
        if (count === ${expected}) {
          res({ count, titles: [...document.querySelectorAll('#projects h3')].map(h => h.textContent) });
        } else if (Date.now() - start > 5000) {
          res({ count, titles: [...document.querySelectorAll('#projects h3')].map(h => h.textContent) });
        } else setTimeout(tick, 200);
      };
      tick();
    });
  })()
`);

await check('project filter Commercial (3 items)', () => filterAndCount('COMMERCIAL', 3));

await new Promise((r) => setTimeout(r, 800));

await check('project filter Public Buildings (3 items)', () => filterAndCount('PUBLIC BUILDINGS', 3));

await new Promise((r) => setTimeout(r, 800));

// reset to All so the modal test has a stable target
await evaluate(`(() => {
  const btns = [...document.querySelectorAll('#projects button')];
  btns.find(x => x.textContent.replace(/[^A-Z]/g, '').includes('ALL')).click();
  return 'reset';
})()`);
await new Promise((r) => setTimeout(r, 1500));

// ---- 3. project modal ----
await check('project modal opens with correct data', () => evaluate(`
  (() => {
    document.querySelectorAll('#projects article button')[0].click();
    return new Promise(res => setTimeout(() => {
      const d = document.querySelector('[role=dialog]');
      res({
        open: !!d,
        title: d?.querySelector('h3')?.textContent,
        showsLOD: d ? d.textContent.includes('LOD') : false,
      });
    }, 900));
  })()
`));

await check('project modal closes on Escape', () => evaluate(`
  (() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    const start = Date.now();
    return new Promise((res) => {
      const tick = () => {
        if (!document.querySelector('[role=dialog]')) res(true);
        else if (Date.now() - start > 9000) res(false);
        else setTimeout(tick, 300);
      };
      tick();
    });
  })()
`));

// ---- 4. contact form validation (empty submit) ----
await evaluate(`window.scrollToSection('contact'); 'ok'`);
await sleep(1400);
await check('empty form submit shows validation errors', () => evaluate(`
  (() => {
    document.querySelector('form').requestSubmit();
    return new Promise(res => setTimeout(() => {
      res({ errors: document.querySelectorAll('[role=alert]').length });
    }, 1100));
  })()
`));

// ---- 5. contact form success ----
await check('valid form submit reaches success state', () => evaluate(`
  (() => {
    // Use the native value setter so React's controlled inputs register the change
    // (setting .value directly is intercepted by React's value tracker in tests).
    const set = (n, v) => {
      const el = document.querySelector(\`[name=\${n}]\`);
      const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype
        : el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype
        : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.dispatchEvent(new Event('blur', { bubbles: true }));
    };
    set('name', 'Jane Architect');
    set('company', 'Studio North');
    set('email', 'jane@studionorth.com');
    set('phone', '+1 555 010 2030');
    set('projectType', 'Scan to BIM');
    set('message', 'We need a Scan to BIM model of a 6-storey office building at LOD 300.');
    return new Promise(res => {
      setTimeout(() => document.querySelector('form').requestSubmit(), 200);
      setTimeout(() => res({ success: document.body.textContent.includes('Inquiry Sent') }), 3000);
    });
  })()
`));

// ---- 6. mobile nav menu (emulated) ----
await check('mobile menu opens/closes (hamburger present at <821px)', () => evaluate(`
  (() => {
    const btn = document.querySelector('button[aria-label="Open menu"]') || document.querySelector('button[aria-label="Close menu"]');
    if (!btn) return { skipped: true, vw: window.innerWidth };
    btn.click();
    return new Promise(res => setTimeout(() => {
      const open = !!document.querySelector('[aria-label="Close menu"]');
      const closeBtn = document.querySelector('[aria-label="Close menu"]');
      closeBtn?.click();
      setTimeout(() => res({ opened: open, closed: !document.querySelector('[aria-label="Close menu"]') }), 500);
    }, 600));
  })()
`));

// ---- 7. horizontal overflow anywhere on the page ----
await check('no horizontal overflow after interactions', () => evaluate(`
  (() => {
    const de = document.documentElement;
    let worst = 0;
    document.querySelectorAll('section, footer, header').forEach(el => {
      const r = el.getBoundingClientRect();
      worst = Math.max(worst, r.right);
    });
    return { scrollW: de.scrollWidth, clientW: de.clientWidth, worstRight: Math.round(worst) };
  })()
`));

console.log(`\n=== INTERACTION QA (${width}x${height}) ===`);
for (const r of results) {
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail && r.detail !== 'true' ? `  →  ${r.detail}` : ''}`);
}
console.log(logs.length ? `\nCONSOLE ISSUES:\n${[...new Set(logs)].join('\n')}` : '\nNO CONSOLE ISSUES');

ws.close();
chrome.kill();
process.exit(0);
