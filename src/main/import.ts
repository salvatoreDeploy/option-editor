import { BrowserWindow, dialog, ipcMain } from 'electron'
import { readFile } from 'fs/promises'
import { basename, extname } from 'path'
import { IPC } from '../shared/constants/ipc'
import { ImportMarkdownResponse } from '../shared/types/ipc'

/**
 * Handler de importação de Markdown. Cuida só do que exige privilégio
 * (diálogo nativo de abrir arquivo e leitura em disco) e devolve o conteúdo
 * bruto pro renderer converter — o parsing de Markdown→HTML acontece todo lá,
 * sem precisar de nenhuma API exclusiva do main (ver spec
 * 010h-markdown-import, DEC-001).
 */
export function createImportHandlers(window: BrowserWindow) {
  ipcMain.handle(
    IPC.IMPORT.IMPORT_MARKDOWN,
    async (): Promise<ImportMarkdownResponse> => {
      const { canceled, filePaths } = await dialog.showOpenDialog(window, {
        properties: ['openFile'],
        filters: [{ name: 'Markdown', extensions: ['md', 'markdown'] }],
      })

      if (canceled || filePaths.length === 0) {
        return { canceled: true }
      }

      const filePath = filePaths[0]
      const content = await readFile(filePath, 'utf-8')
      const fileName = basename(filePath, extname(filePath))

      return { canceled: false, fileName, content }
    },
  )
}
