import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import vm from 'node:vm';
const root = new URL('../dist/', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML IDs');
for (const match of html.matchAll(/\bhref="#([^"]+)"/g))
  assert(ids.includes(match[1]), `Missing anchor ${match[1]}`);
for (const match of html.matchAll(/\b(?:src|href)="([^"#]+)"/g)) {
  if (!/^(https?:|mailto:)/.test(match[1])) await access(new URL(match[1], root));
}
for (const match of html.matchAll(/\bfor="([^"]+)"/g))
  assert(ids.includes(match[1]), `Missing form control ${match[1]}`);
assert(
  html.includes('prefers-reduced-motion') ||
    (await readFile(new URL('styles.css', root), 'utf8')).includes('prefers-reduced-motion'),
);
assert(!/<script[^>]*src="https?:/.test(html), 'Unexpected third-party JavaScript');
const controls = new Map();
function element(id) {
  if (!controls.has(id))
    controls.set(id, {
      value: '',
      textContent: '',
      hidden: true,
      attrs: {},
      handlers: {},
      setAttribute(k, v) {
        this.attrs[k] = v;
      },
      getAttribute(k) {
        return this.attrs[k];
      },
      addEventListener(k, v) {
        this.handlers[k] = v;
      },
      appendChild() {},
      focus() {},
      select() {},
    });
  return controls.get(id);
}
const menu = element('menu');
menu.attrs['aria-expanded'] = 'false';
const serviceLink = {
  dataset: { service: 'AI-built software' },
  addEventListener(_, fn) {
    this.click = fn;
  },
};
const doc = {
  querySelector() {
    return menu;
  },
  getElementById: element,
  querySelectorAll() {
    return [serviceLink];
  },
  addEventListener(k, v) {
    this[k] = v;
  },
  createElement() {
    return element('created');
  },
};
const win = {
  location: { href: '' },
  matchMedia() {
    return { addEventListener() {} };
  },
};
let copied = '';
const context = {
  document: doc,
  window: win,
  navigator: {
    clipboard: {
      async writeText(value) {
        copied = value;
      },
    },
  },
  Date,
  encodeURIComponent,
};
vm.runInNewContext(await readFile(new URL('app.js', root), 'utf8'), context);
menu.handlers.click();
assert.equal(menu.attrs['aria-expanded'], 'true');
assert.equal(element('mobile-nav').hidden, false);
doc.keydown({ key: 'Escape' });
assert.equal(menu.attrs['aria-expanded'], 'false');
assert.equal(element('mobile-nav').hidden, true);
serviceLink.click();
assert.equal(element('service').value, 'AI-built software');
const form = element('brief-form');
form.elements = {
  name: { value: 'André & Co' },
  brief: { value: 'Legacy review? A&B #1 + new work' },
  service: { value: 'Legacy review & recovery' },
};
form.reportValidity = () => true;
form.handlers.submit({ preventDefault() {}, currentTarget: form });
const mail = win.location.href;
assert(mail.startsWith('mailto:hello@norvarden.com?'));
const query = new URLSearchParams(mail.split('?')[1]);
assert.equal(query.get('subject'), 'Norvarden enquiry — Legacy review & recovery');
assert(query.get('body').includes('Legacy review? A&B #1 + new work'));
assert(query.get('body').includes('André & Co'));
assert.equal(element('email-fallback').hidden, false);
await element('copy-brief').handlers.click();
assert(copied.includes('André & Co'));
console.log(
  'Passed: assets, anchors, form labels, reduced motion, mobile navigation, service selection, encoded email draft, copy fallback.',
);
