# Spec 006 — Domain Organization — Tasks

## Estado

`done`

## Tarefas

- [x] `TASK-001`: Revisar e consolidar nomes de função do domínio `document`.
  - Refs: `REQ-001`, `REQ-002`, `AC-001`, `RISK-001`.
  - Aceite: sem sinônimos redundantes para a mesma operação.
  - Verificação: `npm run build` após cada renomeação — ok.
  - Nota: `src/renderer/src/api/getDocuments.ts` → `fetchDocuments.ts` (função `getDocuments` → `fetchDocuments`, alinhando com `fetchDocument`/`fetchDocuments` do preload) e `saveStateDocument.ts` → `saveDocument.ts` (função e variável local `saveDocumentFn`, alinhando com `window.api.saveDocument`). Também corrigido `documento`/`initiaMenu` (identificadores em português/typo) para `document`/`initialMenu` em `src/main/tray.ts` — identificadores de código seguem o domínio `document` em inglês; textos de UI continuam em português.

- [x] `TASK-002`: Substituir breadcrumb estático por dados reais do documento.
  - Refs: `REQ-003`, `AC-002`, `AC-003`, `DEC-002`.
  - Subtarefas:
    - Remover "Back-end", "Estrutura técnica", "Untitled" fixos.
    - Renderizar o título real do documento carregado.
  - Aceite: breadcrumb muda conforme o documento aberto.
  - Verificação: revisão de código (`Header/index.tsx` agora busca o documento atual via `useQuery(['document', idDocument])`, reaproveitando o cache já populado pela página `Document`, e exibe `currentDocument?.title`). Validação visual pendente do usuário.
  - Nota: como não existe hierarquia real de pastas/seções no app, o breadcrumb foi reduzido a um único item (o título do documento) em vez de manter uma trilha falsa de 3 níveis. `Breadcrumbs.HiddenItems` (um stub `<span>...</span>` sem lógica) e `Breadcrumbs.Separator` ficaram sem uso e foram removidos.

- [x] `TASK-003`: Padronizar textos de interface em português.
  - Refs: `REQ-004`.
  - Aceite: nenhum texto de UI em inglês fora de nomes técnicos/marca.
  - Verificação: revisão manual das telas — `"Workspace"` → `"Área de trabalho"` (`Sidebar/index.tsx`), `"TABLE OF CONTENTS"` → `"SUMÁRIO"` (`document.tsx`), `"Untitled"` → `"Sem título"` (placeholder do Tiptap, fallback de título e título padrão ao criar documento em `src/main/ipc.ts`).

- [x] `TASK-004`: Propagar o nome oficial do produto.
  - Refs: `REQ-005`, `AC-004`, `DEC-003`.
  - Subtarefas:
    - Atualizar `name`/`productName` em `package.json` e `electron-builder.yml`.
    - Atualizar textos do tray/menu em `src/main/tray.ts`.
    - Atualizar `README.md`.
  - Aceite: mesmo nome em build, UI e documentação.
  - Verificação: `npm run build` — ok (`optioneditor@0.0.10`).
  - Nota: nome decidido pelo usuário — `OptionEditor`. `electron-builder.yml` já usava `productName: OptionEditor`/`appId: com.projetosdeploy.optioneditor` (só `package.json`/UI estavam atrasados). Atualizados: `package.json` (`name`), `src/renderer/index.html` (`<title>`, antes `Electron`, o padrão do boilerplate — nunca tinha sido customizado), `src/main/tray.ts` (label do menu), `README.md` (título).

## Validação Final

- [x] `npm run build` executado — passa (mesmo erro de tipo pré-existente e não relacionado ao ícone).
- [x] `npm run lint` executado — 0 erros, 1 warning pré-existente e fora de escopo.
- [x] Fluxo manual afetado validado (abrir documentos diferentes e comparar breadcrumb; conferir tray/menu com o nome novo).
- [x] Spec atualizada com decisões finais.

## Bug Introduzido E Corrigido Durante A Execução

Renomear `package.json` (`name: tasknet` → `optioneditor`) na `TASK-004` teve um efeito colateral não previsto no `design.md`: em modo dev, o Electron deriva o nome do processo (`app.name`) do campo `name` do `package.json`, e usa esse nome para decidir a pasta de `userData` onde o `electron-store` grava (`~/.config/<app.name>/config.json`). A troca de nome fez o app passar a ler/gravar em `~/.config/optioneditor/` em vez de `~/.config/tasknet/`, onde os 13 documentos reais do usuário estavam salvos — não foram apagados, só ficaram "invisíveis" para o app rodando com o novo nome.

Correção aplicada:

- `src/main/store.ts` agora chama `app.setName('optioneditor')` antes de construir o `Store`, fixando a pasta de dados no código em vez de deixá-la depender do `package.json`. Isso evita que qualquer rebrand futuro do produto orfanize dados de usuário de novo.
- Os 13 documentos de `~/.config/tasknet/config.json` foram copiados (merge, não sobrescrita destrutiva) para `~/.config/optioneditor/config.json`, com backup do arquivo de destino anterior salvo como `config.json.bak-before-merge`. `~/.config/tasknet/` não foi apagado, fica como cópia de segurança.

Isso deveria ter sido antecipado como um risco no `design.md` original desta spec (persistência não estava listada em "Arquivos Afetados"); registrado aqui para constar na spec.

## Achados Fora De Escopo (Registrados No Backlog)

- `ToC` em `document.tsx` mostra `Back-end`/`Banco de Dados` fixos, sem relação com o conteúdo real — depende de parsing de headings do Tiptap, então fica para a spec `008-editor-refactor` (adicionado ao `BACKLOG.md`, Sprint 6).
- `Profile.tsx` tem `isAuthenticated = false` fixo e um branch autenticado com dado de exemplo hardcoded que nunca renderiza — é implementação pendente de login real, cujo design já existe em `specs/002-account-settings-screens`. Adicionado à Sprint 8 do `BACKLOG.md` como feature futura, não é um bug desta spec.

## Registro De Execução

| Data | Tarefa | Resultado |
|---|---|---|
| 2026-09-11 | `TASK-001` a `TASK-004` | Implementadas. `npm run build`, `npm run lint` e `tsc --noEmit` passam sem novos erros. Nome do produto (`OptionEditor`) decidido pelo usuário. |
| 2026-09-11 | Bug de dados + correção | Rename do `package.json` orfanizou a pasta de `userData` do Electron; 13 documentos reais do usuário recuperados via merge para `~/.config/optioneditor/config.json` e `app.setName('optioneditor')` fixado em `store.ts`. |
| 2026-09-14 | Validação manual | Usuário testou e confirmou: "testei tudo correto". Spec concluída. |
