
// AURUM AI — XAUUSD Signal Terminal
const historyData = [
  { time: "31 Jul 22:45", dir: "BUY", entry: "2341.20", sl: "2332.50", tp: "2358.80", result: "WIN", pips: "+176", conf: 91 },
  { time: "31 Jul 15:30", dir: "SELL", entry: "2355.40", sl: "2363.10", tp: "2340.20", result: "WIN", pips: "+152", conf: 84 },
  { time: "31 Jul 09:15", dir: "BUY", entry: "2336.80", sl: "2328.40", tp: "2352.00", result: "LOSS", pips: "-84", conf: 72 },
  { time: "30 Jul 21:00", dir: "BUY", entry: "2329.50", sl: "2321.00", tp: "2346.50", result: "WIN", pips: "+170", conf: 88 },
  { time: "30 Jul 14:45", dir: "SELL", entry: "2348.90", sl: "2356.20", tp: "2334.50", result: "WIN", pips: "+144", conf: 79 },
  { time: "30 Jul 08:30", dir: "BUY", entry: "2322.10", sl: "2314.80", tp: "2338.00", result: "WIN", pips: "+159", conf: 86 },
  { time: "29 Jul 23:00", dir: "SELL", entry: "2342.60", sl: "2350.40", tp: "2327.00", result: "LOSS", pips: "-78", conf: 68 },
  { time: "29 Jul 16:20", dir: "BUY", entry: "2318.40", sl: "2310.20", tp: "2334.80", result: "WIN", pips: "+164", conf: 90 },
  { time: "29 Jul 10:00", dir: "BUY", entry: "2309.70", sl: "2301.50", tp: "2325.40", result: "OPEN", pips: "—", conf: 82 },
  { time: "28 Jul 20:15", dir: "SELL", entry: "2335.20", sl: "2343.00", tp: "2320.00", result: "WIN", pips: "+152", conf: 85 },
];

function updateClock() {
  const now = new Date();
  const opts = { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
  const time = now.toLocaleTimeString("id-ID", opts);
  document.getElementById("clock").textContent = time + " WIB";
  document.getElementById("footer-time").textContent = now.toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta", weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function setConfidence(pct) {
  const ring = document.getElementById("conf-ring");
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (pct / 100) * circumference;
  ring.style.strokeDasharray = circumference;
  ring.style.strokeDashoffset = offset;
  document.getElementById("conf-value").textContent = pct;
}

function renderHistory() {
  const tbody = document.getElementById("history-body");
  tbody.innerHTML = historyData.map(r => `
    <tr>
      <td>${r.time}</td>
      <td class="dir-${r.dir.toLowerCase()}">${r.dir}</td>
      <td>${r.entry}</td>
      <td>${r.sl}</td>
      <td>${r.tp}</td>
      <td class="badge-${r.result.toLowerCase()}">${r.result}</td>
      <td class="${r.pips.startsWith("+") ? "badge-win" : r.pips.startsWith("-") ? "badge-loss" : ""}">${r.pips}</td>
      <td>${r.conf}%</td>
    </tr>
  `).join("");
}

function drawChart() {
  const canvas = document.getElementById("priceChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = 280 * dpr;
  ctx.scale(dpr, dpr);
  const w = rect.width;
  const h = 280;

  // Generate fake OHLC-ish line
  const points = [];
  let price = 2335;
  for (let i = 0; i < 60; i++) {
    price += (Math.random() - 0.48) * 4.5;
    points.push(price);
  }
  // Bias upward near the end for BUY signal
  points[points.length - 1] = 2349.15;
  points[points.length - 2] = 2347.8;
  points[points.length - 3] = 2346.2;

  const minP = Math.min(...points) - 5;
  const maxP = Math.max(...points) + 5;
  const range = maxP - minP;

  // Grid
  ctx.strokeStyle = "rgba(37,43,56,0.8)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const y = 20 + (h - 40) * (i / 4);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Entry / SL / TP lines
  const entry = 2348.60, sl = 2339.20, tp = 2367.40;
  function yOf(p) { return 20 + (h - 40) * (1 - (p - minP) / range); }

  ctx.setLineDash([6, 4]);
  // TP
  ctx.strokeStyle = "rgba(34,197,94,0.5)";
  ctx.beginPath(); ctx.moveTo(0, yOf(tp)); ctx.lineTo(w, yOf(tp)); ctx.stroke();
  // Entry
  ctx.strokeStyle = "rgba(212,175,55,0.7)";
  ctx.beginPath(); ctx.moveTo(0, yOf(entry)); ctx.lineTo(w, yOf(entry)); ctx.stroke();
  // SL
  ctx.strokeStyle = "rgba(239,68,68,0.5)";
  ctx.beginPath(); ctx.moveTo(0, yOf(sl)); ctx.lineTo(w, yOf(sl)); ctx.stroke();
  ctx.setLineDash([]);

  // Labels
  ctx.font = "11px JetBrains Mono, monospace";
  ctx.fillStyle = "#22c55e";
  ctx.fillText("TP " + tp.toFixed(1), w - 90, yOf(tp) - 6);
  ctx.fillStyle = "#d4af37";
  ctx.fillText("ENTRY " + entry.toFixed(1), w - 110, yOf(entry) - 6);
  ctx.fillStyle = "#ef4444";
  ctx.fillText("SL " + sl.toFixed(1), w - 90, yOf(sl) + 14);

  // Price line
  ctx.beginPath();
  ctx.strokeStyle = "#d4af37";
  ctx.lineWidth = 2;
  points.forEach((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = yOf(p);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Gradient fill under line
  const lastY = yOf(points[points.length - 1]);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "rgba(212,175,55,0.18)");
  grad.addColorStop(1, "rgba(212,175,55,0)");
  ctx.fillStyle = grad;
  ctx.fill();

  // Current price dot
  ctx.beginPath();
  ctx.arc(w - 2, lastY, 5, 0, Math.PI * 2);
  ctx.fillStyle = "#d4af37";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(w - 2, lastY, 9, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(212,175,55,0.4)";
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Navigation
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("panel-" + btn.dataset.panel).classList.add("active");
    if (btn.dataset.panel === "live") setTimeout(drawChart, 50);
  });
});

// Confidence filter
const confFilter = document.getElementById("conf-filter");
if (confFilter) {
  confFilter.addEventListener("input", e => {
    document.getElementById("conf-filter-val").textContent = e.target.value + "%";
  });
}

// Toggles
document.querySelectorAll(".toggle").forEach(t => {
  t.addEventListener("click", () => {
    t.parentElement.querySelectorAll(".toggle").forEach(x => x.classList.remove("active"));
    t.classList.add("active");
  });
});

// Chart tabs (visual only)
document.querySelectorAll(".ctab").forEach(t => {
  t.addEventListener("click", () => {
    document.querySelectorAll(".ctab").forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    drawChart();
  });
});

// Simulate slight price flicker
function flickerPrice() {
  const base = 2349.15;
  const delta = (Math.random() - 0.5) * 1.2;
  const p = (base + delta).toFixed(2);
  document.getElementById("last-price").textContent = p;
}

// Init
updateClock();
setInterval(updateClock, 1000);
setConfidence(87);
renderHistory();
setTimeout(drawChart, 100);
window.addEventListener("resize", () => setTimeout(drawChart, 100));
setInterval(flickerPrice, 2800);

// Session label based on hour WIB
function updateSession() {
  const h = new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta", hour: "numeric", hour12: false });
  const hour = parseInt(h, 10);
  let session = "Asia";
  if (hour >= 14 && hour < 21) session = "London";
  else if (hour >= 21 || hour < 4) session = "New York";
  document.getElementById("session").textContent = session;
}
updateSession();
