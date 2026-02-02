import speech_recognition as sr
import whisper
import os
import g4f
from gtts import gTTS

# --- CONFIGURAÇÕES ---
PASTA_AUDIOS = "audioo"
if not os.path.exists(PASTA_AUDIOS):
    os.makedirs(PASTA_AUDIOS)

print("Carregando modelo Whisper... aguarde.")
model = whisper.load_model("small")

def ouvir_e_responder():
    microfone = sr.Recognizer()
    
    # 1. CAPTURAR ÁUDIO (Entrada com voz)
    # Lembra: isso só funciona rodando localmente no seu PC!
    try:
        with sr.Microphone() as source:
            microfone.adjust_for_ambient_noise(source, duration=1)
            print("\nEstou ouvindo... Diga sua pergunta:")
            audio = microfone.listen(source)
        
        # Salva áudio temporário para transcrição
        caminho_temp = "audio_temp.wav"
        with open(caminho_temp, "wb") as f:
            f.write(audio.get_wav_data())

        # 2. TRANSCREVER COM WHISPER (Conversão para ouvir áudio)
        print("Whisper transcrevendo...")
        result = model.transcribe(caminho_temp, fp16=False, language="pt")
        transcription = result["text"].strip()
        
        if not transcription:
            print("Não entendi nada...")
            return

        print(f"Você disse: {transcription}")

        # 3. INTEGRANDO COM IA GRATUITA (Cérebro - g4f)
        print("IA pensando na resposta...")
        resposta_texto = g4f.ChatCompletion.create(
            model=g4f.models.gpt_35_turbo,
            messages=[{"role": "user", "content": transcription}], # Corrigido aqui
        )

        print(f"IA Respondeu: {resposta_texto}")

        # 4. GERANDO ÁUDIO COM gTTS (Saída em áudio)
        print("Gerando áudio da resposta...")
        caminho_saida = os.path.join(PASTA_AUDIOS, "resposta_ia.mp3")
        
        voz_ia = gTTS(text=resposta_texto, lang='pt', slow=False)
        voz_ia.save(caminho_saida)
        
        print(f"Sucesso! Áudio salvo em: {caminho_saida}")

    except Exception as e:
        print(f"Erro ocorrido: {e}")
    
    finally:
        # Limpa o arquivo temporário de áudio
        if os.path.exists("audio_temp.wav"):
            os.remove("audio_temp.wav")

# Executar o assistente
if __name__ == "__main__":
    ouvir_e_responder() 