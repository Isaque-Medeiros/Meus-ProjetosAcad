# Busca linear em uma matriz usando NumPy
import numpy as np

def busca_linear_matriznp(matriz, alvo):
    li, col = matriz.shape
    for i in range(li):
        for j in range(col):
            if matriz[i, j] == alvo:
                return i, j
    return None, None

matriz = np.array([54, 26, 93, 17, 77, 31, 44, 55, 20, 65]).reshape(2, 5)

alvo = int(input("Valor a ser buscado: "))
linha, coluna = busca_linear_matriznp(matriz, alvo)

if linha == None:
    print(f"Elemento {alvo} não encontrado.")
else:
    print(f"Elemento {alvo} está na posição [{linha}, {coluna}].")
    