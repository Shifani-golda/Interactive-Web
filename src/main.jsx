import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, AudioLines, BarChart3, Bell, Check,
  ChevronDown, CircleHelp, CreditCard, Download, FileText, Globe2, Mic, MicOff,
  Plus, ReceiptText, RotateCcw, ShieldCheck, Sparkles, TrendingUp, Wallet, X
} from 'lucide-react';
import './styles.css';

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

function App() {
  const [transactions, setTransactions] = useState(seedTransactions);
  const [activeType, setActiveType] = useState('all');
  const [activePreview, setActivePreview] = useState('Dashboard');
  const [language, setLanguage] = useState('English');
  const [transcript, setTranscript] = useState('');
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState('Try a sample phrase or use your microphone.');
  const [draft, setDraft] = useState(null);
  const [faqOpen, setFaqOpen] = useState(0);
  const [toast, setToast] = useState('');
  const [showAll, setShowAll] = useState(false);
  const recognitionRef = useRef(null);
  const demoRef = useRef(null);

  const totals = useMemo(() => transactions.reduce((a,t) => {
    a[t.type] += Number(t.amount) || 0; return a;
  }, { income: 0, expense: 0, credit: 0 }), [transactions]);
  const visibleTransactions = transactions.filter(t => activeType === 'all' || t.type === activeType);
  const shownTransactions = showAll ? visibleTransactions : visibleTransactions.slice(0, 4);

  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { nodes.forEach(n => n.classList.add('visible')); return; }
    const observer = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    }), { threshold: 0.12 });
    nodes.forEach(n => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);

  function startVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setStatus('Live speech recognition is not supported in this browser. Try a sample phrase below.');
      setToast('Try Chrome for microphone support');
      return;
    }
    const recognition = new SR();
    recognition.lang = ({English:'en-IN', తెలుగు:'te-IN', தமிழ்:'ta-IN', हिन्दी:'hi-IN', ಕನ್ನಡ:'kn-IN'})[language] || 'en-IN';
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
    const rows = [['Description','Type','Amount','Time'], ...transactions.map(t => [t.title,t.type,t.amount,t.time])];
    const csv = rows.map(row => row.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a'); a.href = url; a.download = 'easy-kanakku-demo-ledger.csv'; a.click(); URL.revokeObjectURL(url);
    setToast('Demo ledger exported');
  }
  const resetDemo = () => { setTransactions(seedTransactions); setActiveType('all'); setTranscript(''); setDraft(null); setToast('Demo reset'); };

  return <div className="app-shell">
    <div className="announcement"><span className="live-dot"></span> A simpler way to keep your business moving <span className="announce-tag">Meet the interactive demo <ArrowRight size={13}/></span></div>
    <header className="nav-wrap">
      <a className="brand" href="#top" aria-label="Easy Kanakku home"><span className="brand-mark"><AudioLines size={20}/></span><span>easy<span className="brand-kanakku">kanakku</span><i>.</i></span></a>
      <nav className="nav-links"><a href="#how">How it works</a><a href="#features">Features</a><a href="#languages">Languages</a><a href="#demo">Try the demo</a><a href="#faq">FAQ</a></nav>
      <a className="nav-cta" href="#demo">Try it now <ArrowRight size={15}/></a>
      <a className="mobile-try" href="#demo">Try demo</a>
    </header>

    <main id="top">
      <section className="hero">
        <div className="hero-glow"></div>
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot"></span> BUILT FOR THE WAY YOU WORK</div>
          <h1>Just speak.<br/>Your ledger is <span>done.</span></h1>
          <p className="hero-lead">Your business moves fast. Keep your accounts just as effortlessly. Speak naturally, and let your day book catch up.</p>
          <div className="hero-actions"><a className="btn-primary" href="#demo">Try the live demo <ArrowRight size={17}/></a><a className="btn-quiet" href="#how"><span className="play-icon">↘</span> See how it works</a></div>
          <div className="hero-proof"><div className="avatar-stack"><span>P</span><span>R</span><span>S</span></div><span>Made for everyday business</span><span className="proof-divider"></span><span className="proof-stars">✳</span><span>Simple by design</span></div>
        </div>
        <div className="hero-product" aria-label="Interactive product preview">
          <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
          <div className="float-card float-income"><span className="float-icon green"><ArrowDownRight size={15}/></span><div><small>Money received</small><strong>+₹2,400</strong></div><span className="float-check"><Check size={13}/></span></div>
          <div className="phone">
            <div className="phone-top"><span>9:41</span><span className="phone-speaker"></span><span>◔ ▰</span></div>
            <div className="phone-head"><div><small>GOOD MORNING</small><h3>Your business</h3></div><div className="profile-dot">P</div></div>
            <div className="balance-card"><div className="balance-label"><Wallet size={14}/> TODAY'S OVERVIEW</div><div className="balance-number">₹12,840</div><div className="balance-foot"><span><i className="mini-dot"></i> Cash balance</span><span className="balance-change">↗ 12.8%</span></div><div className="mini-bars">{[28,42,34,58,44,72,52,84,62,75,55,92].map((h,i)=><span key={i} style={{height:h+'%'}}/>)}</div></div>
            <div className="phone-section-title">Recent activity <span>View all ↗</span></div>
            {[['↙','Ravi paid you','Today · 10:18 AM','+₹2,400','positive'],['↗','Stock purchase','Today · 09:42 AM','−₹620','negative'],['◷','Lakshmi · Udhār','Yesterday','₹850 due','credit']].map((x,i)=><div className="phone-transaction" key={i}><span className={'transaction-icon '+x[4]}>{x[0]}</span><div className="transaction-text"><b>{x[1]}</b><small>{x[2]}</small></div><strong className={x[4]}>{x[3]}</strong></div>)}
            <div className="phone-mic"><Mic size={19}/><span>Tap to speak a transaction</span><span className="mic-wave"><i/><i/><i/><i/><i/></span></div>
          </div>
          <div className="float-card float-saved"><span className="saved-check"><Check size={15}/></span><div><strong>Entry saved</strong><small>Just like that.</small></div></div>
          <div className="hero-note"><Sparkles size={14}/> Less typing. More doing.</div>
        </div>
        <div className="hero-bottom"><span>MADE FOR BUSINESSES THAT NEVER STAND STILL</span><div><span>Retail</span><span>Food & beverage</span><span>Services</span><span>Small businesses</span></div></div>
      </section>

      <section className="problem section-pad reveal">
        <div className="section-kicker">THE EVERYDAY STRUGGLE</div><div className="problem-grid"><h2>Running a business<br/>is hard enough.</h2><div><p className="section-lead">Your accounts shouldn't be another job at the end of the day.</p><p className="muted">Too much typing, complicated screens, and language barriers turn simple bookkeeping into a chore. Easy Kanakku makes the everyday feel easy again.</p></div></div>
        <div className="pain-row"><div className="pain-item"><span className="pain-icon"><FileText size={19}/></span><div><b>Too much typing</b><p>Every small sale shouldn't mean a long form.</p></div><span className="pain-number">01</span></div><div className="pain-item"><span className="pain-icon"><BarChart3 size={19}/></span><div><b>Complicated entries</b><p>Keep your books clear without the jargon.</p></div><span className="pain-number">02</span></div><div className="pain-item"><span className="pain-icon"><Globe2 size={19}/></span><div><b>Language barriers</b><p>Speak in the language that feels natural.</p></div><span className="pain-number">03</span></div></div>
      </section>

      <section id="how" className="how-section section-pad reveal"><div className="section-heading"><div><div className="section-kicker">THREE STEPS. THAT'S IT.</div><h2>From voice to <em>visibility.</em></h2></div><p className="muted">No accounting degree required.<br/>Just your voice and your business.</p></div>
        <div className="steps"><div className="step-line"></div>{[['01','Say it naturally','“Ravi paid me 2,400 rupees.”','mic'],['02','We make sense of it','Your words become a clear entry.','spark'],['03','Your books stay ready','See your day, your way.','chart']].map((s,i)=><div className="step" key={s[0]}><div className="step-num">{s[0]}</div><div className="step-icon">{s[3]==='mic'?<Mic/>:s[3]==='spark'?<Sparkles/>:<BarChart3/>}</div><h3>{s[1]}</h3><p>{s[2]}</p><span className="step-arrow">{i===2?'✓':'↗'}</span></div>)}</div>
      </section>

      <section id="features" className="features-section section-pad reveal"><div className="section-heading"><div><div className="section-kicker">SMALL DETAILS. BIG RELIEF.</div><h2>Your business toolkit,<br/><em>without the busywork.</em></h2></div><p className="muted">Everything you need to stay on top<br/>of your day, all in one place.</p></div>
        <div className="bento-grid">
          <article className="feature-card feature-language"><div className="feature-top"><span className="feature-icon"><AudioLines/></span><span className="feature-index">01 / VOICE</span></div><h3>Speak the way<br/>you actually speak.</h3><p>Capture everyday transactions in your preferred language, without stopping what you're doing.</p><div className="voice-visual"><div className="voice-bubble">“Ravi paid 2,400 today”</div><div className="voice-wave">{[12,25,18,36,26,44,30,52,20,40,28,16,34,23,43,17,29,12].map((h,i)=><i key={i} style={{height:h}}/>)}</div><span className="voice-status"><span className="live-dot"></span> Ready when you are</span></div></article>
          <article className="feature-card feature-credit"><div className="feature-top"><span className="feature-icon yellow"><CreditCard/></span><span className="feature-index">02 / UDHĀR</span></div><h3>Keep every promise<br/>in one place.</h3><p>Track what customers owe, without losing a note or a name.</p><div className="credit-mini"><div><span className="credit-avatar">L</span><div><b>Lakshmi Stores</b><small>Due in 7 days</small></div></div><strong>₹850</strong></div><div className="credit-mini"><div><span className="credit-avatar purple">R</span><div><b>Ramesh</b><small>Due tomorrow</small></div></div><strong>₹1,200</strong></div></article>
          <article className="feature-card feature-reports"><div className="feature-top"><span className="feature-icon"><TrendingUp/></span><span className="feature-index">03 / REPORTS</span></div><h3>Know your numbers.</h3><p>A clearer view of where your business stands today.</p><div className="report-chart"><div className="chart-label"><span>This week</span><b>₹18,420 <i>↗ 8.4%</i></b></div><div className="report-bars">{[42,55,36,68,48,80,61,72,54,92,67,78,60,85].map((h,i)=><span key={i} style={{height:h+'%'}}/>)}</div><div className="chart-days"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div></div></article>
          <article className="feature-card feature-daybook"><div className="feature-top"><span className="feature-icon"><ReceiptText/></span><span className="feature-index">04 / DAY BOOK</span></div><h3>A tidy record of every day.</h3><p>Income, expenses and credit, all in a single timeline.</p><div className="daybook-list"><span><i className="book-dot green-dot"></i>Income <b>₹4,200</b></span><span><i className="book-dot red-dot"></i>Expenses <b>₹1,120</b></span><span><i className="book-dot yellow-dot"></i>Credit <b>₹850</b></span></div></article>
          <article className="feature-card feature-bills"><div className="feature-top"><span className="feature-icon yellow"><Download/></span><span className="feature-index">05 / RECORDS</span></div><h3>Receipts that stay found.</h3><p>Keep supporting details close to your transactions and export a clean record when you need it.</p><div className="receipt-preview"><div className="receipt-icon"><ReceiptText size={18}/></div><div><b>daily-ledger.csv</b><small>Ready to export · Demo</small></div><Check size={16}/></div></article>
          <article className="feature-card feature-reminder"><div className="feature-top"><span className="feature-icon"><Bell/></span><span className="feature-index">06 / REMINDERS</span></div><h3>Fewer things to remember.</h3><p>Keep due dates and daily entries from slipping through the cracks.</p><div className="reminder-pill"><span className="live-dot"></span> 2 follow-ups to review</div></article>
        </div>
      </section>

      <section id="languages" className="language-section reveal"><div className="language-inner"><div className="section-kicker">YOUR LANGUAGE. YOUR BUSINESS.</div><h2>Business has its own language.<br/><em>Use yours.</em></h2><p>Choose a language and hear a sample phrase. The live demo will use your selection where your browser supports speech recognition.</p><div className="language-picker">{Object.keys(languageSamples).map((lang,i)=><button key={lang} className={language===lang?'language-chip selected':'language-chip'} onClick={()=>{setLanguage(lang);setToast(`${lang} selected`);}}><span className="lang-num">0{i+1}</span><b>{lang}</b><span className="lang-check">{language===lang?<Check size={15}/>:<AudioLines size={15}/>}</span></button>)}</div><div className="language-sample"><span className="sample-label"><AudioLines size={16}/> SAMPLE PHRASE</span><p>{languageSamples[language]}</p><button onClick={()=>useSample(languageSamples[language])}>Try this phrase <ArrowRight size={15}/></button></div><div className="language-foot"><span>English</span><span>తెలుగు</span><span>தமிழ்</span><span>हिन्दी</span><span>ಕನ್ನಡ</span></div></div><div className="language-decoration"><div className="lang-orb orb-a"></div><div className="lang-orb orb-b"></div><div className="lang-sticker"><AudioLines size={26}/><span>Say it.<br/>Save it.</span></div></div></section>

      <section id="demo" className="demo-section section-pad reveal" ref={demoRef}><div className="section-heading demo-heading"><div><div className="section-kicker">YOUR TURN TO TRY</div><h2>Don't take our word for it.<br/><em>Give it a go.</em></h2></div><div className="demo-badge"><span className="live-dot"></span> INTERACTIVE DEMO <span className="demo-badge-dot">·</span> NO ACCOUNT NEEDED</div></div>
        <div className="demo-grid">
          <div className="voice-demo panel"><div className="panel-header"><div><span className="panel-kicker">01 — VOICE ENTRY</span><h3>Say it. We'll sort it.</h3></div><span className="panel-symbol"><Mic size={19}/></span></div><p className="muted">Try speaking a transaction or tap a sample. Review the interpretation before adding it.</p>
            <div className={recording?'voice-record-area recording':'voice-record-area'}><div className="voice-orb"><div className="voice-orb-inner">{recording?<AudioLines size={28}/>:<Mic size={28}/>}</div><div className="voice-rings"></div></div><div className="record-copy"><b>{recording?'Listening to you…':'Ready for your voice'}</b><span>{recording?'Speak clearly, then pause to finish.':'Microphone access may be required.'}</span></div><button className={recording?'record-button stop':'record-button'} onClick={recording?stopVoice:startVoice}>{recording?<><MicOff size={17}/> Stop listening</>:<><Mic size={17}/> Start speaking</>}</button></div>
            <div className="or-divider"><span>OR TRY A SAMPLE</span></div><div className="sample-buttons"><button onClick={()=>useSample('Received 2,400 rupees from Ravi')}>+ Received ₹2,400</button><button onClick={()=>useSample('Spent 620 rupees on stock')}>− Spent ₹620</button><button onClick={()=>useSample('Credit 850 rupees to Lakshmi')}>◷ Credit ₹850</button></div>
            <label className="entry-label" htmlFor="transcript">TRANSCRIPT / EDIT YOUR ENTRY</label><textarea id="transcript" value={transcript} onChange={e=>{setTranscript(e.target.value);setDraft(parseEntry(e.target.value));}} placeholder="Example: Ravi paid 2400 rupees today…" rows="2"/>
            {draft&&<div className="parsed-entry"><div className="parsed-head"><span><Sparkles size={15}/> INTERPRETED ENTRY</span><button onClick={()=>setDraft(null)} aria-label="Clear interpreted entry"><X size={15}/></button></div><label>Description<input value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})}/></label><div className="parsed-fields"><label>Amount (₹)<input type="number" min="0" value={draft.amount} onChange={e=>setDraft({...draft,amount:e.target.value})}/></label><label>Category<select value={draft.type} onChange={e=>setDraft({...draft,type:e.target.value})}><option value="income">Income</option><option value="expense">Expense</option><option value="credit">Credit / Udhār</option></select></label></div><button className="save-entry" onClick={addEntry}><Plus size={16}/> Add to demo ledger <ArrowRight size={15}/></button></div>}
            <div className="demo-status"><span className="status-check"><Check size={13}/></span>{status}</div>
          </div>
          <div className="ledger-demo panel"><div className="panel-header"><div><span className="panel-kicker">02 — LIVE LEDGER</span><h3>Your day, at a glance.</h3></div><button className="icon-action" onClick={resetDemo} title="Reset demo"><RotateCcw size={16}/></button></div>
            <div className="ledger-summary"><div className="ledger-total"><span>Income in demo</span><strong>{money(totals.income)}</strong><small><ArrowDownRight size={13}/> Money in</small></div><div className="ledger-total"><span>Expenses in demo</span><strong>{money(totals.expense)}</strong><small className="expense-caption"><ArrowUpRight size={13}/> Money out</small></div></div>
            <div className="ledger-credit"><div><span>Outstanding credit</span><small>Udhār to follow up</small></div><strong>{money(totals.credit)}</strong></div>
            <div className="ledger-filter" role="tablist" aria-label="Filter ledger">{[['all','All'],['income','Income'],['expense','Expense'],['credit','Credit']].map(([key,label])=><button role="tab" aria-selected={activeType===key} className={activeType===key?'active':''} key={key} onClick={()=>setActiveType(key)}>{label}</button>)}</div>
            <div className="ledger-list">{shownTransactions.length?shownTransactions.map(t=><div className="ledger-row" key={t.id}><span className={'ledger-type '+t.type}>{t.type==='income'?<ArrowDownRight size={17}/>:t.type==='expense'?<ArrowUpRight size={17}/>:<CreditCard size={16}/>}</span><div className="ledger-description"><b>{t.title}</b><small>{t.note} · {t.time}</small></div><strong className={t.type}>{t.type==='expense'?'−':t.type==='credit'?'':'+'}{money(t.amount)}</strong></div>):<div className="empty-ledger">No entries in this category yet.</div>}</div>
            {visibleTransactions.length>4&&<button className="show-more" onClick={()=>setShowAll(!showAll)}>{showAll?'Show less':'Show all entries'} <ChevronDown size={14}/></button>}
            <div className="ledger-footer"><span><span className="live-dot"></span> Updates instantly in this session</span><button onClick={exportCsv}><Download size={14}/> Export CSV</button></div>
          </div>
        </div>
        <p className="demo-disclaimer"><ShieldCheck size={14}/> This is an interactive browser demo using sample data. Entries stay in this page session; it is not connected to a real account or backend.</p>
      </section>

      <section className="preview-section section-pad reveal"><div className="section-heading"><div><div className="section-kicker">ONE PRODUCT. DIFFERENT VIEWS.</div><h2>Find the view that<br/><em>works for you.</em></h2></div><p className="muted">Tap through the preview. This is what a calmer<br/>business day could look like.</p></div>
        <div className="preview-tabs">{['Dashboard','Voice Entry','Udhār Ledger','Reports'].map(t=><button key={t} className={activePreview===t?'selected':''} onClick={()=>setActivePreview(t)}>{t}</button>)}</div>
        <div className="preview-window"><div className="preview-sidebar"><div className="mini-brand"><span className="brand-mark"><AudioLines size={16}/></span><b>easykanakku</b></div><div className="sidebar-links">{[['Dashboard','▦'],['Voice Entry','◖'],['Udhār Ledger','◷'],['Reports','⌁']].map(([t,ic])=><button key={t} className={activePreview===t?'active':''} onClick={()=>setActivePreview(t)}><span>{ic}</span>{t}</button>)}</div><div className="sidebar-user"><span className="profile-dot">P</span><div><b>Priya's Store</b><small>Demo workspace</small></div></div></div>
          <div className="preview-content"><div className="preview-toolbar"><div><small>YOUR BUSINESS / OVERVIEW</small><h3>{activePreview==='Dashboard'?'Good morning, Priya 👋':activePreview==='Voice Entry'?'Voice entry':activePreview==='Udhār Ledger'?'Customer credit':'Business reports'}</h3></div><span className="preview-date">Today, 30 Oct <ChevronDown size={13}/></span></div>
            {activePreview==='Dashboard'&&<><div className="preview-stat-grid"><div><small>Total income</small><strong>₹24,800</strong><span>↗ 12.8% this week</span></div><div><small>Total expenses</small><strong>₹8,240</strong><span>↘ 4.2% this week</span></div><div><small>Outstanding credit</small><strong>₹3,450</strong><span>3 customers</span></div></div><div className="preview-chart-card"><div><b>Cash flow</b><small>Income vs expenses · this week</small></div><div className="big-chart">{[48,67,42,76,55,84,62,92,70,61,80,52,72,90,65,78,48,82].map((h,i)=><span key={i} style={{height:h+'%'}}/>)}</div><div className="chart-legend"><span><i className="green-dot"></i> Income</span><span><i className="yellow-dot"></i> Expenses</span></div></div></>}
            {activePreview==='Voice Entry'&&<div className="preview-interactive"><div className="preview-mic"><Mic size={25}/></div><h4>Say what happened.</h4><p>“Received 1,500 rupees from Meena”</p><button onClick={()=>{useSample('Received 1,500 rupees from Meena');document.getElementById('demo').scrollIntoView({behavior:'smooth'});}}>Try this in the live demo <ArrowRight size={14}/></button></div>}
            {activePreview==='Udhār Ledger'&&<div className="preview-table"><div className="table-row table-head"><span>Customer</span><span>Due date</span><span>Amount</span><span>Status</span></div>{[['Lakshmi Stores','06 Nov','₹850','Upcoming'],['Ramesh Kumar','31 Oct','₹1,200','Due soon'],['Meena Traders','10 Nov','₹1,400','Upcoming']].map(r=><div className="table-row" key={r[0]}>{r.map((v,i)=><span key={i} className={i===3?'status-cell':''}>{v}</span>)}</div>)}</div>}
            {activePreview==='Reports'&&<div className="report-preview"><div className="report-total"><small>Net movement (sample)</small><strong>₹16,560</strong><span>Income minus expenses</span></div><div className="report-donut"><div><b>76%</b><small>income</small></div></div><div className="report-key"><span><i className="green-dot"></i> Income <b>₹24,800</b></span><span><i className="yellow-dot"></i> Expenses <b>₹8,240</b></span></div></div>}
          </div></div><p className="preview-caption"><span className="live-dot"></span> Interactive product concept · Sample figures shown</p>
      </section>

      <section className="trust-section section-pad reveal"><div className="trust-intro"><div className="section-kicker">DESIGNED FOR REAL LIFE</div><h2>Less friction.<br/><em>More confidence.</em></h2><p className="muted">Tools should make your work feel lighter, not add another layer of work.</p></div><div className="trust-points"><div><span><ShieldCheck/></span><section><b>Clear, reviewable entries</b><p>Check the interpreted details before adding them in this demo.</p></section></div><div><span><Wallet/></span><section><b>One place for your day</b><p>See income, expenses and customer credit together.</p></section></div><div><span><Download/></span><section><b>Your data, in a useful format</b><p>Export the sample ledger as CSV to explore it further.</p></section></div></div></section>

      <section id="faq" className="faq-section section-pad reveal"><div className="faq-intro"><div className="section-kicker">GOOD QUESTIONS</div><h2>A few things<br/>you might be <em>wondering.</em></h2><p className="muted">Still curious? Here's the short version.</p><a href="#demo" className="faq-link">Try the interactive demo <ArrowRight size={15}/></a></div><div className="faq-list">{[
        ['What is Easy Kanakku?','Easy Kanakku is presented here as a voice-first bookkeeping concept for small businesses. This website is an interactive product demo, not a live account.'],
        ['Can I try the voice feature?','Yes. Use Chrome or another browser that supports the Web Speech API, allow microphone access, and speak a short transaction. You can also tap sample phrases or edit the transcript manually.'],
        ['Which languages can I explore?','The concept includes English, Telugu, Tamil, Hindi and Kannada. Actual speech recognition depends on your browser and the language support available on your device.'],
        ['Does this demo save real transactions?','No. It updates the sample ledger in your current page session only. There is no account, database or server connection.'],
        ['Can I export the ledger?','Yes. Use “Export CSV” in the live ledger panel to download the current demo entries.']
      ].map(([q,a],i)=><div className={faqOpen===i?'faq-item open':'faq-item'} key={q}><button onClick={()=>setFaqOpen(faqOpen===i?-1:i)} aria-expanded={faqOpen===i}><span className="faq-index">0{i+1}</span><b>{q}</b><span className="faq-toggle">{faqOpen===i?<X size={16}/>:<Plus size={16}/>}</span></button>{faqOpen===i&&<p>{a}</p>}</div>)}</div></section>

      <section className="final-cta"><div className="cta-glow"></div><div className="section-kicker">YOUR NEXT CHAPTER STARTS HERE</div><h2>Put down the pen.<br/>Start <em>speaking.</em></h2><p>Give the demo a try. Your next transaction could be the easiest one yet.</p><a className="btn-primary" href="#demo">Try the interactive demo <ArrowRight size={17}/></a><div className="cta-bottom"><span><AudioLines size={16}/> easykanakku</span><span>Made for the everyday hustle.</span></div></section>
    </main>
    <footer className="footer"><div className="footer-brand"><a className="brand" href="#top"><span className="brand-mark"><AudioLines size={20}/></span><span>easy<span className="brand-kanakku">kanakku</span><i>.</i></span></a><p>Business bookkeeping, reimagined<br/>around the way you work.</p></div><div className="footer-links"><a href="#how">How it works</a><a href="#features">Features</a><a href="#languages">Languages</a><a href="#demo">Interactive demo</a><a href="#faq">FAQ</a></div><div className="footer-note">© 2026 Easy Kanakku concept redesign<br/>Demo content only · Verify product claims before launch.</div></footer>
    {toast&&<div className="toast"><Check size={16}/>{toast}</div>}
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
