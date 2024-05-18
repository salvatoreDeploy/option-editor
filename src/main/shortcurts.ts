import { app, BrowserWindow, globalShortcut } from 'electron'

export function createShortcurts(window: BrowserWindow) {
  app.on('browser-window-focus', () => {
    globalShortcut.register('CommandOrControl+1', () => {
      window.webContents.send('new-document')
    })
  })

  app.on('browser-window-blur', () => {
    globalShortcut.unregisterAll()
  })
}
