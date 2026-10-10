/** Extrai o texto plano de um HTML, via DOMParser (só existe no renderer). */
export function stripHtml(html: string): string {
  return (
    new DOMParser().parseFromString(html, 'text/html').body.textContent ?? ''
  )
}

/** Escapa `&`, `<` e `>` para inserir texto arbitrário com segurança num HTML. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
