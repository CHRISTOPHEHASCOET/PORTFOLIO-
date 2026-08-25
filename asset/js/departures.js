const opsModules = [...document.querySelectorAll(".ops-module")];
const opsProgress = document.getElementById("ops-progress");
const opsCount = document.getElementById("ops-count");
const opsHelp = document.getElementById("ops-help");
const opsClearance = document.getElementById("ops-clearance");
const opsFastTrack = document.getElementById("ops-fast-track");
const opsFilters = [...document.querySelectorAll(".ops-filter")];
const opsModeLabel = document.querySelector("[data-ops-current-mode]");

if (opsModules.length) {
  opsProgress.max = opsModules.length;

  const lockModule = (module) => {
    const button = module.querySelector(".ops-module__action");
    const state = module.querySelector("[data-state]");

    module.classList.add("is-locked");
    module.classList.remove("is-unlocked");

    if (!module.classList.contains("is-done")) {
      button.disabled = true;
      state.textContent = "LOCKED";
    }
  };

  const unlockModule = (module) => {
    const button = module.querySelector(".ops-module__action");
    const state = module.querySelector("[data-state]");

    module.classList.remove("is-locked");
    module.classList.add("is-unlocked");

    if (!module.classList.contains("is-done")) {
      button.disabled = false;
      state.textContent = "READY";
    }
  };

  const refreshProgress = (scrollFinal = false) => {
    const done = opsModules.filter((module) =>
      module.classList.contains("is-done")
    ).length;

    opsProgress.value = done;
    opsCount.textContent = `${done} / ${opsModules.length} canaux validés`;

    if (done > 0 && opsHelp) {
      opsHelp.hidden = true;
    }

    if (done === opsModules.length) {
      opsClearance.hidden = false;

      if (opsFastTrack) {
        opsFastTrack.textContent = "Analyse complète";
        opsFastTrack.disabled = true;
      }

      if (scrollFinal) {
        opsClearance.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  const validateModule = (module, options = {}) => {
    const { scrollFinal = true } = options;

    if (!module.classList.contains("is-unlocked")) return;

    const button = module.querySelector(".ops-module__action");
    const panel = module.querySelector(".ops-module__panel");
    const state = module.querySelector("[data-state]");

    if (module.classList.contains("is-done")) {
      const isOpen = button.getAttribute("aria-expanded") === "true";

      button.setAttribute("aria-expanded", String(!isOpen));
      panel.hidden = isOpen;

      return;
    }

    module.classList.add("is-done");
    module.classList.remove("is-locked");
    module.classList.add("is-unlocked");

    state.textContent = "VALIDATED";
    panel.hidden = false;

    button.disabled = false;
    button.textContent = "Rapport validé — afficher / masquer";
    button.setAttribute("aria-expanded", "true");

    const index = opsModules.indexOf(module);
    const nextModule = opsModules[index + 1];

    if (nextModule) {
      unlockModule(nextModule);
    }

    refreshProgress(scrollFinal);
  };

  // Initialisation
  opsModules.forEach((module, index) => {
    if (index === 0) {
      unlockModule(module);
    } else {
      lockModule(module);
    }
  });

  // Clic sur les modules
  opsModules.forEach((module) => {
    const button = module.querySelector(".ops-module__action");

    button.addEventListener("click", () => {
      validateModule(module);
    });
  });

  // Fast Track
  if (opsFastTrack) {
    opsFastTrack.addEventListener("click", () => {
      opsModules.forEach((module) => {
        unlockModule(module);
        validateModule(module, { scrollFinal: false });
      });

      refreshProgress(true);
    });
  }

  // Filtres Arrivées / Départs
  const applyFilter = (filter, label) => {
    opsModules.forEach((module) => {
      const mode = module.dataset.mode;
      module.hidden = filter !== "all" && mode !== filter;
    });

    if (opsModeLabel) {
      opsModeLabel.textContent = label;
    }
  };

  opsFilters.forEach((filterButton) => {
    filterButton.addEventListener("click", () => {
      const filter = filterButton.dataset.filter;
      const label = filterButton.dataset.label;

      opsFilters.forEach((button) => {
        button.classList.remove("is-active");
        button.setAttribute("aria-selected", "false");
      });

      filterButton.classList.add("is-active");
      filterButton.setAttribute("aria-selected", "true");

      applyFilter(filter, label);
    });
  });

  refreshProgress();
}