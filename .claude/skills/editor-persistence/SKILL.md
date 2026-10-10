---
name: editor-persistence
description: Improve autosave (debounce, change detection, error handling) and electron-store read/write in OptionEditor. Use for tasks under spec 005-persistence-autosave.
---

# editor-persistence

Melhoria de autosave e persistência no OptionEditor, alinhada à spec `005-persistence-autosave`.

## Checklist

1. O autosave do editor (`src/renderer/src/pages/document.tsx`) tem debounce — não escreve no store a cada tecla.
2. Antes de salvar, compara o payload (`title`/`content`) com o último salvo; se igual, não chama `saveDocument`.
3. Uma falha na mutation de salvar é tratada (`isError`) e refletida na UI (`Erro ao salvar`), sem quebrar o app.
4. Buscar um documento inexistente (`fetchDocument` retornando `undefined`, ver spec `004`) resulta em um estado tratado na UI, não em tela em branco.
5. Excluir o documento aberto no momento navega para fora de forma consistente, sem deixar o editor apontando para um id removido.
6. `src/main/store.ts` tem uma versão de schema registrada (`electron-store` suporta isso nativamente) — qualquer mudança de formato futuro deve vir acompanhada de migração, não de sobrescrita silenciosa.

## Quando usar

Ao mexer em `src/renderer/src/pages/document.tsx`, `src/renderer/src/api/saveStateDocument.ts`, `src/renderer/src/api/fetchDocument.ts`, ou `src/main/store.ts`.
