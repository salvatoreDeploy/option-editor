# Spec 010i — App Settings Screen — Tasks

## Estado

`done`

## Tarefas

- [x] `TASK-001`: Contratos — `AppSettings`/`FetchSettingsResponse`/`SaveSettingsRequest`/`SaveSettingsResponse` em `src/shared/types/ipc.ts`; `IPC.SETTINGS` e `IPC.DOCUMENTS.CLEAR_ALL` em `src/shared/constants/ipc.ts`.
  - Refs: `REQ-005`, `REQ-011`, `DEC-008`.
  - Aceite: tipos/constantes disponíveis para main/preload/renderer.
  - Verificação: `npm run build` — ok.

- [x] `TASK-002`: `src/main/store.ts` — campo `settings: AppSettings` no `StoreType`, default `{ workspaceName: 'Workspace local' }`, entrada no `schema`.
  - Refs: `REQ-005`.
  - Aceite: `store.get('settings')` funciona com o default na primeira execução.
  - Verificação: `npm run build` — ok.

- [x] `TASK-003`: Handlers `SETTINGS.FETCH` (devolve `{ data, dataFolderPath: dirname(store.path) }`), `SETTINGS.SAVE` (persiste `AppSettings`), `SETTINGS.OPEN_DATA_FOLDER` (`shell.showItemInFolder(store.path)`) e `DOCUMENTS.CLEAR_ALL` (`store.set('documents', {})`, em `src/main/ipc.ts`).
  - Refs: `REQ-005`, `REQ-010`, `REQ-011`, `DEC-005`, `DEC-008`, `DEC-009`.
  - Aceite: os 4 handlers respondem corretamente; `CLEAR_ALL` zera `documents` inclusive itens com `deletedAt`.
  - Verificação: `npm run build`; revisão de código linha a linha. Fluxo manual com o app real (abrir pasta, limpar dados de verdade) pendente do usuário.
  - Nota (revisão 2026-10-06): os 3 handlers de `SETTINGS` foram movidos de `ipc.ts` pra `src/main/settings.ts` (`createSettingsHandlers(window)`) — ver `TASK-011`.

- [x] `TASK-004`: Preload (`src/preload/index.ts`) + APIs do renderer (`src/renderer/src/api/fetchSettings.ts`, `saveSettings.ts`, `openDataFolder.ts`, `clearAllDocuments.ts`).
  - Refs: `REQ-005`, `REQ-010`, `REQ-011`.
  - Aceite: `window.api.fetchSettings/saveSettings/openDataFolder/clearAllDocuments` tipados e chamáveis do renderer.
  - Verificação: `npm run build` — ok.

- [x] `TASK-005`: Extrair constante exportada com as linguagens registradas no `lowlight` em `src/renderer/src/components/Editor/index.tsx` (`SUPPORTED_CODE_LANGUAGES`), sem duplicar a lista na tela de configurações.
  - Refs: `REQ-008`, `DEC-007`.
  - Aceite: `Editor/index.tsx` e a tela de configurações usam a mesma constante.
  - Verificação: `npm run build` — ok.

- [x] `TASK-006`: Rota `/settings` em `src/renderer/src/Routes.tsx`, fora do `<Default />`.
  - Refs: `REQ-001`, `DEC-002`.
  - Aceite: navegar para `/settings` renderiza a página nova, sem a Sidebar/Header do shell do editor.
  - Verificação: validado num harness isolado (React real, `window.api` mockado, renderizado em Chrome headless) — ver nota de validação abaixo.

- [x] `TASK-007`: `src/renderer/src/components/Settings/Sidebar.tsx` (+ `NavItem.tsx`) — sidebar de navegação interna (Geral/Editor/Atalhos/Dados locais) com scroll-to-section (mesma técnica da correção do ToC) e botão "Voltar aos documentos".
  - Refs: `REQ-003`, `REQ-004`, `DEC-003`.
  - Aceite: clicar num item rola até a seção certa; "Voltar aos documentos" navega de volta.
  - Verificação: renderização visual confirmada no harness; interação de clique real na UI pendente do usuário.

- [x] `TASK-008`: `src/renderer/src/pages/settings.tsx` — página completa: header com título/descrição/"Salvar alterações"; card "Geral" (nome do workspace editável + pasta de dados somente leitura); card "Editor" (autosave/verificação ortográfica/linguagens, somente leitura); card "Atalhos" (leitura de `fetchShortcuts` + botão que abre `ShortcutsDialog`); card "Dados locais" (descrição + "Abrir pasta de dados"); card "Zona sensível" (`AlertDialog` com confirmação por digitação de `LIMPAR` + `clearAllDocuments`).
  - Refs: `REQ-005`–`REQ-011`, `DEC-004`, `DEC-006`, `DEC-009`.
  - Aceite: cobre `AC-004`, `AC-006`, `AC-007`, `AC-008`.
  - Verificação: harness isolado confirmou — edição do campo "Nome do workspace" reflete no input; abrir o `AlertDialog` de "Limpar dados locais" funciona; o botão de confirmação fica desabilitado até digitar exatamente `LIMPAR`, e habilita corretamente depois. Ver nota de validação abaixo.

- [x] `TASK-009`: Ícone novo na Sidebar principal (`src/renderer/src/components/Sidebar/index.tsx`) navegando para `/settings`.
  - Refs: `REQ-002`.
  - Aceite: ícone visível e funcional, mesmo estilo dos ícones de tema/atalhos já existentes.
  - Verificação: `npm run build`/`npm run lint`; revisão de código. Clique real pendente do usuário.

- [x] `TASK-010`: `src/renderer/src/components/Header/index.tsx` — primeiro item do breadcrumb passa a usar o nome do workspace (`fetchSettings`) em vez do literal `"Workspace"`.
  - Refs: `REQ-006`, `DEC-001`.
  - Aceite: cobre `AC-005`.
  - Verificação: `npm run build`/`npm run lint`; revisão de código. Fluxo manual pendente do usuário.

### Revisão 2026-10-06 — Autosave E Verificação Ortográfica Reais

- [x] `TASK-011`: Mover os handlers de `SETTINGS` de `ipc.ts` pra `src/main/settings.ts` (`createSettingsHandlers(window)`); `SAVE` agora também chama `window.webContents.session.setSpellCheckerEnabled(...)`, e a própria `createSettingsHandlers` aplica o valor persistido na janela assim que é chamada (sincroniza no boot). Registrar em `src/main/index.ts`.
  - Refs: `REQ-013`, `DEC-010`, `DEC-011`.
  - Aceite: ligar/desligar "Verificação ortográfica" na tela de configurações muda o corretor nativo imediatamente; reabrir o app já aplica o último valor salvo sem precisar tocar no toggle.
  - Verificação: `npm run build`/`npm run lint` — ok. Fluxo manual (digitar uma palavra errada, ver o sublinhado nativo aparecer/sumir) pendente do usuário.

- [x] `TASK-012`: `AppSettings` ganha `autosaveEnabled`/`spellCheckEnabled`; `store.ts` atualiza default e `createSettingsHandlers` faz merge defensivo com os defaults ao ler (`settings` já persistido antes desta revisão não tinha esses campos).
  - Refs: `REQ-012`, `REQ-013`.
  - Aceite: `store.get('settings')` sempre devolve os 3 campos preenchidos, mesmo pra quem já usava a tela antes desta revisão.
  - Verificação: `npm run build` — ok.

- [x] `TASK-013`: `useDebouncedCallback` aceita `delayMs: number | null` (`null` = só registra os argumentos mais recentes, nunca dispara sozinho). `document.tsx`: lê `autosaveEnabled` das settings, usa `autosaveEnabled ? AUTOSAVE_DEBOUNCE_MS : null`; atalho `Ctrl+S`/`Cmd+S` sempre chama `debouncedSave.flush()`; novo status `unsaved` no `SaveStatus` quando há edição pendente sem autosave. `Header.tsx`: `SAVE_STATUS_STYLE` ganha a entrada `unsaved` ("Não salvo").
  - Refs: `REQ-012`, `NFR-004`, `DEC-012`, `DEC-013`.
  - Aceite: cobre `AC-010`.
  - Verificação: `npm run build`/`npm run lint` — ok, 0 warnings (dependências do `useEffect` do atalho ficaram exaustivas: só `[debouncedSave]`). Fluxo manual (desligar autosave, editar, confirmar que só salva com `Ctrl+S`) pendente do usuário.

- [x] `TASK-014`: `src/renderer/src/components/Settings/Switch.tsx` (toggle acessível, `role="switch"`, sem dependência nova) + card "Editor" em `settings.tsx` troca as duas linhas estáticas por `Switch` reais, com dica "Desligado — salve com Ctrl+S" quando autosave está desligado.
  - Refs: `REQ-012`, `REQ-013`.
  - Aceite: cobre `AC-010`, `AC-011`.
  - Verificação: harness isolado (React real + `window.api` mockado, Chrome headless) — clicar no toggle atualiza o estado (confirmado via texto condicional aparecendo e botão "Salvar alterações" habilitando), e renderização estática de cada estado (`checked=true`/`false`) lado a lado confirmou as cores corretas (`bg-primary`/`bg-secondary`). Uma tentativa inicial de capturar a mudança visual via clique simulado mostrou cor desatualizada — isolado como artefato do próprio Chrome headless (`getComputedStyle` logo após clique sintético numa sessão com `--virtual-time-budget`), não um bug do componente; descartado após o teste com renderização estática lado a lado confirmar que cada estado individualmente produz a cor certa.

## Validação Final

- [x] `npm run build` executado — sem erros.
- [x] `npm run lint` executado — sem erros.
- [x] Fluxo manual afetado validado (`AC-001`–`AC-011`) — usuário testou no app real e aprovou ("validado alterações"), incluindo o fluxo que motivou a correção do `window.webContents.session.setSpellCheckerEnabled`.
- [x] Spec atualizada com decisões finais.

## Registro De Execução

| Data | Tarefa | Resultado |
|---|---|---|
| 2026-10-06 | Spec criada | `requirements.md`/`design.md`/`tasks.md` preenchidos a partir do desenho real consultado no Pencil (nó `yZqJl`, `Screen / Settings`) e de duas decisões de escopo confirmadas com o usuário (nome do workspace real/persistido; limpar dados = apagar permanentemente) |
| 2026-10-06 | `TASK-001`–`TASK-010` | Implementadas. `npm run build` e `npm run lint` passam sem erros |
| 2026-10-06 | Validação visual | Harness isolado (`esbuild` + Chrome headless) montando o componente `Settings` real com `window.api` mockado — confirmou layout fiel ao Pencil, fluxo do `AlertDialog` de limpar dados (confirmação por texto `LIMPAR`) e edição do nome do workspace, sem erros de runtime. Arquivos temporários do harness removidos após a validação, nada ficou no repositório |
| 2026-10-06 | Pedido do usuário: "deixar tudo funcional e nada estático" | Avaliadas as duas únicas partes ainda estáticas da tela (status de autosave e de verificação ortográfica, ambos somente leitura). Investigado: `@farscrl/tiptap-extension-spellchecker` (no `package.json`, nunca usado) não serve pra isso sozinho, exige implementar um motor de correção — optou-se pelo corretor nativo do Electron (`webContents.session.setSpellCheckerEnabled`) em vez disso. Confirmado com o usuário via pergunta direta antes de implementar (não havia decisão óbvia sem ambiguidade) |
| 2026-10-06 | `TASK-011`–`TASK-014` | Implementadas. `npm run build` e `npm run lint` seguem sem erros nem warnings novos |
| 2026-10-06 | Bug reportado pelo usuário no app real + correção | `window.webContents.setSpellCheckerEnabled is not a function` ao abrir o app — API errada: `setSpellCheckerEnabled`/`isSpellCheckerEnabled` pertencem à classe `Session` do Electron, não a `WebContents` diretamente (confirmado em `node_modules/electron/electron.d.ts`). `npm run build`/`npm run lint` não pegam esse tipo de erro porque `webContents.session` é `any`-compatível o bastante pra não quebrar a checagem de tipos, e não havia execução real do Electron neste ambiente de implementação (sem `xvfb`) pra pegar em tempo de execução. Corrigido em `src/main/settings.ts`: `window.webContents.setSpellCheckerEnabled(...)` → `window.webContents.session.setSpellCheckerEnabled(...)`, nos dois pontos de chamada (sincronização no boot e em `SETTINGS.SAVE`). |
| 2026-10-06 | Validação manual | Usuário testou o fluxo completo no app real e aprovou ("validado alterações"). Spec concluída. |
