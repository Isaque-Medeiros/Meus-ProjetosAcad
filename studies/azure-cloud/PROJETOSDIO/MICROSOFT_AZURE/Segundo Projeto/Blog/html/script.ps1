docker build -t blog-isaque-app:latest .

docker run -d -p 80:80 blog-isaque-app:latest

az login

#cria resource group
az group create --name hsouzacontainerapplab03 --location eastus
#Create container registry
az acr create --resource-group hsouzacontainerapplab03 --name blogisaque --sku Basic

#login to ACR
az acr login --name blogisaque

#tag da imagem
docker tag blog-isaque-app:latest blogisaque.azurecr.io/blog-isaque-app:latest

#push da imagem para o ACR
docker push blogisaque.azurecr.io/blog-isaque-app:latest

#Criar environment para o container app

az containerapp env create --name blogisaque-env --resource-group containerapplab03 --location eastus

#Criar o container app

az containerapp create --name blogisaque-app --resource-group hsouzacontainerapplab03 --environment blog-isaque-env --image blogisaque.azurecr.io/blog-isaque-app:latest --target-port 80 --ingress 'external' -- registry-server blogisaque.azurecr.io --registry-username blogisaque --registry-password $(az acr credential show --name blogisaque --query "passwords[0].value" -o tsv)

#Resto das configurações no azure portal, como configuração de domínio personalizado, SSL, etc.
