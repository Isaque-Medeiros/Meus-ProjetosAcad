# Portfólio — Isaque de Medeiros Pinto

Site pessoal e portfólio técnico de **Isaque de Medeiros Pinto** — estudante de Análise e Desenvolvimento
de Sistemas (UNIP) e analista de suporte em TI. Atualmente no projeto **Refresh 2026** da **TOTVS**,
contratado via **DB4 SERV**.

🔗 **Site publicado:** https://isaque-medeiros.github.io/Meus-ProjetosAcad/
📄 **Currículo:** https://isaque-medeiros.github.io/Meus-ProjetosAcad/curriculo.html

> **Transparência:** os projetos apresentados são próprios ou acadêmicos, em uso funcional. Nenhum foi
> vendido, licenciado ou aprovado por comitê interno. O objetivo do site é mostrar capacidade de entrega
> e honestidade técnica, não senioridade.

---

## O que este site faz de diferente

Os projetos não são cartões com imagem: cada um tem uma **demonstração que roda no navegador**,
sem backend e sem dependências.

| Projeto | Demo interativa |
|---|---|
| **BSFM** | foto do prato → detecção dos alimentos com confiança → conversão de medida caseira em gramas, calorias e proteína |
| **Barbe City** | escolha de serviços, dia e horários (slots ocupados bloqueados) → total, duração e Pix simulado com QR |
| **Refresh 2026** | kanban de bancada com 4 etapas, KPIs e checklist — clique numa máquina para avançar |
| **4DX** | bookmarklet preenchendo um formulário a partir de uma tabela, com contagem de teclas economizadas |
| **SysAcad** | terminal com menu real: alunos, notas e geração de relatório |
| **Climo** | chat com resposta em streaming e fonte do contexto |

Outros recursos:

- **Project Lab** com abas (Demo · Arquitetura · Decisões · Números), deep link `#lab/bsfm` e teclado (`←` `→`, `1`–`6`).
- **Modo recrutador** (`R` ou botão no topo): esconde o texto longo e fixa as ações essenciais — um caminho de 60 segundos.
- **Command palette** (`Ctrl` + `K` ou `/`) para ir a qualquer seção, projeto ou link.
- **Atalhos** (`?`) com a lista completa de teclas.
- **Matriz de stack clicável**: escolher uma tecnologia destaca no lab os projetos que a usam.
- **Acessibilidade**: foco visível, alvos ≥ 44 px nos controles principais, `prefers-reduced-motion`, `aria-live` nas demos.
- **SEO**: Open Graph, Twitter Card, JSON-LD (`Person`), canonical, favicon SVG, sitemap.

## Stack do site

Sem frameworks, sem build, sem dependências de runtime — HTML, CSS e JavaScript puro.

```
index.html          # página principal (hero, Project Lab, seções)
styles.css          # design system base (tokens, layout, componentes)
experience.css      # camada de experiência: lab, demos, modo recrutador, dock
script.js           # terminal, reveals, modal, command palette, contadores
data.js             # fonte única de verdade dos 6 projetos
lab.js              # motor do Project Lab + as 6 demos
experience.js       # modo recrutador, atalhos, dock, matriz de stack
curriculo.html      # currículo otimizado para impressão / ATS
assets/             # favicon, imagem Open Graph, currículo em PDF
```

## Rodando localmente

Basta abrir `index.html` no navegador — não há etapa de build.

Para servir via HTTP (recomendado para testar fontes e links):

```bash
# Node.js (sem instalar nada)
node tools/serve.mjs
# http://127.0.0.1:8099
```

## Ferramentas de revisão

| Comando | O que faz |
|---|---|
| `node tools/serve.mjs` | servidor estático local |
| `node tools/cdp.mjs goto <url>` | abre a página no navegador headless via CDP |
| `node tools/cdp.mjs full out.png` | captura a página inteira |
| `node tools/cdp.mjs view out.png <y>` | captura uma dobra específica |
| `node tools/eval tools/audit-metrics.js` | mede tipografia, contraste, alvos de toque, semântica |
| `node tools/deploy.mjs "mensagem"` | publica no GitHub Pages via API (precisa de `GH_TOKEN`) |

## Contato

- **E-mail:** medeirosisaque765@gmail.com
- **LinkedIn:** [linkedin.com/in/isaque-medeiros-a99421268](https://www.linkedin.com/in/isaque-medeiros-a99421268/)
- **GitHub:** [github.com/Isaque-Medeiros](https://github.com/Isaque-Medeiros)

---

<sub>Última atualização: novembro de 2026 · São Paulo, SP</sub>
