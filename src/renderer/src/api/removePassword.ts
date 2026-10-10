export async function removePassword(password: string): Promise<void> {
  return window.api.removePassword({ password })
}
