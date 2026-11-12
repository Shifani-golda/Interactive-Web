import { readFileSync, writeFileSync } from 'fs';

const c = readFileSync('src/main.jsx', 'utf8');

// Find the exact old hero section block
const heroStart = c.indexOf('      <section className="hero">\n');
// The hero section ends just before the problem section
const problemMarker = '\n      <section className="problem section-pad reveal">';
const heroEnd = c.indexOf(problemMarker, heroStart);

if (heroStart === -1 || heroEnd === -1) {
  console.error('Could not find hero section. heroStart:', heroStart, 'heroEnd:', heroEnd);
  process.exit(1);
}

console.log('Hero starts at char:', heroStart);
console.log('Hero ends at char:', heroEnd);
console.log('Old hero length:', heroEnd - heroStart);

// Replacement: just the HeroSection component call
const replacement = '      <HeroSection />';

const result = c.slice(0, heroStart) + replacement + c.slice(heroEnd);
writeFileSync('src/main.jsx', result, 'utf8');
console.log('Done. File updated.');

