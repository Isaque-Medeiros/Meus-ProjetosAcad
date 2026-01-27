# Implementação e teste da estrutura de dados Pilha (Stack)
class Pilha:
    def __init__(self, lista=None):
        if lista == None:
            self.pilha = []
        else:
            self.pilha = lista.copy()

    # Métodos básicos - push() e pop()
    def push(self, e):
        self.pilha.append(e)

    def pop(self):
        if self.isEmpty():
            return "Erro! Não é possível usar o pop() com a pilha vazia."
        return self.pilha.pop()

    # Métodos complementares - isEmpty(), size() e top()
    def isEmpty(self):
        return len(self.pilha) == 0

    def size(self):
        return len(self.pilha)

    def top(self):
        if self.isEmpty():
            return "Erro! Não é possível usar o top() com a pilha vazia."
        return self.pilha[-1] # índice -1 aponta para o último elemento

    # Método especial para impressão do objeto
    def __str__(self):
        return f"({self.pilha})"

def main():
    # Pilha p iniciada a partir de uma lista l1 de 3 elementos
    l1 = [2, 3, 4]
    p = Pilha(l1)
    p.push(4)
    p.push(6)
    print(p.pop())          # Saída: 6
    print(p.isEmpty())      # Saída: False
    print(p.top())          # Saída: 4
    print(p.size())         # Saída: 4
    print(p)                # Saída: ([2, 3, 4, 4])
    print(l1)               # Saída: [2, 3, 4] (lista original intacta)

    # Pilha p2 iniciada vazia
    p2 = Pilha()
    print(p2.isEmpty())     # Saída: True
    print(p2.top())         # Mensagem de erro
    print(p2.pop())         # Mensagem de erro
    p2.push("Olá")
    p2.push(p2.top())       # Duplica o topo
    print(p2)               # Saída: (['Olá', 'Olá'])

if __name__ == "__main__":
    main()
    