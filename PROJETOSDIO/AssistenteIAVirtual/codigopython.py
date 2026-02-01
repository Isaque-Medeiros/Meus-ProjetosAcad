import speech_recognition as sr
import whisper
import os
import openai

# --- CONFIGURAÇÕES ---
# Coloque sua chave da OpenAI aqui
openai.api_key = "SUA_CHAVE_AQUI"

print("Carregando modelo Whisper...")
model = whisper.load_model("small")

def ouvir_e_responder():
    microfone = sr.Recognizer()
    
    # 1. CAPTURAR ÁUDIO
    with sr.Microphone() as source:
        microfone.adjust_for_ambient_noise(source)
        print("\nEstou ouvindo... Diga sua pergunta:")
        audio = microfone.listen(source)
    
    # Salva áudio temporário
    with open("audio_temp.wav", "wb") as f:
        f.write(audio.get_wav_data())

    try:
        # 2. TRANSCREVER COM WHISPER
        print("Whisper transcrevendo...")
        result = model.transcribe("audio_temp.wav", fp16=False, language="pt")
        transcription = result["text"].strip()
        
        if not transcription:
            print("Não entendi nada...")
            return

        print(f"Você disse: {transcription}")

        # 3. ENVIAR PARA O CHATGPT (Código da sua imagem)
        print("ChatGPT pensando na resposta...")
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{ "role": "user", "content": transcription }]
        )

        chatgpt_response = response.choices[0].message.content
        print(f"Resposta do ChatGPT: {chatgpt_response}")
        
        return chatgpt_response

    except Exception as e:
        print(f"Ocorreu um erro: {e}")
    finally:
        if os.path.exists("audio_temp.wav"):
            os.remove("audio_temp.wav")

# Executar o assistente
ouvir_e_responder()