import { readFileSync, writeFileSync } from 'fs';

let c = readFileSync('src/main.jsx', 'utf8');

// The entire how-section block to replace (single line 804 + lines 805-806)
const OLD = `      <section id="how" className="how-section section-pad reveal"><div className="section-heading"><div><div className="section-kicker">THREE STEPS. THAT'S IT.</div><h2>From voice to <em>visibility.</em></h2></div><p className="muted">No accounting degree required.<br />Just your voice and your business.</p></div>\n        <HeroSection />\n      </section>`;

// Replace with bare <HeroSection /> - no wrapper, no heading, no container
const NEW = `      <HeroSection />`;

if (!c.includes(OLD)) {
  // Fallback: try to find by unique markers and replace the whole block
  const start = c.indexOf('      <section id="how"');
  const end = c.indexOf('\n\n      <section id="features"');
  if (start === -1 || end === -1) {
    console.error('ERROR: Could not locate how-section block. start:', start, 'end:', end);
    process.exit(1);
  }
  const block = c.slice(start, end);
  console.log('Using fallback. Block found:', JSON.stringify(block.slice(0, 120)));
  c = c.slice(0, start) + NEW + c.slice(end);
} else {
  c = c.replace(OLD, NEW);
  console.log('✓ Exact match replaced.');
}

writeFileSync('src/main.jsx', c, 'utf8');
console.log('✓ how-section wrapper + headers removed. HeroSection rendered standalone.');
console.log('✓ src/main.jsx written.');

