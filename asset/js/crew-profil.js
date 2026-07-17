/**
 * Crew Profile — Inspection Pré-Vol System
 * Progression séquentielle avec validation obligatoire
 * Sans persistance (recommence à chaque visite)
 */

const INSPECTION_STEPS = [
  {
    code: "01",
    zone: "Nez",
    label: "Cellule",
    title: "Inspection cellule",
    color: "var(--crew-cockpit)",
    paragraphs: [
      "Comme tout appareil avant son premier vol, mon parcours s'est construit progressivement.",
      "Chaque étape traversée a ajouté une pièce à la structure : de nouveaux repères, de nouvelles méthodes de travail et de nouvelles façons d'observer le monde qui m'entoure.",
      "Bien avant le numérique, cette base s'est façonnée au contact du terrain, des équipes et des expériences humaines qui continuent aujourd'hui d'influencer ma manière d'aborder chaque projet."
    ]
  },
  {
    code: "02",
    zone: "Aile droite",
    label: "Systèmes",
    title: "Vérification systèmes",
    color: "var(--crew-violet)",
    paragraphs: [
      "Aucun vol ne se déroule exactement comme prévu.",
      "Les changements de cap, les imprévus et les nouvelles situations font naturellement partie du voyage.",
      "Au fil du temps, ces expériences m'ont appris à m'adapter rapidement, à garder une direction claire et à avancer même lorsque les conditions évoluent."
    ]
  },
  {
    code: "03",
    zone: "Aile gauche",
    label: "Navigation",
    title: "Contrôle navigation",
    color: "var(--crew-green)",
    paragraphs: [
      "À un moment du parcours, l'horizon s'est déplacé vers le numérique.",
      "Non comme une rupture, mais comme une nouvelle destination.",
      "La curiosité est progressivement devenue un véritable système de navigation, guidant chaque apprentissage vers un univers où comprendre, concevoir et résoudre avancent dans la même direction."
    ]
  },
  {
    code: "04",
    zone: "Empennage",
    label: "Rapport",
    title: "Rapport opérationnel",
    color: "var(--crew-primary)",
    paragraphs: [
      "En observant l'ensemble du plan de vol, aucune étape ne paraît isolée.",
      "Chaque étape a préparé la suivante et chaque détour a enrichi l'itinéraire.",
      "Ce ne sont pas uniquement les destinations atteintes qui donnent du sens au voyage, mais tout ce qui a été appris entre le décollage et l'atterrissage."
    ]
  }
];

const STATUS_LABELS = {
  waiting: "EN ATTENTE D'INSPECTION",
  running: "INSPECTION EN COURS",
  conform: "CONFORMITÉ VALIDÉE",
  authorized: "AUTORISATION DE DÉPART DISPONIBLE"
};

class InspectionSystem {
  constructor() {
    this.root = document.querySelector("[data-inspection]");
    if (!this.root) return;

    this.panel = this.root.querySelector("[data-inspection-panel]");
    this.progressList = this.root.querySelector("[data-progress-list]");
    this.progressCount = this.root.querySelector("[data-progress-count]");
    this.progressBar = this.root.querySelector("[data-progress-bar]");
    this.globalStatus = this.root.querySelector("[data-global-status]");
    this.messageTitle = this.root.querySelector("[data-message-title]");
    this.messageBody = this.root.querySelector("[data-message-body]");
    this.messageExtra = this.root.querySelector("[data-message-extra]");
    this.startHint = this.root.querySelector("[data-start-hint]");
    this.live = this.root.querySelector("[data-inspection-live]");
    this.mapPoints = [...this.root.querySelectorAll("[data-map-step]")];
    this.dateElement = document.getElementById("inspection-date");

    this.current = 0;
    this.selected = null;
    this.validated = new Set();
    this.finalTimer = null;

    this.init();
  }

  init() {
    this.bindEvents();
    this.setTodayDate();
    this.render();
  }

  bindEvents() {
    this.root.addEventListener("click", (event) => this.handleClick(event));
    this.root.addEventListener("keydown", (event) => this.handleKeydown(event));
  }

  handleClick(event) {
    const mapButton = event.target.closest("[data-map-step]");

    if (mapButton) {
      const index = Number(mapButton.dataset.mapStep);
      this.selectPoint(index);
      return;
    }

    const validateButton = event.target.closest("[data-validate-current]");

    if (validateButton) {
      this.validateCurrent();
    }
  }

  handleKeydown(event) {
    if (event.key !== "Escape") return;

    this.current = 0;
    this.selected = null;
    this.validated.clear();

    this.render();
    this.announce("Inspection réinitialisée.");
  }

  setTodayDate() {
    if (!this.dateElement) return;

    const today = new Date();
    const iso = today.toISOString().slice(0, 10);

    this.dateElement.dateTime = iso;
    this.dateElement.title = new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "long"
    }).format(today);
  }

  escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  percent() {
    return Math.round((this.validated.size / INSPECTION_STEPS.length) * 100);
  }

  announce(message) {
    if (!this.live) return;

    this.live.textContent = "";

    requestAnimationFrame(() => {
      this.live.textContent = message;
    });
  }

  prefersReduced() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  hasGsap() {
    return typeof window.gsap !== "undefined";
  }

  animatePanel() {
    if (this.prefersReduced() || !this.hasGsap()) return;

    const child = this.panel.firstElementChild;
    if (!child) return;

    window.gsap.fromTo(
      child,
      {
        autoAlpha: 0,
        y: 12,
        scale: 0.992
      },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.32,
        ease: "power3.out"
      }
    );
  }

  render() {
    this.renderGlobalStatus();
    this.renderMessage();
    this.renderMap();
    this.renderProgressList();
    this.renderPanel();

    this.progressCount.textContent = `${this.validated.size} / ${INSPECTION_STEPS.length}`;
    this.progressBar.value = this.validated.size;
    this.progressBar.max = INSPECTION_STEPS.length;
  }

  renderGlobalStatus() {
    clearTimeout(this.finalTimer);

    if (this.validated.size === INSPECTION_STEPS.length) {
      this.globalStatus.textContent = STATUS_LABELS.conform;

      this.finalTimer = setTimeout(() => {
        this.globalStatus.textContent = STATUS_LABELS.authorized;

        if (this.hasGsap() && !this.prefersReduced()) {
          window.gsap.fromTo(
            this.globalStatus,
            { opacity: 0.35, y: -4 },
            { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
          );
        }
      }, 900);

      return;
    }

    if (this.selected !== null || this.validated.size > 0) {
      this.globalStatus.textContent = STATUS_LABELS.running;
      return;
    }

    this.globalStatus.textContent = STATUS_LABELS.waiting;
  }

  renderMessage() {
    if (this.validated.size === INSPECTION_STEPS.length) {
      this.messageTitle.textContent = "Inspection terminée.";
      this.messageBody.textContent = "4 / 4 points inspectés.";
      this.messageExtra.textContent = "Autorisation de départ disponible.";

      if (this.startHint) this.startHint.hidden = true;
      return;
    }

    if (this.selected !== null || this.validated.size > 0) {
      this.messageTitle.textContent = "Inspection en cours.";
      this.messageBody.textContent = `${this.validated.size} / ${INSPECTION_STEPS.length} points inspectés.`;
      this.messageExtra.textContent =
        this.selected !== null
          ? "Validez le contrôle affiché pour déverrouiller le point suivant."
          : "Sélectionnez le point suivant sur le plan appareil.";

      if (this.startHint) this.startHint.hidden = true;
      return;
    }

    this.messageTitle.textContent = "Inspection pré-vol initiée";
    this.messageBody.textContent =
      "Avant toute autorisation de départ, l'appareil doit faire l'objet d'une vérification complète.";
    this.messageExtra.textContent =
      "Chaque point d'inspection permet de découvrir un élément ayant contribué à la construction de sa trajectoire.";

    if (this.startHint) this.startHint.hidden = false;
  }

  renderMap() {
    this.mapPoints.forEach((point) => {
      const index = Number(point.dataset.mapStep);

      let state = "locked";

      if (this.validated.has(index)) {
        state = "validated";
      } else if (index === this.current && this.selected === index) {
        state = "selected";
      } else if (index === this.current) {
        state = "available";
      }

      point.dataset.state = state;

      const isInteractive = state === "available" || state === "selected";

      point.setAttribute("aria-disabled", String(!isInteractive));
      point.tabIndex = isInteractive ? 0 : -1;
    });
  }

  // renderProgressList() {
  //   this.progressList.innerHTML = INSPECTION_STEPS.map((step, index) => {
  //     let state = "locked";
  //     let label = "verrouillé";
  //     let currentAttr = "";

  //     if (this.validated.has(index)) {
  //       state = "validated";
  //       label = "validé";
  //     } else if (index === this.current && this.selected === index) {
  //       state = "selected";
  //       label = "en cours";
  //       currentAttr = ' aria-current="step"';
  //     } else if (index === this.current) {
  //       state = "available";
  //       label = "disponible";
  //       currentAttr = ' aria-current="step"';
  //     }

  //     return `
  //       <li
  //         data-state="${state}"
  //         style="--point-color: ${step.color};"
  //         aria-label="Inspection ${step.code}, ${step.label}, état : ${label}"
  //         ${currentAttr}
  //       >
  //         <span aria-hidden="true">${step.code}</span>
  //         <strong>${this.escapeHtml(step.label)}</strong>
  //       </li>
  //     `;
  //   }).join("");
  // }

  renderProgressList() {
  this.progressList.innerHTML = INSPECTION_STEPS.map((step, index) => {
    let state = "locked";
    let label = "verrouillé";
    let currentAttr = "";

    if (this.validated.has(index)) {
      state = "validated";
      label = "validé";
    } else if (index === this.current && this.selected === index) {
      state = "selected";
      label = "en cours";
      currentAttr = ' aria-current="step"';
    } else if (index === this.current) {
      state = "available";
      label = "disponible";
      currentAttr = ' aria-current="step"';
    }

    // Extraire le nom de la couleur depuis la variable CSS
    const colorName = step.color.replace("var(--crew-", "").replace(")", "");

    return `
      <li
        data-state="${state}"
        data-color="${colorName}"
        aria-label="Inspection ${step.code}, ${step.label}, état : ${label}"
        ${currentAttr}
      >
        <span aria-hidden="true">${step.code}</span>
        <strong>${this.escapeHtml(step.label)}</strong>
      </li>
    `;
  }).join("");
}

  renderPanel() {
    if (this.validated.size === INSPECTION_STEPS.length) {
      this.renderFinalPanel();
      return;
    }

    if (this.selected === null) {
      this.renderWaitingPanel();
      return;
    }

    this.renderStepPanel(INSPECTION_STEPS[this.selected]);
  }

  renderWaitingPanel() {
    const next = INSPECTION_STEPS[this.current];

    this.panel.innerHTML = `
      <section class="wait-panel">
        <div>
          <p class="wait-panel__kicker">Panneau d'attente</p>
          <h3>Statut inspection</h3>
        </div>

        <div class="wait-panel__grid">
          <ol class="wait-panel__status">
            ${INSPECTION_STEPS.map((step, index) => {
      if (this.validated.has(index)) {
        return `<li>✓ Inspection ${step.code} — ${this.escapeHtml(step.label)}</li>`;
      }

      if (index === this.current) {
        return `<li>▶ Inspection ${step.code} — ${this.escapeHtml(step.label)}</li>`;
      }

      return `<li>Inspection ${step.code} — ${this.escapeHtml(step.label)}</li>`;
    }).join("")}
          </ol>

          <div class="wait-panel__metrics">
            <div class="metric">
              <span>Conformité</span>
              <strong>${this.percent()} %</strong>
            </div>

            <p class="action-required">
              Action requise<br>
              ${next ? `Sélectionner le point ${next.code} — ${this.escapeHtml(next.zone)}` : "Inspection terminée"}
            </p>
          </div>
        </div>
      </section>
    `;

    this.animatePanel();
  }

  renderStepPanel(step) {
    this.panel.innerHTML = `
      <article class="step-card" style="--step-color: ${step.color};">
        <header class="step-card__header">
          <p class="step-card__number">${step.code}</p>

          <div>
            <p class="step-card__kicker">${this.escapeHtml(step.zone)}</p>
            <h3>${this.escapeHtml(step.title)}</h3>
          </div>
        </header>

        <div class="step-card__body">
          <section class="step-card__text" aria-label="Texte de présentation">
            ${step.paragraphs.map((paragraph) => `<p>${this.escapeHtml(paragraph)}</p>`).join("")}
          </section>

          <p class="step-card__validation">
            ✓ Inspection validée
          </p>
        </div>

        <footer class="step-card__footer">
          <button class="validate-button" type="button" data-validate-current>
            Valider l'inspection
          </button>
        </footer>
      </article>
    `;

    this.animatePanel();
  }

  renderFinalPanel() {
    this.panel.innerHTML = `
      <article class="final-card">
        <header class="final-card__header">
          <p class="final-card__kicker">Validation finale de l'inspection</p>
          <h3>Autorisation de départ accordée</h3>
        </header>

        <div class="final-card__message">
          <p><strong>L'inspection est terminée.</strong></p>

          <p>
            Chaque étape traversée a contribué à la construction du parcours.
            Les apprentissages et les adaptations successives ont préparé la suite du voyage.
          </p>

          <p>
            L'appareil est déclaré opérationnel pour ses prochaines destinations.
          </p>
        </div>

        <footer class="final-card__footer">
          <p class="final-card__status-label">Statut final</p>

          <p class="final-card__status">
            Appareil prêt au décollage
          </p>

          <p class="final-card__complete">
            ✓ Inspection complétée
          </p>

          <a class="final-card__link" href="./index.html">
            → Consulter le terminal
          </a>
        </footer>
      </article>
    `;

    this.animatePanel();

    requestAnimationFrame(() => {
      const link = this.panel.querySelector(".final-card__link");
      link?.focus({ preventScroll: false });
    });
  }

  selectPoint(index) {
    if (this.validated.size === INSPECTION_STEPS.length) return;

    if (this.validated.has(index)) {
      this.announce(`Le point ${index + 1} est déjà validé.`);
      return;
    }

    if (index !== this.current) {
      this.announce(`Le point ${index + 1} est verrouillé. Validez d'abord le point actif.`);
      return;
    }

    this.selected = index;
    this.render();

    requestAnimationFrame(() => {
      const button = this.panel.querySelector("[data-validate-current]");
      button?.focus({ preventScroll: false });
    });

    this.announce(`Point ${INSPECTION_STEPS[index].code} sélectionné. ${INSPECTION_STEPS[index].title}.`);
  }

  validateCurrent() {
    if (this.selected !== this.current) {
      this.announce("Sélectionnez le point actif avant de valider.");
      return;
    }

    this.validated.add(this.current);
    this.current += 1;
    this.selected = null;

    this.render();

    if (this.validated.size === INSPECTION_STEPS.length) {
      this.announce("Inspection complète. Autorisation de départ accordée.");
      return;
    }

    requestAnimationFrame(() => {
      const nextPoint = this.mapPoints[this.current];
      if (nextPoint) {
        nextPoint.focus({ preventScroll: false });
      }
    });

    this.announce(`${this.validated.size} sur ${INSPECTION_STEPS.length} points inspectés. Sélectionnez le point suivant.`);
  }
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  new InspectionSystem();
});