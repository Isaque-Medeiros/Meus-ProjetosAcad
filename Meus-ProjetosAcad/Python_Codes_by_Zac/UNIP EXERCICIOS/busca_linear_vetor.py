# Algoritmo de busca linear em um vetor
def busca_linear_vetor(vetor, alvo):
    for i in range(len(vetor)):
        if vetor[i] == alvo:
            return i
    return None

vetor = [54, 26, 93, 17, 77, 31, 44, 55, 20, 65]

alvo = int(input("Valor a ser buscado: "))
resultado = busca_linear_vetor(vetor, alvo)

if resultado == None:
    print(f"Elemento {alvo} não encontrado.")
else:
    print(f"Elemento {alvo} encontrado na posição {resultado}.")
    