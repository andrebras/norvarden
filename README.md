# Norvarden

The company website and custom vector identity for **Norvarden**, an independent software engineering company. Live at **https://www.norvarden.com**.

## Development

Install **Node.js 20 or newer**. There is no database, no environment variables, and no build step.

```sh
git clone git@github.com:andrebras/norvarden.git
cd norvarden
npm ci
npm run dev
```

Open **http://localhost:8000**. To change the port, run `PORT=8080 npm run dev`.

```sh
npm run format   # format HTML, CSS, JS, and Markdown with Prettier
npm test         # build, lint and run the site checks
```

`npm test` runs the linters and `scripts/check.mjs`. The checks cover local asset references, anchor targets, form labels, mobile menu behaviour, service selection, email encoding, and copying the enquiry draft. They do not replace a real desktop/mobile browser review.

CI (`.github/workflows/ci.yml`) runs `npm test` on every pull request and push to `main`.

## Monitoring

AppSignal (Norvarden organization) watches the site:

- **Uptime:** `https://www.norvarden.com/` is checked every minute from Europe and North America, with email alerts.
- **Front-end errors:** `src/monitoring.js` reports uncaught JavaScript errors. `npm run build` bundles it into `dist/monitoring.js` (not committed; the Pages workflow builds it). It only reports on `www.norvarden.com`, sends no form contents, and uses AppSignal's public front-end key.

## Structure

- `dist/index.html` — complete homepage, content, and metadata.
- `dist/styles.css` — responsive visual system, including reduced-motion support.
- `dist/app.js` — accessible mobile navigation and email brief preparation.
- `dist/404.html` — not-found page.
- `dist/robots.txt`, `dist/sitemap.xml` — crawler instructions and sitemap.
- `dist/CNAME` — custom domain for GitHub Pages.
- `dist/assets/logo.svg` — custom path-based Norvarden wordmark and N symbol; no font dependency.
- `dist/assets/symbol.svg` — transparent standalone N symbol.
- `dist/assets/logo-light.svg` — reversed wordmark for dark backgrounds.
- `dist/assets/mark.svg` — square favicon.
- `dist/assets/apple-touch-icon.png` — home-screen icon.
- `dist/assets/social.png` — 1200×630 social sharing image.
- `dist/assets/social.svg` — editable social artwork concept.
- `scripts/serve.mjs` — dependency-free local server.
- `scripts/check.mjs` — site checks.

Latest projects uses a typographic presentation without thumbnail illustrations. Plymico is marked free, BetweenStays links to betweenstays.eu, and DriveDeck is marked coming soon.

## Hosting

The site is hosted on **GitHub Pages**. `.github/workflows/pages.yml` runs the tests and publishes `dist/` on every push to `main`. There is no build command.

- **Domain:** `www.norvarden.com` is the canonical address; `norvarden.com` redirects to it.
- **DNS (Namecheap):** four `A` records for `@` pointing to GitHub Pages (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) and a `CNAME` record for `www` pointing to `andrebras.github.io`.

## Contact

The site uses **hello@norvarden.com**. Mail to it is delivered through Namecheap email forwarding to a personal inbox. This is forwarding only: there is no mailbox, so replies are sent from the receiving address.

The contact form prepares an email in the visitor's own email app. It does **not** send mail, store enquiries, or claim that an enquiry was delivered. A copy-draft option is provided if the email app does not open. No analytics or cookies are included.

## Identity

- Ink: `#1b211c`
- Warm ivory: `#f3f1e9`
- Signal green: `#d7f46a`
- Supporting forest: `#20281f`

The Waymark is formed by three ascending angular planes. The hero uses an offset outline and diagonal hatching, while the small logo stays clean. The wordmark uses custom SVG paths. System sans-serif typography and an editorial serif accent keep the site self-contained.

Messaging: **Software with a future.**

Services: custom software development, legacy review and recovery, AI-built application maintenance, and ongoing engineering care.

## Professional history

“Independent software engineering since 2011” refers to André’s independent professional activity, which began on 2011-06-24, as supplied by the founder. It does not claim that the Norvarden brand was established in 2011.
