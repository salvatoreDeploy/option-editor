import { ipcMain } from 'electron'
import { IPC } from '../shared/constants/ipc'
import {
  CreateDocumentResponse,
  DeleteDocumentRequest,
  Document,
  DuplicateDocumentRequest,
  DuplicateDocumentResponse,
  FetchAllDocumentsResponse,
  FetchDocumentRequest,
  FetchDocumentResponse,
  FetchShortcutsResponse,
  RenameDocumentRequest,
  RenameDocumentResponse,
  RestoreDocumentRequest,
  RestoreDocumentResponse,
  SaveDocumentRequest,
  SaveDocumentResponse,
  SaveShortcutsRequest,
  SaveShortcutsResponse,
  ToggleFavoriteDocumentRequest,
  ToggleFavoriteDocumentResponse,
} from '../shared/types/ipc'
import { store } from './store'
import { randomUUID } from 'crypto'
import { pushActivity } from './activity'

ipcMain.handle(
  IPC.DOCUMENTS.FETCH_ALL,
  async (): Promise<FetchAllDocumentsResponse> => {
    return {
      data: Object.values(store.get('documents')).filter(
        (document) => !document.deletedAt,
      ),
    }
  },
)

ipcMain.handle(
  IPC.DOCUMENTS.FETCH,
  async (
    _event,
    { id }: FetchDocumentRequest,
  ): Promise<FetchDocumentResponse> => {
    const document = store.get<string, Document | undefined>(`documents.${id}`)
    return {
      data: document?.deletedAt ? undefined : document,
    }
  },
)

ipcMain.handle(
  IPC.DOCUMENTS.CREATE,
  async (): Promise<CreateDocumentResponse> => {
    const id = randomUUID()

    const document: Document = {
      id,
      title: 'Sem título',
      updatedAt: new Date().toISOString(),
    }

    store.set(`documents.${id}`, document)

    pushActivity('created', document.title)

    return {
      data: document,
    }
  },
)

ipcMain.handle(
  IPC.DOCUMENTS.SAVE,
  async (
    _event,
    { id, title, content }: SaveDocumentRequest,
  ): Promise<SaveDocumentResponse> => {
    const existing = store.get<string, Document | undefined>(`documents.${id}`)

    const document: Document = {
      ...existing,
      id,
      title,
      content,
      updatedAt: new Date().toISOString(),
    }

    store.set(`documents.${id}`, document)

    return {
      data: document,
    }
  },
)

ipcMain.handle(
  IPC.DOCUMENTS.DELETE,
  async (_event, { id }: DeleteDocumentRequest): Promise<void> => {
    const document = store.get<string, Document | undefined>(`documents.${id}`)

    if (!document) return

    store.set(`documents.${id}`, {
      ...document,
      deletedAt: new Date().toISOString(),
    })

    pushActivity('deleted', document.title)
  },
)

ipcMain.handle(
  IPC.DOCUMENTS.RESTORE,
  async (
    _event,
    { id }: RestoreDocumentRequest,
  ): Promise<RestoreDocumentResponse> => {
    const document = store.get<string, Document | undefined>(`documents.${id}`)

    if (!document) {
      throw new Error(`Documento ${id} não encontrado para restaurar.`)
    }

    const restoredDocument: Document = { ...document }
    delete restoredDocument.deletedAt

    store.set(`documents.${id}`, restoredDocument)

    pushActivity('restored', restoredDocument.title)

    return {
      data: restoredDocument,
    }
  },
)

ipcMain.handle(
  IPC.DOCUMENTS.RENAME,
  async (
    _event,
    { id, title }: RenameDocumentRequest,
  ): Promise<RenameDocumentResponse> => {
    const existing = store.get<string, Document | undefined>(`documents.${id}`)

    if (!existing || existing.deletedAt) {
      throw new Error(`Documento ${id} não encontrado para renomear.`)
    }

    const document: Document = {
      ...existing,
      title,
      updatedAt: new Date().toISOString(),
    }

    store.set(`documents.${id}`, document)

    pushActivity('renamed', document.title)

    return {
      data: document,
    }
  },
)

ipcMain.handle(
  IPC.DOCUMENTS.DUPLICATE,
  async (
    _event,
    { id }: DuplicateDocumentRequest,
  ): Promise<DuplicateDocumentResponse> => {
    const original = store.get<string, Document | undefined>(`documents.${id}`)

    if (!original || original.deletedAt) {
      throw new Error(`Documento ${id} não encontrado para duplicar.`)
    }

    const duplicatedId = randomUUID()

    const duplicatedDocument: Document = {
      id: duplicatedId,
      title: `${original.title} (cópia)`,
      content: original.content,
      updatedAt: new Date().toISOString(),
      favorite: false,
    }

    store.set(`documents.${duplicatedId}`, duplicatedDocument)

    pushActivity('duplicated', duplicatedDocument.title)

    return {
      data: duplicatedDocument,
    }
  },
)

ipcMain.handle(IPC.DOCUMENTS.CLEAR_ALL, async (): Promise<void> => {
  store.set('documents', {})
  store.set('activity', [])
})

ipcMain.handle(
  IPC.SHORTCUTS.FETCH,
  async (): Promise<FetchShortcutsResponse> => {
    return {
      data: store.get('shortcuts'),
    }
  },
)

ipcMain.handle(
  IPC.SHORTCUTS.SAVE,
  async (
    _event,
    { newDocument, quickSearch }: SaveShortcutsRequest,
  ): Promise<SaveShortcutsResponse> => {
    if (!newDocument.includes('+') || !quickSearch.includes('+')) {
      throw new Error('Atalhos precisam de um modificador (Ctrl/Cmd/Alt).')
    }

    if (newDocument === quickSearch) {
      throw new Error('Os dois atalhos não podem ser iguais.')
    }

    const shortcuts = { newDocument, quickSearch }

    store.set('shortcuts', shortcuts)

    return {
      data: shortcuts,
    }
  },
)

ipcMain.handle(
  IPC.DOCUMENTS.TOGGLE_FAVORITE,
  async (
    _event,
    { id }: ToggleFavoriteDocumentRequest,
  ): Promise<ToggleFavoriteDocumentResponse> => {
    const existing = store.get<string, Document | undefined>(`documents.${id}`)

    if (!existing || existing.deletedAt) {
      throw new Error(`Documento ${id} não encontrado.`)
    }

    const document: Document = {
      ...existing,
      favorite: !existing.favorite,
    }

    store.set(`documents.${id}`, document)

    return {
      data: document,
    }
  },
)
