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
    def gerar_conselhos_visual(json_analise):
     """
        Gera um roteiro prático e humano baseado nos dados reais do JSON,
        seguindo o modelo de 'Desafio, Roteiro e Checklist'.
        """
    client = Client()
    
    # Extraímos alguns valores do JSON para ajudar a IA, mas passamos o JSON todo também.
    prompt = f"""
    Aja como um Consultor Financeiro Humano e Prático do Santander.
    Baseie-se nestes dados: {json_analise}
    
    Sua missão é escrever um guia de ação idêntico ao modelo abaixo, mas adaptando os números para a realidade do JSON fornecido.
    
    ESTRUTURA OBRIGATÓRIA:

    1. DIAGNÓSTICO DIRETO:
    'Com base nos dados que você compartilhou, o seu grande desafio está nos [Custo Fixo] ([X]%), que estão consumindo uma fatia [maior/menor] do que o recomendado (50%). O seu objetivo claro é reduzir R$ [Valor de Diferença] mensais nesses custos para equilibrar as contas.'

    2. ROTEIRO PRÁTICO:
    - 1. **Ataque aos Gastos Fixos (A meta de R$ [Valor de Diferença])**: Cite exemplos reais como Assinaturas, Celular, Tarifas e Energia com valores estimados de economia.
    - 2. **Fortalecendo a Reserva de Emergência**: Cite o valor atual do cliente ([Reserva Atual]) e o valor alvo ([Valor Alvo] - 6 meses de custos). Explique 'Onde deixar o dinheiro' (ex: CDB 100% CDI Santander).
    - 3. **Ajuste nos Gastos Variáveis (Consumo Consciente)**: Analise o percentual atual de variáveis do cliente e dê dicas de Delivery e Supermercado.

    3. CHECKLIST PARA OS PRÓXIMOS 30 DIAS:
    - Auditoria de Extrato.
    - O Dia da Negociação (contas de consumo).
    - Aporte Automático.

    4. DICA DE OURO:
    - Calcule quanto tempo (meses) ele leva para atingir a meta se economizar o valor sugerido. Use uma frase motivacional curta.

    Destaque valores e metas em **Negrito**.
    Mantenha o tom empático e muito prático.
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