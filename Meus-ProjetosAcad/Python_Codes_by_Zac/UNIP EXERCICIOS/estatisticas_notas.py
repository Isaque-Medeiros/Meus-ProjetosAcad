# Cálculo de estatísticas de notas dos alunos
notas = []

quantidade_alunos = int(input("Quantos alunos você deseja cadastrar? "))

# Laço for para coletar as notas
for i in range(quantidade_alunos):
    nota = float(input(f"Digite a nota do aluno {i + 1}: "))
    notas.append(nota) # Adiciona a nota ao fim da lista

# Calcula a média, a maior nota e a menor nota
media = sum(notas) / len(notas) # Somatório/nº de notas
maior_nota = max(notas)
menor_nota = min(notas)

# Exibe os resultados
print(f"\nA média das notas dos alunos é {media:.2f}")
print(f"A maior nota registrada foi {maior_nota:.2f}")
print(f"A menor nota registrada foi {menor_nota:.2f}")
