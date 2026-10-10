import { contextBridge, ipcRenderer } from 'electron'
import { ElectronAPI, electronAPI } from '@electron-toolkit/preload'
import { IPC } from '../shared/constants/ipc'
import {
  AuthStatusResponse,
  CreateDocumentResponse,
  DeleteDocumentRequest,
  Document,
  DuplicateDocumentRequest,
  DuplicateDocumentResponse,
  ExportDocumentRequest,
  ExportDocumentResponse,
  FetchActivityResponse,
  FetchAllDocumentsResponse,
  FetchDocumentRequest,
  FetchDocumentResponse,
  FetchSettingsResponse,
  FetchShortcutsResponse,
  ImportMarkdownResponse,
  OpenDocumentCallback,
  RemovePasswordRequest,
  RenameDocumentRequest,
  RenameDocumentResponse,
  RestoreDocumentRequest,
  RestoreDocumentResponse,
  SaveDocumentRequest,
  SaveDocumentResponse,
  SaveSettingsRequest,
  SaveSettingsResponse,
  SaveShortcutsRequest,
  SaveShortcutsResponse,
  SetPasswordRequest,
  ToggleFavoriteDocumentRequest,
  ToggleFavoriteDocumentResponse,
  UnlockRequest,
  UnlockResponse,
} from '../shared/types/ipc'

// Custom APIs for renderer
const api = {
  fetchDocuments(): Promise<FetchAllDocumentsResponse> {
    return ipcRenderer.invoke(IPC.DOCUMENTS.FETCH_ALL)
  },

  fetchDocument(req: FetchDocumentRequest): Promise<FetchDocumentResponse> {
    return ipcRenderer.invoke(IPC.DOCUMENTS.FETCH, req)
  },

  createDocument(): Promise<CreateDocumentResponse> {
    return ipcRenderer.invoke(IPC.DOCUMENTS.CREATE)
  },

  saveDocument(req: SaveDocumentRequest): Promise<SaveDocumentResponse> {
    return ipcRenderer.invoke(IPC.DOCUMENTS.SAVE, req)
  },

  deleteDocument(req: DeleteDocumentRequest): Promise<void> {
    return ipcRenderer.invoke(IPC.DOCUMENTS.DELETE, req)
  },

  restoreDocument(
    req: RestoreDocumentRequest,
  ): Promise<RestoreDocumentResponse> {
    return ipcRenderer.invoke(IPC.DOCUMENTS.RESTORE, req)
  },

  renameDocument(req: RenameDocumentRequest): Promise<RenameDocumentResponse> {
    return ipcRenderer.invoke(IPC.DOCUMENTS.RENAME, req)
  },

  duplicateDocument(
    req: DuplicateDocumentRequest,
  ): Promise<DuplicateDocumentResponse> {
    return ipcRenderer.invoke(IPC.DOCUMENTS.DUPLICATE, req)
  },

  toggleFavoriteDocument(
    req: ToggleFavoriteDocumentRequest,
  ): Promise<ToggleFavoriteDocumentResponse> {
    return ipcRenderer.invoke(IPC.DOCUMENTS.TOGGLE_FAVORITE, req)
  },

  fetchShortcuts(): Promise<FetchShortcutsResponse> {
    return ipcRenderer.invoke(IPC.SHORTCUTS.FETCH)
  },

  saveShortcuts(req: SaveShortcutsRequest): Promise<SaveShortcutsResponse> {
    return ipcRenderer.invoke(IPC.SHORTCUTS.SAVE, req)
  },

  exportDocument(req: ExportDocumentRequest): Promise<ExportDocumentResponse> {
    return ipcRenderer.invoke(IPC.EXPORT.EXPORT_DOCUMENT, req)
  },

  importMarkdown(): Promise<ImportMarkdownResponse> {
    return ipcRenderer.invoke(IPC.IMPORT.IMPORT_MARKDOWN)
  },

  clearAllDocuments(): Promise<void> {
    return ipcRenderer.invoke(IPC.DOCUMENTS.CLEAR_ALL)
  },

  fetchSettings(): Promise<FetchSettingsResponse> {
    return ipcRenderer.invoke(IPC.SETTINGS.FETCH)
  },

  saveSettings(req: SaveSettingsRequest): Promise<SaveSettingsResponse> {
    return ipcRenderer.invoke(IPC.SETTINGS.SAVE, req)
  },

  openDataFolder(): Promise<void> {
    return ipcRenderer.invoke(IPC.SETTINGS.OPEN_DATA_FOLDER)
  },

  fetchAuthStatus(): Promise<AuthStatusResponse> {
    return ipcRenderer.invoke(IPC.AUTH.FETCH_STATUS)
  },

  setPassword(req: SetPasswordRequest): Promise<void> {
    return ipcRenderer.invoke(IPC.AUTH.SET_PASSWORD, req)
  },

  removePassword(req: RemovePasswordRequest): Promise<void> {
    return ipcRenderer.invoke(IPC.AUTH.REMOVE_PASSWORD, req)
  },

  unlock(req: UnlockRequest): Promise<UnlockResponse> {
    return ipcRenderer.invoke(IPC.AUTH.UNLOCK, req)
  },

  lock(): Promise<void> {
    return ipcRenderer.invoke(IPC.AUTH.LOCK)
  },

  fetchActivity(): Promise<FetchActivityResponse> {
    return ipcRenderer.invoke(IPC.ACTIVITY.FETCH)
  },

  onNewDocumentRequest(callback: () => void) {
    ipcRenderer.on('new-document', callback)

    return () => {
      ipcRenderer.off('new-document', callback)
    }
  },

  onOpenDocumentRequest(callback: OpenDocumentCallback) {
    return ipcRenderer.on('open-document', (_event, documentId) =>
      callback(documentId),
    )
  },

  onGetDocumentRequest(document: Document[]) {
    return ipcRenderer.send('documents:tray-sync', document)
  },

  /* onNewDocumentRequest: {
    addEventListener(callback: () => void) {
      return ipcRenderer.on('new-document', callback)
    },
    removeEventListener(callback: () => void) {
      return ipcRenderer.off('new-document', callback)
    },
  }, */
}

export type PreloadApi = typeof api

declare global {
  interface Window {
    electron: ElectronAPI
    api: PreloadApi
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI

  window.api = api
}
