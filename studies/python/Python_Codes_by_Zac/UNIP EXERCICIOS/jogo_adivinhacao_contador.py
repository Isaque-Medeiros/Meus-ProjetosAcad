# Jogo de adivinhação com contador de tentativas
from random import randint

numero_secreto = randint(1, 100)
contador = 1

while True:
    try:
        palpite = int(input("Adivinhe o número secreto (1-100): "))
        
        if palpite < 1 or palpite > 100:
            print("Digite um inteiro entre 1 e 100")
        elif numero_secreto == palpite:
            print(f"Parabéns, você acertou em {contador} tentativa(s)!")
            print(f"O número secreto é {palpite}")
            break
        elif numero_secreto < palpite:
            print(f"O número secreto é menor do que {palpite}")
            contador += 1
        else:
            print(f"O número secreto é maior do que {palpite}")
            contador += 1
            
    except ValueError:
        print("Erro! Digite um inteiro entre 1 e 100")
        