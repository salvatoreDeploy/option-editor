# Spec 005 — Persistence & Autosave — Design

## Estado

`done`

## Resumo Técnico

Envolver o autosave existente em um debounce com comparação do último payload salvo, exibir um estado derivado da `useMutation` do React Query (`isPending`/`isError`/`isSuccess`) como feedback textual, tratar o caso de documento inexistente e de exclusão do documento aberto, e adicionar um campo de versão ao schema do `electron-store`.

## Arquivos Afetados

- `src/renderer/src/pages/document.tsx`
- `src/renderer/src/api/saveStateDocument.ts`
- `src/main/store.ts`
- `src/renderer/src/components/Header/index.tsx` (exclusão do documento aberto)

## Decisões Técnicas

| ID | Decisão | Motivo |
|---|---|---|
| `DEC-001` | Implementar o debounce no `handleEditorContentUpdated` (ex. via um `useRef` com `setTimeout`, ou um pequeno hook `useDebouncedCallback`), sem lib nova | Evita dependência extra para um debounce simples de uma função |
| `DEC-002` | Guardar o último `{title, content}` salvo em um `useRef` e comparar antes de chamar `saveStateDocumentFn` | Comparação rasa é suficiente pois o payload já é só título + string de conteúdo |
| `DEC-003` | Derivar o texto de estado (`Salvando...`, `Salvo`, `Erro ao salvar`) direto de `isPending`/`isError`/`isSuccess` da `useMutation` existente, sem estado React adicional | Reaproveita o que o React Query já expõe |
| `DEC-004` | Ao excluir o documento aberto, navegar para `/` antes de invalidar a query de detalhe, e no `Document` tratar `result === undefined` (pós spec 004) como "documento não encontrado" | Evita que o editor tente renderizar um documento que acabou de ser removido |
| `DEC-005` | Adicionar `version: 1` ao schema do `electron-store` (`StoreType`) e um comentário de como migrações futuras devem incrementar essa versão | `electron-store` suporta `migrations`/versão nativamente; começar a usar agora evita dor de cabeça em mudanças futuras de schema |

## Contratos

`StoreType` passa a incluir uma versão de schema:
```ts
interface StoreType {
  documents: Record<string, Document>
}
```
mantém a mesma forma para `documents`; a versão é controlada pela opção nativa `schema`/`migrations` do `electron-store`, não por um campo dentro do documento.

## Alternativas Consideradas

- Lib de debounce (`lodash.debounce` ou `use-debounce`): descartada por ser um caso simples o suficiente para um `useRef`/`setTimeout` local.

## Research Hooks

- Confirmar a API exata de `migrations` da versão do `electron-store` usada (`^8.2.0`) antes de implementar `TASK` correspondente.

## Impactos

- Renderer: `document.tsx` (debounce, comparação, estado de UI), `Header` (exclusão do documento aberto).
- Main: `store.ts` (schema/versão).
- Persistência: introduz versionamento, mas não migra dados existentes (primeira versão).

## Plano De Validação

- `npm run build`
- `npm run lint`
- Fluxo manual: digitar continuamente e observar que não salva a cada tecla; parar de digitar e ver "Salvando..." → "Salvo"; abrir um id inexistente na URL; excluir o documento atualmente aberto.
