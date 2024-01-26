import { BrowserWindow } from 'electron'

const sqlite3 = require('sqlite3').verbose()

export const DB_FILE = './src/main/sql/storage.db'
export const DB_INIT_SQL_FILE = './src/main/sql/init_table.sql_api'

export let GLOBAL = {
  ATODO_WINDOW: null as BrowserWindow | null,
  WORKER_WINDOW: null as BrowserWindow | null,
  // sqlite3 connection
  DB: new sqlite3.Database(DB_FILE, (err: Error | null) => {
    // print pwd
    if (err) {
      console.error(err.message)
    }
    console.log('Connected to the database.')
  })
}
