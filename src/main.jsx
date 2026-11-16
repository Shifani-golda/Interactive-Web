import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, AudioLines, BarChart3, Bell, Check,
  ChevronDown, CircleHelp, CreditCard, Download, FileText, Globe2, Mic, MicOff,
  Plus, ReceiptText, RotateCcw, ShieldCheck, Sparkles, TrendingUp, Wallet, X
} from 'lucide-react';
import './styles.css';
import './hero-v2.css';
import './features-hover.css';
import './card-stack-3d.css';
import './footer-morph.css';
import './hero-intro.css';

gsap.registerPlugin(ScrollTrigger);

/* ─── Hero Section Component ─── */
function HeroSection() {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const voiceTextRef = useRef(null);
  const entryTextRef = useRef(null);
  const textareaRef = useRef(null);

  const [heroRecording, setHeroRecording] = useState(false);
  const [heroTranscript, setHeroTranscript] = useState('');
  const [heroSubmitted, setHeroSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [savedText, setSavedText] = useState('');
  const heroRecognitionRef = useRef(null);

  /* ESC key dismiss for confirmation modal */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    if (showModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  /* GSAP scroll-pin + parallax effect */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=380',
          scrub: 1.2,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      /* Voice/Entry words shift outward */
      tl.to(voiceTextRef.current, { x: '-18%', opacity: 0.04, ease: 'none' }, 0);
      tl.to(entryTextRef.current, { x: '18%', opacity: 0.04, ease: 'none' }, 0);

      /* Center card scales up slightly */
      tl.to(cardRef.current, { scale: 1.05, ease: 'none' }, 0);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  /* Speech recognition */
  function startHeroVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setHeroTranscript('Live speech recognition is not supported in this browser. Try Chrome.');
      return;
    }
    const recognition = new SR();
    recognition.lang = 'en-IN';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onstart = () => setHeroRecording(true);
    recognition.onresult = (event) => {
      const text = Array.from(event.results)
        .map(r => r[0].transcript)
        .join(' ');
      setHeroTranscript(text);
    };
    recognition.onerror = () => setHeroRecording(false);
    recognition.onend = () => setHeroRecording(false);
    heroRecognitionRef.current = recognition;
    recognition.start();
  }

  function stopHeroVoice() {
    heroRecognitionRef.current?.stop();
    setHeroRecording(false);
  }

  function handleHeroMicClick() {
    if (heroRecording) {
      stopHeroVoice();
    } else {
      setHeroSubmitted(false);
      setHeroTranscript('');
      startHeroVoice();
    }
  }

  function handleHeroSubmit() {
    if (!heroTranscript.trim()) return;
    setSavedText(heroTranscript);
    setHeroSubmitted(true);
    setShowModal(true);
    setTimeout(() => setHeroSubmitted(false), 2800);
  }

  return (
    <section className="hero hero-v2" ref={containerRef}>
      {/* subtle dot-grid overlay inherited from .hero:before */}
      <div className="hero-glow" />

      {/* Background big words */}
      <span className="hero-bg-word hero-bg-voice" ref={voiceTextRef} aria-hidden="true">
        VOICE
      </span>
      <span className="hero-bg-word hero-bg-entry" ref={entryTextRef} aria-hidden="true">
        ENTRY
      </span>

      {/* Floating card */}
      <div className="hero-voice-card" ref={cardRef}>
        {/* Top pill */}
        <div className="hvc-pill">
          <span className="live-dot" />
          <span>Voice-first bookkeeping</span>
        </div>

        {/* Mic button */}
        <button
          className={`hvc-mic-btn${heroRecording ? ' recording' : ''}`}
          onClick={handleHeroMicClick}
          aria-label={heroRecording ? 'Stop listening' : 'Start voice entry'}
        >
          <div className="hvc-mic-rings" />
          {heroRecording
            ? <AudioLines size={32} />
            : <Mic size={32} />}
        </button>

        <p className="hvc-status">
          {heroRecording
            ? 'Listening… speak your transaction'
            : heroTranscript
              ? 'Tap submit to add to your ledger'
              : 'Tap the mic and speak naturally'}
        </p>

        {/* Transcript text box */}
        <div className="hvc-transcript-wrap">
          <textarea
            ref={textareaRef}
            className="hvc-transcript"
            value={heroTranscript}
            onChange={e => setHeroTranscript(e.target.value)}
            placeholder={heroRecording ? '' : 'e.g. "Ravi paid 2,400 rupees today"'}
            rows={2}
          />
          {heroRecording && (
            <span className="hvc-cursor" aria-hidden="true">|</span>
          )}
        </div>

        {/* Submit button */}
        <button
          className={`hvc-submit${heroSubmitted ? ' submitted' : ''}`}
          onClick={handleHeroSubmit}
          disabled={!heroTranscript.trim() || heroSubmitted}
        >
          {heroSubmitted
            ? <><Check size={15} /> Entry recorded</>
            : <><ArrowRight size={15} /> Submit entry</>}
        </button>

        {/* Sample chips */}
        <div className="hvc-samples">
          <span className="hvc-samples-label">Try a sample:</span>
          {['Received ₹2,400 from Ravi', 'Spent ₹620 on stock', 'Credit ₹850 to Lakshmi'].map(s => (
            <button key={s} className="hvc-sample-chip" onClick={() => { setHeroTranscript(s.replace('₹', '')); setHeroSubmitted(false); }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom ticker */}
      <div className="hero-bottom">
        <span>MADE FOR BUSINESSES THAT NEVER STAND STILL</span>
        <div>
          <span>Retail</span><span>Food &amp; beverage</span>
          <span>Services</span><span>Small businesses</span>
        </div>
      </div>

      {/* Clean, Witty Confirmation Popup Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="ek-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="ek-modal-card"
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="ek-modal-close"
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="ek-modal-pill">
                <Check size={14} />
                <span>ENTRY LOGGED</span>
              </div>

              <h3 className="ek-modal-title">
                Done. Your entry is saved in the app.
              </h3>

              <div className="ek-modal-receipt">
                <span className="ek-modal-receipt-label">Saved to your ledger:</span>
                <p className="ek-modal-receipt-text">“{savedText || heroTranscript || 'Received ₹2,400 from Ravi'}”</p>
              </div>

              <p className="ek-modal-subtext">
                Download Easy Kanaku to view it in your ledger.
              </p>

              <div className="ek-modal-store-grid">
                <a
                  href="https://play.google.com/store/apps/details?id=com.reflexlabs.easykanakku"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ek-modal-store-btn"
                >
                  <svg className="ek-store-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M3.609 1.814L13.793 12 3.61 22.186c-.347-.365-.549-.876-.549-1.45V3.264c0-.574.202-1.085.548-1.45zm11.242 11.243l2.091 2.091-11.834 6.84 9.743-8.931zm0-2.114L5.108 1.996l11.834 6.84-2.091 2.091zm1.472 1.057l3.664 2.118c.954.551.954 1.455 0 2.006l-3.664 2.118-2.355-2.355 2.355-1.887z"/>
                  </svg>
                  <div>
                    <span className="ek-store-label">GET IT ON</span>
                    <span className="ek-store-name">Google Play</span>
                  </div>
                </a>
                <a
                  href="https://apps.apple.com/in/app/easy-kanaku/id6815802230"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ek-modal-store-btn"
                >
                  <svg className="ek-store-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.73-.93 2.76 1.01.08 2.02-.51 2.64-1.26z"/>
                  </svg>
                  <div>
                    <span className="ek-store-label">DOWNLOAD ON</span>
                    <span className="ek-store-name">App Store</span>
                  </div>
                </a>
              </div>

              <div style={{ textAlign: "center", marginTop: "12px" }}>
                <button
                  type="button"
                  className="ek-modal-btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setHeroTranscript('');
                    setHeroSubmitted(false);
                    setTimeout(() => textareaRef.current?.focus(), 150);
                  }}
                >
                  Try another entry
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

const seedTransactions = [
  { id: 1, title: 'Tea and snacks', type: 'expense', amount: 180, time: '10:42 AM', note: 'Shop supplies' },
  { id: 2, title: 'Customer payment — Ravi', type: 'income', amount: 2400, time: '10:18 AM', note: 'Cash received' },
  { id: 3, title: 'Credit to Lakshmi', type: 'credit', amount: 850, time: 'Yesterday', note: 'Due in 7 days' },
  { id: 4, title: 'Milk delivery', type: 'expense', amount: 620, time: 'Yesterday', note: 'Supplier payment' },
];
const languageSamples = {
  English: 'Received 2,400 rupees from Ravi',
  తెలుగు: 'రవి నుంచి 2400 రూపాయలు వచ్చాయి',
  தமிழ்: 'ரவி 2400 ரூபாய் கொடுத்தார்',
  हिन्दी: 'रवि से 2400 रुपये मिले',
  ಕನ್ನಡ: 'ರವಿಯಿಂದ 2400 ರೂಪಾಯಿ ಬಂದಿದೆ',
};
const money = n => '₹' + Number(n).toLocaleString('en-IN');
function parseEntry(raw) {
  const lower = raw.toLowerCase();
  const found = raw.replace(/,/g, '').match(/\d+(?:\.\d+)?/);
  const amount = found ? Number(found[0]) : 0;
  let type = /credit|udhar|borrow|due|later|బాకీ|கடன்|उधार|ಸಾಲ/.test(lower) ? 'credit'
    : /spent|expense|paid|bought|purchase|ఖర్చు|செலவு|खर्च|ಖರ್ಚು/.test(lower) ? 'expense' : 'income';
  let title = raw.replace(/\d+(?:\.\d+)?\s*(rupees?|rs\.?|రూపాయలు|ரூபாய்|रुपये|ರೂಪಾಯಿ)?/ig, '').trim();
  title = title.replace(/^(received|got|income|spent|paid|bought|expense|credit|gave|from|for|to)\s+/i, '').trim();
  if (!title) title = type === 'income' ? 'Customer payment' : type === 'expense' ? 'Business expense' : 'Customer credit';
  return { title: title.charAt(0).toUpperCase() + title.slice(1), amount, type };
}

const featuresData = [
  {
    id: "01",
    num: "01",
    title: "Voice in 5 languages",
    sub: "Tamil, Hindi, English, Telugu, Kannada",
    tag: "Speech AI",
    desc: "Speak naturally in Tamil, Hindi, English, Telugu, or Kannada with Indian-accent recognition. Zero typing needed.",
  },
  {
    id: "02",
    num: "02",
    title: "Credit Tracking",
    sub: "Who owes you, whom you owe",
    tag: "Credit Ledger",
    desc: "Track customer balances, send overdue reminders, record partial payments, and keep every promise in one place.",
  },
  {
    id: "03",
    num: "03",
    title: "Smart Dashboard",
    sub: "Today, week, month, FY views",
    tag: "Analytics",
    desc: "Cash and bank balance at a glance. Instant toggle between daily, weekly, monthly, and financial year views.",
  },
  {
    id: "04",
    num: "04",
    title: "Reports & Analytics",
    sub: "P&L, categories, payment breakdown",
    tag: "P&L Reports",
    desc: "Understand your profit & loss, top spending categories, and payment methods with one-click Excel and PDF export.",
  },
  {
    id: "05",
    num: "05",
    title: "Bill Attachments",
    sub: "Snap and store bills against transactions",
    tag: "Receipt Vault",
    desc: "Snap a quick photo of paper receipts and attach them directly to transactions. Never lose a bill again.",
  },
  {
    id: "06",
    num: "06",
    title: "Multi-Business",
    sub: "Separate ledgers, one app",
    tag: "Multi-Store",
    desc: "Run multiple shops or ventures? Manage completely separate day books and customer ledgers within a single login.",
  },
  {
    id: "07",
    num: "07",
    title: "Day Book",
    sub: "Daily cash & bank reconciliation",
    tag: "Reconciliation",
    desc: "Keep clean opening and closing balances every single day. Instant tally of total cash in, cash out, and credit.",
  },
  {
    id: "08",
    num: "08",
    title: "Daily Reminders",
    sub: "Set your time, get a summary",
    tag: "Reminders",
    desc: "Never forget an entry. Set an evening reminder to review your day book and send overdue credit alerts.",
  },
];;

const problemItems = [
  {
    id: "01",
    icon: FileText,
    title: "Too much typing",
    badge: "Voice replaces manual entry",
    description: "Every small sale shouldn't mean filling out a long form. When your counter is busy, typing rupee amounts into rigid screens slows down business and creates backlogs.",
  },
  {
    id: "02",
    icon: BarChart3,
    title: "Complicated entries",
    badge: "Zero jargon, pure clarity",
    description: "Keep your books clear without the confusion of traditional accounting software that forces double-entry debit/credit rules when all you need is simple, reliable cash flow.",
  },
  {
    id: "03",
    icon: Globe2,
    title: "Language barriers",
    badge: "5 native languages supported",
    description: "Speak in the language that feels natural to you. Break down the barrier of English-only bookkeeping with native speech recognition tailored for everyday Indian business.",
  },
];

const stepItems = [
  {
    id: "01",
    num: "01",
    icon: Mic,
    title: "Say it naturally",
    description: "Speak in your everyday voice. “Ravi paid me 2,400 rupees today” or “Spent 620 on milk delivery”. No rigid keywords or complex formats needed.",
    preview: (
      <div className="agency-step-preview voice-preview">
        <div className="agency-mic-pill">
          <AudioLines size={16} className="text-emerald" />
          <span>“Ravi paid me 2,400 rupees”</span>
          <span className="live-pulse"></span>
        </div>
      </div>
    ),
  },
  {
    id: "02",
    num: "02",
    icon: Sparkles,
    title: "We make sense of it",
    description: "The speech engine immediately recognizes the amount (₹2,400), contact (Ravi), and category (Income), creating a clean draft entry in seconds.",
    preview: (
      <div className="agency-step-preview parse-preview">
        <div className="agency-parse-chips">
          <span className="chip-item"><b>Customer:</b> Ravi</span>
          <span className="chip-item highlight"><b>Amount:</b> ₹2,400</span>
          <span className="chip-item"><b>Type:</b> Income</span>
          <span className="chip-check"><Check size={13} /></span>
        </div>
      </div>
    ),
  },
  {
    id: "03",
    num: "03",
    icon: BarChart3,
    title: "Your books stay ready",
    description: "Your daily ledger, cash flow overview, and customer credit ledger update automatically. Review, filter, or export CSV whenever you need.",
    preview: (
      <div className="agency-step-preview ledger-preview">
        <div className="agency-row-preview">
          <div className="row-left">
            <span className="ledger-type-dot income">↓</span>
            <div><b>Customer payment — Ravi</b><small>Today · 10:18 AM</small></div>
          </div>
          <strong className="text-emerald">+₹2,400</strong>
        </div>
      </div>
    ),
  },
];

function AgencyProblemCard({ item, index }) {
  const cardRef = useRef(null);
  const Icon = item.icon;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="agency-glass-card agency-problem-card"
    >
      <div
        className="agency-card-spotlight"
        style={{
          background: `radial-gradient(550px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(22, 163, 74, 0.10), transparent 45%)`,
        }}
      />
      <div className="agency-card-top">
        <div className="agency-icon-badge">
          <Icon size={20} />
        </div>
        <span className="agency-card-num">{item.id}</span>
      </div>
      <h3 className="agency-card-title">{item.title}</h3>
      <p className="agency-card-desc">{item.description}</p>
      <div className="agency-pill-badge">
        <span className="agency-bullet"></span>
        {item.badge}
      </div>
    </motion.div>
  );
}

function AgencyStepCard({ step, index }) {
  const cardRef = useRef(null);
  const Icon = step.icon;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="agency-glass-card agency-step-card"
    >
      <div
        className="agency-card-spotlight"
        style={{
          background: `radial-gradient(550px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(22, 163, 74, 0.12), transparent 45%)`,
        }}
      />
      <div className="agency-card-top">
        <div className="agency-icon-badge emerald">
          <Icon size={20} />
        </div>
        <span className="agency-step-pill">STEP {step.num}</span>
      </div>
      <h3 className="agency-card-title">{step.title}</h3>
      <p className="agency-card-desc">{step.description}</p>
      <div className="agency-card-interactive-preview">
        {step.preview}
      </div>
    </motion.div>
  );
}

/* ─── Stylized Feature Mockup SVGs ─── */
function VoiceMockupSVG() {
  return (
    <svg viewBox="0 0 380 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="380" height="220" fill="#F0FDF4" />
      <g transform="translate(40, 45)">
        {[18, 32, 54, 80, 42, 68, 92, 48, 76, 100, 60, 85, 45, 65, 38, 22].map((h, i) => (
          <rect
            key={i}
            x={i * 19}
            y={55 - h / 2}
            width="8"
            height={h}
            rx="4"
            fill={i === 9 || i === 8 ? "#166534" : "#A7F3D0"}
            opacity={0.3 + (h / 100) * 0.7}
          />
        ))}
      </g>
      <g transform="translate(35, 125)">
        <rect width="310" height="42" rx="12" fill="#FFFFFF" stroke="#166534" strokeWidth="1.5" />
        <circle cx="24" cy="21" r="11" fill="#DCFCE7" />
        <path d="M24 15v6m-3-3h6" stroke="#166534" strokeWidth="2" strokeLinecap="round" />
        <text x="46" y="26" fill="#1E293B" fontSize="13" fontWeight="600" fontFamily="sans-serif">
          “Ravi paid ₹2,400 for shop inventory”
        </text>
      </g>
      <g transform="translate(40, 180)">
        {["English", "தமிழ்", "हिंदी", "తెలుగు", "ಕನ್ನಡ"].map((lang, i) => (
          <g key={lang} transform={`translate(${i * 62}, 0)`}>
            <rect width="56" height="22" rx="11" fill="#FFFFFF" stroke="#E2E8F0" />
            <text x="28" y="15" fill={i === 0 ? "#166534" : "#64748B"} fontSize="11" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">
              {lang}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function UdhaarMockupSVG() {
  return (
    <svg viewBox="0 0 380 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="380" height="220" fill="#FEF2F2" />
      <g transform="translate(25, 20)">
        <rect width="155" height="52" rx="12" fill="#FFFFFF" stroke="#FECACA" strokeWidth="1.2" />
        <text x="14" y="22" fill="#991B1B" fontSize="10" fontWeight="700" letterSpacing="0.05em" fontFamily="sans-serif">YOU RECEIVE</text>
        <text x="14" y="42" fill="#DC2626" fontSize="18" fontWeight="800" fontFamily="sans-serif">₹14,250</text>
        
        <rect x="175" width="155" height="52" rx="12" fill="#FFFFFF" stroke="#BBF7D0" strokeWidth="1.2" />
        <text x="189" y="22" fill="#166534" fontSize="10" fontWeight="700" letterSpacing="0.05em" fontFamily="sans-serif">YOU OWE</text>
        <text x="189" y="42" fill="#166534" fontSize="18" fontWeight="800" fontFamily="sans-serif">₹3,800</text>
      </g>
      <g transform="translate(25, 84)">
        {[
          { name: "Lakshmi Stores", due: "Overdue by 3 days", amt: "₹850", status: "Overdue", bg: "#FEE2E2", text: "#DC2626" },
          { name: "Ramesh Kumar", due: "Due tomorrow", amt: "₹1,200", status: "Upcoming", bg: "#FEF3C7", text: "#D97706" },
          { name: "Suresh Provision", due: "Paid ₹1,000 partial", amt: "₹450", status: "Partial", bg: "#DCFCE7", text: "#166534" },
        ].map((c, i) => (
          <g key={c.name} transform={`translate(0, ${i * 42})`}>
            <rect width="330" height="36" rx="8" fill="#FFFFFF" stroke="#F1F5F9" />
            <circle cx="20" cy="18" r="10" fill={c.bg} />
            <text x="20" y="22" fill={c.text} fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
              {c.name.charAt(0)}
            </text>
            <text x="38" y="16" fill="#1E293B" fontSize="12" fontWeight="700" fontFamily="sans-serif">{c.name}</text>
            <text x="38" y="28" fill="#64748B" fontSize="10" fontFamily="sans-serif">{c.due}</text>
            <text x="260" y="22" fill="#1E293B" fontSize="13" fontWeight="800" textAnchor="end" fontFamily="sans-serif">{c.amt}</text>
            <rect x="272" y="8" width="50" height="20" rx="10" fill={c.bg} />
            <text x="297" y="22" fill={c.text} fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">{c.status}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function DashboardMockupSVG() {
  return (
    <svg viewBox="0 0 380 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="380" height="220" fill="#F8FAFC" />
      <g transform="translate(25, 18)">
        {["Today", "This Week", "Month", "FY 2026"].map((t, i) => (
          <g key={t} transform={`translate(${i * 84}, 0)`}>
            <rect width="76" height="24" rx="12" fill={i === 1 ? "#166534" : "#FFFFFF"} stroke={i === 1 ? "#166534" : "#E2E8F0"} />
            <text x="38" y="16" fill={i === 1 ? "#FFFFFF" : "#64748B"} fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">{t}</text>
          </g>
        ))}
      </g>
      <g transform="translate(25, 52)">
        <rect width="160" height="60" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
        <text x="16" y="22" fill="#64748B" fontSize="10" fontWeight="600" fontFamily="sans-serif">TOTAL CASH IN</text>
        <text x="16" y="46" fill="#166534" fontSize="20" fontWeight="800" fontFamily="sans-serif">₹24,800</text>
        
        <rect x="170" width="160" height="60" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
        <text x="186" y="22" fill="#64748B" fontSize="10" fontWeight="600" fontFamily="sans-serif">TOTAL CASH OUT</text>
        <text x="186" y="46" fill="#EF4444" fontSize="20" fontWeight="800" fontFamily="sans-serif">₹8,240</text>
      </g>
      <g transform="translate(25, 124)">
        <rect width="330" height="82" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
        <text x="16" y="20" fill="#1E293B" fontSize="11" fontWeight="700" fontFamily="sans-serif">Weekly Cash Flow</text>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => {
          const heights = [28, 42, 35, 50, 38, 48, 30];
          return (
            <g key={d} transform={`translate(${30 + i * 42}, 30)`}>
              <rect x="0" y={40 - heights[i]} width="12" height={heights[i]} rx="3" fill="#166534" />
              <rect x="15" y={40 - heights[i] * 0.4} width="12" height={heights[i] * 0.4} rx="3" fill="#FECACA" />
              <text x="13" y="49" fill="#94A3B8" fontSize="8" textAnchor="middle" fontFamily="sans-serif">{d}</text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function ReportsMockupSVG() {
  return (
    <svg viewBox="0 0 380 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="380" height="220" fill="#FAF5FF" />
      <g transform="translate(35, 30)">
        <circle cx="65" cy="65" r="50" stroke="#E9D5FF" strokeWidth="18" fill="none" />
        <circle cx="65" cy="65" r="50" stroke="#166534" strokeWidth="18" strokeDasharray="235 314" strokeLinecap="round" fill="none" transform="rotate(-90 65 65)" />
        <circle cx="65" cy="65" r="50" stroke="#A855F7" strokeWidth="18" strokeDasharray="60 314" strokeDashoffset="-235" strokeLinecap="round" fill="none" transform="rotate(-90 65 65)" />
        <text x="65" y="62" fill="#1E293B" fontSize="16" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">76%</text>
        <text x="65" y="76" fill="#64748B" fontSize="9" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">PROFIT</text>
      </g>
      <g transform="translate(180, 25)">
        {[
          { name: "Direct Sales", amt: "₹18,400", pct: "75%", color: "#166534" },
          { name: "Services & Repair", amt: "₹6,400", pct: "25%", color: "#A855F7" },
          { name: "Inventory Expense", amt: "₹5,200", pct: "63%", color: "#EF4444" },
          { name: "Shop Electricity", amt: "₹1,120", pct: "14%", color: "#F59E0B" },
        ].map((item, i) => (
          <g key={item.name} transform={`translate(0, ${i * 32})`}>
            <circle cx="6" cy="10" r="4" fill={item.color} />
            <text x="16" y="14" fill="#334155" fontSize="11" fontWeight="600" fontFamily="sans-serif">{item.name}</text>
            <text x="155" y="14" fill="#1E293B" fontSize="11" fontWeight="700" textAnchor="end" fontFamily="sans-serif">{item.amt}</text>
            <rect x="16" y="20" width="140" height="3" rx="1.5" fill="#E2E8F0" />
            <rect x="16" y="20" width={parseInt(item.pct) * 1.4} height="3" rx="1.5" fill={item.color} />
          </g>
        ))}
      </g>
      <g transform="translate(45, 165)">
        <rect width="290" height="34" rx="8" fill="#FFFFFF" stroke="#E2E8F0" />
        <path d="M25 17h12m-6-6v12" stroke="#166534" strokeWidth="2" strokeLinecap="round" />
        <text x="50" y="22" fill="#1E293B" fontSize="11" fontWeight="700" fontFamily="sans-serif">Export Full Financial Report (Excel / PDF)</text>
      </g>
    </svg>
  );
}

function BillsMockupSVG() {
  return (
    <svg viewBox="0 0 380 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="380" height="220" fill="#FFFBEB" />
      <g transform="translate(50, 20) rotate(-3)">
        <rect width="180" height="175" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
        <circle cx="90" cy="24" r="12" fill="#FEF3C7" />
        <text x="90" y="28" fill="#D97706" fontSize="12" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">★</text>
        <text x="90" y="48" fill="#1E293B" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">KUMAR TRADERS</text>
        <text x="90" y="60" fill="#64748B" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Invoice #8492 · 10:45 AM</text>
        <line x1="20" y1="70" x2="160" y2="70" stroke="#E2E8F0" strokeDasharray="3 3" />
        <text x="25" y="90" fill="#475569" fontSize="10" fontFamily="sans-serif">Milk crates (10x)</text>
        <text x="155" y="90" fill="#1E293B" fontSize="10" fontWeight="700" textAnchor="end" fontFamily="sans-serif">₹620</text>
        <text x="25" y="108" fill="#475569" fontSize="10" fontFamily="sans-serif">Ghee tins (2x)</text>
        <text x="155" y="108" fill="#1E293B" fontSize="10" fontWeight="700" textAnchor="end" fontFamily="sans-serif">₹1,000</text>
        <line x1="20" y1="120" x2="160" y2="120" stroke="#CBD5E1" />
        <text x="25" y="136" fill="#1E293B" fontSize="12" fontWeight="800" fontFamily="sans-serif">TOTAL</text>
        <text x="155" y="136" fill="#166534" fontSize="13" fontWeight="800" textAnchor="end" fontFamily="sans-serif">₹1,620</text>
        <rect x="25" y="148" width="60" height="14" rx="4" fill="#DCFCE7" />
        <text x="55" y="159" fill="#166534" fontSize="8" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">PAID IN CASH</text>
      </g>
      <g transform="translate(235, 55)">
        <rect width="115" height="120" rx="12" fill="#FFFFFF" stroke="#166534" strokeWidth="1.5" />
        <circle cx="57" cy="45" r="22" fill="#DCFCE7" />
        <circle cx="57" cy="45" r="10" fill="#166534" />
        <text x="57" y="85" fill="#1E293B" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">Bill Attached</text>
        <text x="57" y="100" fill="#64748B" fontSize="9" textAnchor="middle" fontFamily="sans-serif">bill_0492.jpg</text>
      </g>
    </svg>
  );
}

function MultiBusinessMockupSVG() {
  return (
    <svg viewBox="0 0 380 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="380" height="220" fill="#F0FDFA" />
      <g transform="translate(30, 20)">
        <text x="10" y="16" fill="#0F766E" fontSize="11" fontWeight="700" letterSpacing="0.06em" fontFamily="sans-serif">SWITCH BUSINESS</text>
        {[
          { name: "Priya's Kirana Store", type: "Retail Grocery", bal: "₹18,420", active: true },
          { name: "Ravi Textiles & Sarees", type: "Wholesale Fabric", bal: "₹42,800", active: false },
          { name: "Meena Sweets Corner", type: "Food & Dairy", bal: "₹9,150", active: false },
        ].map((b, i) => (
          <g key={b.name} transform={`translate(0, ${30 + i * 54})`}>
            <rect
              width="320"
              height="46"
              rx="10"
              fill={b.active ? "#FFFFFF" : "#F8FAFC"}
              stroke={b.active ? "#166534" : "#E2E8F0"}
              strokeWidth={b.active ? "2" : "1"}
            />
            <circle cx="24" cy="23" r="12" fill={b.active ? "#DCFCE7" : "#E2E8F0"} />
            <text x="24" y="27" fill={b.active ? "#166534" : "#64748B"} fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="sans-serif">
              {b.name.charAt(0)}
            </text>
            <text x="46" y="20" fill="#1E293B" fontSize="12" fontWeight="700" fontFamily="sans-serif">{b.name}</text>
            <text x="46" y="34" fill="#64748B" fontSize="10" fontFamily="sans-serif">{b.type}</text>
            <text x="280" y="23" fill={b.active ? "#166534" : "#475569"} fontSize="13" fontWeight="800" textAnchor="end" fontFamily="sans-serif">{b.bal}</text>
            {b.active && <circle cx="302" cy="23" r="5" fill="#166534" />}
          </g>
        ))}
      </g>
    </svg>
  );
}

function DayBookMockupSVG() {
  return (
    <svg viewBox="0 0 380 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="380" height="220" fill="#F8FAFC" />
      <g transform="translate(25, 20)">
        <rect width="330" height="34" rx="8" fill="#166534" />
        <text x="16" y="22" fill="#FFFFFF" fontSize="12" fontWeight="800" fontFamily="sans-serif">DAILY CASH REGISTER</text>
        <text x="314" y="22" fill="#DCFCE7" fontSize="11" fontWeight="700" textAnchor="end" fontFamily="sans-serif">Today, 30 Oct</text>
      </g>
      <g transform="translate(25, 62)">
        {[
          { label: "Opening Cash Balance", time: "08:00 AM", amt: "₹12,400", type: "neutral" },
          { label: "Ravi Kirana payment", time: "10:18 AM", amt: "+₹2,400", type: "income" },
          { label: "Milk Supplier payout", time: "11:30 AM", amt: "-₹620", type: "expense" },
          { label: "Closing Cash Balance", time: "09:00 PM", amt: "₹14,180", type: "closing" },
        ].map((row, i) => (
          <g key={row.label} transform={`translate(0, ${i * 35})`}>
            <rect
              width="330"
              height="30"
              rx="6"
              fill={row.type === "closing" ? "#DCFCE7" : "#FFFFFF"}
              stroke={row.type === "closing" ? "#166534" : "#E2E8F0"}
            />
            <text x="14" y="20" fill={row.type === "closing" ? "#166534" : "#1E293B"} fontSize="11" fontWeight="700" fontFamily="sans-serif">{row.label}</text>
            <text x="160" y="20" fill="#94A3B8" fontSize="9" fontFamily="sans-serif">{row.time}</text>
            <text
              x="316"
              y="20"
              fill={row.type === "income" ? "#166534" : row.type === "expense" ? "#DC2626" : "#1E293B"}
              fontSize="12"
              fontWeight="800"
              textAnchor="end"
              fontFamily="sans-serif"
            >
              {row.amt}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function RemindersMockupSVG() {
  return (
    <svg viewBox="0 0 380 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="380" height="220" fill="#FEFCE8" />
      <g transform="translate(30, 20)">
        <rect width="320" height="70" rx="14" fill="#FFFFFF" stroke="#FEF08A" strokeWidth="1.5" />
        <circle cx="36" cy="35" r="18" fill="#FEF9C3" />
        <path d="M36 25v10l6 4" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
        <text x="66" y="28" fill="#1E293B" fontSize="13" fontWeight="800" fontFamily="sans-serif">Daily Day-Book Closing</text>
        <text x="66" y="44" fill="#854D0E" fontSize="11" fontWeight="600" fontFamily="sans-serif">Scheduled every day at 8:30 PM</text>
        <rect x="250" y="24" width="54" height="22" rx="11" fill="#166534" />
        <circle cx="292" cy="35" r="8" fill="#FFFFFF" />
      </g>
      <g transform="translate(30, 102)">
        <rect width="320" height="96" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect x="16" y="14" width="8" height="8" rx="4" fill="#EAB308" />
        <text x="32" y="22" fill="#64748B" fontSize="10" fontWeight="700" letterSpacing="0.05em" fontFamily="sans-serif">EASY KANAKU REMINDER</text>
        <text x="16" y="46" fill="#1E293B" fontSize="12" fontWeight="700" fontFamily="sans-serif">
          Ready to wrap up today? 2 Credit follow-ups pending.
        </text>
        <rect x="16" y="58" width="135" height="26" rx="6" fill="#166534" />
        <text x="83" y="75" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">Close Day Book Now</text>
        <rect x="160" y="58" width="90" height="26" rx="6" fill="#F1F5F9" />
        <text x="205" y="75" fill="#475569" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="sans-serif">Remind in 1h</text>
      </g>
    </svg>
  );
}

const featureScreenshots = [
  "/images/MicPopup_reference.png",       // #1 Voice in 5 languages
  "/images/CreditCollect_reference.png",  // #2 Credit Tracking
  "/images/HomeDefault_reference.png",    // #3 Smart Dashboard
  "/images/ReportsPie_reference.png",     // #4 Reports & Analytics
  "/images/EntryDetail_reference.png",    // #5 Bill Attachments
  "/images/Account_reference.png",        // #6 Multi-Business
  "/images/DayBook_reference.png",        // #7 Day Book
  "/images/ReviewDays_reference.png",     // #8 Daily Reminders
];

const featureMockupComponents = [
  VoiceMockupSVG,
  UdhaarMockupSVG,
  DashboardMockupSVG,
  ReportsMockupSVG,
  BillsMockupSVG,
  MultiBusinessMockupSVG,
  DayBookMockupSVG,
  RemindersMockupSVG,
];

/* ─── Interactive Hover List Features Section (Awake Agency Style) ─── */
function InteractiveHoverFeatures() {
  const [activeIdx, setActiveIdx] = useState(0);
  const currentFeature = featuresData[activeIdx];

  // Target Y offset for floating mockup card:
  const targetY = Math.max(0, Math.min(activeIdx * 68 - 10, 260));

  return (
    <section id="features" className="fhl-section">
      <div className="fhl-container">
        {/* Section Header */}
        <div className="fhl-header">
          <span className="fhl-kicker">[ 02. BUSINESS TOOLKIT ]</span>
          <h2 className="fhl-title">
            Your business toolkit,<br /><em>without the busywork.</em>
          </h2>
          <p className="fhl-subtitle">
            Hover over any feature below to preview how Easy Kanaku brings calm clarity to your daily business accounts.
          </p>
        </div>

        {/* Full-width stage with list and floating center mockup */}
        <div className="fhl-stage">
          {/* Vertical Feature List */}
          <ul className="fhl-list">
            {featuresData.map((f, i) => {
              const isActive = activeIdx === i;
              return (
                <li
                  key={f.id}
                  className={`fhl-item ${isActive ? 'active' : ''}`}
                  onMouseEnter={() => setActiveIdx(i)}
                  onClick={() => setActiveIdx(i)}
                >
                  <div className="fhl-item-left">
                    <span className="fhl-item-num">{f.num}</span>
                    <span className="fhl-item-name">{f.title}</span>
                  </div>
                  <div className="fhl-item-right">
                    <span className="fhl-item-desc">{f.sub}</span>
                    <span className="fhl-item-tag">{f.tag}</span>
                    <span className="fhl-item-arrow">→</span>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Floating Center Mockup Card */}
          <motion.div
            className="fhl-floating-card-wrapper"
            animate={{ y: targetY }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <div className="fhl-card">
              <div className="fhl-card-topbar">
                <div className="fhl-card-badge">
                  <span className="fhl-card-dot" />
                  <span>{currentFeature.tag}</span>
                </div>
                <span className="fhl-card-tag">{currentFeature.num} / 08</span>
              </div>

              <div className="fhl-card-content">
                <div className="fhl-card-svg-container">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIdx}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      style={{ width: "100%", height: "100%" }}
                    >
                      <div className="fhl-device-wrapper">
                        <div className={`fhl-device-frame ${featureScreenshots[activeIdx].includes('MicPopup') ? 'align-bottom' : ''}`}>
                          <img
                            src={featureScreenshots[activeIdx]}
                            alt={currentFeature.title}
                            className={`fhl-device-img ${featureScreenshots[activeIdx].includes('MicPopup') ? 'align-bottom' : ''}`}
                          />
                          <div className={featureScreenshots[activeIdx].includes('MicPopup') ? 'fhl-device-fade-top' : 'fhl-device-fade'} />
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="fhl-card-footer">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIdx}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.22 }}
                    >
                      <h4 className="fhl-card-title">{currentFeature.title}</h4>
                      <p className="fhl-card-text">{currentFeature.desc}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── 3D Card Stack Animation Section (Obermann Web Design Style) ─── */
function CardStack3DSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const deckRef = useRef(null);
  const card0Ref = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);

  useEffect(() => {
    if (window.innerWidth < 900) return;

    const ctx = gsap.context(() => {
      // 1. Initial State: Deck tilted in 3D space with perspective
      gsap.set(deckRef.current, {
        rotateX: 25,
        rotateZ: -12,
        scale: 0.85,
        transformOrigin: "center center",
        transformStyle: "preserve-3d",
      });

      // 2. Initial State: All 3 cards stacked directly on top of each other in the center
      // Left card (column 0) slides right into center
      gsap.set(card0Ref.current, {
        x: "calc(100% + 28px)",
        y: 14,
        rotateZ: -3,
        scale: 0.94,
        zIndex: 1,
      });

      // Right card (column 2) slides left into center
      gsap.set(card2Ref.current, {
        x: "calc(-100% - 28px)",
        y: -14,
        rotateZ: 3,
        scale: 0.94,
        zIndex: 2,
      });

      // Center card (column 1) sits squarely on top
      gsap.set(card1Ref.current, {
        x: 0,
        y: 0,
        rotateZ: 0,
        scale: 1,
        zIndex: 3,
      });

      // Initial header state
      gsap.set(headerRef.current, {
        scale: 1,
        opacity: 1,
        transformOrigin: "center center",
      });

      // Pinned 3D scroll timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=1200",
          pin: true,
          pinSpacing: true,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      // Phase 1: Scroll Start -> Midpoint (0 to 0.6)
      // Header zooms down into subtle state
      tl.to(headerRef.current, {
        scale: 0.85,
        opacity: 0.6,
        y: -12,
        ease: "power2.out",
      }, 0);

      // Deck rotates flat
      tl.to(deckRef.current, {
        rotateX: 0,
        rotateZ: 0,
        scale: 1,
        ease: "power2.out",
      }, 0);

      // Cards unfold outward horizontally into clean 3-column row
      tl.to(card0Ref.current, {
        x: 0,
        y: 0,
        rotateZ: 0,
        scale: 1,
        ease: "power2.out",
      }, 0);

      tl.to(card2Ref.current, {
        x: 0,
        y: 0,
        rotateZ: 0,
        scale: 1,
        ease: "power2.out",
      }, 0);

      // Center card elevates slightly with subtle depth shadow
      tl.to(card1Ref.current, {
        y: -16,
        boxShadow: "0 32px 64px -16px rgba(21, 128, 61, 0.22), 0 0 35px -5px rgba(21, 128, 61, 0.16)",
        ease: "power2.out",
      }, 0);

      // Phase 2: Scroll Exit towards next section (0.68 to 1.0)
      // Title block scales out & fades cleanly as section unpins
      tl.to(headerRef.current, {
        scale: 0.76,
        opacity: 0,
        y: -40,
        ease: "power1.in",
      }, 0.68);

      tl.to(deckRef.current, {
        y: -25,
        opacity: 0.85,
        ease: "power1.in",
      }, 0.72);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="demo" className="cs-section" ref={sectionRef}>
      <div className="cs-container">
        {/* Title & Header Zoom Block */}
        <div className="cs-header" ref={headerRef}>
          <span className="cs-badge">DESIGNED FOR REAL LIFE</span>
          <h2 className="cs-title">
            Less friction. <em>More confidence.</em>
          </h2>
          <p className="cs-subtitle">
            Tools should lighten your work, not add to it.
          </p>
        </div>

        {/* 3D Stage & Card Deck */}
        <div className="cs-stage-wrapper">
          <div className="cs-grid" ref={deckRef}>
            {/* Card 1: Clear Entries */}
            <motion.div
              ref={card0Ref}
              className="cs-card"
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
            >
              <div className="cs-card-top">
                <div className="cs-card-icon-wrap">
                  <ShieldCheck size={24} />
                </div>
                <div className="cs-card-num">CONCEPT 01</div>
                <h3 className="cs-card-title">Clear Entries</h3>
                <p className="cs-card-subtext">
                  Review interpreted details instantly before logging.
                </p>
              </div>

              <div className="cs-card-visual cs-card-visual-device">
                <div className="cs-device-frame">
                  <img
                    src="/images/CheckSave_reference.png"
                    alt="Clear Entries Screenshot"
                    className="cs-device-img"
                  />
                  <div className="cs-device-fade" />
                </div>
              </div>
            </motion.div>

            {/* Card 2: Unified Ledger */}
            <motion.div
              ref={card1Ref}
              className="cs-card"
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
            >
              <div className="cs-card-top">
                <div className="cs-card-icon-wrap">
                  <Wallet size={24} />
                </div>
                <div className="cs-card-num">CONCEPT 02</div>
                <h3 className="cs-card-title">Unified Ledger</h3>
                <p className="cs-card-subtext">
                  See income, expenses, and credit in one view.
                </p>
              </div>

              <div className="cs-card-visual cs-card-visual-device">
                <div className="cs-device-frame">
                  <img
                    src="/images/CreditCollect_reference.png"
                    alt="Unified Ledger Screenshot"
                    className="cs-device-img"
                  />
                  <div className="cs-device-fade" />
                </div>
              </div>
            </motion.div>

            {/* Card 3: Export Ready */}
            <motion.div
              ref={card2Ref}
              className="cs-card"
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
            >
              <div className="cs-card-top">
                <div className="cs-card-icon-wrap">
                  <Download size={24} />
                </div>
                <div className="cs-card-num">CONCEPT 03</div>
                <h3 className="cs-card-title">Export Ready</h3>
                <p className="cs-card-subtext">
                  Download your ledger anytime as a clean CSV.
                </p>
              </div>

              <div className="cs-card-visual cs-card-visual-device">
                <div className="cs-device-frame">
                  <img
                    src="/images/Reports_reference.png"
                    alt="Export Ready Screenshot"
                    className="cs-device-img"
                  />
                  <div className="cs-device-fade" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
/* ─── Cursor Proximity & Typography Morph Footer (Yevgeniya Grab / Agency Style) ─── */
function FooterMorphSection({ onOpenDemo }) {
  const footerRef = useRef(null);
  const containerRef = useRef(null);
  const brandRef = useRef(null);
  const ctaRef = useRef(null);
  const linksRef = useRef(null);

  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);
  const [brandDist, setBrandDist] = useState(9999);
  const [isBrandHovered, setIsBrandHovered] = useState(false);

  // 'Easy Kanaku' in Title Case with clean sans-serif typography
  const brandLetters = [
    { char: 'E' },
    { char: 'a' },
    { char: 's' },
    { char: 'y' },
    { char: ' ', isSpace: true },
    { char: 'K' },
    { char: 'a' },
    { char: 'n' },
    { char: 'a' },
    { char: 'k' },
    { char: 'u' },
  ];

  // Scroll-Driven Slide-Up Reveal (Curtain Effect from Video 1)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        {
          y: 110,
          opacity: 0.85,
        },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 95%",
            end: "bottom bottom",
            scrub: 1.2,
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;
    setMousePos({ x: curX, y: curY });

    if (brandRef.current) {
      const bRect = brandRef.current.getBoundingClientRect();
      const bCenterX = (bRect.left - rect.left) + bRect.width / 2;
      const bCenterY = (bRect.top - rect.top) + bRect.height / 2;
      const d = Math.hypot(curX - bCenterX, curY - bCenterY);
      setBrandDist(d);
    }
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: -1000, y: -1000 });
    setBrandDist(9999);
  };

  // Helper for CTA & Links proximity blur
  const getProximityStyle = (elementRef) => {
    if (!isHovered || !elementRef.current || !containerRef.current) {
      return { filter: 'blur(0px)', opacity: 1 };
    }
    const cRect = containerRef.current.getBoundingClientRect();
    const eRect = elementRef.current.getBoundingClientRect();
    const elemX = (eRect.left - cRect.left) + eRect.width / 2;
    const elemY = (eRect.top - cRect.top) + eRect.height / 2;
    const dist = Math.hypot(mousePos.x - elemX, mousePos.y - elemY);

    const maxRadius = 240;
    const blur = Math.max(0, Math.min(2.5, ((dist - 60) / maxRadius) * 2.5));
    const opacity = Math.max(0.75, Math.min(1, 1 - (dist / (maxRadius * 2.8))));
    return {
      filter: `blur(${blur.toFixed(1)}px)`,
      opacity: opacity.toFixed(2),
    };
  };

  // Proximity behavior for 'Easy Kanaku':
  // Baseline (cursor away): subtle low blur (1.8px), opacity 0.88 -> clearly readable!
  // Within 200px: smooth transition to 0px blur, full opacity, subtle tracking & scale expansion.
  const getBrandTitleStyle = () => {
    if (isBrandHovered) {
      return {
        filter: 'blur(0px)',
        opacity: 1,
        letterSpacing: '-0.01em',
        transform: 'scale(1.025)',
        transition: 'filter 0.15s ease, opacity 0.15s ease, transform 0.15s ease',
      };
    }
    if (!isHovered || brandDist > 200) {
      return {
        filter: 'blur(1.8px)',
        opacity: 0.88,
        letterSpacing: '-0.02em',
        transform: 'scale(1)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      };
    }
    const progress = 1 - Math.min(1, brandDist / 200); // 0 at 200px -> 1 at 0px
    const blur = (1 - progress) * 1.8;
    const opacity = 0.88 + progress * 0.12;
    const letterSpacing = -0.02 + progress * 0.04; // subtle tracking expansion
    const scale = 1 + progress * 0.035; // subtle scale expansion
    return {
      filter: `blur(${blur.toFixed(1)}px)`,
      opacity: opacity.toFixed(2),
      letterSpacing: `${letterSpacing.toFixed(3)}em`,
      transform: `scale(${scale.toFixed(3)})`,
      transition: 'filter 0.22s ease, opacity 0.22s ease, transform 0.22s ease, letter-spacing 0.22s ease',
    };
  };

  return (
    <footer
      id="contact"
      className="fm-section"
      ref={footerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="fm-container" ref={containerRef}>
        {/* Simplified Call To Action Block (100% Crisp, No Blur Filter) */}
        <div
          className="fm-cta-block"
          ref={ctaRef}
        >
          <h2 className="fm-headline">
            Start <span>Speaking.</span>
          </h2>
          <p className="fm-subheadline">
            Bookkeeping made effortless.
          </p>
          <button
            type="button"
            className="fm-btn-primary"
            onClick={(e) => {
              if (e) {
                e.preventDefault();
                e.stopPropagation();
              }
              onOpenDemo?.();
            }}
          >
            <span>Try Demo</span>
            <ArrowRight className="fm-btn-arrow" size={16} />
          </button>
          <div className="fm-store-buttons">
            <a
              href="https://play.google.com/store/apps/details?id=com.reflexlabs.easykanakku"
              target="_blank"
              rel="noopener noreferrer"
              className="fm-store-badge"
              aria-label="Get Easy Kanaku on Google Play"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path fill="#2196F3" d="M3.609 1.814L13.793 12 3.61 22.186c-.347-.365-.549-.876-.549-1.45V3.264c0-.574.202-1.085.548-1.45z"/>
                <path fill="#4CAF50" d="M3.61 22.186l11.241-10.186 2.284 2.093-11.834 6.84c-.58.336-1.23.013-1.691-.747z"/>
                <path fill="#F44336" d="M3.609 1.814c.461-.76 1.111-1.083 1.691-.747l11.834 6.84-2.284 2.093L3.609 1.814z"/>
                <path fill="#FFC107" d="M17.135 14.093l-2.284-2.093 2.284-2.093 2.585 1.492c.738.426.738 1.768 0 2.194l-2.585 1.5z"/>
              </svg>
              <div className="fm-store-badge-text">
                <span className="fm-store-badge-sub">GET IT ON</span>
                <span className="fm-store-badge-title">Google Play</span>
              </div>
            </a>
            <a
              href="https://apps.apple.com/in/app/easy-kanaku/id6815802230"
              target="_blank"
              rel="noopener noreferrer"
              className="fm-store-badge"
              aria-label="Download Easy Kanaku on the App Store"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="#FFFFFF" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.73-.93 2.76 1.01.08 2.02-.51 2.64-1.26z"/>
              </svg>
              <div className="fm-store-badge-text">
                <span className="fm-store-badge-sub">Download on the</span>
                <span className="fm-store-badge-title">App Store</span>
              </div>
            </a>
          </div>
        </div>

        {/* Central Brand Title: 'Easy Kanaku' in Title Case Sans-Serif */}
        <div
          className="fm-brand-wrap"
          ref={brandRef}
          onMouseEnter={() => setIsBrandHovered(true)}
          onMouseLeave={() => setIsBrandHovered(false)}
        >
          <div
            className="fm-brand-title"
            style={getBrandTitleStyle()}
          >
            {brandLetters.map((item, idx) => {
              if (item.isSpace) {
                return <span key={idx} className="fm-letter space" />;
              }
              return (
                <span
                  key={idx}
                  className="fm-letter"
                >
                  {item.char}
                </span>
              );
            })}
          </div>
        </div>

        {/* Line-Sweep Nav Links Bar */}
        <nav
          className="fm-links-nav"
          ref={linksRef}
        >
          <a className="line-sweep-link" href="#features">Features</a>
          <a className="line-sweep-link" href="#languages">Languages</a>
          <a
            className="line-sweep-link"
            href="#privacy"
            onClick={(e) => {
              e.preventDefault();
              alert("Easy Kanaku prioritizes your privacy. In this demo, no voice data or ledger entries leave your local browser session.");
            }}
          >
            Privacy Policy
          </a>
          <a className="line-sweep-link" href="mailto:contact@easykanaku.com">Contact</a>
        </nav>

        {/* Bottom Copyright Bar */}
        <div className="fm-bottom-bar">
          <span>© 2026 Easy Kanaku. All Rights Reserved.</span>
          <span>Made for everyday Indian business</span>
        </div>
      </div>
    </footer>
  );
}
/* ─── Awwwards-Style Hero Intro Preloader Component ─── */
function HeroIntroPreloader({ onStartReveal, onComplete }) {
  const [count, setCount] = useState(0);
  const [isSplitting, setIsSplitting] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    const duration = 1200; // 1.2s counter progression
    const startTime = performance.now();
    let animId;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Gentle ease-out progression
      const currentVal = Math.floor(progress * 100);
      setCount(currentVal);

      if (progress < 1) {
        animId = requestAnimationFrame(tick);
      } else {
        setCount(100);
        // Split preloader vertically upon reaching 100%
        setTimeout(() => {
          setIsSplitting(true);
          onStartReveal?.();
          setTimeout(() => {
            setIsRemoved(true);
            onComplete?.();
          }, 850);
        }, 180);
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  if (isRemoved) return null;

  return (
    <div className="intro-preloader-root" aria-hidden="true">
      {/* Left curtain panel */}
      <motion.div
        className="intro-curtain-left"
        initial={{ x: "0%" }}
        animate={isSplitting ? { x: "-102%" } : { x: "0%" }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Right curtain panel */}
      <motion.div
        className="intro-curtain-right"
        initial={{ x: "0%" }}
        animate={isSplitting ? { x: "102%" } : { x: "0%" }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Center Soundwave & Counter Content */}
      <motion.div
        className="intro-center"
        animate={isSplitting ? { opacity: 0, scale: 0.94 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
      >
        <div className="intro-soundwave">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="intro-bar" />
          ))}
        </div>

        <div className="intro-counter-wrap">
          <span className="intro-counter">{count}</span>
          <span className="intro-counter-unit">%</span>
        </div>

        <div className="intro-subtext">
          <span className="intro-dot" />
          <span>Listening to your business...</span>
        </div>
      </motion.div>
    </div>
  );
}

const previewTabsData = {
  'Dashboard': {
    title: 'Good morning, Priya 👋',
    img: '/images/HomeDefault_reference.png',
    alt: 'Easy Kanaku Dashboard View',
  },
  'Voice Entry': {
    title: 'Voice entry',
    img: '/images/MicPopup_reference.png',
    alt: 'Easy Kanaku Voice Entry View',
  },
  'Credit Ledger': {
    title: 'Customer credit',
    img: '/images/CreditCollect_reference.png',
    alt: 'Easy Kanaku Credit Ledger View',
  },
  'Reports': {
    title: 'Business reports',
    img: '/images/Reports_reference.png',
    alt: 'Easy Kanaku Reports View',
  },
};

/* ─── Clean, Theme-Matched "Live Demo Coming Soon" Modal ─── */
function DemoComingSoonModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="dcs-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
        >
          <motion.div
            className="dcs-card"
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="dcs-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="dcs-pill">
              <Sparkles size={12} />
              <span>LIVE DEMO</span>
            </div>

            <h3 className="dcs-title">
              Interactive demo is launching soon.
            </h3>

            <p className="dcs-subtext">
              We're putting the finishing touches on the web demo. Meanwhile, download Easy Kanaku to experience voice bookkeeping right on your phone.
            </p>

            <div className="dcs-store-grid">
              <a
                href="https://play.google.com/store/apps/details?id=com.reflexlabs.easykanakku"
                target="_blank"
                rel="noopener noreferrer"
                className="dcs-store-btn"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M3.609 1.814L13.793 12 3.61 22.186c-.347-.365-.549-.876-.549-1.45V3.264c0-.574.202-1.085.548-1.45zm11.242 11.243l2.091 2.091-11.834 6.84 9.743-8.931zm0-2.114L5.108 1.996l11.834 6.84-2.091 2.091zm1.472 1.057l3.664 2.118c.954.551.954 1.455 0 2.006l-3.664 2.118-2.355-2.355 2.355-1.887z"/>
                </svg>
                <span>Google Play</span>
              </a>
              <a
                href="https://apps.apple.com/in/app/easy-kanaku/id6815802230"
                target="_blank"
                rel="noopener noreferrer"
                className="dcs-store-btn"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.73-.93 2.76 1.01.08 2.02-.51 2.64-1.26z"/>
                </svg>
                <span>App Store</span>
              </a>
            </div>

            <div className="dcs-dismiss-wrap">
              <button
                type="button"
                className="dcs-dismiss"
                onClick={onClose}
              >
                Back to page
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


/* ─── Fanned Card Deck – Everyday Struggle Section ─── */
const PAIN_CARDS = [
  {
    id: 1,
    title: 'Too much typing',
    tagline: 'EVERY SMALL SALE SHOULDN\'T MEAN A LONG FORM',
    solution: 'Just speak. Easy Kanaku captures your sale with a single voice command—no form, no keyboard, no delay.',
    gradient: 'linear-gradient(145deg, #E0F2E9 0%, #EAF5EE 55%, #F7F6F0 100%)',
    accent: '#15803D',
    icon: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="12" y="22" width="56" height="36" rx="8" stroke="#15803D" strokeWidth="1.5" fill="none" opacity="0.18"/>
        <line x1="22" y1="34" x2="58" y2="34" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
        <line x1="22" y1="42" x2="50" y2="42" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
        <line x1="22" y1="50" x2="44" y2="50" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
        <circle cx="58" cy="52" r="10" fill="#EAF5EE" stroke="#15803D" strokeWidth="1.5" opacity="0.5"/>
        <path d="M54 52l3 3 5-5" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
      </svg>
    ),
    rotate: -15,
    tx: -190,
    ty: 28,
    zIndex: 1,
  },
  {
    id: 2,
    title: 'Complicated entries',
    tagline: 'KEEP YOUR BOOKS CLEAR WITHOUT THE JARGON',
    solution: 'No accounting degree needed. Say "received ₹500 from Ravi" and your ledger is updated instantly.',
    gradient: 'linear-gradient(145deg, #F7F6F0 0%, #EAF5EE 60%, #E0F2E9 100%)',
    accent: '#166534',
    icon: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="16" y="14" width="34" height="44" rx="6" stroke="#15803D" strokeWidth="1.5" fill="none" opacity="0.2"/>
        <line x1="22" y1="26" x2="44" y2="26" stroke="#15803D" strokeWidth="1.3" strokeLinecap="round" opacity="0.35"/>
        <line x1="22" y1="34" x2="40" y2="34" stroke="#15803D" strokeWidth="1.3" strokeLinecap="round" opacity="0.35"/>
        <line x1="22" y1="42" x2="38" y2="42" stroke="#15803D" strokeWidth="1.3" strokeLinecap="round" opacity="0.35"/>
        <circle cx="52" cy="50" r="12" fill="#EDF7F2" stroke="#15803D" strokeWidth="1.5" opacity="0.5"/>
        <path d="M47 50h10M52 45v10" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" opacity="0.65"/>
      </svg>
    ),
    rotate: -9,
    tx: -114,
    ty: 12,
    zIndex: 2,
  },
  {
    id: 3,
    title: 'Language barriers',
    tagline: 'SPEAK IN TAMIL, HINDI, ENGLISH, TELUGU OR KANNADA',
    solution: 'Your business speaks your language. Record entries in whichever language feels natural to you.',
    gradient: 'linear-gradient(145deg, #EDF7F2 0%, #E0F2E9 50%, #FEF9EC 100%)',
    accent: '#15803D',
    icon: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="40" cy="40" r="22" stroke="#15803D" strokeWidth="1.5" fill="none" opacity="0.18"/>
        <ellipse cx="40" cy="40" rx="10" ry="22" stroke="#15803D" strokeWidth="1.3" fill="none" opacity="0.22"/>
        <line x1="18" y1="33" x2="62" y2="33" stroke="#15803D" strokeWidth="1.3" strokeLinecap="round" opacity="0.28"/>
        <line x1="18" y1="47" x2="62" y2="47" stroke="#15803D" strokeWidth="1.3" strokeLinecap="round" opacity="0.28"/>
        <text x="30" y="44" fontSize="11" fontFamily="sans-serif" fill="#15803D" opacity="0.4" fontWeight="600">அ</text>
      </svg>
    ),
    rotate: -3,
    tx: -38,
    ty: 2,
    zIndex: 3,
  },
  {
    id: 4,
    title: 'Forgotten credit',
    tagline: 'TRACK EVERY RUPEE TO COLLECT AND PAY',
    solution: 'Never lose track of who owes you. Easy Kanaku logs every credit sale and reminds you to collect.',
    gradient: 'linear-gradient(145deg, #FEF9EC 0%, #F7F6F0 55%, #EAF5EE 100%)',
    accent: '#166534',
    icon: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="40" cy="34" r="14" stroke="#15803D" strokeWidth="1.5" fill="none" opacity="0.2"/>
        <text x="34" y="39" fontSize="14" fontFamily="sans-serif" fill="#15803D" opacity="0.4" fontWeight="700">₹</text>
        <path d="M28 56 Q40 48 52 56" stroke="#15803D" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.3"/>
        <circle cx="58" cy="22" r="7" fill="#FEF9EC" stroke="#CA8A04" strokeWidth="1.3" opacity="0.5"/>
        <text x="55" y="27" fontSize="9" fontFamily="sans-serif" fill="#CA8A04" opacity="0.7" fontWeight="700">!</text>
      </svg>
    ),
    rotate: 3,
    tx: 38,
    ty: 2,
    zIndex: 4,
  },
  {
    id: 5,
    title: 'End-of-day math',
    tagline: 'INSTANT CASH & BANK DAY BOOK TOTALS',
    solution: 'Your day book closes itself. Cash, bank, credit—everything summed and ready before you lock up.',
    gradient: 'linear-gradient(145deg, #EAF5EE 0%, #E0F2E9 50%, #EDF7F2 100%)',
    accent: '#15803D',
    icon: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="16" y="20" width="48" height="40" rx="7" stroke="#15803D" strokeWidth="1.5" fill="none" opacity="0.18"/>
        <line x1="16" y1="34" x2="64" y2="34" stroke="#15803D" strokeWidth="1.3" opacity="0.28"/>
        <line x1="40" y1="20" x2="40" y2="60" stroke="#15803D" strokeWidth="1.3" opacity="0.22"/>
        <text x="22" y="30" fontSize="8" fontFamily="'DM Mono',monospace" fill="#15803D" opacity="0.4">CASH</text>
        <text x="44" y="30" fontSize="8" fontFamily="'DM Mono',monospace" fill="#15803D" opacity="0.4">BANK</text>
        <text x="20" y="50" fontSize="10" fontFamily="'DM Mono',monospace" fill="#15803D" opacity="0.5" fontWeight="600">12,400</text>
        <text x="43" y="50" fontSize="10" fontFamily="'DM Mono',monospace" fill="#15803D" opacity="0.5" fontWeight="600">8,200</text>
      </svg>
    ),
    rotate: 9,
    tx: 114,
    ty: 12,
    zIndex: 5,
  },
  {
    id: 6,
    title: 'Lost paper bills',
    tagline: 'SNAP AND ATTACH RECEIPTS IN SECONDS',
    solution: 'No more hunting for crumpled paper. Snap a photo of any receipt and attach it to your entry instantly.',
    gradient: 'linear-gradient(145deg, #FFFBEB 0%, #F7F6F0 50%, #EDF7F2 100%)',
    accent: '#166534',
    icon: (
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="20" y="18" width="40" height="44" rx="6" stroke="#15803D" strokeWidth="1.5" fill="none" opacity="0.18"/>
        <circle cx="40" cy="36" r="9" stroke="#15803D" strokeWidth="1.3" fill="none" opacity="0.25"/>
        <circle cx="40" cy="36" r="4" fill="#EAF5EE" stroke="#15803D" strokeWidth="1.2" opacity="0.45"/>
        <path d="M28 23h6l2-4h8l2 4h6" stroke="#15803D" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
        <line x1="26" y1="52" x2="40" y2="52" stroke="#15803D" strokeWidth="1.3" strokeLinecap="round" opacity="0.3"/>
        <line x1="26" y1="57" x2="36" y2="57" stroke="#15803D" strokeWidth="1.3" strokeLinecap="round" opacity="0.3"/>
      </svg>
    ),
    rotate: 15,
    tx: 190,
    ty: 28,
    zIndex: 6,
  },
];

function FannedCardDeck() {
  const [hoveredId, setHoveredId] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleCardMouseMove = (e, cardId) => {
    if (!hoveredId) return;
    const card = document.getElementById(`fdc-card-${cardId}`);
    if (!card) return;
    const rect = card.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  };

  const activeCard = PAIN_CARDS.find(c => c.id === activeId);

  return (
    <section className="fdc-section reveal">
      {/* Ambient glow */}
      <div className="fdc-glow" aria-hidden="true" />

      {/* Two-column split layout */}
      <div className="fdc-inner">
        {/* LEFT: Card deck */}
        <div className="fdc-col-deck">
          <div
            className="fdc-stage"
            aria-label="Interactive card deck showing business pain points"
          >
            {PAIN_CARDS.map((card) => {
              const isHovered = hoveredId === card.id;
              const isActive = activeId === card.id;

              // Static arc values + smooth hover lift & pop-to-front
              const hoverTy = isHovered ? -10 : 0;
              const hoverRotateReduce = isHovered ? card.rotate * 0.15 : 0;
              const hoverScale = isHovered ? 1.025 : 1;

              // 3D tilt from mouse pos (only on hovered card)
              const tiltX = isHovered ? mousePos.y * -6 : 0;
              const tiltY = isHovered ? mousePos.x * 8 : 0;

              const finalRotate = card.rotate - hoverRotateReduce;
              const finalTy = card.ty + hoverTy;
              const finalTx = card.tx;

              const zIndex = isHovered || isActive ? 50 : card.zIndex;

              return (
                <div
                  key={card.id}
                  id={`fdc-card-${card.id}`}
                  className={`fdc-card${isHovered ? ' fdc-card--hovered' : ''}`}
                  style={{
                    background: card.gradient,
                    transform: `translateX(${finalTx}px) translateY(${finalTy}px) rotate(${finalRotate}deg) scale(${hoverScale}) perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
                    zIndex,
                    transition: 'transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1), box-shadow 0.25s ease',
                  }}
                  onMouseEnter={() => setHoveredId(card.id)}
                  onMouseLeave={() => { setHoveredId(null); setMousePos({ x: 0, y: 0 }); }}
                  onMouseMove={(e) => handleCardMouseMove(e, card.id)}
                  onClick={() => setActiveId(card.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${card.title}: ${card.tagline}`}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveId(card.id); }}
                >
                  {/* Sheen overlay */}
                  {isHovered && (
                    <div
                      className="fdc-sheen"
                      style={{
                        background: `radial-gradient(circle at ${(mousePos.x + 1) * 50}% ${(mousePos.y + 1) * 50}%, rgba(255,255,255,0.45) 0%, transparent 65%)`,
                      }}
                      aria-hidden="true"
                    />
                  )}

                  {/* Card number */}
                  <span className="fdc-card-num">0{card.id}</span>

                  {/* Card title */}
                  <h3 className="fdc-card-title">{card.title}</h3>

                  {/* Icon watermark */}
                  <div className="fdc-card-icon" aria-hidden="true">
                    {card.icon}
                  </div>

                  {/* Tagline */}
                  <p className="fdc-card-tagline">{card.tagline}</p>

                  {/* Watermark */}
                  <span className="fdc-watermark">easykanaku.</span>
                </div>
              );
            })}
          </div>
        </div>{/* /fdc-col-deck */}

        {/* RIGHT: Text content */}
        <div className="fdc-col-text">
          <span className="fdc-eyebrow">THE EVERYDAY STRUGGLE</span>
          <h2 className="fdc-headline">Running a business<br />is hard enough.</h2>
          <p className="fdc-subtitle">Your accounts shouldn't be another job at the end of the day.</p>
        </div>
      </div>{/* /fdc-inner */}

      {/* Detail modal overlay */}
      <AnimatePresence>
        {activeCard && (
          <motion.div
            className="fdc-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setActiveId(null)}
            aria-modal="true"
            role="dialog"
            aria-label={`${activeCard.title} detail`}
          >
            <motion.div
              className="fdc-detail"
              style={{ background: activeCard.gradient }}
              initial={{ scale: 0.88, opacity: 0, y: 32 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 24 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="fdc-detail-close"
                onClick={() => setActiveId(null)}
                aria-label="Close"
              >×</button>
              <span className="fdc-eyebrow" style={{ marginBottom: 8 }}>THE EVERYDAY STRUGGLE</span>
              <h3 className="fdc-detail-title">{activeCard.title}</h3>
              <div className="fdc-detail-icon">{activeCard.icon}</div>
              <p className="fdc-card-tagline" style={{ marginBottom: 12, color: activeCard.accent }}>{activeCard.tagline}</p>
              <p className="fdc-detail-solution">{activeCard.solution}</p>
              <span className="fdc-watermark" style={{ position: 'static', marginTop: 20, opacity: 0.35 }}>easykanaku.</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function App() {
  const [transactions, setTransactions] = useState(seedTransactions);
  const [activeType, setActiveType] = useState('all');
  const [activePreview, setActivePreview] = useState('Dashboard');
  const [activeNav, setActiveNav] = useState('how');
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const handleOpenDemoModal = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setDemoModalOpen(true);
  };
  const [activeFeatureId, setActiveFeatureId] = useState('01');
  const [scoopLeft, setScoopLeft] = useState(0);
  const [scoopReady, setScoopReady] = useState(false);
  const [language, setLanguage] = useState('English');
  const [transcript, setTranscript] = useState('');
  const [displayedTranscript, setDisplayedTranscript] = useState('');
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState('Try a sample phrase or use your microphone.');
  const [draft, setDraft] = useState(null);
  const [faqOpen, setFaqOpen] = useState(0);
  const [toast, setToast] = useState('');
  const [showAll, setShowAll] = useState(false);
  const recognitionRef = useRef(null);
  const demoRef = useRef(null);
  const linkRefs = useRef({});
  const isClickingRef = useRef(false);
  const clickTimerRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    window.__lenis = lenis;

    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const targetId = href.slice(1);
      const targetEl = targetId === 'top' ? 0 : document.getElementById(targetId);
      if (targetEl !== null && (targetEl === 0 || targetEl instanceof HTMLElement)) {
        e.preventDefault();
        lenis.scrollTo(targetEl, { offset: -90, duration: 1.2 });
        if (['how', 'features', 'languages', 'demo', 'faq'].includes(targetId)) {
          setActiveNav(targetId);
          isClickingRef.current = true;
          if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
          clickTimerRef.current = setTimeout(() => {
            isClickingRef.current = false;
          }, 1200);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  const handleNavClick = (id, e) => {
    if (e) {
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
    }
    if (id === 'demo') {
      setDemoModalOpen(true);
      return;
    }
    setActiveNav(id);
    isClickingRef.current = true;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      isClickingRef.current = false;
    }, 1200);

    const target = id === 'top' ? 0 : document.getElementById(id);
    if (target !== null) {
      if (window.__lenis) {
        window.__lenis.scrollTo(target, { offset: -90, duration: 1.2 });
      } else if (typeof target === 'object' && target?.scrollIntoView) {
        target.scrollIntoView({ behavior: 'smooth' });
      } else if (target === 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const updateScoop = () => {
      const el = linkRefs.current[activeNav];
      if (el) {
        setScoopLeft(el.offsetLeft + el.offsetWidth / 2);
        setScoopReady(true);
      }
    };
    updateScoop();
    const rafId = requestAnimationFrame(updateScoop);
    window.addEventListener('resize', updateScoop);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateScoop);
    };
  }, [activeNav]);

  const totals = useMemo(() => transactions.reduce((a, t) => {
    a[t.type] += Number(t.amount) || 0; return a;
  }, { income: 0, expense: 0, credit: 0 }), [transactions]);
  const visibleTransactions = transactions.filter(t => activeType === 'all' || t.type === activeType);
  const shownTransactions = showAll ? visibleTransactions : visibleTransactions.slice(0, 4);

  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { nodes.forEach(n => n.classList.add('visible')); }
    else {
      const observer = new IntersectionObserver(entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      }), { threshold: 0.12 });
      nodes.forEach(n => observer.observe(n));
    }
    const sectionIds = ['how', 'features', 'languages', 'demo', 'faq'];
    const handleScroll = () => {
      if (isClickingRef.current) return;
      let found = false;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 150) {
            setActiveNav(id);
            found = true;
            break;
          }
        }
      }
      if (!found && window.scrollY < 200) {
        setActiveNav('how');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);

  // Typing animation effect for transcript
  const typingRef = useRef(null);
  useEffect(() => {
    if (typingRef.current) clearTimeout(typingRef.current);
    if (!transcript) { setDisplayedTranscript(''); return; }
    // If recording (live interim results), show immediately
    if (recording) { setDisplayedTranscript(transcript); return; }
    // Typing animation for samples / final results
    setDisplayedTranscript('');
    let i = 0;
    const typeChar = () => {
      if (i < transcript.length) {
        setDisplayedTranscript(transcript.slice(0, i + 1));
        i++;
        typingRef.current = setTimeout(typeChar, 28);
      }
    };
    typingRef.current = setTimeout(typeChar, 100);
    return () => { if (typingRef.current) clearTimeout(typingRef.current); };
  }, [transcript, recording]);

  function startVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setStatus('Live speech recognition is not supported in this browser. Try a sample phrase below.');
      setToast('Try Chrome for microphone support');
      return;
    }
    const recognition = new SR();
    recognition.lang = ({ English: 'en-IN', తెలుగు: 'te-IN', தமிழ்: 'ta-IN', हिन्दी: 'hi-IN', ಕನ್ನಡ: 'kn-IN' })[language] || 'en-IN';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onstart = () => { setRecording(true); setStatus('Listening… say your transaction naturally.'); };
    recognition.onresult = event => {
      const text = Array.from(event.results).map(r => r[0].transcript).join(' ');
      setTranscript(text);
      if (event.results[event.results.length - 1].isFinal) {
        setDraft(parseEntry(text)); setStatus('Entry understood. Review it before adding to your ledger.');
      }
    };
    recognition.onerror = event => { setStatus(`Microphone stopped (${event.error}). You can type or try a sample.`); setRecording(false); };
    recognition.onend = () => setRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
  }
  function stopVoice() { recognitionRef.current?.stop(); setRecording(false); }
  function useSample(text) {
    setTranscript(text);
    setDraft(parseEntry(text));
    setStatus('Sample interpreted. Check the details, then add it to the demo ledger.');
  }
  function addEntry() {
    if (!draft || !draft.amount || draft.amount < 0) { setToast('Add an amount before saving'); return; }
    setTransactions(prev => [{ id: Date.now(), title: draft.title, type: draft.type, amount: Number(draft.amount), time: 'Just now', note: 'Added in live demo' }, ...prev]);
    setActiveType('all'); setTranscript(''); setDraft(null);
    setStatus('Saved to this demo session. Your ledger has updated.');
    setToast('Ledger updated ✓');
  }
  function exportCsv() {
    const rows = [['Description', 'Type', 'Amount', 'Time'], ...transactions.map(t => [t.title, t.type, t.amount, t.time])];
    const csv = rows.map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'easy-kanaku-demo-ledger.csv'; a.click(); URL.revokeObjectURL(url);
    setToast('Demo ledger exported');
  }
  const resetDemo = () => { setTransactions(seedTransactions); setActiveType('all'); setTranscript(''); setDraft(null); setToast('Demo reset'); };

  return <div className="app-shell">
    <HeroIntroPreloader onStartReveal={() => setHeroRevealed(true)} onComplete={() => setPreloaderDone(true)} />
    <div className="announcement">
      <span className="live-dot"></span> A simpler way to keep your business moving{' '}
      <button
        type="button"
        className="announce-tag"
        onClick={(e) => {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          setDemoModalOpen(true);
        }}
        style={{ cursor: 'pointer', background: 'transparent', border: 'none', padding: 0, font: 'inherit' }}
      >
        Meet the interactive demo <ArrowRight size={13} />
      </button>
    </div>
    <header className="nav-wrap">
      <a className="brand" href="#top" aria-label="Easy Kanaku home"><span className="brand-mark"><AudioLines size={20} /></span><span>easy<span className="brand-kanaku">kanaku</span><i>.</i></span></a>
      <nav className="nav-links">
        {[
          { id: 'how', label: 'How it works', href: '#how' },
          { id: 'features', label: 'Features', href: '#features' },
          { id: 'languages', label: 'Languages', href: '#languages' },
          { id: 'demo', label: 'Try the demo', href: '#demo' },
          { id: 'faq', label: 'FAQ', href: '#faq' }
        ].map(item => (
          item.id === 'demo' ? (
            <button
              key={item.id}
              ref={el => { linkRefs.current[item.id] = el; }}
              type="button"
              className={`bg-transparent border-0 shadow-none appearance-none ${activeNav === item.id ? 'active' : ''}`.trim()}
              onClick={(e) => {
                if (e) {
                  e.preventDefault();
                  e.stopPropagation();
                }
                setDemoModalOpen(true);
              }}
            >
              {item.label}
            </button>
          ) : (
            <a
              key={item.id}
              ref={el => { linkRefs.current[item.id] = el; }}
              href={item.href}
              className={activeNav === item.id ? 'active' : ''}
              onClick={(e) => handleNavClick(item.id, e)}
            >
              {item.label}
            </a>
          )
        ))}
      </nav>
      <div className="nav-actions">
        <a
          href="https://play.google.com/store/apps/details?id=com.reflexlabs.easykanakku"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-store-btn nav-store-play"
          aria-label="Download Easy Kanaku on Google Play"
        >
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
            <path d="M3.609 1.814L13.793 12 3.61 22.186c-.347-.365-.549-.876-.549-1.45V3.264c0-.574.202-1.085.548-1.45zm11.242 11.243l2.091 2.091-11.834 6.84 9.743-8.931zm0-2.114L5.108 1.996l11.834 6.84-2.091 2.091zm1.472 1.057l3.664 2.118c.954.551.954 1.455 0 2.006l-3.664 2.118-2.355-2.355 2.355-1.887z"/>
          </svg>
          <span>Google Play</span>
        </a>
        <a
          href="https://apps.apple.com/in/app/easy-kanaku/id6815802230"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-store-btn nav-store-apple"
          aria-label="Download Easy Kanaku on the App Store"
        >
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83zM15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.73-.93 2.76 1.01.08 2.02-.51 2.64-1.26z"/>
          </svg>
          <span>App Store</span>
        </a>
      </div>
    </header>

    <main id="top">
      <section className="hero">
        <div className="hero-glow"></div>
        <div className="hero-copy">
          <motion.div
            className="eyebrow"
            initial={{ opacity: 0, y: 14 }}
            animate={heroRevealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="eyebrow-dot"></span> BUILT FOR THE WAY YOU WORK
          </motion.div>

          <h1>
            <span className="hero-split-word">
              <motion.span
                className="hero-split-inner"
                initial={{ y: "115%", opacity: 0, scale: 0.92, rotateX: 20 }}
                animate={heroRevealed ? { y: "0%", opacity: 1, scale: 1, rotateX: 0 } : {}}
                transition={{ duration: 0.75, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              >
                Just
              </motion.span>
            </span>
            <span className="hero-split-word">
              <motion.span
                className="hero-split-inner"
                initial={{ y: "115%", opacity: 0, scale: 0.92, rotateX: 20 }}
                animate={heroRevealed ? { y: "0%", opacity: 1, scale: 1, rotateX: 0 } : {}}
                transition={{ duration: 0.75, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              >
                speak.
              </motion.span>
            </span>
            <br />
            <span className="hero-split-word">
              <motion.span
                className="hero-split-inner"
                initial={{ y: "115%", opacity: 0, scale: 0.92, rotateX: 20 }}
                animate={heroRevealed ? { y: "0%", opacity: 1, scale: 1, rotateX: 0 } : {}}
                transition={{ duration: 0.75, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                Your
              </motion.span>
            </span>
            <span className="hero-split-word">
              <motion.span
                className="hero-split-inner"
                initial={{ y: "115%", opacity: 0, scale: 0.92, rotateX: 20 }}
                animate={heroRevealed ? { y: "0%", opacity: 1, scale: 1, rotateX: 0 } : {}}
                transition={{ duration: 0.75, delay: 0.40, ease: [0.16, 1, 0.3, 1] }}
              >
                ledger
              </motion.span>
            </span>
            <span className="hero-split-word">
              <motion.span
                className="hero-split-inner"
                initial={{ y: "115%", opacity: 0, scale: 0.92, rotateX: 20 }}
                animate={heroRevealed ? { y: "0%", opacity: 1, scale: 1, rotateX: 0 } : {}}
                transition={{ duration: 0.75, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
              >
                is
              </motion.span>
            </span>
            <span className="hero-split-word">
              <motion.span
                className="hero-split-inner"
                initial={{ y: "115%", opacity: 0, scale: 0.92, rotateX: 20 }}
                animate={heroRevealed ? { y: "0%", opacity: 1, scale: 1, rotateX: 0 } : {}}
                transition={{ duration: 0.75, delay: 0.56, ease: [0.16, 1, 0.3, 1] }}
              >
                <span>done.</span>
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="hero-lead"
            initial={{ opacity: 0, y: 16 }}
            animate={heroRevealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.62, ease: [0.16, 1, 0.3, 1] }}
          >
            Your business moves fast. Keep your accounts just as effortlessly. Speak naturally, and let your day book catch up.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={heroRevealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.70, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              className="btn-primary"
              onClick={(e) => {
                if (e) {
                  e.preventDefault();
                  e.stopPropagation();
                }
                setDemoModalOpen(true);
              }}
            >
              Try the live demo <ArrowRight size={17} />
            </button>
            <a className="btn-quiet" href="#how"><span className="play-icon">▶</span> See how it works</a>
            </motion.div>

          <motion.div
            className="hero-proof"
            initial={{ opacity: 0, y: 14 }}
            animate={heroRevealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.78, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="avatar-stack flex items-center -space-x-2.5">
              <div className="avatar-item w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#F7F6F0] shadow-xs relative z-0" style={{ zIndex: 0 }}>
                <img src="/images/avatar-lion.png" alt="Lion avatar" className="avatar-img w-full h-full object-cover" />
              </div>
              <div className="avatar-item w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#F7F6F0] shadow-xs relative z-10" style={{ zIndex: 10 }}>
                <img src="/images/avatar-giraffe.png" alt="Giraffe avatar" className="avatar-img w-full h-full object-cover" />
              </div>
              <div className="avatar-item w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#F7F6F0] shadow-xs relative z-20" style={{ zIndex: 20 }}>
                <img src="/images/avatar-fox.png" alt="Fox avatar" className="avatar-img w-full h-full object-cover" />
              </div>
              <div className="avatar-item w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#F7F6F0] shadow-xs relative z-30" style={{ zIndex: 30 }}>
                <img src="/images/avatar-rabbit.png" alt="White Rabbit avatar" className="avatar-img w-full h-full object-cover" />
              </div>
            </div>
            <span>Made for everyday business</span>
            <span className="proof-divider"></span>
            <span className="proof-stars">★★★★★</span>
            <span>Simple by design</span>
          </motion.div>
        </div>

        <motion.div
          className="hero-product"
          aria-label="Interactive product preview"
          initial={{ opacity: 0, y: 50, rotateY: -8, rotateX: 4 }}
          animate={heroRevealed ? { opacity: 1, y: 0, rotateY: 0, rotateX: 0 } : {}}
          transition={{ duration: 1.05, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformPerspective: 1000, transformStyle: "preserve-3d" }}
        >
          <div className="orbit orbit-one"></div>
          <div className="orbit orbit-two"></div>

          <motion.div
            className="float-card float-income"
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={heroRevealed ? { scale: 1, opacity: 1, y: 0 } : {}}
            transition={{ type: "spring", stiffness: 420, damping: 20, delay: 0.85 }}
          >
            <span className="float-icon green"><ArrowDownRight size={15} /></span>
            <div><small>Money received</small><strong>+₹12,400</strong></div>
            <span className="float-check"><Check size={13} /></span>
          </motion.div>

          <div className="phone hero-phone-container">
            <div className="phone-screen-viewport">
              <img
                src="/images/HomeDefault_reference.png"
                alt="Easy Kanaku Mobile App Dashboard"
                className="phone-screen-img"
              />
            </div>
          </div>

          <motion.div
            className="float-card float-saved"
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={heroRevealed ? { scale: 1, opacity: 1, y: 0 } : {}}
            transition={{ type: "spring", stiffness: 420, damping: 20, delay: 0.98 }}
          >
            <span className="saved-check"><Check size={15} /></span>
            <div><strong>Entry saved</strong><small>Just like that.</small></div>
          </motion.div>

          <div className="hero-note" style={{ marginTop: "36px" }}><Sparkles size={14} /> Less typing. More doing.</div>
        </motion.div>

        <div className="hero-bottom"><span>MADE FOR BUSINESSES THAT NEVER STAND STILL</span><div><span>Retail</span><span>Food &amp; beverage</span><span>Services</span><span>Small businesses</span></div></div>
      </section>

      <FannedCardDeck />

      <HeroSection />

      <InteractiveHoverFeatures />


      <section id="languages" className="language-section reveal"><div className="language-inner"><div className="section-kicker">YOUR LANGUAGE. YOUR BUSINESS.</div><h2>Business has its own language.<br /><em>Use yours.</em></h2><p>Choose a language and hear a sample phrase. The live demo will use your selection where your browser supports speech recognition.</p><div className="language-picker">{Object.keys(languageSamples).map((lang, i) => <button key={lang} className={language === lang ? 'language-chip selected' : 'language-chip'} onClick={() => { setLanguage(lang); setToast(`${lang} selected`); }}><span className="lang-num">0{i + 1}</span><b>{lang}</b><span className="lang-check">{language === lang ? <Check size={15} /> : <AudioLines size={15} />}</span></button>)}</div><div className="language-sample"><span className="sample-label"><AudioLines size={16} /> SAMPLE PHRASE</span><p>{languageSamples[language]}</p><button
            type="button"
            onClick={(e) => {
              if (e) {
                e.preventDefault();
                e.stopPropagation();
              }
              setDemoModalOpen(true);
            }}
          >
            Try this phrase <ArrowRight size={15} />
          </button></div><div className="language-foot"><span>English</span><span>తెలుగు</span><span>தமிழ்</span><span>हिन्दी</span><span>ಕನ್ನಡ</span></div></div><div className="language-decoration"><div className="lang-orb orb-a"></div><div className="lang-orb orb-b"></div><div className="lang-sticker"><AudioLines size={26} /><span>Say it.<br />Save it.</span></div></div></section>

      <CardStack3DSection />

      <section className="preview-section section-pad reveal"><div className="section-heading"><div><div className="section-kicker">ONE PRODUCT. DIFFERENT VIEWS.</div><h2>Find the view that<br /><em>works for you.</em></h2></div><p className="muted">Tap through the preview. This is what a calmer<br />business day could look like.</p></div>
        <div className="preview-tabs" style={{justifyContent: 'center'}}>
          {['Dashboard', 'Voice Entry', 'Credit Ledger', 'Reports'].map(t =>
            <button key={t} className={activePreview === t ? 'selected' : ''} onClick={() => setActivePreview(t)}>{t}</button>
          )}
        </div>
        <div className="preview-phone-wrap">
          <div className="preview-phone-frame">
            <div className="preview-phone-top"><span className="preview-phone-time">9:41</span><span className="preview-phone-speaker"></span><span className="preview-phone-icons">● ◈</span></div>
            <div className="preview-phone-screen">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activePreview}
                  src={previewTabsData[activePreview]?.img || '/images/HomeDefault_reference.png'}
                  alt={previewTabsData[activePreview]?.alt || 'Easy Kanaku Preview'}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  className={`preview-phone-img ${activePreview === 'Voice Entry' ? 'align-bottom' : ''}`}
                />
              </AnimatePresence>
              <div className={activePreview === 'Voice Entry' ? 'preview-phone-fade-top' : 'preview-phone-fade-bottom'} />
            </div>
          </div>
        </div>
        <p className="preview-caption"><span className="live-dot"></span> Interactive product concept · Sample figures shown</p>
      </section>

      <section id="faq" className="faq-section section-pad reveal"><div className="faq-intro"><div className="section-kicker">GOOD QUESTIONS</div><h2>A few things<br />you might be <em>wondering.</em></h2><p className="muted">Still curious? Here's the short version.</p><button
            type="button"
            className="faq-link"
            onClick={(e) => {
              if (e) {
                e.preventDefault();
                e.stopPropagation();
              }
              setDemoModalOpen(true);
            }}
          >
            Try the interactive demo <ArrowRight size={15} />
          </button></div><div className="faq-list">{[
        ['What is Easy Kanaku?', 'Easy Kanaku is presented here as a voice-first bookkeeping concept for small businesses. This website is an interactive product demo, not a live account.'],
        ['Can I try the voice feature?', 'Yes. Use Chrome or another browser that supports the Web Speech API, allow microphone access, and speak a short transaction. You can also tap sample phrases or edit the transcript manually.'],
        ['Which languages can I explore?', 'The concept includes English, Telugu, Tamil, Hindi and Kannada. Actual speech recognition depends on your browser and the language support available on your device.'],
        ['Does this demo save real transactions?', 'No. It updates the sample ledger in your current page session only. There is no account, database or server connection.'],
        ['Can I export the ledger?', 'Yes. Use “Export CSV” in the live ledger panel to download the current demo entries.']
      ].map(([q, a], i) => <div className={faqOpen === i ? 'faq-item open' : 'faq-item'} key={q}><button onClick={() => setFaqOpen(faqOpen === i ? -1 : i)} aria-expanded={faqOpen === i}><span className="faq-index">0{i + 1}</span><b>{q}</b><span className="faq-toggle">{faqOpen === i ? <X size={16} /> : <Plus size={16} />}</span></button>{faqOpen === i && <p>{a}</p>}</div>)}</div></section>

      </main>
    <FooterMorphSection onOpenDemo={handleOpenDemoModal} />
    <DemoComingSoonModal
      isOpen={demoModalOpen}
      onClose={() => setDemoModalOpen(false)}
    />
    {toast && <div className="toast"><Check size={16} />{toast}</div>}
  </div>;
}
createRoot(document.getElementById('root')).render(<App />);
