import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'
import { ipcMain } from 'electron'
import { IPC } from '../shared/constants/ipc'
import {
  AuthStatusResponse,
  RemovePasswordRequest,
  SetPasswordRequest,
  UnlockRequest,
  UnlockResponse,
} from '../shared/types/ipc'
import { AuthRecord, store } from './store'

const SCRYPT_KEY_LENGTH = 64

/**
 * Travado/destravado nesta execução do app — vive só em memória, nunca no
 * `electron-store`. É o comportamento esperado de uma trava local: volta a
 * travar sempre que o app abre de novo (ver spec 010j-local-profile, DEC-001).
 */
let isUnlockedThisSession = true

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString('hex')
}

function verifyPassword(password: string, auth: AuthRecord): boolean {
  const candidate = Buffer.from(hashPassword(password, auth.salt))
  const expected = Buffer.from(auth.passwordHash)

  if (candidate.length !== expected.length) return false

  return timingSafeEqual(candidate, expected)
}

/**
 * Handlers da trava de acesso local — só uma barreira de UI pra acesso
 * casual ao app (NFR-003 da spec 010j), não criptografia dos documentos.
 */
export function createAuthHandlers() {
  isUnlockedThisSession = !store.get('auth')

  ipcMain.handle(
    IPC.AUTH.FETCH_STATUS,
    async (): Promise<AuthStatusResponse> => {
      const auth = store.get('auth')

      return {
        hasPassword: !!auth,
        isUnlocked: !auth || isUnlockedThisSession,
      }
    },
  )

  ipcMain.handle(
    IPC.AUTH.SET_PASSWORD,
    async (_event, { password }: SetPasswordRequest): Promise<void> => {
      const salt = randomBytes(16).toString('hex')

      store.set('auth', { passwordHash: hashPassword(password, salt), salt })
      isUnlockedThisSession = true
    },
  )

  ipcMain.handle(
    IPC.AUTH.REMOVE_PASSWORD,
    async (_event, { password }: RemovePasswordRequest): Promise<void> => {
      const auth = store.get('auth')

      if (!auth || !verifyPassword(password, auth)) {
        throw new Error('Senha atual incorreta.')
      }

      store.set('auth', null)
      isUnlockedThisSession = true
    },
  )

  ipcMain.handle(
    IPC.AUTH.UNLOCK,
    async (_event, { password }: UnlockRequest): Promise<UnlockResponse> => {
      const auth = store.get('auth')

      if (!auth) {
        isUnlockedThisSession = true
        return { success: true }
      }

      const success = verifyPassword(password, auth)

      if (success) isUnlockedThisSession = true

      return { success }
    },
  )

  ipcMain.handle(IPC.AUTH.LOCK, async (): Promise<void> => {
    isUnlockedThisSession = false
  })
}
