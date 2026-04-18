# Simulação de conta bancária usando Programação Orientada a Objetos (POO)
class ContaBancaria:
    # Método construtor
    def __init__(self, titular, saldo_inicial=0):
        self.titular = titular          # Atributo: nome do titular
        self.saldo = saldo_inicial      # Atributo: saldo atual

    # Métodos de operações bancárias
    def depositar(self, valor):
        self.saldo = self.saldo + valor

    def sacar(self, valor):
        self.saldo = self.saldo - valor

    # Método especial para impressão do objeto
    def __str__(self):
        return f"Conta de {self.titular}. Saldo: R$ {self.saldo:.2f}"

def main():
    conta_maria = ContaBancaria("Maria", 300)     # Titular, saldo inicial
    conta_henrique = ContaBancaria("Henrique")    # Saldo inicial padrão: 0
    lista_contas = [conta_maria, conta_henrique]  # Conta 0 (Maria) e conta 1 (Henrique)
    continua = "s"

    while continua == "s":
        conta = int(input("Nº da conta [0/1]: "))
        
        while True:
            print("\n1. Depositar")
            print("2. Sacar")
            print("3. Consultar")
            print("4. Sair")
            opcao = input("Opção: ")

            if opcao == "1":
                valor = float(input("Valor a depositar: "))
                lista_contas[conta].depositar(valor)
            elif opcao == "2":
                valor = float(input("Valor a sacar: "))
                lista_contas[conta].sacar(valor)
            elif opcao == "3":
                print(lista_contas[conta])
            elif opcao == "4":
                break
            else:
                print("Opção inválida.")

        continua = (input("Realizar operações em outra conta? [s/n]: "))

    print("Até logo!")

if __name__ == "__main__":
    main()