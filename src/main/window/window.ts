import { GLOBAL } from '../global'
import { BrowserWindow, ipcMain, ipcRenderer } from 'electron'

const set_frameless = (): void => {
  let window: BrowserWindow = GLOBAL.ATODO_WINDOW!
  console.log(GLOBAL)
  console.log(window)
  window.setResizable(false)
  window.setMovable(true)
  window.setMinimizable(false)
  window.setMaximizable(false)
  window.setClosable(true)
  window.setAlwaysOnTop(true, 'screen-saver')
  window.setFullScreenable(false)
  window.setFullScreen(false)
  window.setMenu(null)
  window.setIgnoreMouseEvents(false)
  window.setOpacity(1)
}
//
// const fullscreen = (set: boolean): boolean => {
//   if (set === false) {
//     return false
//   }
//   let window: BrowserWindow = GLOBAL.ATODO_WINDOW!
//   console.log('window', window)
//   window.setFullScreen(true)
//   return window.isFullScreen()
// }

const miminize = (set: boolean): boolean => {
  if (set === false) {
    return false
  }
  let window: BrowserWindow = GLOBAL.ATODO_WINDOW!
  window.minimize()
  return window.isMinimized()
}

const maximize = (set: boolean): boolean => {
  if (set === false) {
    return false
  }
  let window: BrowserWindow = GLOBAL.ATODO_WINDOW!
  console.log('window', window)
  window.maximize()
  return window.isMaximized()
}

const close = (set: boolean): boolean => {
  if (set === false) {
    return false
  }
  let window: BrowserWindow = GLOBAL.ATODO_WINDOW!
  window.close()
  return window.isDestroyed()
}

const unmaximize = (set: boolean): boolean => {
  if (set === false) {
    return false
  }
  let window: BrowserWindow = GLOBAL.ATODO_WINDOW!
  window.unmaximize()
  return window.isMaximized()
}

const set_window_size = (width: number, height: number): void => {
  // parse to int higher floor
  width = Math.ceil(width)
  height = Math.ceil(height)
  let window: BrowserWindow = GLOBAL.ATODO_WINDOW!
  window.setSize(width, height)
}

const set_resizeable = (set: boolean): boolean => {
  let window: BrowserWindow = GLOBAL.ATODO_WINDOW!
  window.setResizable(set)
  return window.isResizable()
}

const get_window_size = (): number[] => {
  let window: BrowserWindow = GLOBAL.ATODO_WINDOW!
  return window.getSize()
}

export const registe_window_api = (): void => {
  ipcMain.on('window-control', (_event, method) => {
    switch (method) {
      case 'set_frameless':
        set_frameless()
        break
      case 'set_fullscreen':
        GLOBAL.ATODO_WINDOW!.setFullScreen(true)
        break
      case 'set_miminize':
        miminize(true)
        break
      case 'set_maximize':
        maximize(true)
        break
      case 'set_close':
        close(true)
        break
      case 'exit_maximize':
        unmaximize(true)
        break
    }
  })
  // @ts-ignore
  ipcMain.handle('window-control', async (_event, method, ...args) => {
    switch (method) {
      case 'set_window_size':
        set_window_size(args[0], args[1])
        break
      case 'set_resizable':
        set_resizeable(args[0])
        break
      case 'get_window_size':
        return get_window_size()
    }
  })
}

export const preload_window_api = {
  close: () => {
    ipcRenderer.send('window-control', 'set_close')
  },
  fullscreen: () => {
    ipcRenderer.send('window-control', 'set_fullscreen')
  },
  maximize: () => ipcRenderer.send('window-control', 'set_maximize'),
  miminize: () => ipcRenderer.send('window-control', 'set_miminize'),
  set_resizable: async (set: boolean) => await ipcRenderer.invoke('window-control', 'set_resizable', set),
  set_window_size: async (width: number, height: number) => await ipcRenderer.invoke('window-control', 'set_window_size', width, height),
  unmaximize: () => ipcRenderer.send('window-control', 'exit_maximize'),
  get_window_size: async () => await ipcRenderer.invoke('window-control', 'get_window_size')
}
