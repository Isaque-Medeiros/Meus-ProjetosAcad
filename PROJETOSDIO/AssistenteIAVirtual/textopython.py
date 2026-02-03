import os
import g4f
from gtts import gTTS
import pygame 
import time

DIRETORIO_SCRIPT = os.path.dirname(os.path.abspath(__file__))
PASTA_CAMINHO = os.path.join(DIRETORIO_SCRIPT, "audioo")


if not os.path.exists(PASTA_CAMINHO):
    os.makedirs(PASTA_CAMINHO)
    print(f"Pasta '{PASTA_CAMINHO}' criada com sucesso.")

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
            model=g4f.models.default,
            messages=[{"role": "user", "content": pergunta}],
        )

        # 3. EXIBINDO A RESPOSTA EM TEXTO
        print(f"\nIA respondeu: {resposta_texto}")

        # 4. GERANDO ÁUDIO COM gTTS (Saída em Áudio)
        print("Gerando arquivo de áudio...")
        
        # Nome do arquivo final
        nome_arquivo = "resposta_ia.mp3"
        caminho_final = os.path.join(PASTA_CAMINHO, nome_arquivo)

        # Converte o texto da IA em voz (Português)
        tts = gTTS(text=resposta_texto, lang='pt', slow=False)
        
        # Salva o arquivo na pasta 'audioo'
        tts.save(caminho_final)
        
        print(f"Sucesso! O áudio foi salvo em: {caminho_final}")
        print("Você pode baixar esse arquivo da pasta 'audioo' para ouvir.")

        #rodando audio resposta
        pygame.mixer.init()
        pygame.mixer.music.load(caminho_final)
        pygame.mixer.music.play()
        while pygame.mixer.music.get_busy():
            time.sleep(1)
        pygame.mixer.quit()    
    except Exception as e:
        print(f"Ocorreu um erro ao processar: {e}")

if __name__ == "__main__":
    # Inicia o assistente
    assistente_virtual_texto()