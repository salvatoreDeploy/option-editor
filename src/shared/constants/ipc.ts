export const IPC = {
  DOCUMENTS: {
    FETCH_ALL: 'documents:fetch-all',
    FETCH: 'documents:fetch',
    CREATE: 'documents:create',
    SAVE: 'documents:save',
    DELETE: 'documents:delete',
    RESTORE: 'documents:restore',
    RENAME: 'documents:rename',
    DUPLICATE: 'documents:duplicate',
    TOGGLE_FAVORITE: 'documents:toggle-favorite',
    CLEAR_ALL: 'documents:clear-all',
  },
  SHORTCUTS: {
    FETCH: 'shortcuts:fetch',
    SAVE: 'shortcuts:save',
  },
  EXPORT: {
    EXPORT_DOCUMENT: 'export:document',
  },
  IMPORT: {
    IMPORT_MARKDOWN: 'import:markdown',
  },
  SETTINGS: {
    FETCH: 'settings:fetch',
    SAVE: 'settings:save',
    OPEN_DATA_FOLDER: 'settings:open-data-folder',
  },
  AUTH: {
    FETCH_STATUS: 'auth:fetch-status',
    SET_PASSWORD: 'auth:set-password',
    REMOVE_PASSWORD: 'auth:remove-password',
    UNLOCK: 'auth:unlock',
    LOCK: 'auth:lock',
  },
  ACTIVITY: {
    FETCH: 'activity:fetch',
  },
}
