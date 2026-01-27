# Algoritmo de busca binária em um vetor ordenado
def busca_binaria_vetor(vetor, alvo):
    primeiro = 0
    ultimo = len(vetor) - 1
    
    while primeiro <= ultimo:
        central = (primeiro + ultimo) // 2
        if vetor[central] == alvo:
            return central
        elif vetor[central] > alvo:
            ultimo = central - 1
        else:
            primeiro = central + 1
            
    return None

vetor = [17, 20, 26, 31, 44, 54, 55, 65, 77, 93]

alvo = int(input("Valor a ser buscado: "))
resultado = busca_binaria_vetor(vetor, alvo)

if resultado == None:
    print(f"Elemento {alvo} não encontrado.")
else:
    print(f"Elemento {alvo} encontrado na posição {resultado}.")
    