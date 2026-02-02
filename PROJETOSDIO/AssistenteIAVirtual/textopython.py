import os
import g4f
from gtts import gTTS

PASTA_AUDIOS = "audioo"

if not os.path.exists(PASTA_AUDIOS):
    os.makedirs(PASTA_AUDIOS)
    print(f"Pasta '{PASTA_AUDIOS}' criada com sucesso.")

def assistente_virtual_texto():
    print("--- Assistente IA (Modo Texto -> Áudio) ---")
    
    # 1. ENTRADA DO USUÁRIO (TEXTO)
    pergunta = input("\nDigite sua pergunta para a IA: ")

    if not pergunta.strip():
        print("Você não digitou nada.")
        return

    try:
        # 2. INTEGRANDO COM IA GRATUITA (Cérebro)
        print("IA pensando na resposta...")
        
        # O g4f escolhe automaticamente um provedor gratuito disponível
        resposta_texto = g4f.ChatCompletion.create(
            model=g4f.models.gpt_35_turbo,
            messages=[{"role": "user", "content": pergunta}],
        )

        # 3. EXIBINDO A RESPOSTA EM TEXTO
        print(f"\nIA respondeu: {resposta_texto}")

        # 4. GERANDO ÁUDIO COM gTTS (Saída em Áudio)
        print("Gerando arquivo de áudio...")
        
        # Nome do arquivo final
        nome_arquivo = "resposta_ia.mp3"
        caminho_final = os.path.join(PASTA_AUDIOS, nome_arquivo)

        # Converte o texto da IA em voz (Português)
        tts = gTTS(text=resposta_texto, lang='pt', slow=False)
        
        # Salva o arquivo na pasta 'audioo'
        tts.save(caminho_final)
        
        print(f"Sucesso! O áudio foi salvo em: {caminho_final}")
        print("Você pode baixar esse arquivo da pasta 'audioo' para ouvir.")

    except Exception as e:
        print(f"Ocorreu um erro ao processar: {e}")

if __name__ == "__main__":
    # Inicia o assistente
    assistente_virtual_texto()