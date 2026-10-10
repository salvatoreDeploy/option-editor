import {
  BrowserWindow,
  Menu,
  Tray,
  ipcMain,
  nativeImage,
  nativeTheme,
} from 'electron'
import { Document } from '../shared/types/ipc'
import { resolveTrayIconPath } from './appIcons'

/**
 * 64x64 em vez de um tamanho "de bandeja" (16/22px): o protocolo
 * StatusNotifierItem/AppIndicator usado pelo GNOME redimensiona o pixmap
 * fornecido pro tamanho real do painel, então entregar uma imagem pequena
 * demais faz o ícone ficar minúsculo em telas HiDPI — é o próprio ambiente
 * que decide o tamanho final de exibição.
 */
function buildTrayIcon() {
  return nativeImage
    .createFromPath(resolveTrayIconPath())
    .resize({ width: 64, height: 64 })
}

export async function createTray(window: BrowserWindow) {
  const tray = new Tray(buildTrayIcon())

  nativeTheme.on('updated', () => {
    tray.setImage(buildTrayIcon())
  })

  const initialMenu = Menu.buildFromTemplate([
    { label: 'OptionEditor', enabled: false },
  ])

  tray.setContextMenu(initialMenu)

  try {
    ipcMain.on('documents:tray-sync', (event, documents: Document[]) => {
      const recentsDocuments = [...documents]
        .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))
        .slice(0, 3)
        .map((document) => ({
          label: document.title,
          type: 'normal',
          click: () => {
            window.webContents.send('open-document', document.id)
            window.show()
          },
        })) as Electron.MenuItemConstructorOptions[]

      const menu = Menu.buildFromTemplate([
        { label: 'OptionEditor', enabled: false },
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
