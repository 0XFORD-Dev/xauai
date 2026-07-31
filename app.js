// ===== 0XFORD AI - Signal Engine (Simulated) =====

const pairs = {
  xauusd: {
    name: "XAUUSD",
    fullName: "Gold / US Dollar",
    desc: "XAUUSD — Spot Gold against US Dollar",
    basePrice: 2385.50,
    decimals: 2,
  },
  usa100: {
    name: "USA100",
    fullName: "Nasdaq 100",
    desc: "USA100 — US Tech Index (Nasdaq 100 CFD)",
    basePrice: 19850.00,
    decimals: 2,
  },
  btc: {
    name: "BTCUSD",
    fullName: "Bitcoin / US Dollar",
    desc: "BTCUSD — Bitcoin against US Dollar",
    basePrice: 67500.00,
    decimals: 2,
  },
};

const analyses = {
  xauusd: [
    "AI mendeteksi confluence antara support daily dan oversold RSI di timeframe H1. Volume buying pressure meningkat di area demand zone.",
    "Model melihat divergensi bullish di MACD + harga menahan level key support. Probabilitas rebound tinggi dalam sesi London.",
    "Order flow menunjukkan absorpsi selling di level psikologis. AI memberi bias buy dengan risk-reward 1:2.5.",
    "Break of structure ke atas terkonfirmasi. Smart money concept + institutional order flow mendukung long position.",
  ],
  usa100: [
    "Nasdaq menunjukkan momentum kuat setelah data US. AI model menangkap breakout dari range H4 dengan volume tinggi.",
    "Sentiment equity positif + tech earnings season mendukung continuation. Entry di retest demand zone.",
    "Divergence kecil di higher timeframe, namun short-term bias tetap bullish. Risk management ketat disarankan.",
    "AI melihat pola flag bullish di H1. Target menuju all-time high zone dengan stop di bawah swing low.",
  ],
  btc: [
    "Bitcoin berada di area liquidity grab. AI mendeteksi potensi reversal setelah wick panjang di daily candle.",
    "Funding rate netral + open interest meningkat. Model memberi signal buy di area fair value gap.",
    "Order block bullish di H4 masih valid. AI menunggu konfirmasi candle close di atas resistance kecil.",
    "Sentiment crypto overall positif. BTC menunjukkan relative strength terhadap altcoin. Bias long tetap dominan.",
  ],
};

let signalCount = 0;
let currentSignals = [];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function formatPrice(price, decimals) {
  return price.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function generateSignal(pairKey) {
  const pair = pairs[pairKey];
  const isBuy = Math.random() > 0.42; // slight buy bias
  const type = isBuy ? "buy" : "sell";
  const confidence = Math.floor(randomBetween(72, 96));

  // Price variation
  const variation = pair.basePrice * randomBetween(-0.004, 0.004);
  const price = pair.basePrice + variation;

  // Levels
  const atrApprox = pair.basePrice * 0.0035;
  let entry, sl, tp1, tp2;

  if (isBuy) {
    entry = price;
    sl = entry - atrApprox * randomBetween(0.8, 1.3);
    tp1 = entry + atrApprox * randomBetween(1.2, 1.8);
    tp2 = entry + atrApprox * randomBetween(2.2, 3.2);
  } else {
    entry = price;
    sl = entry + atrApprox * randomBetween(0.8, 1.3);
    tp1 = entry - atrApprox * randomBetween(1.2, 1.8);
    tp2 = entry - atrApprox * randomBetween(2.2, 3.2);
  }

  const analysisList = analyses[pairKey];
  const analysis = analysisList[Math.floor(Math.random() * analysisList.length)];

  return {
    id: Date.now() + Math.random(),
    pairKey,
    pair: pair.name,
    fullName: pair.fullName,
    type,
    price: formatPrice(price, pair.decimals),
    entry: formatPrice(entry, pair.decimals),
    sl: formatPrice(sl, pair.decimals),
    tp1: formatPrice(tp1, pair.decimals),
    tp2: formatPrice(tp2, pair.decimals),
    confidence,
    analysis,
    time: new Date(),
  };
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 10) return "Just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

function renderSignals() {
  const grid = document.getElementById("signals-grid");
  if (!grid) return;

  grid.innerHTML = currentSignals
    .map(
      (s) => `
    <div class="signal-card ${s.type}">
      <div class="signal-header">
        <span class="pair-name">${s.pair}</span>
        <span class="signal-type ${s.type}">${s.type.toUpperCase()}</span>
      </div>
      <div class="signal-price">${s.price}</div>
      <div class="confidence-bar">
        <div class="confidence-fill ${s.type}" style="width: ${s.confidence}%"></div>
      </div>
      <div class="signal-meta">
        <div class="meta-item">
          <div class="meta-label">Confidence</div>
          <div class="meta-value">${s.confidence}%</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Entry</div>
          <div class="meta-value">${s.entry}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">SL</div>
          <div class="meta-value" style="color: var(--sell)">${s.sl}</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">TP1</div>
          <div class="meta-value" style="color: var(--buy)">${s.tp1}</div>
        </div>
      </div>
      <div class="time-ago">${timeAgo(s.time)}</div>
    </div>
  `
    )
    .join("");
}

function updatePairContent(pairKey) {
  const content = document.getElementById("pair-content");
  if (!content) return;

  // Find latest signal for this pair or generate one
  let signal = currentSignals.find((s) => s.pairKey === pairKey);
  if (!signal) {
    signal = generateSignal(pairKey);
  }

  const pair = pairs[pairKey];

  content.innerHTML = `
    <div class="pair-detail">
      <div class="pair-detail-header">
        <div>
          <div class="pair-title">${pair.name}</div>
          <div class="pair-desc">${pair.desc}</div>
        </div>
        <div class="current-signal">
          <div class="label">Current AI Signal</div>
          <div class="value" style="color: var(--${signal.type})">${signal.type.toUpperCase()} • ${signal.confidence}%</div>
        </div>
      </div>

      <div class="levels-grid">
        <div class="level-box entry">
          <div class="label">Entry</div>
          <div class="value">${signal.entry}</div>
        </div>
        <div class="level-box sl">
          <div class="label">Stop Loss</div>
          <div class="value">${signal.sl}</div>
        </div>
        <div class="level-box tp">
          <div class="label">Take Profit 1</div>
          <div class="value">${signal.tp1}</div>
        </div>
        <div class="level-box tp">
          <div class="label">Take Profit 2</div>
          <div class="value">${signal.tp2}</div>
        </div>
      </div>

      <div class="analysis-box">
        <h4>AI Analysis</h4>
        <p>${signal.analysis}</p>
      </div>
    </div>
  `;
}

function refreshSignals() {
  // Keep max 6 signals, add new ones
  const keys = Object.keys(pairs);
  const newSignal = generateSignal(keys[Math.floor(Math.random() * keys.length)]);
  currentSignals.unshift(newSignal);
  if (currentSignals.length > 6) currentSignals.pop();

  signalCount++;
  const counter = document.getElementById("total-signals");
  if (counter) counter.textContent = signalCount;

  const lastUpdate = document.getElementById("last-update");
  if (lastUpdate) {
    lastUpdate.textContent = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  renderSignals();

  // Update active pair tab content if needed
  const activeTab = document.querySelector(".tab-btn.active");
  if (activeTab) {
    updatePairContent(activeTab.dataset.pair);
  }
}

function init() {
  // Initial signals
  currentSignals = [
    generateSignal("xauusd"),
    generateSignal("usa100"),
    generateSignal("btc"),
    generateSignal("xauusd"),
    generateSignal("btc"),
    generateSignal("usa100"),
  ];
  signalCount = currentSignals.length;

  const counter = document.getElementById("total-signals");
  if (counter) counter.textContent = signalCount;

  renderSignals();
  updatePairContent("xauusd");

  // Tab switching
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      updatePairContent(btn.dataset.pair);
    });
  });

  // Auto refresh every 8-12 seconds
  setInterval(() => {
    refreshSignals();
  }, randomBetween(8000, 12000));

  // Update time-ago every 5s
  setInterval(() => {
    renderSignals();
  }, 5000);

  // Set last update
  const lastUpdate = document.getElementById("last-update");
  if (lastUpdate) {
    lastUpdate.textContent = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
}

document.addEventListener("DOMContentLoaded", init);
