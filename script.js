/* ============================================================
   Isaque Medeiros — Portfólio 2026
   Interações: reveals, terminal, filtros, modal, command palette
   Vanilla JS · sem dependências
   ============================================================ */
(function () {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------------- 1. Estado pronto + título animado ---------------- */
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
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => fitHeroTitle());
    }
  }

  // impede que a headline (nowrap) seja cortada em qualquer largura
  function fitHeroTitle() {
    const title = $('.hero__title');
    if (!title) return;
    title.style.fontSize = '';
    const lines = $$('.line', title);
    if (!lines.length) return;
    // em telas pequenas a linha quebra naturalmente
    if (getComputedStyle(lines[0]).whiteSpace !== 'nowrap') return;
    const start = parseFloat(getComputedStyle(title).fontSize);
    let size = start;
    const overflows = () => lines.some((l) => l.scrollWidth > l.clientWidth + 1);
    let guard = 0;
    while (overflows() && size > 26 && guard < 80) {
      size -= 1;
      title.style.fontSize = size + 'px';
      guard++;
    }
  }

  function debounce(fn, ms) {
    let t = null;
    return function () {
      clearTimeout(t);
      const args = arguments;
      t = setTimeout(() => fn.apply(null, args), ms);
    };
  }

  /* ---------------- 2. Terminal animado ---------------- */
  const TERM_LINES = [
    { c: 'cmd', t: 'npm run deploy -- --prod' },
    { c: 'ok', t: '✓ 9 funções serverless publicadas' },
    { c: 'ok', t: '✓ postgres conectado · neon' },
    { c: 'ok', t: '✓ sessão HttpOnly · scrypt' },
    { c: 'info', t: '→ painel em tempo real no ar' },
    { c: 'ok', t: '● deploy concluído · produção' }
  ];

  async function initTerminal() {
    const term = $('#term');
    if (!term) return;

    const lineEls = TERM_LINES.map((l) => {
      const span = document.createElement('span');
      span.className = 'line ' + l.c;
      span.style.display = 'block';
      return span;
    });

    if (reduce) {
      TERM_LINES.forEach((l, i) => {
        lineEls[i].textContent = l.t;
        term.appendChild(lineEls[i]);
      });
      return;
    }

    const caret = document.createElement('span');
    caret.className = 'cursor';

    for (let i = 0; i < TERM_LINES.length; i++) {
      const el = lineEls[i];
      el.style.opacity = '1';
      term.appendChild(el);
      const text = TERM_LINES[i].t;
      for (let c = 0; c < text.length; c++) {
        el.textContent = text.slice(0, c + 1);
        term.appendChild(caret);
        // acelera depois dos primeiros caracteres
        await delay(i === 0 ? 22 : c < 12 ? 16 : 9);
      }
      el.textContent = text;
      await delay(i === 0 ? 320 : 230);
    }
    caret.remove();
  }

  /* ---------------- 3. Parallax suave do notebook ---------------- */
  function initLaptopTilt() {
    const art = $('.hero__art');
    const laptop = $('#laptop');
    if (!art || !laptop || reduce || window.matchMedia('(hover: none)').matches) return;

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

  /* ---------------- 4. Scroll reveal ---------------- */
  function initReveals() {
    const items = $$('.reveal');
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

  /* ---------------- 5. Números ---------------- */
  function initCounters() {
    const nodes = $$('[data-count]');
    if (!nodes.length) return;

    const animate = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      if (reduce) {
        el.textContent = target + suffix;
        return;
      }
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

    if (!('IntersectionObserver' in window)) {
      nodes.forEach(animate);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animate(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    nodes.forEach((n) => io.observe(n));
  }

  /* ---------------- 6. Navegação ---------------- */
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

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
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
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
      });
    }

    // link ativo
    const links = $$('.nav__links a');
    const sections = links
      .map((a) => {
        const id = a.getAttribute('href');
        const el = id && id.startsWith('#') ? document.getElementById(id.slice(1)) : null;
        return el ? { a, el } : null;
      })
      .filter(Boolean);

    if (sections.length && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            links.forEach((l) => l.classList.remove('is-active'));
            const match = sections.find((s) => s.el === entry.target);
            if (match) match.a.classList.add('is-active');
          });
        },
        { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
      );
      sections.forEach((s) => io.observe(s.el));
    }
  }

  /* ---------------- 7. Filtros de projeto ---------------- */
  function initFilters() {
    const filters = $$('.filter');
    const cards = $$('.pcard');
    const count = $('#proj-count');
    const allCount = $('[data-proj-total]', $('.filter[data-filter="all"]') || document.createElement('span'));
    if (allCount) allCount.textContent = String(cards.length);

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
      if (count) {
        count.textContent = visible === 1 ? '1 projeto' : visible + ' projetos';
      }
    };

    filters.forEach((btn) => {
      btn.addEventListener('click', () => {
        filters.forEach((b) => {
          b.classList.remove('is-on');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-on');
        btn.setAttribute('aria-pressed', 'true');
        apply(btn.dataset.filter);
      });
    });

    apply('all');
  }

  /* ---------------- 8. Dados dos projetos ---------------- */
  const PROJECTS = {
    refresh: {
      kicker: 'Sistema interno · DB4 SERV / TOTVS',
      title: 'Field Refresh 2026 — gestão de bancada em tempo real',
      summary:
        'O projeto Refresh 2026 troca o parque de máquinas da TOTVS em escala. O controle disso vivia em planilha e mensagem: ninguém sabia, em tempo real, onde cada máquina estava, quem era o responsável e o que faltava fazer. Eu construí o sistema que responde a perguntas como essas.',
      badges: [
        ['em produção', 'live'],
        ['PJ · TOTVS', 'blue'],
        ['IA aplicada', 'violet'],
        ['código privado', 'amber']
      ],
      meta: [['Meu papel', 'idealização, arquitetura e desenvolvimento'], ['Ano', '2026'], ['Acesso', 'banco de dados com login e papéis']],
      metrics: [
        ['9', 'funções serverless em produção'],
        ['4', 'papéis de acesso distintos'],
        ['1', 'fonte de verdade: o banco'],
        ['0', 'chave de IA exposta no cliente']
      ],
      problem:
        'A operação de bancada de um refresh de parque envolve dezenas de máquinas em estágios diferentes — recebida, em imagem, em checklist, aguardando peça, pronta, devolvida. Com controle manual, o gerente não conseguia ver gargalo, o analista duplicava trabalho e o histórico se perdia no fim do lote.',
      built: [
        '<strong>Painel operacional em tempo real</strong> com o estado de cada máquina, filtros por SPON/status/data e ordenação.',
        '<strong>Fila por analista</strong> e checklist final liberado para qualquer analista — a regra do processo, não a hierarquia, define quem pode fechar.',
        '<strong>Autenticação completa</strong>: e-mail e senha com scrypt, sessão em cookie HttpOnly com hash no banco, além de login com Google (OAuth 2.0 server-side).',
        '<strong>Quatro papéis</strong> (dev, gerente, analista, cliente) com permissões diferentes e área de administração exclusiva do desenvolvedor.',
        '<strong>Migração de dados</strong> do modelo antigo em JSON para PostgreSQL no Neon, com re-hash automático de senhas legadas no primeiro login.',
        '<strong>Agente de IA “Climo”</strong>: o contexto é montado no servidor a partir do banco, então a resposta nunca vem de dado truncado do navegador — e a chave da IA nunca chega ao cliente.',
        '<strong>Relatórios imprimíveis</strong> em A4, exportação TSV/JSON e layout de impressão dedicado.',
        'Arquitetura ajustada ao limite de <strong>12 serverless functions</strong> do plano Hobby da Vercel, agrupando rotas de autenticação em funções dinâmicas sem mudar as URLs públicas.'
      ],
      result:
        'Um único lugar para enxergar o lote inteiro. O gerente vê o andamento sem perguntar, o analista sabe exatamente o que fazer em seguida e cada máquina tem histórico. Foi o primeiro sistema que eu projetei, documentei e operei com usuário real dentro de uma operação corporativa.',
      stack: ['JavaScript (ES Modules)', 'Node.js', 'PostgreSQL', 'Neon', 'Vercel', 'Chart.js', 'scrypt', 'OAuth 2.0', 'LLM'],
      links: [['Abrir sistema', 'https://refreshtotvs2026.vercel.app', 'external']]
    },

    barbe: {
      kicker: 'Cliente real · barbearia em Jaraguá/SP',
      title: 'Barbe City Jaraguá v2 — agendamento com Pix',
      summary:
        'A barbearia do Anderson controlava a agenda em papel e WhatsApp. A v2 é um sistema completo: o cliente agenda sozinho, paga com Pix e o dono administra horário, preço, promoção e financeiro no mesmo lugar.',
      badges: [
        ['em produção', 'live'],
        ['cliente real', 'amber'],
        ['pagamento Pix', 'violet']
      ],
      meta: [['Meu papel', 'projeto, desenvolvimento e deploy'], ['Ano', '2026'], ['Status', 'rodando com dados migrados']],
      metrics: [
        ['135', 'agendamentos históricos migrados'],
        ['R$ 4.230', 'valor histórico conciliado'],
        ['10', 'serviços cadastrados'],
        ['100%', 'compatível com LGPD']
      ],
      problem:
        'Sem agenda digital, o cliente não sabia o horário livre, o dono perdia receita em horário vago e não havia histórico de quem faltou. Além disso, cobrar no salão significa dinheiro trocado, sem comprovante e sem conciliação.',
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
        'Um negócio de bairro passou a ter agenda online, cobrança com comprovante e indicador financeiro — sem depender de um funcionário para responder mensagem. Foi o projeto em que mais aprendi sobre modelagem relacional, integração de pagamento e o que “produção” realmente significa.',
      stack: ['Node.js 24', 'Express', 'PostgreSQL 18', 'Neon', 'Mercado Pago', 'Google OAuth', 'Brevo', 'WhatsApp Cloud API', 'Vercel', 'bcrypt', 'CSP/Helmet'],
      links: [
        ['Ver site', 'https://barbe-city-jaragua-eta.vercel.app', 'external'],
        ['Código', 'https://github.com/Isaque-Medeiros/BarbeCity-2.0', 'github']
      ]
    },

    bsfm: {
      kicker: 'Projeto integrado · UNIP · 3º semestre',
      title: 'BSFM — Brazilian System of Food Metric',
      summary:
        '“Uma colher de arroz” não é uma medida — é uma estimativa. O BSFM usa visão computacional para reconhecer o alimento na foto e converter medida caseira em gramatura, com acompanhamento nutricional no mesmo lugar.',
      badges: [
        ['.NET 8', 'blue'],
        ['visão computacional', 'violet'],
        ['projeto acadêmico', 'cyan']
      ],
      meta: [['Meu papel', 'backend, API, modelo e documentação'], ['Ano', '2026'], ['Contexto', 'PIM — 3º semestre ADS']],
      metrics: [
        ['.NET 8', 'ASP.NET Core + REST API'],
        ['YOLO', 'detecção de alimento por imagem'],
        ['7', 'módulos funcionais'],
        ['MkDocs', 'documentação publicada']
      ],
      problem:
        'Quem acompanha dieta precisa registrar o que come, mas medir em gramas é chato e impreciso. Os apps existentes exigem busca manual em tabela — e é exatamente aí que o usuário desiste do registro.',
      built: [
        'Backend em <strong>.NET 8 / ASP.NET Core</strong> com arquitetura em camadas e API REST documentada.',
        '<strong>Inferência de visão computacional</strong> com modelo YOLO (ONNX) para identificar itens alimentares na imagem enviada.',
        '<strong>Conversão de medidas caseiras</strong> em gramatura, cruzando a detecção com a base de composição nutricional (USDA).',
        '<strong>Dashboard metabólico</strong> com IMC, TMB e TDEE calculados a partir do perfil do usuário.',
        'Diário alimentar, plano semanal de refeições, controle de consumo de água e <strong>Mapa SOS Saúde</strong> com Leaflet.',
        '<strong>Central LIBRAS</strong> — acessibilidade pensada como requisito, não como extra.',
        'Deploy do backend no Render, frontend na Vercel e documentação técnica completa em <strong>MkDocs Material</strong>.',
        'Desenvolvimento apoiado em <strong>TDD e SDD</strong>, usando modelo de linguagem como par de programação (DeepSeek, GPT e agente CLINE).'
      ],
      result:
        'Nota máxima no projeto integrado e a primeira vez em que coloquei um modelo de machine learning atrás de uma API própria. Aprendi na prática o que é latência de inferência, versionamento de modelo e documentação que outra pessoa consegue seguir.',
      stack: ['.NET 8', 'ASP.NET Core', 'C#', 'ONNX Runtime', 'YOLO', 'PostgreSQL', 'SQLite', 'Render', 'MkDocs', 'Leaflet'],
      links: [
        ['Código', 'https://github.com/Isaque-Medeiros/pim-03semestre-ads', 'github'],
        ['Build mobile', 'https://bsfm-dev-version.vercel.app', 'external']
      ]
    },

    dx4: {
      kicker: 'Automação de processo · operação LATAM',
      title: 'Motor Híbrido 4DX',
      summary:
        'Um formulário operacional com dezenas de campos repetidos, preenchido à mão, dezenas de vezes por dia. Em vez de pedir acesso ao sistema, eu escrevi um bookmarklet que injeta um inspetor de DOM e preenche tudo em um clique.',
      badges: [
        ['impacto em TMA', 'amber'],
        ['JavaScript puro', 'blue'],
        ['sem backend', 'cyan']
      ],
      meta: [['Meu papel', 'concepção e desenvolvimento'], ['Ano', '2025 — 2026'], ['Contexto', 'Konecta · operação LATAM']],
      metrics: [
        ['1', 'clique para executar'],
        ['0', 'instalação necessária'],
        ['DOM', 'injeção + inspetor (Eruda)'],
        ['N2', 'equipe de analistas atendida']
      ],
      problem:
        'O time repetia o mesmo preenchimento em formulários longos, com dados que já estavam em outra tela. Cada digitação era uma chance de erro, e cada erro virava retrabalho e tempo de atendimento maior.',
      built: [
        '<strong>Bookmarklet em JavaScript puro</strong> — sem extensão, sem permissão de administrador, sem instalação.',
        '<strong>Injeção do inspetor de DOM (Eruda)</strong> para ler a estrutura da página e localizar os campos corretos dinamicamente.',
        '<strong>Parsing de tabelas</strong> do sistema de origem e preenchimento automático dos campos de destino.',
        '<strong>Estado em LocalStorage</strong>, permitindo guardar e restaurar o último preenchimento e sincronizar entre abas.',
        'Tratamento de exceção por campo: se o seletor mudou, o script avisa em vez de preencher errado.',
        'Distribuição via atalho no navegador — <strong>adoção sem treinamento formal</strong>, porque o benefício é imediato.'
      ],
      result:
        'Menos digitação, menos retrabalho e curva de aprendizado menor para quem entrava na equipe. Foi a prova prática de que a melhor ferramenta às vezes é a que não precisa de infraestrutura nenhuma: só um navegador e conhecimento de DOM.',
      stack: ['JavaScript', 'DOM API', 'LocalStorage', 'Eruda', 'Bookmarklet'],
      links: []
    },

    sysacad: {
      kicker: 'Estruturas de dados aplicadas · ETEC/UNIP',
      title: 'SysAcad — gestão acadêmica em C++',
      summary:
        'Um sistema acadêmico completo rodando no terminal: login, alunos, matérias, turmas, notas e relatórios — com persistência em arquivo e JSON, escrito em C++ com orientação a objetos.',
      badges: [
        ['C++', 'blue'],
        ['estruturas de dados', 'violet'],
        ['projeto acadêmico', 'cyan']
      ],
      meta: [['Meu papel', 'desenvolvimento solo'], ['Ano', '2026'], ['Contexto', 'trabalho acadêmico']],
      metrics: [
        ['C++', 'linguagem'],
        ['7', 'módulos de dados'],
        ['CRUD', 'alunos, matérias, turmas e notas'],
        ['cJSON', 'persistência e login']
      ],
      problem:
        'O enunciado pedia um sistema de gestão acadêmica com persistência real. A parte difícil não foi a interface de terminal: foi manter consistência entre matrícula, turma, matéria e nota sem banco de dados.',
      built: [
        '<strong>Autenticação</strong> de usuários com cadastro, leitura e escrita em JSON via <strong>cJSON</strong>.',
        '<strong>Structs e vetores</strong> para alunos, matérias e turmas, com validação de entrada e tratamento de erro de digitação.',
        '<strong>CRUD completo</strong> com matrícula única, associação aluno–turma e lançamento de notas com faltas.',
        '<strong>Relatórios</strong> gerados em arquivo texto a partir dos dados em memória.',
        '<strong>Menu hierárquico</strong> com navegação por estado, sem dependência de biblioteca de interface.',
        'Organização em <strong>homepage.cpp</strong> (login) e <strong>funcoes.cpp</strong> (regras), separando responsabilidade.'
      ],
      result:
        'Aprendi na marra por que estrutura de dados importa: cada nova entidade exigia decidir como persistir e como manter tudo coerente. Foi a base que depois facilitou entender modelagem relacional de verdade.',
      stack: ['C++', 'cJSON', 'STL', 'File I/O', 'POO'],
      links: [['Código', 'https://github.com/Isaque-Medeiros/Meus-ProjetosAcad', 'github']]
    },

    climo: {
      kicker: 'IA aplicada · dentro do Refresh 2026',
      title: 'Climo — agente de IA da operação',
      summary:
        'O gerente precisava responder “quantas máquinas deste SPON já fecharam checklist hoje?”. Antes, isso significava abrir três telas. O Climo responde em linguagem natural, com o contexto montado no servidor.',
      badges: [
        ['LLM', 'violet'],
        ['server-side', 'blue'],
        ['em produção', 'live']
      ],
      meta: [['Meu papel', 'arquitetura do contexto e integração'], ['Ano', '2026'], ['Contexto', 'módulo do sistema Refresh']],
      metrics: [
        ['LLM', 'modelo de linguagem'],
        ['servidor', 'contexto montado no backend'],
        ['SQL', 'fonte da verdade'],
        ['Markdown', 'renderização segura']
      ],
      problem:
        'Assistentes de IA que recebem o estado da tela pelo navegador respondem com dado truncado, desatualizado ou inventado. Para uso operacional, isso é pior do que não ter assistente.',
      built: [
        '<strong>Contexto montado no servidor</strong> a partir do banco: todas as máquinas, contagem por dia e a ficha completa do SPON citado na pergunta.',
        '<strong>Chave da IA somente no servidor</strong> — o cliente nunca recebe credencial nem payload bruto.',
        'Rota dedicada <code>POST /api/climo</code> com validação de entrada e limite de tamanho de contexto.',
        '<strong>Renderizador de Markdown seguro</strong> no frontend, sem injeção de HTML arbitrário na resposta do modelo.',
        'Integração com a interface operacional: a resposta referencia as mesmas máquinas do painel, e não uma cópia.',
        'Degradação controlada: se o provedor de IA falhar, o painel continua funcionando.'
      ],
      result:
        'Consulta operacional em linguagem natural sem abrir mão de rastreabilidade — a resposta vem do mesmo banco que o painel usa. Foi onde consolidei a diferença entre “usar IA” e “usar IA com engenharia”.',
      stack: ['LLM API', 'Node.js serverless', 'PostgreSQL', 'Prompt engineering', 'Markdown seguro'],
      links: [['Ver no sistema', 'https://refreshtotvs2026.vercel.app', 'external']]
    }
  };

  /* ---------------- 9. Modal ---------------- */
  function initModal() {
    const modal = $('#modal');
    const body = $('#modal-body');
    if (!modal || !body) return;

    let lastFocus = null;

    const badgeCls = (v) => 'badge badge--' + (v || 'blue');
    const iconFor = (k) => (k === 'github' ? '#i-github' : k === 'mail' ? '#i-mail' : '#i-external');

    const build = (p) => {
      const badges = p.badges.map((b) => `<span class="${badgeCls(b[1])}">${b[0]}</span>`).join('');
      const metaChips = (p.meta || []).map((m) => `<span class="chip">${m[0]}: ${m[1]}</span>`).join('');
      const metrics = (p.metrics || [])
        .map((m) => `<div class="metric"><b>${m[0]}</b><span>${m[1]}</span></div>`)
        .join('');
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
            <h3>Como foi feito</h3>
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
        ${links ? `<div class="mfoot" style="border:0;padding-top:0;margin-top:12px">${links}</div>` : ''}
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
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        open(btn.dataset.open);
      });
    });
    $$('[data-close-modal]').forEach((el) => el.addEventListener('click', close));

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = $$('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])', modal).filter(
        (el) => el.offsetParent !== null
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    // deep link: #projeto-id
    if (location.hash.startsWith('#projeto-')) {
      const id = location.hash.replace('#projeto-', '');
      if (PROJECTS[id]) setTimeout(() => open(id), 400);
    }
  }

  /* ---------------- 10. Command palette ---------------- */
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
      { label: 'Field Refresh 2026 — estudo de caso', hint: 'projeto', action: () => openProject('refresh'), icon: '#i-terminal' },
      { label: 'Barbe City Jaraguá v2 — estudo de caso', hint: 'projeto', action: () => openProject('barbe'), icon: '#i-window' },
      { label: 'BSFM — estudo de caso', hint: 'projeto', action: () => openProject('bsfm'), icon: '#i-sparkles' },
      { label: 'Motor Híbrido 4DX — estudo de caso', hint: 'projeto', action: () => openProject('dx4'), icon: '#i-zap' },
      { label: 'SysAcad — estudo de caso', hint: 'projeto', action: () => openProject('sysacad'), icon: '#i-code' },
      { label: 'Climo IA — estudo de caso', hint: 'projeto', action: () => openProject('climo'), icon: '#i-bot' },
      { label: 'GitHub', hint: 'github.com/Isaque-Medeiros', href: 'https://github.com/Isaque-Medeiros', icon: '#i-github', ext: true },
      { label: 'LinkedIn', hint: 'in/isaque-medeiros', href: 'https://www.linkedin.com/in/isaque-medeiros-a99421268/', icon: '#i-linkedin', ext: true },
      { label: 'Enviar e-mail', hint: 'medeiroisaque765@gmail.com', href: 'mailto:medeiroisaque765@gmail.com', icon: '#i-mail' }
    ];

    let filtered = items.slice();
    let selected = 0;

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

    const openProject = (id) => {
      close();
      const btn = $(`[data-open="${id}"]`);
      if (btn) btn.click();
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
      if (it.action) {
        close();
        it.action();
        return;
      }
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
      if (e.key === '/' && !typing) {
        e.preventDefault();
        open();
        return;
      }
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
      if (e.key === 'Enter') {
        e.preventDefault();
        run(filtered[selected]);
      }
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
      if (i !== selected) {
        selected = i;
        render();
      }
    });

    palette.addEventListener('click', (e) => {
      if (e.target === palette) close();
    });
  }

  /* ---------------- 11. Copiar / toast ---------------- */
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
          try {
            document.execCommand('copy');
          } catch (e) {
            /* ignora */
          }
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

  /* ---------------- 12. Ano no rodapé ---------------- */
  function initYear() {
    const el = $('#year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---------------- boot ---------------- */
  function boot() {
    initHeroTitle();
    initTerminal();
    initLaptopTilt();
    initReveals();
    initCounters();
    initNav();
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
