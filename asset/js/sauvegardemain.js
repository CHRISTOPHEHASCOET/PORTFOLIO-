const CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.''-";
const DATA = [
  { v: 'PT-987', d: 'TERMINAL', t: '06:45', g: 'A56', s: 'READY', nextStatus: "FINAL CALL", delay: 7000, c: '', href: 'index.html' },

  { v: 'PJ-251', d: 'OPERATION CENTER', t: '06:45', g: 'H12', s: 'BOARDING', nextStatus: "IN REVIEW", delay: 8000, c: '', href: 'departures.html' },

  { v: 'PK-365', d: 'CREW PROFILE', t: '08:00', g: 'P23', s: "AUTHORIZED", nextStatus: "READY", delay: 10000, c: '', href: 'crew-profil.html' },

  { v: 'PM-451', d: 'BOARDING GATE', t: '09:00', g: 'I17', s: "GATE OPEN", nextStatus: "CLEARANCE", delay: 9000, c: '', href: 'bording-gate.html' },

  { v: 'PN-658', d: 'BLACK BOX', t: '07:40', g: 'V36', s: "ARCHIVED", nextStatus: "ON TIME", delay: 8000, c: '', href: 'black-box.html' },

  { v: 'PR-854', d: 'COCKPIT', t: '09:00', g: 'C48', s: 'IN REVIEW', nextStatus: "AUTHORIZED", delay: 6000, c: '', href: 'cockpit.html' },

  { v: 'PV-000', d: 'CONTROL TOWER', t: '10:00', g: 'T00', s: "CLEARANCE", nextStatus: "GATE OPEN", delay: 4000, c: '', href: 'control-tower.html' }
];

// function getStatusClass(status) {
//   switch (status) {
//     case "READY":
//       return "status-ready";

//     case "GATE OPEN":
//       return "status-gate-open"; // Changé ici pour être unique

//     case "BOARDING":
//       return "status-boarding";

//     case "FINAL CALL":
//       return "status-final";

//     case "IN REVIEW":
//       return "status-review";

//     case "AUTHORIZED":
//       return "status-authorized";

//     case "CLEARANCE":
//       return "status-clearance";

//     case "ARCHIVED":
//       return "status-archived";

//     case "ON TIME":
//       return "status-ontime"; // On garde ceci

//     default:
//       return "";
//   }
// }

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

function createWord(text, length = 15) {
  const wordElement = document.createElement('div');
  wordElement.className = 'word';
  const safeText = text || "";
  for (let i = 0; i < length; i++) {
    const flap = document.createElement('span');
    flap.className = 'flap';
    const char = safeText[i] ?? " ";
    flap.dataset.char = char;
    flap.textContent = char === " " ? "\u00A0" : char;
    wordElement.appendChild(flap);
  }
  return wordElement;
}

const tbody = document.getElementById('flight-body');
DATA.forEach(row => {
  const tr = document.createElement('tr');
  tr.className = row.c;
  tr.dataset.href = row.href;
  tr.dataset.flight = row.v; // ← AJOUTE CECI (row.v = PK-365, PR-854, etc.)
  tr.setAttribute('role', 'button');
  tr.setAttribute('tabindex', '0');

  const volCell = document.createElement('td');
  volCell.appendChild(createWord(row.v, 7));
  tr.appendChild(volCell);

  const destCell = document.createElement('td');
  destCell.appendChild(createWord(row.d, 18));
  tr.appendChild(destCell);

  const timeCell = document.createElement('td');
  timeCell.appendChild(createWord(row.t || "--:--", 6));
  tr.appendChild(timeCell);

  const porteCell = document.createElement('td');
  porteCell.appendChild(createWord(row.g, 4));
  tr.appendChild(porteCell);

  const statutCell = document.createElement('td');
  statutCell.classList.add('col-statut', 'status', getStatusClass(row.s));
  statutCell.appendChild(createWord(row.s, 12));
  tr.appendChild(statutCell);

  tbody.appendChild(tr);
});


tbody.addEventListener('click', e => {
  const row = e.target.closest('tr[data-href]');
  if (row) window.location.href = row.dataset.href;
});

function animateFlaps() {
  document.querySelectorAll('.flap').forEach((flap) => {
    const finalChar = flap.dataset.char;
    if (finalChar === " ") return;
    const delay = Math.random() * 900;
    const flips = 10 + Math.floor(Math.random() * 8);
    setTimeout(() => {
      let count = 0;
      const interval = setInterval(() => {
        flap.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
        gsap.fromTo(flap, { rotationX: -90 }, { rotationX: 0, duration: 0.25, ease: "power2.out" });
        if (++count >= flips) {
          clearInterval(interval);
          flap.textContent = finalChar;
          gsap.fromTo(flap, { rotationX: -60 }, { rotationX: 0, duration: 0.35, ease: "back.out(1.7)" });
        }
      }, 120 + Math.random() * 40);
    }, delay);
  });
}


// Appelle cette fonction après la génération du tableau
// Dans ton window.addEventListener('load') existant, ajoute :
// window.addEventListener('load', () => {
//   const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
//   if (!prefersReduced) {
//     animateFlaps();
//     scheduleStatusUpdates();
//   }
//   // Ajoute cette ligne :
//   initTerminalLinks();
// });


function scheduleStatusUpdates() {
  const rows = document.querySelectorAll('#flight-body tr');
  DATA.forEach((rowData, index) => {
    if (!rowData.nextStatus) return;
    const tr = rows[index];
    const statutCell = tr.querySelector('.col-statut');

    setTimeout(() => {
      // --- CORRECTION ES6 ---
      // On récupère toutes les classes actuelles qui commencent par "status-" 
      // et on les retire proprement. Cela évite d'avoir plusieurs couleurs en même temps.
      const oldStatusClasses = [...statutCell.classList].filter(cls => cls.startsWith('status-'));
      statutCell.classList.remove(...oldStatusClasses);
      // -----------------------

      // On applique la nouvelle classe générée par ta fonction getStatusClass
      statutCell.classList.add('status', getStatusClass(rowData.nextStatus));

      // On remplace le texte avec l'animation des flaps (ton code original)
      statutCell.replaceChildren(createWord(rowData.nextStatus, 12));

      statutCell.querySelectorAll('.flap').forEach(flap => {
        let count = 0;
        const max = 8 + Math.random() * 6;
        const finalChar = flap.dataset.char;
        const interval = setInterval(() => {
          flap.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
          gsap.fromTo(flap, { rotationX: -70 }, { rotationX: 0, duration: 0.2 });
          if (++count >= max) {
            clearInterval(interval);
            flap.textContent = finalChar;
          }
        }, 120);
      });

      highlightRow(tr);
    }, rowData.delay);
  });
}


function highlightRow(tr) {
  tr.classList.add('row-light');
  setTimeout(() => { tr.classList.remove('row-light'); }, 1200);
}

// Casio clock
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

window.addEventListener('load', () => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReduced) {
    animateFlaps();
    scheduleStatusUpdates();
  }

  // AJOUTE CETTE LIGNE pour activer le système de lien
  initTerminalSystem();
});