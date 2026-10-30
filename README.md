# Easy Kanakku — Interactive 2026 Redesign

A responsive React + Vite landing page and browser-only product demo built from the design brief in the supplied conversation.

## Run on Windows
1. Install Node.js LTS if it is not already installed.
2. Extract this ZIP.
3. Open the extracted folder in VS Code.
4. In the terminal, run:

```bash
npm install
npm run dev
```

5. Open the localhost URL shown in the terminal.

To check a production build:

```bash
npm run build
npm run preview
```

## What's interactive
- Five-language selector with sample phrases (English, Telugu, Tamil, Hindi, Kannada).
- Browser Web Speech API microphone flow where supported; sample and manual text input fallback.
- Transaction parsing preview with editable description, amount and category.
- Add transactions to a live in-page ledger; totals and filters update immediately.
- Income / expense / credit tabs.
- CSV export of the current demo ledger.
- Interactive Dashboard / Voice Entry / Udhār Ledger / Reports product-preview tabs.
- FAQ accordion, scroll-reveal transitions, hover states and responsive navigation.

## Important product limitations
- The speech-to-entry interpretation is a lightweight client-side demo parser, not an AI model.
- Browser speech recognition availability and language quality depend on browser/device settings.
- Demo entries are held in React state only. There is no backend, database, authentication or cloud persistence.
- Product UI panels use illustrative sample figures and should not be represented as live app screenshots.
- Confirm product claims, real Play Store URL, support contacts, and actual language/offline capabilities before publishing.

## Theme
- Charcoal: `#171923`
- Cream: `#F8F5EF`
- Green: `#18C66A`
- Yellow: `#F4C94D`
- White cards: `#FFFFFF`
- Secondary text: `#777777`
