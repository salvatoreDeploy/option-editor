# Spec 010f — Theme Toggle (Claro/Escuro) — Requirements

## Estado

`done`

## Sizing

`Medium`

## Problema

O app só tem o tema escuro migrado do `openeditor.pen` (spec `007`). Os tokens de cor já foram desenhados como CSS vars justamente pra permitir trocar de tema só mudando variáveis, sem reescrever classes (`DEC-001` da spec `007`) — mas isso nunca foi usado pra nada além do próprio tema escuro.

## Objetivo

Adicionar um tema claro e um alternador entre os dois. Consultado o Pencil MCP (`get_variables`): o `openeditor.pen` só define um conjunto de cores (o escuro), sem eixo de tema nem par claro/escuro — não existe referência de design pro tema claro. A paleta clara desta spec segue o mesmo sistema que o próprio kit já declara ter seguido ("inspirado em shadcn/ui"): os valores canônicos do tema claro `zinc` do shadcn/ui, mantendo a mesma relação estrutural entre os tokens que o tema escuro já usa.

## Fora De Escopo

- Tela de configurações (`Screen / Settings`) — o alternador fica num botão simples, mesmo padrão de entrada usado pros atalhos (spec `010e`).
- Um terceiro modo "seguir o sistema operacional" — só claro/escuro explícitos, com o padrão inicial detectado uma vez a partir de `prefers-color-scheme`.
- Realce de sintaxe (highlight.js) com tema claro — os blocos de código do editor continuam com o tema escuro (`atom-one-dark`) em ambos os modos; é um bloco visualmente autocontido (define seu próprio fundo), não um bug, só uma escolha de escopo.
- Cor de fundo nativa da janela (`backgroundColor` do `BrowserWindow`, mostrada por uma fração de segundo antes da página pintar) não muda com o tema — exigiria o main process conhecer a preferência de tema do renderer antes de criar a janela.

## Requisitos

| ID | Descrição | Origem |
|---|---|---|
| `REQ-001` | Definir uma paleta clara completa (mesmos tokens do tema escuro) em `global.css` | Explícito (spec `010` `REQ-011`) |
| `REQ-002` | Botão que alterna entre claro/escuro, acessível da Sidebar | Explícito |
| `REQ-003` | Preferência persistida localmente (sobrevive a reiniciar o app) | Implícito |
| `REQ-004` | Na primeira vez que o app abre (sem preferência salva), usar `prefers-color-scheme` do SO como padrão | Implícito |
| `REQ-005` | Trocar de tema não pode gerar um flash do tema errado ao abrir o app (FOUC) | Implícito (qualidade básica de um seletor de tema) |
| `REQ-006` | O editor (Tiptap/`prose`) usa a variante de tipografia certa pro tema atual — `prose-invert` (texto claro) só faz sentido no escuro; no claro usa `prose` normal | Explícito (achado técnico: `prose-invert` fixo quebraria a legibilidade no tema claro) |

## Requisitos Não Funcionais

| ID | Descrição |
|---|---|
| `NFR-001` | Troca de tema é só CSS (variáveis) — nenhum componente precisa de classes condicionais espalhadas pelo código, com exceção do `REQ-006` (`prose`/`prose-invert`, que é inerente ao plugin de tipografia do Tailwind, não dá pra resolver só com CSS var) |

## Restrições

- Preferência de tema fica em `localStorage` do renderer, não no `electron-store` (main process) — é um dado de UI puro, sem motivo pra cruzar a fronteira de IPC, e evita o problema de FOUC que uma leitura assíncrona via IPC causaria.

## Critérios De Aceite

| ID | Critério |
|---|---|
| `AC-001` | Alternar o tema muda a aparência do app inteiro (Sidebar, Header, Editor, diálogos) |
| `AC-002` | Fechar e reabrir o app mantém o tema escolhido |
| `AC-003` | Sem preferência salva, o tema inicial bate com o do sistema operacional |
| `AC-004` | Não há flash do tema errado ao abrir o app |
| `AC-005` | O texto do editor continua legível (contraste correto) nos dois temas |

## Riscos

| ID | Risco | Mitigação |
|---|---|---|
| `RISK-001` | Paleta clara inventada (sem referência de design) pode não bater com o que o usuário/design real esperaria depois | Usar os valores canônicos do tema `zinc` do shadcn/ui (mesma família que o kit já declara seguir), não cores arbitrárias — se um tema claro for desenhado no Pencil depois, é só trocar os valores desta spec |
