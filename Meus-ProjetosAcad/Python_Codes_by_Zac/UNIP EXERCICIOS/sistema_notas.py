# Cálculo de média semestral e verificação de aprovação
print("SISTEMA DE NOTAS")

np1 = float(input("Digite a nota da NP1: "))
np2 = float(input("Digite a nota da NP2: "))
pim = float(input("Digite a nota do PIM: "))

mediaSemestral = (np1*4 + np2*4 + pim*2)/10

if mediaSemestral >= 7:
    print(f"Parabéns, você passou direto com {mediaSemestral}.")
else:
    precisaEx = 10 - mediaSemestral
    print(f"Sua média semestral é {mediaSemestral}.")
    print(f"Você precisa tirar {precisaEx} no exame para passar.")

print("FIM!")