from ai_engine import gerar_planejamento_ia
from file_manager import salvar_json

def executar_fluxo_completo(dados_coletados):
    # 1. Salva os dados de entrada na pasta /data/inputs/
    salvar_json(dados_coletados, "../data/inputs", prefixo="input_cliente")
    
    # 2. Chama a IA do g4f
    analise_ia = gerar_planejamento_ia(dados_coletados)
    
    # 3. Salva a resposta da IA na pasta /data/outputs/
    salvar_json(analise_ia, "../data/outputs", prefixo="plano_final")
    
    return analise_ia