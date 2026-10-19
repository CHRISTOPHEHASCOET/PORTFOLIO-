

/* =========================================================
   TERMINAL ↔ DESTINATION MAPPING
   ========================================================= */

const TERMINAL_DESTINATION_TO_ZONE = Object.freeze({
  "TERMINAL": "terminal",
  "OPERATION CENTER": "departures",
  "CREW PROFILE": "crew-profile",
  "BOARDING GATE": "boarding-gate",
  "BLACK BOX": "black-box",
  "COCKPIT": "cockpit",
  "CONTROL TOWER": "control-tower"
});

/* =========================================================
   TERMINAL COLORS
   ========================================================= */

const TERMINAL_ZONE_COLORS = Object.freeze({
  terminal: "#3fb950",
  departures: "#00d2ff",
  "crew-profile": "#1f6fea",
  "boarding-gate": "#ff9500",
  "black-box": "#7c8aa6",
  cockpit: "#caa24f",
  "control-tower": "#4f7cff"
});

/* =========================================================
   DEFAULT GUIDE CONTENT
   ========================================================= */

const DEFAULT_TERMINAL_GUIDE = Object.freeze({
  color: "#00d2ff",

  title: "Réseau terminal",

  code: "Navigation disponible",

  body:
    "Survolez une porte ou une ligne du tableau pour débuter votre voyage."
});

/* =========================================================
   TERMINAL ZONE CONTENT
   ========================================================= */

const TERMINAL_ZONE_CONTENT = Object.freeze({

  terminal: {
    color: TERMINAL_ZONE_COLORS.terminal,

    title: "Terminal principal",

    code: "Accueil passager",

    body:
      "Briefing de mission et vue d’ensemble du parcours."
  },

  departures: {
    color: TERMINAL_ZONE_COLORS.departures,

    title: "Operation Center",

    code: "Centre des opérations",

    body:
      "Gestion des opérations, supervision et coordination des missions."
  },

  "crew-profile": {
    color: TERMINAL_ZONE_COLORS["crew-profile"],

    title: "Crew profile",

    code: "Dossier équipage",

    body:
      "Identité, rôle et trajectoire professionnelle du pilote."
  },

  "boarding-gate": {
    color: TERMINAL_ZONE_COLORS["boarding-gate"],

    title: "Boarding gate",

    code: "Projets embarqués",

    body:
      "Applications développées, architecture technique et démonstrations."
  },

  "black-box": {
    color: TERMINAL_ZONE_COLORS["black-box"],

    title: "Black box",

    code: "Analyse de vol",

    body:
      "Contraintes techniques, décisions d’implémentation et documentation."
  },

  cockpit: {
    color: TERMINAL_ZONE_COLORS.cockpit,

    title: "Cockpit",

    code: "Navigation carrière",

    body:
      "Expériences, formations et historique opérationnel."
  },

  "control-tower": {
    color: TERMINAL_ZONE_COLORS["control-tower"],

    title: "Control tower",

    code: "Canal communication",

    body:
      "Prise de contact directe et coordination extérieure."
  }

});

/* =========================================================
   TERMINAL STATE
   ========================================================= */

const TERMINAL_STATE = {
  activeZone: null,
  resetTimer: null,
  initialized: false
};

/* =========================================================
   DOM HELPERS
   ========================================================= */

function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

function qsa(selector, scope = document) {
  return [...scope.querySelectorAll(selector)];
}

/* =========================================================
   GUIDE ELEMENTS
   ========================================================= */

function getGuideElements() {

  return {
    title: qs("[data-guide-title]"),
    code: qs("[data-guide-code]"),
    body: qs("[data-guide-body]")
  };

}

/* =========================================================
   TERMINAL GUIDE UPDATE
   ========================================================= */

function updateTerminalGuide(content) {

  const { title, code, body } = getGuideElements();

  if (!title || !code || !body) {
    return;
  }

  title.textContent = content.title;
  code.textContent = content.code;
  body.textContent = content.body;

  document.documentElement.style.setProperty(
    "--terminal-active-color",
    content.color
  );

}

/* =========================================================
   DESTINATION → ZONE
   ========================================================= */

function getTerminalZoneFromDestination(destination) {

  if (typeof destination !== "string") {
    return null;
  }

  const normalizedDestination =
    destination.trim().toUpperCase();

  return (
    TERMINAL_DESTINATION_TO_ZONE[normalizedDestination] ||
    null
  );

}

/* =========================================================
   CLEAR ACTIVE STATES
   ========================================================= */

function clearTerminalActiveClasses() {

  qsa(".is-terminal-active").forEach((element) => {
    element.classList.remove("is-terminal-active");
  });

}

/* =========================================================
   SET ACTIVE ZONE
   ========================================================= */

function setTerminalActiveZone(zoneName) {

  const scene = qs("[data-terminal-scene]");

  if (!scene) {
    return;
  }

  const content = TERMINAL_ZONE_CONTENT[zoneName];

  if (!content) {
    return;
  }

  window.clearTimeout(TERMINAL_STATE.resetTimer);

  TERMINAL_STATE.activeZone = zoneName;

  scene.dataset.activeZone = zoneName;

  scene.classList.add("is-zone-active");

  clearTerminalActiveClasses();

  qsa(`[data-terminal-zone="${zoneName}"]`)
    .forEach((element) => {

      element.classList.add("is-terminal-active");

      element.style.setProperty(
        "--terminal-active-color",
        content.color
      );

    });

  updateTerminalGuide(content);

}

/* =========================================================
   RESET ACTIVE ZONE
   ========================================================= */

function resetTerminalActiveZone() {

  const scene = qs("[data-terminal-scene]");

  TERMINAL_STATE.activeZone = null;

  if (scene) {

    scene.classList.remove("is-zone-active");

    scene.removeAttribute("data-active-zone");

  }

  clearTerminalActiveClasses();

  updateTerminalGuide(DEFAULT_TERMINAL_GUIDE);

}

/* =========================================================
   FLIGHT TABLE HYDRATION
   ========================================================= */

function hydrateFlightRowsForTerminal() {

  const rows =
    qsa("#flight-body tr[data-flight]");

  rows.forEach((row) => {

    const flightId = row.dataset.flight;

    if (!flightId || !Array.isArray(DATA)) {
      return;
    }

    const flight =
      DATA.find((item) => item.v === flightId);

    if (!flight) {
      return;
    }

    const zoneName =
      getTerminalZoneFromDestination(flight.d);

    if (!zoneName) {
      return;
    }

    row.dataset.terminalZone = zoneName;

    row.style.setProperty(
      "--terminal-active-color",
      TERMINAL_ZONE_COLORS[zoneName]
    );

    row.setAttribute(
      "aria-label",
      `Accéder à ${flight.d}, porte ${flight.g}, vol ${flight.v}`
    );

  });

}

/* =========================================================
   POINTER INTERACTIONS
   ========================================================= */

function bindPointerInteractions() {

  const selector = `
    #flight-body tr[data-terminal-zone],
    .terminal-gate[data-terminal-zone]
  `;

  document.addEventListener("pointerover", (event) => {

    const target =
      event.target.closest(selector);

    if (!target) {
      return;
    }

    setTerminalActiveZone(
      target.dataset.terminalZone
    );

  });

  document.addEventListener("pointerout", (event) => {

    const target =
      event.target.closest(selector);

    if (!target) {
      return;
    }

    const relatedTarget =
      event.relatedTarget?.closest?.(selector);

    if (
      relatedTarget &&
      relatedTarget.dataset.terminalZone ===
      target.dataset.terminalZone
    ) {
      return;
    }

    TERMINAL_STATE.resetTimer =
      window.setTimeout(() => {

        resetTerminalActiveZone();

      }, 120);

  });

}

/* =========================================================
   FOCUS ACCESSIBILITY
   ========================================================= */

function bindFocusInteractions() {

  const selector = `
    #flight-body tr[data-terminal-zone],
    .terminal-gate[data-terminal-zone]
  `;

  document.addEventListener("focusin", (event) => {

    const target =
      event.target.closest(selector);

    if (!target) {
      return;
    }

    setTerminalActiveZone(
      target.dataset.terminalZone
    );

  });

  document.addEventListener("focusout", () => {

    TERMINAL_STATE.resetTimer =
      window.setTimeout(() => {

        resetTerminalActiveZone();

      }, 120);

  });

}

/* =========================================================
   KEYBOARD ACCESSIBILITY
   ========================================================= */

function bindKeyboardInteractions() {

  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

      resetTerminalActiveZone();

      return;
    }

    const row =
      event.target.closest(
        "#flight-body tr[data-href]"
      );

    if (!row) {
      return;
    }

    const isActivationKey =
      event.key === "Enter" ||
      event.key === " ";

    if (!isActivationKey) {
      return;
    }

    event.preventDefault();

    const href = row.dataset.href;

    if (
      typeof href === "string" &&
      href.trim() !== ""
    ) {
      window.location.href = href;
    }

  });

}

/* =========================================================
   TOUCH DEVICES
   ========================================================= */

function bindTouchInteractions() {

  const touchDevice =
    window.matchMedia("(hover: none), (pointer: coarse)");

  document.addEventListener("click", (event) => {

    if (!touchDevice.matches) {
      return;
    }

    const gate =
      event.target.closest(
        ".terminal-gate[data-terminal-zone]"
      );

    if (!gate) {
      return;
    }

    const zoneName =
      gate.dataset.terminalZone;

    if (
      TERMINAL_STATE.activeZone !== zoneName
    ) {

      event.preventDefault();

      setTerminalActiveZone(zoneName);

    }

  });

}

/* =========================================================
   INITIALIZATION
   ========================================================= */

function initTerminalSystem() {
  const scene =
    qs("[data-terminal-scene]");

  if (!scene) {
    return;
  }

  // Réappliquer l'hydratation permet de prendre en compte les lignes
  // que main.js construit après le premier événement DOMContentLoaded.
  hydrateFlightRowsForTerminal();

  if (TERMINAL_STATE.initialized) {
    return;
  }

  bindPointerInteractions();

  bindFocusInteractions();

  bindKeyboardInteractions();

  bindTouchInteractions();

  updateTerminalGuide(
    DEFAULT_TERMINAL_GUIDE
  );

  TERMINAL_STATE.initialized = true;

}

/* =========================================================
   START
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initTerminalSystem
);
