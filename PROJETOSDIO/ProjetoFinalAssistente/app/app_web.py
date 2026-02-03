import streamlit as st
import json
from main import executar_fluxo_completo
from ai_engine import gerar_conselhos_visual 
import sys
import os
# Adiciona a pasta 'app' ao caminho de busca do Python
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

st.set_page_config(page_title="Santander - Assistente Financeiro", layout="wide")

st.title("🏦 Consultoria de Planejamento Santander")
st.markdown("---")

# Criando colunas para organizar os campos
col1, col2 = st.columns(2)

with col1:
    st.subheader("👤 Perfil do Cliente")
    nome = st.text_input("Nome Completo", value="João Silva")
    idade = st.number_input("Idade", value=35)
    dependentes = st.number_input("Dependentes", value=2)
    perfil = st.selectbox("Perfil do Investidor", ["Conservador", "Moderado", "Arrojado"], index=1)

with col2:
    st.subheader("💰 Dados Financeiros")
    renda = st.number_input("Renda Líquida Mensal", value=5000.0)
    fixos = st.number_input("Gastos Fixos", value=3000.0)
    variaveis = st.number_input("Gastos Variáveis", value=1500.0)
    reserva = st.number_input("Reserva Atual", value=1000.0)

st.markdown("---")
st.subheader("💳 Dívidas e Objetivos")
col3, col4 = st.columns(2)

with col3:
    st.info("Dívidas Atuais")
    dividas_texto = st.text_area("Descreva: Tipo, Valor Total, Taxa de Juros (Um por linha)", 
                                value="Cartão de Crédito, 2000.00, 12.5\nFinanciamento Carro, 15000.00, 1.2")

with col4:
    st.info("Objetivo de Curto Prazo (12 meses)")
    obj_c_desc = st.text_input("Descrição Curto Prazo", value="Viagem de férias")
    obj_c_val = st.number_input("Valor Necessário (CP)", value=3000.0)

# Botão para Processar
if st.button("🚀 GERAR PLANEJAMENTO ESTRATÉGICO"):
    # Tratamento das dívidas
    lista_dividas = []
    for linha in dividas_texto.split('\n'):
        if ',' in linha:
            partes = linha.split(',')
            if len(partes) == 3:
                t, v, j = partes
                lista_dividas.append({"tipo": t.strip(), "valor_total": float(v), "taxa_juros_mensal": float(j)})

    dados_finais = {
        "metadados": {"cliente_id": "001", "responsavel": "Virtual_Assistant"},
        "perfil": {"nome": nome, "idade": idade, "dependentes": dependentes, "perfil_investidor": perfil},
        "financeiro_atual": {"renda_liquida": renda, "gastos_fixos": fixos, "gastos_variaveis": variaveis, "reserva_atual": reserva},
        "dividas": lista_dividas,
        "objetivos": {
            "curto_prazo": {"descricao": obj_c_desc, "valor": obj_c_val, "prazo_meses": 12}
        }
    }

    with st.spinner("Processando análise técnica e gerando conselhos..."):
        # 1. Parte Técnica: Executa o fluxo (Gera e Salva o JSON)
        resultado_json = executar_fluxo_completo(dados_finais)
        
        st.success("✅ Planejamento Gerado com Sucesso!")
        
        # 2. Exibição Original: Mostra a estrutura JSON na tela
        st.subheader("📊 Estrutura Técnica (JSON)")
        st.json(resultado_json)
        
        st.markdown("---")

        # 3. Exibição Amigável: Chama a nova função de conselhos
        st.subheader("💡 Apresentação para o Cliente")
        conselhos_humano = gerar_conselhos_visual(resultado_json)
        
        # Usamos st.info para dar um destaque visual amigável aos conselhos
        st.info(conselhos_humano)
        
        # Opção extra: Botão para o funcionário baixar o JSON técnico para o banco
        st.download_button(
            label="💾 Baixar Arquivo JSON",
            data=json.dumps(resultado_json, indent=4),
            file_name=f"plano_{nome}.json",
            mime="application/json"
        )