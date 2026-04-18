# Algoritmo de busca binária para encontrar telefone em lista de contatos ordenada
contatos = [
    "Ana Silva - (11) 9999-1111",
    "Carlos Oliveira - (21) 8888-2222",
    "Fernanda Santos - (31) 7777-3333",
    "João Pereira - (41) 6666-4444",
    "Laura Costa - (51) 5555-5555",
    "Pedro Alves - (61) 4444-6666",
    "Sofia Martins - (71) 3333-7777"
]

def buscar_contato(lista, alvo):
    primeiro = 0
    ultimo = len(lista) - 1
    
    while primeiro <= ultimo:
        central = (primeiro + ultimo) // 2
        # Separa a string para comparar apenas o nome
        nome, telefone = lista[central].split(" - ")
        
        if nome == alvo:
            return telefone
        elif nome > alvo:
            ultimo = central - 1
        else:
            primeiro = central + 1
            
    return None

consulta = "s"

while consulta == "s":
    nome = input("Nome do contato: ")
    telefone = buscar_contato(contatos, nome)
    
    if telefone == None:
        print(f"Telefone de {nome} não encontrado.")
    else:
        print(f"Telefone de {nome} é {telefone}.")
        
    consulta = input("Nova consulta [s/n]? ")

print("Saindo...")
