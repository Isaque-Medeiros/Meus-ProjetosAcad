// ===================================================================
// ARQUIVO: funcoes.cpp
// OBJETIVO: Implementação das funcionalidades do Sistema de Gestão Acadêmica
// ===================================================================

// --- BIBLIOTECAS ---
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <limits>
#include <cstddef>
#include <sstream>
#include <iomanip>

using namespace std;

// --- ESTRUTURAS DE DADOS ---
struct Aluno {
    string nome;
    int matricula;
    string curso;
    int faltas;
};

struct Materia {
    string codigo;
    string nome;
};

// --- PROTÓTIPOS DAS FUNÇÕES ---

// Funções Auxiliares (manipulação de arquivos e buffer)
void limpar_buffer();
vector<Aluno> ler_alunos_do_arquivo();
void salvar_alunos_no_arquivo(const vector<Aluno>& alunos);
vector<Materia> ler_materias_do_arquivo();
vector<int> ler_fila_do_arquivo();
void salvar_fila_no_arquivo(const vector<int>& fila);

// Funções do Menu Principal
void matricular_aluno();
void matricular_turma();
void ver_turmas();
void aplicar_falta();
void ver_frequencia();
void lancar_notas();
void ver_notas();
void relatorio();
void fila_atendimento();
void chamar_proximo_da_fila();

// ===================================================================
// FUNÇÃO PRINCIPAL
// ===================================================================
int main() {
    int opcao;

    do {
        cout << "\n\n=== Sistema de Gestao Academica ===\n";
        cout << "1  - Matricular Aluno\n";
        cout << "2  - Matricular Turma\n";
        cout << "3  - Ver Turmas\n";
        cout << "4  - Aplicar Falta\n";
        cout << "5  - Ver Frequencia\n";
        cout << "6  - Lancar Nota\n";
        cout << "7  - Ver Notas\n";
        cout << "8  - Escrever Relatorio\n";
        cout << "9  - Fila de Atendimento\n";
        cout << "10 - Chamar Proximo da Fila\n";
        cout << "0  - Sair\n";
        cout << "-------------------------------------\n";
        cout << "Escolha uma opcao: ";

        if (!(cin >> opcao)) {
            cout << "\nOpcao invalida! Por favor, digite um numero.\n";
            limpar_buffer();
            continue;
        }
        limpar_buffer(); // Limpa o buffer após uma leitura bem-sucedida

        switch (opcao) {
            case 1:  matricular_aluno();        break;
            case 2:  matricular_turma();        break;
            case 3:  ver_turmas();              break;
            case 4:  aplicar_falta();           break;
            case 5:  ver_frequencia();          break;
            case 6:  lancar_notas();            break;
            case 7:  ver_notas();               break;
            case 8:  relatorio();               break;
            case 9:  fila_atendimento();        break;
            case 10: chamar_proximo_da_fila();  break;
            case 0:  cout << "Saindo do sistema...\n"; break;
            default: cout << "Opcao invalida! Tente novamente.\n";
        }
    } while (opcao != 0);

    return 0;
}

// ===================================================================
// SEÇÃO: FUNÇÕES AUXILIARES
// ===================================================================

void limpar_buffer() {
    cin.clear();
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
}

vector<Aluno> ler_alunos_do_arquivo() {
    vector<Aluno> alunos;
    ifstream arquivo("alunos.txt");
    if (arquivo.is_open()) {
        string linha;
        while (getline(arquivo, linha)) {
            stringstream ss(linha);
            string nome, matricula_str, curso, faltas_str;
            Aluno aluno;

            if (getline(ss, aluno.nome, ',') &&
                getline(ss, matricula_str, ',') &&
                getline(ss, aluno.curso, ',') &&
                getline(ss, faltas_str)) {
                
                aluno.matricula = stoi(matricula_str);
                aluno.faltas = stoi(faltas_str);
                alunos.push_back(aluno);
            }
        }
        arquivo.close();
    }
    return alunos;
}

void salvar_alunos_no_arquivo(const vector<Aluno>& alunos) {
    ofstream arquivo("alunos.txt");
    if (arquivo.is_open()) {
        for (const Aluno& aluno : alunos) {
            arquivo << aluno.nome << ","
                    << aluno.matricula << ","
                    << aluno.curso << ","
                    << aluno.faltas << endl;
        }
        arquivo.close();
    } else {
        cout << "ERRO CRITICO: Nao foi possivel abrir alunos.txt para salvar!\n";
    }
}

vector<Materia> ler_materias_do_arquivo() {
    vector<Materia> materias;
    ifstream arquivo("materias.txt");
    if (arquivo.is_open()) {
        string linha;
        while (getline(arquivo, linha)) {
            stringstream ss(linha);
            string codigo, nome;
            if (getline(ss, codigo, ',') && getline(ss, nome)) {
                materias.push_back({codigo, nome});
            }
        }
        arquivo.close();
    }
    return materias;
}

vector<int> ler_fila_do_arquivo() {
    vector<int> fila;
    ifstream arquivo("fila.txt");
    if (arquivo.is_open()) {
        int matricula;
        while (arquivo >> matricula) {
            fila.push_back(matricula);
        }
        arquivo.close();
    }
    return fila;
}

void salvar_fila_no_arquivo(const vector<int>& fila) {
    ofstream arquivo("fila.txt");
    if (arquivo.is_open()) {
        for (int matricula : fila) {
            arquivo << matricula << endl;
        }
        arquivo.close();
    } else {
        cout << "ERRO CRITICO: Nao foi possivel salvar o estado da fila!\n";
    }
}

// ===================================================================
// SEÇÃO: FUNÇÕES DE GESTÃO DE ALUNOS E TURMAS
// ===================================================================

void matricular_aluno() {
    cout << "\n--------- Matricular Aluno ---------\n";
    Aluno aluno;

    cout << "Digite o nome do aluno: ";
    getline(cin, aluno.nome);

    cout << "Digite o numero de matricula: ";
    cin >> aluno.matricula;
    limpar_buffer();

    cout << "Digite o curso: ";
    getline(cin, aluno.curso);

    cout << "Digite o numero inicial de faltas (0 se nao tiver): ";
    cin >> aluno.faltas;
    limpar_buffer();

    ofstream arquivo("alunos.txt", ios::app);
    if (arquivo.is_open()) {
        arquivo << aluno.nome << "," << aluno.matricula << "," << aluno.curso << "," << aluno.faltas << endl;
        arquivo.close();
        cout << "Aluno matriculado com sucesso!\n";
    } else {
        cout << "Erro ao abrir o arquivo para gravacao!\n";
    }
}

void matricular_turma() {
    cout << "\n--------- Matricular Turma ---------\n";
    string nome_turma;
    cout << "Digite o nome da nova turma: ";
    getline(cin, nome_turma);

    vector<Aluno> todos_alunos = ler_alunos_do_arquivo();
    if (todos_alunos.empty()) {
        cout << "Nenhum aluno cadastrado no sistema.\n";
        return;
    }

    vector<int> matriculas_na_turma;
    int numero_aluno;

    while (true) {
        cout << "\n--- Alunos Disponiveis ---\n";
        for (size_t i = 0; i < todos_alunos.size(); ++i) {
            cout << i + 1 << " - " << todos_alunos[i].nome << "\n";
        }
        cout << "0 - Finalizar e Salvar Turma\n";
        cout << "Digite o numero do aluno para adicionar: ";

        cin >> numero_aluno;
        if (cin.fail() || numero_aluno < 0 || numero_aluno > todos_alunos.size()) {
            cout << "Entrada invalida!\n";
            limpar_buffer();
            continue;
        }

        if (numero_aluno == 0) break;

        matriculas_na_turma.push_back(todos_alunos[numero_aluno - 1].matricula);
        cout << "Aluno '" << todos_alunos[numero_aluno - 1].nome << "' adicionado.\n";
        todos_alunos.erase(todos_alunos.begin() + (numero_aluno - 1));
    }
    limpar_buffer();

    if (matriculas_na_turma.empty()) {
        cout << "Nenhum aluno adicionado. Turma nao criada.\n";
        return;
    }

    ofstream arquivo("turmas.txt", ios::app);
    if (arquivo.is_open()) {
        arquivo << nome_turma << ":";
        for (size_t i = 0; i < matriculas_na_turma.size(); ++i) {
            arquivo << matriculas_na_turma[i] << (i == matriculas_na_turma.size() - 1 ? "" : ",");
        }
        arquivo << endl;
        arquivo.close();
        cout << "Turma '" << nome_turma << "' salva com sucesso!\n";
    } else {
        cout << "Erro ao abrir o arquivo turmas.txt!\n";
    }
}

void ver_turmas() {
    cout << "\n--------- Turmas Cadastradas ---------\n";
    vector<Aluno> todos_alunos = ler_alunos_do_arquivo();
    ifstream arquivo_turmas("turmas.txt");

    if (!arquivo_turmas.is_open() || arquivo_turmas.peek() == EOF) {
        cout << "Nenhuma turma foi criada ainda.\n";
        return;
    }

    string linha_turma;
    while (getline(arquivo_turmas, linha_turma)) {
        stringstream ss_linha(linha_turma);
        string nome_turma, matriculas_str;
        getline(ss_linha, nome_turma, ':');
        getline(ss_linha, matriculas_str);

        cout << "\n--- Turma: " << nome_turma << " ---\n";
        stringstream ss_matriculas(matriculas_str);
        string matricula_individual_str;

        while (getline(ss_matriculas, matricula_individual_str, ',')) {
            int matricula_aluno = stoi(matricula_individual_str);
            bool aluno_encontrado = false;
            for (const Aluno& aluno : todos_alunos) {
                if (aluno.matricula == matricula_aluno) {
                    cout << "  - Nome: " << aluno.nome << " | Matricula: " << aluno.matricula << "\n";
                    aluno_encontrado = true;
                    break;
                }
            }
            if (!aluno_encontrado) {
                cout << "  - Aluno com matricula " << matricula_aluno << " nao encontrado.\n";
            }
        }
    }
    arquivo_turmas.close();
}

// ===================================================================
// SEÇÃO: FUNÇÕES DE ACOMPANHAMENTO ACADÊMICO
// ===================================================================

void aplicar_falta() {
    cout << "\n--------- Aplicar Falta ---------\n";
    vector<Aluno> alunos = ler_alunos_do_arquivo();
    if (alunos.empty()) {
        cout << "Nenhum aluno cadastrado no sistema.\n";
        return;
    }

    cout << "Selecione o aluno para aplicar a falta:\n";
    for (size_t i = 0; i < alunos.size(); ++i) {
        cout << i + 1 << " - " << alunos[i].nome << " (Faltas atuais: " << alunos[i].faltas << ")\n";
    }
    cout << "0 - Voltar ao menu\n";
    cout << "Escolha uma opcao: ";

    int escolha;
    cin >> escolha;
    if (cin.fail() || escolha < 0 || escolha > alunos.size()) {
        cout << "Opcao invalida!\n";
        limpar_buffer();
        return;
    }

    if (escolha == 0) {
        limpar_buffer();
        return;
    }

    int indice_aluno = escolha - 1;
    int faltas_a_adicionar;
    cout << "Digite o numero de faltas a ADICIONAR para " << alunos[indice_aluno].nome << ": ";
    cin >> faltas_a_adicionar;

    if (cin.fail() || faltas_a_adicionar < 0) {
        cout << "Numero de faltas invalido!\n";
        limpar_buffer();
        return;
    }

    alunos[indice_aluno].faltas += faltas_a_adicionar;
    salvar_alunos_no_arquivo(alunos);

    cout << "Faltas aplicadas com sucesso!\n";
    cout << "Novo total de faltas de " << alunos[indice_aluno].nome << ": " << alunos[indice_aluno].faltas << "\n";
    limpar_buffer();
}

void ver_frequencia() {
    cout << "\n--------- Ver Frequencia ---------\n";
    vector<Aluno> alunos = ler_alunos_do_arquivo();
    if (alunos.empty()) {
        cout << "Nenhum aluno cadastrado para verificar a frequencia.\n";
        return;
    }

    int total_aulas;
    cout << "Digite o numero total de aulas do curso/semestre: ";
    cin >> total_aulas;
    if (cin.fail() || total_aulas <= 0) {
        cout << "Numero total de aulas invalido!\n";
        limpar_buffer();
        return;
    }

    cout << "\n--- Relatorio de Frequencia ---\n";
    cout << fixed << setprecision(2);

    for (const Aluno& aluno : alunos) {
        double porcentagem_faltas = ((double)aluno.faltas / total_aulas) * 100.0;
        double porcentagem_presenca = 100.0 - porcentagem_faltas;

        if (porcentagem_presenca < 0) {
            porcentagem_presenca = 0;
        }

        cout << "Aluno: " << aluno.nome
             << " | Faltas: " << aluno.faltas
             << " | Frequencia: " << porcentagem_presenca << "%\n";
    }
    cout << "--------------------------------\n";
    limpar_buffer();
}

void lancar_notas() {
    cout << "\n--------- Lancar Nota ---------\n";
    vector<Aluno> alunos = ler_alunos_do_arquivo();
    vector<Materia> materias = ler_materias_do_arquivo();

    if (alunos.empty()) {
        cout << "Nenhum aluno cadastrado no sistema.\n";
        return;
    }
    if (materias.empty()) {
        cout << "AVISO: Nenhuma materia cadastrada em 'materias.txt'.\n";
        cout << "Crie o arquivo 'materias.txt' com o conteudo 'CODIGO,NOME' por linha.\n";
        return;
    }

    cout << "Selecione o aluno:\n";
    for (size_t i = 0; i < alunos.size(); ++i) {
        cout << i + 1 << " - " << alunos[i].nome << "\n";
    }
    cout << "0 - Voltar\n";
    cout << "Escolha uma opcao: ";
    
    int escolha_aluno;
    cin >> escolha_aluno;
    if (cin.fail() || escolha_aluno < 0 || escolha_aluno > alunos.size()) {
        cout << "Opcao invalida!\n";
        limpar_buffer();
        return;
    }
    if (escolha_aluno == 0) {
        limpar_buffer();
        return;
    }
    Aluno aluno_selecionado = alunos[escolha_aluno - 1];

    cout << "\n--- Materias Disponiveis ---\n";
    for(const auto& materia : materias) {
        cout << "Codigo: " << materia.codigo << " - Nome: " << materia.nome << "\n";
    }
    cout << "----------------------------\n";
    
    cout << "Digite o CODIGO da materia: ";
    string codigo_materia;
    cin >> codigo_materia;
    
    bool codigo_valido = false;
    for(const auto& materia : materias) {
        if (materia.codigo == codigo_materia) {
            codigo_valido = true;
            break;
        }
    }
    if (!codigo_valido) {
        cout << "Codigo de materia invalido!\n";
        limpar_buffer();
        return;
    }

    double nota;
    cout << "Digite a nota para " << aluno_selecionado.nome << ": ";
    cin >> nota;
    if (cin.fail() || nota < 0 || nota > 10) {
        cout << "Nota invalida! Deve ser entre 0 e 10.\n";
        limpar_buffer();
        return;
    }

    ofstream arquivo("notas.txt", ios::app);
    if (arquivo.is_open()) {
        arquivo << aluno_selecionado.matricula << "," << codigo_materia << "," << nota << endl;
        arquivo.close();
        cout << "Nota lancada com sucesso!\n";
    } else {
        cout << "Erro ao abrir o arquivo notas.txt!\n";
    }
    limpar_buffer();
}

void ver_notas() {
    cout << "\n--------- Boletim de Notas ---------\n";
    vector<Aluno> alunos = ler_alunos_do_arquivo();
    vector<Materia> materias = ler_materias_do_arquivo();
    ifstream arquivo_notas("notas.txt");

    if (alunos.empty()) {
        cout << "Nenhum aluno cadastrado.\n";
        return;
    }
    if (!arquivo_notas.is_open() || arquivo_notas.peek() == EOF) {
        cout << "Nenhuma nota foi lancada ainda.\n";
        return;
    }

    for (const auto& aluno : alunos) {
        cout << "\n--- Aluno: " << aluno.nome << " (Matricula: " << aluno.matricula << ") ---\n";
        
        arquivo_notas.clear();
        arquivo_notas.seekg(0, ios::beg);

        string linha;
        bool encontrou_nota = false;
        while (getline(arquivo_notas, linha)) {
            stringstream ss(linha);
            string matricula_str, codigo_materia, nota_str;
            getline(ss, matricula_str, ',');
            getline(ss, codigo_materia, ',');
            getline(ss, nota_str, ',');

            if (stoi(matricula_str) == aluno.matricula) {
                encontrou_nota = true;
                string nome_materia = "Materia Desconhecida";
                for (const auto& materia : materias) {
                    if (materia.codigo == codigo_materia) {
                        nome_materia = materia.nome;
                        break;
                    }
                }
                cout << "  - Materia: " << nome_materia << " | Nota: " << stod(nota_str) << "\n";
            }
        }

        if (!encontrou_nota) {
            cout << "  (Nenhuma nota lancada para este aluno)\n";
        }
    }
    arquivo_notas.close();
}

// ===================================================================
// SEÇÃO: FUNÇÕES ADMINISTRATIVAS E DE ATENDIMENTO
// ===================================================================

void relatorio() {
    cout << "\n--------- Escrever Relatorio ---------\n";
    int matricula;
    cout << "Para identificar, digite sua matricula: ";
    if (!(cin >> matricula)) {
        cout << "Matricula invalida! Apenas numeros.\n";
        limpar_buffer();
        return;
    }
    limpar_buffer();

    string texto_relatorio;
    cout << "Digite seu relatorio (pressione ENTER para salvar):\n> ";
    getline(cin, texto_relatorio);

    if (texto_relatorio.empty()) {
        cout << "Relatorio vazio. Nada foi salvo.\n";
        return;
    }

    ofstream arquivo("relatorio.txt", ios::app);
    if (arquivo.is_open()) {
        arquivo << "Matricula " << matricula << ": " << texto_relatorio << endl;
        arquivo.close();
        cout << "Relatorio salvo com sucesso!\n";
    } else {
        cout << "Erro ao abrir o arquivo relatorio.txt!\n";
    }
}

void fila_atendimento() {
    cout << "\n--------- Fila de Atendimento da Secretaria ---------\n";
    vector<int> fila = ler_fila_do_arquivo();
    vector<Aluno> todos_alunos = ler_alunos_do_arquivo();

    if (fila.empty()) {
        cout << "A fila de atendimento esta vazia.\n";
    } else {
        cout << "Pessoas na fila no momento:\n";
        for (size_t i = 0; i < fila.size(); ++i) {
            string nome_aluno = "Desconhecido";
            for (const auto& aluno : todos_alunos) {
                if (aluno.matricula == fila[i]) {
                    nome_aluno = aluno.nome;
                    break;
                }
            }
            cout << i + 1 << "o - " << nome_aluno << " (Matricula: " << fila[i] << ")\n";
        }
    }

    cout << "\nDigite sua matricula para entrar na fila (ou 0 para voltar): ";
    int nova_matricula;
    cin >> nova_matricula;

    if (cin.fail()) {
        cout << "Entrada invalida.\n";
        limpar_buffer();
        return;
    }
    if (nova_matricula == 0) {
        limpar_buffer();
        return;
    }

    bool aluno_existe = false;
    for (const auto& aluno : todos_alunos) {
        if (aluno.matricula == nova_matricula) {
            aluno_existe = true;
            break;
        }
    }
    if (!aluno_existe) {
        cout << "Erro: Aluno com matricula " << nova_matricula << " nao encontrado.\n";
        limpar_buffer();
        return;
    }

    for (int matricula_na_fila : fila) {
        if (matricula_na_fila == nova_matricula) {
            cout << "Voce ja esta na fila!\n";
            limpar_buffer();
            return;
        }
    }

    fila.push_back(nova_matricula);
    salvar_fila_no_arquivo(fila);
    cout << "Voce foi adicionado a fila! Sua posicao e: " << fila.size() << "o\n";
    limpar_buffer();
}

void chamar_proximo_da_fila() {
    cout << "\n--------- Chamar Proximo da Fila ---------\n";
    vector<int> fila = ler_fila_do_arquivo();

    if (fila.empty()) {
        cout << "Nao ha ninguem na fila para chamar.\n";
        return;
    }

    int matricula_atendida = fila.front();
    vector<Aluno> todos_alunos = ler_alunos_do_arquivo();
    string nome_aluno = "Desconhecido";
    for (const auto& aluno : todos_alunos) {
        if (aluno.matricula == matricula_atendida) {
            nome_aluno = aluno.nome;
            break;
        }
    }

    cout << "Chamando para atendimento: " << nome_aluno << " (Matricula: " << matricula_atendida << ")\n";

    fila.erase(fila.begin());
    salvar_fila_no_arquivo(fila);

    cout << "Aluno atendido e removido da fila.\n";
}