# Verificação de acesso por modalidade
mod_destacadas = ["elétrica", "mecânica", "mecatrônica"]
mod_aluno = ""

while mod_aluno != "sair":
    mod_aluno = input("Digite sua modalidade (ou 'sair' para parar): ").lower().strip()
    
    if mod_aluno in mod_destacadas:
        print("Acesso permitido!")
    elif mod_aluno == "sair":
        print("Saindo...")
    else:
        print("Acesso negado.")