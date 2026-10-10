# Spec 010i — App Settings Screen — Design

## Estado

`done`

## Resumo Técnico

Rota `/settings` nova, fora do `Default` layout (que é feito sob medida pro shell de 3 colunas do editor — sidebar de documentos + header + conteúdo). A tela de configurações é uma página auto-contida com sua própria sidebar de navegação interna. Todas as seções (Geral, Editor, Atalhos, Dados locais, Zona sensível) ficam na mesma página, sempre visíveis; a "navegação" da sidebar interna é só scroll-to-section (mesma técnica usada na correção do ToC do documento). Dados reais (nome do workspace, caminho da pasta de dados) vêm de um novo recurso `settings` no `electron-store`, exposto por 3 handlers novos no main (`fetch`, `save`, `open-data-folder`) e um handler novo pra apagar todos os documentos (`documents:clear-all`). Tudo que já existe (atalhos, linguagens de bloco de código) é só lido, não duplicado.

## Arquivos Afetados

- `src/shared/types/ipc.ts` (`AppSettings`, `FetchSettingsResponse`, `SaveSettingsRequest`, `SaveSettingsResponse`)
- `src/shared/constants/ipc.ts` (`IPC.SETTINGS`, `IPC.DOCUMENTS.CLEAR_ALL`)
- `src/main/store.ts` (novo campo `settings: AppSettings` no `StoreType`, default e schema)
- `src/main/ipc.ts` (handler `DOCUMENTS.CLEAR_ALL`)
- Novo (revisão 2026-10-06): `src/main/settings.ts` (`createSettingsHandlers(window)` — `SETTINGS.FETCH`/`SAVE`/`OPEN_DATA_FOLDER`, movidos de `ipc.ts` porque `SAVE` agora precisa da `window` pra ligar/desligar o corretor ortográfico nativo)
- `src/main/index.ts` (chama `createSettingsHandlers(mainWindow)`)
- `src/preload/index.ts` (`fetchSettings`, `saveSettings`, `openDataFolder`, `clearAllDocuments`)
- Novo: `src/renderer/src/api/fetchSettings.ts`, `saveSettings.ts`, `openDataFolder.ts`, `clearAllDocuments.ts`
- `src/renderer/src/Routes.tsx` (rota `/settings`, fora do `Default`)
- Novo: `src/renderer/src/pages/settings.tsx`
- Novo: `src/renderer/src/components/Settings/Sidebar.tsx`, `NavItem.tsx`
- Novo (revisão 2026-10-06): `src/renderer/src/components/Settings/Switch.tsx`
- `src/renderer/src/components/Sidebar/index.tsx` (ícone novo → `/settings`)
- `src/renderer/src/components/Header/index.tsx` (breadcrumb usa nome do workspace em vez do literal `"Workspace"`; `SAVE_STATUS_STYLE` ganha o status `unsaved`)
- `src/renderer/src/components/Editor/index.tsx` (extrair a lista de linguagens registradas pro `lowlight` numa constante exportada, reaproveitada pela tela de configurações em vez de duplicar a lista)
- Revisão 2026-10-06: `src/renderer/src/pages/document.tsx` (autosave condicional ao `AppSettings.autosaveEnabled`, atalho `Ctrl+S`/`Cmd+S` de salvamento manual, status `unsaved`)
- Revisão 2026-10-06: `src/renderer/src/hooks/useDebouncedCallback.ts` (`delayMs` aceita `null` — registra argumentos mas só dispara via `flush()`)

## Decisões Técnicas

| ID | Decisão | Motivo |
|---|---|---|
| `DEC-001` | "Nome do workspace" tem efeito real no primeiro item do breadcrumb do `Header` (hoje texto fixo `"Workspace"`) | Decisão do usuário (2026-09-20) de que o campo precisa ser real, não decorativo (`RISK-002`); o breadcrumb é o lugar mais direto e de menor risco — não mexe no logo/marca do app (`Brand.tsx` da Sidebar principal continua `"OptionEditor"`, que é a marca do produto, não o workspace do usuário) |
| `DEC-002` | `/settings` é uma rota de nível raiz em `Routes.tsx`, irmã de `/` (não aninhada em `<Default />`) | `Default` já embute a Sidebar de documentos + Header fixos pro shell do editor; a tela de configurações tem sua própria sidebar (Geral/Editor/Atalhos/Dados locais) completamente diferente — aninhar forçaria dois sidebars simultâneos ou gambiarras de ocultação |
| `DEC-003` | Sidebar interna da tela de configurações é navegação por scroll (clicar rola até a seção via `scrollIntoView`), não rotas/abas separadas | O nó `yZqJl` do Pencil mostra todas as seções (`General Settings Card`, `Editor Settings Card`, `Shortcuts Card`, `Local Data Card`, `Danger Zone Card`) simultaneamente dentro do mesmo `Settings Content` — não há estado de "aba selecionada" alternando conteúdo. Mesma técnica já usada na correção do ToC (ids 2026-09-20 no log da `007-ux-essentials`): cada item guarda uma `ref` de seção e chama `scrollIntoView` |
| `DEC-004` | Atalhos: a tela de configurações só **lê** `fetchShortcuts` e abre o `ShortcutsDialog` já existente pra editar, sem duplicar os inputs de captura de tecla | `ShortcutsDialog` (spec `010e`) já resolve captura de acelerador, validação (sem modificador, atalhos iguais) e persistência — duplicar essa lógica numa segunda UI seria o mesmo bug em dois lugares |
| `DEC-005` | "Limpar dados locais" é um `store.set('documents', {})` direto (hard reset da chave inteira), não uma iteração chamando o delete de cada documento | Mais simples e atômico; "limpar dados locais" por definição (`REQ-011`) inclui os documentos já na lixeira (que são só objetos com `deletedAt` dentro da mesma chave `documents`) — resetar a chave cobre os dois casos numa operação só |
| `DEC-006` | Confirmação de "Limpar dados locais" exige digitar a palavra `LIMPAR` num campo de texto pra habilitar o botão de ação dentro do `AlertDialog` | Decisão do usuário (2026-09-20): confirmação reforçada, já que afeta todos os documentos de uma vez e é irreversível (`NFR-002`/`RISK-001`) — mais rigoroso que o clique único usado pra excluir 1 documento (que tem undo) |
| `DEC-007` | Linguagens de bloco de código exibidas na tela vêm de uma constante exportada de `Editor/index.tsx` (`SUPPORTED_CODE_LANGUAGES` ou similar), não de um texto hardcoded separado na tela de configurações | Evita duas fontes de verdade pra mesma lista — se alguém registrar uma linguagem nova no `lowlight` do editor, a tela de configurações reflete automaticamente |
| `DEC-008` | Pasta de dados: `dirname(store.path)` calculado no main (o `.path` do `electron-store`/`conf` aponta pro arquivo `config.json`, não pro diretório) e devolvido como campo extra (não persistido) na resposta de `FETCH_SETTINGS` | Mantém um único round-trip pra carregar a tela de configurações em vez de um IPC dedicado só pra isso |
| `DEC-009` | "Abrir pasta de dados" usa `shell.showItemInFolder(store.path)` (revela o arquivo `config.json` já selecionado dentro da pasta no explorador do SO), não `shell.openPath(dirname)` | `showItemInFolder` é o padrão mais comum em apps desktop pra "me mostra onde isso está guardado" — abre a pasta com o item já em destaque, mais informativo que só abrir a pasta vazia na visão do usuário |
| `DEC-010` (2026-10-06) | Verificação ortográfica usa o corretor **nativo** do Electron/Chromium (`webContents.session.setSpellCheckerEnabled`), não a dependência `@farscrl/tiptap-extension-spellchecker` do `package.json` | Essa extensão não implementa correção nenhuma sozinha — exige passar um `proofreader` próprio (dicionário, sugestões), ou seja, construir um motor de correção do zero. O Electron já embute um corretor completo (dicionário do SO, sublinhado, sugestões no menu de contexto) só esperando ser ligado — zero dependência nova, zero motor pra manter |
| `DEC-011` (2026-10-06) | Handlers de `SETTINGS` saem de `ipc.ts` e viram `createSettingsHandlers(window)` em `src/main/settings.ts`, no mesmo padrão de `export.ts`/`import.ts`/`shortcuts.ts` | `SETTINGS.SAVE` passou a precisar de `window.webContents` pra aplicar o corretor ortográfico imediatamente — `ipc.ts` registra seus handlers no carregamento do módulo, antes de qualquer `BrowserWindow` existir, então não tem como ganhar essa referência sem virar uma função também; manter os outros handlers (documentos/atalhos) como estão evita uma reescrita maior sem necessidade |
| `DEC-012` (2026-10-06) | Autosave desligável reaproveita o mesmo `useDebouncedCallback` já existente, estendendo `delayMs` pra aceitar `null` ("registra os argumentos, nunca dispara sozinho — só via `flush()`") em vez de dois caminhos de código separados (um com debounce, outro sem) | Com autosave ligado, `Ctrl+S` só precisa adiantar o que já ia salvar (`flush()`); com autosave desligado, o mesmíssimo `flush()` já resolve, porque os argumentos mais recentes sempre ficam registrados independente de haver timer agendado. Um único caminho de código pros dois estados, sem duplicar a lógica de "o que significa salvar agora" |
| `DEC-013` (2026-10-06) | `SaveStatus` ganha o valor `unsaved`, mostrado no `Header` só quando autosave está desligado e há edição pendente | Mostrar "Salvando..." (como antes) enquanto o autosave está desligado seria enganoso — nada está em andamento, é preciso `Ctrl+S` pra persistir. Status dedicado deixa isso explícito (`NFR-004`/`RISK-004`) |

## Contratos

```ts
export interface AppSettings {
  workspaceName: string
  autosaveEnabled: boolean // revisão 2026-10-06
  spellCheckEnabled: boolean // revisão 2026-10-06
}

export interface FetchSettingsResponse {
  data: AppSettings
  dataFolderPath: string // calculado, não persistido — ver DEC-008
}

export type SaveSettingsRequest = AppSettings

export interface SaveSettingsResponse {
  data: AppSettings
}
```

```ts
IPC.SETTINGS = {
  FETCH: 'settings:fetch',
  SAVE: 'settings:save',
  OPEN_DATA_FOLDER: 'settings:open-data-folder',
}
IPC.DOCUMENTS.CLEAR_ALL = 'documents:clear-all' // Promise<void>
```

`store.ts` — `StoreType.settings: AppSettings`, default `{ workspaceName: 'Workspace local', autosaveEnabled: true, spellCheckEnabled: true }` (mesmo valor-padrão do mock do Pencil + os dois campos novos ligados por padrão, preservando o comportamento atual pra quem já usa o app).

`createSettingsHandlers` (`src/main/settings.ts`) faz merge defensivo com `SETTINGS_DEFAULTS` ao ler `store.get('settings')` — `electron-store`/`conf` não faz merge profundo de defaults novos dentro de um objeto já persistido, então quem já tinha `settings` salvo (só com `workspaceName`, antes desta revisão) ficaria com `autosaveEnabled`/`spellCheckEnabled` como `undefined` sem esse merge.

## Alternativas Consideradas

- Fazer `/settings` como uma aba dentro do layout `Default` (reaproveitando a Sidebar de documentos): descartada — o desenho do Pencil tem uma sidebar de configurações totalmente diferente (Geral/Editor/Atalhos/Dados locais, não lista de documentos), forçar as duas sidebars a conviver complicaria mais do que uma rota raiz separada (`DEC-002`).
- "Nome do workspace" substituindo o texto da `Brand` (logo "OptionEditor" da Sidebar principal): descartada (`DEC-001`) — misturaria marca do produto com rótulo configurável pelo usuário; o Pencil mantém "OptionEditor" fixo até na própria sidebar da tela de configurações, reforçando que são conceitos diferentes.
- "Limpar dados locais" movendo tudo pra lixeira em vez de apagar de verdade: rejeitada por decisão explícita do usuário (2026-09-20) — contradiria o nome "zona sensível"/irreversível do próprio desenho.
- Editar atalhos diretamente nos cards da tela de configurações (campos de captura de tecla inline): descartada (`DEC-004`) — duplicaria lógica já resolvida e validada no `ShortcutsDialog`.

## Research Hooks

Nenhuma dúvida técnica em aberto — todas as perguntas de escopo (nome do workspace real vs. decorativo; apagar permanente vs. lixeira) já foram resolvidas por decisão explícita do usuário antes desta fase de design.

## Impactos

- Main: `store.ts` ganha uma chave nova (`settings`); `ipc.ts` ganha 4 handlers novos (`SETTINGS.FETCH/SAVE/OPEN_DATA_FOLDER`, `DOCUMENTS.CLEAR_ALL`).
- Preload: 4 métodos novos.
- Renderer: rota nova fora do `Default`; página nova com sidebar própria; pequena mudança no `Header` (breadcrumb) e na `Sidebar` principal (ícone novo de entrada).
- Persistência: schema do `electron-store` ganha `settings`; `documents` pode ser resetado por inteiro via `CLEAR_ALL`.
- Sistema de arquivos: só leitura do caminho (`store.path`) e abertura via `shell.showItemInFolder` — nada é escrito fora do que o `electron-store` já gerencia.

## Plano De Validação

- `npm run build`
- `npm run lint`
- Fluxo manual: abrir `/settings` pelo ícone novo da Sidebar; editar e salvar o nome do workspace, confirmar que aparece no breadcrumb de um documento aberto; clicar nos itens de navegação interna (Editor/Atalhos/Dados locais) e confirmar o scroll até a seção certa; abrir o `ShortcutsDialog` a partir da tela de configurações; abrir a pasta de dados pelos dois botões; testar "Limpar dados locais" com um documento (inclusive um na lixeira) — confirmar que o botão só habilita depois de digitar `LIMPAR`, que a lista de documentos esvazia e que a tray/Sidebar refletem isso; "Voltar aos documentos".
- Fluxo manual (revisão 2026-10-06): desligar "Autosave com debounce" e salvar; editar um documento, confirmar que o `Header` mostra "Não salvo" e que o conteúdo não é persistido sozinho; apertar `Ctrl+S`/`Cmd+S` e confirmar que salva e o status muda pra "Salvo agora"; religar o autosave e confirmar que volta a salvar sozinho após o debounce. Desligar "Verificação ortográfica" e salvar; digitar uma palavra errada no editor e confirmar que o sublinhado nativo do corretor some; religar e confirmar que volta. Fechar e reabrir o app com cada combinação dos dois toggles, confirmando que o valor persiste (inclusive o corretor ortográfico já nascendo no estado certo, sem precisar tocar em nada).
