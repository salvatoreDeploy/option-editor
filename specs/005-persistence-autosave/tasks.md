# Spec 005 — Persistence & Autosave — Tasks

## Estado

`done`

## Tarefas

- [x] `TASK-001`: Implementar debounce no autosave do editor.
  - Refs: `REQ-001`, `AC-001`, `RISK-001`.
  - Subtarefas:
    - Criar util/hook de debounce local (sem lib nova).
    - Aplicar em `handleEditorContentUpdated`.
  - Aceite: escrita no store só ocorre após uma pausa de digitação.
  - Verificação: revisão de código — `useDebouncedCallback` (`src/renderer/src/hooks/useDebouncedCallback.ts`) aplicado com 600ms em `document.tsx`. Validação de sensação de digitação pendente do usuário.
  - Nota: o hook também expõe `flush()`, chamado automaticamente no cleanup do `useEffect` (unmount do componente), para não perder uma mudança pendente ao trocar de documento antes do debounce disparar (`NFR-001`). Isso cobre o caso de navegar para outro documento; não cobre o processo inteiro do Electron sendo fechado abruptamente no meio do delay, que ficaria fora do alcance de um cleanup de componente React.

- [x] `TASK-002`: Evitar salvar quando título e conteúdo não mudaram.
  - Refs: `REQ-002`, `AC-002`, `RISK-002`.
  - Subtarefas:
    - Guardar último payload salvo em `useRef`.
    - Comparar antes de disparar `saveStateDocumentFn`.
  - Aceite: mover o cursor sem alterar texto não gera nova escrita.
  - Verificação: revisão de código (`lastSavedRef` em `document.tsx`, comparação rasa de `title`/`content`).

- [x] `TASK-003`: Tratar erro ao salvar documento.
  - Refs: `REQ-003`, `NFR-002`.
  - Aceite: uma rejeição de `saveDocument` não quebra a UI; erro é capturado.
  - Verificação: `mutate` (em vez de `mutateAsync`) usado para não gerar unhandled rejection; `onError` loga o erro e `isError` alimenta o rótulo de estado.

- [x] `TASK-004`: Exibir estado de salvamento (`Salvando...`, `Salvo`, `Erro ao salvar`).
  - Refs: `REQ-004`, `AC-003`, `DEC-003`.
  - Aceite: texto de estado reflete `isPending`/`isError`/`isSuccess` da mutation.
  - Verificação: revisão de código; validação visual pendente do usuário.
  - Refinamento 1 (pedido do usuário): `isSuccess`/`isError` do React Query não resetam sozinhos para `idle` entre mutations, então "Salvo" ficava exibido indefinidamente. Adicionados ícones (`CircleNotch` girando, `CheckCircle`, `WarningCircle` do `phosphor-react`, já dependência do projeto) e transição de opacidade — sem nova biblioteca.
  - Refinamento 2 (bug reportado pelo usuário após o refinamento 1): "Salvando..." praticamente não aparecia (a escrita local é rápida demais para o `isPending` da mutation ficar visível) e "Salvo" ficava exibido durante toda a janela do debounce mesmo com o usuário ainda digitando, porque o status só reagia ao estado da mutation em si, não ao fato de já existir uma edição aguardando o debounce disparar. Corrigido separando dois sinais: `hasPendingEdit` (true desde a tecla digitada até o debounce efetivamente disparar) e `showSavedConfirmation` (true por 2s após um `isSuccess`). O rótulo exibido prioriza `isSaving || hasPendingEdit` → `saving`, garantindo que "Salvando..." cubra toda a janela de debounce (600ms), não só a chamada IPC em si — e que uma nova edição sempre sobrepõe um "Salvo"/"Erro ao salvar" antigo.

- [x] `TASK-005`: Tratar busca de documento inexistente.
  - Refs: `REQ-005`, `AC-004`, `DEC-004`.
  - Aceite: abrir um id inexistente mostra estado tratado, não tela em branco.
  - Verificação: `document.tsx` retorna "Documento não encontrado." quando `!isFetching && !result`. Validação manual pendente do usuário (navegar para `/document/id-invalido`).

- [x] `TASK-006`: Tratar exclusão do documento aberto.
  - Refs: `REQ-006`, `AC-005`, `DEC-004`.
  - Aceite: excluir o documento atual navega para fora sem estado inconsistente.
  - Verificação: `Header/index.tsx` já navegava para `/` no sucesso da exclusão; adicionado `queryClient.removeQueries({ queryKey: ['document', idDocument] })` para não deixar cache stale do documento excluído. Validação manual pendente do usuário.

- [x] `TASK-007`: Definir schema/versão mínima do `electron-store`.
  - Refs: `REQ-007`, `AC-006`, `DEC-005`.
  - Aceite: store inicializado com versão de schema registrada.
  - Verificação: `src/main/store.ts` ganhou `schema.documents` (JSON schema mínimo, `type: 'object'`) e um bloco `migrations` comentado explicando a convenção (chaveado pela versão do app via `electron-store`, hoje `0.0.10`). Rodar o app com um store novo e um já existente é validação manual pendente do usuário.

## Validação Final

- [x] `npm run build` executado — passa (mesmo erro de tipo pré-existente e não relacionado ao ícone).
- [x] `npm run lint` executado — 0 erros, 1 warning pré-existente e fora de escopo.
- [x] Fluxo manual afetado validado (autosave, documento inexistente, exclusão do documento aberto).
- [x] Spec atualizada com decisões finais.

## Registro De Execução

| Data | Tarefa | Resultado |
|---|---|---|
| 2026-09-11 | `TASK-001` a `TASK-007` | Implementadas. `npm run build`, `npm run lint` e `tsc --noEmit` passam sem novos erros. |
| 2026-09-11 | `TASK-001`, `TASK-004` | Usuário validou manualmente o autosave com debounce e o indicador de status (`Salvando...`/`Salvo`/`Erro ao salvar`), incluindo os dois refinamentos pedidos: "confirmado, testado e funcional". |
| 2026-09-11 | `TASK-005`, `TASK-006` | Usuário confirmou: documento inexistente mostra o estado tratado, e excluir o documento aberto volta para a tela inicial sem travar. Spec concluída. |
