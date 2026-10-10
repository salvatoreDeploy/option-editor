/** Injeta um `window.api` mockado nos testes, sem precisar de `any`. */
export function mockWindowApi<T extends object>(api: T): T {
  ;(window as unknown as { api: T }).api = api

  return api
}
