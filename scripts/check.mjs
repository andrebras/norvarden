// Site checks that html-validate cannot express. HTML structure rules (unique
// ids, valid for=/aria references, labelled controls) live in .htmlvalidate.json.
// Usage: node scripts/check.mjs [dist-dir]
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';

const root = process.argv[2]
  ? pathToFileURL(process.argv[2].replace(/\/?$/, '/'))
  : new URL('../dist/', import.meta.url);
const pages = ['index.html', '404.html'];
const external = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i;

// Site-root paths ("/assets/x.svg") resolve against dist/, not the filesystem root.
const resolve = (path, base) =>
  path.startsWith('/') ? new URL(`.${path}`, root) : new URL(path, base);

async function load(page) {
  const html = await readFile(new URL(page, root), 'utf8');
  return { html, document: new JSDOM(html).window.document };
}

// Every local href/src resolves to a file in dist/, every #anchor to an id.
for (const page of pages) {
  const { document } = await load(page);
  const pageUrl = new URL(page, root);
  for (const el of document.querySelectorAll('[href], [src]')) {
    for (const attr of ['href', 'src']) {
      const value = el.getAttribute(attr)?.trim();
      if (value == null || external.test(value)) continue;
      const [path, fragment] = value.split('#');
      if (path === '') {
        if (fragment)
          assert(document.getElementById(fragment), `${page}: missing anchor #${fragment}`);
        continue;
      }
      const target = resolve(path.split('?')[0], pageUrl);
      assert(target.href.startsWith(root.href), `${page}: ${value} points outside dist/`);
      if (target.pathname.endsWith('/')) target.pathname += 'index.html';
      await access(target).catch(() => assert.fail(`${page}: missing file for ${attr}="${value}"`));
    }
  }

  // No third-party JavaScript.
  for (const script of document.querySelectorAll('script[src]'))
    assert(
      !external.test(script.getAttribute('src').trim()),
      `${page}: unexpected third-party script ${script.getAttribute('src')}`,
    );

  // Reduced motion is honoured by the page's own styles.
  const css = [...document.querySelectorAll('style')].map((style) => style.textContent);
  for (const link of document.querySelectorAll('link[rel~="stylesheet"][href]')) {
    const href = link.getAttribute('href');
    if (!external.test(href)) css.push(await readFile(resolve(href, pageUrl), 'utf8'));
  }
  assert(
    /@media[^{]*prefers-reduced-motion\s*:\s*reduce/.test(css.join('\n')),
    `${page}: no prefers-reduced-motion: reduce rule`,
  );
}

// Behaviour of app.js, run against a real DOM built from index.html.
// jsdom has no matchMedia, clipboard or navigation, so those are stubbed.
async function runApp({ clipboardFails = false } = {}) {
  const { html } = await load('index.html');
  const { window } = new JSDOM(html);
  const { document } = window;
  const location = { href: '' };
  let copied = '';
  const browser = {
    location,
    matchMedia: () => ({ matches: false, addEventListener() {} }),
  };
  const navigator = {
    clipboard: {
      async writeText(value) {
        if (clipboardFails) throw new Error('denied');
        copied = value;
      },
    },
  };
  vm.runInNewContext(await readFile(new URL('app.js', root), 'utf8'), {
    document,
    window: browser,
    navigator,
  });
  return { window, document, location, copied: () => copied };
}

const app = await runApp();
const { document: doc, window: win } = app;
const menu = doc.querySelector('.menu-toggle');
const mobileNav = doc.getElementById('mobile-nav');

assert.equal(doc.getElementById('year').textContent, String(new Date().getFullYear()));

menu.click();
assert.equal(menu.getAttribute('aria-expanded'), 'true');
assert.equal(mobileNav.hidden, false);
doc.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Escape' }));
assert.equal(menu.getAttribute('aria-expanded'), 'false');
assert.equal(mobileNav.hidden, true);
assert.equal(doc.activeElement, menu, 'Escape returns focus to the menu button');

menu.click();
mobileNav.querySelector('a').click();
assert.equal(mobileNav.hidden, true, 'Following a mobile link closes the menu');

// Every data-service link must select a real <option>.
const service = doc.getElementById('service');
const serviceLinks = doc.querySelectorAll('[data-service]');
assert(serviceLinks.length > 0, 'No [data-service] links');
for (const link of serviceLinks) {
  link.click();
  assert.equal(service.value, link.dataset.service, `No <option> for "${link.dataset.service}"`);
}

const form = doc.getElementById('brief-form');
function submitBrief(target) {
  target.service.value = 'Legacy review & recovery';
  target.form.elements.name.value = 'André & Co';
  target.form.elements.brief.value = 'Legacy review? A&B #1 + new work';
  target.form.dispatchEvent(new target.win.Event('submit', { cancelable: true }));
}
submitBrief({ form, service, win });
const mail = app.location.href;
assert(mail.startsWith('mailto:hello@norvarden.com?'));
const query = new URLSearchParams(mail.split('?')[1]);
assert.equal(query.get('subject'), 'Norvarden enquiry — Legacy review & recovery');
assert(query.get('body').includes('Legacy review? A&B #1 + new work'));
assert(query.get('body').includes('André & Co'));
assert.equal(doc.getElementById('email-fallback').hidden, false);

doc.getElementById('copy-brief').click();
await new Promise((resolve) => setTimeout(resolve));
assert(app.copied().includes('André & Co'));
assert.match(doc.getElementById('copy-status').textContent, /^Copied/);

// Clipboard unavailable: the draft is shown in a textarea instead.
const denied = await runApp({ clipboardFails: true });
submitBrief({
  form: denied.document.getElementById('brief-form'),
  service: denied.document.getElementById('service'),
  win: denied.window,
});
denied.document.getElementById('copy-brief').click();
await new Promise((resolve) => setTimeout(resolve));
const draft = denied.document.getElementById('draft-text');
assert(draft, 'Copy fallback textarea not created');
assert(draft.value.includes('André & Co'));
assert.equal(denied.document.activeElement, draft);

console.log(
  'Passed: assets and anchors (index, 404), reduced motion, no third-party scripts, mobile navigation, service selection, encoded email draft, copy and copy fallback.',
);
