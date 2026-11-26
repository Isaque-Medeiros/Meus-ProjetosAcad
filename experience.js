/* ============================================================
   Camada de experiência — modo recrutador, atalhos, dock,
   matriz de stack, feedback de toque e relógio local.
   ============================================================ */
(function () {
  'use strict';

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const STORE = 'pf:recruiter';

  const toast = (msg) => {
    if (window.PORTFOLIO_TOAST) { window.PORTFOLIO_TOAST(msg); return; }
    const t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('is-on'), 2200);
  };

  /* ---------------- 1. Modo recrutador ---------------- */
  function initRecruiter() {
    const bar = $('#recruiter-bar');
    const toggle = $('#rec-toggle');
    const exit = $('#rec-exit');
    if (!bar) return;

    let on = false;
    try { on = localStorage.getItem(STORE) === '1'; } catch (e) { on = false; }
    if (/[?&]r=1\b/.test(location.search)) on = true;

    const apply = (value, announce) => {
      on = value;
      document.body.classList.toggle('is-recruiter', on);
      if (toggle) {
        toggle.setAttribute('aria-pressed', String(on));
        const label = $('.rec-label', toggle);
        if (label) label.textContent = on ? 'modo completo' : 'modo recrutador · 60 s';
      }
      bar.setAttribute('aria-hidden', String(!on));
      try { localStorage.setItem(STORE, on ? '1' : '0'); } catch (e) { /* modo privado */ }
      const url = new URL(location.href);
      if (on) url.searchParams.set('r', '1');
      else url.searchParams.delete('r');
      history.replaceState(null, '', url.pathname + (url.search || '') + url.hash);
      if (announce) toast(on ? 'Modo recrutador ativo — só o essencial.' : 'Modo completo restaurado.');
      document.dispatchEvent(new CustomEvent('recruiter:change', { detail: { on: on } }));
    };

    if (toggle) toggle.addEventListener('click', () => apply(!on, true));
    if (exit) exit.addEventListener('click', () => apply(false, true));

    document.addEventListener('keydown', (e) => {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || '')) return;
      if (e.key === 'r' || e.key === 'R') {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        e.preventDefault();
        apply(!on, true);
      }
      if (e.key === 'Escape' && on) apply(false, false);
    });

    apply(on, false);
  }

  /* ---------------- 2. Atalhos ---------------- */
  function initShortcuts() {
    const scrim = $('#shortcuts');
    const openBtn = $('#shortcuts-open');
    if (!scrim) return;
    let lastFocus = null;

    const open = () => {
      lastFocus = document.activeElement;
      scrim.classList.add('is-open');
      scrim.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      const first = $('button, a', scrim);
      if (first) first.focus();
    };
    const close = () => {
      scrim.classList.remove('is-open');
      scrim.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    if (openBtn) openBtn.addEventListener('click', open);
    $$('[data-close-shortcuts]', scrim).forEach((b) => b.addEventListener('click', close));
    scrim.addEventListener('click', (e) => { if (e.target === scrim) close(); });

    document.addEventListener('keydown', (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || '');
      if (e.key === '?' && !typing && !scrim.classList.contains('is-open')) {
        e.preventDefault();
        open();
        return;
      }
      if (!scrim.classList.contains('is-open')) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      const f = $$('button, a[href]', scrim).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------------- 3. Dock de seções (mobile) ---------------- */
  function initDock() {
    const dock = $('#dock');
    const menu = $('#dock-menu');
    const toggle = $('#dock-toggle');
    if (!dock || !menu || !toggle) return;

    const items = [
      ['#projetos', 'code', 'Projetos'],
      ['#sobre', 'layers', 'Sobre'],
      ['#experiencia', 'briefcase', 'Trajetória'],
      ['#stack', 'cpu', 'Stack'],
      ['#formacao', 'graduation', 'Formação'],
      ['#contato', 'mail', 'Contato']
    ];
    menu.innerHTML = items
      .map(
        ([href, icon, label]) =>
          `<a href="${href}"><svg aria-hidden="true"><use href="#i-${icon}"/></svg>${label}</a>`
      )
      .join('');

    const close = () => {
      dock.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    const open = () => {
      dock.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    };

    toggle.addEventListener('click', () => {
      dock.classList.contains('is-open') ? close() : open();
    });
    $$('a', menu).forEach((a) => a.addEventListener('click', close));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
    document.addEventListener('click', (e) => {
      if (!dock.contains(e.target)) close();
    });

    const links = $$('a', menu);
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + entry.target.id));
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    items.forEach(([href]) => {
      const el = document.querySelector(href);
      if (el) io.observe(el);
    });
  }

  /* ---------------- 4. Matriz de stack → projetos ---------------- */
  function initStack() {
    const map = window.PORTFOLIO_STACK || {};
    const rows = $$('[data-skill]');
    if (!rows.length) return;
    let current = null;

    const clear = () => {
      current = null;
      rows.forEach((r) => r.classList.remove('is-on'));
      $$('.lab__item').forEach((b) => b.classList.remove('is-dim', 'is-hit'));
      const note = $('#lab-note');
      if (note) note.hidden = true;
    };

    rows.forEach((row) => {
      const skill = row.dataset.skill;
      const projects = (map[skill] || []).filter((id) => document.getElementById('idx-' + id));
      const ev = row.querySelector('.stack-ev');
      if (ev) ev.textContent = projects.length ? projects.length + ' projeto' + (projects.length > 1 ? 's' : '') : 'estudo';
      row.setAttribute('aria-pressed', 'false');

      row.addEventListener('click', () => {
        if (current === skill) { clear(); return; }
        current = skill;
        rows.forEach((r) => {
          const on = r === row;
          r.classList.toggle('is-on', on);
          r.setAttribute('aria-pressed', String(on));
        });
        document.dispatchEvent(new CustomEvent('stack:pick', { detail: { skill: skill, projects: projects } }));
        const lab = $('#projetos');
        if (lab) {
          lab.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
          document.dispatchEvent(new CustomEvent('lab:change', { detail: { focusTech: skill } }));
        }
        toast(projects.length ? skill + ' → ' + projects.length + ' projeto(s) no laboratório' : skill + ' ainda está na trilha de estudo');
      });
    });

    document.addEventListener('lab:change', (e) => {
      if (current && e.detail && e.detail.id) {
        const ids = map[current] || [];
        $$('.lab__item').forEach((b) => {
          b.classList.toggle('is-hit', ids.includes(b.dataset.id));
          b.classList.toggle('is-dim', !ids.includes(b.dataset.id));
        });
      }
    });
  }

  /* ---------------- 5. Feedback de toque ---------------- */
  function initPress() {
    if (reduce) return;
    const sel = '.btn, .filter, .lab__tab, .demo__btn, .chip--pick, .barbe__svc, .barbe__day, .barbe__slot';
    const press = (el) => el.classList.add('is-press');
    const release = (el) => el.classList.remove('is-press');
    document.addEventListener('pointerdown', (e) => {
      const el = e.target.closest(sel);
      if (el) press(el);
    }, { passive: true });
    document.addEventListener('pointerup', (e) => {
      const el = e.target.closest(sel);
      if (el) setTimeout(() => release(el), 90);
    }, { passive: true });
    document.addEventListener('pointercancel', (e) => {
      const el = e.target.closest(sel);
      if (el) release(el);
    }, { passive: true });
  }

  /* ---------------- 6. Relógio local ---------------- */
  function initClock() {
    const el = $('#local-time');
    if (!el) return;
    const paint = () => {
      try {
        el.textContent = new Intl.DateTimeFormat('pt-BR', {
          hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo'
        }).format(new Date());
      } catch (e) {
        el.textContent = '';
      }
    };
    paint();
    setInterval(paint, 30000);
  }

  /* ---------------- 7. Timeline: nó ativo ---------------- */
  function initTimelineNodes() {
    const items = $$('.tl-item');
    if (!items.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.target.classList.toggle('is-inview', entry.isIntersecting));
      },
      { rootMargin: '-38% 0px -52% 0px' }
    );
    items.forEach((i) => io.observe(i));
  }

  /* ---------------- 8. Título das seções com progresso ---------------- */
  function initSectionParallax() {
    if (reduce) return;
    const heads = $$('.section__head h2');
    if (!heads.length) return;
    let ticking = false;
    const update = () => {
      const vh = window.innerHeight;
      heads.forEach((h) => {
        const r = h.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, 1 - (r.top + r.height) / (vh + r.height)));
        h.style.setProperty('--sy', ((p - 0.5) * 14).toFixed(2) + 'px');
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  function boot() {
    initRecruiter();
    initShortcuts();
    initDock();
    initStack();
    initPress();
    initClock();
    initTimelineNodes();
    initSectionParallax();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
