import { app, BrowserWindow, shell } from 'electron'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { GLOBAL } from './global'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { registe_window_api } from './window/window'

function create_atodo_window(): void {
  // Create the browser window.
  GLOBAL.ATODO_WINDOW = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    frame: false,
    transparent: true,
    autoHideMenuBar: true,
    // ...(process.platform === 'linux' ? { icon } : {}),
    icon: icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: false,
      nodeIntegration: false
    }
  })

  GLOBAL.ATODO_WINDOW.on('ready-to-show', () => {
    GLOBAL.ATODO_WINDOW!.show()
    // open devtools
    // GLOBAL.ATODO_WINDOW!.webContents.openDevTools()
  })

  GLOBAL.ATODO_WINDOW.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    GLOBAL.ATODO_WINDOW.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    GLOBAL.ATODO_WINDOW.loadFile(join(__dirname, '../renderer/index.html'))
  }

  registe_window_api()
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

  create_atodo_window()

  app.on('activate', function() {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) create_atodo_window()
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
