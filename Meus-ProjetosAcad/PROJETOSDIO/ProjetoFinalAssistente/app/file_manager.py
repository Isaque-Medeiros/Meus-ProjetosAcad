import json
import os
from datetime import datetime

def salvar_json(dados, pasta, prefixo="arquivo"):
    """
    Você é um consultor financeiro do Santander. 
    Siga estritamente a metodologia: Regra 50-30-20, reserva de emergência e quitação de dívidas.
    Sua resposta DEVE ser exclusivamente em formato JSON conforme o modelo fornecido.
    Não escreva textos fora do JSON.
    """
    # Verifica se a pasta existe, se não, ele cria automaticamente
    if not os.path.exists(pasta):
        os.makedirs(pasta)

    # Cria o nome do arquivo com a data e hora atual (ex: plano_20260203_140500.json)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    nome_arquivo = f"{prefixo}_{timestamp}.json"
    caminho_completo = os.path.join(pasta, nome_arquivo)
    
    # Salva o arquivo no HD
    with open(caminho_completo, 'w', encoding='utf-8') as f:
        json.dump(dados, f, ensure_ascii=False, indent=4)
        
    return caminho_completo