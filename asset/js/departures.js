(() => {
  'use strict';

  document.documentElement.classList.add('js');

  /* ─── Configuration figée ─── */
  const CONFIG = Object.freeze({
    STEP_DELAY: 380,
    WORDS_PER_MINUTE: 200,
    MIN_READ_MS: 6000,
    MAX_READ_MS: 14000,
    SCRAMBLE_FRAMES: 8,
    SCRAMBLE_CHARS: '█▓▒░<>/\\|01',
  });

  const STATUS_LABEL = Object.freeze({
    locked: 'VERROUILLÉ',
    active: 'PRÊT POUR INSPECTION',
    open: 'INSPECTION EN COURS',
    validated: 'CONTRÔLÉ ✓',
  });

  const ACTION_LABEL = Object.freeze({
    locked: 'SYSTÈME VERROUILLÉ',
    active: "LANCER L'INSPECTION",
    open: 'INSPECTION EN COURS…',
    validated: 'RAPPORT — MASQUER',
  });

  const LEVEL_LABEL = Object.freeze({
    operational: 'OPÉRATIONNEL',
    service: 'EN SERVICE',
    calibration: 'CALIBRATION',
  });

  /* ─── Sélecteurs ─── */
  const channels = [...document.querySelectorAll('.channel')];
  const dotsNav = document.querySelector('.ops-dots');
  const dots = [...document.querySelectorAll('.ops-dot')];
  const links = [...document.querySelectorAll('.ops-link')];
  const legendItems = [...document.querySelectorAll('.ops-legend__item')];
  const panelStatus = document.getElementById('ops-panel-status');
  const meterFill = document.getElementById('ops-meter-fill');
  const brief = document.getElementById('ops-brief');
  const finalPanel = document.getElementById('ops-final');
  const live = document.getElementById('ops-live');
  const eventLog = document.getElementById('ops-event-log');

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const dotTitles = channels.map((channel) =>
    channel.querySelector('.channel__title')?.textContent.trim() ?? ''
  );

  /* ─── État du module (privé) ─── */
  let validated = 0;
  let inspection = null;
  let activeFilter = null;

  /* ═══ Journal des opérations ═══ */

  const missionStart = performance.now();

  function missionTime() {
    const elapsed = Math.floor((performance.now() - missionStart) / 1000);
    const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const s = String(elapsed % 60).padStart(2, '0');
    return `T+${m}:${s}`;
  }

  function logEvent(text, type = '') {
    if (!eventLog) return;
    const li = document.createElement('li');
    li.className = type ? `ops-log__entry ops-log__entry--${type}` : 'ops-log__entry';
    const time = document.createElement('span');
    time.className = 'ops-log__time';
    time.textContent = missionTime();
    li.append(time, document.createTextNode(text));
    eventLog.appendChild(li);
    eventLog.scrollTop = eventLog.scrollHeight;
  }

  /* ═══ Compteurs par niveau (source unique : data-level du DOM) ═══ */

  function countByLevel() {
    const counts = { operational: 0, service: 0, calibration: 0 };
    document.querySelectorAll('.mini').forEach((mini) => {
      if (mini.dataset.level in counts) counts[mini.dataset.level] += 1;
    });
    return counts;
  }

  function initLegendCounts() {
    const counts = countByLevel();
    legendItems.forEach((item) => {
      const small = item.querySelector('small');
      if (!small) return;
      if (!small.dataset.hint) small.dataset.hint = small.textContent.trim();
      small.textContent = `${small.dataset.hint} · ${counts[item.dataset.level]}`;
    });
  }

  /* ═══ Récap final généré depuis le DOM ═══ */

  function buildFinalRecap() {
    if (!finalPanel) return;

    const list = finalPanel.querySelector('.ops-final__list');
    if (list) {
      list.replaceChildren(...channels.map((channel, i) => {
        const li = document.createElement('li');
        li.textContent = `✓ Canal ${String(i + 1).padStart(2, '0')} — ${dotTitles[i]}`;
        return li;
      }));
    }

    const counts = countByLevel();
    const stats = document.createElement('p');
    stats.className = 'ops-final__stats';
    stats.textContent = 'RÉPARTITION : ';

    Object.keys(counts).forEach((level, i) => {
      const strong = document.createElement('strong');
      strong.className = `ops-final__stat ops-final__stat--${level}`;
      strong.textContent = String(counts[level]).padStart(2, '0');
      stats.append(strong, document.createTextNode(` ${LEVEL_LABEL[level]}S`));
      if (i < 2) stats.append(document.createTextNode(' · '));
    });

    const anchor = finalPanel.querySelector('.ops-final__text');
    anchor?.before(stats);
  }

  /* ═══ Split-flap sur le titre à l'activation ═══ */

  function scrambleTitle(channel) {
    const title = channel.querySelector('.channel__title');
    if (!title) return;
    if (!title.dataset.original) title.dataset.original = title.textContent;
    const target = title.dataset.original;

    if (REDUCED) {
      title.textContent = target;
      return;
    }

    let frame = 0;
    const interval = setInterval(() => {
      title.textContent = target
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          return i < (frame / CONFIG.SCRAMBLE_FRAMES) * target.length
            ? char
            : CONFIG.SCRAMBLE_CHARS[Math.floor(Math.random() * CONFIG.SCRAMBLE_CHARS.length)];
        })
        .join('');
      frame += 1;
      if (frame > CONFIG.SCRAMBLE_FRAMES) {
        clearInterval(interval);
        title.textContent = target;
      }
    }, 40);
  }

  /* ═══ Filtre légende ═══ */

  function syncFilterFor(mini) {
    if (!activeFilter || mini.classList.contains('is-pending')) return;
    const match = mini.dataset.level === activeFilter;
    mini.classList.toggle('is-highlighted', match);
    mini.classList.toggle('is-dimmed', !match);
  }

  function applyLegendFilter(level) {
    activeFilter = level;

    legendItems.forEach((item) => {
      const isActive = item.dataset.level === level;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });

    document.querySelectorAll('.mini').forEach((mini) => {
      if (!level) {
        mini.classList.remove('is-dimmed', 'is-highlighted');
        return;
      }
      syncFilterFor(mini);
    });

    logEvent(level
      ? `FILTRE LÉGENDE → ${LEVEL_LABEL[level]} SURLIGNÉ`
      : 'FILTRE LÉGENDE → RÉINITIALISÉ');
  }

  legendItems.forEach((item) => {
    item.addEventListener('click', () => {
      applyLegendFilter(activeFilter === item.dataset.level ? null : item.dataset.level);
    });
  });

  /* ═══ Utilitaires ═══ */

  function setDotLabel(index, stateLabel) {
    const dot = dots[index];
    if (!dot) return;
    dot.setAttribute(
      'aria-label',
      `Canal ${String(index + 1).padStart(2, '0')} — ${dotTitles[index]} : ${stateLabel}`
    );
  }

  function setCurrentDot(index) {
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-current', i === index);
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  function setState(channel, state) {
    channel.dataset.state = state;
    channel.querySelector('.channel__status-text').textContent = STATUS_LABEL[state];

    const action = channel.querySelector('.channel__action');
    action.disabled = state === 'locked' || state === 'open';
    action.textContent = ACTION_LABEL[state];
  }

  function setPanel(channel, open) {
    channel.querySelector('.channel__panel').hidden = !open;
    channel.querySelector('.channel__action').setAttribute('aria-expanded', String(open));
  }

  function closeOthers(except) {
    channels.forEach((channel) => {
      if (channel === except) return;
      if (!channel.querySelector('.channel__panel').hidden) {
        setPanel(channel, false);
        if (channel.dataset.state === 'validated') {
          channel.querySelector('.channel__action').textContent = 'RAPPORT — AFFICHER';
        }
      }
    });
  }

  function resetMinis(channel) {
    channel.querySelectorAll('.mini').forEach((mini) => {
      if (!mini.dataset.realState) {
        mini.dataset.realState = mini.querySelector('.mini__state').textContent.trim();
      }
      mini.classList.add('is-pending');
      mini.classList.remove('is-highlighted', 'is-dimmed');
      mini.querySelector('.mini__state').textContent = 'EN ATTENTE';
    });
  }

  function lightUp(mini) {
    mini.classList.remove('is-pending');
    mini.querySelector('.mini__state').textContent = mini.dataset.realState;
    syncFilterFor(mini);
  }

  function updateCount() {
    if (panelStatus) {
      panelStatus.textContent = `● ${validated} / ${channels.length} CONTRÔLÉS`;
    }
    if (meterFill) {
      meterFill.style.transform = `scaleX(${validated / channels.length})`;
    }
  }

  function readingTimeFor(channel) {
    const words = channel.querySelector('.channel__note').textContent.trim().split(/\s+/).length;
    const ms = (words / CONFIG.WORDS_PER_MINUTE) * 60 * 1000;
    return Math.min(CONFIG.MAX_READ_MS, Math.max(CONFIG.MIN_READ_MS, ms));
  }

  /* ═══ Minuterie avec pause au survol / focus ═══ */

  function waitForReading(channel, duration, token) {
    return new Promise((resolve) => {
      const panel = channel.querySelector('.channel__panel');
      const countdown = document.createElement('p');
      countdown.className = 'channel__reading';
      countdown.setAttribute('aria-hidden', 'true');
      panel.appendChild(countdown);

      let remaining = duration;
      let paused = false;
      let last = performance.now();
      let done = false;

      const render = () => {
        countdown.textContent = paused
          ? 'LECTURE EN COURS — MINUTERIE EN PAUSE'
          : `FERMETURE AUTOMATIQUE — ${Math.max(0, Math.ceil(remaining / 1000))} s`;
      };

      const pause = () => { paused = true; render(); };
      const resume = () => { paused = false; last = performance.now(); render(); };

      panel.addEventListener('pointerenter', pause);
      panel.addEventListener('pointerleave', resume);
      panel.addEventListener('focusin', pause);
      panel.addEventListener('focusout', resume);

      token.skip = finish;

      const timer = setInterval(() => {
        if (token.cancelled) { finish(); return; }
        const now = performance.now();
        if (!paused) remaining -= now - last;
        last = now;
        render();
        if (remaining <= 0) finish();
      }, 250);

      function finish() {
        if (done) return;
        done = true;
        clearInterval(timer);
        panel.removeEventListener('pointerenter', pause);
        panel.removeEventListener('pointerleave', resume);
        panel.removeEventListener('focusin', pause);
        panel.removeEventListener('focusout', resume);
        countdown.remove();
        resolve();
      }

      render();
    });
  }

  /* ═══ Annulation propre ═══ */

  function cancelInspection() {
    if (!inspection) return;
    const { channel, index, token } = inspection;
    token.cancelled = true;
    resetMinis(channel);
    setPanel(channel, false);
    setState(channel, 'active');
    setDotLabel(index, 'prêt pour inspection');
    inspection = null;
  }

  /* ═══ Inspection complète ═══ */

  async function startInspection(channel, index) {
    const token = { cancelled: false, skip: null };
    inspection = { channel, index, token };

    const num = String(index + 1).padStart(2, '0');

    closeOthers(channel);
    setState(channel, 'open');
    setPanel(channel, true);
    brief?.classList.add('is-hidden');
    setCurrentDot(index);
    setDotLabel(index, 'inspection en cours');
    logEvent(`CANAL ${num} → INSPECTION INITIALISÉE`);
    if (live) live.textContent = `Inspection du canal ${num} en cours.`;

    for (const mini of channel.querySelectorAll('.mini')) {
      await sleep(REDUCED ? 0 : CONFIG.STEP_DELAY);
      if (token.cancelled) return;
      lightUp(mini);
    }

    const action = channel.querySelector('.channel__action');
    action.disabled = false;
    action.textContent = 'TERMINER ET CONTINUER →';

    await waitForReading(channel, readingTimeFor(channel), token);
    if (token.cancelled) return;

    inspection = null;
    completeInspection(channel, index);
  }

  function completeInspection(channel, index) {
    const num = String(index + 1).padStart(2, '0');

    setPanel(channel, false);
    setState(channel, 'validated');

    channel.classList.add('is-flashing');
    setTimeout(() => channel.classList.remove('is-flashing'), 950);

    const dot = dots[index];
    if (dot) {
      dot.classList.remove('is-current');
      dot.removeAttribute('aria-current');
      dot.classList.add('is-done');
      dot.disabled = false;
    }
    links[index]?.classList.add('is-filled');
    setDotLabel(index, 'contrôlé — afficher le rapport');

    validated += 1;
    updateCount();
    logEvent(`CANAL ${num} → CONTRÔLÉ ✓`, 'ok');

    const next = channels[index + 1];

    if (next) {
      const nextNum = String(index + 2).padStart(2, '0');
      setState(next, 'active');
      scrambleTitle(next);
      setCurrentDot(index + 1);
      setDotLabel(index + 1, 'prêt pour inspection');
      logEvent(`CANAL ${nextNum} → DÉVERROUILLÉ`);
      if (live) live.textContent = `Canal ${num} contrôlé. Canal ${nextNum} déverrouillé.`;
      setTimeout(() => {
        next.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });
        /* Le focus suit la séquence (navigation clavier) */
        next.querySelector('.channel__action').focus({ preventScroll: true });
      }, 500);
    } else {
      finishInspection(num);
    }
  }

  async function finishInspection(lastNum) {
    logEvent('TOUS SYSTÈMES CONTRÔLÉS', 'ok');
    if (live) {
      live.textContent = `Canal ${lastNum} contrôlé. Tous les systèmes sont contrôlés. Autorisation de départ accordée.`;
    }

    for (const dot of dots) {
      dot.classList.add('is-celebrating');
      await sleep(REDUCED ? 0 : 150);
      setTimeout(() => dot.classList.remove('is-celebrating'), 600);
    }

    await sleep(REDUCED ? 0 : 400);

    logEvent('CLEARANCE GRANTED — AUTORISATION DE DÉPART ACCORDÉE', 'final');
    if (panelStatus) {
      panelStatus.textContent = '● CLEARANCE GRANTED';
      panelStatus.classList.add('ops-panel__status--green');
    }
    if (finalPanel) {
      finalPanel.hidden = false;
      finalPanel.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });
      finalPanel.querySelector('.ops-final__cta')?.focus({ preventScroll: true });
    }
  }

  /* ═══ Boot ═══ */

  async function boot() {
    for (const channel of channels) {
      await sleep(REDUCED ? 0 : 120);
      channel.classList.remove('is-preboot');
      channel.classList.add('is-booted');
    }
    await sleep(REDUCED ? 0 : 250);
    logEvent(`SYSTÈME OPS-251 EN LIGNE — ${String(channels.length).padStart(2, '0')} SYSTÈMES DÉTECTÉS`);
    logEvent('CANAL 01 → PRÊT POUR INSPECTION');
  }

  /* ═══ Préparation impression : tout visible et lisible ═══ */

  function preparePrint() {
    document.querySelectorAll('.mini').forEach((mini) => {
      if (!mini.dataset.realState) {
        mini.dataset.realState = mini.querySelector('.mini__state').textContent.trim();
      }
      mini.classList.remove('is-pending', 'is-dimmed', 'is-highlighted');
      mini.querySelector('.mini__state').textContent = mini.dataset.realState;
    });
    document.querySelectorAll('.channel__panel').forEach((panel) => {
      panel.hidden = false;
    });
    if (finalPanel) finalPanel.hidden = false;
  }

  window.addEventListener('beforeprint', preparePrint);

  /* ═══ Navigation clavier dans les pastilles (flèches) ═══ */

  dotsNav?.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;

    const enabled = dots.filter((dot) => !dot.disabled);
    const currentIndex = enabled.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    event.preventDefault();
    const nextIndex = event.key === 'ArrowRight'
      ? (currentIndex + 1) % enabled.length
      : (currentIndex - 1 + enabled.length) % enabled.length;
    enabled[nextIndex].focus();
  });

  /* ═══ Init ═══ */

  channels.forEach((channel, index) => {
    if (!REDUCED) channel.classList.add('is-preboot');
    setState(channel, index === 0 ? 'active' : 'locked');
    setPanel(channel, false);
    resetMinis(channel);
    setDotLabel(index, index === 0 ? 'prêt pour inspection' : 'verrouillé');
  });

  setCurrentDot(0);
  if (finalPanel) finalPanel.hidden = true;
  initLegendCounts();
  buildFinalRecap();
  updateCount();
  boot();

  console.log(`[OPS] ${channels.length} canaux · ${legendItems.length} niveaux · prêt.`);

  /* ═══ Interactions cards ═══ */

  channels.forEach((channel, index) => {
    const action = channel.querySelector('.channel__action');

    action.addEventListener('click', () => {
      const state = channel.dataset.state;

      if (state === 'active') {
        startInspection(channel, index);
        return;
      }

      if (state === 'open') {
        inspection?.token.skip?.();
        return;
      }

      if (state === 'validated') {
        cancelInspection();
        const isOpen = !channel.querySelector('.channel__panel').hidden;
        if (isOpen) {
          setPanel(channel, false);
          action.textContent = 'RAPPORT — AFFICHER';
        } else {
          closeOthers(channel);
          setPanel(channel, true);
          action.textContent = 'RAPPORT — MASQUER';
        }
      }
    });
  });

  /* ═══ Navigation par pastilles ═══ */

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      const channel = channels[index];
      if (!channel || channel.dataset.state !== 'validated') return;

      cancelInspection();
      closeOthers(channel);
      setPanel(channel, true);
      channel.querySelector('.channel__action').textContent = 'RAPPORT — MASQUER';
      channel.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });
    });
  });

})();