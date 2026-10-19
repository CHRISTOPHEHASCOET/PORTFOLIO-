// =============================================
//  CONFIG
// =============================================
const CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.:'-";
const NBSP = "\u00A0";

// Gestion des timers (nettoyage au unload, pas de fuite mémoire)
const ACTIVE_TIMERS = new Set();

function setManagedTimeout(fn, ms) {
  const id = setTimeout(() => { ACTIVE_TIMERS.delete(id); fn(); }, ms);
  ACTIVE_TIMERS.add(id);
  return id;
}

function setManagedInterval(fn, ms) {
  const id = setInterval(fn, ms);
  ACTIVE_TIMERS.add(id);
  return id;
}

window.addEventListener('beforeunload', () => {
  ACTIVE_TIMERS.forEach(id => { clearTimeout(id); clearInterval(id); });
  ACTIVE_TIMERS.clear();
});

// =============================================
//  DATA
// =============================================
const DATA = [
  { v: 'PT-987', d: 'TERMINAL',         t: '06:45', g: 'A56', s: 'READY',      nextStatus: "FINAL CALL", delay: 7000, c: '', href: 'index.html' },
  { v: 'PJ-251', d: 'OPERATION CENTER', t: '06:45', g: 'H12', s: 'BOARDING',   nextStatus: "IN REVIEW",  delay: 8000, c: '', href: 'departures.html' },
  { v: 'PK-365', d: 'CREW PROFILE',     t: '08:00', g: 'P23', s: "AUTHORIZED", nextStatus: "READY",      delay: 10000, c: '', href: 'crew-profil.html' },
  { v: 'PM-451', d: 'BOARDING GATE',    t: '09:00', g: 'I17', s: "GATE OPEN",  nextStatus: "CLEARANCE",  delay: 9000, c: '', href: 'boarding-gate.html' },
  { v: 'PN-658', d: 'BLACK BOX',        t: '07:40', g: 'V36', s: "ARCHIVED",   nextStatus: "ON TIME",    delay: 8000, c: '', href: 'black-box.html' },
  { v: 'PR-854', d: 'COCKPIT',          t: '09:00', g: 'C48', s: 'IN REVIEW',  nextStatus: "AUTHORIZED", delay: 6000, c: '', href: 'cockpit.html' },
  { v: 'PV-000', d: 'CONTROL TOWER',    t: '10:00', g: 'T00', s: "CLEARANCE",  nextStatus: "GATE OPEN",  delay: 4000, c: '', href: 'control-tower.html' }
];

const STATUS_CLASSES = {
  READY: "status-ready",
  "GATE OPEN": "status-gate-open",
  BOARDING: "status-boarding",
  "FINAL CALL": "status-final",
  "IN REVIEW": "status-review",
  AUTHORIZED: "status-authorized",
  CLEARANCE: "status-clearance",
  ARCHIVED: "status-archived",
  "ON TIME": "status-ontime"
};

function getStatusClass(status) {
  return STATUS_CLASSES[status] || "";
}

// =============================================
//  CONSTRUCTION
// =============================================
function createWord(text, length = 15) {
  const wordElement = document.createElement('div');
  wordElement.className = 'word';
  const safeText = text || "";
  for (let i = 0; i < length; i++) {
    const flap = document.createElement('span');
    flap.className = 'flap';
    const char = safeText[i] ?? " ";
    flap.dataset.char = char;
    // ✅ La vraie lettre est affichée DIRECTEMENT
    flap.textContent = char === " " ? NBSP : char;
    wordElement.appendChild(flap);
  }
  return wordElement;
}

function createFlightRow(row) {
  const tr = document.createElement('tr');
  tr.className = row.c;
  tr.dataset.href = row.href;
  tr.dataset.flight = row.v;
  tr.setAttribute('role', 'button');
  tr.setAttribute('tabindex', '0');

  const cells = [
    { value: row.v, length: 7 },
    { value: row.d, length: 18 },
    { value: row.t || "--:--", length: 6 },
    { value: row.g, length: 4 }
  ];

  cells.forEach(cell => {
    const td = document.createElement('td');
    td.appendChild(createWord(cell.value, cell.length));
    tr.appendChild(td);
  });

  const statusCell = document.createElement('td');
  statusCell.classList.add('col-statut', 'status', getStatusClass(row.s));
  statusCell.appendChild(createWord(row.s, 12));
  tr.appendChild(statusCell);

  return tr;
}

function renderFlightBoard(tbody, flights) {
  tbody.textContent = "";
  flights.forEach(row => tbody.appendChild(createFlightRow(row)));
}

// =============================================
//  ANIMATION (comme ton code d'origine)
//  → lettres visibles direct, chaque flap tourne
//    avec son propre délai aléatoire, puis affiche
//    sa vraie lettre à la fin.
// =============================================
function animateFlap(flap) {

  const finalChar = flap.dataset.char;

  if (finalChar === " ") return;

  const delay = Math.random() * 900;
  const flips = 10 + Math.floor(Math.random() * 8);

  setManagedTimeout(() => {

    let count = 0;

    const interval = setManagedInterval(() => {

      flap.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];

      gsap.fromTo(flap,
        { rotationX: -90 },
        { rotationX: 0, duration: 0.25, ease: "power2.out" }
      );

      if (++count >= flips) {

        clearInterval(interval);
        ACTIVE_TIMERS.delete(interval);

        // ✅ La vraie lettre revient à la fin
        flap.textContent = finalChar;

        gsap.fromTo(flap,
          { rotationX: -60 },
          { rotationX: 0, duration: 0.35, ease: "back.out(1.7)" }
        );

      }

    }, 120 + Math.random() * 40);

  }, delay);

}

function animateFlaps() {
  document.querySelectorAll('.flap').forEach(animateFlap);
}

// =============================================
//  MISE À JOUR DU STATUT
//  (uniquement la cellule statut — le reste ne bouge pas)
// =============================================
function updateStatusCell(statusCell, newStatus) {

  const oldStatusClasses = [...statusCell.classList]
    .filter(cls => cls.startsWith("status-"));
  statusCell.classList.remove(...oldStatusClasses);
  statusCell.classList.add("status", getStatusClass(newStatus));

  statusCell.replaceChildren(createWord(newStatus, 12));

  // ✅ On anime UNIQUEMENT les flaps de cette cellule
  statusCell.querySelectorAll('.flap').forEach(animateFlap);
}

function scheduleStatusUpdates() {
  const rows = document.querySelectorAll('#flight-body tr');

  DATA.forEach((rowData, index) => {
    if (!rowData.nextStatus) return;

    const tr = rows[index];
    const statusCell = tr.querySelector('.col-statut');

    setManagedTimeout(() => {
      updateStatusCell(statusCell, rowData.nextStatus);
      highlightRow(tr);
    }, rowData.delay);
  });
}

function highlightRow(tr) {
  tr.classList.add('row-light');
  setManagedTimeout(() => tr.classList.remove('row-light'), 1200);
}

// =============================================
//  VIE DU TABLEAU — simulation temps réel
// =============================================

// Cycle de progression des statuts (comme un vrai aéroport)
const STATUS_FLOW = {
  "READY":       "BOARDING",
  "BOARDING":    "FINAL CALL",
  "FINAL CALL":  "GATE OPEN",
  "GATE OPEN":   "CLEARANCE",
  "CLEARANCE":   "ON TIME",
  "ON TIME":     "READY",
  "IN REVIEW":   "AUTHORIZED",
  "AUTHORIZED":  "READY",
  "ARCHIVED":    "ON TIME"
};

// Couleurs d'ambiance pour le "row-light" selon le statut (optionnel, via data-attr)
const GATES = ['A56', 'H12', 'P23', 'I17', 'V36', 'C48', 'T00'];

// Helpers pour retrouver l'index DATA d'une ligne
function getRowIndex(tr) {
  return Array.from(tr.parentNode.children).indexOf(tr);
}

// ---- Générique : animer un word vers un nouveau texte ----
function updateWord(cell, newText, length) {
  cell.replaceChildren(createWord(newText, length));
  cell.querySelectorAll('.flap').forEach(animateFlap);
}

// ---- 1. Les statuts progressent tout seuls ----
function startStatusLife() {
  const rows = document.querySelectorAll('#flight-body tr');

  const tick = () => {
    // On choisit UNE ligne au hasard (pas toutes en même temps,
    // comme un vrai tableau où les infos tombent une par une)
    const index = Math.floor(Math.random() * rows.length);
    const tr = rows[index];
    const rowData = DATA[index];
    const statusCell = tr.querySelector('.col-statut');

    // Prochain statut logique du cycle
    const next = STATUS_FLOW[rowData.s];
    if (next) {
      rowData.s = next; // on met à jour la source de vérité
      updateStatusCell(statusCell, next);
      highlightRow(tr);
    }

    // Prochain événement dans 8 à 15 secondes
    setManagedTimeout(tick, 8000 + Math.random() * 7000);
  };

  setManagedTimeout(tick, 5000);
}

// ---- 2. Les heures avancent (vols qui "décollent") ----
// ---- 2. Les heures avancent (vols qui "décollent") ----
function startTimeLife() {
  const rows = document.querySelectorAll('#flight-body tr');

  const tick = () => {
    const index = Math.floor(Math.random() * rows.length);
    const tr = rows[index];
    const rowData = DATA[index];
    const timeCell = tr.children[2].querySelector('.word');

    // On parse l'heure actuelle et on ajoute 1 à 3 minutes
    const parts = (rowData.t || "00:00").split(':');
    const h = Number(parts[0]);
    const m = Number(parts[1]);
    const total = (h * 60 + m + 1 + Math.floor(Math.random() * 3)) % 1440;

    let nh = String(Math.floor(total / 60));
    let nm = String(total % 60);
    if (nh.length < 2) nh = "0" + nh;
    if (nm.length < 2) nm = "0" + nm;

    rowData.t = nh + ":" + nm;   // ✅ concaténation simple, infaillible
    updateWord(timeCell, rowData.t, 6);
    highlightRow(tr);

    setManagedTimeout(tick, 15000 + Math.random() * 10000);
  };

  setManagedTimeout(tick, 12000);
}


// ---- 3. Porte : changement rare + interaction au clic ----
function startGateLife() {
  const rows = document.querySelectorAll('#flight-body tr');

  const tick = () => {
    const index = Math.floor(Math.random() * rows.length);
    const tr = rows[index];
    const rowData = DATA[index];
    const gateCell = tr.children[3].querySelector('.word');

    // Nouvelle porte différente de l'actuelle
    let newGate = rowData.g;
    while (newGate === rowData.g) {
      newGate = GATES[Math.floor(Math.random() * GATES.length)];
    }
    rowData.g = newGate;
    updateWord(gateCell, newGate, 4);
    highlightRow(tr);

    setManagedTimeout(tick, 25000 + Math.random() * 15000);
  };

  setManagedTimeout(tick, 30000);
}

// ---- 4. Interaction : survol / clic sur une ligne ----
// ---- 4. Interactions sur les lignes ----
function initRowInteractions() {
  const rows = document.querySelectorAll('#flight-body tr');

  rows.forEach(tr => {

    const rowData = DATA[Array.from(tr.parentNode.children).indexOf(tr)];
    const timeCell = tr.children[2].querySelector('.word');

    // Survol → l'heure avance (comme si le temps accélérait sur ce vol)
    tr.addEventListener('mouseenter', () => {
      const parts = (rowData.t || "00:00").split(':');
      let h = Number(parts[0]);
      let m = Number(parts[1]);
      if (isNaN(h) || isNaN(m)) { h = 6; m = 45; }

      // +1 à +5 minutes à chaque survol
      const total = (h * 60 + m + 1 + Math.floor(Math.random() * 5)) % 1440;

      let nh = String(Math.floor(total / 60));
      let nm = String(total % 60);
      if (nh.length < 2) nh = "0" + nh;
      if (nm.length < 2) nm = "0" + nm;

      rowData.t = nh + ":" + nm;
      updateWord(timeCell, rowData.t, 6);
      highlightRow(tr);
    });

    // Alt + clic → la porte change sans naviguer (easter egg gardé)
    tr.addEventListener('click', e => {
      if (!e.altKey) return;
      e.preventDefault();
      e.stopPropagation();

      const rowData2 = DATA[Array.from(tr.parentNode.children).indexOf(tr)];
      const gateCell = tr.children[3].querySelector('.word');
      let newGate = rowData2.g;
      while (newGate === rowData2.g) {
        newGate = GATES[Math.floor(Math.random() * GATES.length)];
      }
      rowData2.g = newGate;
      updateWord(gateCell, newGate, 4);
      highlightRow(tr);
    });

    // Accessibilité clavier
    tr.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        window.location.href = tr.dataset.href;
      }
    });
  });
}



// ---- 5. Synchronisation avec la Casio : heure du tableau vs heure réelle ----
// (bonus : le tableau affiche aussi les minutes réelles dans l'entête si tu veux)

(function () {
  'use strict';

  const DAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  let lastSec = -1, lastMin = -1;
  let timers = new Set();

  const setT = (fn, ms) => {
    const id = setTimeout(() => { timers.delete(id); fn(); }, ms);
    timers.add(id);
    return id;
  };

  const setI = (fn, ms) => {
    const id = setInterval(fn, ms);
    timers.add(id);
    return id;
  };

  const cleanup = () => {
    timers.forEach(id => { clearTimeout(id); clearInterval(id); });
    timers.clear();
  };

  const tickCasio = () => {
    const now = new Date();
    const s = now.getSeconds();
    const m = now.getMinutes();
    const h = now.getHours();
    const pad = (n) => String(n).padStart(2, '0');

    if (s !== lastSec) {
      lastSec = s;
      const el = document.getElementById('casio-seconds');
      if (el) el.textContent = pad(s);
    }

    if (m !== lastMin) {
      lastMin = m;
      const h12 = h % 12 || 12;
      const timeEl = document.getElementById('casio-time');
      if (timeEl) {
        timeEl.textContent = `${pad(h12)}:${pad(m)}`;
        timeEl.setAttribute('datetime', `${pad(h)}:${pad(m)}`);
      }
      const dayEl = document.getElementById('casio-day');
      if (dayEl) dayEl.textContent = DAYS[now.getDay()];
      const dateEl = document.getElementById('casio-date');
      if (dateEl) dateEl.textContent = pad(now.getDate());
      const ampmEl = document.getElementById('casio-ampm');
      if (ampmEl) ampmEl.textContent = h >= 12 ? 'PM' : 'AM';
      const srEl = document.getElementById('casio-sr-time');
      if (srEl) srEl.textContent = `Il est ${pad(h12)} heures ${pad(m)}`;
    }
  };

  const init = () => {
    tickCasio();
    setI(tickCasio, 1000);
    window.addEventListener('beforeunload', cleanup);
  };

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();

// =============================================
//  INIT
// =============================================
const tbody = document.getElementById('flight-body');
renderFlightBoard(tbody, DATA);

tbody.addEventListener('click', e => {
  const row = e.target.closest('tr[data-href]');
  if (row) window.location.href = row.dataset.href;
});



window.addEventListener('load', () => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReduced) {
    animateFlaps();
    startStatusLife();
    startTimeLife();
    startGateLife();
  }

  initRowInteractions(); // ⚠️ EN DEHORS du if ! (comme ici)
  initTerminalSystem();
});

