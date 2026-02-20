import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";

// ─── FONTS ────────────────────────────────────────────────────────────────────
if (!document.getElementById("mp-font")) {
  const l = document.createElement("link");
  l.id = "mp-font"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap";
  document.head.appendChild(l);
}

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
if (!document.getElementById("mp5-css")) {
  const s = document.createElement("style");
  s.id = "mp5-css";
  s.textContent = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --bg:#060608; --card:#0f0f13; --b1:rgba(255,255,255,.06); --b2:rgba(255,255,255,.1);
    --blue:#4F8EF7; --purple:#9D6EF8; --green:#0FD98A; --red:#F05252; --amber:#F5A623;
    --t1:#F2F0EE; --t2:#888; --t3:#404040;
    --nav-h:62px;
    --ffd:'Syne',sans-serif; --ffm:'Space Mono',monospace; --ffb:'DM Sans',sans-serif;
  }
  html,body{height:100%;overflow:hidden;background:var(--bg);color:var(--t1);
    font-family:var(--ffb);-webkit-font-smoothing:antialiased;touch-action:manipulation;}
  input,textarea{font-family:var(--ffb);outline:none;border:none;}
  textarea{resize:none;}
  ::-webkit-scrollbar{width:2px;}
  ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:1px;}

  /* ── Core utility ── */
  @keyframes orb-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes orb-glow    { 0%,100%{box-shadow:0 0 14px rgba(79,142,247,.45),0 0 30px rgba(157,110,248,.16)} 50%{box-shadow:0 0 26px rgba(79,142,247,.7),0 0 55px rgba(157,110,248,.32)} }
  @keyframes ripple-out  { from{transform:scale(.7);opacity:.7} to{transform:scale(3);opacity:0} }
  @keyframes burst-p     { 0%{transform:translate(-50%,-50%) scale(1);opacity:.8} 100%{transform:translate(calc(-50% + var(--bx)),calc(-50% + var(--by))) scale(0);opacity:0} }
  @keyframes chart-draw  { from{stroke-dashoffset:var(--dl,1400)} to{stroke-dashoffset:0} }
  @keyframes ticker-scroll{ from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes screen-in   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pop-in      { from{opacity:0;transform:scale(.88)} to{opacity:1;transform:scale(1)} }
  @keyframes shake-card  { 0%,100%{transform:translateX(0) rotate(0deg)} 20%{transform:translateX(-7px) rotate(-1deg)} 40%{transform:translateX(7px) rotate(1deg)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
  @keyframes xp-rise     { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-24px)} }
  @keyframes dot-pulse   { 0%,80%,100%{transform:scale(.6);opacity:.3} 40%{transform:scale(1);opacity:1} }
  @keyframes bubble-in   { from{opacity:0;transform:translateY(6px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes bubble-out  { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(4px) scale(.96)} }

  /* ── Lesson scene animations ── */
  @keyframes scene-drop  { from{opacity:0;transform:translateY(-20px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes word-in     { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes border-glow { 0%,100%{opacity:.5} 50%{opacity:1} }
  @keyframes node-ping   { 0%{transform:scale(1);opacity:1} 100%{transform:scale(2.2);opacity:0} }
  @keyframes insight-rise{ from{opacity:0;transform:translateY(22px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes bar-fill    { from{width:0%} to{width:var(--w,50%)} }
  @keyframes card-correct{ 0%{box-shadow:0 0 0 0 rgba(15,217,138,.0)} 40%{box-shadow:0 0 0 8px rgba(15,217,138,.18)} 100%{box-shadow:0 0 0 0 rgba(15,217,138,.0)} }
  @keyframes card-wrong  { 0%{box-shadow:0 0 0 0 rgba(240,82,82,.0)} 40%{box-shadow:0 0 0 8px rgba(240,82,82,.2)} 100%{box-shadow:0 0 0 0 rgba(240,82,82,.0)} }
  @keyframes sweep-green { from{opacity:0;transform:scaleX(0)} to{opacity:1;transform:scaleX(1)} }
  @keyframes float-p     { 0%{transform:translateY(0) translateX(0) scale(1);opacity:.6} 100%{transform:translateY(-60px) translateX(var(--px,0px)) scale(0);opacity:0} }
  @keyframes glow-pulse  { 0%,100%{opacity:.4} 50%{opacity:1} }
  @keyframes slide-up-in { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  @keyframes tick-urgent { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }

  /* ── Challenge screen animations ── */
  @keyframes xp-burst    { 0%{opacity:1;transform:translateY(0) scale(.8)} 55%{opacity:1;transform:translateY(-38px) scale(1.25)} 100%{opacity:0;transform:translateY(-60px) scale(.9)} }
  @keyframes flash-green { 0%{opacity:0} 20%{opacity:1} 100%{opacity:0} }
  @keyframes flash-red   { 0%{opacity:0} 20%{opacity:1} 100%{opacity:0} }
  @keyframes score-bump  { 0%,100%{transform:scale(1)} 45%{transform:scale(1.4)} }
  @keyframes option-in   { from{opacity:0;transform:translateY(14px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes q-dramatic  { from{opacity:0;transform:scale(.94) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes streak-fire { 0%,100%{transform:scale(1) rotate(-2deg)} 50%{transform:scale(1.12) rotate(2deg)} }
  @keyframes ring-urgent { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
  @keyframes result-drop { from{opacity:0;transform:translateY(-30px) scale(.9)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes confetti-fall{ 0%{transform:translateY(-10px) rotate(0deg);opacity:1} 100%{transform:translateY(60px) rotate(var(--r,180deg));opacity:0} }
  @keyframes shine-swipe { 0%{transform:translateX(-100%) skewX(-15deg)} 100%{transform:translateX(250%) skewX(-15deg)} }

  .tap {
    cursor:pointer; -webkit-tap-highlight-color:transparent;
    transition:transform .12s cubic-bezier(.34,1.56,.64,1), opacity .1s ease;
    user-select:none;
  }
  .tap:active { transform:scale(.93); opacity:.78; }
  .btn-glow { position:relative; overflow:hidden; }
  .btn-glow::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent); transform:translateX(-100%) skewX(-15deg); transition:transform 0s; }
  .btn-glow:hover::after { transform:translateX(200%) skewX(-15deg); transition:transform .55s ease; }
  `;
  document.head.appendChild(s);
}

// ─── SOUND ENGINE — Web Audio API, zero dependencies ─────────────────────────
const SFX = (() => {
  let ctx = null;
  const ac = () => { if (!ctx) ctx = new (window.AudioContext||window.webkitAudioContext)(); return ctx; };

  const tone = (freq, type='sine', vol=0.18, start=0, dur=0.12, ramp=0.08) => {
    try {
      const c=ac(), o=c.createOscillator(), g=c.createGain();
      o.connect(g); g.connect(c.destination);
      o.type=type; o.frequency.setValueAtTime(freq,c.currentTime+start);
      g.gain.setValueAtTime(0,c.currentTime+start);
      g.gain.linearRampToValueAtTime(vol,c.currentTime+start+0.01);
      g.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+start+dur);
      o.start(c.currentTime+start); o.stop(c.currentTime+start+dur+ramp);
    } catch(e){}
  };

  const chord = (freqs, type='sine', vol=0.13, dur=0.22) =>
    freqs.forEach((f,i) => tone(f, type, vol, i*0.015, dur));

  return {
    tap:     () => tone(880,'sine',0.06,0,0.06),
    correct: () => { chord([523,659,784],'sine',0.14,0.28); tone(1047,'sine',0.09,0.12,0.18); },
    wrong:   () => { tone(220,'sawtooth',0.12,0,0.06); tone(196,'sawtooth',0.1,0.04,0.1); },
    reveal:  () => { [440,554,659,880].forEach((f,i)=>tone(f,'sine',0.1,i*0.07,0.18)); },
    xp:      () => { [784,988,1175].forEach((f,i)=>tone(f,'sine',0.1,i*0.055,0.15)); },
    step:    () => tone(660,'sine',0.08,0,0.1),
    tick:    () => tone(1200,'sine',0.04,0,0.04),
    tickUrgent:()=> { tone(1400,'square',0.06,0,0.04); tone(1400,'square',0.04,0.06,0.04); },
    complete:() => {
      [523,659,784,1047,1319].forEach((f,i)=>tone(f,'sine',0.13,i*0.09,0.25));
      tone(1568,'sine',0.1,0.55,0.35);
    },
    allocate:() => tone(740,'sine',0.07,0,0.08),
  };
})();

// ─── HAPTICS ──────────────────────────────────────────────────────────────────
const vib = p => navigator?.vibrate?.(p);
const H = {
  light:   () => vib(6),
  medium:  () => vib(18),
  success: () => vib([6,38,10]),
  error:   () => vib([15,26,15]),
};

// ─── LEVELS ───────────────────────────────────────────────────────────────────
const LEVELS = [
  {name:"Observer",   min:0,    color:"#666",    icon:"👁️"},
  {name:"Analyst",    min:150,  color:"#3B82F6", icon:"📊"},
  {name:"Strategist", min:400,  color:"#8B5CF6", icon:"⚡"},
  {name:"Architect",  min:800,  color:"#10B981", icon:"🏛️"},
  {name:"Macro Mind", min:1500, color:"#F59E0B", icon:"🌐"},
];
const getLevel = xp => {
  for (let i=LEVELS.length-1;i>=0;i--) if(xp>=LEVELS[i].min) return{...LEVELS[i],idx:i};
  return{...LEVELS[0],idx:0};
};

const CUES = {
  correct:["You saw that.","Clean read.","That instinct is improving.","Exactly right.","Most people miss that."],
  wrong:  ["Look again.","Think about who benefits.","Context changes everything.","You hesitated."],
  twist:  ["It shifted. Did you catch it?","Markets don't warn you.","This one's different."],
  start:  ["Ready to sharpen your edge?","Let's see what you've got.","Welcome back."],
  trade:  ["Allocate with intent.","Every position is a thesis.","The clock is live."],
  hook:   ["One more confirms it.","Your pattern recognition is building.","Keep going."],
};
const cue = k => { const a=CUES[k]||CUES.start; return a[Math.floor(Math.random()*a.length)]; };

// ══════════════════════════════════════════════════════════════════════════════
// QUESTION BANK — beginner-first, progressive difficulty, broad topics
// tier: 1=beginner, 2=easy, 3=medium, 4=hard, 5=advanced
// cat: 💼 Business | 💰 Finance | 📈 Investing | 🏦 Economics | 📊 Markets
// ══════════════════════════════════════════════════════════════════════════════
const ALL_QUESTIONS = [
  // ── TIER 1: Absolute beginner ──────────────────────────────────────────────
  { tier:1, cat:"💼 Business",
    q:"What does it mean for a company to make a 'profit'?",
    opts:["Revenue minus all costs equals profit","Total money the company receives","Money paid to employees","Loans taken from the bank"],
    ans:0, explain:"Profit = Revenue − Costs. If a coffee shop earns £1,000 and spends £700, profit is £300. Simple." },
  { tier:1, cat:"💼 Business",
    q:"What is 'revenue'?",
    opts:["The profit after expenses","The total money a business earns from sales","The money left in the bank","The amount owed to suppliers"],
    ans:1, explain:"Revenue is the top line — all money coming in before any costs are subtracted. Think of it as the gross score." },
  { tier:1, cat:"💼 Business",
    q:"A shop earns £500 this week but spent £600 on stock and rent. What happened?",
    opts:["It made a £100 profit","It broke even","It made a £100 loss","It made a £1,100 profit"],
    ans:2, explain:"£500 in, £600 out = £100 loss. Spending more than you earn is called operating at a loss." },
  { tier:1, cat:"📈 Investing",
    q:"What is a 'stock' (also called a share)?",
    opts:["A loan you give to a company","A small piece of ownership in a company","A government savings certificate","A monthly payment from a bank"],
    ans:1, explain:"Owning 1 share of Apple means you own a tiny slice of Apple. If Apple grows, your slice is worth more." },
  { tier:1, cat:"💰 Finance",
    q:"You borrow £1,000 from a bank at 10% interest per year. How much do you owe after one year?",
    opts:["£1,000","£1,010","£1,100","£1,010"],
    ans:2, explain:"10% of £1,000 is £100 in interest. You pay back the original £1,000 plus £100 interest = £1,100." },
  { tier:1, cat:"🏦 Economics",
    q:"What is 'inflation' in simple terms?",
    opts:["When the economy grows fast","When prices of everyday goods rise over time","When a stock's price increases","When the government cuts taxes"],
    ans:1, explain:"Inflation means your money buys less over time. If a coffee costs £2 today and £2.10 next year, that's 5% inflation." },
  { tier:1, cat:"💼 Business",
    q:"What does a CEO do?",
    opts:["Designs the company's products","Manages day-to-day accounting","Leads the company and makes major decisions","Approves employee salaries one by one"],
    ans:2, explain:"CEO = Chief Executive Officer. They set strategy and direction. Think of them as the captain of the ship." },
  { tier:1, cat:"💰 Finance",
    q:"What's the difference between a debit card and a credit card?",
    opts:["They work the same way","Debit uses your own money; credit borrows from the bank","Credit uses your own money; debit borrows","Debit cards have higher spending limits"],
    ans:1, explain:"Debit pulls directly from your bank account. Credit is a short-term loan from the bank that you repay later." },

  // ── TIER 2: Easy ──────────────────────────────────────────────────────────
  { tier:2, cat:"💰 Finance",
    q:"You save £200/month. After 12 months, how much have you saved (no interest)?",
    opts:["£1,200","£2,000","£2,400","£2,400"],
    ans:2, explain:"£200 × 12 months = £2,400. Simple saving discipline compounds fast over years." },
  { tier:2, cat:"📈 Investing",
    q:"What does it mean to 'diversify' your investments?",
    opts:["Put all your money in the best-performing stock","Spread money across different investments to reduce risk","Only invest in safe government bonds","Sell everything when prices fall"],
    ans:1, explain:"Don't put all eggs in one basket. If you own stocks, bonds, and property, a crash in one doesn't wipe you out." },
  { tier:2, cat:"📈 Investing",
    q:"A company pays a 'dividend'. What is that?",
    opts:["A penalty for poor performance","A share of profits paid to shareholders","A tax on company earnings","A loan from investors"],
    ans:1, explain:"Dividends reward shareholders with cash from profits. McDonald's pays a dividend every quarter — you get paid just for owning shares." },
  { tier:2, cat:"📊 Markets",
    q:"When demand for a product is high but supply is low, what usually happens to the price?",
    opts:["Price falls","Price stays the same","Price rises","Government steps in to fix the price"],
    ans:2, explain:"Classic supply and demand. Concert tickets sell out → touts charge £300 for a £50 ticket. Scarcity drives price up." },
  { tier:2, cat:"🏦 Economics",
    q:"What does a 'central bank' (like the Bank of England or US Federal Reserve) do?",
    opts:["It lends money directly to individuals","It controls interest rates and manages a country's money supply","It invests in the stock market for the government","It collects taxes on behalf of the government"],
    ans:1, explain:"The Bank of England sets base interest rates and ensures financial stability. When they raise rates, borrowing gets more expensive for everyone." },
  { tier:2, cat:"💼 Business",
    q:"A startup raises money from investors by giving them shares. What does this mean for the founders?",
    opts:["They get free money they never repay","They give up a percentage of ownership in exchange for cash","They take on debt that must be repaid with interest","They hand over full control of the company"],
    ans:1, explain:"Equity fundraising = selling ownership. Investors own a slice; founders own less but now have cash to grow." },
  { tier:2, cat:"💰 Finance",
    q:"You have £5,000 in credit card debt at 20% annual interest. What happens if you don't pay it for a year?",
    opts:["You owe exactly £5,000 still","You owe £5,100","You owe £6,000","You owe £5,200"],
    ans:2, explain:"20% of £5,000 = £1,000 in interest. Total = £6,000. High-interest debt compounds fast — this is why credit cards are dangerous." },
  { tier:2, cat:"📈 Investing",
    q:"What is a 'bull market'?",
    opts:["Prices are falling overall","Prices are rising overall","A market that only trades commodities","Trading sessions that start at dawn"],
    ans:1, explain:"Bull = charging upward. Bear = falling. Bull markets are periods of general optimism and rising stock prices." },

  // ── TIER 3: Medium ────────────────────────────────────────────────────────
  { tier:3, cat:"🏦 Economics",
    q:"The Bank of England raises interest rates from 4% to 5.5%. What's the most likely effect on borrowing?",
    opts:["More people borrow because returns are higher","Fewer people borrow because monthly repayments increase","Nothing changes","Only big companies are affected"],
    ans:1, explain:"Higher rates = higher monthly payments on mortgages and loans. So fewer households and businesses want to borrow." },
  { tier:3, cat:"💼 Business",
    q:"A startup is valued at £10 million. An investor pays £2 million. What percentage do they own?",
    opts:["10%","20%","25%","50%"],
    ans:1, explain:"£2M ÷ £10M = 20%. The investor now owns a fifth of the company. The founders own the other 80%." },
  { tier:3, cat:"💼 Business",
    q:"What does a company's 'balance sheet' show?",
    opts:["Monthly sales and costs","What the company owns (assets) vs what it owes (liabilities)","The share price over time","How much the CEO earns"],
    ans:1, explain:"Assets - Liabilities = Net Worth. A healthy company has more assets than liabilities." },
  { tier:3, cat:"📈 Investing",
    q:"A bond is different from a stock because:",
    opts:["Bonds give you ownership in a company","Bonds are a loan you give to a company that pays fixed interest","Bonds are riskier than stocks","Bonds never lose value"],
    ans:1, explain:"Buy a government bond = lend money to the government. They pay you interest (a 'coupon') and return your money at the end. Predictable, lower risk." },
  { tier:3, cat:"📊 Markets",
    q:"A company's revenue falls but its profit margin improves. What likely happened?",
    opts:["It sold more products","It cut costs significantly","Its share price increased","It borrowed more money"],
    ans:1, explain:"If revenue falls but profit % rises, costs fell faster. Think: a restaurant sells fewer tables but cuts food waste — profit per table goes up." },
  { tier:3, cat:"💰 Finance",
    q:"You invest £1,000 and it grows 10% per year. After 3 years (compounding), roughly how much do you have?",
    opts:["£1,100","£1,300","£1,331","£1,400"],
    ans:2, explain:"Year 1: £1,100. Year 2: £1,210. Year 3: £1,331. This is compound interest — you earn returns on your returns." },
  { tier:3, cat:"🏦 Economics",
    q:"What causes a country's currency to weaken against others?",
    opts:["High interest rates","Strong economic growth","High inflation and low interest rates","Low levels of government debt"],
    ans:2, explain:"If your currency buys less (high inflation) and returns are low (low rates), foreign investors move their money elsewhere — weakening your currency." },

  // ── TIER 4: Harder ────────────────────────────────────────────────────────
  { tier:4, cat:"💼 Business",
    q:"Revenue £500K, cost of goods £200K, operating expenses £150K. What's the operating profit?",
    opts:["£150,000","£300,000","£350,000","£500,000"],
    ans:0, explain:"500K − 200K − 150K = £150K operating profit. The first subtraction is gross profit; the second gets you to operating profit." },
  { tier:4, cat:"📊 Markets",
    q:"A company beats earnings by 8%. The stock drops 6% the next morning. What likely happened?",
    opts:["Investors expected even better results than what was delivered","The company must have committed fraud","The broader market crashed","Analysts downgraded the stock"],
    ans:0, explain:"Prices reflect expectations. If the market expected +15% and got +8%, that gap is a 'miss' — even though the raw number looks good." },
  { tier:4, cat:"📈 Investing",
    q:"Why might a company issue bonds instead of new shares to raise money?",
    opts:["Bonds give investors voting rights","Bonds don't dilute existing shareholders' ownership","Bonds are always cheaper","Bonds don't need to be repaid"],
    ans:1, explain:"New shares = more owners = each existing share is worth less (dilution). Bonds are debt — expensive, but ownership stays the same." },
  { tier:4, cat:"🏦 Economics",
    q:"Oil prices spike 40% from a supply disruption while inflation is already at 6%. Why does this trap the central bank?",
    opts:["It must raise and cut rates at the same time","Raising rates fights inflation but further hurts an already slowing economy","Central banks are legally prohibited from acting during supply shocks","Higher oil automatically reduces the need for rate hikes"],
    ans:1, explain:"Stagflation trap: supply shocks raise prices AND slow growth. Raise rates → fight inflation but cause more pain. Do nothing → inflation runs wild. Both hurt." },

  // ── TIER 5: Advanced ──────────────────────────────────────────────────────
  { tier:5, cat:"📊 Markets",
    q:"A company's P/E ratio is 40 vs the industry average of 20. What does this suggest?",
    opts:["The company is cheap compared to peers","Investors expect higher growth and are paying a premium for it","The company is making twice the profit of competitors","The company should reduce its share price"],
    ans:1, explain:"P/E = price ÷ earnings. A high P/E means investors believe future earnings will be much higher. They're paying now for tomorrow's growth." },
  { tier:5, cat:"🏦 Economics",
    q:"Why can high inflation actually benefit someone who borrowed money at a fixed interest rate?",
    opts:["It doesn't — inflation always hurts borrowers","They repay the same amount in money worth less in real terms","Their monthly payments automatically shrink","The bank forgives part of the debt during inflation"],
    ans:1, explain:"If you borrowed £100K at 3% fixed and inflation hits 8%, your salary likely rises but your repayments don't. You're repaying 'cheaper' money." },
  { tier:5, cat:"📈 Investing",
    q:"A strong US dollar hurts US companies that earn revenue overseas. Why?",
    opts:["Foreign customers pay more so revenue rises","Overseas revenue converts to fewer dollars when brought home","A strong dollar reduces production costs abroad","It prevents companies from expanding internationally"],
    ans:1, explain:"If you earn €10M and the dollar strengthens 15%, those euros convert to fewer dollars. Revenue looks fine abroad but shrinks in the annual report." },
];

// Pick questions for a session based on how many sessions played
function pickQuestions(sessionCount, count=5) {
  const tier = Math.min(5, 1 + Math.floor(sessionCount / 2));
  // Mix: mostly current tier, some from adjacent tiers
  const pool = ALL_QUESTIONS.filter(q => q.tier <= tier);
  const shuffled = [...pool].sort(() => Math.random()-.5);
  return shuffled.slice(0, count);
}

// ══════════════════════════════════════════════════════════════════════════════
// PROCEDURAL TRADING DATA ENGINE
// swap generateSession() for Supabase/API later — same shape contract
// ══════════════════════════════════════════════════════════════════════════════
const TEMPLATES = [
  { key:"conflict",
    headlines:["⚡ Armed conflict disrupts major oil corridor","🛢️ Strait of Hormuz partially blocked","⚡ Pipeline attacks cut EU gas supply by 30%"],
    subs:["Markets pricing in sustained supply disruption","Energy futures spike as traders reassess risk","Safe-haven inflows accelerate"],
    color:"#EF4444", bias:{gold:1,oil:1,tech:-1,bonds:1,btc:-1,cash:0} },
  { key:"rate_cut",
    headlines:["📉 Fed cuts 75bps — largest in 4 years","🏦 ECB emergency cut: rates fall to 1.25%","📉 Bank of England surprises with double cut"],
    subs:["Growth assets rally; yield curve steepens","Dollar weakens as rate differential narrows","Bond prices climb as yield expectations reset"],
    color:"#3B82F6", bias:{gold:1,bonds:1,tech:1,banks:-1,btc:1,cash:-1} },
  { key:"inflation",
    headlines:["📊 CPI hits 9.4% — 40-year record","📊 Core inflation prints 8.1%, double forecast","🔥 Producer prices surge 11%"],
    subs:["Rate hike expectations jump sharply","Commodities pricing persistent inflation","Growth stocks under pressure"],
    color:"#F59E0B", bias:{gold:1,oil:1,tips:1,tech:-1,bonds:-1,btc:-1} },
  { key:"recession",
    headlines:["📉 GDP contracts 2.1% — recession confirmed","📉 Two consecutive negative quarters confirmed","🏭 Manufacturing PMI collapses to 41.2"],
    subs:["Credit conditions tighten; defaults rising","Consumer spending falls third straight month","Risk appetite craters"],
    color:"#8B5CF6", bias:{gold:1,bonds:1,tech:-1,banks:-1,btc:-1,cash:1} },
];
const ASSET_POOL = [
  {id:"gold",  n:"Gold",        icon:"🥇", hint:"Safe haven in uncertainty"},
  {id:"oil",   n:"Oil",         icon:"🛢️", hint:"Supply-sensitive commodity"},
  {id:"tech",  n:"Tech Stocks", icon:"💻", hint:"High-growth, rate-sensitive"},
  {id:"bonds", n:"US Bonds",    icon:"📄", hint:"Flight-to-safety asset"},
  {id:"btc",   n:"Bitcoin",     icon:"₿",  hint:"High-volatility risk asset"},
  {id:"cash",  n:"Cash",        icon:"💵", hint:"Stable but low return"},
  {id:"banks", n:"Banks",       icon:"🏦", hint:"Rate and credit sensitive"},
  {id:"tips",  n:"TIPS Bonds",  icon:"📋", hint:"Inflation-protected bonds"},
];
function generateSession() {
  const tmpl = TEMPLATES[Math.floor(Math.random()*TEMPLATES.length)];
  const hi = Math.floor(Math.random()*tmpl.headlines.length);
  const relevant = ASSET_POOL.filter(a => tmpl.bias[a.id] !== undefined);
  const extras   = ASSET_POOL.filter(a => tmpl.bias[a.id] === undefined);
  const assets   = [...relevant, ...extras].slice(0, 5).map(a => ({
    ...a, expected: tmpl.bias[a.id] ?? (Math.random()>.5?1:-1), vol:.35+Math.random()*.75,
  }));
  return { id:`${tmpl.key}_${Date.now()}`, headline:tmpl.headlines[hi], sub:tmpl.subs[hi%tmpl.subs.length], color:tmpl.color, assets };
}
function pricePath(n=14, dir=0, vol=.5, seed=Math.random()) {
  let price=50, momentum=0;
  return Array.from({length:n}, (_,i) => {
    const noise = (Math.sin(seed*137.5*(i+1)) + Math.cos(seed*91.3*(i+1))) * vol * 3.2;
    const trend = dir * (1.6 + vol*1.8) * ((i+1)/n);
    momentum = momentum*.55 + (noise+trend)*.45;
    price = Math.max(8, Math.min(92, price+momentum));
    return +price.toFixed(2);
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// LESSON DATA
// ══════════════════════════════════════════════════════════════════════════════
const LESSON = [
  {id:"hook",    type:"choice",
   headline:"Record profits. Stock crashes.",
   body:"Company X reports its best quarter ever — revenue +22%, profit +18%. The stock falls 9% the next morning.",
   q:"What's the most likely explanation?",
   opts:[{id:"a",l:"The broader market had a bad day"},{id:"b",l:"Analysts had expected even stronger results"},{id:"c",l:"The company cut its dividend"},{id:"d",l:"Management sold shares before the report"}],
   ans:"b", explain:"Markets price expectations. The street expected +30%, got +18% — that gap is what matters, not the raw number.", cueKey:"start"},
  {id:"gap",     type:"reveal",
   headline:"The Expectation Gap.",
   insight:"Prices move on the difference between what happened and what the market expected — not the raw outcome. A stock can fall on great news, and rise on bad news.",
   cueKey:"twist"},
  {id:"alloc",   type:"allocate",
   headline:"Conflict erupts in a key oil region.",
   body:"Supply routes disrupted. Uncertainty spikes. You have 4 assets and 100% to allocate.",
   cueKey:"trade",
   assets:[
     {id:"gold",  n:"Gold",     icon:"🥇", hint:"Safe haven — surges in crises"},
     {id:"tech",  n:"Tech",     icon:"💻", hint:"Risk-off kills growth stocks"},
     {id:"bonds", n:"US Bonds", icon:"📄", hint:"Flight-to-safety default"},
     {id:"oil",   n:"Oil",      icon:"🛢️", hint:"Supply shock = price spike"},
   ]},
  {id:"twist",   type:"reveal",
   headline:"Ceasefire. Three days later.",
   body:"Oil falls 14%. Gold and bonds sell off. Tech surges as risk appetite snaps back.",
   insight:"Safe havens are priced on fear. When certainty returns, money rotates fast into higher-growth assets. This is one of the most repeatable patterns in markets.",
   cueKey:"twist"},
  {id:"rates",   type:"choice",
   headline:"Surprise rate hike: +0.75%.",
   body:"The Fed doubles what markets expected. Which asset drops hardest in the next 48 hours?",
   q:"Which suffers most from a surprise rate hike?",
   opts:[{id:"a",l:"Gold — investors prefer yield-bearing assets now"},{id:"b",l:"Long-term bonds — their fixed rates become uncompetitive"},{id:"c",l:"Cash — inflation erodes its value"},{id:"d",l:"Commodities — stronger dollar crushes prices"}],
   ans:"b", explain:"Long-term bonds reprice mechanically — their fixed future payments are immediately worth less when new bonds yield more. Duration amplifies rate sensitivity.", cueKey:"hook"},
  {id:"insight", type:"insight",
   headline:"Three rules. Every market.",
   rules:[
     {icon:"📊", rule:"Surprise drives prices, not news.", sub:"The gap between expectation and outcome is what moves markets."},
     {icon:"🔄", rule:"Risk rotates. It doesn't disappear.", sub:"Capital shifts between safe havens and growth assets as sentiment changes."},
     {icon:"⏳", rule:"Duration amplifies rate sensitivity.", sub:"Longer-dated assets feel rate changes far more than short-term ones."},
   ], cueKey:"hook"},
];

// ══════════════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════
const TICK_DATA = [
  {s:"BTC",v:"+4.2%",u:1},{s:"GOLD",v:"+1.8%",u:1},{s:"OIL",v:"-2.1%",u:0},
  {s:"S&P",v:"+0.9%",u:1},{s:"BONDS",v:"-0.5%",u:0},{s:"TECH",v:"+3.1%",u:1},
  {s:"EUR",v:"-0.2%",u:0},{s:"SILVER",v:"+2.3%",u:1},{s:"NATGAS",v:"-3.1%",u:0},
];
const Ticker = memo(() => (
  <div style={{overflow:"hidden",borderBottom:"1px solid var(--b1)",background:"rgba(6,6,6,.88)",padding:"5px 0",flexShrink:0}}>
    <div style={{display:"inline-flex",animation:"ticker-scroll 20s linear infinite",whiteSpace:"nowrap",willChange:"transform"}}>
      {[...TICK_DATA,...TICK_DATA].map((t,i)=>(
        <span key={i} style={{display:"inline-flex",gap:5,marginRight:24,fontFamily:"var(--ffm)",fontSize:10}}>
          <span style={{color:"var(--t2)"}}>{t.s}</span>
          <span style={{color:t.u?"var(--green)":"var(--red)"}}>{t.v}</span>
        </span>
      ))}
    </div>
  </div>
));

const MiniChart = memo(function MiniChart({ data, color="#3B82F6", h=60, anim=true }) {
  const uid = useRef(`c${Math.random().toString(36).slice(2)}`).current;
  if (!data||data.length<2) return null;
  const W=300,pad=5;
  const mn=Math.min(...data),mx=Math.max(...data),rng=mx-mn||1;
  const pts=data.map((v,i)=>[(i/(data.length-1))*W, h-((v-mn)/rng)*(h-pad*2)-pad]);
  const line=pts.map((p,i)=>`${i?"L":"M"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const dl=pts.reduce((acc,p,i)=>i?acc+Math.hypot(p[0]-pts[i-1][0],p[1]-pts[i-1][1]):0,0)+30;
  const last=pts[pts.length-1];
  return (
    <svg viewBox={`0 0 ${W} ${h}`} style={{width:"100%",height:h,display:"block"}}>
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".18"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={`${line} L ${W} ${h} L 0 ${h} Z`} fill={`url(#${uid})`}/>
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"
        style={anim?{strokeDasharray:dl,strokeDashoffset:dl,"--dl":dl,animation:"chart-draw 1s ease forwards"}:{}}/>
      <circle cx={last[0]} cy={last[1]} r="2.8" fill={color} style={{filter:`drop-shadow(0 0 3px ${color}80)`}}/>
    </svg>
  );
});

const Burst = memo(function Burst({ active, color="#10B981" }) {
  if (!active) return null;
  return (
    <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:40,overflow:"hidden"}}>
      {Array.from({length:12}).map((_,i)=>{
        const a=(i/12)*360, d=48+Math.random()*22;
        return <div key={i} style={{position:"absolute",top:"50%",left:"50%",width:5,height:5,borderRadius:"50%",background:color,filter:"blur(1px)","--bx":`${Math.cos(a*Math.PI/180)*d}px`,"--by":`${Math.sin(a*Math.PI/180)*d}px`,animation:`burst-p .65s ease-out ${i*20}ms forwards`}}/>;
      })}
    </div>
  );
});

const XPBar = memo(function XPBar({ xp, streak, delta }) {
  const lv=getLevel(xp), nxt=LEVELS[lv.idx+1];
  const pct=nxt?((xp-lv.min)/(nxt.min-lv.min))*100:100;
  return (
    <div style={{display:"flex",alignItems:"center",gap:7,background:"rgba(14,14,14,.95)",border:"1px solid var(--b2)",borderRadius:10,padding:"5px 10px",position:"relative",flexShrink:0}}>
      {delta>0&&<div key={delta+xp} style={{position:"absolute",top:-15,right:5,fontFamily:"var(--ffm)",fontSize:10,color:"var(--green)",fontWeight:700,animation:"xp-rise .9s ease forwards",pointerEvents:"none"}}>+{delta}</div>}
      <div>
        <div style={{fontSize:8,color:lv.color,fontFamily:"var(--ffm)",letterSpacing:".1em"}}>{lv.name.toUpperCase()}</div>
        <div style={{display:"flex",alignItems:"center",gap:5,marginTop:3}}>
          <div style={{width:60,height:2.5,borderRadius:2,background:"rgba(255,255,255,.06)",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${lv.color},#8B5CF6)`,transition:"width 1s cubic-bezier(.34,1.56,.64,1)",borderRadius:2}}/>
          </div>
          <span style={{fontSize:10,color:lv.color,fontFamily:"var(--ffm)",fontWeight:700}}>{xp}</span>
        </div>
      </div>
      {streak>0&&(
        <div style={{display:"flex",alignItems:"center",gap:2,background:"rgba(245,158,11,.1)",border:"1px solid rgba(245,158,11,.15)",borderRadius:6,padding:"2px 6px"}}>
          <span style={{fontSize:10}}>🔥</span>
          <span style={{fontSize:9,fontFamily:"var(--ffm)",color:"var(--amber)",fontWeight:700}}>{streak}</span>
        </div>
      )}
    </div>
  );
});

const Ring = memo(function Ring({ s, total, size=46 }) {
  const r=15, c=2*Math.PI*r, pct=s/total;
  const col=s<5?"var(--red)":s<10?"var(--amber)":"var(--blue)";
  return (
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <svg viewBox="0 0 36 36" style={{position:"absolute",inset:0,transform:"rotate(-90deg)"}}>
        <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth="2.5"/>
        <circle cx="18" cy="18" r={r} fill="none" stroke={col} strokeWidth="2.5"
          strokeDasharray={c} strokeDashoffset={c*(1-pct)} strokeLinecap="round"
          style={{transition:"stroke-dashoffset .85s linear, stroke .3s"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--ffm)",fontSize:11,fontWeight:700,color:col}}>{s}</div>
    </div>
  );
});

function ScreenSlot({ screenKey, children }) {
  return (
    <div key={screenKey} style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",animation:"screen-in .24s ease",willChange:"transform,opacity"}}>
      {children}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// AI FLOATING ASSISTANT — FIXED
// Key fix: welcome message is marked `ui:true` and never sent to the API.
// API conversation always starts with a user message.
// Using max_tokens:1000 and direct role mapping.
// ══════════════════════════════════════════════════════════════════════════════
function AIAssistant({ open, onToggle, nudge, nudgeKey, scenario, hasNav }) {
  const [msgs, setMsgs] = useState([
    { role:"assistant", text:"Ask me anything — what is a stock, why prices move, how businesses make money. I'll explain it simply.", ui:true }
  ]);
  const [input, setInput] = useState("");
  const [busy,  setBusy]  = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleLeaving, setBubbleLeaving] = useState(false);
  const scrollEl  = useRef(null);
  const inputEl   = useRef(null);
  const hideTimer = useRef(null);
  const leaveTimer = useRef(null);

  useEffect(() => {
    if (!nudge || open) return;
    clearTimeout(hideTimer.current);
    clearTimeout(leaveTimer.current);
    setBubbleLeaving(false);
    setShowBubble(true);
    hideTimer.current = setTimeout(() => {
      setBubbleLeaving(true);
      leaveTimer.current = setTimeout(() => setShowBubble(false), 300);
    }, 3800);
    return () => { clearTimeout(hideTimer.current); clearTimeout(leaveTimer.current); };
  }, [nudge, nudgeKey, open]);

  useEffect(() => { if (open) { setShowBubble(false); setBubbleLeaving(false); } }, [open]);

  useEffect(() => {
    scrollEl.current?.scrollTo({top:scrollEl.current.scrollHeight, behavior:"smooth"});
  }, [msgs, busy]);

  useEffect(() => {
    if (open) { const t=setTimeout(()=>inputEl.current?.focus(), 320); return ()=>clearTimeout(t); }
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    H.light();
    setInput("");
    setBusy(true);

    // Add user message to display
    const newMsgs = [...msgs, { role:"user", text }];
    setMsgs(newMsgs);

    // Build API payload — filter out UI-only messages, start with user
    const apiMsgs = newMsgs
      .filter(m => !m.ui)
      .map(m => ({ role: m.role, content: m.text }));

    const ctx = scenario ? `\nCurrent game context: "${scenario}"` : "";

    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are the AI guide inside MarketPlay, a finance learning game for beginners and teenagers.
Your role: explain finance, business, investing, and economics in simple, clear language with real examples.
Tone: Like a smart, helpful older sibling — direct, friendly, never boring or textbook-like.
Rules:
- Keep replies under 60 words. Be concise but complete.
- Use a specific real example (a company, a number, a country) whenever you can.
- Never use jargon without immediately explaining it in plain English.
- Cover any finance topic: stocks, business, personal money, economics, investing, markets.
- If asked something totally unrelated to finance, give a brief answer and connect it to a finance concept.${ctx}`,
          messages: apiMsgs,
        }),
      });
      const d = await r.json();
      const reply = d.content?.[0]?.text;
      if (reply) {
        setMsgs(m => [...m, { role:"assistant", text: reply }]);
      } else {
        setMsgs(m => [...m, { role:"assistant", text: "Hmm, let me try that again. Could you rephrase your question?" }]);
      }
    } catch (e) {
      setMsgs(m => [...m, { role:"assistant", text: "Connection issue — try again in a moment." }]);
    } finally {
      setBusy(false);
    }
  };

  const ORB_BOTTOM   = hasNav ? 14 + 62 : 14;
  const PANEL_BOTTOM = ORB_BOTTOM + 46 + 8;

  return (
    <>
      {showBubble && nudge && (
        <div style={{
          position:"absolute", bottom: ORB_BOTTOM + 46 + 8, right: 60,
          maxWidth:168, background:"rgba(13,13,13,.98)", border:"1px solid rgba(59,130,246,.2)",
          borderRadius:"12px 12px 4px 12px", padding:"9px 12px",
          fontSize:12.5, color:"#E0E0E0", lineHeight:1.45, fontFamily:"var(--ffb)",
          boxShadow:"0 4px 18px rgba(0,0,0,.55)", zIndex:118, textAlign:"right", pointerEvents:"none",
          animation: bubbleLeaving ? "bubble-out .3s ease forwards" : "bubble-in .28s cubic-bezier(.34,1.56,.64,1)",
        }}>
          {nudge}
          <div style={{width:0,height:0,borderLeft:"5px solid transparent",borderTop:"5px solid rgba(59,130,246,.2)",marginLeft:"auto",marginRight:12,marginTop:4}}/>
        </div>
      )}

      {/* Chat panel */}
      <div style={{
        position:"absolute", bottom: PANEL_BOTTOM, right:12,
        width:"min(340px, calc(100% - 24px))", height:"38vh",
        background:"rgba(11,11,11,.98)", border:"1px solid var(--b2)", borderRadius:16,
        display:"flex", flexDirection:"column", overflow:"hidden",
        boxShadow:"0 -2px 32px rgba(0,0,0,.7)", zIndex:115,
        opacity: open?1:0, transform: open?"translateY(0) scale(1)":"translateY(16px) scale(.97)",
        pointerEvents: open?"auto":"none",
        transition:"opacity .26s ease, transform .28s cubic-bezier(.34,1.56,.64,1)",
        willChange:"transform,opacity",
      }}>
        <div style={{padding:"10px 14px 8px",borderBottom:"1px solid var(--b1)",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:"radial-gradient(circle at 35% 35%,#3B82F6,#8B5CF6)",flexShrink:0}}/>
            <span style={{fontFamily:"var(--ffd)",fontSize:13,fontWeight:700,letterSpacing:"-.01em"}}>Ask anything</span>
          </div>
          <button onClick={()=>{H.light();onToggle();}} className="tap" style={{background:"rgba(255,255,255,.05)",borderRadius:7,padding:"3px 10px",color:"var(--t2)",fontSize:11,cursor:"pointer",fontFamily:"var(--ffb)"}}>
            close
          </button>
        </div>
        <div ref={scrollEl} style={{flex:1,overflow:"auto",padding:"10px 12px",display:"flex",flexDirection:"column",gap:8}}>
          {msgs.map((m,i) => (
            <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",animation:"pop-in .18s ease"}}>
              <div style={{
                maxWidth:"88%", padding:"8px 11px", fontSize:12.5, lineHeight:1.5, fontFamily:"var(--ffb)",
                borderRadius: m.role==="user"?"11px 11px 3px 11px":"11px 11px 11px 3px",
                background: m.role==="user"?"rgba(59,130,246,.13)":"rgba(255,255,255,.04)",
                border: m.role==="user"?"1px solid rgba(59,130,246,.2)":"1px solid var(--b1)",
                color:"var(--t1)",
              }}>{m.text}</div>
            </div>
          ))}
          {busy && (
            <div style={{display:"flex",justifyContent:"flex-start"}}>
              <div style={{padding:"8px 12px",background:"rgba(255,255,255,.04)",border:"1px solid var(--b1)",borderRadius:"11px 11px 11px 3px",display:"flex",gap:4,alignItems:"center"}}>
                {[0,1,2].map(i=><div key={i} style={{width:4,height:4,borderRadius:"50%",background:"var(--t2)",animation:`dot-pulse .9s ease-in-out ${i*.16}s infinite`}}/>)}
              </div>
            </div>
          )}
        </div>
        <div style={{padding:"8px 10px 10px",borderTop:"1px solid var(--b1)",display:"flex",gap:7,alignItems:"center",flexShrink:0}}>
          <input ref={inputEl} value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder="What is a stock? How do profits work?"
            style={{flex:1,height:36,background:"rgba(255,255,255,.05)",border:"1px solid var(--b2)",borderRadius:9,padding:"0 11px",color:"var(--t1)",fontSize:13,transition:"border-color .18s"}}
            onFocus={e=>e.target.style.borderColor="rgba(59,130,246,.4)"}
            onBlur={e=>e.target.style.borderColor="var(--b2)"}
          />
          <button onClick={send} disabled={!input.trim()||busy} className="tap btn-glow" style={{
            width:36,height:36,borderRadius:9,flexShrink:0,
            background:input.trim()&&!busy?"linear-gradient(135deg,#3B82F6,#8B5CF6)":"rgba(255,255,255,.06)",
            color:"#fff",fontSize:15,cursor:input.trim()&&!busy?"pointer":"default",
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:input.trim()?"0 0 12px rgba(59,130,246,.32)":"none",
            transition:"background .2s, box-shadow .2s",
          }}>→</button>
        </div>
      </div>

      {/* Orb */}
      <button onClick={()=>{H.medium();onToggle();}} className="tap" style={{
        position:"absolute", bottom:ORB_BOTTOM, right:14,
        width:46, height:46, borderRadius:"50%",
        background:"radial-gradient(circle at 36% 34%,#3B82F6,#8B5CF6)",
        zIndex:120,
        animation:"orb-float 3.2s ease-in-out infinite, orb-glow 2.2s ease-in-out infinite",
        willChange:"transform", display:"flex",alignItems:"center",justifyContent:"center",
        outline: open?"2.5px solid rgba(59,130,246,.55)":"none", outlineOffset:2, transition:"outline .2s",
      }}>
        <div style={{width:"40%",height:"40%",borderRadius:"50%",background:"rgba(255,255,255,.86)",filter:"blur(2px)",pointerEvents:"none"}}/>
        {open && <div style={{position:"absolute",inset:0,borderRadius:"50%",border:"2px solid rgba(59,130,246,.55)",animation:"ripple-out .75s ease-out",pointerEvents:"none"}}/>}
        <div style={{position:"absolute",bottom:1,right:1,width:11,height:11,borderRadius:"50%",background:open?"var(--blue)":"var(--green)",border:"2px solid var(--bg)",transition:"background .25s",pointerEvents:"none"}}/>
      </button>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CHALLENGE SCREEN — game-show visual design with sounds + progressive difficulty
// ══════════════════════════════════════════════════════════════════════════════

// Confetti piece
function ConfettiPiece({ color, x, delay, r }) {
  return <div style={{position:"absolute",top:-10,left:`${x}%`,width:6,height:6,borderRadius:2,background:color,opacity:.9,"--r":`${r}deg`,animation:`confetti-fall .8s ease ${delay}s forwards`,pointerEvents:"none"}}/>;
}

function ChallengeScreen({ onComplete, onXP, onNudge, sessionCount }) {
  const questions = useMemo(() => pickQuestions(sessionCount, 5), [sessionCount]);
  const [qi,         setQi]        = useState(0);
  const [sel,        setSel]        = useState(null);
  const [timer,      setTimer]      = useState(12);
  const [score,      setScore]      = useState(0);
  const [streak,     setStreak]     = useState(0);
  const [done,       setDone]       = useState(false);
  const [burst,      setBurst]      = useState(false);
  const [showXP,     setShowXP]     = useState(false);
  const [flash,      setFlash]      = useState(null);
  const [confetti,   setConfetti]   = useState([]);
  const [rippleOpt,  setRippleOpt]  = useState(null);
  const q = questions[qi];
  if (!q) return null;

  const xpEarned = sel===q.ans ? (10 + streak*5) : 0;
  const isUrgent = timer <= 4;
  const DIFF_LABELS = ["","Beginner","Easy","Medium","Hard","Advanced"];
  const DIFF_COLORS = ["","#0FD98A","#4F8EF7","#F5A623","#F05252","#9D6EF8"];
  const tierColor = DIFF_COLORS[q.tier] || "#4F8EF7";

  useEffect(() => {
    if (sel!==null || done) return;
    if (timer===0) { pick(-1); return; }
    if (timer<=4) SFX.tickUrgent(); else if (timer%3===0) SFX.tick();
    const t=setTimeout(()=>setTimer(s=>s-1),1000);
    return()=>clearTimeout(t);
  }, [timer, sel, done]);

  const pick = useCallback(i => {
    if (sel!==null) return;
    setRippleOpt(i);
    const correct = i===q.ans;
    setTimeout(()=>setRippleOpt(null), 600);
    if (correct) { SFX.correct(); H.success(); } else { SFX.wrong(); H.error(); }
    setSel(i);
    setFlash(correct?"correct":"wrong");
    setTimeout(()=>setFlash(null), 800);
    if (correct) {
      const ns=streak+1; setStreak(ns); setScore(s=>s+1);
      setBurst(true); setTimeout(()=>setBurst(false),950);
      setShowXP(true); setTimeout(()=>setShowXP(false),1300);
      // Confetti!
      const cols=["#0FD98A","#4F8EF7","#F5A623","#9D6EF8","#F05252"];
      setConfetti(Array.from({length:14},(_,k)=>({id:k,color:cols[k%5],x:5+k*6.5,delay:k*0.04,r:90+k*25})));
      setTimeout(()=>setConfetti([]),1200);
      onXP(10+ns*5); onNudge(cue("correct"));
    } else {
      setStreak(0); onNudge(cue("wrong"));
    }
  }, [sel, q, streak, onXP, onNudge]);

  const next = () => {
    H.light(); SFX.step();
    if (qi<questions.length-1) { setQi(q=>q+1); setSel(null); setTimer(12); setConfetti([]); }
    else { setDone(true); SFX.complete(); onXP(score*15+30); }
  };

  // ── RESULTS SCREEN ──
  if (done) return (
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:28,animation:"screen-in .4s ease",position:"relative",overflow:"hidden"}}>
      {/* Background glow */}
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 70% 60% at 50% 40%,rgba(15,217,138,.08),transparent)",pointerEvents:"none"}}/>
      <Burst active={true} color="#F5A623"/>

      <div style={{fontSize:62,marginBottom:10,animation:"result-drop .5s cubic-bezier(.34,1.56,.64,1)"}}>
        {score===questions.length?"🏆":score>=4?"🎯":score>=3?"🎓":"📚"}
      </div>

      {/* Score ring */}
      <div style={{
        position:"relative",width:110,height:110,marginBottom:18,
        animation:"result-drop .5s cubic-bezier(.34,1.56,.64,1) .1s both",
      }}>
        <svg viewBox="0 0 100 100" style={{position:"absolute",inset:0,transform:"rotate(-90deg)"}}>
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="6"/>
          <circle cx="50" cy="50" r="44" fill="none"
            stroke={score>=4?"#0FD98A":score>=3?"#4F8EF7":"#9D6EF8"}
            strokeWidth="6" strokeLinecap="round"
            strokeDasharray={`${(score/questions.length)*276.5} 276.5`}
            style={{transition:"stroke-dasharray .8s cubic-bezier(.34,1.56,.64,1)",filter:`drop-shadow(0 0 6px ${score>=4?"#0FD98A":"#4F8EF7"}80)`}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <div style={{fontFamily:"var(--ffd)",fontSize:28,fontWeight:800,lineHeight:1}}>{score}/{questions.length}</div>
          <div style={{fontSize:9,fontFamily:"var(--ffm)",color:"var(--t3)",letterSpacing:".1em",marginTop:2}}>CORRECT</div>
        </div>
      </div>

      <div style={{fontFamily:"var(--ffd)",fontSize:20,fontWeight:800,letterSpacing:"-.02em",marginBottom:5,textAlign:"center",
        color:score===questions.length?"#F5A623":score>=3?"#0FD98A":"#4F8EF7",
        animation:"result-drop .5s ease .2s both"}}>
        {score===questions.length?"Perfect round!":score>=4?"Really sharp.":score>=3?"Good read.":"Keep building."}
      </div>

      {/* Score dots */}
      <div style={{display:"flex",gap:7,marginBottom:20,animation:"result-drop .5s ease .25s both"}}>
        {questions.map((_,i)=>(
          <div key={i} style={{
            width:11,height:11,borderRadius:"50%",
            background:i<score?"#0FD98A":"rgba(255,255,255,.1)",
            boxShadow:i<score?"0 0 8px rgba(15,217,138,.6)":"none",
            transition:"all .3s",
          }}/>
        ))}
      </div>

      <div style={{background:"rgba(15,217,138,.08)",border:"1px solid rgba(15,217,138,.2)",borderRadius:12,padding:"10px 22px",fontFamily:"var(--ffm)",fontSize:13,color:"#0FD98A",fontWeight:700,marginBottom:28,animation:"result-drop .5s ease .3s both"}}>
        ⭐ +{score*15+30} XP earned
      </div>

      <button onClick={onComplete} className="tap btn-glow" style={{
        padding:"16px 40px",borderRadius:14,
        background:"linear-gradient(135deg,#4F8EF7,#9D6EF8)",
        color:"#fff",fontFamily:"var(--ffd)",fontSize:15,fontWeight:800,cursor:"pointer",
        boxShadow:"0 0 28px rgba(79,142,247,.38)",letterSpacing:".025em",border:"none",
        animation:"result-drop .5s ease .35s both",
      }}>
        Start Training →
      </button>
    </div>
  );

  // ── QUESTION SCREEN ──
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>

      {/* Confetti */}
      {confetti.map(c=><ConfettiPiece key={c.id} {...c}/>)}

      {/* Flash overlay */}
      {flash==="correct" && <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 80% 50% at 50% 30%,rgba(15,217,138,.12),transparent)",zIndex:50,pointerEvents:"none",animation:"flash-green .8s ease forwards"}}/>}
      {flash==="wrong"   && <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 80% 50% at 50% 30%,rgba(240,82,82,.1),transparent)",zIndex:50,pointerEvents:"none",animation:"flash-red .8s ease forwards"}}/>}

      {/* XP burst */}
      {showXP && (
        <div style={{position:"absolute",top:"16%",left:"50%",zIndex:60,pointerEvents:"none",transform:"translateX(-50%)",
          fontFamily:"var(--ffm)",fontSize:24,fontWeight:700,color:"#0FD98A",
          textShadow:"0 0 24px rgba(15,217,138,.9)",
          animation:"xp-burst 1.2s cubic-bezier(.34,1.56,.64,1) forwards",
          whiteSpace:"nowrap",
        }}>
          +{xpEarned} XP{streak>1?` 🔥${streak}x`:""}
        </div>
      )}

      {/* ── Header bar ── */}
      <div style={{padding:"12px 18px 6px",flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
        {/* Progress dots */}
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          {questions.map((_,i)=>(
            <div key={i} style={{
              width: i===qi?22:i<qi?10:8,
              height:8, borderRadius:4,
              background: i===qi?"linear-gradient(90deg,#4F8EF7,#9D6EF8)" : i<qi?"#0FD98A" : "rgba(255,255,255,.1)",
              transition:"all .35s cubic-bezier(.34,1.56,.64,1)",
              boxShadow: i===qi?"0 0 8px rgba(79,142,247,.7)": i<qi?"0 0 5px rgba(15,217,138,.4)":"none",
              animation: i===qi?"score-bump .3s ease":"none",
            }}/>
          ))}
          <span style={{fontFamily:"var(--ffm)",fontSize:9,color:"var(--t3)",marginLeft:4}}>{qi+1}/{questions.length}</span>
        </div>

        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {/* Streak badge */}
          {streak>=2 && (
            <div style={{
              display:"flex",alignItems:"center",gap:3,
              background:"rgba(245,166,35,.14)",border:"1px solid rgba(245,166,35,.3)",
              borderRadius:20,padding:"3px 10px",
              animation:"streak-fire .5s ease-in-out infinite alternate",
            }}>
              <span style={{fontSize:13}}>🔥</span>
              <span style={{fontFamily:"var(--ffd)",fontSize:12,color:"#F5A623",fontWeight:800}}>{streak}x</span>
            </div>
          )}
          {/* Timer ring */}
          <div style={{
            position:"relative",width:44,height:44,flexShrink:0,
            animation: isUrgent?"ring-urgent .5s ease-in-out infinite":"none",
          }}>
            <svg viewBox="0 0 40 40" style={{position:"absolute",inset:0,transform:"rotate(-90deg)"}}>
              <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="3"/>
              <circle cx="20" cy="20" r="16" fill="none"
                stroke={isUrgent?"#F05252":timer<=7?"#F5A623":"#4F8EF7"}
                strokeWidth="3" strokeLinecap="round"
                strokeDasharray={`${(timer/12)*100.5} 100.5`}
                style={{transition:"stroke-dasharray .9s linear, stroke .3s",
                  filter:isUrgent?"drop-shadow(0 0 4px #F05252)":"none"}}/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
              fontFamily:"var(--ffm)",fontSize:13,fontWeight:700,
              color:isUrgent?"#F05252":timer<=7?"#F5A623":"#4F8EF7",
            }}>{timer}</div>
          </div>
        </div>
      </div>

      {/* ── Question content ── */}
      <div key={qi} style={{flex:1,overflow:"auto",padding:"12px 18px 4px"}}>

        {/* Category + difficulty badges */}
        <div style={{display:"flex",gap:6,marginBottom:12,animation:"q-dramatic .3s ease"}}>
          <span style={{fontFamily:"var(--ffm)",fontSize:8.5,color:"var(--t2)",background:"rgba(255,255,255,.06)",borderRadius:20,padding:"3px 10px",letterSpacing:".06em"}}>
            {q.cat}
          </span>
          <span style={{
            fontFamily:"var(--ffm)",fontSize:8.5,color:tierColor,
            background:`${tierColor}1a`,borderRadius:20,padding:"3px 10px",letterSpacing:".06em",
            border:`1px solid ${tierColor}35`,
          }}>
            {DIFF_LABELS[q.tier]}
          </span>
        </div>

        {/* Question — dramatic, large, gradient text */}
        <div style={{
          fontFamily:"var(--ffd)",fontSize:20,fontWeight:800,lineHeight:1.28,
          letterSpacing:"-.025em",marginBottom:18,
          background:"linear-gradient(135deg,#F2F0EE 55%,rgba(157,110,248,.75))",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
          animation:"q-dramatic .32s cubic-bezier(.34,1.56,.64,1) .06s both",
        }}>
          {q.q}
        </div>

        {/* Options */}
        <div style={{display:"flex",flexDirection:"column",gap:9,position:"relative"}}>
          <Burst active={burst} color="#0FD98A"/>
          {q.opts.map((o,i)=>{
            const correct=sel!==null&&i===q.ans, wrong=sel===i&&i!==q.ans, neutral=sel!==null&&i!==q.ans&&i!==sel;
            const isRipple=rippleOpt===i;
            return (
              <button key={i} onClick={()=>pick(i)} className="tap" style={{
                padding:"14px 16px",borderRadius:14,
                background: correct?"rgba(15,217,138,.13)": wrong?"rgba(240,82,82,.12)": neutral?"rgba(255,255,255,.018)":"rgba(255,255,255,.05)",
                border: correct?"1px solid rgba(15,217,138,.5)": wrong?"1px solid rgba(240,82,82,.45)": neutral?"1px solid rgba(255,255,255,.04)":"1px solid rgba(255,255,255,.09)",
                color: correct?"#0FD98A": wrong?"#F05252": neutral?"var(--t3)":"var(--t1)",
                fontFamily:"var(--ffb)",fontSize:13.5,fontWeight:500,textAlign:"left",cursor:sel!==null?"default":"pointer",
                display:"flex",alignItems:"center",gap:11,
                transition:"background .25s,border-color .25s,color .25s",
                animation: wrong?"shake-card .4s ease":sel!==null?"none":`option-in .28s cubic-bezier(.34,1.56,.64,1) ${i*65}ms both`,
                position:"relative",overflow:"hidden",
                boxShadow: correct?"0 0 18px rgba(15,217,138,.18)": wrong?"0 0 12px rgba(240,82,82,.14)":"none",
              }}>
                {/* Ripple ring on tap */}
                {isRipple && <div style={{position:"absolute",top:"50%",left:"50%",width:20,height:20,borderRadius:"50%",border:"2px solid rgba(79,142,247,.6)",transform:"translate(-50%,-50%)",animation:"ripple-out .6s ease",pointerEvents:"none"}}/>}
                {/* Shine swipe on unanswered */}
                {sel===null && <div style={{position:"absolute",top:0,left:0,width:"20%",height:"100%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,.04),transparent)",pointerEvents:"none"}}/>}
                {/* Green sweep on correct */}
                {correct && <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,rgba(15,217,138,.1),transparent)",animation:"sweep-green .4s ease",transformOrigin:"left",pointerEvents:"none"}}/>}

                {/* Letter badge */}
                <div style={{
                  width:28,height:28,borderRadius:9,flexShrink:0,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontFamily:"var(--ffm)",fontSize:11,fontWeight:700,
                  background: correct?"rgba(15,217,138,.22)": wrong?"rgba(240,82,82,.2)":"rgba(255,255,255,.08)",
                  color: correct?"#0FD98A": wrong?"#F05252":"var(--t3)",
                  transition:"all .2s",
                  boxShadow: correct?"0 0 8px rgba(15,217,138,.3)":"none",
                }}>
                  {correct?"✓":wrong?"✗":String.fromCharCode(65+i)}
                </div>
                {o}
              </button>
            );
          })}
        </div>

        {/* Explanation — dramatic pop-in */}
        {sel!==null && q.explain && (
          <div style={{
            marginTop:14,padding:"14px 16px",
            background:"rgba(79,142,247,.07)",
            border:"1px solid rgba(79,142,247,.2)",borderRadius:14,
            animation:"slide-up-in .4s cubic-bezier(.34,1.56,.64,1)",
            position:"relative",overflow:"hidden",
          }}>
            <div style={{position:"absolute",top:0,left:0,width:3,height:"100%",background:"linear-gradient(180deg,#4F8EF7,#9D6EF8)15",borderRadius:"14px 0 0 14px"}}/>
            <div style={{fontFamily:"var(--ffm)",fontSize:8,color:"var(--blue)",letterSpacing:".15em",marginBottom:6}}>💡 EXPLAINED</div>
            <p style={{fontSize:13,lineHeight:1.65,color:"#D0D0D0"}}>{q.explain}</p>
          </div>
        )}
      </div>

      {/* ── Continue button ── */}
      {sel!==null && (
        <div style={{padding:"8px 18px 14px",flexShrink:0,animation:"slide-up-in .3s cubic-bezier(.34,1.56,.64,1)"}}>
          <button onClick={next} className="tap btn-glow" style={{
            width:"100%",padding:"16px",borderRadius:14,border:"none",
            background: sel===q.ans
              ? "linear-gradient(135deg,#0FD98A,#4F8EF7)"
              : "linear-gradient(135deg,#4F8EF7,#9D6EF8)",
            color:"#fff",fontFamily:"var(--ffd)",fontSize:15,fontWeight:800,
            cursor:"pointer",letterSpacing:".025em",
            boxShadow: sel===q.ans
              ? "0 0 28px rgba(15,217,138,.4), 0 4px 20px rgba(0,0,0,.3)"
              : "0 0 20px rgba(79,142,247,.3), 0 4px 20px rgba(0,0,0,.3)",
          }}>
            {qi===questions.length-1?"See Results →":sel===q.ans?"Nice! Next →":"Next →"}
          </button>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LESSON SCREEN — cinematic visual redesign with sounds
// ══════════════════════════════════════════════════════════════════════════════

// Floating ambient particle
function FloatParticle({ color, delay, x }) {
  return (
    <div style={{
      position:"absolute", bottom:-8, left:`${x}%`,
      width:3, height:3, borderRadius:"50%", background:color, opacity:.5,
      animation:`float-p 2.8s ease-out ${delay}s forwards`,
      "--px":`${(Math.random()-.5)*40}px`,
      pointerEvents:"none",
    }}/>
  );
}

// Step node progress indicator
function StepNodes({ total, current }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:0,flexShrink:0}}>
      {Array.from({length:total}).map((_,i)=>{
        const done=i<current, active=i===current;
        return (
          <div key={i} style={{display:"flex",alignItems:"center"}}>
            <div style={{position:"relative",width:active?20:done?8:6,height:active?20:done?8:6,
              borderRadius:"50%",
              background:active?"linear-gradient(135deg,#4F8EF7,#9D6EF8)":done?"var(--green)":"rgba(255,255,255,.12)",
              transition:"all .4s cubic-bezier(.34,1.56,.64,1)",
              boxShadow:active?"0 0 12px rgba(79,142,247,.7)":done?"0 0 6px rgba(15,217,138,.4)":"none",
              display:"flex",alignItems:"center",justifyContent:"center",
            }}>
              {done && <div style={{fontSize:8,color:"#fff",fontWeight:700}}>✓</div>}
              {active && <div style={{position:"absolute",inset:0,borderRadius:"50%",border:"2px solid rgba(79,142,247,.5)",animation:"node-ping 1.4s ease-out infinite"}}/>}
            </div>
            {i<total-1&&<div style={{width:active||done?16:10,height:1.5,background:done?"var(--green)":"rgba(255,255,255,.08)",margin:"0 2px",transition:"all .4s ease"}}/>}
          </div>
        );
      })}
    </div>
  );
}

function LessonScreen({ onComplete, onXP, onNudge, onScenario }) {
  const [step,    setStep]    = useState(0);
  const [sel,     setSel]     = useState(null);
  const [shown,   setShown]   = useState(false);
  const [burst,   setBurst]   = useState(false);
  const [alloc,   setAlloc]   = useState({gold:25,tech:25,bonds:25,oil:25});
  const [selA,    setSelA]    = useState(null);
  const [xpFlash, setXpFlash] = useState(false);
  const [particles, setParticles] = useState([]);
  const s = LESSON[step];

  useEffect(() => {
    SFX.step();
    onNudge(cue(s.cueKey||"start"));
    if (s.headline) onScenario(s.headline);
    setSel(null); setShown(false); setBurst(false); setSelA(null);
    // Spawn ambient particles
    setParticles(Array.from({length:5},(_,i)=>({id:Date.now()+i, x:10+i*18, delay:i*0.3, color:["#4F8EF7","#9D6EF8","#0FD98A","#F5A623","#4F8EF7"][i]})));
  }, [step]);

  const pick = useCallback(id => {
    if (sel) return;
    const correct = id === s.ans;
    if (correct) { SFX.correct(); H.success(); } else { SFX.wrong(); H.error(); }
    setSel(id); setShown(true);
    if (correct) {
      setBurst(true); setTimeout(()=>setBurst(false),900);
      setXpFlash(true); setTimeout(()=>setXpFlash(false),1200);
      onXP(30); onNudge(cue("correct"));
    } else onNudge(cue("wrong"));
  }, [sel, s, onXP, onNudge]);

  const next = () => {
    H.light(); SFX.step();
    if (step < LESSON.length-1) setStep(t=>t+1);
    else { SFX.complete(); onXP(120); onComplete(); }
  };

  const totalAlloc = Object.values(alloc).reduce((a,b)=>a+b,0);

  // Per-step accent colors for atmosphere
  const STEP_ACCENT = ["#4F8EF7","#9D6EF8","#F5A623","#F05252","#4F8EF7","#0FD98A"];
  const accent = STEP_ACCENT[step] || "#4F8EF7";

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",position:"relative"}}>

      {/* Ambient background gradient shifts per step */}
      <div key={`bg-${step}`} style={{
        position:"absolute",inset:0,pointerEvents:"none",zIndex:0,
        background:`radial-gradient(ellipse 80% 45% at 50% 0%, ${accent}12 0%, transparent 70%)`,
        transition:"background 0.8s ease",
      }}/>

      {/* Ambient floating particles */}
      {particles.map(p=><FloatParticle key={p.id} color={accent} delay={p.delay} x={p.x}/>)}

      {/* ── Header: step nodes + XP ── */}
      <div style={{padding:"10px 18px 8px",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative",zIndex:2}}>
        <StepNodes total={LESSON.length} current={step}/>
        <div style={{display:"flex",alignItems:"center",gap:6,position:"relative"}}>
          {xpFlash && (
            <div style={{position:"absolute",right:0,top:-20,fontFamily:"var(--ffm)",fontSize:12,color:"var(--green)",fontWeight:700,animation:"xp-rise .9s ease forwards",whiteSpace:"nowrap"}}>+30 XP ✨</div>
          )}
          <div style={{fontFamily:"var(--ffm)",fontSize:9,color:"var(--t3)",letterSpacing:".08em"}}>{step+1}/{LESSON.length}</div>
        </div>
      </div>

      {/* ── Scene content ── */}
      <div key={step} style={{flex:1,overflow:"auto",padding:"0 18px 8px",position:"relative",zIndex:2}}>

        {/* ── Scene header card — cinematic ── */}
        <div style={{
          marginBottom:16,
          padding:"16px 18px",
          borderRadius:16,
          background:`linear-gradient(135deg, ${accent}10 0%, rgba(255,255,255,.02) 100%)`,
          border:`1px solid ${accent}28`,
          position:"relative",
          overflow:"hidden",
          animation:"scene-drop .35s cubic-bezier(.34,1.56,.64,1)",
        }}>
          {/* Animated border glow */}
          <div style={{position:"absolute",inset:0,borderRadius:16,border:`1px solid ${accent}`,opacity:.18,animation:"border-glow 2.4s ease-in-out infinite",pointerEvents:"none"}}/>
          {/* Decorative accent bar */}
          <div style={{position:"absolute",top:0,left:0,width:3,height:"100%",background:`linear-gradient(180deg,${accent},transparent)`,borderRadius:"16px 0 0 16px"}}/>

          <div style={{fontFamily:"var(--ffm)",fontSize:8,color:accent,letterSpacing:".15em",marginBottom:6,opacity:.8}}>
            {["SCENARIO","DISCOVERY","PRACTICE","INSIGHT","ANALYSIS","KEY RULES"][step] || "LESSON"}
          </div>
          <h2 style={{
            fontFamily:"var(--ffd)",fontSize:21,fontWeight:800,letterSpacing:"-.025em",
            lineHeight:1.2,color:"var(--t1)",
            textShadow:`0 0 30px ${accent}30`,
          }}>{s.headline}</h2>
          {(s.body||s.insight)&&(
            <p style={{color:"var(--t2)",fontSize:13,lineHeight:1.6,marginTop:8}}>{s.body||s.insight}</p>
          )}
        </div>

        {/* ══ CHOICE type ══ */}
        {s.type==="choice" && (
          <div style={{position:"relative"}}>
            <div style={{fontFamily:"var(--ffd)",fontSize:14,fontWeight:700,color:"var(--t1)",marginBottom:12,lineHeight:1.35,letterSpacing:"-.01em"}}>
              {s.q}
            </div>
            <Burst active={burst} color={accent}/>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {s.opts.map((o,idx) => {
                const isAns = o.id===s.ans, isSel = o.id===sel;
                let bg="rgba(255,255,255,.03)", border=`1px solid rgba(255,255,255,.07)`, col="var(--t1)";
                let animName=`option-in .25s ease ${idx*60}ms both`;
                if (shown) {
                  if (isAns)      { bg="rgba(15,217,138,.11)"; border="1px solid rgba(15,217,138,.45)"; col="#0FD98A"; animName="card-correct .5s ease"; }
                  else if (isSel) { bg="rgba(240,82,82,.1)";   border="1px solid rgba(240,82,82,.4)";   col="#F05252"; animName="shake-card .4s ease,card-wrong .5s ease"; }
                  else            { bg="rgba(255,255,255,.01)"; border="1px solid rgba(255,255,255,.03)"; col="var(--t3)"; }
                }
                return (
                  <button key={o.id} onClick={()=>pick(o.id)} className="tap" style={{
                    padding:"14px 16px", borderRadius:13, background:bg, border, color:col,
                    fontFamily:"var(--ffb)", fontSize:13.5, fontWeight:500, textAlign:"left",
                    cursor:sel?"default":"pointer",
                    display:"flex", alignItems:"center", gap:11,
                    transition:"background .22s, border-color .22s, color .22s",
                    animation:animName,
                    position:"relative", overflow:"hidden",
                  }}>
                    {/* Shimmer sweep on hover */}
                    {!shown && <div style={{position:"absolute",top:0,left:0,width:"25%",height:"100%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,.035),transparent)",pointerEvents:"none"}}/>}
                    {/* Green sweep on correct */}
                    {shown && isAns && <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,rgba(15,217,138,.08),transparent)",animation:"sweep-green .35s ease",pointerEvents:"none",transformOrigin:"left"}}/>}
                    {/* Letter badge */}
                    <div style={{
                      width:26,height:26,borderRadius:8,flexShrink:0,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontFamily:"var(--ffm)",fontSize:10,fontWeight:700,
                      background:shown&&isAns?"rgba(15,217,138,.2)":shown&&isSel?"rgba(240,82,82,.2)":"rgba(255,255,255,.07)",
                      color:shown&&isAns?"#0FD98A":shown&&isSel?"#F05252":"var(--t3)",
                      transition:"all .2s",
                    }}>
                      {shown&&isAns?"✓":shown&&isSel?"✗":String.fromCharCode(65+idx)}
                    </div>
                    {o.l}
                  </button>
                );
              })}
            </div>

            {/* Explanation reveal */}
            {shown && s.explain && (
              <div style={{
                marginTop:14, padding:"14px 16px",
                background:"rgba(79,142,247,.07)",
                border:"1px solid rgba(79,142,247,.2)",
                borderRadius:13,
                animation:"slide-up-in .4s cubic-bezier(.34,1.56,.64,1)",
                position:"relative",overflow:"hidden",
              }}>
                <div style={{position:"absolute",top:0,left:0,width:3,height:"100%",background:"linear-gradient(180deg,#4F8EF7,#9D6EF8)",borderRadius:"13px 0 0 13px"}}/>
                <div style={{fontFamily:"var(--ffm)",fontSize:8,color:"var(--blue)",letterSpacing:".14em",marginBottom:6}}>💡 WHY THIS IS CORRECT</div>
                <p style={{fontSize:13,lineHeight:1.65,color:"#D8D8D8",fontWeight:400}}>{s.explain}</p>
              </div>
            )}
          </div>
        )}

        {/* ══ REVEAL type ══ */}
        {s.type==="reveal" && (() => {
          // Auto-play reveal sound once
          useEffect(()=>{ SFX.reveal(); },[]);
          return (
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {/* Insight panel */}
              <div style={{
                padding:"18px",
                borderRadius:16,
                background:"linear-gradient(135deg,rgba(79,142,247,.08),rgba(157,110,248,.06))",
                border:"1px solid rgba(79,142,247,.22)",
                position:"relative",overflow:"hidden",
                animation:"insight-rise .5s cubic-bezier(.34,1.56,.64,1)",
              }}>
                {/* Decorative glow blob */}
                <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:"radial-gradient(circle,rgba(157,110,248,.18),transparent)",pointerEvents:"none"}}/>
                <div style={{fontFamily:"var(--ffm)",fontSize:8,color:"#9D6EF8",letterSpacing:".16em",marginBottom:10}}>✦ MARKET INSIGHT</div>
                <p style={{fontSize:14,lineHeight:1.7,color:"var(--t1)",fontWeight:500}}>{s.insight}</p>
              </div>
              {/* Visual "did you know" accent */}
              <div style={{display:"flex",gap:10,padding:"10px 14px",background:"rgba(245,166,35,.06)",border:"1px solid rgba(245,166,35,.18)",borderRadius:12,animation:"insight-rise .5s ease .15s both"}}>
                <span style={{fontSize:18,flexShrink:0}}>💡</span>
                <p style={{fontSize:12,color:"rgba(245,166,35,.9)",lineHeight:1.55}}>This pattern repeats in markets constantly — learn to spot it and you'll read headlines differently forever.</p>
              </div>
            </div>
          );
        })()}

        {/* ══ ALLOCATE type ══ */}
        {s.type==="allocate" && (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {/* Allocation total meter */}
            <div style={{
              padding:"10px 14px",
              borderRadius:12,
              background:"rgba(255,255,255,.03)",
              border:"1px solid var(--b1)",
              display:"flex",alignItems:"center",gap:12,
              marginBottom:4,
            }}>
              <div style={{flex:1}}>
                <div style={{height:4,background:"rgba(255,255,255,.07)",borderRadius:2,overflow:"hidden",position:"relative"}}>
                  <div style={{
                    position:"absolute",top:0,left:0,height:"100%",
                    width:`${Math.min(100,totalAlloc)}%`,
                    background:totalAlloc>100?"var(--red)":totalAlloc===100?"var(--green)":"var(--blue)",
                    borderRadius:2,transition:"width .3s cubic-bezier(.34,1.56,.64,1)",
                    boxShadow:totalAlloc===100?"0 0 8px rgba(15,217,138,.6)":"none",
                  }}/>
                </div>
              </div>
              <span style={{fontFamily:"var(--ffm)",fontSize:13,fontWeight:700,color:totalAlloc===100?"var(--green)":totalAlloc>100?"var(--red)":"var(--t2)",flexShrink:0,minWidth:36,textAlign:"right"}}>
                {totalAlloc}%
              </span>
              {totalAlloc===100 && <span style={{fontSize:14}}>✅</span>}
            </div>

            {s.assets.map((a,idx) => {
              const active=selA===a.id, pct=alloc[a.id];
              return (
                <div key={a.id} style={{animation:`option-in .28s ease ${idx*60}ms both`}}>
                  <button onClick={()=>{setSelA(active?null:a.id); SFX.tap(); H.light();}} className="tap" style={{
                    width:"100%", padding:"12px 14px", borderRadius:13, cursor:"pointer", textAlign:"left",
                    background:active?"rgba(79,142,247,.1)":pct>0?"rgba(255,255,255,.05)":"rgba(255,255,255,.02)",
                    border:active?"1px solid rgba(79,142,247,.4)":pct>0?"1px solid rgba(255,255,255,.1)":"1px solid rgba(255,255,255,.05)",
                    transition:"all .2s cubic-bezier(.34,1.56,.64,1)",
                    display:"flex", justifyContent:"space-between", alignItems:"center",
                    boxShadow:active?"0 0 18px rgba(79,142,247,.12)":"none",
                  }}>
                    <div style={{display:"flex",gap:10,alignItems:"center"}}>
                      <div style={{width:38,height:38,borderRadius:11,background:`rgba(255,255,255,.07)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,transition:"transform .2s",transform:active?"scale(1.12)":"scale(1)"}}>
                        {a.icon}
                      </div>
                      <div>
                        <div style={{fontSize:13.5,fontWeight:700,color:"var(--t1)"}}>{a.n}</div>
                        <div style={{fontSize:11,color:"var(--t3)",marginTop:2}}>{a.hint}</div>
                      </div>
                    </div>
                    <div style={{
                      fontFamily:"var(--ffm)",fontSize:13,fontWeight:700,
                      color:pct>0?"var(--blue)":"var(--t3)",
                      background:pct>0?"rgba(79,142,247,.14)":"rgba(255,255,255,.04)",
                      padding:"4px 11px",borderRadius:8,transition:"all .2s",
                      boxShadow:pct>0?"0 0 8px rgba(79,142,247,.2)":"none",
                    }}>{pct}%</div>
                  </button>

                  {/* Allocation buttons */}
                  {active && (
                    <div style={{display:"flex",gap:6,padding:"8px 2px 2px",animation:"pop-in .18s cubic-bezier(.34,1.56,.64,1)"}}>
                      {[0,25,50,75,100].map(p=>(
                        <button key={p} onClick={()=>{
                          setAlloc(v=>({...v,[a.id]:p}));
                          SFX.allocate(); H.light();
                        }} className="tap" style={{
                          flex:1, padding:"9px 0", borderRadius:10, cursor:"pointer",
                          background:pct===p?"rgba(79,142,247,.22)":"rgba(255,255,255,.05)",
                          color:pct===p?"#4F8EF7":"var(--t2)",
                          fontFamily:"var(--ffm)", fontSize:11, fontWeight:pct===p?700:400,
                          boxShadow:pct===p?"0 0 12px rgba(79,142,247,.3)":"none",
                          border:pct===p?"1px solid rgba(79,142,247,.35)":"1px solid transparent",
                          transition:"all .15s",
                        }}>{p===0?"✕":p+"%"}</button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ══ INSIGHT type ══ */}
        {s.type==="insight" && (
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {s.rules.map((r,i)=>{
              const ruleColors=["#4F8EF7","#9D6EF8","#0FD98A"];
              const rc=ruleColors[i]||"#4F8EF7";
              return (
                <div key={i} style={{
                  display:"flex",gap:0,alignItems:"stretch",
                  borderRadius:14,overflow:"hidden",
                  border:`1px solid ${rc}22`,
                  animation:`insight-rise .4s cubic-bezier(.34,1.56,.64,1) ${i*100}ms both`,
                  boxShadow:`0 4px 24px ${rc}0A`,
                }}>
                  {/* Colored left rail */}
                  <div style={{width:4,background:`linear-gradient(180deg,${rc},${rc}66)`,flexShrink:0}}/>
                  <div style={{flex:1,padding:"14px 15px",background:`rgba(255,255,255,.03)`}}>
                    <div style={{display:"flex",gap:11,alignItems:"flex-start"}}>
                      <div style={{
                        width:38,height:38,borderRadius:11,
                        background:`linear-gradient(135deg,${rc}22,${rc}0a)`,
                        border:`1px solid ${rc}30`,
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:18,flexShrink:0,
                      }}>{r.icon}</div>
                      <div>
                        <div style={{fontSize:13.5,fontWeight:700,fontFamily:"var(--ffd)",letterSpacing:"-.01em",color:"var(--t1)",marginBottom:4}}>{r.rule}</div>
                        <div style={{fontSize:12,color:"var(--t2)",lineHeight:1.55}}>{r.sub}</div>
                      </div>
                    </div>
                    {/* Animated accent line */}
                    <div style={{marginTop:10,height:1.5,background:`linear-gradient(90deg,${rc}50,transparent)`,borderRadius:1,animation:`bar-fill .6s ease ${i*100+200}ms both`,"--w":"60%"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── CTA Button ── */}
      <div style={{padding:"8px 18px 16px",flexShrink:0,position:"relative",zIndex:2}}>
        {(shown || s.type==="reveal" || s.type==="allocate" || s.type==="insight") && (
          <button onClick={next} className="tap btn-glow" style={{
            width:"100%", padding:"16px", borderRadius:14,
            background: step===LESSON.length-1
              ? "linear-gradient(135deg,#0FD98A,#4F8EF7)"
              : `linear-gradient(135deg,${accent},#9D6EF8)`,
            color:"#fff", fontFamily:"var(--ffd)", fontSize:15, fontWeight:800,
            cursor:"pointer", letterSpacing:".025em",
            boxShadow: `0 0 24px ${accent}40, 0 4px 20px rgba(0,0,0,.4)`,
            border:"none",
            animation:"slide-up-in .3s cubic-bezier(.34,1.56,.64,1)",
            position:"relative",overflow:"hidden",
          }}>
            {step===LESSON.length-1 ? "✓ Complete Lesson" : step===LESSON.length-2 ? "See the Rules →" : "Got it. Next →"}
          </button>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TRADING SCREEN — with "Next Round" button on results
// ══════════════════════════════════════════════════════════════════════════════
function TradeScreen({ onXP, onNudge, onScenario }) {
  const [round,  setRound]  = useState(0); // increment → new session
  const session  = useMemo(() => generateSession(), [round]);
  const [alloc,  setAlloc]  = useState({});
  const [selA,   setSelA]   = useState(null);
  const [timer,  setTimer]  = useState(15);
  const [phase,  setPhase]  = useState("decide");
  const [paths,  setPaths]  = useState({});
  const [result, setResult] = useState(null);
  const [animAt, setAnimAt] = useState(-1);

  // Reset when session changes
  useEffect(() => {
    const o={}; session.assets.forEach(a=>{o[a.id]=0;}); setAlloc(o);
    setSelA(null); setTimer(15); setPhase("decide"); setPaths({}); setResult(null); setAnimAt(-1);
    onNudge(cue("trade")); onScenario(session.headline);
  }, [session]);

  const total = Object.values(alloc).reduce((a,b)=>a+b,0);

  useEffect(() => {
    if (phase!=="decide") return;
    if (timer===0) { execute(); return; }
    const t=setTimeout(()=>setTimer(s=>s-1),1000);
    return ()=>clearTimeout(t);
  }, [timer, phase]);

  const execute = useCallback(() => {
    H.medium(); setPhase("simulate"); onNudge("Watching how the market responds…");
    const np={};
    session.assets.forEach(a=>{np[a.id]=pricePath(16,a.expected,a.vol,Math.random());});
    setPaths(np);
    let i=0;
    const iv=setInterval(()=>{setAnimAt(i);i++;if(i>=session.assets.length){clearInterval(iv);buildResult(np);}},360);
  }, [session, alloc]);

  const buildResult = p => {
    const rets={}; let portfolio=0;
    session.assets.forEach(a=>{
      const path=p[a.id];
      const ret=+((path[path.length-1]-path[0])/path[0]*100).toFixed(1);
      rets[a.id]=ret; portfolio+=(alloc[a.id]/100)*ret;
    });
    const port=+portfolio.toFixed(1);
    setResult({rets,port}); setPhase("result");
    onXP(Math.max(8,Math.round(Math.abs(port)*1.8+12)));
    onNudge(port>5?cue("correct"):port>0?"Thin edge. Study the drivers.":cue("wrong"));
  };

  const pickAlloc=(id,pct)=>{H.light();setAlloc(p=>({...p,[id]:pct}));};

  const nextRound = () => { H.medium(); setRound(r=>r+1); };

  if (phase==="simulate") return (
    <div style={{flex:1,display:"flex",flexDirection:"column",padding:18,gap:14}}>
      <div style={{fontFamily:"var(--ffd)",fontSize:20,fontWeight:800,letterSpacing:"-.02em",animation:"screen-in .28s ease"}}>Simulating…</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {session.assets.map((a,i)=>{
          const ready=i<=animAt, col=a.expected>0?"#10B981":a.expected<0?"#EF4444":"#888";
          return (
            <div key={a.id} style={{background:"var(--card)",border:`1px solid ${ready?"var(--b2)":"var(--b1)"}`,borderRadius:10,padding:"10px 9px",transition:"opacity .3s,transform .3s",opacity:ready?1:.2,transform:ready?"scale(1)":"scale(.96)"}}>
              <div style={{fontSize:10,color:"var(--t2)",marginBottom:5,display:"flex",justifyContent:"space-between"}}>
                <span>{a.icon} {a.n}</span>
                {ready&&<span style={{color:col,fontFamily:"var(--ffm)",fontSize:9}}>{a.expected>0?"↑":a.expected<0?"↓":"→"}</span>}
              </div>
              {ready&&paths[a.id]&&<MiniChart data={paths[a.id]} color={col} h={38} anim={i===animAt}/>}
            </div>
          );
        })}
      </div>
    </div>
  );

  if (phase==="result" && result) return (
    <div style={{flex:1,overflow:"auto",padding:"0 18px 18px",animation:"screen-in .32s ease"}}>
      {/* Return header */}
      <div style={{textAlign:"center",padding:"18px 0 16px",borderBottom:"1px solid var(--b1)"}}>
        <div style={{fontFamily:"var(--ffm)",fontSize:9,color:"var(--t2)",letterSpacing:".1em",marginBottom:5}}>YOUR RETURN</div>
        <div style={{fontFamily:"var(--ffd)",fontSize:52,fontWeight:800,letterSpacing:"-.04em",lineHeight:1,color:result.port>0?"var(--green)":"var(--red)",animation:"pop-in .4s cubic-bezier(.34,1.56,.64,1)"}}>
          {result.port>0?"+":""}{result.port}%
        </div>
        <div style={{marginTop:7,fontSize:12,color:"var(--t2)"}}>
          {result.port>10?"Strong read on the scenario.":result.port>3?"Decent. Check the reasoning.":result.port>0?"Thin edge. Study the drivers.":"The market humbled you. Good."}
        </div>
      </div>
      {/* Asset breakdown */}
      <div style={{display:"flex",flexDirection:"column",marginTop:12}}>
        {session.assets.map(a=>{
          const r=result.rets[a.id], ap=alloc[a.id], contrib=+((ap/100)*r).toFixed(2);
          return (
            <div key={a.id} style={{padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,.03)",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{display:"flex",gap:9,alignItems:"flex-start"}}>
                <span style={{fontSize:16,marginTop:1}}>{a.icon}</span>
                <div>
                  <div style={{fontSize:13,fontWeight:600}}>{a.n}</div>
                  <div style={{fontSize:10.5,color:"var(--t2)",marginTop:1.5,lineHeight:1.4,maxWidth:185}}>{a.hint}</div>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:1.5,flexShrink:0,marginLeft:8}}>
                <span style={{fontFamily:"var(--ffm)",fontSize:12,fontWeight:700,color:r>0?"var(--green)":"var(--red)"}}>{r>0?"+":""}{r}%</span>
                {ap>0&&<span style={{fontSize:9.5,color:"var(--t3)",fontFamily:"var(--ffm)"}}>{ap}% → {contrib>0?"+":""}{contrib}%</span>}
              </div>
            </div>
          );
        })}
      </div>
      {/* ── NEXT ROUND BUTTON — the missing piece ── */}
      <div style={{display:"flex",flexDirection:"column",gap:9,marginTop:20}}>
        <button onClick={nextRound} className="tap btn-glow" style={{
          width:"100%",padding:"15px",borderRadius:12,border:"none",
          background:"linear-gradient(135deg,#3B82F6,#8B5CF6)",
          color:"#fff",fontFamily:"var(--ffd)",fontSize:14.5,fontWeight:700,cursor:"pointer",
          boxShadow:"0 0 20px rgba(59,130,246,.32)",letterSpacing:".02em",
        }}>
          ⚡ Next Round →
        </button>
      </div>
    </div>
  );

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{margin:"10px 18px 0",padding:"12px 14px",background:`${session.color}0A`,border:`1px solid ${session.color}22`,borderRadius:12,flexShrink:0,animation:"pop-in .26s ease"}}>
        <div style={{fontSize:14.5,fontWeight:700,fontFamily:"var(--ffd)",letterSpacing:"-.01em",marginBottom:3}}>{session.headline}</div>
        <div style={{fontSize:11.5,color:"var(--t2)",lineHeight:1.45}}>{session.sub}</div>
      </div>
      <div style={{flex:1,overflow:"auto",padding:"10px 18px 0",display:"flex",flexDirection:"column",gap:6}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
          <span style={{fontSize:11,color:"var(--t3)"}}>Tap to allocate · {total}% used</span>
          <Ring s={timer} total={15} size={44}/>
        </div>
        {session.assets.map(a=>{
          const active=selA===a.id, pct=alloc[a.id];
          return (
            <div key={a.id}>
              <button onClick={()=>{setSelA(active?null:a.id);H.light();}} className="tap" style={{
                width:"100%",padding:"10px 13px",borderRadius:10,textAlign:"left",cursor:"pointer",
                background:active?"rgba(59,130,246,.09)":pct>0?"rgba(255,255,255,.05)":"rgba(255,255,255,.02)",
                outline:active?"1px solid rgba(59,130,246,.3)":pct>0?"1px solid rgba(255,255,255,.09)":"1px solid var(--b1)",
                transition:"background .18s,outline-color .18s",
                display:"flex",justifyContent:"space-between",alignItems:"center",
              }}>
                <div style={{display:"flex",gap:9,alignItems:"center"}}>
                  <span style={{fontSize:17}}>{a.icon}</span>
                  <div>
                    <div style={{fontSize:13,fontWeight:600}}>{a.n}</div>
                    <div style={{fontSize:10.5,color:"var(--t3)",marginTop:1.5}}>{a.hint}</div>
                  </div>
                </div>
                <span style={{fontFamily:"var(--ffm)",fontSize:12,fontWeight:700,color:pct>0?"var(--blue)":"var(--t3)",background:pct>0?"rgba(59,130,246,.1)":"rgba(255,255,255,.04)",padding:"2px 9px",borderRadius:6}}>
                  {pct}%
                </span>
              </button>
              {active&&(
                <div style={{display:"flex",gap:5,padding:"7px 2px 2px",animation:"pop-in .14s ease"}}>
                  {[0,25,50,75,100].map(p=>(
                    <button key={p} onClick={()=>pickAlloc(a.id,p)} className="tap" style={{
                      flex:1,padding:"7px 0",borderRadius:8,cursor:"pointer",
                      background:pct===p?"rgba(59,130,246,.18)":"rgba(255,255,255,.05)",
                      color:pct===p?"var(--blue)":"var(--t2)",
                      fontFamily:"var(--ffm)",fontSize:11,fontWeight:pct===p?700:400,
                      boxShadow:pct===p?"0 0 8px rgba(59,130,246,.22)":"none",transition:"all .12s",
                    }}>{p===0?"✕":p+"%"}</button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{padding:"10px 18px 14px",flexShrink:0}}>
        <button onClick={execute} className="tap btn-glow" style={{width:"100%",padding:"15px",borderRadius:12,background:"linear-gradient(135deg,#3B82F6,#8B5CF6)",color:"#fff",fontFamily:"var(--ffd)",fontSize:14.5,fontWeight:700,cursor:"pointer",boxShadow:"0 0 18px rgba(59,130,246,.26)",letterSpacing:".02em"}}>
          Execute Trade →
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// INTRO
// ══════════════════════════════════════════════════════════════════════════════
function IntroScreen({ onStart }) {
  const [p,setP]=useState(0);
  useEffect(()=>{const ts=[setTimeout(()=>setP(1),280),setTimeout(()=>setP(2),640),setTimeout(()=>setP(3),1000)];return()=>ts.forEach(clearTimeout);},[]);
  const t=(n,d=0)=>({opacity:p>=n?1:0,transform:p>=n?"translateY(0)":"translateY(14px)",transition:`opacity .4s ease ${d}ms, transform .4s cubic-bezier(.34,1.56,.64,1) ${d}ms`});
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:30,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 70% 50% at 50% 38%,rgba(59,130,246,.08) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{...t(1),width:82,height:82,borderRadius:"50%",background:"radial-gradient(circle at 36% 34%,#3B82F6,#8B5CF6)",animation:"orb-float 3.2s ease-in-out infinite,orb-glow 2.2s ease-in-out infinite",marginBottom:24,position:"relative",overflow:"hidden",willChange:"transform",flexShrink:0}}>
        <div style={{position:"absolute",inset:7,borderRadius:"50%",background:"rgba(0,0,0,.26)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:"35%",height:"35%",borderRadius:"50%",background:"rgba(255,255,255,.88)",filter:"blur(2.5px)"}}/>
        </div>
      </div>
      <div style={{...t(2,40),textAlign:"center",marginBottom:10}}>
        <div style={{fontFamily:"var(--ffd)",fontSize:42,fontWeight:800,letterSpacing:"-.04em",background:"linear-gradient(135deg,#fff 35%,#8B5CF6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1}}>MarketPlay</div>
        <div style={{fontFamily:"var(--ffm)",fontSize:9.5,color:"var(--t3)",letterSpacing:".2em",marginTop:6}}>FINANCE · BUSINESS · MARKETS</div>
      </div>
      <div style={{...t(3,80),textAlign:"center",marginBottom:38,color:"var(--t2)",fontSize:14,lineHeight:1.65,maxWidth:255}}>
        Learn money. Understand business.<br/>Read markets like a pro.<br/>No experience needed.
      </div>
      <div style={{...t(3,130),display:"flex",flexDirection:"column",gap:9,width:"100%",maxWidth:300}}>
        <button onClick={()=>{H.medium();onStart("learn");}} className="tap btn-glow" style={{padding:"16px",borderRadius:12,background:"linear-gradient(135deg,#3B82F6,#8B5CF6)",color:"#fff",fontFamily:"var(--ffd)",fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:"0 0 24px rgba(59,130,246,.38)",letterSpacing:".02em"}}>
          Start from zero
        </button>
        <button onClick={()=>{H.medium();onStart("challenge");}} className="tap" style={{padding:"16px",borderRadius:12,border:"1px solid rgba(59,130,246,.22)",background:"rgba(59,130,246,.06)",color:"var(--t1)",fontFamily:"var(--ffd)",fontSize:15,fontWeight:700,cursor:"pointer",letterSpacing:".02em"}}>
          ⚡ Challenge me
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// HOME
// ══════════════════════════════════════════════════════════════════════════════
function HomeScreen({ xp, streak, onNavigate, sessionCount }) {
  const lv=getLevel(xp);
  const tier=Math.min(5,1+Math.floor(sessionCount/2));
  const tierLabels=["","Beginner","Easy","Medium","Hard","Advanced"];
  return (
    <div style={{flex:1,overflow:"auto",padding:"12px 18px 18px"}}>
      <div style={{marginBottom:16,animation:"screen-in .28s ease"}}>
        <div style={{fontFamily:"var(--ffm)",fontSize:9,color:"var(--t3)",letterSpacing:".12em"}}>TODAY'S BRIEF</div>
        <h1 style={{fontFamily:"var(--ffd)",fontSize:26,fontWeight:800,letterSpacing:"-.025em",marginTop:3,lineHeight:1.1}}>Sharpen your edge.</h1>
      </div>
      <div style={{background:`linear-gradient(135deg,${lv.color}12,rgba(139,92,246,.07))`,border:`1px solid ${lv.color}24`,borderRadius:13,padding:"13px 15px",marginBottom:10,animation:"screen-in .28s ease .04s both",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontFamily:"var(--ffm)",fontSize:8.5,color:lv.color,letterSpacing:".1em"}}>{lv.name.toUpperCase()}</div>
          <div style={{fontFamily:"var(--ffd)",fontSize:20,fontWeight:800,letterSpacing:"-.02em",marginTop:2}}>{lv.name}</div>
          <div style={{fontFamily:"var(--ffm)",fontSize:10,color:"var(--t3)",marginTop:2}}>{xp} XP · Questions: {tierLabels[tier]}</div>
        </div>
        <div style={{fontSize:30}}>{lv.icon}</div>
      </div>
      {[
        {icon:"📚",title:"Finance Foundations",sub:"Lesson · 90 sec · Why prices move",cta:"Start lesson",screen:"lesson",accent:"#3B82F6",badge:"+125 XP",delay:.07},
        {icon:"⚡",title:"Live Trade Sim",sub:"Unique scenario · New every round",cta:"Enter market",screen:"trade",accent:"#8B5CF6",badge:"XP",delay:.11},
        {icon:"🧠",title:"Challenge Mode",sub:`${tierLabels[tier]} questions · Finance & Business`,cta:"Start challenge",screen:"challenge",accent:"#10B981",badge:"+XP",delay:.15},
      ].map(c=>(
        <div key={c.screen} onClick={()=>{H.light();onNavigate(c.screen);}} className="tap" style={{background:"var(--card)",border:"1px solid var(--b1)",borderRadius:13,padding:"13px 15px",marginBottom:9,cursor:"pointer",animation:`screen-in .28s ease ${c.delay}s both`,transition:"border-color .2s"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              <div style={{width:37,height:37,borderRadius:9,background:`${c.accent}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{c.icon}</div>
              <div>
                <div style={{fontFamily:"var(--ffd)",fontSize:15,fontWeight:700,letterSpacing:"-.01em"}}>{c.title}</div>
                <div style={{fontSize:11,color:"var(--t3)",marginTop:2}}>{c.sub}</div>
              </div>
            </div>
            <div style={{fontFamily:"var(--ffm)",fontSize:8.5,color:c.accent,background:`${c.accent}15`,padding:"2px 7px",borderRadius:5,flexShrink:0,letterSpacing:".05em"}}>{c.badge}</div>
          </div>
          <div style={{marginTop:10,padding:"8px 12px",borderRadius:8,background:`${c.accent}16`,color:c.accent,fontFamily:"var(--ffd)",fontSize:12,fontWeight:700,textAlign:"center",letterSpacing:".02em"}}>{c.cta} →</div>
        </div>
      ))}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,animation:"screen-in .28s ease .22s both"}}>
        {[{l:"Streak",v:`${streak}🔥`,c:"var(--amber)"},{l:"Sessions",v:`${sessionCount}`,c:"var(--blue)"},{l:"Accuracy",v:"73%",c:"var(--green)"}].map(st=>(
          <div key={st.l} style={{background:"var(--card)",border:"1px solid var(--b1)",borderRadius:10,padding:"10px 7px",textAlign:"center"}}>
            <div style={{fontFamily:"var(--ffd)",fontSize:17,fontWeight:700,color:st.c}}>{st.v}</div>
            <div style={{fontSize:9,color:"var(--t3)",marginTop:2,fontFamily:"var(--ffm)",letterSpacing:".05em"}}>{st.l.toUpperCase()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// COMPLETE
// ══════════════════════════════════════════════════════════════════════════════
function CompleteScreen({ onNavigate }) {
  const [b,setB]=useState(false);
  useEffect(()=>{setB(true);const t=setTimeout(()=>setB(false),950);return()=>clearTimeout(t);},[]);
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:30,position:"relative",overflow:"hidden"}}>
      <Burst active={b} color="#10B981"/>
      <div style={{width:66,height:66,borderRadius:"50%",background:"radial-gradient(circle,#10B981,#3B82F6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,marginBottom:18,animation:"orb-glow 2s ease-in-out infinite",boxShadow:"0 0 28px rgba(16,185,129,.42)"}}>✓</div>
      <div style={{fontFamily:"var(--ffd)",fontSize:25,fontWeight:800,letterSpacing:"-.025em",marginBottom:7,textAlign:"center"}}>Lesson Complete</div>
      <div style={{color:"var(--t2)",fontSize:13,textAlign:"center",marginBottom:24,lineHeight:1.55,maxWidth:255}}>You understand why prices move.<br/>That's the foundation everything builds on.</div>
      <div style={{background:"rgba(16,185,129,.09)",border:"1px solid rgba(16,185,129,.22)",borderRadius:11,padding:"10px 20px",fontFamily:"var(--ffm)",fontSize:18,color:"var(--green)",fontWeight:700,marginBottom:24}}>+125 XP</div>
      <div style={{display:"flex",flexDirection:"column",gap:8,width:"100%",maxWidth:295}}>
        <button onClick={()=>{H.medium();onNavigate("trade");}} className="tap btn-glow" style={{padding:"15px",borderRadius:12,background:"linear-gradient(135deg,#3B82F6,#8B5CF6)",color:"#fff",fontFamily:"var(--ffd)",fontSize:14.5,fontWeight:700,cursor:"pointer",boxShadow:"0 0 18px rgba(59,130,246,.3)",letterSpacing:".02em"}}>Try Live Trade Sim →</button>
        <button onClick={()=>{H.light();onNavigate("home");}} className="tap" style={{padding:"15px",borderRadius:12,border:"1px solid var(--b1)",background:"transparent",color:"var(--t2)",fontFamily:"var(--ffd)",fontSize:14.5,fontWeight:700,cursor:"pointer"}}>Back to Home</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// NAV BAR
// ══════════════════════════════════════════════════════════════════════════════
const NavBar = memo(function NavBar({ active, onNavigate }) {
  const items=[{id:"home",icon:"⊞",label:"Home"},{id:"lesson",icon:"📚",label:"Learn"},{id:"trade",icon:"⚡",label:"Trade"}];
  return (
    <div style={{display:"flex",height:"var(--nav-h)",borderTop:"1px solid var(--b1)",background:"rgba(5,5,5,.97)",flexShrink:0,alignItems:"center"}}>
      {items.map(it=>(
        <button key={it.id} onClick={()=>{H.light();onNavigate(it.id);}} className="tap" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2.5,background:"none",padding:"5px 0",opacity:active===it.id?1:.45,transition:"opacity .15s"}}>
          <span style={{fontSize:18}}>{it.icon}</span>
          <span style={{fontFamily:"var(--ffm)",fontSize:8.5,letterSpacing:".06em",color:active===it.id?"var(--blue)":"var(--t3)"}}>{it.label.toUpperCase()}</span>
          {active===it.id&&<div style={{width:14,height:1.5,borderRadius:1,background:"var(--blue)",boxShadow:"0 0 5px rgba(59,130,246,.7)"}}/>}
        </button>
      ))}
    </div>
  );
});

// ══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════════════════════
export default function MarketPlay() {
  const [screen,       setScreen]       = useState("intro");
  const [xp,           setXp]           = useState(75);
  const [streak]                        = useState(3);
  const [xpDelta,      setXpDelta]      = useState(0);
  const [nudge,        setNudge]        = useState("");
  const [nudgeKey,     setNudgeKey]     = useState(0);
  const [chatOpen,     setChatOpen]     = useState(false);
  const [scenario,     setScenario]     = useState("");
  const [sessionCount, setSessionCount] = useState(0); // increases with each challenge completed

  const addXP = useCallback(n => {
    setXp(x=>x+n); setXpDelta(n);
    setTimeout(()=>setXpDelta(0), 1100);
  }, []);

  const onNudge = useCallback(msg => {
    setNudge(msg); setNudgeKey(k=>k+1);
  }, []);

  const go = useCallback(s => {
    setChatOpen(false); setScreen(s);
    const m={home:cue("start"),lesson:"Let's see what you know.",trade:cue("trade"),challenge:"Speed matters here."};
    if (m[s]) { setNudge(m[s]); setNudgeKey(k=>k+1); }
  }, []);

  const showNav    = ["home","lesson","trade","challenge"].includes(screen);
  const showTicker = ["home","trade"].includes(screen);
  const showAI     = screen !== "intro";

  return (
    <div style={{width:"100%",height:"100vh",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",background:"var(--bg)",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:0,background:"radial-gradient(ellipse 80% 42% at 50% 0%,rgba(59,130,246,.062) 0%,transparent 65%)"}}/>

      {showNav && (
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 17px 8px",borderBottom:"1px solid var(--b1)",flexShrink:0,position:"relative",zIndex:10,background:"rgba(7,7,7,.92)"}}>
          <div style={{fontFamily:"var(--ffd)",fontSize:17,fontWeight:800,letterSpacing:"-.025em",background:"linear-gradient(135deg,#fff 40%,#8B5CF6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>MarketPlay</div>
          <XPBar xp={xp} streak={streak} delta={xpDelta}/>
        </div>
      )}
      {showTicker && <Ticker/>}

      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",position:"relative",zIndex:5}}>
        <ScreenSlot screenKey={screen}>
          {screen==="intro"     && <IntroScreen onStart={m=>go(m==="challenge"?"challenge":"home")}/>}
          {screen==="challenge" && <ChallengeScreen onComplete={()=>{setSessionCount(c=>c+1);go("home");}} onXP={addXP} onNudge={onNudge} sessionCount={sessionCount}/>}
          {screen==="home"      && <HomeScreen xp={xp} streak={streak} onNavigate={go} sessionCount={sessionCount}/>}
          {screen==="lesson"    && <LessonScreen onComplete={()=>setScreen("complete")} onXP={addXP} onNudge={onNudge} onScenario={setScenario}/>}
          {screen==="trade"     && <TradeScreen onXP={addXP} onNudge={onNudge} onScenario={setScenario}/>}
          {screen==="complete"  && <CompleteScreen onNavigate={go}/>}
        </ScreenSlot>
      </div>

      {showNav && <div style={{position:"relative",zIndex:10}}><NavBar active={screen} onNavigate={go}/></div>}

      {showAI && (
        <AIAssistant
          open={chatOpen}
          onToggle={()=>setChatOpen(o=>!o)}
          nudge={nudge}
          nudgeKey={nudgeKey}
          scenario={scenario}
          hasNav={showNav}
        />
      )}
    </div>
  );
}
