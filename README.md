# Portfólio — Isaque de Medeiros Pinto

Site pessoal e portfólio técnico de **Isaque de Medeiros Pinto** — analista de sistemas e desenvolvedor full stack.
Atualmente no projeto **Refresh 2026** da **TOTVS**, contratado via **DB4 SERV**.

🔗 **Site publicado:** https://isaque-medeiros.github.io/Meus-ProjetosAcad/
📄 **Currículo (PDF):** https://isaque-medeiros.github.io/Meus-ProjetosAcad/curriculo.html

---

## Sobre este repositório

Além de hospedar o portfólio no GitHub Pages, este repositório guarda o **acervo acadêmico e técnico**
dos projetos desenvolvidos entre ETEC, UNIP e estudos autônomos.

```
.
├── index.html              # portfólio (página principal)
├── styles.css              # design system do portfólio
├── script.js               # interações (reveals, terminal, modal, command palette)
├── curriculo.html          # currículo otimizado para impressão / ATS
├── assets/                 # favicon, imagem Open Graph, currículo em PDF
├── projects/               # projetos organizados por área
│   ├── backend-python/     # ONG (PIM), SysAcad, organização de planilhas
│   ├── cloud/              # relatório AWS
│   ├── embedded/           # Tinkercad (C/Arduino)
│   ├── frontend/           # HTML/CSS, dashboard Excel/VBA, wiki de insetos
│   └── university/         # trabalhos da UNIP
├── studies/                # trilhas de estudo (Azure, ML, Python)
├── archive/                # versões anteriores do portfólio
└── Meus-ProjetosAcad/      # acervo histórico (ETEC / primeiros semestres)
```

## Stack do site

Sem frameworks, sem build, sem dependências de runtime — HTML, CSS e JavaScript puro.

- **Design system** próprio em CSS (tokens, dark theme, grid, tipografia fluida)
- **Animações** com CSS + IntersectionObserver, respeitando `prefers-reduced-motion`
- **Terminal animado** em SVG/CSS no hero, com typewriter em JS
- **Command palette** (`Ctrl` + `K` ou `/`) para navegação rápida
- **Filtro de projetos** por categoria e **modal de estudo de caso** com foco acessível
- **SEO**: Open Graph, Twitter Card, JSON-LD (`Person`), canonical, favicon SVG
- **Acessibilidade**: landmarks, skip link, `aria-*`, foco visível, contraste AA
- **Impressão**: `curriculo.html` gera um currículo de 2 páginas em A4

## Rodando localmente

Basta abrir `index.html` no navegador — não há etapa de build.

Para servir via HTTP (recomendado para testar fontes e links):

```bash
# Python 3
python -m http.server 8080

# ou Node.js
npx serve .
```

Depois acesse `http://localhost:8080`.

## Contato

- **E-mail:** medeiroisaque765@gmail.com
- **LinkedIn:** [linkedin.com/in/isaque-medeiros-a99421268](https://www.linkedin.com/in/isaque-medeiros-a99421268/)
- **GitHub:** [github.com/Isaque-Medeiros](https://github.com/Isaque-Medeiros)

---

<sub>Última atualização: novembro de 2026 · São Paulo, SP</sub>
