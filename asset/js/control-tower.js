(() => {
  "use strict";


  /* =========================================================
     DOM
     ========================================================= */

  const root =
    document.querySelector(".tower");

  if (!root) return;


  const $ = (
    selector,
    context = root
  ) => context.querySelector(selector);


  const $$ = (
    selector,
    context = root
  ) => Array.from(
    context.querySelectorAll(selector)
  );


  const DOM = {
    globalStatus:
      $("[data-atc-global-status]"),

    target:
      $("[data-radar-target]"),

    radarCallsign:
      $("[data-radar-callsign]"),

    radarMessageTitle:
      $("[data-radar-message-title]"),

    radarMessage:
      $("[data-radar-message]"),

    identify:
      $("[data-identify]"),

    contactStatus:
      $("[data-contact-status]"),

    contactCallsign:
      $("[data-contact-callsign]"),

    contactType:
      $("[data-contact-type]"),

    contactOrigin:
      $("[data-contact-origin]"),

    contactDestination:
      $("[data-contact-destination]"),

    contactTransponder:
      $("[data-contact-transponder]"),

    contactSignal:
      $("[data-contact-signal]"),

    identificationSteps:
      $$("[data-ident-step]"),

    radio:
      $("[data-radio]"),

    radioStatus:
      $("[data-radio-status]"),

    establishContact:
      $("[data-establish-contact]"),

    atcMessage:
      $("[data-atc-message]"),

    clearance:
      $("[data-clearance]"),

    form:
      $("[data-clearance-form]"),

    message:
      $("#contact-message"),

    messageCounter:
      $("[data-message-counter]"),

    review:
      $("[data-clearance-review]"),

    reviewName:
      $("[data-review-name]"),

    reviewEmail:
      $("[data-review-email]"),

    reviewCompany:
      $("[data-review-company]"),

    reviewMission:
      $("[data-review-mission]"),

    reviewSubject:
      $("[data-review-subject]"),

    reviewPriority:
      $("[data-review-priority]"),

    reviewMessage:
      $("[data-review-message]"),

    edit:
      $("[data-edit-clearance]"),

    authorize:
      $("[data-authorize]"),

    transmission:
      $("[data-transmission]"),

    transmissionPercent:
      $("[data-transmission-percent]"),

    transmissionProgress:
      $("[data-transmission-progress]"),

    transmissionBar:
      $("[data-transmission-bar]"),

    transmissionSteps:
      $$("[data-transmission-step]"),

    final:
      $("[data-clearance-granted]"),

    finalId:
      $("[data-final-id]"),

    newTransmission:
      $("[data-new-transmission]"),

    live:
      $("[data-tower-live]")
  };


  const state = {
    identifying: false,
    identified: false,
    connected: false,
    transmitting: false
  };


  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );


  /* =========================================================
     HELPERS
     ========================================================= */

  function announce(message) {
    if (!DOM.live) return;

    DOM.live.textContent = "";

    requestAnimationFrame(() => {
      DOM.live.textContent = message;
    });
  }


  function delay(ms) {
    return new Promise(resolve => {
      window.setTimeout(
        resolve,
        reducedMotion.matches ? 0 : ms
      );
    });
  }


  function updateStep(
    step,
    status
  ) {
    if (!step) return;

    const icon =
      step.querySelector("span");


    step.classList.remove(
      "is-running",
      "is-complete"
    );


    if (status === "running") {
      step.classList.add(
        "is-running"
      );

      if (icon) {
        icon.textContent = "›";
      }

      return;
    }


    if (status === "complete") {
      step.classList.add(
        "is-complete"
      );

      if (icon) {
        icon.textContent = "✓";
      }

      return;
    }


    if (icon) {
      icon.textContent = "○";
    }
  }


  function show(element) {
    if (element) {
      element.hidden = false;
    }
  }


  function hide(element) {
    if (element) {
      element.hidden = true;
    }
  }


  /* =========================================================
     IDENTIFICATION
     ========================================================= */

  async function identifyAircraft() {
    if (
      state.identifying ||
      state.identified
    ) {
      return;
    }


    state.identifying = true;

    DOM.identify.disabled = true;

    DOM.contactStatus.textContent =
      "IDENTIFYING";

    DOM.globalStatus.value =
      "IDENTIFICATION";


    announce(
      "Identification du contact radar en cours."
    );


    for (
      let index = 0;
      index <
        DOM.identificationSteps.length;
      index++
    ) {
      const step =
        DOM.identificationSteps[index];

      updateStep(
        step,
        "running"
      );

      await delay(420);

      updateStep(
        step,
        "complete"
      );
    }


    state.identifying = false;
    state.identified = true;


    DOM.target.classList.add(
      "is-identified"
    );


    DOM.radarCallsign.textContent =
      "VISITOR-01";


    DOM.radarMessageTitle.textContent =
      "CONTACT IDENTIFIÉ";


    DOM.radarMessage.textContent =
      "Transpondeur vérifié. Plan de vol disponible.";


    DOM.contactStatus.textContent =
      "IDENTIFIED";


    DOM.contactCallsign.textContent =
      "VISITOR-01";

    DOM.contactType.textContent =
      "MISSION";

    DOM.contactOrigin.textContent =
      "PORTFOLIO";

    DOM.contactDestination.textContent =
      "CONTACT";

    DOM.contactTransponder.textContent =
      "7001";

    DOM.contactSignal.textContent =
      "92 %";


    DOM.identify.hidden =
      true;


    show(
      DOM.radio
    );


    DOM.globalStatus.value =
      "CONTACT IDENTIFIED";


    announce(
      "Contact identifié. VISITOR-01. Liaison radio disponible."
    );
  }


  DOM.identify?.addEventListener(
    "click",
    identifyAircraft
  );


  DOM.target?.addEventListener(
    "click",
    () => {
      if (!state.identified) {
        identifyAircraft();
      }
    }
  );


  /* =========================================================
     RADIO CONNECTION
     ========================================================= */

  async function establishRadio() {
    if (
      !state.identified ||
      state.connected
    ) {
      return;
    }


    DOM.establishContact.disabled =
      true;


    DOM.radioStatus.value =
      "CONNECTING";


    DOM.globalStatus.value =
      "RADIO LINK";


    await delay(700);


    state.connected =
      true;


    DOM.radioStatus.value =
      "CONTACT ESTABLISHED";


    DOM.contactStatus.textContent =
      "CONNECTED";


    DOM.globalStatus.value =
      "CHANNEL OPEN";


    DOM.establishContact.hidden =
      true;


    show(
      DOM.atcMessage
    );


    show(
      DOM.clearance
    );


    announce(
      "Contact radio établi. Vous pouvez transmettre votre demande."
    );


    DOM.form
      ?.querySelector("input")
      ?.focus({
        preventScroll: true
      });
  }


  DOM.establishContact
    ?.addEventListener(
      "click",
      establishRadio
    );


  /* =========================================================
     MESSAGE COUNTER
     ========================================================= */

  function updateMessageCounter() {
    if (
      !DOM.message ||
      !DOM.messageCounter
    ) {
      return;
    }


    DOM.messageCounter.value =
      `${DOM.message.value.length} / 1500`;
  }


  DOM.message?.addEventListener(
    "input",
    updateMessageCounter
  );


  updateMessageCounter();


  /* =========================================================
     FORM VALIDATION
     ========================================================= */

  function clearFieldErrors() {
    $$("[data-error-for]")
      .forEach(error => {
        error.textContent = "";
      });


    $$(
      "input[aria-invalid], textarea[aria-invalid]"
    ).forEach(field => {
      field.removeAttribute(
        "aria-invalid"
      );
    });
  }


  function setFieldError(
    field,
    message
  ) {
    if (!field) return;


    field.setAttribute(
      "aria-invalid",
      "true"
    );


    const error =
      $(
        `[data-error-for="${field.id}"]`
      );


    if (error) {
      error.textContent =
        message;
    }
  }


  function validateForm() {
    clearFieldErrors();


    const name =
      $("#contact-name");

    const email =
      $("#contact-email");

    const subject =
      $("#contact-subject");

    const message =
      $("#contact-message");

    const mission =
      $(
        'input[name="mission"]:checked'
      );


    let valid = true;


    if (
      !name.value.trim() ||
      name.value.trim().length < 2
    ) {
      setFieldError(
        name,
        "Indicatif requis."
      );

      valid = false;
    }


    if (!email.validity.valid) {
      setFieldError(
        email,
        "Adresse de retour invalide."
      );

      valid = false;
    }


    if (
      subject.value.trim().length < 3
    ) {
      setFieldError(
        subject,
        "Destination requise."
      );

      valid = false;
    }


    if (
      message.value.trim().length < 10
    ) {
      setFieldError(
        message,
        "Transmission trop courte."
      );

      valid = false;
    }


    if (!mission) {
      valid = false;

      announce(
        "Sélectionnez un type de mission."
      );
    }


    if (!valid) {
      const firstInvalid =
        $("[aria-invalid='true']");

      firstInvalid?.focus();

      return false;
    }


    return true;
  }


  /* =========================================================
     BUILD REVIEW
     ========================================================= */

  function getFormData() {
    const formData =
      new FormData(DOM.form);


    return {
      name:
        String(
          formData.get("name") || ""
        ).trim(),

      email:
        String(
          formData.get("email") || ""
        ).trim(),

      company:
        String(
          formData.get("company") || ""
        ).trim(),

      mission:
        String(
          formData.get("mission") || ""
        ),

      subject:
        String(
          formData.get("subject") || ""
        ).trim(),

      message:
        String(
          formData.get("message") || ""
        ).trim(),

      priority:
        String(
          formData.get("priority") ||
          "Standard"
        )
    };
  }


  function renderReview(data) {
    DOM.reviewName.textContent =
      data.name;

    DOM.reviewEmail.textContent =
      data.email;

    DOM.reviewCompany.textContent =
      data.company || "NON RENSEIGNÉ";

    DOM.reviewMission.textContent =
      data.mission;

    DOM.reviewSubject.textContent =
      data.subject;

    DOM.reviewPriority.textContent =
      data.priority;

    DOM.reviewMessage.textContent =
      data.message;
  }


  DOM.form?.addEventListener(
    "submit",
    event => {
      event.preventDefault();


      if (!validateForm()) {
        return;
      }


      const data =
        getFormData();


      renderReview(
        data
      );


      hide(
        DOM.clearance
      );


      show(
        DOM.review
      );


      DOM.globalStatus.value =
        "CLEARANCE REVIEW";


      DOM.review.scrollIntoView({
        behavior:
          reducedMotion.matches
            ? "auto"
            : "smooth",

        block:
          "nearest"
      });


      announce(
        "Transmission prête pour vérification."
      );
    }
  );


  /* =========================================================
     EDIT
     ========================================================= */

  DOM.edit?.addEventListener(
    "click",
    () => {
      hide(
        DOM.review
      );

      show(
        DOM.clearance
      );


      DOM.globalStatus.value =
        "CHANNEL OPEN";


      announce(
        "Modification de la transmission."
      );
    }
  );


  /* =========================================================
     TRANSMISSION
     ========================================================= */

  async function transmit() {
    if (
      state.transmitting
    ) {
      return;
    }


    state.transmitting =
      true;


    DOM.authorize.disabled =
      true;


    hide(
      DOM.review
    );


    show(
      DOM.transmission
    );


    DOM.globalStatus.value =
      "TRANSMITTING";


    const duration =
      reducedMotion.matches
        ? 80
        : 2200;


    const started =
      performance.now();


    await new Promise(resolve => {

      const frame =
        now => {

          const ratio =
            Math.min(
              (now - started) /
              duration,
              1
            );


          const percentage =
            Math.round(
              ratio * 100
            );


          DOM.transmissionPercent.textContent =
            `${percentage} %`;


          DOM.transmissionBar.style.width =
            `${percentage}%`;


          DOM.transmissionProgress.setAttribute(
            "aria-valuenow",
            String(percentage)
          );


          updateTransmissionSteps(
            percentage
          );


          if (ratio < 1) {
            requestAnimationFrame(
              frame
            );

            return;
          }


          resolve();
        };


      requestAnimationFrame(
        frame
      );
    });


    /*
     * Ici sera branché l'envoi HTTP réel.
     *
     * const result = await sendTransmission(getFormData());
     */


    await delay(250);


    state.transmitting =
      false;


    DOM.authorize.disabled =
      false;


    completeTransmission();
  }


  function updateTransmissionSteps(
    percentage
  ) {
    const size =
      100 /
      DOM.transmissionSteps.length;


    DOM.transmissionSteps.forEach(
      (step, index) => {
        const start =
          index * size;

        const end =
          (index + 1) * size;

        const icon =
          step.querySelector("span");


        const complete =
          percentage >= end;

        const running =
          percentage >= start &&
          percentage < end;


        step.classList.toggle(
          "is-complete",
          complete
        );

        step.classList.toggle(
          "is-running",
          running
        );


        if (!icon) return;


        icon.textContent =
          complete
            ? "✓"
            : running
              ? "›"
              : "○";
      }
    );
  }


  DOM.authorize?.addEventListener(
    "click",
    transmit
  );


  /* =========================================================
     COMPLETE
     ========================================================= */

  function createTransmissionId() {
    const now =
      new Date();


    return (
      "TWR-" +
      String(
        now.getHours()
      ).padStart(2, "0") +
      String(
        now.getMinutes()
      ).padStart(2, "0") +
      String(
        now.getSeconds()
      ).padStart(2, "0")
    );
  }


  function completeTransmission() {
    hide(
      DOM.transmission
    );


    show(
      DOM.final
    );


    DOM.finalId.textContent =
      createTransmissionId();


    DOM.globalStatus.value =
      "CLEARANCE GRANTED";


    announce(
      "Transmission terminée. Clearance accordée."
    );


    DOM.final.scrollIntoView({
      behavior:
        reducedMotion.matches
          ? "auto"
          : "smooth",

      block:
        "nearest"
    });
  }


  /* =========================================================
     RESET
     ========================================================= */

  function resetTower() {
    state.identifying =
      false;

    state.identified =
      false;

    state.connected =
      false;

    state.transmitting =
      false;


    DOM.form?.reset();


    updateMessageCounter();


    clearFieldErrors();


    hide(DOM.radio);
    hide(DOM.atcMessage);
    hide(DOM.clearance);
    hide(DOM.review);
    hide(DOM.transmission);
    hide(DOM.final);


    DOM.identify.hidden =
      false;

    DOM.identify.disabled =
      false;


    DOM.establishContact.hidden =
      false;

    DOM.establishContact.disabled =
      false;


    DOM.authorize.disabled =
      false;


    DOM.target.classList.remove(
      "is-identified"
    );


    DOM.radarCallsign.textContent =
      "UNKNOWN";


    DOM.radarMessageTitle.textContent =
      "CONTACT DÉTECTÉ";


    DOM.radarMessage.textContent =
      "Transpondeur non identifié dans le secteur d'approche.";


    DOM.contactStatus.textContent =
      "PENDING";


    DOM.contactCallsign.textContent =
      "UNKNOWN";

    DOM.contactType.textContent =
      "---";

    DOM.contactOrigin.textContent =
      "---";

    DOM.contactDestination.textContent =
      "---";

    DOM.contactTransponder.textContent =
      "---";

    DOM.contactSignal.textContent =
      "---";


    DOM.radioStatus.value =
      "STANDBY";


    DOM.identificationSteps.forEach(
      step => {
        updateStep(
          step,
          "idle"
        );
      }
    );


    DOM.transmissionSteps.forEach(
      step => {
        updateStep(
          step,
          "idle"
        );
      }
    );


    DOM.transmissionPercent.textContent =
      "0 %";


    DOM.transmissionBar.style.width =
      "0%";


    DOM.transmissionProgress.setAttribute(
      "aria-valuenow",
      "0"
    );


    DOM.globalStatus.value =
      "MONITORING";


    announce(
      "Tour réinitialisée. Surveillance du secteur."
    );
  }


  DOM.newTransmission
    ?.addEventListener(
      "click",
      resetTower
    );

})();