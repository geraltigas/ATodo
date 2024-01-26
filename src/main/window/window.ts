import { GLOBAL } from '../global'
import { BrowserWindow } from 'electron'

export const set_frameless = (): void => {
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

export const fullscreen = (set: boolean): boolean => {
  if (set === false) {
    return false
  }
  let window: BrowserWindow = GLOBAL.ATODO_WINDOW!
  console.log('window', window)
  window.setFullScreen(true)
  return window.isFullScreen()
}

export const miminize = (set: boolean): boolean => {
  if (set === false) {
    return false
  }
  let window: BrowserWindow = GLOBAL.ATODO_WINDOW!
  window.minimize()
  return window.isMinimized()
}

export const maximize = (set: boolean): boolean => {
  if (set === false) {
    return false
  }
  let window: BrowserWindow = GLOBAL.ATODO_WINDOW!
  console.log('window', window)
  window.maximize()
  return window.isMaximized()
}

export const close = (set: boolean): boolean => {
  if (set === false) {
    return false
  }
  let window: BrowserWindow = GLOBAL.ATODO_WINDOW!
  window.close()
  return window.isDestroyed()
}

export const unmaximize = (set: boolean): boolean => {
  if (set === false) {
    return false
  }
  let window: BrowserWindow = GLOBAL.ATODO_WINDOW!
  window.unmaximize()
  return window.isMaximized()
}
