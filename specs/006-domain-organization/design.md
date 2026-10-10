# Spec 006 — Domain Organization — Design

## Estado

`done`

## Resumo Técnico

Revisão de nomenclatura sem mudança de arquitetura: alinhar nomes de função ao domínio `document`, substituir o breadcrumb estático por dados reais do documento aberto, e propagar o nome oficial do produto escolhido na Sprint 0.

## Arquivos Afetados

- `src/renderer/src/api/getDocuments.ts`
- `src/renderer/src/components/Header/index.tsx`
- `src/renderer/src/components/Sidebar/index.tsx`
- `package.json`
- `src/main/tray.ts`
- `src/main/store.ts` (não previsto originalmente — ver `DEC-004`)
- `README.md`

## Decisões Técnicas

| ID | Decisão | Motivo |
|---|---|---|
| `DEC-001` | Manter `fetchDocuments`/`fetchDocument`/`createDocument`/`saveDocument`/`deleteDocument` como os únicos verbos usados para IPC de documento, e renomear `getDocuments` (helper renderer) apenas se colidir semanticamente | `fetch*` já é o padrão dominante nos nomes IPC existentes |
| `DEC-002` | Breadcrumb passa a mostrar o título do documento carregado (via `useQuery` de `document.tsx`/`Header`) em vez de itens fixos | Remove dado falso da UI sem exigir nova arquitetura de navegação |
| `DEC-003` | Nome oficial do produto é decidido e registrado em `specs/000-foundation` (Sprint 0); esta spec só propaga a decisão já tomada | Evita a spec de domínio tomar uma decisão de produto que não é escopo técnico |
| `DEC-004` | Fixar `app.setName('optioneditor')` em `src/main/store.ts`, antes de construir o `Store` | Descoberto durante a execução: o Electron deriva a pasta de `userData` (onde o `electron-store` grava) do nome do processo, que em dev vem do `package.json`. Renomear o pacote sem isso faz o app apontar para uma pasta de dados diferente, "perdendo" os documentos já salvos do usuário (não eram apagados, ficavam na pasta antiga) |

## Contratos

Nenhum contrato IPC muda nesta spec — é puramente nomenclatura interna e textos de UI.

## Alternativas Consideradas

- Remover o breadcrumb até haver hierarquia real de documentos: descartado por ora; melhor mostrar o título real do documento do que remover o elemento.

## Research Hooks

Nenhum.

## Impactos

- Renderer: `Header`, `Sidebar`, helpers de API.
- Build/distribuição: `package.json` (nome do produto), `electron-builder.yml` se referenciar o nome.

## Plano De Validação

- `npm run build`
- `npm run lint`
- Fluxo manual: abrir documentos diferentes e confirmar que o breadcrumb reflete o título de cada um.
