import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { check_database, init_database, rt_bool, select, sqls_rt_bool } from '../main/sql/sql'
import { DB_FILE, DB_INIT_SQL_FILE } from '../main/global'

// Custom APIs for renderer
const sql = {
  init_database: init_database,
  check_database: check_database,
  select: select,
  rt_bool: rt_bool,
  sqls_rt_bool: sqls_rt_bool,
  DB_FILE: DB_FILE,
  DB_INIT_SQL_FILE: DB_INIT_SQL_FILE
}

const win = {
  fullscreen: () => ipcRenderer.send('window-control', 'set_fullscreen'),
  miminize: () => ipcRenderer.send('window-control', 'set_miminize'),
  maximize: () => ipcRenderer.send('window-control', 'set_maximize'),
  unmaximize: () => ipcRenderer.send('window-control', 'exit_maximize'),
  close: () => ipcRenderer.send('window-control', 'set_close')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('sql', sql)
    contextBridge.exposeInMainWorld('win', win)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.sql = sql
  // @ts-ignore (define in dts)
  window.win = win
}
