---
name: renderer-stabilization
description: Fix side effects during render, improve loading/error states, and review React Query and navigation flow in OptionEditor's renderer. Use for tasks under spec 003-technical-stabilization and 007-ux-essentials.
---

# renderer-stabilization

Correção de efeitos colaterais e estados de UI no renderer do OptionEditor, alinhada às specs `003-technical-stabilization` e `007-ux-essentials`.

## Checklist

1. Nenhum componente chama uma função assíncrona (IPC, fetch) diretamente no corpo da função de render — só dentro de `useEffect`, handler de evento, ou via `useQuery`/`useMutation`.
2. `useEffect` tem array de dependências correto — sem sincronizar dado stale nem re-executar em todo render.
3. Toda `useQuery`/`useMutation` trata `isPending`/`isError` de forma visível ao usuário (não deixa a tela muda enquanto carrega ou falha).
4. Navegação (`useNavigate`) após uma mutation só ocorre em `onSuccess`, nunca antes da confirmação do resultado.
5. Nenhum texto de UI finge ser dado real quando não há dado (breadcrumb fixo, placeholder disfarçado de conteúdo) — prefira um estado vazio explícito.
6. Ações destrutivas (excluir) passam por confirmação antes de chamar a mutation correspondente.

## Quando usar

Ao mexer em `src/renderer/src/components/Sidebar/`, `src/renderer/src/components/Header/`, `src/renderer/src/pages/`, ou qualquer lugar que use `useQuery`/`useMutation` do React Query.
