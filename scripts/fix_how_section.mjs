import { readFileSync, writeFileSync } from 'fs';

let c = readFileSync('src/main.jsx', 'utf8');

// Find the how-section by id and replace ONLY the steps div inside it
// Lines 779-781 in the file. We identify by unique markers.

const stepsStart = '        <div className="steps">';
const stepsEnd = '</div>\n      </section>';

const stepsIdx = c.indexOf(stepsStart);
if (stepsIdx === -1) {
  console.error('ERROR: Could not find <div className="steps">');
  process.exit(1);
}

// Find the closing of the how-section after the steps div
// The pattern is </div>\n      </section> after the steps content
const afterSteps = c.indexOf('</div>\n      </section>', stepsIdx);
if (afterSteps === -1) {
  console.error('ERROR: Could not find closing </section> after steps');
  process.exit(1);
}

// The full block to replace: from stepsStart to end of the closing </div>\n      </section>
const replaceFrom = stepsIdx;
const replaceTo = afterSteps + '</div>\n      </section>'.length;

const oldBlock = c.slice(replaceFrom, replaceTo);
console.log('Found block to replace (first 120 chars):', JSON.stringify(oldBlock.slice(0, 120)));

const newBlock = `        <HeroSection />\n      </section>`;

c = c.slice(0, replaceFrom) + newBlock + c.slice(replaceTo);

writeFileSync('src/main.jsx', c, 'utf8');
console.log('✓ how-section step cards replaced with <HeroSection />.');
console.log('✓ src/main.jsx written successfully.');

