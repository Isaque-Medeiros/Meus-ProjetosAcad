# Cálculo de distribuição de tarefas entre funcionários e verificação de sobra
print("Insira o nº de tarefas a serem realizadas")
tarefas = int(input())

sobra = tarefas % 4

if sobra == 0:
    print(f"Cada funcionário deve receber {tarefas // 4} tarefa(s)")
else:
    print(f"É necessário adiantar {4 - sobra} tarefa(s)")
    