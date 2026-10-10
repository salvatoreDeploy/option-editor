import { BrowserWindow, dialog, ipcMain } from 'electron'
import { mkdtemp, rm, writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { IPC } from '../shared/constants/ipc'
import {
  ExportDocumentRequest,
  ExportDocumentResponse,
} from '../shared/types/ipc'

const FORMAT_FILTERS: Record<
  ExportDocumentRequest['format'],
  { name: string; extensions: string[] }
> = {
  html: { name: 'HTML', extensions: ['html'] },
  md: { name: 'Markdown', extensions: ['md'] },
  txt: { name: 'Texto', extensions: ['txt'] },
  pdf: { name: 'PDF', extensions: ['pdf'] },
}

/**
 * Handler de exportação de documento. Recebe do renderer o conteúdo já
 * pronto (HTML autocontido para `html`/`pdf`, já convertido para
 * `md`/`txt`) e cuida apenas da parte privilegiada: diálogo nativo de salvar
 * e escrita em disco. Para `pdf`, renderiza o HTML numa janela oculta e usa
 * `printToPDF` — ver spec 010g-document-export, DEC-002/DEC-003.
 */
export function createExportHandlers(window: BrowserWindow) {
  ipcMain.handle(
    IPC.EXPORT.EXPORT_DOCUMENT,
    async (
      _event,
      { format, suggestedFileName, content }: ExportDocumentRequest,
    ): Promise<ExportDocumentResponse> => {
      const { canceled, filePath } = await dialog.showSaveDialog(window, {
        defaultPath: `${suggestedFileName}.${format === 'pdf' ? 'pdf' : format}`,
        filters: [FORMAT_FILTERS[format]],
      })

      if (canceled || !filePath) {
        return { canceled: true }
      }

      if (format === 'pdf') {
        await exportPdf(content, filePath)
      } else {
        await writeFile(filePath, content, 'utf-8')
      }

      return { canceled: false, filePath }
    },
  )
}

async function exportPdf(html: string, filePath: string): Promise<void> {
  const tempDir = await mkdtemp(join(tmpdir(), 'option-editor-export-'))
  const tempHtmlPath = join(tempDir, 'export.html')

  const pdfWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      sandbox: false,
    },
  })

  try {
    await writeFile(tempHtmlPath, html, 'utf-8')
    await pdfWindow.loadFile(tempHtmlPath)

    const pdfBuffer = await pdfWindow.webContents.printToPDF({})

    await writeFile(filePath, pdfBuffer)
  } finally {
    pdfWindow.destroy()
    await rm(tempDir, { recursive: true, force: true })
  }
}
