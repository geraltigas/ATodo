import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { preload_sql_api } from '../main/sql/sql'
import { preload_window_api } from '../main/window/window'

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('sql', preload_sql_api)
    contextBridge.exposeInMainWorld('win', preload_window_api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.sql = preload_sql_api
  // @ts-ignore (define in dts)
  window.win = preload_window_api
}
