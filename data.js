/* ============================================================
   dados dos projetos — fonte única de verdade
   Usado pelo Project Lab (lab.js) e pelo modal de estudo de caso.
   Nenhum dado aqui é inventado: tudo veio do repositório, do
   README do projeto ou da operação real descrita no portfólio.
   ============================================================ */
(function () {
  'use strict';

  const P = {
    bsfm: {
      id: 'bsfm',
      n: '01',
      accent: 'bsfm',
      name: 'BSFM',
      kicker: 'Projeto acadêmico · UNIP · PIM 3º semestre',
      proof: 'deploy público · documentação em MkDocs · 3 repositórios abertos',
      title: 'BSFM — Brazilian System of Food Metric',
      summary:
        'Plataforma que reconhece o alimento pela foto e converte medida caseira em gramatura. Foi o projeto integrador do 3º semestre levado até o fim: aplicação publicada, documentação em MkDocs e código aberto.',
      badges: [['app publicado', 'live'], ['código aberto', 'blue'], ['acadêmico', 'cyan']],
      meta: [['Meu papel', 'backend, API, modelo e documentação'], ['Ano', '2026'], ['Contexto', 'PIM — UNIP']],
      metrics: [
        ['.NET 8', 'API REST publicada'],
        ['YOLO', 'detecção de alimento por imagem'],
        ['3', 'repositórios no projeto'],
        ['MkDocs', 'documentação pública']
      ],
      problem:
        '"Uma colher de arroz" não é uma medida. Quem acompanha dieta precisa registrar o que come, mas medir em gramas é chato e impreciso — e os apps existentes exigem busca manual em tabela, que é exatamente onde o usuário desiste.',
      built: [
        'Backend em <strong>.NET 8 / ASP.NET Core</strong> com arquitetura em camadas e API REST documentada.',
        '<strong>Inferência de visão computacional</strong> com modelo YOLO (ONNX) para identificar itens alimentares na imagem enviada.',
        '<strong>Conversão de medidas caseiras</strong> em gramatura, cruzando a detecção com a base de composição nutricional (USDA).',
        '<strong>Dashboard metabólico</strong> com IMC, TMB e TDEE calculados a partir do perfil do usuário.',
        'Diário alimentar, plano semanal de refeições, controle de consumo de água e <strong>Mapa SOS Saúde</strong> com Leaflet.',
        '<strong>Central LIBRAS</strong> — acessibilidade tratada como requisito, não como extra.',
        'Deploy do backend no <strong>Render</strong> e documentação técnica completa em <strong>MkDocs</strong>, publicada no GitHub Pages.',
        'Desenvolvimento apoiado em <strong>TDD e SDD</strong>, usando modelo de linguagem como par de programação.'
      ],
      result:
        'Foi o projeto em que coloquei, pela primeira vez, um modelo de machine learning atrás de uma API que eu mesmo escrevi — e entendi na prática o que é latência de inferência, versionamento de modelo e documentação que outra pessoa consegue seguir. O app está no ar e a documentação explica como rodar do zero.',
      stack: ['.NET 8', 'ASP.NET Core', 'C#', 'ONNX Runtime', 'YOLO', 'PostgreSQL', 'Render', 'MkDocs', 'Leaflet'],
      links: [
        ['Abrir o app (~30 s)', 'https://bsfm-nutri.onrender.com', 'external'],
        ['Documentação', 'https://brazilian-system-of-food-metric.github.io/software-documentation/', 'book'],
        ['Código', 'https://github.com/Brazilian-System-of-Food-Metric/BSFM-APP', 'github']
      ],
      decisions: [
        {
          t: 'Modelo local em ONNX, não API de terceiro',
          d: 'A inferência roda no próprio serviço, com o modelo exportado para ONNX Runtime.',
          why: 'Custo por imagem zero e funcionamento sem chave de terceiro. O preço foi assumir latência de cold start no plano gratuito do Render — e isso ficou documentado, não escondido.'
        },
        {
          t: 'Medida caseira como entrada, grama como saída',
          d: 'O usuário escolhe "colher de sopa" ou "xícara"; o sistema converte usando a densidade do alimento detectado.',
          why: 'Ninguém pesa comida no dia a dia. A interface fala a língua do usuário e guarda a precisão no banco.'
        },
        {
          t: 'Contexto nutricional em base própria',
          d: 'A tabela USDA foi importada para o PostgreSQL e versionada com o projeto.',
          why: 'Evita dependência de API externa em tempo de execução e permite reproduzir o resultado de qualquer registro antigo.'
        }
      ],
      arch: [
        { t: 'Cliente', items: ['App web', 'Upload da foto'] },
        { t: 'API .NET 8', items: ['Controller', 'Serviço de medida', 'Auth'] },
        { t: 'Inferência', items: ['ONNX Runtime', 'Modelo YOLO'] },
        { t: 'Dados', items: ['PostgreSQL', 'Base USDA'] }
      ],
      demo: 'bsfm'
    },

    barbe: {
      id: 'barbe',
      n: '02',
      accent: 'barbe',
      name: 'Barbe City',
      kicker: 'Projeto próprio · barbearia em Jaraguá/SP',
      proof: 'no ar na Vercel · repositório público · 135 registros migrados',
      title: 'Barbe City Jaraguá v2 — agendamento com Pix',
      summary:
        'Sistema que desenvolvi para a barbearia do Anderson. Não é um case vendido: é um projeto próprio, rodando no negócio de verdade, com agenda online, pagamento Pix e painel administrativo.',
      badges: [['no ar', 'live'], ['projeto próprio', 'amber'], ['pagamento Pix', 'violet']],
      meta: [['Meu papel', 'projeto, desenvolvimento e deploy'], ['Ano', '2026'], ['Status', 'publicado, com dados migrados']],
      metrics: [
        ['135', 'agendamentos históricos migrados'],
        ['R$ 4.230', 'histórico conciliado'],
        ['10', 'serviços cadastrados'],
        ['LGPD', 'exclusão de dados do cliente']
      ],
      problem:
        'Sem agenda digital, o cliente não sabia o horário livre, o dono perdia receita em horário vago e não havia histórico de quem faltou. Cobrar no salão significa dinheiro trocado, sem comprovante e sem conciliação.',
      built: [
        '<strong>Agendamento com ou sem login</strong>, calendário real de disponibilidade, serviços adicionais e bloqueios de horário.',
        '<strong>Pagamento Pix pelo Mercado Pago</strong> com QR Code, copia-e-cola, webhook e polling de confirmação.',
        '<strong>Promoções</strong> por serviço ou globais, com período de validade, selo de desconto e snapshot no histórico — o preço do dia nunca é reescrito.',
        '<strong>Login em três modos</strong>: e-mail e senha, código de 6 dígitos por e-mail (Brevo) e Google OAuth.',
        '<strong>Área do cliente</strong> com próximos horários, histórico, perfil e exclusão de dados (LGPD).',
        '<strong>Painel administrativo</strong> com dashboard, agenda, serviços, usuários, financeiro, horários, logs e notificações.',
        '<strong>Tema visual gerado por IA</strong>: o dono descreve a decoração, o sistema gera uma máscara sanitizada e aplica com um clique.',
        '<strong>Segurança</strong>: bcrypt custo 12, sessão HttpOnly com hash no banco, CSRF double-submit, helmet/CSP, rate limit e SQL parametrizado.',
        '<strong>Importação do legado</strong> com 135 agendamentos, preservando checksums e sem inventar pagamento para registro antigo.'
      ],
      result:
        'Foi o projeto em que mais aprendi sobre modelagem relacional, integração de pagamento e o que "publicar" realmente significa: webhook que falha, sessão que expira, dado legado que não bate. Ainda é um projeto meu, sem contrato comercial — mas roda com dados reais e eu mantenho.',
      stack: ['Node.js 24', 'Express', 'PostgreSQL 18', 'Neon', 'Mercado Pago', 'Google OAuth', 'Brevo', 'Vercel', 'bcrypt', 'CSP/Helmet'],
      links: [
        ['Ver site', 'https://barbe-city-jaragua-eta.vercel.app', 'external'],
        ['Código', 'https://github.com/Isaque-Medeiros/BarbeCity-2.0', 'github']
      ],
      decisions: [
        {
          t: 'Preço com snapshot, nunca recalculado',
          d: 'Cada agendamento guarda o preço e o desconto vigentes no momento da compra.',
          why: 'Promoção muda amanhã, histórico não pode mudar. Foi a decisão que salvou a conciliação dos 135 registros migrados.'
        },
        {
          t: 'Agendar sem login, pagar com identidade',
          d: 'O fluxo de agendamento não exige conta; o login aparece só no pagamento e na área do cliente.',
          why: 'Cada campo antes da conversão custa agendamento. O dono recebe o contato; o cliente ganha histórico se quiser.'
        },
        {
          t: 'Uma função serverless só',
          d: 'Toda a API roda em um único handler com roteamento interno.',
          why: 'O plano gratuito do Vercel limita funções. Agrupar por domínio manteve o deploy gratuito e o código organizado em serviços.'
        }
      ],
      arch: [
        { t: 'Cliente', items: ['Agenda web', 'Pix QR'] },
        { t: 'API', items: ['Express', 'Sessão HttpOnly', 'Webhook'] },
        { t: 'Serviços', items: ['Disponibilidade', 'Promoções', 'Mercado Pago'] },
        { t: 'Dados', items: ['PostgreSQL', 'Neon', '135 migrados'] }
      ],
      demo: 'barbe'
    },

    refresh: {
      id: 'refresh',
      n: '03',
      accent: 'refresh',
      name: 'Refresh 2026',
      kicker: 'Ferramenta interna · equipe de field service',
      proof: 'em uso pela equipe · código privado · sem vínculo comercial com a TOTVS',
      title: 'Controle de bancada — Refresh 2026',
      summary:
        'Painel que eu construí para o time acompanhar o andamento do refresh de máquinas. Não é produto da TOTVS, não foi licenciado e a empresa não tem envolvimento comercial com ele: é uma ferramenta interna, feita por mim, usada pela equipe.',
      badges: [['uso interno', 'amber'], ['sem link público', 'blue'], ['IA aplicada', 'violet']],
      meta: [['Meu papel', 'idealização, desenvolvimento e manutenção'], ['Ano', '2026'], ['Acesso', 'restrito à equipe']],
      metrics: [
        ['9', 'funções serverless'],
        ['4', 'papéis de acesso'],
        ['1', 'fonte de verdade: o banco'],
        ['0', 'chave de IA no navegador']
      ],
      problem:
        'O controle do fluxo era planilha e mensagem: ninguém sabia em tempo real onde cada máquina estava, quem era o responsável e o que faltava fazer. No fim do lote, o histórico se perdia.',
      built: [
        '<strong>Painel em tempo real</strong> com o estado de cada máquina, filtros por contrato, status e data, e ordenação.',
        '<strong>Fila por analista</strong> e checklist final liberado para qualquer analista — a regra do processo, não a hierarquia, define quem pode fechar.',
        '<strong>Autenticação com papéis</strong>: e-mail e senha com scrypt, sessão em cookie HttpOnly com hash no banco e login com Google (OAuth 2.0 server-side).',
        '<strong>Quatro perfis</strong> (desenvolvedor, gestor, analista e cliente) com permissões distintas.',
        '<strong>Migração de dados</strong> do modelo antigo em JSON para PostgreSQL no Neon, com re-hash automático de senhas legadas no primeiro login.',
        '<strong>Relatórios imprimíveis em A4</strong>, exportação TSV/JSON e layout de impressão dedicado.',
        '<strong>Módulo de IA</strong> cujo contexto é montado no servidor, a partir do banco — a chave nunca chega ao cliente.'
      ],
      result:
        'Hoje o time usa para medir o andamento, e isso melhorou o meu próprio trabalho: eu deixei de ser o gargalo da informação. Não passou por comitê nem virou produto — é a prova de que eu consigo pegar um problema de operação, modelar e entregar. Por ser interno, o código e os dados não são públicos.',
      stack: ['JavaScript (ES Modules)', 'Node.js', 'PostgreSQL', 'Neon', 'Vercel', 'Chart.js', 'scrypt', 'OAuth 2.0', 'LLM'],
      links: [],
      decisions: [
        {
          t: 'Regra de processo acima de hierarquia',
          d: 'Qualquer analista autenticado pode fazer o checklist final de qualquer máquina.',
          why: 'A máquina pronta não pode esperar o dono do lote. Centralizar permissão criava fila — e fila era o problema original.'
        },
        {
          t: 'Contexto da IA montado no servidor',
          d: 'A pergunta chega ao backend, que consulta o banco e só então chama o modelo.',
          why: 'Chave protegida e resposta com dado real. Prompt montado no navegador devolve resposta truncada e vaza credencial.'
        },
        {
          t: 'Migrar JSON → PostgreSQL com re-hash no login',
          d: 'Senhas legadas continuam válidas e são convertidas para scrypt no primeiro acesso.',
          why: 'Ninguém deveria trocar senha por causa de uma migração interna.'
        }
      ],
      arch: [
        { t: 'Navegador', items: ['Painel', 'Filtros', 'Relatórios'] },
        { t: 'API', items: ['Sessão', 'Papéis', 'Checklist'] },
        { t: 'Serviços', items: ['Contexto IA', 'Exportação'] },
        { t: 'Dados', items: ['PostgreSQL', 'Neon'] }
      ],
      demo: 'refresh'
    },

    dx4: {
      id: 'dx4',
      n: '04',
      accent: 'dx4',
      name: '4DX',
      kicker: 'Automação própria · operação LATAM (Konecta)',
      proof: 'uso pessoal documentado · sem repositório público',
      title: 'Motor Híbrido 4DX',
      summary:
        'Um bookmarklet que eu usava no meu próprio fluxo de trabalho: em vez de digitar dezenas de campos repetidos, o script lia a tabela de origem e preenchia o formulário em um clique. Apresentei à equipe, mas não houve adoção oficial.',
      badges: [['automação própria', 'violet'], ['JavaScript puro', 'blue'], ['sem repositório', 'amber']],
      meta: [['Meu papel', 'concepção e desenvolvimento'], ['Ano', '2025 — 2026'], ['Contexto', 'Konecta · operação LATAM']],
      metrics: [
        ['1', 'clique para executar'],
        ['0', 'instalação necessária'],
        ['DOM', 'injeção + inspetor (Eruda)'],
        ['LocalStorage', 'estado sincronizado']
      ],
      problem:
        'O time repetia o mesmo preenchimento em formulários longos, com dados que já estavam em outra tela. Cada digitação era uma chance de erro, e cada erro virava retrabalho.',
      built: [
        '<strong>Bookmarklet em JavaScript puro</strong> — sem extensão, sem permissão de administrador, sem instalação.',
        '<strong>Injeção do inspetor de DOM (Eruda)</strong> para ler a estrutura da página e localizar os campos corretamente.',
        '<strong>Parsing de tabelas</strong> do sistema de origem e preenchimento automático dos campos de destino.',
        '<strong>Estado em LocalStorage</strong>, permitindo guardar e restaurar o último preenchimento.',
        'Tratamento de exceção por campo: se o seletor muda, o script avisa em vez de preencher errado.'
      ],
      result:
        'Reduziu a minha digitação e o meu retrabalho enquanto eu estava na operação. Não virou ferramenta oficial da equipe; o aprendizado foi que a automação mais eficaz às vezes é a que não exige infraestrutura — só um navegador e conhecimento de DOM.',
      stack: ['JavaScript', 'DOM API', 'LocalStorage', 'Eruda', 'Bookmarklet'],
      links: [],
      decisions: [
        {
          t: 'Bookmarklet em vez de extensão',
          d: 'Um link javascript: que roda na aba já aberta.',
          why: 'Extensão exige permissão de TI e instalação em cada máquina. O bookmarklet funciona no navegador que já estava lá.'
        },
        {
          t: 'Falhar alto em vez de preencher errado',
          d: 'Cada campo tem validação de seletor antes da escrita.',
          why: 'Formulário de companhia aérea não perdoa dado no campo errado. Melhor não preencher do que preencher mal.'
        },
        {
          t: 'Estado local, sem servidor',
          d: 'O último preenchimento fica em LocalStorage e pode ser restaurado.',
          why: 'Automação de uso pessoal não precisa de backend — precisa ser instantânea e não depender de rede.'
        }
      ],
      arch: [
        { t: 'Origem', items: ['Tabela', 'Linhas', 'Códigos'] },
        { t: '4DX', items: ['Parser', 'Mapa de campos', 'Estado'] },
        { t: 'Destino', items: ['Formulário', 'Validação', 'Envio'] }
      ],
      demo: 'dx4'
    },

    sysacad: {
      id: 'sysacad',
      n: '05',
      accent: 'sysacad',
      name: 'SysAcad',
      kicker: 'Trabalho acadêmico · estruturas de dados',
      proof: 'acervo público no GitHub · código em C++',
      title: 'SysAcad — gestão acadêmica em C++',
      summary:
        'Sistema acadêmico completo rodando no terminal: login, alunos, matérias, turmas, notas e relatórios — com persistência em arquivo e JSON. O desafio não era a interface, era manter tudo consistente sem banco de dados.',
      badges: [['C++', 'blue'], ['estruturas de dados', 'violet'], ['acadêmico', 'cyan']],
      meta: [['Meu papel', 'desenvolvimento solo'], ['Ano', '2026'], ['Contexto', 'trabalho acadêmico']],
      metrics: [
        ['C++', 'linguagem'],
        ['7', 'módulos de dados'],
        ['CRUD', 'alunos, matérias, turmas e notas'],
        ['cJSON', 'persistência e login']
      ],
      problem:
        'O enunciado pedia um sistema de gestão acadêmica com persistência real. A parte difícil foi manter consistência entre matrícula, turma, matéria e nota sem um banco de dados.',
      built: [
        '<strong>Autenticação</strong> de usuários com cadastro, leitura e escrita em JSON via <strong>cJSON</strong>.',
        '<strong>Structs e vetores</strong> para alunos, matérias e turmas, com validação de entrada e tratamento de erro de digitação.',
        '<strong>CRUD completo</strong> com matrícula única, associação aluno–turma e lançamento de notas com faltas.',
        '<strong>Relatórios</strong> gerados em arquivo texto a partir dos dados em memória.',
        'Organização em <strong>homepage.cpp</strong> (login) e <strong>funcoes.cpp</strong> (regras), separando responsabilidade.'
      ],
      result:
        'Aprendi na marra por que estrutura de dados importa: cada nova entidade exigia decidir como persistir e como manter coerência. Foi a base que depois facilitou entender modelagem relacional de verdade.',
      stack: ['C++', 'cJSON', 'STL', 'File I/O', 'POO'],
      links: [['Código', 'https://github.com/Isaque-Medeiros/Meus-ProjetosAcad', 'github']],
      decisions: [
        {
          t: 'cJSON em vez de CSV',
          d: 'Alunos, turmas e notas são gravados como JSON.',
          why: 'Estrutura aninhada (aluno → turma → notas) sobrevive a ida e volta sem parsing frágil.'
        },
        {
          t: 'Matrícula como chave única',
          d: 'A validação de duplicidade roda na inserção e na edição.',
          why: 'Sem banco para impor unicidade, a regra precisa estar no código — e testada.'
        },
        {
          t: 'Separar login de regras',
          d: 'homepage.cpp cuida do acesso; funcoes.cpp concentra as regras.',
          why: 'Facilita achar defeito e permite reaproveitar as funções sem arrastar a interface.'
        }
      ],
      arch: [
        { t: 'Terminal', items: ['Login', 'Menu', 'Entrada'] },
        { t: 'Regras', items: ['Alunos', 'Turmas', 'Notas'] },
        { t: 'Persistência', items: ['cJSON', 'Arquivo', 'Relatório'] }
      ],
      demo: 'sysacad'
    },

    climo: {
      id: 'climo',
      n: '06',
      accent: 'climo',
      name: 'Climo',
      kicker: 'Protótipo · IA aplicada',
      proof: 'protótipo encerrado · aprendizados aplicados na ferramenta interna',
      title: 'Climo — assistente de operação',
      summary:
        'Protótipo de assistente para consultar procedimentos e códigos de erro da operação em linguagem natural. Não evoluiu para produção e nunca passou por aprovação interna — ficou como estudo de LLM e de engenharia de contexto.',
      badges: [['protótipo', 'amber'], ['IA aplicada', 'violet'], ['estudo', 'blue']],
      meta: [['Meu papel', 'concepção e protótipo'], ['Ano', '2025 — 2026'], ['Status', 'protótipo encerrado']],
      metrics: [
        ['LLM', 'modelo de linguagem'],
        ['servidor', 'contexto montado no backend'],
        ['0', 'chave exposta no cliente'],
        ['—', 'não chegou à produção']
      ],
      problem:
        'Responder "qual o procedimento para este código de erro?" exigia procurar em manuais extensos ou perguntar para quem já sabia. O conhecimento ficava concentrado em poucas pessoas.',
      built: [
        'Protótipo de <strong>chat com LLM</strong> alimentado com manuais técnicos e tabelas de contingência da operação.',
        '<strong>Contexto montado no servidor</strong>, a partir de dados reais — a chave da IA nunca iria para o navegador.',
        '<strong>Renderização de Markdown segura</strong> na resposta, sem injeção de HTML arbitrário.',
        'Experimentos de <strong>engenharia de prompt</strong> para melhorar precisão em perguntas de procedimento.'
      ],
      result:
        'O protótipo não evoluiu para uso oficial e ficou incompleto. O aprendizado técnico — contexto no servidor, chave protegida e por que dado truncado do navegador inviabiliza uso operacional — foi aplicado depois na ferramenta de bancada que o time usa hoje.',
      stack: ['LLM API', 'Node.js', 'Prompt engineering', 'Markdown seguro'],
      links: [],
      decisions: [
        {
          t: 'Contexto no servidor, sempre',
          d: 'O navegador envia a pergunta; o backend busca os trechos e monta o prompt.',
          why: 'Protege a chave e garante que a resposta use o dado atual do banco, não um recorte velho da tela.'
        },
        {
          t: 'Markdown sanitizado na saída',
          d: 'A resposta é renderizada com whitelist de tags.',
          why: 'Saída de modelo é entrada não confiável. Renderizar HTML cru seria XSS com etapa extra.'
        },
        {
          t: 'Encerrar quando não há uso real',
          d: 'O protótipo parou em vez de virar produto interno sem demanda.',
          why: 'Nem todo protótipo deve virar sistema. Saber parar também é decisão de engenharia.'
        }
      ],
      arch: [
        { t: 'Cliente', items: ['Chat', 'Pergunta'] },
        { t: 'API', items: ['Contexto', 'Prompt', 'Sanitização'] },
        { t: 'Conhecimento', items: ['Manuais', 'Tabelas'] },
        { t: 'Modelo', items: ['LLM'] }
      ],
      demo: 'climo'
    }
  };

  // Ordem do laboratório
  window.PORTFOLIO_ORDER = ['bsfm', 'barbe', 'refresh', 'dx4', 'sysacad', 'climo'];
  window.PORTFOLIO_PROJECTS = P;

  // Tecnologia → projetos que a usam (para a matriz de stack)
  window.PORTFOLIO_STACK = {
    'C# / .NET': ['bsfm'],
    'Python': ['climo'],
    'PostgreSQL': ['bsfm', 'barbe', 'refresh'],
    'Node.js / Express': ['barbe', 'refresh', 'climo'],
    'SQL Server / T-SQL': [],
    'HTML5 semântico / CSS3': ['barbe', 'bsfm'],
    'JavaScript (ES6+)': ['refresh', 'dx4', 'barbe'],
    'TypeScript': [],
    'LLMs & prompt engineering': ['climo', 'refresh'],
    'Pandas / análise de dados': [],
    'YOLO / visão computacional': ['bsfm'],
    'Testes automatizados': ['bsfm'],
    'Windows corporativo / AD': [],
    'Imagens & deploy de estações': [],
    'Sanitização de mídia': [],
    'Redes LAN / diagnóstico': [],
    'React': [],
    'Docker': ['bsfm'],
    'C++': ['sysacad'],
    'Automação de DOM': ['dx4']
  };
})();
