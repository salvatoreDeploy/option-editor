export interface Document {
  id: string
  title: string
  content?: string
  updatedAt?: string
  deletedAt?: string
  favorite?: boolean
}

/**
 * Request
 */

export interface FetchDocumentRequest {
  id: string
}

export interface DeleteDocumentRequest {
  id: string
}

export interface RestoreDocumentRequest {
  id: string
}

export interface RenameDocumentRequest {
  id: string
  title: string
}

export interface DuplicateDocumentRequest {
  id: string
}

export interface ToggleFavoriteDocumentRequest {
  id: string
}

export type SaveDocumentRequest = Document

export type OpenDocumentCallback = (documentId: string) => void

/**
 * Response
 */

export interface FetchAllDocumentsResponse {
  data: Document[]
}

export interface FetchDocumentResponse {
  data: Document | undefined
}

export interface CreateDocumentResponse {
  data: Document
}

export interface SaveDocumentResponse {
  data: Document
}

export interface RestoreDocumentResponse {
  data: Document
}

export interface RenameDocumentResponse {
  data: Document
}

export interface DuplicateDocumentResponse {
  data: Document
}

export interface ToggleFavoriteDocumentResponse {
  data: Document
}

export interface ShortcutsConfig {
  newDocument: string
  quickSearch: string
}

export interface FetchShortcutsResponse {
  data: ShortcutsConfig
}

export type SaveShortcutsRequest = ShortcutsConfig

export interface SaveShortcutsResponse {
  data: ShortcutsConfig
}

export type ExportFormat = 'html' | 'md' | 'txt' | 'pdf'

export interface ExportDocumentRequest {
  format: ExportFormat
  suggestedFileName: string
  content: string
}

export interface ExportDocumentResponse {
  canceled: boolean
  filePath?: string
}

export interface ImportMarkdownResponse {
  canceled: boolean
  fileName?: string
  content?: string
}

export interface AppSettings {
  workspaceName: string
  autosaveEnabled: boolean
  spellCheckEnabled: boolean
}

export interface FetchSettingsResponse {
  data: AppSettings
  dataFolderPath: string
}

export type SaveSettingsRequest = AppSettings

export interface SaveSettingsResponse {
  data: AppSettings
}

export interface AuthStatusResponse {
  hasPassword: boolean
  isUnlocked: boolean
}

export interface SetPasswordRequest {
  password: string
}

export interface RemovePasswordRequest {
  password: string
}

export interface UnlockRequest {
  password: string
}

export interface UnlockResponse {
  success: boolean
}

export type ActivityAction =
  | 'created'
  | 'renamed'
  | 'deleted'
  | 'restored'
  | 'duplicated'

export interface ActivityEntry {
  id: string
  action: ActivityAction
  documentTitle: string
  createdAt: string
}

export interface FetchActivityResponse {
  data: ActivityEntry[]
}
