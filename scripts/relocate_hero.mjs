import { readFileSync, writeFileSync } from 'fs';

let c = readFileSync('src/main.jsx', 'utf8');

// ── 1. Replace <HeroSection /> in main with the original hero JSX ──────────
const heroPlaceholder = '      <HeroSection />\n      <section className="problem section-pad reveal">';

const originalHero = `      <section className="hero">
        <div className="hero-glow"></div>
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot"></span> BUILT FOR THE WAY YOU WORK</div>
          <h1>Just speak.<br />Your ledger is <span>done.</span></h1>
          <p className="hero-lead">Your business moves fast. Keep your accounts just as effortlessly. Speak naturally, and let your day book catch up.</p>
          <div className="hero-actions"><a className="btn-primary" href="#demo">Try the live demo <ArrowRight size={17} /></a><a className="btn-quiet" href="#how"><span className="play-icon">↘</span> See how it works</a></div>
          <div className="hero-proof"><div className="avatar-stack"><span>P</span><span>R</span><span>S</span></div><span>Made for everyday business</span><span className="proof-divider"></span><span className="proof-stars">✳</span><span>Simple by design</span></div>
        </div>
        <div className="hero-product" aria-label="Interactive product preview">
          <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
          <div className="float-card float-income"><span className="float-icon green"><ArrowDownRight size={15} /></span><div><small>Money received</small><strong>+₹2,400</strong></div><span className="float-check"><Check size={13} /></span></div>
          <div className="phone">
            <div className="phone-top"><span>9:41</span><span className="phone-speaker"></span><span>◔ ▰</span></div>
            <div className="phone-head"><div><small>GOOD MORNING</small><h3>Your business</h3></div><div className="profile-dot">P</div></div>
            <div className="balance-card"><div className="balance-label"><Wallet size={14} /> TODAY'S OVERVIEW</div><div className="balance-number">₹12,840</div><div className="balance-foot"><span><i className="mini-dot"></i> Cash balance</span><span className="balance-change">↗ 12.8%</span></div><div className="mini-bars">{[28, 42, 34, 58, 44, 72, 52, 84, 62, 75, 55, 92].map((h, i) => <span key={i} style={{ height: h + '%' }} />)}</div></div>
            <div className="phone-section-title">Recent activity <span>View all ↗</span></div>
            {[['↙', 'Ravi paid you', 'Today · 10:18 AM', '+₹2,400', 'positive'], ['↗', 'Stock purchase', 'Today · 09:42 AM', '−₹620', 'negative'], ['◷', 'Lakshmi · Udhār', 'Yesterday', '₹850 due', 'credit']].map((x, i) => <div className="phone-transaction" key={i}><span className={'transaction-icon ' + x[4]}>{x[0]}</span><div className="transaction-text"><b>{x[1]}</b><small>{x[2]}</small></div><strong className={x[4]}>{x[3]}</strong></div>)}
            <div className="phone-mic"><Mic size={19} /><span>Tap to speak a transaction</span><span className="mic-wave"><i /><i /><i /><i /><i /></span></div>
          </div>
          <div className="float-card float-saved"><span className="saved-check"><Check size={15} /></span><div><strong>Entry saved</strong><small>Just like that.</small></div></div>
          <div className="hero-note"><Sparkles size={14} /> Less typing. More doing.</div>
        </div>
        <div className="hero-bottom"><span>MADE FOR BUSINESSES THAT NEVER STAND STILL</span><div><span>Retail</span><span>Food &amp; beverage</span><span>Services</span><span>Small businesses</span></div></div>
      </section>

      <section className="problem section-pad reveal">`;

if (!c.includes(heroPlaceholder)) {
  console.error('ERROR: Could not find <HeroSection /> placeholder in main.');
  process.exit(1);
}
c = c.replace(heroPlaceholder, originalHero);
console.log('✓ Original hero restored in top position.');

// ── 2. Replace step cards inside how-section with <HeroSection /> ──────────
// The how-section line contains the heading + the .steps div with 3 step cards.
// We keep the section wrapper + heading, replace .steps content with <HeroSection />.
const howSectionOld = `      <section id="how" className="how-section section-pad reveal"><div className="section-heading"><div><div className="section-kicker">THREE STEPS. THAT'S IT.</div><h2>From voice to <em>visibility.</em></h2></div><p className="muted">No accounting degree required.<br />Just your voice and your business.</p></div>
        <div className="steps"><div className="step-line"></div>{[['01', 'Say it naturally', '"Ravi paid me 2,400 rupees."', 'mic'], ['02', 'We make sense of it', 'Your words become a clear entry.', 'spark'], ['03', 'Your books stay ready', 'See your day, your way.', 'chart']].map((s, i) => <div className="step" key={s[0]}><div className="step-num">{s[0]}</div><div className="step-icon">{s[3] === 'mic' ? <Mic /> : s[3] === 'spark' ? <Sparkles /> : <BarChart3 />}</div><h3>{s[1]}</h3><p>{s[2]}</p><span className="step-arrow">{i === 2 ? '✓' : '↗'}</span></div>)}</div>
      </section>`;

const howSectionNew = `      <section id="how" className="how-section section-pad reveal"><div className="section-heading"><div><div className="section-kicker">THREE STEPS. THAT'S IT.</div><h2>From voice to <em>visibility.</em></h2></div><p className="muted">No accounting degree required.<br />Just your voice and your business.</p></div>
        <HeroSection />
      </section>`;

if (!c.includes(howSectionOld)) {
  // Try to find partial match for diagnosis
  const partialIdx = c.indexOf('<div className="steps">');
  console.error('ERROR: Could not find how-section old content. .steps at:', partialIdx);
  process.exit(1);
}
c = c.replace(howSectionOld, howSectionNew);
console.log('✓ how-section step cards replaced with <HeroSection />.');

writeFileSync('src/main.jsx', c, 'utf8');
console.log('✓ src/main.jsx written successfully.');

