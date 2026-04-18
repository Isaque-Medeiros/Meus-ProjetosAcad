import streamlit as st
import json
import pandas as pd
import plotly.express as px
import sys
import os

# --- MOCKUP DE IMPORTAÇÕES ---
# Mantenha suas importações originais aqui.
# Estou usando try/except para que o código funcione visualmente mesmo sem seus arquivos locais.
try:
    from main import executar_fluxo_completo
    from ai_engine import gerar_conselhos_visual
except ImportError:
    # Funções Dummy apenas para demonstração do design se os arquivos não existirem
    def executar_fluxo_completo(dados): return dados
    def gerar_conselhos_visual(dados): return "Com base na sua renda e gastos, recomendo focar na quitação do cartão de crédito imediatamente devido aos juros altos. Sua reserva de emergência está abaixo do ideal (recomendado: 6 meses de gastos fixos)."

# Configuração da Página
st.set_page_config(
    page_title="Santander | Planejamento Financeiro",
    page_icon="Logoprojeto.png",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- CSS PERSONALIZADO (STYLE INJECTION) ---
st.markdown("""
    <style>
    /* Cores principais: Santander Red (#EC0000) e Cinza */
    
    /* Fonte e Cabeçalhos */
    h1, h2, h3 {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-weight: 600;
        color: #333;
    }
    
    /* Barra Superior Colorida */
    header[data-testid="stHeader"] {
        background-image: linear-gradient(90deg, #EC0000 0%, #B90000 100%);
    }
    
    /* Botões */
    div.stButton > button {
        background-color: #EC0000;
        color: white;
        border-radius: 8px;
        border: none;
        padding: 10px 24px;
        font-weight: bold;
        transition: all 0.3s ease;
    }
    div.stButton > button:hover {
        background-color: #B90000;
        color: #FFF;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    /* Cards (Container Styling) */
    [data-testid="stMetricValue"] {
        color: #EC0000;
    }
    
    /* Custom Box para Destaques */
    .santander-card {
        background-color: #f8f9fa;
        border-left: 5px solid #EC0000;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        margin-bottom: 20px;
    }
    </style>
""", unsafe_allow_html=True)

# --- SIDEBAR (Barra Lateral) ---
with st.sidebar:
    st.image("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Banco_Santander_Logotipo.svg/2560px-Banco_Santander_Logotipo.svg.png", width=200)
    st.markdown("### 📊 Menu do Consultor")
    st.info("Preencha os dados do cliente ao lado para gerar o relatório estratégico.")
    st.markdown("---")
    st.caption("Powered by Project IA Learning - Isaque de Medeiros Pinto")

# --- CABEÇALHO ---
st.title("Consultoria de Planejamento")
st.markdown("**Bem-vindo ao assistente de inteligência financeira.**")

# --- FORMULÁRIO DE DADOS (Organizado em Abas) ---
tab_perfil, tab_financas, tab_objetivos = st.tabs(["👤 Perfil", "💰 Vida Financeira", "🎯 Objetivos & Dívidas"])

with st.form("form_analise"):
    
    with tab_perfil:
        c1, c2, c3 = st.columns([2, 1, 1])
        with c1:
            nome = st.text_input("Nome do Cliente", "João Silva")
        with c2:
            idade = st.number_input("Idade", 35, 100)
        with c3:
            dependentes = st.number_input("Dependentes", 0, 10, 2)
        
        perfil = st.select_slider("Perfil de Investidor", options=["Conservador", "Moderado", "Arrojado", "Agressivo"], value="Moderado")

    with tab_financas:
        st.markdown("##### Fluxo de Caixa Mensal")
        col_f1, col_f2, col_f3, col_f4 = st.columns(4)
        with col_f1:
            renda = st.number_input("Renda Líquida", value=5000.0, step=100.0, format="%.2f")
        with col_f2:
            fixos = st.number_input("Gastos Fixos", value=3000.0, step=100.0, format="%.2f")
        with col_f3:
            variaveis = st.number_input("Gastos Variáveis", value=1500.0, step=100.0, format="%.2f")
        with col_f4:
            reserva = st.number_input("Reserva Atual", value=1000.0, step=100.0, format="%.2f")
        
        # Cálculo dinâmico simples para visualização imediata
        saldo_mensal = renda - (fixos + variaveis)
        if saldo_mensal < 0:
            st.warning(f"⚠️ Atenção: Fluxo de caixa negativo estimado: R$ {saldo_mensal:.2f}")

    with tab_objetivos:
        c_div, c_obj = st.columns(2)
        with c_div:
            st.markdown("##### 💳 Gestão de Dívidas")
            st.caption("Formato: Tipo, Valor, Juros % (um por linha)")
            dividas_texto = st.text_area("Lista de Dívidas", 
                                value="Cartão de Crédito, 2000.00, 12.5\nFinanciamento Carro, 15000.00, 1.2", height=100)
        
        with c_obj:
            st.markdown("##### 🚀 Objetivo Curto Prazo (12m)")
            obj_c_desc = st.text_input("Descrição", "Viagem de férias")
            obj_c_val = st.number_input("Valor Alvo (R$)", value=3000.0)

    st.markdown("---")
    # Botão centralizado e grande
    col_b1, col_b2, col_b3 = st.columns([1, 2, 1])
    with col_b2:
        submit_btn = st.form_submit_button("🚀 PROCESSAR ANÁLISE FINANCEIRA", use_container_width=True)

# --- LÓGICA E APRESENTAÇÃO DOS RESULTADOS ---
if submit_btn:
    # Tratamento de dados
    lista_dividas = []
    try:
        for linha in dividas_texto.split('\n'):
            if ',' in linha:
                partes = linha.split(',')
                if len(partes) == 3:
                    t, v, j = partes
                    lista_dividas.append({"tipo": t.strip(), "valor_total": float(v), "taxa_juros_mensal": float(j)})
    except Exception as e:
        st.error(f"Erro ao processar dívidas: {e}")

    dados_finais = {
        "metadados": {"cliente_id": "001", "responsavel": "Virtual_Assistant"},
        "perfil": {"nome": nome, "idade": idade, "dependentes": dependentes, "perfil_investidor": perfil},
        "financeiro_atual": {"renda_liquida": renda, "gastos_fixos": fixos, "gastos_variaveis": variaveis, "reserva_atual": reserva},
        "dividas": lista_dividas,
        "objetivos": {"curto_prazo": {"descricao": obj_c_desc, "valor": obj_c_val, "prazo_meses": 12}}
    }

    with st.spinner("Analisando perfil e gerando estratégias..."):
        # Chamada ao backend
        resultado_json = executar_fluxo_completo(dados_finais)
        conselhos_humano = gerar_conselhos_visual(resultado_json)
        
        # --- DASHBOARD DE RESULTADOS ---
        st.divider()
        st.subheader(f"📑 Relatório Planejado: {nome}")
        
        # 1. Indicadores Chave (KPIs)
        kpi1, kpi2, kpi3, kpi4 = st.columns(4)
        kpi1.metric("Saldo Mensal Estimado", f"R$ {saldo_mensal:.2f}", delta_color="normal")
        kpi2.metric("Total de Dívidas", f"R$ {sum(d['valor_total'] for d in lista_dividas):.2f}", delta_color="inverse")
        taxa_poupanca = (saldo_mensal / renda * 100) if renda > 0 else 0
        kpi3.metric("Taxa de Poupança", f"{taxa_poupanca:.1f}%")
        kpi4.metric("Cobertura Reserva", f"{(reserva/fixos):.1f} meses")

        # 2. Layout Visual (Gráfico + Conselho)
        col_visual, col_texto = st.columns([1, 1.5])
        
        with col_visual:
            # Gráfico de Pizza (Renda vs Gastos)
            df_gastos = pd.DataFrame({
                'Categoria': ['Gastos Fixos', 'Gastos Variáveis', 'Saldo Livre'],
                'Valor': [fixos, variaveis, max(0, saldo_mensal)]
            })
            fig = px.pie(df_gastos, values='Valor', names='Categoria', title='Distribuição da Renda', 
                         color_discrete_sequence=['#EC0000', '#FF6666', '#CCCCCC'], hole=0.4)
            fig.update_layout(showlegend=True, margin=dict(t=30, b=0, l=0, r=0), height=300)
            st.plotly_chart(fig, use_container_width=True)

        with col_texto:
            st.markdown('<div class="santander-card">', unsafe_allow_html=True)
            st.markdown("#### 💡 Estratégia Recomendada")
            st.write(conselhos_humano)
            st.markdown('</div>', unsafe_allow_html=True)

            # Área de download discreta
            with st.expander("🛠️ Dados Técnicos (JSON)"):
                st.json(resultado_json)
                st.download_button(
                    label="💾 Baixar Plano JSON",
                    data=json.dumps(resultado_json, indent=4),
                    file_name=f"plano_{nome}.json",
                    mime="application/json"
                )