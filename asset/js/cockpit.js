   const io = new IntersectionObserver((entries) => {
      entries.forEach(e => e.isIntersecting && e.target.classList.add('in'));
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

    // ===== PPI engine =====
    // behaviour:
    // - each target has a position and a velocity (small directional drift)
    // - comet tail stores last 4 positions
    // - when sweep angle passes near target angle => flash + label "jump" to next anchor slot

    const SWEEP_SECONDS = 8.8;         // must match --sweep-speed
    const SPEED_PX_SEC = 6.0;          // slow movement (directional)
    const HIT_WINDOW_DEG = 7.5;        // detection angle window
    const REFRESH_COOLDOWN_MS = 1200;  // avoid double hit

    // label anchor slots (relative to plot, in px)
    const LABEL_SLOTS = [
      { dx: 20, dy: -24 },
      { dx: 20, dy: 10 },
      { dx: -120, dy: -24 },
      { dx: -120, dy: 10 },
      { dx: 20, dy: -44 },
      { dx: -120, dy: -44 }
    ];

    function setupScope(scope) {
      const rect = () => scope.getBoundingClientRect();
      let w = 0, h = 0, cx = 0, cy = 0, R = 0;

      function refresh() {
        const r = rect();
        w = r.width; h = r.height;
        cx = w / 2; cy = h / 2;
        R = Math.min(w, h) * 0.48;
      }

      const targets = [...scope.querySelectorAll('.target')].map((el, idx) => {
        const x = (parseFloat(el.dataset.x) || 50) / 100;
        const y = (parseFloat(el.dataset.y) || 50) / 100;

        // create DOM parts (minimal, no div sprawl elsewhere)
        const plot = document.createElement('span');
        plot.className = 'plot';
        el.appendChild(plot);

        const t0 = document.createElement('span'); t0.className = 'taildot t0';
        const t1 = document.createElement('span'); t1.className = 'taildot t1';
        const t2 = document.createElement('span'); t2.className = 'taildot t2';
        const t3 = document.createElement('span'); t3.className = 'taildot t3';
        el.append(t0, t1, t2, t3);

        const leader = document.createElement('span');
        leader.className = 'leader';
        el.appendChild(leader);

        const label = document.createElement('span');
        label.className = 'label';
        label.textContent = el.dataset.id || 'TRACK';
        el.appendChild(label);

        // initial label slot
        let slotIndex = idx % LABEL_SLOTS.length;

        // velocity (directional, slow)
        const ang = Math.random() * Math.PI * 2;
        const vx = Math.cos(ang) * SPEED_PX_SEC;
        const vy = Math.sin(ang) * SPEED_PX_SEC;

        return {
          el, plot, leader, label,
          tail: [{ x, y }, { x, y }, { x, y }, { x, y }],
          x, y, vx, vy,
          slotIndex,
          coolUntil: 0
        };
      });

      function clampToCircle(t) {
        const px = t.x * w, py = t.y * h;
        const dx = px - cx, dy = py - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > R) {
          const nx = dx / dist, ny = dy / dist;
          const tx = cx + nx * R, ty = cy + ny * R;
          t.x = tx / w; t.y = ty / h;

          const dot = t.vx * nx + t.vy * ny;
          t.vx = t.vx - 2 * dot * nx;
          t.vy = t.vy - 2 * dot * ny;
        }
      }

      function angleDeg(t) {
        const px = t.x * w, py = t.y * h;
        const dx = px - cx, dy = py - cy;
        let a = Math.atan2(dy, dx) * 180 / Math.PI;
        if (a < 0) a += 360;
        return a;
      }

      function sweepDeg(now) {
        const tt = (now / 1000) % SWEEP_SECONDS;
        return (tt / SWEEP_SECONDS) * 360;
      }

      function hit(a, sA) {
        let d = Math.abs(a - sA);
        d = Math.min(d, 360 - d);
        return d <= HIT_WINDOW_DEG;
      }

      function setLeader(t) {
        const slot = LABEL_SLOTS[t.slotIndex];
        // label anchored relative to plot in px, but our target container is at plot center (0,0)
        t.label.style.left = slot.dx + 'px';
        t.label.style.top = slot.dy + 'px';

        // leader line from plot center (0,0) to label edge area
        const x2 = slot.dx;
        const y2 = slot.dy;
        const len = Math.hypot(x2, y2);
        const ang = Math.atan2(y2, x2) * 180 / Math.PI;

        t.leader.style.left = '0px';
        t.leader.style.top = '0px';
        t.leader.style.width = Math.max(8, len - 6) + 'px';
        t.leader.style.transform = `translate(0,-50%) rotate(${ang}deg)`;
      }

      // initial leader
      targets.forEach(setLeader);

      let last = performance.now();
      function tick(now) {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;

        const sA = sweepDeg(now);

        for (const t of targets) {
          // move (directional)
          t.x += (t.vx * dt) / w;
          t.y += (t.vy * dt) / h;

          // very small wobble (optional, realistic noise)
          t.x += (Math.sin(now / 900 + t.vx) * 0.20 * dt) / w;
          t.y += (Math.cos(now / 1100 + t.vy) * 0.20 * dt) / h;

          clampToCircle(t);

          // update comet tail (shift)
          if (Math.random() < 0.12) { // tail update rate (not every frame)
            t.tail.pop();
            t.tail.unshift({ x: t.x, y: t.y });
          }

          // place target container at current pos
          t.el.style.left = (t.x * 100).toFixed(3) + '%';
          t.el.style.top = (t.y * 100).toFixed(3) + '%';

          // update tail dots in local coords (relative to current plot)
          const dots = t.el.querySelectorAll('.taildot');
          // tail[0] is newest, but we want older behind => use tail[1..4]
          const tailPts = [t.tail[1], t.tail[2], t.tail[3], t.tail[4] || t.tail[3]];
          tailPts.forEach((p, i) => {
            const dx = (p.x - t.x) * w;
            const dy = (p.y - t.y) * h;
            const d = dots[i];
            if (d) {
              d.style.left = dx + 'px';
              d.style.top = dy + 'px';
            }
          });

          // sweep refresh detection
          const a = angleDeg(t);
          if (now > t.coolUntil && hit(a, sA)) {
            t.coolUntil = now + REFRESH_COOLDOWN_MS;

            // flash plot + label
            t.el.classList.remove('flash');
            // force reflow for restart animation
            void t.el.offsetWidth;
            t.el.classList.add('flash');

            // jump label slot (simulate "repositioning" per scan)
            t.slotIndex = (t.slotIndex + 1) % LABEL_SLOTS.length;
            setLeader(t);
          }
        }

        requestAnimationFrame(tick);
      }

      refresh();
      window.addEventListener('resize', () => { refresh(); targets.forEach(setLeader); });
      requestAnimationFrame(tick);
    }

    document.querySelectorAll('.scope[data-scope]').forEach(setupScope);