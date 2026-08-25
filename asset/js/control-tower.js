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

    radarScope:
      $("[data-radar-scope]"),

    radarCallsign:
      $("[data-radar-callsign]"),

    radarFlight:
      $("[data-radar-flight]"),

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
     RADAR CONFIG
     ========================================================= */

  const visitorFlight =
    getVisitorFlight();

  const RADAR_SWEEP_SECONDS = 8;
  const RADAR_SPEED_PX_SEC = 2.2;
  const RADAR_HIT_WINDOW_DEG = 7;
  const RADAR_REFRESH_COOLDOWN_MS = 1700;


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
     RADAR HELPERS
     ========================================================= */

  function randomFrom(chars, length) {
    let result = "";

    for (let i = 0; i < length; i++) {
      result += chars[
        Math.floor(Math.random() * chars.length)
      ];
    }

    return result;
  }


  function getVisitorFlight() {
    const key =
      "tower-visitor-flight";

    const saved =
      sessionStorage.getItem(key);

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        sessionStorage.removeItem(key);
      }
    }

    const letters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const digits =
      "0123456789";

    const data = {
      callsign:
        `CH-${randomFrom(letters, 1)}${randomFrom(digits, 2)}${randomFrom(letters, 1)}`,
      squawk:
        String(
          1000 + Math.floor(Math.random() * 6777)
        ).padStart(4, "0")
    };

    sessionStorage.setItem(
      key,
      JSON.stringify(data)
    );

    return data;
  }


  function initVisitorFlight() {
    if (DOM.radarFlight) {
      DOM.radarFlight.textContent =
        `TRK ${visitorFlight.callsign}`;
    }

    if (DOM.target) {
      DOM.target.setAttribute(
        "aria-label",
        `Contact radar ${visitorFlight.callsign} détecté dans le secteur d'approche`
      );
    }
  }


  /* =========================================================
     RADAR PPI
     ========================================================= */

  function setupTowerRadar() {
    if (
      !DOM.radarScope ||
      !DOM.target
    ) {
      return;
    }

    const scope =
      DOM.radarScope;

    const target =
      DOM.target;

    const leader =
      $(".radar__leader", target);

    const label =
      $(".radar__target-data", target);

    const vector =
      $(".radar__vector", target);

    const tailDots =
      $$(".radar__taildot", target);

    if (
      !leader ||
      !label ||
      !vector ||
      !tailDots.length
    ) {
      return;
    }

    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    let radius = 0;

    const mainTrack = {
      x: 0.62,
      y: 0.32,
      vx: RADAR_SPEED_PX_SEC,
      vy: RADAR_SPEED_PX_SEC * 0.72,
      tail: [],
      coolUntil: 0
    };

    const ghostTracks = createGhostTracks(4);

    function createGhostTracks(count) {
      const labels = [
        "QF-204",
        "AZ-118",
        "TRK-774",
        "HX-208",
        "DL-53",
        "CN-412",
        "OP-901"
      ];

      return Array.from({ length: count }, (_, index) => {
        const ghost = document.createElement("span");
        ghost.className = "radar__ghost";

        const plot = document.createElement("span");
        plot.className = "radar__ghost-plot";

        const tail1 = document.createElement("span");
        tail1.className = "radar__ghost-tail radar__ghost-tail--1";

        const tail2 = document.createElement("span");
        tail2.className = "radar__ghost-tail radar__ghost-tail--2";

        const tail3 = document.createElement("span");
        tail3.className = "radar__ghost-tail radar__ghost-tail--3";

        const leader = document.createElement("span");
        leader.className = "radar__ghost-leader";

        const label = document.createElement("span");
        label.className = "radar__ghost-label";
        label.textContent = labels[index % labels.length];

        ghost.append(
          plot,
          tail1,
          tail2,
          tail3,
          leader,
          label
        );

        scope.appendChild(ghost);

        const angle =
          Math.random() * Math.PI * 2;

        const speed =
          1.2 + Math.random() * 1.1;

        return {
          el: ghost,
          plot,
          leader,
          label,
          tailDots: [tail1, tail2, tail3],
          x: 0.2 + Math.random() * 0.6,
          y: 0.2 + Math.random() * 0.6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          tail: [],
          coolUntil: 0
        };
      });
    }

    function refreshBounds() {
      const rect =
        scope.getBoundingClientRect();

      w = rect.width;
      h = rect.height;
      cx = w / 2;
      cy = h / 2;
      radius =
        Math.min(w, h) * 0.48;
    }

    function resetTail(track, size = 5) {
      track.tail = Array.from(
        { length: size },
        () => ({
          x: track.x,
          y: track.y
        })
      );
    }

    function clampToCircle(track) {
      const px = track.x * w;
      const py = track.y * h;
      const dx = px - cx;
      const dy = py - cy;
      const dist = Math.hypot(dx, dy);

      if (dist > radius) {
        const nx = dx / dist;
        const ny = dy / dist;

        track.x = (cx + nx * radius) / w;
        track.y = (cy + ny * radius) / h;

        const dot =
          track.vx * nx + track.vy * ny;

        track.vx =
          track.vx - 2 * dot * nx;

        track.vy =
          track.vy - 2 * dot * ny;
      }
    }

    function getAngleDeg(track) {
      const px = track.x * w;
      const py = track.y * h;
      const dx = px - cx;
      const dy = py - cy;

      let angle =
        Math.atan2(dy, dx) * 180 / Math.PI;

      if (angle < 0) {
        angle += 360;
      }

      return angle;
    }

    function getSweepAngleDeg(now) {
      const t =
        (now / 1000) % RADAR_SWEEP_SECONDS;

      return (
        (t / RADAR_SWEEP_SECONDS) * 360
      );
    }

    function isSweepHit(
      targetAngle,
      sweepAngle
    ) {
      let delta =
        Math.abs(targetAngle - sweepAngle);

      delta =
        Math.min(delta, 360 - delta);

      return delta <= RADAR_HIT_WINDOW_DEG;
    }

    function setMainLabelPosition() {
      const labelX =
        mainTrack.x > 0.56 ? -124 : 20;

      const labelY =
        mainTrack.y > 0.56 ? -18 : 12;

      label.style.left =
        `${labelX}px`;

      label.style.top =
        `${labelY}px`;

      const labelWidth =
        Math.max(label.offsetWidth, 92);

      const anchorX =
        labelX > 0
          ? labelX
          : labelX + labelWidth - 8;

      const anchorY =
        labelY;

      const length =
        Math.hypot(anchorX, anchorY);

      const angle =
        Math.atan2(anchorY, anchorX) * 180 / Math.PI;

      leader.style.left = "0px";
      leader.style.top = "0px";
      leader.style.width =
        `${Math.max(8, length - 6)}px`;
      leader.style.transform =
        `translate(0,-50%) rotate(${angle}deg)`;
    }

    function setGhostLabelPosition(track) {
      const labelX =
        track.x > 0.56 ? -78 : 12;

      const labelY =
        track.y > 0.56 ? -12 : 10;

      track.label.style.left =
        `${labelX}px`;

      track.label.style.top =
        `${labelY}px`;

      const labelWidth =
        Math.max(track.label.offsetWidth, 60);

      const anchorX =
        labelX > 0
          ? labelX
          : labelX + labelWidth - 6;

      const anchorY =
        labelY;

      const length =
        Math.hypot(anchorX, anchorY);

      const angle =
        Math.atan2(anchorY, anchorX) * 180 / Math.PI;

      track.leader.style.left = "0px";
      track.leader.style.top = "0px";
      track.leader.style.width =
        `${Math.max(6, length - 5)}px`;
      track.leader.style.transform =
        `translate(0,-50%) rotate(${angle}deg)`;
    }

    function flashMainTarget() {
      target.classList.remove("is-sweep-hit");
      void target.offsetWidth;
      target.classList.add("is-sweep-hit");
    }

    function flashGhost(track) {
      track.el.classList.remove("is-hit");
      void track.el.offsetWidth;
      track.el.classList.add("is-hit");
    }

    function renderMainTrack() {
      target.style.left =
        `${(mainTrack.x * 100).toFixed(3)}%`;

      target.style.top =
        `${(mainTrack.y * 100).toFixed(3)}%`;

      const vectorAngle =
        Math.atan2(mainTrack.vy, mainTrack.vx) * 180 / Math.PI;

      vector.style.transform =
        `translate(0,-50%) rotate(${vectorAngle}deg)`;

      const points = [
        mainTrack.tail[1],
        mainTrack.tail[2],
        mainTrack.tail[3],
        mainTrack.tail[4]
      ];

      points.forEach((point, index) => {
        const dot = tailDots[index];
        if (!dot) return;

        const dx =
          (point.x - mainTrack.x) * w;

        const dy =
          (point.y - mainTrack.y) * h;

        dot.style.left = `${dx}px`;
        dot.style.top = `${dy}px`;
      });

      setMainLabelPosition();
    }

    function renderGhost(track) {
      track.el.style.left =
        `${(track.x * 100).toFixed(3)}%`;

      track.el.style.top =
        `${(track.y * 100).toFixed(3)}%`;

      const points = [
        track.tail[1],
        track.tail[2],
        track.tail[3]
      ];

      points.forEach((point, index) => {
        const dot =
          track.tailDots[index];

        if (!dot) return;

        const dx =
          (point.x - track.x) * w;

        const dy =
          (point.y - track.y) * h;

        dot.style.left = `${dx}px`;
        dot.style.top = `${dy}px`;
      });

      setGhostLabelPosition(track);
    }

    function moveTrack(track, dt, wobble = true) {
      track.x += (track.vx * dt) / w;
      track.y += (track.vy * dt) / h;

      if (wobble) {
        track.x +=
          (Math.sin(performance.now() / 1100 + track.vx) * 0.10 * dt) / w;

        track.y +=
          (Math.cos(performance.now() / 1300 + track.vy) * 0.10 * dt) / h;
      }

      clampToCircle(track);
    }

    refreshBounds();
    resetTail(mainTrack, 5);
    ghostTracks.forEach(track => resetTail(track, 4));

    renderMainTrack();
    ghostTracks.forEach(renderGhost);

    if (reducedMotion.matches) {
      return;
    }

    let last =
      performance.now();

    function tick(now) {
      const dt =
        Math.min(
          0.05,
          (now - last) / 1000
        );

      last = now;

      moveTrack(mainTrack, dt, true);

      if (Math.random() < 0.10) {
        mainTrack.tail.pop();
        mainTrack.tail.unshift({
          x: mainTrack.x,
          y: mainTrack.y
        });
      }

      renderMainTrack();

      const mainAngle =
        getAngleDeg(mainTrack);

      const sweepAngle =
        getSweepAngleDeg(now);

      if (
        now > mainTrack.coolUntil &&
        isSweepHit(mainAngle, sweepAngle)
      ) {
        mainTrack.coolUntil =
          now + RADAR_REFRESH_COOLDOWN_MS;

        flashMainTarget();
      }

      ghostTracks.forEach(track => {
        moveTrack(track, dt, false);

        if (Math.random() < 0.08) {
          track.tail.pop();
          track.tail.unshift({
            x: track.x,
            y: track.y
          });
        }

        renderGhost(track);

        const angle =
          getAngleDeg(track);

        if (
          now > track.coolUntil &&
          isSweepHit(angle, sweepAngle)
        ) {
          track.coolUntil =
            now + 2400;

          flashGhost(track);
        }
      });

      requestAnimationFrame(tick);
    }

    window.addEventListener(
      "resize",
      () => {
        refreshBounds();
        renderMainTrack();
        ghostTracks.forEach(renderGhost);
      }
    );

    requestAnimationFrame(tick);
  }


  initVisitorFlight();
  setupTowerRadar();


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
      visitorFlight.callsign;

    if (DOM.radarFlight) {
      DOM.radarFlight.textContent =
        `SQ ${visitorFlight.squawk}`;
    }


    DOM.radarMessageTitle.textContent =
      "CONTACT IDENTIFIÉ";


    DOM.radarMessage.textContent =
      "Transpondeur vérifié. Plan de vol disponible.";


    DOM.contactStatus.textContent =
      "IDENTIFIED";


    DOM.contactCallsign.textContent =
      visitorFlight.callsign;

    DOM.contactType.textContent =
      "MISSION";

    DOM.contactOrigin.textContent =
      "PORTFOLIO";

    DOM.contactDestination.textContent =
      "CONTACT";

    DOM.contactTransponder.textContent =
      visitorFlight.squawk;

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
      `Contact identifié. ${visitorFlight.callsign}. Liaison radio disponible.`
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

    DOM.target.classList.remove(
      "is-sweep-hit"
    );


    DOM.radarCallsign.textContent =
      "UNKNOWN";

    if (DOM.radarFlight) {
      DOM.radarFlight.textContent =
        `TRK ${visitorFlight.callsign}`;
    }


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