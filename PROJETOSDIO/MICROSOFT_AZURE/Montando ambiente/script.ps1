az provider register --namespace Microsoft.OperationalInsights
myRG=hsouzacontainerapp
myLocation = eastus
myAppContainerEnv = hsouza-env-001
az group create --name hsouzacontainerapp --location eastus
az containerapp env create --name hsouza-env-001 --resource-group hsouzacontainerapp --location $myLocation

az containerapp create \
    --name my-container-app \
    --resource-group hsouzacontainerapp \
    --enviroment hsouza-env-001\  
    --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
    --target-port 80 \
    --ingress 'external' \
    --query properties.configuration.ingress.fqdn

# Vai retornar o local do container app, algo como: my-container-app.eastus.azurecontainerapps.io
