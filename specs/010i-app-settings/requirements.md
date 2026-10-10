# Spec 010i — App Settings Screen — Requirements

## Estado

`done`

## Sizing

`Large`

## Problema

O app não tem uma tela de configurações. Preferências que já existem (atalhos, de onde vêm os dados) ficam espalhadas (diálogo de atalhos isolado) ou simplesmente não são visíveis em lugar nenhum (onde o `electron-store` grava, quantas linguagens de bloco de código são suportadas). O design já existe no Pencil (`specs/002-account-settings-screens`, tela `Screen / Settings`, nó `yZqJl`) mas nunca foi implementado em código.

## Objetivo

Criar uma tela `/settings` dedicada (fora do layout de 3 colunas do editor, com sidebar própria) que: mostra e permite editar um nome de workspace; mostra onde os dados ficam salvos e permite abrir essa pasta no explorador de arquivos do SO; permite ligar/desligar autosave e verificação ortográfica de verdade, e mostra as linguagens de bloco de código suportadas; mostra os atalhos configurados (com atalho para abrir o diálogo de edição já existente); e permite apagar todos os documentos locais permanentemente, com confirmação reforçada.

## Fora De Escopo

- Qualquer forma de autenticação/login — fica para o item separado do `BACKLOG.md` ("Implementar login/perfil real"), não faz parte desta spec.
- Editar atalhos diretamente nesta tela — reaproveita o `ShortcutsDialog` já existente (spec `010e-configurable-shortcuts`) em vez de duplicar os inputs de captura de tecla.
- Múltiplos workspaces — "nome do workspace" é um rótulo único e local, não um sistema de múltiplos workspaces/perfis.
- Internacionalização / múltiplos idiomas de interface.
- Tornar "Code blocks" (linguagens de highlight) configurável — é uma lista de capacidade do editor (o que o `lowlight` sabe realçar), não uma preferência de usuário; continua somente leitura (`REQ-008`).
- Implementar um corretor ortográfico próprio (dicionário, sugestões customizadas) — a revisão de 2026-10-06 (`REQ-013`) liga/desliga o corretor **nativo** do Electron/Chromium, não escreve um verificador novo. A dependência `@farscrl/tiptap-extension-spellchecker` (presente no `package.json`, nunca usada) continua fora de uso — ela exige implementar o motor de verificação, não só a UI, o que não se justifica havendo corretor nativo.

### Revisão De Escopo — 2026-10-06

Pedido do usuário: "avaliar como ainda podemos melhorar esta página e deixar tudo funcional e nada estático". Os dois campos do card "Editor" que antes eram só texto fixo (`REQ-008` original) viraram controles reais:

- Autosave agora é de fato desligável (`REQ-012`), pareado com salvamento manual via `Ctrl+S`/`Cmd+S` — sem isso, desligar autosave sem nenhuma forma de salvar deixaria o usuário sem conseguir persistir nada (meio-caminho inaceitável).
- Verificação ortográfica agora liga/desliga de verdade (`REQ-013`), usando o corretor **nativo** do Electron (`webContents.session.setSpellCheckerEnabled`), não a dependência não utilizada do `package.json` (que exigiria implementar um motor de correção inteiro, desproporcional ao pedido).

`RISK-003` (abaixo) ficou obsoleto por essa revisão — eram "somente leitura" exatamente pra não sugerir controle que não existia; agora o controle existe de verdade.

## Requisitos

| ID | Descrição | Origem |
|---|---|---|
| `REQ-001` | Nova rota `/settings`, com layout próprio (sidebar de navegação interna + conteúdo), fora do shell de 3 colunas do editor | Explícito (BACKLOG Sprint 7 / `REQ-009` da spec `010`), refletindo o desenho do Pencil |
| `REQ-002` | Ponto de entrada para `/settings` a partir do app (ícone na Sidebar principal, ao lado dos já existentes de tema/atalhos) | Implícito (sem isso a tela é inacessível) |
| `REQ-003` | Botão "Voltar aos documentos" na sidebar da tela de configurações, retornando à tela anterior | Explícito (desenho do Pencil, nó `z6EB4L`) |
| `REQ-004` | Navegação interna da sidebar de configurações (Geral/Editor/Atalhos/Dados locais) rola até a seção correspondente na página (mesmo padrão clicável já usado no ToC do documento, spec `007`/correção de 2026-09-20) — não são rotas separadas, pois o desenho do Pencil mostra todas as seções na mesma página | Implícito (lido na estrutura do nó `yZqJl`: todas as seções existem simultaneamente dentro de `Settings Content`) |
| `REQ-005` | Card "Geral": campo "Nome do workspace" editável, com valor persistido; campo "Pasta de dados" somente leitura mostrando o diretório real onde o `electron-store` grava | Explícito (desenho do Pencil) + decisão do usuário (2026-09-20): campo real e persistido, não apenas visual |
| `REQ-006` | Nome do workspace configurado passa a aparecer no primeiro item do breadcrumb do `Header` (`src/renderer/src/components/Header/index.tsx`), hoje fixo como texto literal `"Workspace"` | Implícito (decisão de onde o campo tem efeito real — ver `DEC-001` do design) |
| `REQ-007` | Botão "Salvar alterações" no cabeçalho da tela, que persiste o nome do workspace | Explícito (desenho do Pencil, nó `qrGFu`) |
| `REQ-008` | Card "Editor": mostra as linguagens de bloco de código suportadas (as mesmas registradas em `Editor/index.tsx` via `lowlight`), somente leitura | Explícito (desenho do Pencil) + `Fora De Escopo` (não editável) |
| `REQ-009` | Card "Atalhos": mostra os atalhos reais configurados (`newDocument`, `quickSearch`) e o atalho fixo de fechar modal (Esc), com uma ação que abre o `ShortcutsDialog` já existente para editar | Explícito (desenho do Pencil) |
| `REQ-010` | Card "Dados locais": descrição + botão "Abrir pasta de dados", que abre o diretório onde o `electron-store` grava no explorador de arquivos do SO | Explícito (desenho do Pencil) |
| `REQ-011` | Card "Zona sensível": botão "Limpar dados locais" que apaga permanentemente todos os documentos (incluindo os já na lixeira da spec `010b`), com confirmação reforçada (usuário digita uma palavra para confirmar, não só um clique) | Explícito (desenho do Pencil) + decisão do usuário (2026-09-20): apagar permanentemente, bypassando a lixeira |
| `REQ-012` | Card "Editor": toggle real "Autosave com debounce" — quando desligado, a edição para de salvar sozinha; `Ctrl+S`/`Cmd+S` salva manualmente a qualquer momento (ligado ou desligado) | Explícito (pedido do usuário, revisão 2026-10-06: "nada estático") |
| `REQ-013` | Card "Editor": toggle real "Verificação ortográfica", ligando/desligando o corretor ortográfico nativo do Electron (`webContents.session.setSpellCheckerEnabled`) na janela principal | Explícito (pedido do usuário, revisão 2026-10-06: "nada estático") |

## Requisitos Não Funcionais

| ID | Descrição |
|---|---|
| `NFR-001` | Abrir a pasta de dados e ler o caminho real não podem rodar no renderer — só o main tem acesso a `shell`/caminhos do SO (padrão já estabelecido no projeto) |
| `NFR-002` | "Limpar dados locais" é irreversível — a UI precisa deixar isso explícito (texto + confirmação reforçada), já que não há desfazer como no soft-delete de um documento |
| `NFR-003` | Limpar dados locais não pode deixar a Sidebar principal/tray com um estado inconsistente (lista de documentos desatualizada) |
| `NFR-004` | Desligar autosave nunca pode deixar o usuário sem nenhuma forma de salvar — `Ctrl+S`/`Cmd+S` precisa funcionar independente do estado do toggle |

## Restrições

- Sem biblioteca nova — `shell.showItemInFolder` (Electron nativo) para abrir a pasta de dados; `store.path` (já exposto pelo `electron-store`/`conf`) para saber onde os dados ficam.
- Reaproveita componentes/padrões já existentes (`AlertDialog` do `Header`, `ShortcutsDialog`, classes Tailwind dos botões primário/secundário/destrutivo) em vez de criar um novo design system para esta tela.

## Critérios De Aceite

| ID | Critério |
|---|---|
| `AC-001` | Clicar no ícone de configurações na Sidebar principal abre `/settings` |
| `AC-002` | "Voltar aos documentos" retorna à tela anterior |
| `AC-003` | Clicar em "Editor", "Atalhos" ou "Dados locais" na sidebar de configurações rola a página até o card correspondente |
| `AC-004` | Editar "Nome do workspace" e clicar em "Salvar alterações" persiste o valor; reabrir o app (ou recarregar a query) mantém o valor salvo |
| `AC-005` | O breadcrumb de um documento aberto mostra o nome do workspace configurado em vez do texto fixo "Workspace" |
| `AC-006` | "Pasta de dados" mostra um caminho real do sistema de arquivos, e "Abrir pasta de dados" (nos dois lugares que o botão aparece) abre essa pasta no explorador de arquivos do SO |
| `AC-007` | Card "Atalhos" mostra os atalhos configurados no momento (refletindo qualquer alteração feita no `ShortcutsDialog`) e consegue abrir esse diálogo a partir da própria tela de configurações |
| `AC-008` | "Limpar dados locais" exige digitar uma palavra de confirmação antes de habilitar o botão de ação; confirmar remove todos os documentos (inclusive os da lixeira) e a Sidebar principal passa a mostrar a tela vazia |
| `AC-009` | Nenhuma feature existente (criar, editar, salvar, buscar, excluir, exportar, importar, atalhos, tema) quebra com a adição desta tela |
| `AC-010` | Desligar "Autosave com debounce" e salvar "Alterações" faz a edição de um documento parar de salvar sozinha; `Ctrl+S`/`Cmd+S` salva manualmente o conteúdo atual. Religar o autosave volta ao comportamento automático |
| `AC-011` | Desligar "Verificação ortográfica" e salvar remove o sublinhado nativo de correção ortográfica do editor; religar traz de volta |

## Riscos

| ID | Risco | Mitigação |
|---|---|---|
| `RISK-001` | "Limpar dados locais" sendo irreversível pode ser acionado por engano | Confirmação reforçada por digitação (não só um clique), mesmo padrão de severidade usado por ferramentas conhecidas para ações destrutivas em massa |
| `RISK-002` | Expor "Nome do workspace" sem nenhum efeito visível pareceria um campo morto/decorativo, indo contra o padrão já estabelecido no projeto de não exibir dados falsos (Sprint 3 do `BACKLOG.md`) | `REQ-006` garante um efeito real e visível (breadcrumb) |
| ~~`RISK-003`~~ | ~~Card "Editor" poderia sugerir, por engano, que autosave/verificação ortográfica são configuráveis~~ | Obsoleto desde a revisão 2026-10-06 — agora são configuráveis de verdade (`REQ-012`/`REQ-013`), então não há mais "sugestão enganosa" a mitigar |
| `RISK-004` | Desligar autosave e não perceber (ou esquecer) pode levar à perda de edição se o app fechar antes de um `Ctrl+S` | Indicador de status no `Header` muda para "Não salvo" (distinto de "Salvando...") sempre que há edição pendente sem autosave — ver `design.md` |
