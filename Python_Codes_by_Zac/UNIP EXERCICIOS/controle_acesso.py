# Controle de acesso a um evento com loop de repetição
continuar = "s"

while continuar == "s":
    nome = input("Nome: ").lower().strip()
    idade = int(input("Idade: "))

    if idade >= 16 or nome == "ana silva" or nome == "paulo santos":
        print("Acesso permitido! Bem-vindo(a) ao evento!")
    else:
        print("Acesso negado.")

    continuar = input("Pedir dados de outra pessoa? [s/n]: ").lower().strip()

print("Até logo!")
