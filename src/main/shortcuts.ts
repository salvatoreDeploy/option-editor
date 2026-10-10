import { app, BrowserWindow, globalShortcut } from 'electron'
import { store } from './store'

export function createShortcuts(window: BrowserWindow) {
  let isFocused = false

  function registerNewDocumentShortcut() {
    globalShortcut.unregisterAll()

    const { newDocument } = store.get('shortcuts')

    const registered = globalShortcut.register(newDocument, () => {
      window.webContents.send('new-document')
    })

    if (!registered) {
      console.error(
        `Não foi possível registrar o atalho "${newDocument}" — provavelmente já está em uso por outro app.`,
      )
    }
  }

  app.on('browser-window-focus', () => {
    isFocused = true
    registerNewDocumentShortcut()
  })

  app.on('browser-window-blur', () => {
    isFocused = false
    globalShortcut.unregisterAll()
  })

  // Reaplica o atalho na hora se o usuário mudar a configuração enquanto a
  // janela está em foco — sem isso, só valeria depois de um blur/focus.
  store.onDidChange('shortcuts', () => {
    if (isFocused) {
      registerNewDocumentShortcut()
    }
  })
}
