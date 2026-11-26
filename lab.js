/* ============================================================
   Project Lab — índice, palco, abas e as seis demos
   Vanilla JS · sem dependências · acessível por teclado
   Todas as demos são simulações locais (sem backend).
   ============================================================ */
(function () {
  'use strict';

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const P = window.PORTFOLIO_PROJECTS;
  const ORDER = window.PORTFOLIO_ORDER;
  if (!P || !ORDER) return;

  const esc = (s) =>
    String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const icon = (id, cls) => '<svg aria-hidden="true"' + (cls ? ' class="' + cls + '"' : '') + '><use href="#i-' + id + '"/></svg>';
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ============================================================
     1. Diagrama de arquitetura (SVG gerado a partir dos dados)
     ============================================================ */
  function renderArch(p) {
    const cols = p.arch || [];
    if (!cols.length) return '';
    const W = 760;
    const H = 264;
    const n = cols.length;
    const colW = n <= 3 ? 190 : 152;
    const gap = (W - n * colW) / (n + 1);
    const maxItems = Math.max(...cols.map((c) => c.items.length));
    const boxH = 30;
    const boxGap = 8;
    const startY = 60;
    const svg = [];

    cols.forEach((col, i) => {
      const x = gap + i * (colW + gap);
      svg.push(
        `<text x="${x + colW / 2}" y="30" text-anchor="middle" class="arch__cap">${esc(col.t)}</text>`
      );
      // moldura da coluna
      const frameH = maxItems * (boxH + boxGap) + 18;
      svg.push(
        `<rect x="${x - 8}" y="42" width="${colW + 16}" height="${frameH}" rx="14" class="arch__frame"/>`
      );
      col.items.forEach((it, j) => {
        const y = startY + 6 + j * (boxH + boxGap);
        svg.push(
          `<g class="arch__node"><rect x="${x}" y="${y}" width="${colW}" height="${boxH}" rx="9" class="arch__box"/>` +
            `<circle cx="${x + 14}" cy="${y + boxH / 2}" r="3.2" class="arch__dot"/>` +
            `<text x="${x + 26}" y="${y + boxH / 2 + 4}" class="arch__label">${esc(it)}</text></g>`
        );
      });
      // fluxo até a próxima coluna
      if (i < n - 1) {
        const x1 = x + colW + 8;
        const x2 = gap + (i + 1) * (colW + gap) - 8;
        const yMid = startY + 6 + (Math.min(col.items.length, maxItems) * (boxH + boxGap)) / 2 - boxGap / 2;
        svg.push(
          `<path d="M${x1} ${yMid} H${x2}" class="arch__flow"/>` +
            `<path d="M${x2 - 7} ${yMid - 4} l7 4 -7 4" class="arch__head"/>`
        );
      }
    });

    return (
      `<svg class="arch" viewBox="0 0 ${W} ${H}" role="img" aria-label="Fluxo de arquitetura do projeto ${esc(p.name)}">` +
      svg.join('') +
      '</svg>'
    );
  }

  /* ============================================================
     2. Demos
     ============================================================ */

  const DEMOS = {};

  /* ---------- 2.1 BSFM · detectar alimento e converter medida ---------- */
  DEMOS.bsfm = function (root) {
    const FOODS = [
      { id: 'arroz', name: 'Arroz branco', conf: 0.94, x: 20, y: 32, w: 25, h: 26, g: 25, kcal: 130, prot: 2.7, tone: 'a' },
      { id: 'feijao', name: 'Feijão carioca', conf: 0.89, x: 56, y: 35, w: 19, h: 22, g: 20, kcal: 76, prot: 4.8, tone: 'b' },
      { id: 'frango', name: 'Frango grelhado', conf: 0.92, x: 25, y: 62, w: 21, h: 21, g: 18, kcal: 165, prot: 31, tone: 'c' },
      { id: 'salada', name: 'Salada verde', conf: 0.81, x: 55, y: 63, w: 20, h: 19, g: 8, kcal: 25, prot: 1.5, tone: 'd' }
    ];
    const UNITS = [
      { id: 'colher', label: 'colher de sopa', mult: 1 },
      { id: 'concha', label: 'concha', mult: 4 },
      { id: 'xicara', label: 'xícara', mult: 8 }
    ];
    const state = { detected: false, unit: 'colher', off: new Set() };

    root.innerHTML = `
      <div class="demo demo--bsfm">
        <div class="demo__grid">
          <div class="bsfm__shot" id="bsfm-shot">
            <div class="bsfm__frame">
            <svg viewBox="0 0 400 260" aria-hidden="true">
              <defs>
                <radialGradient id="plate" cx="50%" cy="40%" r="64%">
                  <stop offset="0" stop-color="#12212a"/><stop offset="1" stop-color="#070f14"/>
                </radialGradient>
                <radialGradient id="rice" cx="42%" cy="36%" r="70%">
                  <stop offset="0" stop-color="#eef2e2"/><stop offset="1" stop-color="#b9c7a6"/>
                </radialGradient>
                <radialGradient id="bean" cx="40%" cy="34%" r="72%">
                  <stop offset="0" stop-color="#a9784a"/><stop offset="1" stop-color="#5c3a1f"/>
                </radialGradient>
                <linearGradient id="grill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#c99468"/><stop offset="1" stop-color="#8b5b34"/>
                </linearGradient>
              </defs>
              <rect width="400" height="260" fill="#070d12"/>
              <ellipse cx="200" cy="146" rx="152" ry="106" fill="url(#plate)" stroke="#1e3a44"/>
              <ellipse cx="200" cy="146" rx="126" ry="84" fill="none" stroke="#16303a" stroke-dasharray="2 8"/>

              <!-- arroz -->
              <g class="bsfm-food bsfm-food--a">
                <ellipse cx="128" cy="118" rx="48" ry="32" fill="url(#rice)"/>
                <g fill="#ffffff" opacity=".55">
                  <ellipse cx="112" cy="106" rx="4.4" ry="2.4" transform="rotate(-22 112 106)"/>
                  <ellipse cx="128" cy="100" rx="4.4" ry="2.4" transform="rotate(-12 128 100)"/>
                  <ellipse cx="144" cy="108" rx="4.4" ry="2.4" transform="rotate(16 144 108)"/>
                  <ellipse cx="106" cy="122" rx="4.4" ry="2.4" transform="rotate(-28 106 122)"/>
                  <ellipse cx="122" cy="118" rx="4.4" ry="2.4" transform="rotate(-6 122 118)"/>
                  <ellipse cx="140" cy="122" rx="4.4" ry="2.4" transform="rotate(10 140 122)"/>
                  <ellipse cx="118" cy="132" rx="4.4" ry="2.4" transform="rotate(-18 118 132)"/>
                  <ellipse cx="136" cy="134" rx="4.4" ry="2.4" transform="rotate(6 136 134)"/>
                  <ellipse cx="152" cy="124" rx="4" ry="2.2" transform="rotate(24 152 124)"/>
                </g>
              </g>

              <!-- feijão -->
              <g class="bsfm-food bsfm-food--b">
                <ellipse cx="262" cy="120" rx="38" ry="28" fill="url(#bean)"/>
                <g fill="#3d2512" opacity=".75">
                  <ellipse cx="248" cy="112" rx="5.4" ry="3.6" transform="rotate(-20 248 112)"/>
                  <ellipse cx="266" cy="108" rx="5.4" ry="3.6" transform="rotate(8 266 108)"/>
                  <ellipse cx="280" cy="120" rx="5.4" ry="3.6" transform="rotate(22 280 120)"/>
                  <ellipse cx="254" cy="126" rx="5.4" ry="3.6" transform="rotate(-6 254 126)"/>
                  <ellipse cx="270" cy="130" rx="5.4" ry="3.6" transform="rotate(14 270 130)"/>
                  <ellipse cx="240" cy="122" rx="4.6" ry="3" transform="rotate(-14 240 122)"/>
                </g>
              </g>

              <!-- frango grelhado -->
              <g class="bsfm-food bsfm-food--c">
                <ellipse cx="142" cy="188" rx="42" ry="26" fill="url(#grill)"/>
                <g stroke="#5c3a1f" stroke-width="2.6" stroke-linecap="round" opacity=".55" fill="none">
                  <path d="M112 180h58"/><path d="M110 188h62"/><path d="M112 196h58"/>
                </g>
              </g>

              <!-- salada -->
              <g class="bsfm-food bsfm-food--d">
                <ellipse cx="262" cy="190" rx="40" ry="24" fill="#3f6b3c"/>
                <g fill="#5f9a55" opacity=".95">
                  <path d="M242 184c8-12 20-10 22 0-8 8-16 8-22 0Z"/>
                  <path d="M258 178c10-10 21-6 22 4-9 7-17 5-22-4Z"/>
                  <path d="M250 196c9-8 19-4 20 5-9 6-16 3-20-5Z"/>
                  <path d="M266 192c9-8 19-4 20 5-9 6-16 3-20-5Z"/>
                </g>
              </g>
            </svg>
            <div class="bsfm__boxes" id="bsfm-boxes" aria-hidden="true"></div>
            </div>
            <div class="bsfm__tools">
              <button class="demo__btn demo__btn--primary" id="bsfm-scan" type="button">
                ${icon('sparkles')} Analisar foto
              </button>
              <span class="demo__note">simulação local · sem backend</span>
            </div>
          </div>

          <div class="bsfm__side">
            <div class="bsfm__unit" role="group" aria-label="Medida caseira">
              ${UNITS.map(
                (u) =>
                  `<button class="chip chip--pick${u.id === 'colher' ? ' is-on' : ''}" data-unit="${u.id}" type="button">${u.label}</button>`
              ).join('')}
            </div>
            <ul class="bsfm__list" id="bsfm-list"></ul>
            <div class="bsfm__total" aria-live="polite" id="bsfm-total">
              <span class="bsfm__total-l">Total estimado</span>
              <strong>— kcal</strong>
            </div>
            <p class="demo__hint" id="bsfm-hint">Clique em &ldquo;Analisar foto&rdquo; para detectar os alimentos do prato.</p>
          </div>
        </div>
      </div>`;

    const boxes = $('#bsfm-boxes', root);
    const list = $('#bsfm-list', root);
    const total = $('#bsfm-total', root);
    const hint = $('#bsfm-hint', root);
    const scan = $('#bsfm-scan', root);

    const compute = () => {
      const u = UNITS.find((x) => x.id === state.unit);
      let kcal = 0;
      let prot = 0;
      const items = FOODS.filter((f) => !state.off.has(f.id)).map((f) => {
        const grams = Math.round(f.g * u.mult);
        const k = Math.round((f.kcal * grams) / 100);
        const pr = +(((f.prot * grams) / 100).toFixed(1));
        kcal += k;
        prot += pr;
        return { ...f, grams, k, pr };
      });
      return { items, kcal, prot, unitLabel: u.label };
    };

    const paint = () => {
      const { items, kcal, prot, unitLabel } = compute();
      list.innerHTML = items.length
        ? items
            .map(
              (f) =>
                `<li class="bsfm__row" data-food="${f.id}">
                   <button class="bsfm__x" type="button" data-off="${f.id}" aria-label="Remover ${esc(f.name)}">${icon('x')}</button>
                   <span class="bsfm__name">${esc(f.name)}</span>
                   <span class="bsfm__g">${f.grams} g</span>
                   <span class="bsfm__k">${f.k} kcal</span>
                 </li>`
            )
            .join('')
        : '<li class="bsfm__empty">Nenhum alimento selecionado.</li>';
      total.innerHTML =
        `<span class="bsfm__total-l">Total · ${esc(unitLabel)}</span>` +
        `<strong>${kcal} kcal</strong><small>${prot.toFixed(1)} g de proteína</small>`;
      hint.textContent = items.length
        ? 'Conversão por densidade do alimento. Toque no × para remover um item.'
        : 'Todos os itens foram removidos. Recarregue a demo para voltar.';
    };

    const detect = async () => {
      state.detected = true;
      boxes.innerHTML = '';
      scan.disabled = true;
      for (const f of FOODS) {
        boxes.insertAdjacentHTML(
          'beforeend',
          `<div class="bsfm__box bsfm__box--${f.tone}" style="left:${f.x}%;top:${f.y}%;width:${f.w}%;height:${f.h}%">
             <span class="bsfm__box-l">${esc(f.name.split(' ')[0])} ${f.conf.toFixed(2)}</span>
           </div>`
        );
        if (!reduce) await wait(260);
      }
      scan.disabled = false;
      scan.innerHTML = icon('check') + ' Detecção refeita';
      paint();
    };

    scan.addEventListener('click', detect);
    root.querySelectorAll('[data-unit]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.unit = btn.dataset.unit;
        root.querySelectorAll('[data-unit]').forEach((b) => b.classList.toggle('is-on', b === btn));
        paint();
      });
    });
    list.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-off]');
      if (!btn) return;
      state.off.add(btn.dataset.off);
      paint();
    });

    paint();
  };

  /* ---------- 2.2 Barbe City · agenda + Pix ---------- */
  DEMOS.barbe = function (root) {
    const SERVICES = [
      { id: 'corte', name: 'Corte', price: 45, min: 40 },
      { id: 'barba', name: 'Barba', price: 35, min: 30 },
      { id: 'combo', name: 'Corte + Barba', price: 70, min: 60 },
      { id: 'hidra', name: 'Hidratação', price: 50, min: 40 }
    ];
    const DAYS = [
      { d: 'Ter', n: '24' }, { d: 'Qua', n: '25' }, { d: 'Qui', n: '26' },
      { d: 'Sex', n: '27' }, { d: 'Sáb', n: '28' }
    ];
    const SLOTS = ['13:00', '13:40', '14:20', '15:00', '15:40', '16:20', '17:00', '17:40', '18:20', '19:00', '19:40'];
    const state = { picked: new Set(['combo']), day: 1, slot: null, step: 1 };

    const busy = (day, slotIdx) => (slotIdx * 7 + day * 3) % 5 === 0 || (day === 4 && slotIdx < 3);
    const money = (v) => 'R$ ' + v.toFixed(2).replace('.', ',');
    const total = () => SERVICES.filter((s) => state.picked.has(s.id)).reduce((a, s) => a + s.price, 0);
    const minutes = () => SERVICES.filter((s) => state.picked.has(s.id)).reduce((a, s) => a + s.min, 0);

    const render = () => {
      if (state.step === 3) {
        const code = 'PIX' + (1000 + total()) + 'BCJ';
        root.innerHTML = `
          <div class="demo demo--barbe">
            <div class="barbe__done" aria-live="polite">
              <span class="barbe__done-ic">${icon('check')}</span>
              <h4>Agendamento confirmado</h4>
              <p><strong>${state.slot}</strong> · ${DAYS[state.day].d} ${DAYS[state.day].n} · ${money(total())} pago via Pix</p>
              <p class="barbe__code">código ${esc(code)}</p>
              <button class="demo__btn" type="button" data-reset>Simular outro agendamento</button>
            </div>
          </div>`;
        root.querySelector('[data-reset]').addEventListener('click', () => {
          state.picked = new Set(['combo']); state.day = 1; state.slot = null; state.step = 1; render();
        });
        return;
      }

      if (state.step === 2) {
        let seed = 7;
        const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
        const cells = [];
        const inFinder = (x, y) => (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
        for (let y = 0; y < 21; y++) {
          for (let x = 0; x < 21; x++) {
            if (inFinder(x, y)) continue;
            if (rnd() > 0.52) cells.push(`<rect x="${x * 8}" y="${y * 8}" width="8" height="8"/>`);
          }
        }
        const finder = (ox, oy) =>
          `<rect x="${ox * 8}" y="${oy * 8}" width="56" height="56" fill="#fff"/>` +
          `<rect x="${ox * 8}" y="${oy * 8}" width="56" height="56" fill="none" stroke="#06121a" stroke-width="8"/>` +
          `<rect x="${(ox + 2) * 8}" y="${(oy + 2) * 8}" width="24" height="24" fill="#06121a"/>`;
        root.innerHTML = `
          <div class="demo demo--barbe">
            <div class="barbe__pay">
              <div class="barbe__qr" aria-label="QR Code Pix simulado">
                <svg viewBox="0 0 168 168" role="img" aria-hidden="true">
                  <rect width="168" height="168" fill="#fff"/>
                  <g fill="#06121a">${cells.join('')}</g>
                  ${finder(0, 0)}${finder(14, 0)}${finder(0, 14)}
                </svg>
              </div>
              <div class="barbe__pay-info">
                <p class="demo__note">Pix simulado · nenhum valor é cobrado</p>
                <h4>${money(total())} · ${minutes()} min</h4>
                <p>${SERVICES.filter((s) => state.picked.has(s.id)).map((s) => s.name).join(' + ')}<br>
                   <strong>${state.slot} · ${DAYS[state.day].d} ${DAYS[state.day].n}</strong></p>
                <button class="demo__btn demo__btn--primary" type="button" data-pay>${icon('check')} Simular pagamento aprovado</button>
                <button class="demo__btn" type="button" data-back>Voltar</button>
              </div>
            </div>
          </div>`;
        root.querySelector('[data-pay]').addEventListener('click', () => { state.step = 3; render(); });
        root.querySelector('[data-back]').addEventListener('click', () => { state.step = 1; render(); });
        return;
      }

      root.innerHTML = `
        <div class="demo demo--barbe">
          <div class="barbe__flow">
            <div class="barbe__block">
              <p class="demo__label">1 · Serviços</p>
              <div class="barbe__services">
                ${SERVICES.map(
                  (s) =>
                    `<button class="barbe__svc${state.picked.has(s.id) ? ' is-on' : ''}" type="button" data-svc="${s.id}" aria-pressed="${state.picked.has(s.id)}">
                       <span>${s.name}</span><small>${money(s.price)} · ${s.min} min</small>
                     </button>`
                ).join('')}
              </div>
            </div>
            <div class="barbe__block">
              <p class="demo__label">2 · Dia</p>
              <div class="barbe__days">
                ${DAYS.map(
                  (d, i) =>
                    `<button class="barbe__day${i === state.day ? ' is-on' : ''}" type="button" data-day="${i}" aria-pressed="${i === state.day}">
                       <small>${d.d}</small><strong>${d.n}</strong>
                     </button>`
                ).join('')}
              </div>
            </div>
            <div class="barbe__block">
              <p class="demo__label">3 · Horário</p>
              <div class="barbe__slots">
                ${SLOTS.map((s, i) => {
                  const blocked = busy(state.day, i);
                  return `<button class="barbe__slot${state.slot === s ? ' is-on' : ''}" type="button" data-slot="${s}"
                    ${blocked ? 'disabled aria-label="' + s + ' indisponível"' : ''}>${s}</button>`;
                }).join('')}
              </div>
            </div>
          </div>
          <div class="barbe__bar">
            <span class="barbe__sum"><small>total</small><strong>${money(total())}</strong> · ${minutes()} min</span>
            <button class="demo__btn demo__btn--primary" type="button" data-go ${state.slot ? '' : 'disabled'}>
              ${state.slot ? 'Ir para o pagamento' : 'Escolha um horário'} ${icon('arrow-right')}
            </button>
          </div>
        </div>`;

      root.querySelectorAll('[data-svc]').forEach((b) =>
        b.addEventListener('click', () => {
          const id = b.dataset.svc;
          if (id === 'combo') {
            // combo substitui corte/barba avulsos
            state.picked.delete('corte');
            state.picked.delete('barba');
            state.picked.has('combo') ? state.picked.delete('combo') : state.picked.add('combo');
          } else {
            state.picked.delete('combo');
            state.picked.has(id) ? state.picked.delete(id) : state.picked.add(id);
          }
          if (!state.picked.size) state.picked.add('combo');
          render();
        })
      );
      root.querySelectorAll('[data-day]').forEach((b) =>
        b.addEventListener('click', () => { state.day = +b.dataset.day; state.slot = null; render(); })
      );
      root.querySelectorAll('[data-slot]').forEach((b) =>
        b.addEventListener('click', () => { state.slot = b.dataset.slot; render(); })
      );
      root.querySelector('[data-go]').addEventListener('click', () => { state.step = 2; render(); });
    };

    render();
  };

  /* ---------- 2.3 Refresh 2026 · kanban de bancada ---------- */
  DEMOS.refresh = function (root) {
    const STAGES = ['Recebido', 'Imagem', 'Sanitização', 'Pronto'];
    const initial = [
      { spon: 'SPON-1042', owner: 'A. Lima', stage: 0 },
      { spon: 'SPON-1051', owner: 'R. Dias', stage: 0 },
      { spon: 'SPON-1033', owner: 'A. Lima', stage: 1 },
      { spon: 'SPON-1088', owner: 'M. Reis', stage: 1 },
      { spon: 'SPON-1017', owner: 'R. Dias', stage: 2 },
      { spon: 'SPON-1095', owner: 'M. Reis', stage: 3 }
    ];
    let machines = initial.map((m) => ({ ...m }));

    const render = (msg) => {
      const done = machines.filter((m) => m.stage === 3).length;
      const pct = Math.round((done / machines.length) * 100);
      root.innerHTML = `
        <div class="demo demo--refresh">
          <div class="refresh__kpis">
            <div class="refresh__kpi"><small>máquinas</small><strong>${machines.length}</strong></div>
            <div class="refresh__kpi"><small>prontas</small><strong>${done}</strong></div>
            <div class="refresh__kpi"><small>progresso</small><strong>${pct}%</strong></div>
            <div class="refresh__kpi refresh__kpi--wide">
              <small>avanço do lote</small>
              <div class="refresh__track"><i style="--p:${pct}%"></i></div>
            </div>
          </div>
          <div class="refresh__board" role="group" aria-label="Máquinas por etapa">
            ${STAGES.map(
              (s, i) => `
              <div class="refresh__col" data-stage="${i}">
                <p class="refresh__col-h">${s}<span>${machines.filter((m) => m.stage === i).length}</span></p>
                ${machines
                  .filter((m) => m.stage === i)
                  .map(
                    (m) => `
                    <button class="refresh__card" type="button" data-card="${m.spon}" ${i === 3 ? 'disabled' : ''}
                      aria-label="Máquina ${m.spon} de ${esc(m.owner)}, etapa ${s}. ${i === 3 ? 'Concluída' : 'Avançar etapa'}.">
                      <span class="refresh__spon">${m.spon}</span>
                      <span class="refresh__owner">${esc(m.owner)}</span>
                      ${i === 3 ? '<span class="refresh__ok">' + icon('check') + '</span>' : '<span class="refresh__next">' + icon('arrow-right') + '</span>'}
                    </button>`
                  )
                  .join('')}
              </div>`
            ).join('')}
          </div>
          <div class="refresh__foot">
            <p class="demo__hint" id="refresh-msg" aria-live="polite">${msg || 'Clique numa máquina para avançar a etapa. Qualquer analista pode fechar o checklist.'}</p>
            <button class="demo__btn" type="button" data-reset>Reiniciar lote</button>
          </div>
        </div>`;

      root.querySelectorAll('[data-card]').forEach((btn) =>
        btn.addEventListener('click', () => {
          const m = machines.find((x) => x.spon === btn.dataset.card);
          if (!m || m.stage >= 3) return;
          m.stage++;
          render(`${m.spon} → ${STAGES[m.stage]}${m.stage === 3 ? ' · checklist final concluído' : ''}`);
        })
      );
      root.querySelector('[data-reset]').addEventListener('click', () => {
        machines = initial.map((m) => ({ ...m }));
        render('Lote reiniciado.');
      });
    };

    render();
  };

  /* ---------- 2.4 4DX · preenchimento automático ---------- */
  DEMOS.dx4 = function (root) {
    const ROWS = [
      { id: 'LA-4821', pax: 'M. SOUZA', trecho: 'GRU → SCL', motivo: 'REMARCACAO', valor: '1240.00', obs: 'CIENTE TARIFA' },
      { id: 'LA-4835', pax: 'J. PEREIRA', trecho: 'SCL → GRU', motivo: 'NO_SHOW', valor: '890.00', obs: 'REACOMODADO' },
      { id: 'LA-4840', pax: 'A. NUNES', trecho: 'GRU → EZE', motivo: 'CANCELAMENTO', valor: '2110.00', obs: 'REEMBOLSO PARCIAL' }
    ];
    const FIELDS = [
      ['Protocolo', 'id'], ['Passageiro', 'pax'], ['Trecho', 'trecho'],
      ['Motivo', 'motivo'], ['Valor', 'valor'], ['Observação', 'obs']
    ];
    let sel = 0;
    let running = false;

    const render = (filled, log) => {
      root.innerHTML = `
        <div class="demo demo--dx4">
          <div class="dx4__grid">
            <div class="dx4__src">
              <p class="demo__label">Sistema de origem (tabela)</p>
              <div class="dx4__table" role="table" aria-label="Atendimentos na origem">
                <div class="dx4__thead" role="row"><span>ticket</span><span>pax</span><span>motivo</span></div>
                ${ROWS.map(
                  (r, i) =>
                    `<button class="dx4__row${i === sel ? ' is-on' : ''}" role="row" type="button" data-row="${i}" aria-pressed="${i === sel}">
                       <span>${r.id}</span><span>${r.pax}</span><span>${r.motivo}</span>
                     </button>`
                ).join('')}
              </div>
              <button class="demo__btn demo__btn--primary dx4__run" type="button" data-run ${running ? 'disabled' : ''}>
                ${icon('play')} ${running ? 'Executando⬦' : 'Executar 4DX'}
              </button>
            </div>
            <div class="dx4__dst">
              <p class="demo__label">Formulário de destino</p>
              ${FIELDS.map(
                ([label, key], i) => `
                <label class="dx4__field">
                  <span>${label}</span>
                  <input type="text" readonly value="${filled && filled[key] != null ? esc(filled[key]) : ''}"
                    placeholder="—" tabindex="-1" data-field="${key}" data-i="${i}">
                </label>`
              ).join('')}
              <p class="dx4__log" id="dx4-log" aria-live="polite">${(log || []).join('<br>')}</p>
            </div>
          </div>
        </div>`;

      root.querySelectorAll('[data-row]').forEach((b) =>
        b.addEventListener('click', () => { if (running) return; sel = +b.dataset.row; render(null, ['linha selecionada: ' + ROWS[sel].id]); })
      );
      root.querySelector('[data-run]').addEventListener('click', run);
    };

    const run = async () => {
      if (running) return;
      running = true;
      const row = ROWS[sel];
      const filled = {};
      const log = ['lendo tabela⬦', '6 campos mapeados'];
      render(filled, log);
      let keys = 0;
      for (const [label, key] of FIELDS) {
        if (reduce) {
          filled[key] = row[key];
          keys += String(row[key]).length;
          continue;
        }
        const input = root.querySelector('[data-field="' + key + '"]');
        const full = String(row[key]);
        filled[key] = '';
        for (let i = 0; i < full.length; i++) {
          filled[key] = full.slice(0, i + 1);
          input.value = filled[key];
          keys++;
          await wait(full.length > 12 ? 9 : 16);
        }
        input.classList.add('is-filled');
        await wait(90);
      }
      running = false;
      render(filled, [
        '✓ ' + FIELDS.length + ' campos preenchidos em 1 clique',
        '✓ ' + keys + ' teclas economizadas',
        '✓ 0 validações falharam'
      ]);
    };

    render(null, []);
  };

  /* ---------- 2.5 SysAcad · terminal C++ ---------- */
  DEMOS.sysacad = function (root) {
    const ALUNOS = [
      { mat: '2026001', nome: 'Ana Beatriz', media: 9.5 },
      { mat: '2026002', nome: 'Carlos Eduardo', media: 8.1 },
      { mat: '2026003', nome: 'Juliana Prado', media: 7.4 },
      { mat: '2026004', nome: 'Rafael Lima', media: 6.8 }
    ];
    let lines = [
      '=== SISTEMA DE GESTÃO ACADÊMICA ===',
      '1 - Alunos   2 - Notas   3 - Relatórios   0 - Sair'
    ];
    let pendingNote = null;

    const paint = () => {
      root.innerHTML = `
        <div class="demo demo--sysacad">
          <div class="sys__term">
            <div class="sys__bar"><i></i><i></i><i></i><span>SysAcad.exe — IETEP</span></div>
            <div class="sys__out" id="sys-out" aria-live="polite">${lines.map((l) => `<span>${esc(l)}</span>`).join('')}</div>
            <div class="sys__menu">
              <button type="button" data-cmd="1">1 · Alunos</button>
              <button type="button" data-cmd="2">2 · Notas</button>
              <button type="button" data-cmd="3">3 · Relatório</button>
              <button type="button" data-cmd="0">0 · Sair</button>
            </div>
          </div>
          <div class="sys__side">
            <p class="demo__note">simulação · o binário original é C++ de console</p>
            <p class="demo__hint">Menu real do trabalho: structs, vetores e persistência em JSON via cJSON. Cada opção imprime o que o programa imprimiria.</p>
          </div>
        </div>`;

      const out = $('#sys-out', root);
      out.scrollTop = out.scrollHeight;
      root.querySelectorAll('[data-cmd]').forEach((b) =>
        b.addEventListener('click', () => {
          const c = b.dataset.cmd;
          if (c === '1') {
            lines.push('', 'matrícula  nome                 média');
            ALUNOS.forEach((a) => lines.push(`${a.mat}    ${a.nome.padEnd(20)} ${a.media.toFixed(1)}`));
          } else if (c === '2') {
            const a = ALUNOS[lines.length % ALUNOS.length];
            const nova = Math.min(10, +(a.media + 0.2).toFixed(1));
            a.media = nova;
            lines.push('', `> lançar nota · ${a.mat}`, `  nova média: ${nova.toFixed(1)}`, '  [ok] notas.json atualizado');
          } else if (c === '3') {
            lines.push('', '[gerando relatório⬦]');
            ALUNOS.forEach((a) => lines.push(`  ${a.nome}: ${a.media.toFixed(1)}`));
            lines.push('[ok] relatorio.txt gerado (' + ALUNOS.length + ' alunos)');
          } else {
            lines = ['sessão encerrada.', 'pressione 1 para reiniciar.'];
          }
          paint();
        })
      );
    };

    paint();
  };

  /* ---------- 2.6 Climo · chat com contexto ---------- */
  DEMOS.climo = function (root) {
    const QA = [
      {
        q: 'Qual o procedimento para erro E-042?',
        a: 'Erro **E-042** indica falha de sincronização de contingência. Ordem: (1) validar conexão do terminal, (2) reprocessar a fila local, (3) se persistir, abrir incidente para N3 com o log das últimas 2 h.',
        src: 'KB-042 · tabela de contingência'
      },
      {
        q: 'Como registrar um no-show?',
        a: 'Use o motivo **NO_SHOW** no registro do atendimento, anexe o horário do bloqueio e não altere o valor do bilhete. O reembolso é tratado em fluxo separado.',
        src: 'SOP-118 · atendimento'
      },
      {
        q: 'Posso remarcar sem taxa?',
        a: 'Somente dentro da janela de 24 h e em tarifa flexível. Fora disso, aplica-se a regra da tarifa e o valor deve ser informado ao passageiro **antes** da confirmação.',
        src: 'TAR-07 · regras tarifárias'
      }
    ];
    let busy = false;

    root.innerHTML = `
      <div class="demo demo--climo">
        <div class="climo__chat">
          <div class="climo__head">
            <span class="climo__avatar">${icon('bot')}</span>
            <div><strong>Climo</strong><small>protótipo · assistente de operação</small></div>
            <span class="badge badge--amber">offline</span>
          </div>
          <div class="climo__msgs" id="climo-msgs" aria-live="polite">
            <p class="climo__sys">Contexto montado no servidor a partir da base interna. Respostas abaixo são um roteiro fixo, sem chamada de modelo.</p>
          </div>
          <div class="climo__ask" role="group" aria-label="Perguntas de exemplo">
            ${QA.map((x, i) => `<button type="button" class="chip chip--pick" data-q="${i}">${esc(x.q)}</button>`).join('')}
          </div>
        </div>
        <div class="climo__side">
          <p class="demo__note">simulação · nenhuma API é chamada</p>
          <ul class="climo__facts">
            <li>${icon('lock')} chave nunca no cliente</li>
            <li>${icon('database')} contexto vindo do banco</li>
            <li>${icon('shield')} markdown sanitizado</li>
          </ul>
        </div>
      </div>`;

    const msgs = $('#climo-msgs', root);

    const ask = async (i) => {
      if (busy) return;
      busy = true;
      const item = QA[i];
      msgs.insertAdjacentHTML('beforeend', `<p class="climo__user">${esc(item.q)}</p>`);
      const b = document.createElement('div');
      b.className = 'climo__bot';
      b.innerHTML = '<span class="climo__typing"><i></i><i></i><i></i></span>';
      msgs.appendChild(b);
      await wait(520);
      const text = item.a.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
      if (reduce) {
        b.innerHTML = text + `<small class="climo__src">fonte: ${esc(item.src)}</small>`;
      } else {
        b.innerHTML = '<span class="climo__stream"></span>';
        const target = b.querySelector('.climo__stream');
        const plain = text.replace(/<[^>]+>/g, '');
        for (let k = 0; k < plain.length; k += 3) {
          target.textContent = plain.slice(0, k + 3);
          msgs.scrollTop = msgs.scrollHeight;
          await wait(12);
        }
        b.innerHTML = text + `<small class="climo__src">fonte: ${esc(item.src)}</small>`;
      }
      msgs.scrollTop = msgs.scrollHeight;
      busy = false;
    };

    root.querySelectorAll('[data-q]').forEach((b) =>
      b.addEventListener('click', () => ask(+b.dataset.q))
    );
  };

  /* ============================================================
     3. Laboratório
     ============================================================ */
  function initLab() {
    const root = $('#lab');
    if (!root) return;
    const indexEl = $('#lab-index', root);
    const stageEl = $('#lab-stage', root);
    const caseBtn = $('#lab-case', root);
    if (!indexEl || !stageEl) return;

    let current = null;
    let tab = 'demo';

    indexEl.innerHTML = ORDER.map((id) => {
      const p = P[id];
      return (
        `<button class="lab__item acc-${p.accent}" type="button" role="tab" id="idx-${id}" data-id="${id}"
           aria-selected="false" aria-controls="lab-stage" tabindex="-1">
           <span class="lab__n">${p.n}</span>
           <span class="lab__name">${esc(p.name)}</span>
           <span class="lab__tag">${esc(p.badges[0][0])}</span>
           <span class="lab__dot" aria-hidden="true"></span>
         </button>`
      );
    }).join('');

    const paintTabs = (p) => {
      const tabs = [
        ['demo', 'Demo', 'play'],
        ['arch', 'Arquitetura', 'layers'],
        ['dec', 'Decisões', 'code'],
        ['num', 'Números', 'activity']
      ];
      return `<div class="lab__tabs" role="tablist" aria-label="Conteúdo de ${esc(p.name)}">
        ${tabs
          .map(
            ([id, label, ic]) =>
              `<button class="lab__tab${tab === id ? ' is-on' : ''}" type="button" role="tab" data-tab="${id}"
                 id="tab-${id}" aria-selected="${tab === id}" aria-controls="panel-${id}" tabindex="${tab === id ? 0 : -1}">
                 ${icon(ic)} ${label}
               </button>`
          )
          .join('')}
      </div>`;
    };

    const paintPanel = (p) => {
      if (tab === 'demo') return `<div class="lab__panel" role="tabpanel" id="panel-demo" aria-labelledby="tab-demo" data-panel="demo"><div id="demo-root"></div></div>`;
      if (tab === 'arch') {
        return `<div class="lab__panel" role="tabpanel" id="panel-arch" aria-labelledby="tab-arch" data-panel="arch">
          ${renderArch(p)}
          <p class="lab__arch-note">Fluxo em camadas — cada coluna é um limite de responsabilidade do sistema, não uma pasta.</p>
        </div>`;
      }
      if (tab === 'dec') {
        return `<div class="lab__panel" role="tabpanel" id="panel-dec" aria-labelledby="tab-dec" data-panel="dec">
          <ol class="dec">
            ${p.decisions
              .map(
                (d, i) => `<li class="dec__item">
                  <span class="dec__n">0${i + 1}</span>
                  <div><h4>${esc(d.t)}</h4><p>${esc(d.d)}</p><p class="dec__why"><strong>Por quê:</strong> ${esc(d.why)}</p></div>
                </li>`
              )
              .join('')}
          </ol>
        </div>`;
      }
      return `<div class="lab__panel" role="tabpanel" id="panel-num" aria-labelledby="tab-num" data-panel="num">
        <div class="nums">
          ${p.metrics.map((m) => `<div class="nums__i"><b>${esc(m[0])}</b><span>${esc(m[1])}</span></div>`).join('')}
        </div>
        <p class="nums__res">${esc(p.result)}</p>
      </div>`;
    };

    const paintFoot = (p) => {
      const links = (p.links || [])
        .map(
          (l) =>
            `<a class="btn btn--ghost btn--sm" href="${l[1]}" target="_blank" rel="noopener noreferrer">${icon(
              l[2] === 'github' ? 'github' : l[2] === 'book' ? 'book' : 'external'
            )} ${esc(l[0])}</a>`
        )
        .join('');
      return `<div class="lab__foot">
        <div class="lab__stack">${p.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</div>
        <div class="lab__actions">${links}
          <button class="btn btn--primary btn--sm" type="button" data-case>Estudo de caso completo ${icon('arrow-right')}</button>
        </div>
      </div>`;
    };

    const mountDemo = (p) => {
      const host = $('#demo-root', stageEl);
      if (!host) return;
      const fn = DEMOS[p.demo];
      if (!fn) {
        host.innerHTML = '<p class="demo__hint">Demo em preparação.</p>';
        return;
      }
      try {
        fn(host);
      } catch (err) {
        host.innerHTML = '<p class="demo__hint">Esta demonstração não pôde ser carregada. O estudo de caso continua disponível.</p>';
      }
    };

    const render = (id, opts) => {
      const p = P[id];
      if (!p) return;
      const dir = opts && opts.dir ? opts.dir : 0;
      const first = !current;
      current = id;
      tab = 'demo';

      $$('.lab__item', indexEl).forEach((b) => {
        const on = b.dataset.id === id;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-selected', String(on));
        b.tabIndex = on ? 0 : -1;
      });

      stageEl.className = 'lab__stage acc-' + p.accent + (first || reduce ? '' : dir > 0 ? ' is-next' : dir < 0 ? ' is-prev' : '');
      stageEl.innerHTML = `
        <div class="lab__head">
          <div class="lab__head-top">
            <p class="lab__kicker">${esc(p.kicker)}</p>
            <span class="lab__count">${p.n} / 06</span>
          </div>
          <h3 class="lab__title">${esc(p.title)}</h3>
          <p class="lab__summary">${esc(p.summary)}</p>
          <div class="lab__badges">${p.badges.map((b) => `<span class="badge badge--${b[1]}">${esc(b[0])}</span>`).join('')}</div>
        </div>
        ${paintTabs(p)}
        ${paintPanel(p)}
        ${paintFoot(p)}
      `;

      caseBtn.textContent = 'Ver estudo de caso: ' + p.name;
      const status = document.getElementById('lab-status');
      if (status) status.textContent = 'Projeto ' + p.n + ' de 6: ' + p.title + '. Abas: demo, arquitetura, decisões e números.';
      bindStage();
      if (tab === 'demo') mountDemo(p);
      document.dispatchEvent(new CustomEvent('lab:change', { detail: { id: id, project: p } }));

      if (!first && !reduce) {
        stageEl.classList.add('is-anim');
        setTimeout(() => stageEl.classList.remove('is-anim', 'is-next', 'is-prev'), 320);
      }
    };

    const bindStage = () => {
      $$('.lab__tab', stageEl).forEach((btn) => {
        btn.addEventListener('click', () => {
          const p = P[current];
          tab = btn.dataset.tab;
          const head = $('.lab__head', stageEl).outerHTML;
          stageEl.innerHTML = head + paintTabs(p) + paintPanel(p) + paintFoot(p);
          bindStage();
          if (tab === 'demo') mountDemo(p);
        });
      });
      $$('[data-case]', stageEl).forEach((b) =>
        b.addEventListener('click', () => {
          if (window.PORTFOLIO_OPEN_CASE) window.PORTFOLIO_OPEN_CASE(current);
        })
      );
    };

    const select = (id, opts) => {
      const oldIdx = ORDER.indexOf(current);
      const newIdx = ORDER.indexOf(id);
      render(id, { dir: current ? newIdx - oldIdx : 0 });
      if (opts && opts.focus) $(`#idx-${id}`, indexEl).focus();
      if (opts && opts.scroll) {
        const sec = document.getElementById('projetos');
        if (sec) sec.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      }
      // link compartilhável sem disparar hashchange
      if (!opts || !opts.silent) {
        try { history.replaceState(null, '', '#lab/' + id); } catch (e) { /* file:// */ }
      }
    };

    // ponte para a command palette
    window.PORTFOLIO_LAB_SELECT = (id, scroll) => {
      if (P[id]) select(id, { scroll: !!scroll });
    };

    // eventos do índice
    indexEl.addEventListener('click', (e) => {
      const b = e.target.closest('.lab__item');
      if (b) select(b.dataset.id);
    });
    indexEl.addEventListener('keydown', (e) => {
      const btns = $$('.lab__item', indexEl);
      const i = btns.indexOf(document.activeElement);
      if (i < 0) return;
      let next = i;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % btns.length;
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + btns.length) % btns.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = btns.length - 1;
      else return;
      e.preventDefault();
      select(btns[next].dataset.id, { focus: true });
    });

    if (caseBtn) caseBtn.addEventListener('click', () => {
      if (window.PORTFOLIO_OPEN_CASE) window.PORTFOLIO_OPEN_CASE(current);
    });

    // deep link #lab/<id>
    const fromHash = () => {
      const m = (location.hash || '').match(/^#lab\/([a-z0-9-]+)$/i);
      return m && P[m[1]] ? m[1] : null;
    };
    const applyHash = () => {
      const id = fromHash();
      if (id && id !== current) select(id);
    };
    window.addEventListener('hashchange', applyHash);

    const start = fromHash() || ORDER[0];
    render(start, {});
    if (fromHash()) {
      setTimeout(() => root.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' }), 220);
    }

    // atalhos quando o lab está visível
    document.addEventListener('keydown', (e) => {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || '')) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const r = root.getBoundingClientRect();
      const inView = r.top < innerHeight * 0.75 && r.bottom > innerHeight * 0.25;
      if (!inView) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const i = ORDER.indexOf(current);
        const next = ORDER[(i + (e.key === 'ArrowRight' ? 1 : -1) + ORDER.length) % ORDER.length];
        e.preventDefault();
        select(next);
      } else if (/^[1-6]$/.test(e.key)) {
        e.preventDefault();
        select(ORDER[+e.key - 1]);
      }
    });

    // filtra/destaca por tecnologia vindo da matriz de stack
    document.addEventListener('stack:pick', (e) => {
      const ids = (e.detail && e.detail.projects) || [];
      $$('.lab__item', indexEl).forEach((b) => {
        const on = ids.includes(b.dataset.id);
        b.classList.toggle('is-dim', ids.length > 0 && !on);
        b.classList.toggle('is-hit', ids.length > 0 && on);
      });
      const note = $('#lab-note');
      if (note) {
        note.textContent = ids.length
          ? 'Destacando ' + ids.length + ' projeto(s) que usam ' + e.detail.skill + '.'
          : 'Nenhum projeto usa ' + (e.detail ? e.detail.skill : '') + ' ainda — está na trilha de estudo.';
        note.hidden = false;
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initLab);
  else initLab();
})();
