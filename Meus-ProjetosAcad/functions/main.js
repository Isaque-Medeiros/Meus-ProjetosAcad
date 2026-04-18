// ============================================================
//  BARBEARIA - Sistema de Agendamento
//  main.js — Lógica principal de estado e agendamento
// ============================================================

// ── Configurações globais ────────────────────────────────────
const CONFIG = {
    WHATSAPP_NUMBER: '5511972244484', // Número configurado para teste
    STORAGE_KEY_BOOKINGS: 'barbearia_agendamentos',
    STORAGE_KEY_STATUS: 'barbearia_status',
};

// ── Catálogo de serviços ─────────────────────────────────────
const SERVICES = [
    { id: 1, name: 'Corte de Cabelo', description: 'Tesoura ou máquina, do seu jeito', price: 40, emoji: '✂️' },
    { id: 2, name: 'Barba',           description: 'Navalha + toalha quente',          price: 30, emoji: '🪒' },
    { id: 3, name: 'Combo Completo',  description: 'Corte + Barba com desconto',        price: 60, emoji: '💈' },
    { id: 4, name: 'Sobrancelha',     description: 'Design e acabamento preciso',       price: 15, emoji: '👁️' },
    { id: 5, name: 'Hidratação',      description: 'Tratamento capilar profundo',       price: 35, emoji: '💧' },
];

// ── Estado da aplicação ──────────────────────────────────────
let state = {
    isOpen: true,
    bookings: [],
};

// ============================================================
//  INICIALIZAÇÃO
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    carregarEstado();
    renderizarServicos();
    renderizarAgendamentos();
    configurarFormulario();
    configurarToggleStatus();
    configurarWhatsappFab();
});

/** Carrega dados persistidos do localStorage */
function carregarEstado() {
    const statusSalvo = localStorage.getItem(CONFIG.STORAGE_KEY_STATUS);
    if (statusSalvo !== null) {
        state.isOpen = JSON.parse(statusSalvo);
    }

    const agendamentosSalvos = localStorage.getItem(CONFIG.STORAGE_KEY_BOOKINGS);
    if (agendamentosSalvos) {
        state.bookings = JSON.parse(agendamentosSalvos);
    }

    atualizarUIStatus();
}

// ============================================================
//  CATÁLOGO DE SERVIÇOS
// ============================================================
function renderizarServicos() {
    const container = document.getElementById('services-list');
    const select    = document.getElementById('service-select');

    container.innerHTML = '';

    SERVICES.forEach(service => {
        // Card visual
        const card = document.createElement('article');
        card.className = 'service-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Selecionar ${service.name}`);
        card.innerHTML = `
            <div class="service-info">
                <h3>${service.emoji} ${service.name}</h3>
                <p>${service.description}</p>
            </div>
            <span class="service-price">R$${service.price}</span>
        `;

        // Clique no card preenche o select do formulário
        card.addEventListener('click', () => selecionarServico(service.id));
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') selecionarServico(service.id);
        });

        container.appendChild(card);

        // Opção no select
        const option = document.createElement('option');
        option.value = service.id;
        option.textContent = `${service.name} — R$${service.price}`;
        select.appendChild(option);
    });
}

/** Seleciona um serviço pelo card e rola até o formulário */
function selecionarServico(serviceId) {
    const select = document.getElementById('service-select');
    select.value = serviceId;
    select.focus();
    document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================================
//  TOGGLE DE STATUS
// ============================================================
function configurarToggleStatus() {
    document.getElementById('toggle-status-btn').addEventListener('click', toggleStatus);
}

/**
 * toggleStatus()
 * Alterna o status da barbearia entre Aberto e Fechado,
 * persiste no localStorage e abre link WhatsApp de aviso.
 */
function toggleStatus() {
    state.isOpen = !state.isOpen;
    localStorage.setItem(CONFIG.STORAGE_KEY_STATUS, JSON.stringify(state.isOpen));
    atualizarUIStatus();

    const mensagem = state.isOpen
        ? '✅ Olá! A barbearia está *DISPONÍVEL* agora. Pode agendar! 💈'
        : '🔴 Olá! A barbearia está *OCUPADA/AGENDA CHEIA* no momento. Tente mais tarde!';

    mostrarToast(
        state.isOpen ? '✅ Status: Disponível para agendamentos' : '🔴 Status: Ocupado / Agenda Cheia',
        state.isOpen ? 'success' : 'error'
    );

    // Abre WhatsApp com mensagem de status
    abrirWhatsApp(mensagem);
}

/** Atualiza todos os elementos visuais de status */
function atualizarUIStatus() {
    const container  = document.getElementById('status-container');
    const statusText = document.getElementById('status-text');

    if (state.isOpen) {
        container.className  = 'status-container status-open';
        statusText.textContent = 'Disponível para agora';
    } else {
        container.className  = 'status-container status-closed';
        statusText.textContent = 'Ocupado / Agenda Cheia';
    }
}

// ============================================================
//  AGENDAMENTO
// ============================================================
function configurarFormulario() {
    document.getElementById('booking-form').addEventListener('submit', e => {
        e.preventDefault();
        enviarMensagem();
    });
}

/**
 * enviarMensagem()
 * Processa o formulário de agendamento:
 * 1. Valida os campos
 * 2. Salva no localStorage
 * 3. Renderiza na lista
 * 4. Abre link WhatsApp com resumo do agendamento
 */
function enviarMensagem() {
    const nome     = document.getElementById('client-name').value.trim();
    const serviceId = parseInt(document.getElementById('service-select').value);
    const horario  = document.getElementById('booking-time').value;

    // Validação
    if (!nome || !serviceId || !horario) {
        mostrarToast('⚠️ Preencha todos os campos!', 'error');
        return;
    }

    const servico = SERVICES.find(s => s.id === serviceId);
    if (!servico) return;

    // Cria objeto de agendamento
    const agendamento = {
        id: Date.now(),
        nome,
        servicoId: servico.id,
        servicoNome: servico.name,
        servicoPreco: servico.price,
        horario,
        data: new Date().toLocaleDateString('pt-BR'),
    };

    // Persiste
    state.bookings.push(agendamento);
    salvarAgendamentos();
    renderizarAgendamentos();

    // Feedback visual
    mostrarToast(`✅ Agendamento de ${nome} confirmado!`, 'success');

    // Mensagem WhatsApp
    const mensagem =
        `💈 *Novo Agendamento - Barbearia*\n\n` +
        `👤 *Cliente:* ${nome}\n` +
        `✂️ *Serviço:* ${servico.name}\n` +
        `💰 *Valor:* R$${servico.price}\n` +
        `🕐 *Horário:* ${horario}\n` +
        `📅 *Data:* ${agendamento.data}\n\n` +
        `_Agendamento realizado pelo site._`;

    abrirWhatsApp(mensagem);

    // Limpa formulário
    document.getElementById('booking-form').reset();
}

/** Salva lista de agendamentos no localStorage */
function salvarAgendamentos() {
    localStorage.setItem(CONFIG.STORAGE_KEY_BOOKINGS, JSON.stringify(state.bookings));
}

/** Remove um agendamento pelo ID */
function removerAgendamento(id) {
    state.bookings = state.bookings.filter(b => b.id !== id);
    salvarAgendamentos();
    renderizarAgendamentos();
    mostrarToast('🗑️ Agendamento removido', 'error');
}

/** Renderiza a lista de agendamentos na tela */
function renderizarAgendamentos() {
    const container = document.getElementById('bookings-list');
    container.innerHTML = '';

    if (state.bookings.length === 0) {
        container.innerHTML = '<p class="empty-state">📭 Nenhum agendamento para hoje</p>';
        return;
    }

    // Ordena por horário
    const ordenados = [...state.bookings].sort((a, b) => a.horario.localeCompare(b.horario));

    ordenados.forEach(booking => {
        const mensagemWA = encodeURIComponent(
            `💈 Olá! Sou ${booking.nome}, tenho um agendamento às ${booking.horario} para ${booking.servicoNome}.`
        );
        const linkWA = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${mensagemWA}`;

        const item = document.createElement('article');
        item.className = 'booking-item';
        item.setAttribute('data-id', booking.id);
        item.innerHTML = `
            <div class="booking-info">
                <span class="booking-name">👤 ${booking.nome}</span>
                <span class="booking-service">✂️ ${booking.servicoNome} · R$${booking.servicoPreco}</span>
            </div>
            <div class="booking-right">
                <span class="booking-time">🕐 ${booking.horario}</span>
                <a href="${linkWA}" target="_blank" rel="noopener noreferrer" class="booking-whatsapp">
                    📲 WhatsApp
                </a>
            </div>
            <button class="delete-btn" aria-label="Remover agendamento de ${booking.nome}" onclick="removerAgendamento(${booking.id})">✕</button>
        `;
        container.appendChild(item);
    });
}

// ============================================================
//  UTILITÁRIOS
// ============================================================

/**
 * abrirWhatsApp(mensagem)
 * Gera e abre um link wa.me com a mensagem codificada.
 */
function abrirWhatsApp(mensagem) {
    const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * mostrarToast(mensagem, tipo)
 * Exibe uma notificação temporária na parte inferior da tela.
 * @param {string} mensagem - Texto a exibir
 * @param {'success'|'error'|''} tipo - Estilo visual
 */
function mostrarToast(mensagem, tipo = '') {
    // Remove toast anterior se existir
    const toastExistente = document.querySelector('.toast');
    if (toastExistente) toastExistente.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.textContent = mensagem;
    document.body.appendChild(toast);

    // Força reflow para ativar a transição CSS
    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('show'));
    });

    // Remove após 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

/** Configura o botão flutuante do WhatsApp */
function configurarWhatsappFab() {
    const fab = document.getElementById('whatsapp-fab');
    if (fab) {
        const mensagemPadrao = encodeURIComponent(
            `💈 Olá! Gostaria de agendar um horário na barbearia.`
        );
        fab.href = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${mensagemPadrao}`;
    }
}
