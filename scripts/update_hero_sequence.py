import sys

with open('src/main.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace HeroIntroPreloader component
preloader_start = '/* ─── Awwwards-Style Hero Intro Preloader Component ─── */'
preloader_end = '\nfunction App() {'

p_idx1 = content.find(preloader_start)
p_idx2 = content.find(preloader_end, p_idx1)

if p_idx1 == -1 or p_idx2 == -1:
    print(f"Error: preloader boundaries not found: {p_idx1}, {p_idx2}")
    sys.exit(1)

new_preloader_component = '''/* ─── Awwwards-Style Hero Intro Preloader Component (Unified Single-Layer Reveal) ─── */
function HeroIntroPreloader({ isLoading, counter }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="intro-preloader-root"
          initial={{ opacity: 1, clipPath: "circle(150% at 50% 50%)" }}
          exit={{
            clipPath: "circle(0% at 50% 50%)",
            opacity: 0,
            scale: 0.88,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          }}
        >
          <div className="intro-center">
            {/* Animated emerald green soundwave SVG */}
            <div className="intro-soundwave">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="intro-bar" />
              ))}
            </div>

            <div className="intro-counter-wrap">
              <span className="intro-counter">{counter}</span>
              <span className="intro-counter-unit">%</span>
            </div>

            <div className="intro-subtext">
              <span className="intro-dot" />
              <span>Listening to your business...</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}'''

content = content[:p_idx1] + new_preloader_component + content[p_idx2:]

# 2. Update states in App()
old_state_block = """  const [activeNav, setActiveNav] = useState('how');
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(false);"""

new_state_block = """  const [activeNav, setActiveNav] = useState('how');
  const [isLoading, setIsLoading] = useState(true);
  const [introCounter, setIntroCounter] = useState(0);

  useEffect(() => {
    const duration = 1200; // 1.2s progression
    const startTime = performance.now();
    let animId;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const val = Math.floor(progress * 100);
      setIntroCounter(val);

      if (progress < 1) {
        animId = requestAnimationFrame(tick);
      } else {
        setIntroCounter(100);
        setTimeout(() => {
          setIsLoading(false);
        }, 80);
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);"""

if old_state_block not in content:
    print("Error: old_state_block not found")
    sys.exit(1)

content = content.replace(old_state_block, new_state_block, 1)

# 3. Update Preloader call in App()
old_preloader_call = "<HeroIntroPreloader onStartReveal={() => setHeroRevealed(true)} onComplete={() => setPreloaderDone(true)} />"
new_preloader_call = "<HeroIntroPreloader isLoading={isLoading} counter={introCounter} />"

if old_preloader_call not in content:
    print("Error: old_preloader_call not found")
    sys.exit(1)

content = content.replace(old_preloader_call, new_preloader_call, 1)

# 4. Update the Hero section animation bindings
old_hero_start = '<section className="hero">'
old_hero_end = '</section>\n\n      <section className="problem'

hero_s = content.find(old_hero_start)
hero_e = content.find(old_hero_end, hero_s)

if hero_s == -1 or hero_e == -1:
    print(f"Error: hero boundaries not found: {hero_s}, {hero_e}")
    sys.exit(1)

new_hero = '''<section className="hero">
        <div className="hero-glow"></div>
        <div className="hero-copy">
          <motion.div
            className="eyebrow"
            initial={{ opacity: 0, y: 14 }}
            animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="eyebrow-dot"></span> BUILT FOR THE WAY YOU WORK
          </motion.div>

          <h1>
            <span className="hero-split-word">
              <motion.span
                className="hero-split-inner"
                initial={{ y: 30, opacity: 0 }}
                animate={!isLoading ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                Just
              </motion.span>
            </span>
            <span className="hero-split-word">
              <motion.span
                className="hero-split-inner"
                initial={{ y: 30, opacity: 0 }}
                animate={!isLoading ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.23, ease: [0.16, 1, 0.3, 1] }}
              >
                speak.
              </motion.span>
            </span>
            <br />
            <span className="hero-split-word">
              <motion.span
                className="hero-split-inner"
                initial={{ y: 30, opacity: 0 }}
                animate={!isLoading ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.31, ease: [0.16, 1, 0.3, 1] }}
              >
                Your
              </motion.span>
            </span>
            <span className="hero-split-word">
              <motion.span
                className="hero-split-inner"
                initial={{ y: 30, opacity: 0 }}
                animate={!isLoading ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.39, ease: [0.16, 1, 0.3, 1] }}
              >
                ledger
              </motion.span>
            </span>
            <span className="hero-split-word">
              <motion.span
                className="hero-split-inner"
                initial={{ y: 30, opacity: 0 }}
                animate={!isLoading ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.47, ease: [0.16, 1, 0.3, 1] }}
              >
                is
              </motion.span>
            </span>
            <span className="hero-split-word">
              <motion.span
                className="hero-split-inner"
                initial={{ y: 30, opacity: 0 }}
                animate={!isLoading ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <span>done.</span>
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="hero-lead"
            initial={{ opacity: 0, y: 16 }}
            animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.65, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
          >
            Your business moves fast. Keep your accounts just as effortlessly. Speak naturally, and let your day book catch up.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.65, delay: 0.70, ease: [0.16, 1, 0.3, 1] }}
          >
            <a className="btn-primary" href="#demo">Try the live demo <ArrowRight size={17} /></a>
            <a className="btn-quiet" href="#how"><span className="play-icon">▶</span> See how it works</a>
          </motion.div>

          <motion.div
            className="hero-proof"
            initial={{ opacity: 0, y: 14 }}
            animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.65, delay: 0.78, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="avatar-stack"><span>P</span><span>R</span><span>S</span></div>
            <span>Made for everyday business</span>
            <span className="proof-divider"></span>
            <span className="proof-stars">★★★★★</span>
            <span>Simple by design</span>
          </motion.div>
        </div>

        <motion.div
          className="hero-product"
          aria-label="Interactive product preview"
          initial={{ y: 60, opacity: 0, rotateY: -8, rotateX: 4 }}
          animate={!isLoading ? { y: 0, opacity: 1, rotateY: 0, rotateX: 0 } : { y: 60, opacity: 0, rotateY: -8, rotateX: 4 }}
          transition={{ type: "spring", stiffness: 100, damping: 16, delay: 0.25 }}
          style={{ transformPerspective: 1000, transformStyle: "preserve-3d" }}
        >
          <div className="orbit orbit-one"></div>
          <div className="orbit orbit-two"></div>

          <motion.div
            className="float-card float-income"
            initial={{ scale: 0, opacity: 0 }}
            animate={!isLoading ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.85 }}
          >
            <span className="float-icon green"><ArrowDownRight size={15} /></span>
            <div><small>Money received</small><strong>+₹12,400</strong></div>
            <span className="float-check"><Check size={13} /></span>
          </motion.div>

          <div className="phone">
            <div className="phone-top"><span>9:41</span><span className="phone-speaker"></span><span>◉ ◈</span></div>
            <div className="phone-head"><div><small>GOOD MORNING</small><h3>Your business</h3></div><div className="profile-dot">P</div></div>
            <div className="balance-card"><div className="balance-label"><Wallet size={14} /> TODAY'S OVERVIEW</div><div className="balance-number">₹12,840</div><div className="balance-foot"><span><i className="mini-dot"></i> Cash balance</span><span className="balance-change">↑ 12.8%</span></div><div className="mini-bars">{[28, 42, 34, 58, 44, 72, 52, 84, 62, 75, 55, 92].map((h, i) => <span key={i} style={{ height: h + '%' }} />)}</div></div>
            <div className="phone-section-title">Recent activity <span>View all →</span></div>
            {[['↙', 'Ravi paid you', 'Today · 10:18 AM', '+₹2,400', 'positive'], ['↗', 'Stock purchase', 'Today · 09:42 AM', '−₹1,620', 'negative'], ['◷', 'Lakshmi · Udhār', 'Yesterday', '₹850 due', 'credit']].map((x, i) => <div className="phone-transaction" key={i}><span className={'transaction-icon ' + x[4]}>{x[0]}</span><div className="transaction-text"><b>{x[1]}</b><small>{x[2]}</small></div><strong className={x[4]}>{x[3]}</strong></div>)}
            <div className="phone-mic"><Mic size={19} /><span>Tap to speak a transaction</span><span className="mic-wave"><i /><i /><i /><i /><i /></span></div>
          </div>

          <motion.div
            className="float-card float-saved"
            initial={{ scale: 0, opacity: 0 }}
            animate={!isLoading ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.98 }}
          >
            <span className="saved-check"><Check size={15} /></span>
            <div><strong>Entry saved</strong><small>Just like that.</small></div>
          </motion.div>

          <div className="hero-note"><Sparkles size={14} /> Less typing. More doing.</div>
        </motion.div>

        <div className="hero-bottom"><span>MADE FOR BUSINESSES THAT NEVER STAND STILL</span><div><span>Retail</span><span>Food &amp; beverage</span><span>Services</span><span>Small businesses</span></div></div>
      </section>'''

content = content[:hero_s] + new_hero + content[hero_e + len('</section>'):]

with open('src/main.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated Hero preloader & entrance sequence in src/main.jsx!")

