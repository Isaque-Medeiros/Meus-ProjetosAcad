/* ============================================================
   Isaque Medeiros — Portfólio 2026 (v2)
   Interações: terminal, reveals, filtros, modal, palette, tilt
   Vanilla JS · sem dependências
   ============================================================ */
(function () {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = window.matchMedia('(hover: none)').matches;
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------------- 1. Título animado + auto-fit ---------------- */
  function splitLine(el, startIndex) {
    let idx = startIndex;
    Array.from(el.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.trim().split(/\s+/).filter(Boolean);
        if (!words.length) return;
        const frag = document.createDocumentFragment();
        words.forEach((w) => {
          const wrap = document.createElement('span');
          wrap.className = 'w';
          const inner = document.createElement('i');
          inner.textContent = w;
          inner.style.setProperty('--i', idx++);
          wrap.appendChild(inner);
          frag.appendChild(wrap);
          frag.appendChild(document.createTextNode(' '));
        });
        node.replaceWith(frag);
      } else if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('w')) {
        idx = splitLine(node, idx);
      }
    });
    return idx;
  }

  function fitHeroTitle() {
    const title = $('.hero__title');
    if (!title) return;
    title.style.fontSize = '';
    const lines = $$('.line', title);
    if (!lines.length) return;
    if (getComputedStyle(lines[0]).whiteSpace !== 'nowrap') return;
    let size = parseFloat(getComputedStyle(title).fontSize);
    const overflows = () => lines.some((l) => l.scrollWidth > l.clientWidth + 1);
    let guard = 0;
    while (overflows() && size > 26 && guard < 80) {
      size -= 1;
      title.style.fontSize = size + 'px';
      guard++;
    }
  }

  function initHeroTitle() {
    let idx = 0;
    $$('.hero__title [data-split]').forEach((line) => {
      idx = splitLine(line, idx);
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => document.body.classList.add('is-ready'));
    });
    fitHeroTitle();
    window.addEventListener('resize', debounce(fitHeroTitle, 160));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitHeroTitle);
  }

  function debounce(fn, ms) {
    let t = null;
    return function () {
      clearTimeout(t);
      const args = arguments;
      t = setTimeout(() => fn.apply(null, args), ms);
    };
  }

  /* ---------------- 2. Terminal interativo ---------------- */
  const OUT = {
    boot: [
      { c: 'cmd', t: 'cat README.md' },
      { c: 'info', t: '# estudante de ADS que constrói sistemas reais' },
      { c: 'ok', t: '✓ 6 projetos indexados' },
      { c: 'ok', t: '✓ 2 apps públicos · 3 privados · 1 acadêmico' },
      { c: 'dim', t: '→ digite "help" e pressione Enter' }
    ],
    help: [
      { c: 'dim', t: 'comandos disponíveis:' },
      { c: 'ok', t: '  whoami      quem eu sou' },
      { c: 'ok', t: '  ls          meus projetos' },
      { c: 'ok', t: '  cat stack   stack técnica' },
      { c: 'ok', t: '  contato     como falar comigo' },
      { c: 'ok', t: '  clear       limpar o terminal' }
    ],
    whoami: [
      { c: 'cmd', t: 'isaque de medeiros pinto' },
      { c: 'info', t: 'estudante de ADS · UNIP (colação dez/2026)' },
      { c: 'info', t: 'analista de suporte field service na TOTVS via DB4 SERV' },
      { c: 'dim', t: 'dev em formação · buscando a 1ª vaga júnior (.NET)' }
    ],
    ls: [
      { c: 'dim', t: 'nome           acesso' },
      { c: 'ok', t: 'bsfm/          app + docs públicos' },
      { c: 'ok', t: 'barbe-city/    no ar (agenda + pix)' },
      { c: 'info', t: 'bancada/       privado (uso interno)' },
      { c: 'info', t: '4dx/           privado (automação)' },
      { c: 'ok', t: 'sysacad/       c++ acadêmico' },
      { c: 'dim', t: 'climo/         protótipo não concluído' }
    ],
    'cat stack': [
      { c: 'dim', t: '{' },
      { c: 'ok', t: '  "backend": ["C#", ".NET 8", "Python", "Node"],' },
      { c: 'ok', t: '  "dados":   ["PostgreSQL", "SQL Server"],' },
      { c: 'ok', t: '  "front":   ["HTML", "CSS", "JavaScript"],' },
      { c: 'dim', t: '  "estudo":  ["TypeScript", "React", "testes"]' },
      { c: 'dim', t: '}' }
    ],
    contato: [
      { c: 'ok', t: 'e-mail    medeirosisaque765@gmail.com' },
      { c: 'ok', t: 'github    github.com/Isaque-Medeiros' },
      { c: 'ok', t: 'linkedin  in/isaque-medeiros-a99421268' },
      { c: 'dim', t: '→ ou clique em "Falar comigo" no topo' }
    ],
    projetos: [
      { c: 'info', t: 'seção 03 — cada card abre um estudo de caso' },
      { c: 'dim', t: 'contexto, decisão técnica e resultado' }
    ],
    sobre: [
      { c: 'info', t: 'seção 01 — quem eu sou, sem maquiagem' }
    ],
    deploy: [
      { c: 'cmd', t: 'git push origin main' },
      { c: 'dim', t: 'enumerando objetos: 47, feito.' },
      { c: 'ok', t: '✓ main → main' },
      { c: 'ok', t: '✓ GitHub Pages: build concluído' },
      { c: 'info', t: '→ este site é HTML, CSS e JS puro' }
    ]
  };

  function initTerminal() {
    const out = $('#term-out');
    const form = $('#term-form');
    const input = $('#term-input');
    if (!out) return;

    const line = (text, cls) => {
      const el = document.createElement('span');
      el.className = 'term__line' + (cls ? ' ' + cls : '');
      el.textContent = text;
      out.appendChild(el);
      out.scrollTop = out.scrollHeight;
      return el;
    };

    const echo = (cmd) => {
      const el = document.createElement('span');
      el.className = 'term__line cmd';
      const p = document.createElement('span');
      p.className = 'term__echo';
      p.textContent = '~$ ';
      el.appendChild(p);
      el.appendChild(document.createTextNode(cmd));
      out.appendChild(el);
    };

    const print = (list) => {
      list.forEach((l) => line(l.t, l.c));
      out.scrollTop = out.scrollHeight;
    };

    const clear = () => { out.innerHTML = ''; };

    const normalize = (raw) => raw.trim().toLowerCase().replace(/\s+/g, ' ');

    const run = (raw) => {
      const cmd = normalize(raw);
      if (!cmd) return;
      echo(raw.trim());
      if (cmd === 'clear' || cmd === 'cls') { clear(); return; }
      const table = {
        help: OUT.help,
        '?': OUT.help,
        whoami: OUT.whoami,
        id: OUT.whoami,
        ls: OUT.ls,
        'ls projetos': OUT.ls,
        'ls projetos/': OUT.ls,
        'cat stack': OUT['cat stack'],
        'cat stack.json': OUT['cat stack'],
        stack: OUT['cat stack'],
        contato: OUT.contato,
        contact: OUT.contato,
        projetos: OUT.projetos,
        sobre: OUT.sobre,
        deploy: OUT.deploy
      };
      const result = table[cmd] || table[cmd.replace(/\/$/, '')] || table[cmd.replace(/\s+\/.*$/, '')];
      if (result) {
        print(result);
      } else {
        line('comando não encontrado: ' + cmd, 'err');
        line('tente "help" para ver a lista', 'dim');
      }
    };

    // boot com efeito de digitação
    const boot = async () => {
      if (reduce) { print(OUT.boot); return; }
      for (const l of OUT.boot) {
        const el = document.createElement('span');
        el.className = 'term__line ' + l.c;
        let textNode;
        if (l.c === 'cmd') {
          const p = document.createElement('span');
          p.className = 'term__echo';
          p.textContent = '~$ ';
          el.appendChild(p);
          textNode = document.createTextNode('');
          el.appendChild(textNode);
        } else {
          textNode = document.createTextNode('');
          el.appendChild(textNode);
        }
        out.appendChild(el);
        for (let i = 0; i < l.t.length; i++) {
          textNode.nodeValue = l.t.slice(0, i + 1);
          out.scrollTop = out.scrollHeight;
          await delay(l.c === 'cmd' ? 26 : 7);
        }
        await delay(150);
      }
    };
    boot();

    if (form && input) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const v = input.value;
        input.value = '';
        run(v);
      });
    }

    $$('#chips [data-cmd]').forEach((btn) => {
      btn.addEventListener('click', () => {
        run(btn.dataset.cmd);
        if (input && !touch) input.focus();
      });
    });

    // clicar no terminal foca o input
    const app = $('#term-app');
    if (app && input && !touch) {
      app.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        input.focus();
      });
    }

    // acesso pelo teclado: "t" abre o terminal
    document.addEventListener('keydown', (e) => {
      const tag = (document.activeElement || {}).tagName || '';
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) return;
      if (e.key === 't' && input && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const rect = out.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          input.focus();
          e.preventDefault();
        }
      }
    });
  }

  /* ---------------- 3. Spotlight do hero ---------------- */
  function initHeroSpot() {
    const hero = $('.hero');
    const spot = $('#hero-spot');
    if (!hero || !spot || reduce || touch) return;
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      spot.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      spot.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    });
  }

  /* ---------------- 4. Parallax do notebook ---------------- */
  function initLaptopTilt() {
    const art = $('.hero__art');
    const laptop = $('#laptop');
    if (!art || !laptop || reduce || touch) return;
    let raf = null;
    art.addEventListener('mousemove', (e) => {
      const r = art.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        laptop.style.setProperty('--ry', (-8 + px * 10).toFixed(2) + 'deg');
        laptop.style.setProperty('--rx', (6 - py * 9).toFixed(2) + 'deg');
      });
    });
    art.addEventListener('mouseleave', () => {
      laptop.style.setProperty('--ry', '-10deg');
      laptop.style.setProperty('--rx', '6deg');
    });
  }

  /* ---------------- 5. Reveals ---------------- */
  function initReveals() {
    const items = $$('.reveal');
    const counter = $('#sb-reveals');
    if (counter) counter.textContent = String(items.length);
    if (!('IntersectionObserver' in window) || reduce) {
      items.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---------------- 6. Números ----------------
     O HTML já entrega o valor final (6, 16, 3, 2+). Quando o bloco entra
     na tela, o número "assenta" a partir de um valor próximo — sem nunca
     voltar a zero, então JS lento (ou ausente) jamais exibe um bug. */
  function initCounters() {
    const nodes = $$('[data-count]');
    if (!nodes.length) return;
    const animate = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      if (reduce) { el.textContent = target + suffix; return; }
      const from = Math.max(0, target - Math.max(2, Math.round(target * 0.3)));
      const dur = 700;
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(from + (target - from) * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(tick);
    };
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
        });
      },
      { threshold: 0.6 }
    );
    nodes.forEach((n) => io.observe(n));
  }

  /* ---------------- 7. Navegação ---------------- */
  function initNav() {
    const nav = $('#nav');
    const progress = $('#progress');
    const burger = $('#burger');
    const mobile = $('#mobile-menu');
    if (!nav) return;

    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.setProperty('--p', max > 0 ? (y / max) * 100 + '%' : '0%');
      nav.classList.toggle('is-scrolled', y > 12);
      // no topo da página nenhuma seção está ativa
      if (y < 140) {
        $$('.nav__links a').forEach((l) => l.classList.remove('is-active'));
        $$('.rail-nav a').forEach((r) => r.classList.remove('is-active'));
      }
      const menuOpen = mobile && mobile.classList.contains('is-open');
      if (!menuOpen) {
        if (y > lastY && y > 260) nav.classList.add('is-hidden');
        else nav.classList.remove('is-hidden');
      }
      lastY = y;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();

    if (burger && mobile) {
      const close = () => {
        mobile.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Abrir menu');
      };
      burger.addEventListener('click', () => {
        const open = mobile.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', String(open));
        burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      });
      $$('a', mobile).forEach((a) => a.addEventListener('click', close));
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    }

    // seções observadas: nav + rail
    const ids = ['sobre', 'experiencia', 'projetos', 'stack', 'formacao', 'contato'];
    const sections = ids.map((id) => ({ id, el: document.getElementById(id) })).filter((s) => s.el);
    const links = $$('.nav__links a');
    const rails = $$('.rail-nav a');

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + id));
            rails.forEach((r) => r.classList.toggle('is-active', r.dataset.rail === id));
          });
        },
        { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
      );
      sections.forEach((s) => io.observe(s.el));
    }
  }

  /* ---------------- 8. Scramble nos links ---------------- */
  function initScramble() {
    if (reduce) return;
    const chars = 'abcdefghijklmnopqrstuvwxyz#/<>_';
    $$('[data-scramble]').forEach((el) => {
      const original = el.textContent.trim();
      let raf = null;
      const start = () => {
        if (raf) cancelAnimationFrame(raf);
        const t0 = performance.now();
        const dur = 380;
        const tick = (now) => {
          const p = (now - t0) / dur;
          if (p >= 1) { el.textContent = original; raf = null; return; }
          let out = '';
          for (let i = 0; i < original.length; i++) {
            const threshold = (i + 1) / (original.length + 2);
            out += p > threshold ? original[i] : chars[Math.floor(Math.random() * chars.length)];
            if (original[i] === ' ') out = out.slice(0, -1) + ' ';
          }
          el.textContent = out;
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      };
      el.addEventListener('mouseenter', start);
      el.addEventListener('focus', start);
    });
  }

  /* ---------------- 9. Botões magnéticos ---------------- */
  function initMagnetic() {
    if (reduce || touch) return;
    $$('[data-magnetic]').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.18;
        const y = (e.clientY - r.top - r.height / 2) * 0.22;
        btn.style.setProperty('--mag-x', x.toFixed(1) + 'px');
        btn.style.setProperty('--mag-y', y.toFixed(1) + 'px');
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.setProperty('--mag-x', '0px');
        btn.style.setProperty('--mag-y', '0px');
      });
    });
  }

  /* ---------------- 10. Tilt dos cards ---------------- */
  function initCardTilt() {
    if (reduce || touch) return;
    $$('.pcard').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          'perspective(1000px) rotateX(' + (-py * 4).toFixed(2) + 'deg) rotateY(' +
          (px * 6).toFixed(2) + 'deg) translateY(-5px)';
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ---------------- 11. Progresso da timeline ---------------- */
  function initTimelineProgress() {
    const tl = $('#timeline');
    const bar = $('#tl-progress');
    if (!tl || !bar) return;
    let ticking = false;
    const update = () => {
      const r = tl.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp((vh * 0.72 - r.top) / (r.height || 1), 0, 1);
      bar.style.transform = 'scaleY(' + p.toFixed(3) + ')';
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------------- 12. Filtros (legado: o Lab substituiu a grade) ---------------- */
  function initFilters() {
    const filters = $$('.filter');
    const cards = $$('.pcard');
    if (!filters.length || !cards.length) return;
    const count = $('#proj-count');
    const total = $('[data-proj-total]');
    if (total) total.textContent = String(cards.length);

    const apply = (key) => {
      let visible = 0;
      cards.forEach((card) => {
        const cats = (card.dataset.cat || '').split(/\s+/);
        const show = key === 'all' || cats.includes(key);
        card.classList.toggle('is-hidden', !show);
        if (show) {
          visible++;
          if (!card.classList.contains('in')) card.classList.add('in');
        }
      });
      if (count) count.textContent = visible === 1 ? '1 projeto' : visible + ' projetos';
    };

    filters.forEach((btn) => {
      btn.addEventListener('click', () => {
        filters.forEach((b) => { b.classList.remove('is-on'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('is-on');
        btn.setAttribute('aria-pressed', 'true');
        apply(btn.dataset.filter);
      });
    });
    apply('all');
  }

  /* ---------------- 13. Dados dos projetos ---------------- */
  // Fonte única de verdade em data.js (carregado antes deste arquivo).
  const PROJECTS = window.PORTFOLIO_PROJECTS || {};

  /* ---------------- 14. Modal ---------------- */
  function initModal() {
    const modal = $('#modal');
    const body = $('#modal-body');
    if (!modal || !body) return;
    let lastFocus = null;

    const badgeCls = (v) => 'badge badge--' + (v || 'blue');
    const iconFor = (k) =>
      k === 'github' ? '#i-github' : k === 'book' ? '#i-book' : k === 'mail' ? '#i-mail' : '#i-external';

    const build = (p) => {
      const badges = p.badges.map((b) => `<span class="${badgeCls(b[1])}">${b[0]}</span>`).join('');
      const metaChips = (p.meta || []).map((m) => `<span class="chip">${m[0]}: ${m[1]}</span>`).join('');
      const metrics = (p.metrics || []).map((m) => `<div class="metric"><b>${m[0]}</b><span>${m[1]}</span></div>`).join('');
      const built = (p.built || []).map((b) => `<li>${b}</li>`).join('');
      const stack = (p.stack || []).map((s) => `<span class="chip">${s}</span>`).join('');
      const links = (p.links || [])
        .map(
          (l) =>
            `<a class="btn btn--ghost btn--sm" href="${l[1]}" target="_blank" rel="noopener noreferrer">` +
            `<svg aria-hidden="true"><use href="${iconFor(l[2])}"/></svg>${l[0]}</a>`
        )
        .join('');

      return `
        <div class="mhead">
          <p class="mhead__kicker">${p.kicker}</p>
          <h2 id="modal-title">${p.title}</h2>
          <p>${p.summary}</p>
          <div class="mhead__meta">${badges}</div>
          ${metaChips ? `<div class="mhead__meta" style="margin-top:6px">${metaChips}</div>` : ''}
        </div>
        <div class="mbody">
          <div class="mblock">
            <h3>Contexto</h3>
            <p>${p.problem}</p>
          </div>
          <div class="mblock">
            <h3>O que eu construí</h3>
            <ul>${built}</ul>
          </div>
          <div class="mblock">
            <h3>Resultado</h3>
            <div class="metrics">${metrics}</div>
            <p style="margin-top:14px">${p.result}</p>
          </div>
          <div class="mblock">
            <h3>Stack</h3>
            <div class="stack-extra" style="margin-top:0">${stack}</div>
          </div>
        </div>
        ${links ? `<div class="mfoot">${links}</div>` : `<div class="mfoot"><span class="chip">código e dados não públicos</span></div>`}
      `;
    };

    const open = (id) => {
      const p = PROJECTS[id];
      if (!p) return;
      lastFocus = document.activeElement;
      body.innerHTML = build(p);
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      const closeBtn = $('.modal__close', modal);
      if (closeBtn) closeBtn.focus();
      history.replaceState(null, '', '#projeto-' + id);
    };

    const close = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
      history.replaceState(null, '', location.pathname + location.search);
    };

    $$('[data-open]').forEach((btn) => {
      btn.addEventListener('click', (e) => { e.preventDefault(); open(btn.dataset.open); });
    });
    $$('[data-close-modal]').forEach((el) => el.addEventListener('click', close));

    // ponte usada pelo Project Lab para abrir o estudo de caso completo
    window.PORTFOLIO_OPEN_CASE = open;

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      const focusables = $$('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])', modal).filter(
        (el) => el.offsetParent !== null
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    if (location.hash.startsWith('#projeto-')) {
      const id = location.hash.replace('#projeto-', '');
      if (PROJECTS[id]) setTimeout(() => open(id), 400);
    }
  }

  /* ---------------- 15. Command palette ---------------- */
  function initPalette() {
    const palette = $('#palette');
    const input = $('#palette-input');
    const list = $('#palette-list');
    const openBtn = $('#palette-open');
    if (!palette || !input || !list) return;

    const items = [
      { label: 'Projetos — Project Lab', hint: '01', href: '#projetos', icon: '#i-code' },
      { label: 'Sobre mim', hint: '02', href: '#sobre', icon: '#i-layers' },
      { label: 'Trajetória profissional', hint: '03', href: '#experiencia', icon: '#i-briefcase' },
      { label: 'Stack técnica', hint: '04', href: '#stack', icon: '#i-cpu' },
      { label: 'Formação e certificações', hint: '05', href: '#formacao', icon: '#i-graduation' },
      { label: 'Contato', hint: '06', href: '#contato', icon: '#i-mail' },
      { label: 'Currículo (versão impressa)', hint: 'PDF', href: 'curriculo.html', icon: '#i-download' },
      { label: 'Modo recrutador', hint: 'atalho R', action: () => toggleRecruiter(), icon: '#i-activity' },
      { label: 'Atalhos de teclado', hint: 'atalho ?', action: () => openShortcuts(), icon: '#i-search' },
      { label: 'Copiar meu e-mail', hint: 'medeirosisaque765@gmail.com', action: () => copyEmail(), icon: '#i-copy' },
      { label: 'BSFM — demo e estudo de caso', hint: 'projeto', action: () => goLab('bsfm'), icon: '#i-sparkles' },
      { label: 'Barbe City Jaraguá v2', hint: 'projeto', action: () => goLab('barbe'), icon: '#i-window' },
      { label: 'Controle de bancada (interno)', hint: 'projeto', action: () => goLab('refresh'), icon: '#i-terminal' },
      { label: 'Motor Híbrido 4DX', hint: 'projeto', action: () => goLab('dx4'), icon: '#i-code' },
      { label: 'SysAcad (C++)', hint: 'projeto', action: () => goLab('sysacad'), icon: '#i-code' },
      { label: 'Climo (protótipo)', hint: 'projeto', action: () => goLab('climo'), icon: '#i-bot' },
      { label: 'GitHub', hint: 'github.com/Isaque-Medeiros', href: 'https://github.com/Isaque-Medeiros', icon: '#i-github', ext: true },
      { label: 'LinkedIn', hint: 'in/isaque-medeiros', href: 'https://www.linkedin.com/in/isaque-medeiros-a99421268/', icon: '#i-linkedin', ext: true },
      { label: 'Enviar e-mail', hint: 'medeirosisaque765@gmail.com', href: 'mailto:medeirosisaque765@gmail.com', icon: '#i-mail' }
    ];

    let filtered = items.slice();
    let selected = 0;

    const toggleRecruiter = () => {
      const btn = $('#rec-toggle');
      if (btn) btn.click();
    };
    const openShortcuts = () => {
      const btn = $('#shortcuts-open');
      if (btn) btn.click();
    };
    const copyEmail = () => {
      const email = 'medeirosisaque765@gmail.com';
      const done = () => { if (window.PORTFOLIO_TOAST) window.PORTFOLIO_TOAST('E-mail copiado.'); };
      if (navigator.clipboard) navigator.clipboard.writeText(email).then(done, done);
      else done();
    };
    const goLab = (id) => {
      close();
      if (window.PORTFOLIO_LAB_SELECT) window.PORTFOLIO_LAB_SELECT(id, true);
      else location.hash = '#projetos';
    };

    const render = () => {
      list.innerHTML = filtered.length
        ? filtered
            .map(
              (it, i) =>
                `<button class="palette__item${i === selected ? ' is-sel' : ''}" type="button" data-i="${i}">` +
                `<span class="pi-ic"><svg aria-hidden="true"><use href="${it.icon}"/></svg></span>` +
                `<span>${it.label}</span><span class="pi-k">${it.hint}</span></button>`
            )
            .join('')
        : '<p class="palette__empty">Nada encontrado por aqui.</p>';
    };

    const open = () => {
      palette.classList.add('is-open');
      document.body.classList.add('is-locked');
      input.value = '';
      filtered = items.slice();
      selected = 0;
      render();
      setTimeout(() => input.focus(), 40);
    };

    const close = () => {
      palette.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      input.value = '';
    };

    const run = (it) => {
      if (!it) return;
      if (it.action) { close(); it.action(); return; }
      close();
      if (it.ext || it.href.startsWith('http') || it.href.startsWith('mailto')) {
        window.open(it.href, it.ext ? '_blank' : '_self', 'noopener');
      } else if (it.href.startsWith('#')) {
        const el = document.querySelector(it.href);
        if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      } else {
        location.href = it.href;
      }
    };

    if (openBtn) openBtn.addEventListener('click', open);

    document.addEventListener('keydown', (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || '');
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        palette.classList.contains('is-open') ? close() : open();
        return;
      }
      if (e.key === '/' && !typing) { e.preventDefault(); open(); return; }
      if (!palette.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selected = (selected + 1) % Math.max(filtered.length, 1);
        render();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        selected = (selected - 1 + filtered.length) % Math.max(filtered.length, 1);
        render();
      }
      if (e.key === 'Enter') { e.preventDefault(); run(filtered[selected]); }
    });

    input.addEventListener('input', () => {
      const q = input.value.toLowerCase().trim();
      filtered = items.filter((it) => (it.label + ' ' + it.hint).toLowerCase().includes(q));
      selected = 0;
      render();
    });

    list.addEventListener('click', (e) => {
      const btn = e.target.closest('.palette__item');
      if (!btn) return;
      run(filtered[Number(btn.dataset.i)]);
    });

    list.addEventListener('mousemove', (e) => {
      const btn = e.target.closest('.palette__item');
      if (!btn) return;
      const i = Number(btn.dataset.i);
      if (i !== selected) { selected = i; render(); }
    });

    palette.addEventListener('click', (e) => { if (e.target === palette) close(); });
  }

  /* ---------------- 16. Copiar / toast ---------------- */
  function initCopy() {
    const toast = $('#toast');
    let timer = null;
    const show = (msg) => {
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add('is-on');
      clearTimeout(timer);
      timer = setTimeout(() => toast.classList.remove('is-on'), 2200);
    };
    window.PORTFOLIO_TOAST = show;

    $$('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const text = btn.dataset.copy;
        try {
          await navigator.clipboard.writeText(text);
        } catch (err) {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); } catch (e) { /* ignora */ }
          ta.remove();
        }
        btn.classList.add('is-done');
        const label = btn.innerHTML;
        btn.innerHTML = '<svg aria-hidden="true"><use href="#i-check"/></svg> Copiado!';
        show('E-mail copiado para a área de transferência.');
        setTimeout(() => {
          btn.classList.remove('is-done');
          btn.innerHTML = label;
        }, 2200);
      });
    });
  }

  /* ---------------- 17. Ano ---------------- */
  function initYear() {
    const el = $('#year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---------------- boot ---------------- */
  function boot() {
    initHeroTitle();
    initTerminal();
    initHeroSpot();
    initLaptopTilt();
    initReveals();
    initCounters();
    initNav();
    initScramble();
    initMagnetic();
    initCardTilt();
    initTimelineProgress();
    initFilters();
    initModal();
    initPalette();
    initCopy();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
