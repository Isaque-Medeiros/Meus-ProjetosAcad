// ===================================================================
// ARQUIVO: login.cpp
// OBJETIVO: Sistema de autenticação de usuários (Login e Cadastro)
// ===================================================================

// --- BIBLIOTECAS E DEFINIÇÕES ---
#include <iostream>
#include <fstream>
#include <string>
#include <limits>
#include "cJSON.h"

#define ARQUIVO_USUARIOS "Usuario_School.json"

using namespace std;

// --- ESTRUTURA DE DADOS ---
struct Usuario {
    string nome;
    string senha;
};

// --- PROTÓTIPOS DAS FUNÇÕES ---
bool login_user();
void cadastro_user();

// ===================================================================
// FUNÇÃO PRINCIPAL
// ===================================================================
int main() {
    int resp;
    bool login_sucesso = false;

    do {
        cout << "\n\nOla, bem-vindo a IETEP\n";
        cout << "Para prosseguir, insira seu login ou cadastre-se.\n\n";
        cout << "1 - Fazer LOGIN\n";
        cout << "2 - Cadastre-se\n\n";
        cout << "Escolha uma opcao: ";

        if (!(cin >> resp)) {
            cerr << "Entrada invalida. Encerrando." << endl;
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            continue;
        }

        switch (resp) {
            case 1:
                login_sucesso = login_user();
                break;
            case 2:
                cadastro_user();
                break;
            default:
                cout << "Opcao invalida. Tente novamente." << endl;
                break;
        }

    } while (!login_sucesso);

    cout << "\n--- Sessao de Usuario Iniciada ---\n" << endl;

    return 0;
}

// ===================================================================
// FUNÇÃO DE LOGIN
// ===================================================================
bool login_user() {
    string nome_usuario, senha_usuario;

    cout << "\n\n-- Login --\n";
    cout << "Insira seu nome de usuario: ";
    cin >> nome_usuario;

    cout << "Insira sua senha: ";
    cin >> senha_usuario;

    // Tenta abrir o arquivo de usuários para leitura
    ifstream arquivo(ARQUIVO_USUARIOS);
    if (!arquivo.is_open()) {
        cout << "Nenhum usuario cadastrado. Por favor, cadastre-se primeiro.\n";
        return false;
    }

    // Lê o conteúdo do arquivo JSON
    string json_string((istreambuf_iterator<char>(arquivo)), istreambuf_iterator<char>());
    arquivo.close();

    cJSON *root = cJSON_Parse(json_string.c_str());
    if (root == nullptr || !cJSON_IsArray(root)) {
        cout << "Formato de arquivo de usuarios invalido ou vazio.\n";
        cJSON_Delete(root);
        return false;
    }

    // Procura pelo usuário na lista
    bool usuario_encontrado = false;
    int num_usuarios = cJSON_GetArraySize(root);

    for (int i = 0; i < num_usuarios; i++) {
        cJSON *usuario_json = cJSON_GetArrayItem(root, i);
        cJSON *j_nome = cJSON_GetObjectItem(usuario_json, "nome");
        cJSON *j_senha = cJSON_GetObjectItem(usuario_json, "senha");

        if (j_nome && j_senha && j_nome->valuestring && j_senha->valuestring) {
            if (nome_usuario == j_nome->valuestring && senha_usuario == j_senha->valuestring) {
                usuario_encontrado = true;
                cout << "Login bem-sucedido! Bem-vindo, " << j_nome->valuestring << ".\n";
                break;
            }
        }
    }

    if (!usuario_encontrado) {
        cout << "Nome de usuario ou senha incorretos. Tente novamente.\n";
    }

    // Libera a memória
    cJSON_Delete(root);
    return usuario_encontrado;
}

// ===================================================================
// FUNÇÃO DE CADASTRO
// ===================================================================
void cadastro_user() {
    Usuario novo_usuario;
    string confirma_senha;

    // --- Coleta de dados ---
    cout << "\n\n-- Cadastro --\n";
    cout << "Insira seu nome de usuario: ";
    cin >> novo_usuario.nome;

    do {
        cout << "Insira a sua senha: ";
        cin >> novo_usuario.senha;

        cout << "Confirme a sua senha: ";
        cin >> confirma_senha;

        if (novo_usuario.senha != confirma_senha) {
            cout << "\nERRO: As senhas nao coincidem. Tente novamente.\n\n";
        }
    } while (novo_usuario.senha != confirma_senha);

    cout << "\nSenhas confirmadas. Prosseguindo...\n";

    // --- Leitura do arquivo existente ---
    cJSON *root = nullptr;
    ifstream arquivo_leitura(ARQUIVO_USUARIOS);

    if (arquivo_leitura.is_open()) {
        string json_string((istreambuf_iterator<char>(arquivo_leitura)), istreambuf_iterator<char>());
        arquivo_leitura.close();
        if (!json_string.empty()) {
            root = cJSON_Parse(json_string.c_str());
        }
    }

    // Se o arquivo for inválido ou vazio, cria um novo array
    if (root == nullptr || !cJSON_IsArray(root)) {
        cJSON_Delete(root);
        root = cJSON_CreateArray();
    }

    // --- Adição do novo usuário e salvamento ---
    cJSON *usuario_json = cJSON_CreateObject();
    cJSON_AddStringToObject(usuario_json, "nome", novo_usuario.nome.c_str());
    cJSON_AddStringToObject(usuario_json, "senha", novo_usuario.senha.c_str());
    cJSON_AddItemToArray(root, usuario_json);

    char *json_para_salvar = cJSON_Print(root);

    ofstream arquivo_escrita(ARQUIVO_USUARIOS);
    if (arquivo_escrita.is_open()) {
        arquivo_escrita << json_para_salvar;
        arquivo_escrita.close();
        cout << "Usuario cadastrado com sucesso!\n";
    } else {
        cout << "ERRO CRITICO: Nao foi possivel salvar o novo usuario!\n";
    }

    // --- Liberação da memória ---
    cJSON_Delete(root);
    free(json_para_salvar);
}