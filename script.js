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
      { c: 'ok', t: 'e-mail    medeiroisaque765@gmail.com' },
      { c: 'ok', t: 'github    github.com/Isaque-Medeiros' },
      { c: 'ok', t: 'linkedin  in/isaque-medeiros-a99421268' },
      { c: 'dim', t: '→ ou clique em "Falar comigo" no topo' }
    ],
    projetos: [
      { c: 'info', t: 'role até a seção 03 — cada card abre um estudo de caso' },
      { c: 'dim', t: 'inclui o que deu certo e o que não terminou' }
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

  /* ---------------- 6. Números ---------------- */
  function initCounters() {
    const nodes = $$('[data-count]');
    if (!nodes.length) return;
    const animate = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      if (reduce) { el.textContent = target + suffix; return; }
      const dur = 1300;
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (!('IntersectionObserver' in window)) { nodes.forEach(animate); return; }
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

  /* ---------------- 12. Filtros ---------------- */
  function initFilters() {
    const filters = $$('.filter');
    const cards = $$('.pcard');
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
  const PROJECTS = {
    bsfm: {
      kicker: 'Projeto acadêmico · UNIP · PIM 3º semestre',
      title: 'BSFM — Brazilian System of Food Metric',
      summary:
        'Projeto integrador do 3º semestre: uma plataforma que reconhece o alimento pela foto e converte medida caseira em gramatura. Não é produto comercial — é um projeto acadêmico levado até o fim, com aplicação publicada, documentação em MkDocs e código aberto.',
      badges: [['app publicado', 'live'], ['código aberto', 'blue'], ['acadêmico', 'cyan']],
      meta: [['Meu papel', 'backend, API, modelo e documentação'], ['Ano', '2026'], ['Contexto', 'PIM — UNIP']],
      metrics: [
        ['.NET 8', 'API REST publicada'],
        ['YOLO', 'detecção de alimento por imagem'],
        ['3', 'repositórios no projeto'],
        ['MkDocs', 'documentação pública']
      ],
      problem:
        '"Uma colher de arroz" não é uma medida. Quem acompanha dieta precisa registrar o que come, mas medir em gramas é chato e impreciso — e os apps existentes exigem busca manual em tabela, que é exatamente onde o usuário desiste.',
      built: [
        'Backend em <strong>.NET 8 / ASP.NET Core</strong> com arquitetura em camadas e API REST documentada.',
        '<strong>Inferência de visão computacional</strong> com modelo YOLO (ONNX) para identificar itens alimentares na imagem enviada.',
        '<strong>Conversão de medidas caseiras</strong> em gramatura, cruzando a detecção com a base de composição nutricional (USDA).',
        '<strong>Dashboard metabólico</strong> com IMC, TMB e TDEE calculados a partir do perfil do usuário.',
        'Diário alimentar, plano semanal de refeições, controle de consumo de água e <strong>Mapa SOS Saúde</strong> com Leaflet.',
        '<strong>Central LIBRAS</strong> — acessibilidade tratada como requisito, não como extra.',
        'Deploy do backend no <strong>Render</strong> e documentação técnica completa em <strong>MkDocs</strong>, publicada no GitHub Pages.',
        'Desenvolvimento apoiado em <strong>TDD e SDD</strong>, usando modelo de linguagem como par de programação.'
      ],
      result:
        'Foi o projeto em que coloquei, pela primeira vez, um modelo de machine learning atrás de uma API que eu mesmo escrevi — e entendi na prática o que é latência de inferência, versionamento de modelo e documentação que outra pessoa consegue seguir. O app está no ar e a documentação explica como rodar do zero.',
      stack: ['.NET 8', 'ASP.NET Core', 'C#', 'ONNX Runtime', 'YOLO', 'PostgreSQL', 'Render', 'MkDocs', 'Leaflet'],
      links: [
        ['Abrir o app', 'https://bsfm-nutri.onrender.com', 'external'],
        ['Documentação', 'https://brazilian-system-of-food-metric.github.io/software-documentation/', 'book'],
        ['Código', 'https://github.com/Brazilian-System-of-Food-Metric/BSFM-APP', 'github']
      ]
    },

    barbe: {
      kicker: 'Projeto próprio · barbearia em Jaraguá/SP',
      title: 'Barbe City Jaraguá v2 — agendamento com Pix',
      summary:
        'Sistema que desenvolvi para a barbearia do Anderson. Não é um case vendido: é um projeto próprio, rodando no negócio de verdade, com agenda online, pagamento Pix e painel administrativo.',
      badges: [['no ar', 'live'], ['projeto próprio', 'amber'], ['pagamento Pix', 'violet']],
      meta: [['Meu papel', 'projeto, desenvolvimento e deploy'], ['Ano', '2026'], ['Status', 'publicado, com dados migrados']],
      metrics: [
        ['135', 'agendamentos históricos migrados'],
        ['R$ 4.230', 'histórico conciliado'],
        ['10', 'serviços cadastrados'],
        ['LGPD', 'exclusão de dados do cliente']
      ],
      problem:
        'Sem agenda digital, o cliente não sabia o horário livre, o dono perdia receita em horário vago e não havia histórico de quem faltou. Cobrar no salão significa dinheiro trocado, sem comprovante e sem conciliação.',
      built: [
        '<strong>Agendamento com ou sem login</strong>, calendário real de disponibilidade, serviços adicionais e bloqueios de horário.',
        '<strong>Pagamento Pix pelo Mercado Pago</strong> com QR Code, copia-e-cola, webhook e polling de confirmação.',
        '<strong>Promoções</strong> por serviço ou globais, com período de validade, selo de desconto e snapshot no histórico — o preço do dia nunca é reescrito.',
        '<strong>Login em três modos</strong>: e-mail e senha, código de 6 dígitos por e-mail (Brevo) e Google OAuth.',
        '<strong>Área do cliente</strong> com próximos horários, histórico, perfil e exclusão de dados (LGPD).',
        '<strong>Painel administrativo</strong> com dashboard, agenda, serviços, usuários, financeiro, horários, logs e notificações.',
        '<strong>Tema visual gerado por IA</strong>: o dono descreve a decoração, o sistema gera uma máscara sanitizada e aplica com um clique.',
        '<strong>Segurança</strong>: bcrypt custo 12, sessão HttpOnly com hash no banco, CSRF double-submit, helmet/CSP, rate limit e SQL parametrizado.',
        '<strong>Importação do legado</strong> com 135 agendamentos, preservando checksums e sem inventar pagamento para registro antigo.'
      ],
      result:
        'Foi o projeto em que mais aprendi sobre modelagem relacional, integração de pagamento e o que “publicar” realmente significa: webhook que falha, sessão que expira, dado legado que não bate. Ainda é um projeto meu, sem contrato comercial — mas roda com dados reais e eu mantenho.',
      stack: ['Node.js 24', 'Express', 'PostgreSQL 18', 'Neon', 'Mercado Pago', 'Google OAuth', 'Brevo', 'Vercel', 'bcrypt', 'CSP/Helmet'],
      links: [
        ['Ver site', 'https://barbe-city-jaragua-eta.vercel.app', 'external'],
        ['Código', 'https://github.com/Isaque-Medeiros/BarbeCity-2.0', 'github']
      ]
    },

    refresh: {
      kicker: 'Ferramenta interna · equipe de field service',
      title: 'Controle de bancada — Refresh 2026',
      summary:
        'Um painel que eu construí para o time acompanhar o andamento do refresh de máquinas. Não é produto da TOTVS, não foi licenciado e a empresa não tem envolvimento comercial com ele: é uma ferramenta interna, feita por mim, usada pela equipe.',
      badges: [['uso interno', 'amber'], ['sem link público', 'blue'], ['IA aplicada', 'violet']],
      meta: [['Meu papel', 'idealização, desenvolvimento e manutenção'], ['Ano', '2026'], ['Acesso', 'restrito à equipe']],
      metrics: [
        ['9', 'funções serverless'],
        ['4', 'papéis de acesso'],
        ['1', 'fonte de verdade: o banco'],
        ['0', 'chave de IA no navegador']
      ],
      problem:
        'O controle do fluxo era planilha e mensagem: ninguém sabia em tempo real onde cada máquina estava, quem era o responsável e o que faltava fazer. No fim do lote, o histórico se perdia.',
      built: [
        '<strong>Painel em tempo real</strong> com o estado de cada máquina, filtros por contrato, status e data, e ordenação.',
        '<strong>Fila por analista</strong> e checklist final liberado para qualquer analista — a regra do processo, não a hierarquia, define quem pode fechar.',
        '<strong>Autenticação com papéis</strong>: e-mail e senha com scrypt, sessão em cookie HttpOnly com hash no banco e login com Google (OAuth 2.0 server-side).',
        '<strong>Quatro perfis</strong> (desenvolvedor, gestor, analista e cliente) com permissões distintas.',
        '<strong>Migração de dados</strong> do modelo antigo em JSON para PostgreSQL no Neon, com re-hash automático de senhas legadas no primeiro login.',
        '<strong>Relatórios imprimíveis em A4</strong>, exportação TSV/JSON e layout de impressão dedicado.',
        '<strong>Módulo de IA</strong> cujo contexto é montado no servidor, a partir do banco — a chave nunca chega ao cliente.'
      ],
      result:
        'Hoje o time usa para medir o andamento, e isso melhorou o meu próprio trabalho: eu deixei de ser o gargalo da informação. Não passou por comitê nem virou produto — é a prova de que eu consigo pegar um problema de operação, modelar e entregar. Por ser interno, o código e os dados não são públicos.',
      stack: ['JavaScript (ES Modules)', 'Node.js', 'PostgreSQL', 'Neon', 'Vercel', 'Chart.js', 'scrypt', 'OAuth 2.0', 'LLM'],
      links: []
    },

    dx4: {
      kicker: 'Automação própria · operação LATAM (Konecta)',
      title: 'Motor Híbrido 4DX',
      summary:
        'Um bookmarklet que eu usava no meu próprio fluxo de trabalho: em vez de digitar dezenas de campos repetidos, o script lia a tabela de origem e preenchia o formulário em um clique. Apresentei à equipe, mas não houve adoção oficial.',
      badges: [['automação própria', 'violet'], ['JavaScript puro', 'blue'], ['sem repositório', 'amber']],
      meta: [['Meu papel', 'concepção e desenvolvimento'], ['Ano', '2025 — 2026'], ['Contexto', 'Konecta · operação LATAM']],
      metrics: [
        ['1', 'clique para executar'],
        ['0', 'instalação necessária'],
        ['DOM', 'injeção + inspetor (Eruda)'],
        ['LocalStorage', 'estado sincronizado']
      ],
      problem:
        'O time repetia o mesmo preenchimento em formulários longos, com dados que já estavam em outra tela. Cada digitação era uma chance de erro, e cada erro virava retrabalho.',
      built: [
        '<strong>Bookmarklet em JavaScript puro</strong> — sem extensão, sem permissão de administrador, sem instalação.',
        '<strong>Injeção do inspetor de DOM (Eruda)</strong> para ler a estrutura da página e localizar os campos corretamente.',
        '<strong>Parsing de tabelas</strong> do sistema de origem e preenchimento automático dos campos de destino.',
        '<strong>Estado em LocalStorage</strong>, permitindo guardar e restaurar o último preenchimento.',
        'Tratamento de exceção por campo: se o seletor muda, o script avisa em vez de preencher errado.'
      ],
      result:
        'Reduziu a minha digitação e o meu retrabalho enquanto eu estava na operação. Não virou ferramenta oficial da equipe — e tudo bem: a lição que ficou é que a melhor automação às vezes é a que não precisa de infraestrutura nenhuma, só de um navegador e conhecimento de DOM.',
      stack: ['JavaScript', 'DOM API', 'LocalStorage', 'Eruda', 'Bookmarklet'],
      links: []
    },

    sysacad: {
      kicker: 'Trabalho acadêmico · estruturas de dados',
      title: 'SysAcad — gestão acadêmica em C++',
      summary:
        'Sistema acadêmico completo rodando no terminal: login, alunos, matérias, turmas, notas e relatórios — com persistência em arquivo e JSON. O desafio não era a interface, era manter tudo consistente sem banco de dados.',
      badges: [['C++', 'blue'], ['estruturas de dados', 'violet'], ['acadêmico', 'cyan']],
      meta: [['Meu papel', 'desenvolvimento solo'], ['Ano', '2026'], ['Contexto', 'trabalho acadêmico']],
      metrics: [
        ['C++', 'linguagem'],
        ['7', 'módulos de dados'],
        ['CRUD', 'alunos, matérias, turmas e notas'],
        ['cJSON', 'persistência e login']
      ],
      problem:
        'O enunciado pedia um sistema de gestão acadêmica com persistência real. A parte difícil foi manter consistência entre matrícula, turma, matéria e nota sem um banco de dados.',
      built: [
        '<strong>Autenticação</strong> de usuários com cadastro, leitura e escrita em JSON via <strong>cJSON</strong>.',
        '<strong>Structs e vetores</strong> para alunos, matérias e turmas, com validação de entrada e tratamento de erro de digitação.',
        '<strong>CRUD completo</strong> com matrícula única, associação aluno–turma e lançamento de notas com faltas.',
        '<strong>Relatórios</strong> gerados em arquivo texto a partir dos dados em memória.',
        'Organização em <strong>homepage.cpp</strong> (login) e <strong>funcoes.cpp</strong> (regras), separando responsabilidade.'
      ],
      result:
        'Aprendi na marra por que estrutura de dados importa: cada nova entidade exigia decidir como persistir e como manter coerência. Foi a base que depois facilitou entender modelagem relacional de verdade.',
      stack: ['C++', 'cJSON', 'STL', 'File I/O', 'POO'],
      links: [['Código', 'https://github.com/Isaque-Medeiros/Meus-ProjetosAcad', 'github']]
    },

    climo: {
      kicker: 'Protótipo · IA aplicada',
      title: 'Climo — assistente de operação',
      summary:
        'Um chatbot que projetei para consultar procedimentos e códigos de erro da operação em linguagem natural. Não terminei e ele nunca passou por aprovação interna — ficou como estudo de LLM, e é honesto dizer isso.',
      badges: [['protótipo', 'amber'], ['não concluído', 'violet'], ['aprendizado', 'blue']],
      meta: [['Meu papel', 'concepção e protótipo'], ['Ano', '2025 — 2026'], ['Status', 'não concluído']],
      metrics: [
        ['LLM', 'modelo de linguagem'],
        ['servidor', 'contexto montado no backend'],
        ['0', 'chave exposta no cliente'],
        ['—', 'nunca implantado']
      ],
      problem:
        'Responder “qual o procedimento para este código de erro?” exigia procurar em manuais extensos ou perguntar para quem já sabia. O conhecimento ficava concentrado em poucas pessoas.',
      built: [
        'Protótipo de <strong>chat com LLM</strong> alimentado com manuais técnicos e tabelas de contingência da operação.',
        '<strong>Contexto montado no servidor</strong>, a partir de dados reais — a chave da IA nunca iria para o navegador.',
        '<strong>Renderização de Markdown segura</strong> na resposta, sem injeção de HTML arbitrário.',
        'Experimentos de <strong>engenharia de prompt</strong> para melhorar precisão em perguntas de procedimento.'
      ],
      result:
        'Não chegou a ser usado oficialmente e eu não terminei. O que ficou foi o entendimento de como montar contexto no servidor e por que a chave da IA não pode ir para o cliente — conhecimento que apliquei depois na ferramenta de bancada que o time usa hoje.',
      stack: ['LLM API', 'Node.js', 'Prompt engineering', 'Markdown seguro'],
      links: []
    }
  };

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
            <h3>Resultado — sem maquiagem</h3>
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
      { label: 'Sobre mim', hint: '01', href: '#sobre', icon: '#i-layers' },
      { label: 'Experiência profissional', hint: '02', href: '#experiencia', icon: '#i-briefcase' },
      { label: 'Projetos', hint: '03', href: '#projetos', icon: '#i-code' },
      { label: 'Stack técnica', hint: '04', href: '#stack', icon: '#i-cpu' },
      { label: 'Formação e certificações', hint: '05', href: '#formacao', icon: '#i-graduation' },
      { label: 'Contato', hint: '06', href: '#contato', icon: '#i-mail' },
      { label: 'Currículo (versão impressa)', hint: 'PDF', href: 'curriculo.html', icon: '#i-download' },
      { label: 'BSFM — app, docs e código', hint: 'projeto', action: () => openProject('bsfm'), icon: '#i-sparkles' },
      { label: 'Barbe City Jaraguá v2', hint: 'projeto', action: () => openProject('barbe'), icon: '#i-window' },
      { label: 'Controle de bancada (interno)', hint: 'projeto', action: () => openProject('refresh'), icon: '#i-terminal' },
      { label: 'Motor Híbrido 4DX', hint: 'projeto', action: () => openProject('dx4'), icon: '#i-code' },
      { label: 'SysAcad (C++)', hint: 'projeto', action: () => openProject('sysacad'), icon: '#i-code' },
      { label: 'Climo (protótipo)', hint: 'projeto', action: () => openProject('climo'), icon: '#i-bot' },
      { label: 'GitHub', hint: 'github.com/Isaque-Medeiros', href: 'https://github.com/Isaque-Medeiros', icon: '#i-github', ext: true },
      { label: 'LinkedIn', hint: 'in/isaque-medeiros', href: 'https://www.linkedin.com/in/isaque-medeiros-a99421268/', icon: '#i-linkedin', ext: true },
      { label: 'Enviar e-mail', hint: 'medeiroisaque765@gmail.com', href: 'mailto:medeiroisaque765@gmail.com', icon: '#i-mail' }
    ];

    let filtered = items.slice();
    let selected = 0;

    const openProject = (id) => {
      close();
      const btn = $(`[data-open="${id}"]`);
      if (btn) btn.click();
    };

    const render = () => {
      list.innerHTML = filtered.length
        ? filtered
            .map(
              (it, i) =>
                `<button class="palette__item${i === selected ? ' is-sel' : ''}" data-i="${i}">` +
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
