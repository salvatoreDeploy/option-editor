export async function lock(): Promise<void> {
  return window.api.lock()
}
