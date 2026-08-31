// const CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.''-";
const CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.:'-";
const NBSP = "\u00A0";
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

/* =========================================================
   MOTEUR SOLARI — un flap tourne lettre par lettre
   ========================================================= */

function flipToChar(flap, finalChar, onDone) {

  // Nettoyage : si ce flap tournait déjà, on l'arrête
  if (flap._solariTimer) {
    clearInterval(flap._solariTimer);
  }

  // Position de départ = lettre actuelle du flap
  const current = flap.textContent === "\u00A0" ? " " : flap.textContent;
  let index = CHARS.indexOf(current);
  if (index === -1) index = 0;

  const targetIndex = CHARS.indexOf(finalChar);

  // Si la lettre finale n'existe pas ou est déjà bonne, on stoppe
  if (targetIndex === -1 || index === targetIndex) {
    flap.textContent = finalChar === " " ? "\u00A0" : finalChar;
    if (onDone) onDone();
    return;
  }

  flap._solariTimer = setInterval(() => {

    // On avance d'UNE lettre dans le rouleau
    index = (index + 1) % CHARS.length;
    const char = CHARS[index];
    flap.textContent = char === " " ? "\u00A0" : char;

    // Petit basculement mécanique
    gsap.fromTo(
      flap,
      { rotationX: -90 },
      { rotationX: 0, duration: 0.14, ease: "power1.out" }
    );

    // Arrivé à la bonne lettre → STOP net
    if (index === targetIndex) {
      clearInterval(flap._solariTimer);
      flap._solariTimer = null;
      if (onDone) onDone();
    }

  }, 55); // vitesse du rouleau (plus petit = plus rapide)
}

/* =========================================================
   Anime un mot entier en cascade (gauche → droite)
   ========================================================= */

function flipWord(wordElement) {

  const flaps = wordElement.querySelectorAll(".flap");

  flaps.forEach((flap, i) => {

    const finalChar = flap.dataset.char;

    // Chaque flap démarre légèrement après le précédent
    setTimeout(() => {
      flipToChar(flap, finalChar);
    }, i * 70); // décalage en cascade (augmente = plus lent)

  });
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
  statusCell.classList.add(
    'col-statut',
    'status',
    getStatusClass(row.s)
  );

  statusCell.appendChild(createWord(row.s, 12));

  tr.appendChild(statusCell);

  return tr;
}

function renderFlightBoard(tbody, flights) {

  tbody.textContent = "";

  flights.forEach(row => {
    tbody.appendChild(createFlightRow(row));
  });

}

// Cette fonction est réutilisable.
// Elle servira également pour les futurs tableaux
// "Départs" et "Arrivées" de l'Operation Center.

const tbody = document.getElementById('flight-body');

renderFlightBoard(tbody, DATA);

tbody.addEventListener('click', e => {
  const row = e.target.closest('tr[data-href]');
  if (row) window.location.href = row.dataset.href;
});

// function animateFlap(flap) {

//   const finalChar = flap.dataset.char;

//   if (finalChar === " ") return;

//   const delay = Math.random() * 900;
//   const flips = 10 + Math.floor(Math.random() * 8);

//   setTimeout(() => {

//     let count = 0;

//     const interval = setInterval(() => {

//       flap.textContent =
//         CHARS[Math.floor(Math.random() * CHARS.length)];

//       gsap.fromTo(
//         flap,
//         { rotationX: -90 },
//         {
//           rotationX: 0,
//           duration: 0.25,
//           ease: "power2.out"
//         }
//       );

//       if (++count >= flips) {

//         clearInterval(interval);

//         flap.textContent = finalChar;

//         gsap.fromTo(
//           flap,
//           { rotationX: -60 },
//           {
//             rotationX: 0,
//             duration: 0.35,
//             ease: "back.out(1.7)"
//           }
//         );

//       }

//     }, 120 + Math.random() * 40);

//   }, delay);

// }

// function animateFlaps() {
//   document.querySelectorAll('.flap').forEach((flap) => {
//     const finalChar = flap.dataset.char;
//     if (finalChar === " ") return;
//     const delay = Math.random() * 900;
//     const flips = 10 + Math.floor(Math.random() * 8);
//     setTimeout(() => {
//       let count = 0;
//       const interval = setInterval(() => {
//         flap.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
//         gsap.fromTo(flap, { rotationX: -90 }, { rotationX: 0, duration: 0.25, ease: "power2.out" });
//         if (++count >= flips) {
//           clearInterval(interval);
//           flap.textContent = finalChar;
//           gsap.fromTo(flap, { rotationX: -60 }, { rotationX: 0, duration: 0.35, ease: "back.out(1.7)" });
//         }
//       }, 120 + Math.random() * 40);
//     }, delay);
//   });
// }

// function animateFlaps() {
//   document.querySelectorAll(".word").forEach(flipWord);
// }

// function animateFlaps() {

//   document
//     .querySelectorAll(".flap")
//     .forEach(animateFlap);

// }


// function updateStatusCell(statutCell, newStatus) {

//   const oldStatusClasses = [...statutCell.classList]
//     .filter(cls => cls.startsWith("status-"));

//   statutCell.classList.remove(...oldStatusClasses);

//   statutCell.classList.add(
//     "status",
//     getStatusClass(newStatus)
//   );

//   statutCell.replaceChildren(
//     createWord(newStatus, 12)
//   );

//   statutCell.querySelectorAll(".flap").forEach(flap => {

//     let count = 0;
//     const max = 8 + Math.random() * 6;
//     const finalChar = flap.dataset.char;

//     const interval = setInterval(() => {

//       flap.textContent =
//         CHARS[Math.floor(Math.random() * CHARS.length)];

//       gsap.fromTo(
//         flap,
//         { rotationX: -70 },
//         { rotationX: 0, duration: 0.2 }
//       );

//       if (++count >= max) {

//         clearInterval(interval);

//         flap.textContent = finalChar;

//       }

//     }, 120);

//   });

// }

function updateStatusCell(statutCell, newStatus) {

  // Mise à jour des couleurs du statut
  const oldStatusClasses = [...statutCell.classList]
    .filter(cls => cls.startsWith("status-"));

  statutCell.classList.remove(...oldStatusClasses);
  statutCell.classList.add("status", getStatusClass(newStatus));

  // On garde les flaps EXISTANTS (pas de recréation)
  const word = statutCell.querySelector(".word");
  if (!word) return;

  const flaps = word.querySelectorAll(".flap");
  const padded = (newStatus + "").padEnd(flaps.length, " ");

  flaps.forEach((flap, i) => {
    const finalChar = padded[i] ?? " ";
    flap.dataset.char = finalChar;   // on met à jour la cible

    // Cascade Solari
    setTimeout(() => {
      flipToChar(flap, finalChar);
    }, i * 70);
  });
}


function scheduleStatusUpdates() {

  const rows = document.querySelectorAll('#flight-body tr');

  DATA.forEach((rowData, index) => {

    if (!rowData.nextStatus) return;

    const tr = rows[index];
    const statutCell = tr.querySelector('.col-statut');

    setTimeout(() => {

      updateStatusCell(statutCell, rowData.nextStatus);

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

