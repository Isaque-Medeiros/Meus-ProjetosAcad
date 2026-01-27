#projeto curso plataforma DIO

tonelada = float(input('Digite a quantidade de tonelada: '))
preco_por_tonelada = float(input('Digite o preço por toneladas (valor em dolares): '))
tipo_de_cliente = ('''| Cliente Novo |
| Cliente Fidelizado |
| Cliente Premium |''')
resposta_cliente = str(input(f'Digite a categoria de cliente: \n\n{tipo_de_cliente}\n\nEntrada: ')).title()

valor_total = preco_por_tonelada * tonelada

if (resposta_cliente == 'Cliente Novo'):
    valor_final = valor_total
    print(f'O valor final é ${valor_total:.2f}')
elif(resposta_cliente == 'Cliente Fidelizado'):
    valor_final = valor_total * 0.95
    print(f'O valor final é ${valor_total:.2f}')
elif(resposta_cliente == 'Cliente Premium'):
    valor_final = valor_total *.90
    print(f'O valor final é ${valor_total:.2f}')

