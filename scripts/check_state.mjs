import { readFileSync } from 'fs';
const c = readFileSync('src/main.jsx', 'utf8');
const idx1 = c.indexOf('<section className="hero"');
const idxH = c.indexOf('<HeroSection />');
const idxH2 = c.indexOf('<HeroSection />', idxH + 1);
console.log('Original hero <section className="hero" at:', idx1);
console.log('First <HeroSection /> at index:', idxH, 'line ~', c.slice(0, idxH).split('\n').length);
console.log('Second <HeroSection /> at index:', idxH2, 'line ~', idxH2 > 0 ? c.slice(0, idxH2).split('\n').length : 'n/a');

