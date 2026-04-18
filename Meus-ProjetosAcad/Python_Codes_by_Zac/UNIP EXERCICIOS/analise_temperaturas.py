# Análise de temperaturas diárias e média semanal
temp_diarias = []
somatorio = 0

for i in range(7):
    while True:
        try:
            temp_coletada = float(input(f"Temp. média do dia {i + 1}, em °C: "))
            temp_diarias.append(temp_coletada)
            somatorio = somatorio + temp_coletada
            break
        except ValueError:
            print("Digite um valor numérico válido!")

print(f"Temperaturas diárias: {temp_diarias}")

media_semanal = somatorio / 7
print(f"Média semanal: {media_semanal:.1f}")

for i, temp in enumerate(temp_diarias, 1):
    if temp > media_semanal:
        print(f"Dia {i}: Temperatura de {temp}°C acima da média.")