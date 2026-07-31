/* 0XFORD AI — Signal Engine */

const PAIRS = {
  xauusd: {
    key: "xauusd",
    name: "XAUUSD",
    full: "Gold / US Dollar",
    base: 2387.40,
    decimals: 2,
    analyses: [
      "Struktur H4 menunjukkan higher-low yang valid. Liquidity di bawah equal lows sudah di-sweep. Model melihat probability bounce dari demand zone dengan RR optimal di 1:2.4.",
      "Order block bullish di daily masih dilindungi. Volume delta positif pada candle terakhir. Entry agresif di open London, stop di bawah wick terendah.",
      "Divergensi RSI hidden bullish di M15 berkonfluensi dengan FVG H1. Bias long tetap dominan selama harga di atas 2372.",
      "Smart money reverse setelah inducement. AI menangkap shift dari distribution ke accumulation. Target menuju previous day high.",
    ],
  },
  usa100: {
    key: "usa100",
    name: "USA100",
    full: "Nasdaq 100 Index",
    base: 20145.80,
    decimals: 2,
    analyses: [
      "Breakout dari compression range H4 terkonfirmasi volume. Retest demand berhasil ditahan. Model memberi bias continuation menuju ATH zone.",
      "Tech sector relative strength tinggi. Order flow menunjukkan institutional accumulation di area 20080–20120. Risk-reward menarik untuk long.",
      "Fair value gap di H1 belum diisi. AI menunggu pullback sebelum entry. Stop ketat di bawah structure low.",
      "Momentum residual masih bullish meski overbought di lower TF. Bias long dengan partial TP di resistance sebelumnya.",
    ],
  },
  btc: {
    key: "btc",
    name: "BTCUSD",
    full: "Bitcoin / US Dollar",
    base: 68420.00,
    decimals: 2,
    analyses: [
      "Liquidity grab di bawah range low selesai. Funding rate netral. Model melihat reclaim level penting sebagai sinyal long dengan confidence tinggi.",
      "Order block H4 masih valid. Open interest naik tanpa funding ekstrem — indikasi positioning sehat. Entry di retest zona demand.",
      "Struktur higher-high & higher-low utuh di daily. AI menangkap impuls kecil di M15 sebagai awal leg baru ke atas.",
      "Relative strength BTC vs alts meningkat. Volume profile menunjukkan POC di bawah harga saat ini — support natural untuk long.",
    ],
  },
};

let signals = [];
let activeFilter = "all";
let activePair = "xauusd";
let totalGenerated = 0;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fmt(n, d) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

function makeSignal(pairKey) {
  const p = PAIRS[pairKey];
  const isBuy = Math.random() > 0.4;
  const type = isBuy ? "buy" : "sell";
  const conf = Math.floor(rand(74, 96));
  const price = p.base * (1 + rand(-0.0035, 0.0035));
  const atr = p.base * 0.0032;

  let entry = price;
  let sl, tp1, tp2;

  if (isBuy) {
    sl = entry - atr * rand(0.9, 1.4);
    tp1 = entry + atr * rand(1.3, 1.9);
    tp2 = entry + atr * rand(2.3, 3.4);
  } else {
    sl = entry + atr * rand(0.9, 1.4);
    tp1 = entry - atr * rand(1.3, 1.9);
    tp2 = entry - atr * rand(2.3, 3.4);
  }

  return {
    id: crypto.randomUUID?.() || Date.now() + Math.random(),
    pairKey,
    pair: p.name,
    full: p.full,
    type,
    conf,
    price: fmt(price, p.decimals),
    entry: fmt(entry, p.decimals),
    sl: fmt(sl, p.decimals),
    tp1: fmt(tp1, p.decimals),
    tp2: fmt(tp2, p.decimals),
    analysis: pick(p.analyses),
    time: new Date(),
  };
}

function ago(date) {
  const s = Math.floor((Date.now() - date) / 1000);
  if (s < 8) return "now";
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h`;
}

/* ---------- Renderers ---------- */

function renderFeatured(sig) {
  const el = document.getElementById("featured-signal");
  if (!el || !sig) return;

  el.innerHTML = `
    <div class="bs-pair">${sig.pair}  ·  ${sig.full}</div>
    <div class="bs-type ${sig.type}">${sig.type.toUpperCase()}</div>
    <div class="bs-price">${sig.price}</div>
    <div class="bs-levels">
      <div class="bs-level">
        <div class="l">ENTRY</div>
        <div class="v">${sig.entry}</div>
      </div>
      <div class="bs-level">
        <div class="l">STOP</div>
        <div class="v" style="color:var(--danger)">${sig.sl}</div>
      </div>
      <div class="bs-level">
        <div class="l">TP1</div>
        <div class="v" style="color:var(--accent)">${sig.tp1}</div>
      </div>
    </div>
    <div class="bs-conf">
      <div class="bs-conf-label">
        <span>CONFIDENCE</span>
        <span>${sig.conf}%</span>
      </div>
      <div class="conf-track">
        <div class="conf-fill ${sig.type}" style="width:${sig.conf}%"></div>
      </div>
    </div>
  `;
}

function renderStream() {
  const stream = document.getElementById("signal-stream");
  if (!stream) return;

  const list =
    activeFilter === "all"
      ? signals
      : signals.filter((s) => s.pairKey === activeFilter);

  if (list.length === 0) {
    stream.innerHTML = `<div style="color:var(--muted);font-family:var(--mono);font-size:0.8rem;padding:24px 0">No signals for this filter.</div>`;
    return;
  }

  stream.innerHTML = list
    .map(
      (s) => `
    <article class="sig-card ${s.type}">
      <div class="sc-top">
        <span class="sc-pair">${s.pair}</span>
        <span class="sc-badge ${s.type}">${s.type.toUpperCase()}</span>
      </div>
      <div class="sc-price">${s.price}</div>
      <div class="sc-meta">
        <div class="sc-m">
          <span class="l">ENTRY</span>
          <span class="v">${s.entry}</span>
        </div>
        <div class="sc-m">
          <span class="l">SL</span>
          <span class="v" style="color:var(--danger)">${s.sl}</span>
        </div>
        <div class="sc-m">
          <span class="l">TP1</span>
          <span class="v" style="color:var(--accent)">${s.tp1}</span>
        </div>
      </div>
      <div class="sc-bottom">
        <span class="sc-conf-num">${s.conf}% conf</span>
        <span class="sc-time">${ago(s.time)}</span>
      </div>
    </article>
  `
    )
    .join("");
}

function renderMatrix(pairKey) {
  const panel = document.getElementById("matrix-panel");
  if (!panel) return;

  const p = PAIRS[pairKey];
  let sig = signals.find((s) => s.pairKey === pairKey);
  if (!sig) sig = makeSignal(pairKey);

  panel.innerHTML = `
    <div class="mp-header">
      <div>
        <div class="mp-title">${p.name}</div>
        <div class="mp-desc">${p.full}</div>
      </div>
      <div class="mp-signal-tag ${sig.type}">${sig.type.toUpperCase()}  ·  ${sig.conf}%</div>
    </div>

    <div class="mp-levels">
      <div class="mp-box entry">
        <div class="l">ENTRY</div>
        <div class="v">${sig.entry}</div>
      </div>
      <div class="mp-box sl">
        <div class="l">STOP LOSS</div>
        <div class="v">${sig.sl}</div>
      </div>
      <div class="mp-box tp">
        <div class="l">TAKE PROFIT 1</div>
        <div class="v">${sig.tp1}</div>
      </div>
      <div class="mp-box tp">
        <div class="l">TAKE PROFIT 2</div>
        <div class="v">${sig.tp2}</div>
      </div>
    </div>

    <div class="mp-analysis">
      <h4>NEURAL ANALYSIS</h4>
      <p>${sig.analysis}</p>
    </div>
  `;
}

/* ---------- Actions ---------- */

function pushSignal(sig) {
  signals.unshift(sig);
  if (signals.length > 9) signals.pop();
  totalGenerated++;
  document.getElementById("sig-count").textContent = totalGenerated;
  renderFeatured(sig);
  renderStream();
  if (sig.pairKey === activePair) renderMatrix(activePair);
}

function generateNew() {
  const keys = Object.keys(PAIRS);
  const key = keys[Math.floor(Math.random() * keys.length)];
  const sig = makeSignal(key);
  pushSignal(sig);

  // latency flicker
  const lat = document.getElementById("latency");
  if (lat) {
    lat.textContent = Math.floor(rand(8, 28)) + "ms";
  }
}

/* ---------- Clock ---------- */

function tickClock() {
  const el = document.getElementById("clock");
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

/* ---------- Init ---------- */

function init() {
  // seed
  const keys = Object.keys(PAIRS);
  signals = [
    makeSignal("xauusd"),
    makeSignal("usa100"),
    makeSignal("btc"),
    makeSignal("xauusd"),
    makeSignal("btc"),
    makeSignal("usa100"),
  ];
  totalGenerated = signals.length;

  document.getElementById("sig-count").textContent = totalGenerated;
  renderFeatured(signals[0]);
  renderStream();
  renderMatrix("xauusd");

  // nav
  document.querySelectorAll(".nav-item").forEach((a) => {
    a.addEventListener("click", (e) => {
      document.querySelectorAll(".nav-item").forEach((x) => x.classList.remove("active"));
      a.classList.add("active");
    });
  });

  // filters
  document.querySelectorAll(".filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      renderStream();
    });
  });

  // pair selector
  document.querySelectorAll(".pair-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pair-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activePair = btn.dataset.pair;
      renderMatrix(activePair);
    });
  });

  // generate button
  document.getElementById("btn-refresh")?.addEventListener("click", () => {
    generateNew();
  });

  // auto feed
  setInterval(() => {
    if (Math.random() > 0.35) generateNew();
  }, rand(9000, 14000));

  // refresh timestamps
  setInterval(() => renderStream(), 4000);

  // clock
  tickClock();
  setInterval(tickClock, 1000);
}

document.addEventListener("DOMContentLoaded", init);
