(() => {
  "use strict";

  const initOperationCenter = () => {
    const root = document.querySelector("[data-ops-root]");
    if (!root) return;

    const cards = [...root.querySelectorAll("[data-ops-card]")]
      .sort((a, b) => Number(a.dataset.channel) - Number(b.dataset.channel));

    if (!cards.length) {
      console.warn("Operation Center : aucune carte [data-ops-card] trouvée.");
      return;
    }

    const sequenceItems = [...root.querySelectorAll("[data-ops-sequence]")];

    const countOutput = root.querySelector("[data-ops-count]");
    const statusOutput = root.querySelector("[data-ops-status]");
    const instruction = root.querySelector("[data-ops-instruction]");
    const finalPanel = root.querySelector("[data-ops-final]");
    const fastButton = root.querySelector("[data-ops-fast]");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const controlledChannels = new Set();
    const phaseProgress = new Map();

    cards.forEach((card) => {
      phaseProgress.set(Number(card.dataset.channel), 0);
    });

    const getChannel = (card) => Number(card.dataset.channel);

    const getTrigger = (card) => card.querySelector("[data-ops-trigger]");

    const getBody = (card) => {
      const trigger = getTrigger(card);
      const id = trigger?.getAttribute("aria-controls");
      return id ? document.getElementById(id) : null;
    };

    const getState = (card) => card.querySelector("[data-ops-state]");
    const getCta = (card) => card.querySelector("[data-ops-cta]");
    const getConfirm = (card) => card.querySelector("[data-ops-confirm]");
    const getLive = (card) => card.querySelector("[data-ops-live]");
    const getPhases = (card) => [...card.querySelectorAll("[data-ops-phase]")];
    const getLights = (card) => [...card.querySelectorAll("[data-ops-light]")];

    const getTitle = (card) => {
      return card.querySelector("h3")?.textContent.trim() || `Canal ${getChannel(card)}`;
    };

    const getProgress = (card) => {
      return phaseProgress.get(getChannel(card)) || 0;
    };

    const setProgress = (card, value) => {
      phaseProgress.set(getChannel(card), value);
    };

    const getFirstPendingIndex = () => {
      return cards.findIndex((card) => !controlledChannels.has(getChannel(card)));
    };

    const isControlled = (card) => {
      return controlledChannels.has(getChannel(card));
    };

    const isCurrent = (card) => {
      return cards.indexOf(card) === getFirstPendingIndex();
    };

    const isLocked = (card) => {
      return !isControlled(card) && !isCurrent(card);
    };

    const isOpen = (card) => {
      return getTrigger(card)?.getAttribute("aria-expanded") === "true";
    };

    const isReady = (card) => {
      return getProgress(card) >= getPhases(card).length;
    };

    const setOpenItem = (card, open) => {
      const item = card.closest(".ops-grid__item");
      if (item) item.classList.toggle("is-open-item", open);
    };

    const closeCard = (card) => {
      const body = getBody(card);
      const trigger = getTrigger(card);

      if (body) body.hidden = true;
      if (trigger) trigger.setAttribute("aria-expanded", "false");

      card.classList.remove("is-open", "is-ready");
      setOpenItem(card, false);
    };

    const closeOtherCards = (activeCard) => {
      cards.forEach((card) => {
        if (card !== activeCard) closeCard(card);
      });
    };

    const openCard = (card) => {
      const body = getBody(card);
      const trigger = getTrigger(card);

      closeOtherCards(card);

      if (body) body.hidden = false;
      if (trigger) trigger.setAttribute("aria-expanded", "true");

      card.classList.add("is-open");
      setOpenItem(card, true);
    };

    const updateCardVisuals = (card) => {
      const controlled = isControlled(card);
      const current = isCurrent(card);
      const locked = isLocked(card);
      const open = isOpen(card);
      const ready = isReady(card);

      const phases = getPhases(card);
      const lights = getLights(card);
      const progress = getProgress(card);
      const maxPhases = phases.length || 1;

      const trigger = getTrigger(card);
      const state = getState(card);
      const cta = getCta(card);
      const confirm = getConfirm(card);

      card.classList.toggle("is-controlled", controlled);
      card.classList.toggle("is-current", current);
      card.classList.toggle("is-locked", locked);
      card.classList.toggle("is-ready", current && open && ready && !controlled);

      if (trigger) {
        trigger.disabled = false;
        trigger.setAttribute("aria-disabled", String(locked));
      }

      if (state && cta) {
        if (controlled) {
          state.textContent = "Contrôlé ✓";
          cta.textContent = open ? "Refermer le rapport" : "Relire le rapport";
        } else if (locked) {
          state.textContent = "Verrouillé";
          cta.textContent = "Canal verrouillé";
        } else if (open && ready) {
          state.textContent = "Prêt à valider";
          cta.textContent = "Refermer le rapport";
        } else if (open) {
          state.textContent = "Contrôle en cours";
          cta.textContent = "Refermer le rapport";
        } else {
          state.textContent = "Prêt";
          cta.textContent = "Ouvrir le rapport";
        }
      }

      phases.forEach((phase, index) => {
        const done = controlled || index < progress;
        const active =
          !controlled &&
          current &&
          open &&
          index === progress &&
          progress < phases.length;

        phase.classList.toggle("is-done", done);
        phase.classList.toggle("is-active", active);
      });

      const litCount = controlled
        ? lights.length
        : Math.ceil((progress / maxPhases) * lights.length);

      lights.forEach((light, index) => {
        light.classList.toggle("is-lit", index < litCount);
      });

      if (!confirm) return;

      if (controlled) {
        confirm.hidden = true;
        confirm.disabled = true;
        confirm.classList.remove("is-final");
        confirm.textContent = "Canal contrôlé";
        return;
      }

      if (!current) {
        confirm.hidden = true;
        confirm.disabled = true;
        confirm.classList.remove("is-final");
        confirm.textContent = "Canal verrouillé";
        return;
      }

      confirm.hidden = false;
      confirm.disabled = !open;

      if (ready) {
        confirm.classList.add("is-final");
        confirm.textContent = "Valider le canal";
        return;
      }

      const phaseLabel = phases[progress]?.textContent.trim() || "contrôle";
      confirm.classList.remove("is-final");
      confirm.textContent = `Valider : ${phaseLabel}`;
    };

    const updateSequence = () => {
      const currentIndex = getFirstPendingIndex();

      sequenceItems.forEach((item) => {
        const channel = Number(item.dataset.opsSequence);
        const itemIndex = channel - 1;
        const current = itemIndex === currentIndex;

        item.classList.toggle("is-done", controlledChannels.has(channel));
        item.classList.toggle("is-current", current);

        if (current) {
          item.setAttribute("aria-current", "step");
        } else {
          item.removeAttribute("aria-current");
        }
      });
    };

    const updateStatus = () => {
      const done = controlledChannels.size;
      const total = cards.length;
      const complete = done === total;
      const currentIndex = getFirstPendingIndex();

      if (countOutput) {
        countOutput.textContent = `${done} / ${total} canaux`;
      }

      if (complete) {
        if (statusOutput) {
          statusOutput.textContent = "Autorisé";
          statusOutput.classList.add("is-complete");
        }

        if (instruction) {
          instruction.textContent =
            "Tous les canaux sont contrôlés. Autorisation opérationnelle accordée.";
        }

        if (finalPanel) {
          finalPanel.hidden = false;
        }

        if (fastButton) {
          fastButton.disabled = true;
          fastButton.textContent = "Inspection complète";
        }

        return;
      }

      if (statusOutput) {
        statusOutput.textContent = "En cours";
        statusOutput.classList.remove("is-complete");
      }

      if (finalPanel) {
        finalPanel.hidden = true;
      }

      if (fastButton) {
        fastButton.disabled = false;
        fastButton.textContent = "Mode recruteur";
      }

      const currentCard = cards[currentIndex];
      if (!currentCard || !instruction) return;

      const title = getTitle(currentCard);
      const open = isOpen(currentCard);
      const ready = isReady(currentCard);
      const phases = getPhases(currentCard);
      const progress = getProgress(currentCard);

      if (open && ready) {
        instruction.textContent =
          `Canal prêt : ${title}. Validez le canal pour débloquer le contrôle suivant.`;
        return;
      }

      if (open) {
        const phaseLabel = phases[progress]?.textContent.trim() || "contrôle";

        instruction.textContent =
          `Rapport ouvert : ${title}. Validez "${phaseLabel}" quand vous êtes prêt.`;
        return;
      }

      instruction.textContent =
        `Canal actif : ${title}. Ouvrez le rapport pour consulter les compétences.`;
    };

    const refresh = () => {
      updateSequence();
      cards.forEach(updateCardVisuals);
      updateStatus();
    };

    const announce = (card, message) => {
      const live = getLive(card);
      if (live) live.textContent = message;
    };

    const denyLockedCard = (card) => {
      card.classList.add("is-denied");

      if (instruction) {
        instruction.textContent =
          "Canal verrouillé : contrôlez d’abord le canal actif avant de poursuivre.";
      }

      window.setTimeout(() => {
        card.classList.remove("is-denied");
        updateStatus();
      }, reduceMotion ? 120 : 600);
    };

    const toggleControlledCard = (card) => {
      if (isOpen(card)) {
        closeCard(card);
        refresh();
        return;
      }

      openCard(card);
      setProgress(card, getPhases(card).length);
      announce(card, "Rapport déjà contrôlé. Consultation disponible.");
      refresh();
    };

    const toggleCurrentCard = (card) => {
      if (isOpen(card)) {
        closeCard(card);
        refresh();
        return;
      }

      openCard(card);

      if (getProgress(card) === 0) {
        announce(card, "Rapport ouvert. Lisez le contenu, puis validez les contrôles à votre rythme.");
      } else if (isReady(card)) {
        announce(card, "Tous les contrôles sont validés. Vous pouvez valider le canal.");
      } else {
        announce(card, "Rapport rouvert. Continuez la procédure de contrôle.");
      }

      refresh();
    };

    const validateNextStep = (card) => {
      if (isLocked(card)) {
        denyLockedCard(card);
        return;
      }

      if (isControlled(card) || !isCurrent(card)) return;

      if (!isOpen(card)) {
        openCard(card);
        refresh();
        return;
      }

      const phases = getPhases(card);
      const progress = getProgress(card);

      if (progress < phases.length) {
        const phase = phases[progress];
        const message =
          phase.dataset.message ||
          `Contrôle validé : ${phase.textContent.trim()}.`;

        setProgress(card, progress + 1);
        announce(card, message);
        refresh();
        return;
      }

      validateChannel(card);
    };

    const validateChannel = (card) => {
      const channel = getChannel(card);

      controlledChannels.add(channel);
      setProgress(card, getPhases(card).length);
      announce(card, "Canal validé. Le contrôle suivant est disponible.");

      refresh();

      window.setTimeout(() => {
        closeCard(card);
        refresh();

        const nextIndex = getFirstPendingIndex();
        const target = nextIndex >= 0 ? cards[nextIndex] : finalPanel;

        if (target) {
          target.scrollIntoView({
            behavior: reduceMotion ? "auto" : "smooth",
            block: "center",
          });
        }
      }, reduceMotion ? 100 : 420);
    };

    const handleTrigger = (card) => {
      if (isLocked(card)) {
        denyLockedCard(card);
        return;
      }

      if (isControlled(card)) {
        toggleControlledCard(card);
        return;
      }

      if (isCurrent(card)) {
        toggleCurrentCard(card);
      }
    };

    const enableRecruiterMode = () => {
      cards.forEach((card) => {
        controlledChannels.add(getChannel(card));
        setProgress(card, getPhases(card).length);
        closeCard(card);
      });

      refresh();

      if (finalPanel) {
        finalPanel.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "center",
        });
      }
    };

    const init = () => {
      root.classList.add("is-enhanced");

      cards.forEach((card) => {
        closeCard(card);
        setProgress(card, 0);

        const trigger = getTrigger(card);
        const confirm = getConfirm(card);

        trigger?.addEventListener("click", () => {
          handleTrigger(card);
        });

        confirm?.addEventListener("click", () => {
          validateNextStep(card);
        });
      });

      fastButton?.addEventListener("click", enableRecruiterMode);

      if (finalPanel) {
        finalPanel.hidden = true;
      }

      refresh();
    };

    init();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initOperationCenter);
  } else {
    initOperationCenter();
  }
})();