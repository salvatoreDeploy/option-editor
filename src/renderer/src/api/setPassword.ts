export async function setPassword(password: string): Promise<void> {
  return window.api.setPassword({ password })
}
