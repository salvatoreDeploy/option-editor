import {
  ExportDocumentRequest,
  ExportDocumentResponse,
} from '@shared/types/ipc'

export async function exportDocument(
  req: ExportDocumentRequest,
): Promise<ExportDocumentResponse> {
  return window.api.exportDocument(req)
}
