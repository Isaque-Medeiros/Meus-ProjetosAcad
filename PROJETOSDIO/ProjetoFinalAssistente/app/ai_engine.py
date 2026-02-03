import g4f
import json
from g4f.client import Client # <--- Importação necessária para a função 2

def gerar_planejamento_ia(dados_cliente_json):
    """
    Motor de IA que utiliza a metodologia Santander para análise financeira.
    Esta função gera a estrutura JSON técnica.
    """
    
    # Este é o PROMPT DE OURO.
    prompt_sistema = """
    VOCÊ É UM CONSULTOR FINANCEIRO SÊNIOR DO SANTANDER.
    Sua tarefa é analisar os dados de um cliente e criar um plano de ação estrito.

    ### REGRAS DA METODOLOGIA SANTANDER QUE VOCÊ DEVE SEGUIR:
    1. DIAGNÓSTICO (REGRA 50-30-20):
       - 50% da renda deve ir para Gastos Fixos (Necessidades).
       - 30% da renda deve ir para Gastos Variáveis (Estilo de Vida).
       - 20% da renda deve ir para Prioridades Financeiras (Dívidas/Investimentos).

    2. RESERVA DE EMERGÊNCIA:
       - O objetivo é ter entre 3 a 6 meses do custo fixo mensal guardado.

    3. PRIORIZAÇÃO DE DÍVIDAS:
       - Se o cliente tiver dívidas, o plano deve priorizar o pagamento das que possuem MAIOR TAXA DE JUROS.

    4. FORMATO DE SAÍDA:
       - Responda EXCLUSIVAMENTE em formato JSON. 
       - Não escreva saudações, explicações ou textos fora do bloco JSON.
       - Use o seguinte modelo de resposta:

    {
      "analise_percentual": {
        "atual": {"fixo": 0, "variavel": 0, "prioridade": 0},
        "sugerido": {"fixo": 50, "variavel": 30, "prioridade": 20},
        "veredito": "Texto curto"
      },
      "plano_de_acao": [
        {"ordem": 1, "acao": "Título", "detalhe": "Descrição"}
      ],
      "analise_reserva_emergencia": {
        "valor_alvo": 0.0,
        "tempo_estimado_meses": 0,
        "recomendacao": "Texto"
      },
      "conclusao_santander": "Texto final"
    }
    """

    dados_formatados = json.dumps(dados_cliente_json, indent=2)
    conteudo_mensagem = f"{prompt_sistema}\n\n### DADOS DO CLIENTE PARA ANÁLISE:\n{dados_formatados}"

    try:
        response = g4f.ChatCompletion.create(
            model=g4f.models.default,
            messages=[{"role": "user", "content": conteudo_mensagem}],
        )
        
        texto_limpo = response.replace("```json", "").replace("```", "").strip()
        return json.loads(texto_limpo)
        
    except Exception as e:
        return {
            "erro": "A IA não conseguiu gerar o JSON estruturado.",
            "detalhes": str(e),
            "resposta_bruta": response if 'response' in locals() else "Sem resposta"
        }

def gerar_conselhos_visual(json_analise):
    """
    Função para apresentação compreensível ao usuário final.
    """
    client = Client() # Inicializando o Client que agora está importado no topo
    
    prompt = f"""
    Com base neste planejamento JSON: {json_analise}
    
    Aja como um Senior Wealth Manager do Santander Private Banking.
    Com base no JSON de planejamento técnico: {json_analise}
    
    Crie um PARECER FINANCEIRO ESTRUTURADO. O tom deve ser de um especialista que quer fazer o cliente crescer patrimonialmente.

    REGRAS DE OURO:
    - Use termos técnicos: 'Capacidade de Aporte', 'Alavancagem Negativa' (para dívidas), 'Liquidez Imediata'.
    - Explique o PORQUÊ de cada ação.
    - Se o perfil for 'Moderado' ou 'Arrojado', fale sobre o custo de oportunidade de estar fora do mercado.

    MANTENHA ESTA ESTRUTURA FIXA E FORMATO:

    'Com base na análise estratégica do Santander, detalhamos o seu mapa de navegação financeira para maximizar sua capacidade de investimento:'

    1. 🛠️ **OTIMIZAÇÃO DE CUSTOS FIXOS E ESTRUTURAIS**: [Analise se os gastos fixos estão sufocando a capacidade de investimento. Se acima de 50%, dê um plano de choque para reduzir e liberar fluxo de caixa. Use valores do JSON].

    2. 📉 **GESTÃO DE PASSIVOS E CUSTO DE OPORTUNIDADE**: [Se houver dívidas, trate-as como "Drenos de Patrimônio". Compare os juros da dívida com o lucro de um investimento médio. Se não houver, foque em como os 30% de estilo de vida podem ser otimizados para acelerar a liberdade financeira].

    3. 🛡️ **BASE DE SEGURANÇA E ARQUITETURA DE RESERVA**: [Calcule a Reserva de Emergência como o 'Pedágio para a Renda Variável'. Explique que sem a reserva de **R$ [ValorAlvo]** (calculada no JSON), ele está exposto a riscos sistêmicos que podem obrigá-lo a resgatar investimentos em momentos ruins].

    ---
    🎯 **CONCLUSÃO PARA INVESTIMENTO**: [Dê uma frase final sobre o potencial do cliente caso ele siga o plano].
    
    Destaque valores e porcentagens em **Negrito**.
    """
    try:
        response = client.chat.completions.create(
            model=g4f.models.default,
            messages=[{"role": "user", "content": prompt}]
        )
        # O Client retorna um objeto, acessamos o conteúdo assim:
        return response.choices[0].message.content
    except Exception as e:
        return "Erro ao gerar conselhos: " + str(e)