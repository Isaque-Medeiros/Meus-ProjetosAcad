# Gerenciador de tarefas simples com menu
tarefas = ["Revisar código", "Testar login", "Escrever documentação"]

print("Gerenciador de Tarefas")

while True:
    print("\nMenu:")
    print("1. Ver tarefas")
    print("2. Adicionar tarefa")
    print("3. Remover tarefa")
    print("4. Sair")
    
    opcao = input("Opção: ")
    
    if opcao == "1":
        print("\nTarefas:")
        for i, tarefa in enumerate(tarefas, 1):
            print(f"{i}. {tarefa}")
            
    elif opcao == "2":
        nova = input("Nova tarefa: ")
        tarefas.append(nova)
        print(f"'{nova}' adicionada!")
        
    elif opcao == "3":
        if not tarefas:
            print("Nenhuma tarefa para remover!")
            continue
            
        num = input("Número da tarefa a remover: ")
        if num.isdigit() and 0 < int(num) <= len(tarefas):
            removida = tarefas.pop(int(num) - 1)
            print(f"'{removida}' removida!")
        else:
            print("Número inválido!")
            
    elif opcao == "4":
        print("Até logo!")
        break
    else:
        print("Opção inválida!")