# Waymark identity comparison

Alternative logo 02. The original Norvarden deployment and main branch remain unchanged. Only the logo assets, favicon, hero symbol, and corresponding sharing artwork differ.

# Norvarden

The company website and custom vector identity for **Norvarden**, an independent software engineering company.

## Run locally

Install **Node.js 20 or newer**. No package installation, database, environment variables, or build step is required.

```sh
git clone git@github.com:andrebras/norvarden.git
cd norvarden
npm run dev
```

Open **http://localhost:8000**. To change the port, run `PORT=8080 npm run dev`.

```sh
npm run check
```

Checks local asset references, anchor targets, form labels, JavaScript syntax, mobile menu behaviour, service selection, email encoding, and copying the enquiry draft. These checks do not replace a real desktop/mobile browser review.

## Structure

- `dist/index.html` — complete homepage, content, and metadata.
- `dist/styles.css` — responsive visual system, including reduced-motion support.
- `dist/app.js` — accessible mobile navigation and email brief preparation.
- `dist/assets/logo.svg` — custom path-based Norvarden wordmark and N symbol; no font dependency.
- `dist/assets/symbol.svg` — transparent standalone N symbol.
- `dist/assets/logo-light.svg` — reversed wordmark for dark backgrounds.
- `dist/assets/mark.svg` — square favicon.
- `dist/assets/social.png` — 1200×630 social sharing image.
- `dist/assets/social.svg` — editable social artwork concept.
- `scripts/serve.mjs` — dependency-free local server.
- `.openai/hosting.json` — private Sites preview deployment identity.

The product illustrations are original visual treatments, not screenshots of the applications. Plymico is marked free, BetweenStays links to betweenstays.eu, and DriveDeck is marked coming soon.

## Contact setup — required before public launch

The site uses **hello@norvarden.com** as its company contact address. This is a proposed address, not a provisioned or verified mailbox. Set it up with your email provider, or replace every occurrence in `dist/index.html` and `dist/app.js` with your chosen working address before launching publicly.

The contact form prepares an email in the visitor's own email app. It does **not** send mail, store enquiries, or claim that an enquiry was delivered. A copy-draft option is provided if the email app does not open. No analytics, third-party scripts, or cookies are included.

## Hosting

The complete deployable website is **`dist/`**. It can be hosted by any static host. There is no build command.

For a Git-connected host:

1. Connect `andrebras/norvarden` and select `main`.
2. Choose a static/no-framework project.
3. Leave the build command empty; set the publish/output directory to `dist`.
4. Verify the provider preview.
5. Add `norvarden.com` and follow that provider's DNS instructions. Choose either the apex or `www` as canonical and redirect the other.

Do not change domain DNS until a hosting target has been selected. The private Sites preview does not connect the purchased domain automatically.

The social sharing image uses the future public domain, `https://norvarden.com/assets/social.png`. It will resolve once the domain is connected to the public hosting.

## Identity

- Ink: `#1b211c`
- Warm ivory: `#f3f1e9`
- Signal green: `#d7f46a`
- Supporting forest: `#20281f`

The Waymark is formed by three ascending angular planes, reproducing the selected concept 02. The wordmark uses custom SVG paths. System sans-serif typography and an editorial serif accent keep the site self-contained.

Messaging: **Software with a future.**

Services: custom software development, legacy review and recovery, AI-built application maintenance, and ongoing engineering care.
