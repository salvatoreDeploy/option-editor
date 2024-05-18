import { BrowserWindow, Menu, Tray, ipcMain, nativeImage } from 'electron'
import path from 'path'
import { Document } from '../shared/types/ipc'

export async function createTray(window: BrowserWindow) {
  const icon = nativeImage.createFromPath(
    path.resolve(__dirname, '../../resources/iconTry.png'),
  )

  const tray = new Tray(icon)

  const initiaMenu = Menu.buildFromTemplate([
    { label: 'TaskNet', enabled: false },
  ])

  tray.setContextMenu(initiaMenu)

  try {
    ipcMain.on('all-documento', (event, documents: Document[]) => {
      const recentsDocuments = documents
        .map((documento) => ({
          label: documento.title,
          type: 'normal',
          click: () => {
            window.webContents.send('abir-documento', documento.id)
            window.show()
          },
        }))
        .slice(-3) as Electron.MenuItemConstructorOptions[]

      const menu = Menu.buildFromTemplate([
        { label: 'TaskNet', enabled: false },
        { type: 'separator' },
        {
          label: 'Criar novo documento',
          click: () => {
            window.webContents.send('new-document')
            window.show()
          },
        },
        { type: 'separator' },

        { label: 'Documentos recentes...', enabled: false },
        ...recentsDocuments,
        { type: 'separator' },
        {
          label: 'Sair do APP',
          role: 'quit',
        },
      ])

      tray.setContextMenu(menu)
    })
  } catch (error) {
    console.error('Erro ao atualizar o menu da bandeja:', error)
  }
}
