import pandas as pd
import requests
import json

# URL da sua API. Se for um arquivo local, você precisa de um servidor.
# Para este exemplo, vamos usar uma URL de exemplo da API do Santander Dev Week
API_URL = 'https://sdw-2023-prd.up.railway.app/users'

def get_user(id):
    """Busca um usuário específico na API pelo seu ID."""
    response = requests.get(f'{API_URL}/{id}')
    # Retorna o JSON se a requisição for bem-sucedida, caso contrário retorna None
    return response.json() if response.status_code == 200 else None

# 1. Ler o arquivo CSV e extrair os IDs
try:
    df = pd.read_csv('SDW2023.csv')
    user_ids = df['UserID'].tolist()
    print(f"IDs encontrados no CSV: {user_ids}")
except FileNotFoundError:
    print("Erro: Arquivo 'SDW2023.csv' não encontrado.")
    user_ids = []

# 2. Buscar os dados de cada usuário na API
users_data = []
for id in user_ids:
    user = get_user(id)
    if user:
        users_data.append(user)
    else:
        print(f"Usuário com ID {id} não encontrado na API.")

# 3. Imprimir os resultados em formato JSON
if users_data:
    print("\n--- Dados dos Usuários Encontrados ---")
    print(json.dumps(users_data, indent=2))
else:
    print("\nNenhum dado de usuário foi encontrado para os IDs fornecidos.")