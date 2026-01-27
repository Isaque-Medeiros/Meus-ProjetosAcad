# Busca de contato em uma lista de strings com split
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
    for i in range(len(lista)):
        contato = lista[i].split(" - ")
        nome = contato[0]
        telefone = contato[1]
        if nome == alvo:
            return telefone
    return None

consulta = "s"

while consulta == "s":
    nome = input("Nome do contato: ")
    telefone = buscar_contato(contatos, nome)
    
    if telefone == None:
        print(f"Telefone de {nome} não encontrado.")
    else:
        print(f"O telefone de {nome} é {telefone}.")
        
    consulta = input("Nova consulta [s/n]? ")

print("Saindo...")
