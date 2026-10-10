import { app, shell, BrowserWindow, nativeTheme } from 'electron'
import { join, resolve } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { createFileRoute, createURLRoute } from 'electron-router-dom'
import { resolveWindowIconPath } from './appIcons'

import './ipc'
import './store'
import { createTray } from './tray'
import { createShortcuts } from './shortcuts'
import { createExportHandlers } from './export'
import { createImportHandlers } from './import'
import { createSettingsHandlers } from './settings'
import { createAuthHandlers } from './auth'
import { createActivityHandlers } from './activity'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 960,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#09090B',
    titleBarStyle: 'hiddenInset',
    ...(process.platform === 'linux' ? { icon: resolveWindowIconPath() } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  })

  /* const win = new BrowserWindow()
  win.webContents.openDevTools() */

  createTray(mainWindow)

  createShortcuts(mainWindow)

  createExportHandlers(mainWindow)

  createImportHandlers(mainWindow)

  createSettingsHandlers(mainWindow)

  createAuthHandlers()

  createActivityHandlers()

  if (process.platform === 'linux') {
    nativeTheme.on('updated', () => {
      mainWindow.setIcon(resolveWindowIconPath())
    })
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  const devServerURL = createURLRoute(
    process.env.ELECTRON_RENDERER_URL!,
    'main',
  )

  const fileRoute = createFileRoute(
    join(__dirname, '../renderer/index.html'),
    'main',
  )

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(devServerURL)
  } else {
    mainWindow.loadFile(...fileRoute)
  }
}

if (process.platform === 'darwin') {
  app.dock.setIcon(resolve(__dirname, 'icon.png'))
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
