import { readFileSync, writeFileSync } from 'fs';

let c = readFileSync('src/main.jsx', 'utf8');

// Find the first <HeroSection /> usage (top hero position, line ~773)
// It appears as: "      <HeroSection />\n      <section className=\"problem"
const topPlaceholder = '      <HeroSection />\n      <section className="problem';
const topIdx = c.indexOf(topPlaceholder);

if (topIdx === -1) {
  console.error('ERROR: Could not find top HeroSection placeholder. Searching for alternatives...');
  const idx = c.indexOf('<HeroSection />');
  console.log('Raw <HeroSection /> at index:', idx);
  console.log('Context:', JSON.stringify(c.slice(Math.max(0, idx-30), idx+80)));
  process.exit(1);
}

console.log('Found top HeroSection placeholder at index:', topIdx);

const originalHeroJSX = `      <section className="hero">
        <div className="hero-glow"></div>
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot"></span> BUILT FOR THE WAY YOU WORK</div>
          <h1>Just speak.<br />Your ledger is <span>done.</span></h1>
          <p className="hero-lead">Your business moves fast. Keep your accounts just as effortlessly. Speak naturally, and let your day book catch up.</p>
          <div className="hero-actions"><a className="btn-primary" href="#demo">Try the live demo <ArrowRight size={17} /></a><a className="btn-quiet" href="#how"><span className="play-icon">▶</span> See how it works</a></div>
          <div className="hero-proof"><div className="avatar-stack"><span>P</span><span>R</span><span>S</span></div><span>Made for everyday business</span><span className="proof-divider"></span><span className="proof-stars">★★★★★</span><span>Simple by design</span></div>
        </div>
        <div className="hero-product" aria-label="Interactive product preview">
          <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
          <div className="float-card float-income"><span className="float-icon green"><ArrowDownRight size={15} /></span><div><small>Money received</small><strong>+₹12,400</strong></div><span className="float-check"><Check size={13} /></span></div>
          <div className="phone">
            <div className="phone-top"><span>9:41</span><span className="phone-speaker"></span><span>◉ ◈</span></div>
            <div className="phone-head"><div><small>GOOD MORNING</small><h3>Your business</h3></div><div className="profile-dot">P</div></div>
            <div className="balance-card"><div className="balance-label"><Wallet size={14} /> TODAY'S OVERVIEW</div><div className="balance-number">₹12,840</div><div className="balance-foot"><span><i className="mini-dot"></i> Cash balance</span><span className="balance-change">↑ 12.8%</span></div><div className="mini-bars">{[28, 42, 34, 58, 44, 72, 52, 84, 62, 75, 55, 92].map((h, i) => <span key={i} style={{ height: h + '%' }} />)}</div></div>
            <div className="phone-section-title">Recent activity <span>View all →</span></div>
            {[['↙', 'Ravi paid you', 'Today · 10:18 AM', '+₹2,400', 'positive'], ['↗', 'Stock purchase', 'Today · 09:42 AM', '−₹1,620', 'negative'], ['◷', 'Lakshmi · Udhār', 'Yesterday', '₹850 due', 'credit']].map((x, i) => <div className="phone-transaction" key={i}><span className={'transaction-icon ' + x[4]}>{x[0]}</span><div className="transaction-text"><b>{x[1]}</b><small>{x[2]}</small></div><strong className={x[4]}>{x[3]}</strong></div>)}
            <div className="phone-mic"><Mic size={19} /><span>Tap to speak a transaction</span><span className="mic-wave"><i /><i /><i /><i /><i /></span></div>
          </div>
          <div className="float-card float-saved"><span className="saved-check"><Check size={15} /></span><div><strong>Entry saved</strong><small>Just like that.</small></div></div>
          <div className="hero-note"><Sparkles size={14} /> Less typing. More doing.</div>
        </div>
        <div className="hero-bottom"><span>MADE FOR BUSINESSES THAT NEVER STAND STILL</span><div><span>Retail</span><span>Food &amp; beverage</span><span>Services</span><span>Small businesses</span></div></div>
      </section>

      <section className="problem`;

c = c.slice(0, topIdx) + originalHeroJSX + c.slice(topIdx + topPlaceholder.length);

writeFileSync('src/main.jsx', c, 'utf8');
console.log('✓ Original hero restored at top position.');
console.log('✓ src/main.jsx written successfully.');

