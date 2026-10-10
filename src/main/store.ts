import { app } from 'electron'
import Store from 'electron-store'
import {
  ActivityEntry,
  AppSettings,
  Document,
  ShortcutsConfig,
} from '../shared/types/ipc'

export interface AuthRecord {
  passwordHash: string
  salt: string
}

interface StoreType {
  documents: Record<string, Document>
  shortcuts: ShortcutsConfig
  settings: AppSettings
  auth: AuthRecord | null
  activity: ActivityEntry[]
}

// Fixa o nome do app (e, com isso, a pasta de `userData` onde o
// electron-store grava). Em modo dev, o Electron deriva esse nome do campo
// `name` do package.json por padrão — renomear o pacote (ex.: durante um
// rebrand do produto) sem isso mudaria silenciosamente a pasta de dados e
// "sumiria" com os documentos já salvos do usuário. Precisa rodar antes de
// `new Store(...)`, que já lê `app.getPath('userData')` na construção.
app.setName('optioneditor')

export const store = new Store<StoreType>({
  defaults: {
    documents: {},
    shortcuts: {
      newDocument: 'CommandOrControl+1',
      quickSearch: 'CommandOrControl+K',
    },
    settings: {
      workspaceName: 'Workspace local',
      autosaveEnabled: true,
      spellCheckEnabled: true,
    },
    auth: null,
    activity: [],
  },
  schema: {
    documents: {
      type: 'object',
    },
    shortcuts: {
      type: 'object',
    },
    settings: {
      type: 'object',
    },
    auth: {
      type: ['object', 'null'],
    },
    activity: {
      type: 'array',
    },
  },
  migrations: {
    // Nenhuma migração ainda. A versão de referência é a versão do app
    // (package.json, via electron-store). Ao mudar o formato de `documents`,
    // adicione uma entrada aqui chaveada pela versão em que a mudança
    // acontecer, ex.: '0.1.0': (store) => { ...transformar dados antigos... }.
  },
})
