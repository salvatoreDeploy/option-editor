# Spec 008 — Editor Refactor — Design

## Estado

`done`

## Resumo Técnico

Substituir o parsing por regex por leitura direta do documento ProseMirror: o primeiro nó do doc é sempre `heading` (garantido pelo `content: 'heading block*'` do `Document.extend`), então título e conteúdo podem ser extraídos navegando `editor.state.doc` em vez de regex sobre `editor.getHTML()`.

## Arquivos Afetados

- `src/renderer/src/components/Editor/index.tsx`
- Um novo módulo puro, ex. `src/renderer/src/components/Editor/parseContent.ts`, para extrair `{ title, content }` a partir do doc/HTML, testável isoladamente.

## Decisões Técnicas

| ID | Decisão | Motivo |
|---|---|---|
| `DEC-001` | Extrair o título lendo `editor.state.doc.firstChild` (o heading, garantido pelo schema) e serializar o restante do doc para o `content` | Não depende de regex sobre string HTML; usa a garantia estrutural que a extensão `Document` já impõe |
| `DEC-002` | Mover a lógica de `{title, content}` para uma função pura em `parseContent.ts`, recebendo o editor/doc e retornando o par | Torna a lógica testável sem precisar montar um editor Tiptap completo no teste, quando `009-quality-testability` estiver pronta |
| `DEC-003` | Título vazio (heading sem texto) mapeia para o mesmo fallback `'Untitled'` (ou o texto padrão definido na spec `006-domain-organization`) | Mantém consistência com o comportamento atual, só trocando a implementação — na prática, `EMPTY_TITLE_FALLBACK = 'Sem título'`, reaproveitando a decisão da spec `006` |
| `DEC-004` | Placeholder do editor vira uma função por tipo de nó: heading vazio mostra `'Sem título'`, qualquer outro bloco vazio mostra `'Escreva algo...'` | Antes um único placeholder `'Sem título'` era aplicado a qualquer bloco vazio (inclusive parágrafos do corpo), o que é enganoso — só o heading é o título |
| `DEC-005` | `autofocus` do editor muda de `'end'` para `'start'` | Ao abrir/criar um documento, faz mais sentido o cursor cair no título (heading, primeiro nó) do que no fim do conteúdo — sobretudo em documento novo, onde o título é o primeiro campo a preencher |

## Contratos

`OnContentUpdatedParams` continua `{ title: string, content?: string }` — a mudança é só na forma de obter esses valores, não no contrato exposto para `document.tsx`.

## Alternativas Consideradas

- Usar uma extensão dedicada do Tiptap para "título" (separando-o do doc principal): mais robusto a longo prazo, mas maior mudança de schema; registrado como possível evolução futura, não necessário para resolver a fragilidade da regex.

## Research Hooks

- ~~Confirmar a forma mais direta de serializar "o doc sem o primeiro heading" de volta para HTML~~ — resolvido: `@tiptap/core` exporta `getHTMLFromFragment(fragment, schema)`, que serializa um `Fragment` do ProseMirror pra HTML sem precisar reconstruir string manualmente. `doc.content.cut(heading.nodeSize)` dá o fragmento com tudo depois do heading.

## Avaliação De Markdown E Code Blocks (REQ-005)

`CodeBlockLowlight` já cobre highlighting de `html`, `css`, `js`, `ts` (registrados manualmente) + `lowlight`/`common` (demais linguagens comuns). O `StarterKit` (com `document: false`, mas mantendo `Heading`, `BulletList`, `OrderedList`, `Blockquote`, etc.) já traz os input rules padrão do Tiptap — digitar `# `, `- `, `1. `, `> `, `` ``` `` converte automaticamente para heading/lista/citação/code block, sem extensão adicional. Isso cobre "atalhos estilo Markdown ao digitar".

O que **não** existe é conversão completa doc↔Markdown (exportar `.md` / importar arquivo `.md` como está). Isso é uma feature própria (ex. via `tiptap-markdown` ou serialização manual), já coberta como item separado nas specs `010-controlled-expansion` (`Exportar documento como .md`, `Importar arquivo Markdown`) — não faz parte desta spec de refatoração.

## Revisão Do `Document.extend` (REQ-003)

Confirmado: `content: 'heading block*'` já garante que todo doc válido começa com exatamente um `heading` seguido de zero ou mais blocos. `doc.firstChild` em `parseEditorContent` depende dessa garantia — o ProseMirror preenche automaticamente um heading vazio ao inicializar um doc sem conteúdo (via `createAndFill`), então `firstChild` nunca deveria ser `null` na prática; o tratamento defensivo em `parseContent.ts` cobre esse caso mesmo assim.

## Impactos

- Renderer: só o componente `Editor` e o novo módulo de parsing.
- Nenhum impacto em main/preload/persistência (o formato salvo continua HTML).

## Plano De Validação

- `npm run build`
- `npm run lint`
- Fluxo manual: editar título e conteúdo com formatação variada (múltiplos parágrafos, code block, heading vazio) e confirmar que título/conteúdo continuam corretos após recarregar o documento.
