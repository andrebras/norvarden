'use strict';
const menu = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Open navigation');
  mobileNav.hidden = true;
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  mobileNav.hidden = !open;
});
mobileNav.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !mobileNav.hidden) {
    closeMenu();
    menu.focus();
  }
});
window.matchMedia('(min-width: 761px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu();
});
document.querySelectorAll('[data-service]').forEach((link) => {
  link.addEventListener('click', () => {
    document.getElementById('service').value = link.dataset.service;
  });
});
document.getElementById('year').textContent = new Date().getFullYear();
let emailDraft = '';
document.getElementById('brief-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const name = form.elements.name.value.trim();
  const brief = form.elements.brief.value.trim();
  if (!name || !brief) return;
  const subject = 'Norvarden enquiry — ' + form.elements.service.value;
  const body = 'Hello Norvarden,\n\n' + brief + '\n\n' + name;
  emailDraft = 'To: hello@norvarden.com\nSubject: ' + subject + '\n\n' + body;
  document.getElementById('email-fallback').hidden = false;
  window.location.href =
    'mailto:hello@norvarden.com?subject=' +
    encodeURIComponent(subject) +
    '&body=' +
    encodeURIComponent(body);
});
document.getElementById('copy-brief').addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText(emailDraft);
    status.textContent = 'Copied. Paste this into your email app.';
  } catch {
    status.textContent = 'Copy the draft below:';
    let draft = document.getElementById('draft-text');
    if (!draft) {
      draft = document.createElement('textarea');
      draft.id = 'draft-text';
      draft.readOnly = true;
      draft.setAttribute('aria-label', 'Email draft to copy');
      document.getElementById('email-fallback').appendChild(draft);
    }
    draft.value = emailDraft;
    draft.focus();
    draft.select();
  }
});
