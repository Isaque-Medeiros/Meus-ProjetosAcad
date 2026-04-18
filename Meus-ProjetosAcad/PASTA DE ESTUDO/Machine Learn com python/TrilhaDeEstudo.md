# 🧠 Domínio Técnico: Python para Machine Learning

Este repositório contém um guia de estudos aprofundado baseado no curso **"Introdução ao Python para ML"** da [DIO](https://www.dio.me/), ministrado pelo **Prof. Dr. Diego Bruno**. O foco é consolidar o conhecimento teórico com fontes oficiais e bibliografias acadêmicas, indo além da sintaxe básica para alcançar o domínio da lógica de Aprendizado de Máquina.

---

## 🏗️ 1. Paradigmas de Programação em ML

O desenvolvimento de modelos de Machine Learning em Python exige a compreensão de diferentes formas de estruturar o raciocínio computacional.

*   **Paradigma Imperativo:** Focado na mudança de estados através de comandos sequenciais. Essencial para o controle de fluxo de scripts de pré-processamento.
    *   *Fonte:* [Python Docs - Control Flow](https://docs.python.org/3/tutorial/controlflow.html)
*   **Paradigma Funcional:** Trata a computação como avaliações de funções matemáticas, evitando estados mutáveis. Em ML, é amplamente utilizado em transformações de dados via `lambda`, `map` e `filter`.
    *   *Fonte:* [Python Docs - Functional Programming HOWTO](https://docs.python.org/3/howto/functional.html)
*   **Programação Orientada a Objetos (POO):** Organiza o sistema em classes e objetos. É a base das principais bibliotecas como Scikit-Learn (onde modelos são classes) e Keras.
    *   *Fonte:* [Python Docs - Classes](https://docs.python.org/3/tutorial/classes.html)

> **💡 Exemplo Prático (Generativo):** Imagine que você cria uma classe `ModeloPreditivo`. Dentro dela, você define o método `treinar()`. Toda vez que você instanciar esse objeto, ele carregará seus próprios "pesos" e "vieses", isolando a lógica de treinamento da lógica de execução.

---

## 🛠️ 2. Ecossistema e Ambiente de Desenvolvimento

Para produção de ML, a escolha da ferramenta impacta a escalabilidade do projeto:

*   **Sublime Text:** Editor de texto de alto desempenho. Utiliza o sistema de *build* interno para execução de scripts Python de forma leve.
    *   *Documentação:* [Sublime Text Official Docs](https://www.sublimetext.com/docs/)
*   **Replit:** Ambiente IDE em nuvem que permite a colaboração em tempo real e o deploy imediato de modelos via API.
    *   *Documentação:* [Replit Documentation](https://docs.replit.com/)

---

## 🔢 3. Estruturas de Dados e Controle de Fluxo

O Machine Learning lida primariamente com tensores e matrizes. A base em Python Core é mandatória:

1.  **Tipagem de Variáveis:** O entendimento de `float64` vs `int32` é crítico para a gestão de memória em grandes datasets.
2.  **Estruturas de Repetição:** 
    *   `For`: Utilizado quando o número de iterações (épocas) é conhecido.
    *   `While`: Utilizado em algoritmos de otimização onde a parada depende da convergência do erro (Loss function).
3.  **Fonte Oficial:** [Python.org - Standard Library](https://docs.python.org/3/library/stdtypes.html)

---

## 📊 4. Engenharia de Dados: Fontes e Datasets

Um modelo de ML é tão bom quanto os dados que o alimentam. As fontes recomendadas para pesquisa e prática são:

*   **Kaggle:** Plataforma de competições com datasets reais. [kaggle.com](https://www.kaggle.com/)
*   **UCI Machine Learning Repository:** Repositório clássico para validação de algoritmos acadêmicos. [archive.ics.uci.edu](https://archive.ics.uci.edu/)
*   **AWS Open Data:** Conjuntos de dados em escala de nuvem para Big Data. [registry.opendata.aws](https://registry.opendata.aws/)
*   **Google Dataset Search:** Motor de busca global para arquivos `.csv`, `.json` e `.h5`. [datasetsearch.google.com](https://datasetsearch.google.com/)

---

## 🕸️ 5. Deep Learning do Zero

A transição do Machine Learning clássico para o Deep Learning envolve a simulação de redes neurais.

### Componentes Fundamentais:
*   **Perceptron:** A unidade mínima de processamento que realiza a soma ponderada de entradas e aplica uma função de ativação.
*   **Funções de Ativação (ReLU, Sigmoid, Softmax):** Introduzem não-linearidade ao modelo, permitindo aprender padrões complexos.
*   **Backpropagation:** Algoritmo fundamental para o treino de redes neurais, baseado na Regra da Cadeia do Cálculo para ajustar pesos.
*   **Fonte Acadêmica:** [Deep Learning Book - Ian Goodfellow](https://www.deeplearningbook.org/)
*   **Fonte Técnica:** [TensorFlow - Keras Guide](https://www.tensorflow.org/guide/keras/sequential_model)

> **💡 Exemplo Prático (Generativo):** Pense no Deep Learning como um ajuste de sintonia fina em um rádio antigo. O Backpropagation é o movimento da sua mão girando o botão para diminuir o "chiado" (erro) até que a música (previsão) esteja clara.

---

## 🚀 Plano de Implementação (Checklist de Domínio)

- [ ] **Setup:** Instalar Python 3.x, Pandas, Numpy e Scikit-Learn.
- [ ] **Basics:** Criar um script que utilize listas e dicionários para calcular a média de uma coluna sem usar bibliotecas.
- [ ] **OOP:** Criar uma classe em Python que represente um neurônio simples.
- [ ] **Data:** Baixar o dataset *Iris* do repositório UCI e realizar a análise descritiva inicial.
- [ ] **Model:** Implementar uma Rede Neural Sequencial básica utilizando Keras.

---

## 📚 Referências Consultadas

1.  **Documentação Oficial Python:** https://docs.python.org/3/
2.  **IEEE Xplore (Paradigm Research):** https://ieeexplore.ieee.org/
3.  **Pandas Data Analysis Library:** https://pandas.pydata.org/docs/
4.  **Deep Learning Theory (MIT Press):** https://www.deeplearningbook.org/

---
*Este guia foi desenvolvido para fins de estudo e documentação de carreira em Ciência de Dados.*