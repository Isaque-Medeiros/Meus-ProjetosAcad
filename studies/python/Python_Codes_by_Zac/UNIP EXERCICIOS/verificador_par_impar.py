# Função para verificar se um número é par ou ímpar
def verificar_par_impar(numero):
    if numero % 2 == 0:
        return "par"
    else:
        return "ímpar"

while True:
    num = int(input("Digite um nº inteiro (0 p/ sair): "))
    
    if num == 0:
        print("O número 0 é par.")
        break
    else:
        resultado = verificar_par_impar(num)
        print(f"O número {num} é {resultado}.")

print("Até logo!")
