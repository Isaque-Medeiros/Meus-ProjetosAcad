# Cálculo simplificado de média semestral (MS)
np1 = float(input("Digite a nota da sua prova NP1: "))
np2 = float(input("Digite a nota da sua prova NP2: "))
pim = float(input("Digite a nota do PIM: "))

ms = (4 * np1 + 4 * np2 + 2 * pim) / 10

print(f"Sua média do semestre é {ms}")
