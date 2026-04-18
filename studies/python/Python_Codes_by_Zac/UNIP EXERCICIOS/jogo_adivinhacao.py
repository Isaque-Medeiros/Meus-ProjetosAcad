# Jogo de adivinhação com tratamento de erros e números aleatórios
from random import randint

# Gera um número inteiro aleatório de 1 a 100
numero_secreto = randint(1, 100)

while True:
    try:
        palpite = int(input("Adivinhe o número secreto (1-100): "))
        
        if palpite < 1 or palpite > 100:
            print("Digite um inteiro entre 1 e 100")
        elif numero_secreto == palpite:
            print(f"Parabéns, você acertou! O número secreto é {palpite}")
            break
        elif numero_secreto < palpite:
            print(f"O número secreto é menor do que {palpite}")
        else:
            print(f"O número secreto é maior do que {palpite}")
            
    except ValueError:
        print("Erro! Digite um inteiro entre 1 e 100")
        