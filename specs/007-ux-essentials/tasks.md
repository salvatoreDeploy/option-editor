# Spec 007 — UX Essentials — Tasks

## Estado

`done`

## Tarefas

- [x] `TASK-001`: Migrar tokens de design para o Tailwind (cor, raio, fonte).
  - Refs: `REQ-010`, `AC-006`, `DEC-001`, `DEC-002`, `RISK-001`.
  - Verificação: `npm run build` — ok. CSS vars em `global.css`, cores/raio em `tailwind.config.js`, Geist/Geist Mono via Google Fonts em `index.html`.
  - Nota: adicionado também um token `--sidebar` (não nomeado no Pencil, mas usado como valor literal repetido `#0C0C0E` em duas telas) — formalizado como variável para não deixar cor solta, conforme `NFR-001`.

- [x] `TASK-002`: Reconstruir a `Sidebar`.
  - Refs: `REQ-011`, `AC-006`.
  - Verificação: `npm run build` — ok. Novo `Brand.tsx`, `Search.tsx` restilizado (visual de input), `Navigation/Link.tsx` com ícone e sem o botão "..." morto (sem `onClick`, removido), `CreatePage.tsx` como botão Primary full-width, rodapé com aviso de armazenamento.
  - Nota: `Profile.tsx` removido — tinha `isAuthenticated = false` fixo e um branch autenticado com dado hardcoded que nunca renderizava; não existe no design do Pencil para as telas atuais (login real é feature futura da Sprint 8, com design próprio em `specs/002-account-settings-screens`).

- [x] `TASK-003`: Reconstruir o `Header` e mover o status de salvamento pra lá.
  - Refs: `REQ-004`, `REQ-012`, `AC-004`, `DEC-003`.
  - Verificação: `npm run build` — ok.
  - Nota: como `Header` e a página `Document` são componentes irmãos (não pai/filho), o status de salvamento é publicado no cache do React Query (`queryClient.setQueryData(['document-save-status', id], status)` em `document.tsx`) e lido via `useQuery` no `Header` — evita Context só pra isso, reaproveita o padrão que o app já usa para `['documents']`/`['document', id]`.

- [x] `TASK-004`: Restilizar o diálogo de exclusão.
  - Refs: `REQ-013`, `AC-005`.
  - Verificação: `npm run build` — ok. Ícone destrutivo, resumo do documento selecionado, botões Secondary/Destructive.

- [x] `TASK-005`: Reconstruir a tela vazia (`blank.tsx`).
  - Refs: `REQ-001`, `AC-001`.
  - Verificação: `npm run build` — ok. Top bar + hero (ícone, título, descrição, ações, atalhos).
  - Nota: extraída a mutation de criar documento pra `useCreateDocument` (hook compartilhado entre `CreatePage` e `blank.tsx`, evita duplicar a lógica); criado `SearchDialogContext` pra abrir a busca a partir de qualquer lugar (antes só existia dentro do `Sidebar/Search.tsx`), já que o botão "Abrir busca rápida" do hero precisa do mesmo diálogo.

- [x] `TASK-006`: Garantir foco correto ao criar documento.
  - Refs: `REQ-002`, `AC-002`.
  - Verificação: já coberto — `autofocus: 'start'` do editor (spec `008`) + navegação imediata pro documento novo após a mutation. Validação manual pendente do usuário.

- [x] `TASK-007`: Implementar `ToC` real (headings do documento).
  - Refs: `REQ-014`, `AC-007`, `DEC-004`.
  - Verificação: `npm run build` — ok. Novo `Editor/getHeadings.ts` lê `doc.descendants`, pulando o heading de título (pos 0); `heading` pertence ao grupo `block` no schema do Tiptap, então headings dentro do corpo (ex. digitando `## `) já são válidos e aparecem no ToC — não era um beco sem saída como o `design.md` original da spec `008` supôs.

- [x] `TASK-008`: Implementar `Inspector Panel`.
  - Refs: `REQ-015`, `DEC-005`, `RISK-002`.
  - Verificação: `npm run build` — ok. `getHeadings.ts` também exporta `countWords`. "Salvo" mostra "Agora" durante a mesma janela de 2s da confirmação de salvamento, "—" fora dela (não fabricamos um histórico de timestamps que não existe nos dados).

- [x] `TASK-009`: Restilizar busca rápida como Command Dialog.
  - Refs: `REQ-005`, `AC-003`, `DEC-006`.
  - Verificação: `npm run build` — ok. Ícone, item com subtítulo, item "Criar novo documento" (via `useCreateDocument`), rodapé de atalhos, overlay dimmed.

- [x] `TASK-010`: Adicionar estado vazio na busca.
  - Refs: `REQ-006`, `AC-003`.
  - Verificação: `Command.Empty` restilizado, mostra "Nenhum documento encontrado." quando a busca não bate com nada.

- [x] `TASK-011`: Loading states consistentes.
  - Refs: `REQ-007`.
  - Verificação: `Sidebar` mostra "Carregando..." enquanto a lista de documentos carrega; `document.tsx` mostra "Carregando documento..." enquanto busca um documento (distinto de "Documento não encontrado.").

- [x] `TASK-012`: Revisar acessibilidade básica de botões e diálogos.
  - Refs: `REQ-008`, `AC-005`.
  - Verificação: `AlertDialog` e `Command.Dialog` (Radix por baixo) já trazem foco/Esc/teclado de graça. Adicionado `aria-label` nos dois botões de colapsar/expandir sidebar, que eram ícone-only sem texto acessível. Navegação completa só de teclado ainda precisa de validação manual do usuário.

- [x] `TASK-013`: Revisar responsividade mínima da janela.
  - Refs: `REQ-009`.
  - Verificação: `src/main/index.ts` ganhou `minWidth: 960`/`minHeight: 600` — a janela não tinha limite mínimo antes, o que quebraria o layout de 3 colunas do editor. `ToC`/`Inspector Panel` já ficam ocultos abaixo do breakpoint `lg` (1024px). Validação manual redimensionando pendente do usuário.

- [x] `TASK-014`: Remover a paleta `rotion-*`.
  - Refs: `RISK-001`.
  - Verificação: `grep -rn "rotion-" src` — sem resultados. Bloco `rotion` removido de `tailwind.config.js`. `npm run build` ok.

## Validação Final

- [x] `npm run build` executado — passa (mesmo erro de tipo pré-existente e não relacionado ao ícone).
- [x] `npm run lint` executado — 0 erros, 0 warnings (o warning de `CreatePage.tsx` que vinha desde a spec `003` foi corrigido de vez durante esta spec).
- [x] Fluxo manual afetado validado (tela vazia, criar documento, busca, header/breadcrumb, exclusão, redimensionar janela, navegação só por teclado).
- [x] Spec atualizada com decisões finais.

## Registro De Execução

| Data | Tarefa | Resultado |
|---|---|---|
| 2026-09-14 | `TASK-001` a `TASK-014` | Implementadas. `npm run build`, `npm run lint` e `tsc --noEmit` passam sem novos erros (0 warnings, inclusive). |
| 2026-09-14 | Bug reportado pelo usuário + correção | Breadcrumb do `Header` mostrava "Sem título" mesmo com um título digitado — a query `['document', id]` que o `Header` lê só era atualizada no fetch inicial e no sucesso do autosave (debounced, ~600ms depois de parar de digitar), nunca durante a digitação. Corrigido em `document.tsx`: `handleEditorContentUpdated` agora publica o título em `['document', id]` e `['documents']` imediatamente a cada mudança de título (não espera o debounce do autosave, que continua só controlando a escrita em disco), com um `lastEmittedTitleRef` pra não regravar o cache a cada tecla do corpo do texto, só quando o título muda de fato. |
| 2026-09-14 | Bug reportado pelo usuário + correção | Área de escrita não tinha rolagem — o documento crescia sem scroll automático. Causa: `html { overflow: hidden }` (global) + a cadeia de containers flex (`Default` → `<main>` da página) sem `min-h-0`/`overflow-y-auto` em nenhum nível, então o conteúdo só ultrapassava a janela em vez de rolar dentro dela (bug clássico de flexbox: item `flex-1` não encolhe pra caber sem `min-h-0` explícito). Corrigido: `Default.tsx` com `overflow-hidden` + `min-h-0` no container do meio; `document.tsx`'s `<main>` com `overflow-y-auto min-h-0`; `blank.tsx` idem por consistência. `ToC` e `Inspector Panel` recuperaram o comportamento "gruda no topo ao rolar" (`sticky top-0` no conteúdo interno, não mais no `<aside>` externo — precisa que o wrapper externo estique pra altura da linha inteira pro sticky funcionar). |
| 2026-09-14 | Ajuste pedido pelo usuário | Tamanho padrão da janela (`src/main/index.ts`) aumentado de `1120x700` para `1440x900`, a pedido do usuário (mais próximo do espaço visto num print de referência). `minWidth`/`minHeight` (`960x600`, da `TASK-013`) mantidos. |
| 2026-09-14 | Validação manual | Usuário confirmou: "validado tudo funcionando nas alterações dessa sprint". Spec concluída. |
| 2026-09-20 | Bug reportado pelo usuário + correção | O "gruda no topo ao rolar" do `ToC`/`Inspector Panel` (fix de 2026-09-14 acima) só funcionava por acidente em documentos curtos. Causa raiz: com `<main>` como `overflow-y-auto` e `align-items: stretch` (padrão do flex), o algoritmo de flexbox dimensiona os itens da linha (`aside`/`section`) pela altura **própria** do container (`main`, que tem altura definida = viewport, herdada do `flex-1` dentro do `h-screen` do `Default`), não pelo conteúdo mais alto que ultrapassa essa altura — então o `<aside>` do `ToC` sempre tinha exatamente 1 viewport de altura, nunca a altura real do documento. Resultado: `position: sticky` (que só consegue colar dentro dos limites do próprio container) parava de funcionar assim que o usuário rolava mais que ~1 viewport — o `ToC` desaparecia rolando junto, exatamente o bug reportado. Comportamento reproduzido e confirmado fora do Electron com uma página HTML isolada replicando a mesma estrutura flex antes de aplicar a correção. Corrigido trocando "um scroll só" por "cada coluna rola por conta própria": `<main>` (`document.tsx`) deixou de ter `overflow-y-auto` (agora `overflow-hidden`); a `<section>` do editor ganhou seu próprio `overflow-y-auto min-h-0` (só ela rola); os dois `<aside>` (`ToC` e `Inspector Panel`) ganharam `h-full overflow-y-auto` (altura fixa = viewport, com scroll próprio se o conteúdo deles for maior que isso) — como as colunas não competem mais por uma altura de linha comum, `ToC`/`Inspector` ficam literalmente fixos no lugar enquanto só o documento rola, sem depender de `position: sticky`. Removido o `sticky top-0` (agora sem função) de `ToC.Root`/`Inspector`. |
| 2026-09-20 | Pedido do usuário (mesma correção) | Itens do `ToC` (`src/renderer/src/components/ToC/Item.tsx`) virou um item de texto (`<p>`) sem interação; virou `<button>` clicável. `Editor` (`src/renderer/src/components/Editor/index.tsx`) ganhou `forwardRef`/`useImperativeHandle` expondo `scrollToHeading(pos)`, que usa `editor.view.nodeDOM(pos)` (posição ProseMirror já calculada por `getHeadings`, spec `008-editor-refactor`) pra achar o elemento DOM do heading e chamar `scrollIntoView({ behavior: 'smooth' })`. `document.tsx` guarda um `editorRef` e cada `ToC.Item` chama `scrollToHeading` com a posição do heading correspondente ao clicar. `npm run build`/`npm run lint` ok. |
