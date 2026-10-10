---
name: electron-ipc-hardening
description: Review and harden IPC contracts between src/main, src/preload and src/renderer in OptionEditor — typing window.api, removing inconsistent channel names, ensuring the renderer never touches Electron outside the preload bridge. Use for tasks under specs 003-technical-stabilization and 004-ipc-typing-contracts.
---

# electron-ipc-hardening

Revisão de contratos IPC no OptionEditor, alinhada às specs `003-technical-stabilization` e `004-ipc-typing-contracts`.

## Checklist

1. Todo canal usado em `ipcMain.handle/on` e `ipcRenderer.invoke/send/on` vem de `src/shared/constants/ipc.ts` — nenhuma string literal solta no meio do código.
2. Os valores em `IPC` não têm espaços nem inconsistência de idioma (nada como `abir-documento`/`all-documento`).
3. `src/shared/types/ipc.ts` tem um tipo de request e um de response para cada operação, e os responses que podem não existir (ex. buscar documento por id inexistente) são tipados como `T | undefined`, não como `T` otimista.
4. `Window.api` é declarado uma única vez (hoje, a fonte de verdade deve ser o `typeof api` exportado de `src/preload/index.ts`; `src/preload/index.d.ts` não deve redeclarar com um tipo diferente, como `unknown`).
5. `src/renderer/src/api/*.ts` chama só `window.api.*`, nunca `require('electron')` ou similar direto no renderer.
6. Toda mudança de canal é aplicada nos três lados (main, preload, renderer) no mesmo conjunto de alterações, e validada com `npm run build` antes de considerar concluída.

## Quando usar

Ao mexer em `src/main/ipc.ts`, `src/main/tray.ts`, `src/preload/index.ts`, `src/preload/index.d.ts`, `src/shared/constants/ipc.ts` ou `src/shared/types/ipc.ts`.
