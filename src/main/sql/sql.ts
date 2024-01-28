import { DB_FILE, DB_INIT_SQL, GLOBAL } from '../global'

export const init_database = (file_name: string): Promise<boolean> => {
  // read sql_api file from src/main/sql_api/init_table.sql_api
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const fs = require('fs')
      // check if the db file exists
      const db_file = file_name
      if (fs.existsSync(db_file)) {
        console.log('Database file already exists.')
        // delete the db file
        fs.unlinkSync(db_file)
        console.log('Database file has been deleted.')
      }
      // create db file
      const sqlite3 = require('sqlite3').verbose()
      GLOBAL.DB = new sqlite3.Database(db_file, (err: Error | null) => {
        if (err) {
          console.error(err.message)
        }
        console.log('Connected to the database.')
      })
      await GLOBAL.DB.exec(DB_INIT_SQL)
      resolve(true)
    } catch (error) {
      console.error('Unable to init database:', error)
      reject(false)
    }
  })
}

export const check_database = (file_name: string): Promise<boolean> => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const fs = require('fs')
      // check if the db file exists
      if (fs.existsSync(file_name)) {
        console.log('Database file already exists.')
        resolve(true)
      } else {
        console.log('Database file does not exist.')
        resolve(false)
      }
      resolve(true)
    } catch (error) {
      console.error('Unable to check database:', error)
      reject(false)
    }
  })
}

export const delete_database = (file_name: string): Promise<boolean> => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const fs = require('fs')
      // check if the db file exists
      const db_file = file_name
      if (fs.existsSync(db_file)) {
        console.log('Database file already exists.')
        // delete the db file
        fs.unlinkSync(db_file)
        console.log('Database file has been deleted.')
      }
      resolve(true)
    } catch (error) {
      console.error('Unable to delete database:', error)
      reject(false)
    }
  })
}

export const select = (sql: string): Promise<any[]> => {
  return new Promise<any[]>(async (resolve, reject) => {
    try {
      GLOBAL.DB.all(sql, (err: Error | null, rows: any[]) => {
        if (err) {
          console.error('Unable to select:', err)
          reject([])
        }
        resolve(rows)
      })
    } catch (error) {
      console.error('Unable to select:', error)
      reject([])
    }
  })
}

export const rt_bool = (sql: string): Promise<boolean> => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      GLOBAL.DB.run(sql, (err: Error | null) => {
        if (err) {
          console.error('Unable to execute:', err)
          reject(false)
        }
        resolve(true)
      })
    } catch (error) {
      console.error('Unable to execute:', error)
      reject(false)
    }
  })
}

export const sqls_rt_bool = (sqls: string[]): Promise<boolean> => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      GLOBAL.DB.serialize(() => {
        sqls.forEach(sql => {
          GLOBAL.DB.run(sql, (err: Error | null) => {
            if (err) {
              console.error('Unable to execute sqls:', err)
              reject(false)
            }
          })
        })
      })
      resolve(true)
    } catch (error) {
      console.error('Unable to execute sqls:', error)
      reject(false)
    }
  })
}

export const preload_sql_api = {
  init_database: init_database,
  check_database: check_database,
  select: select,
  rt_bool: rt_bool,
  sqls_rt_bool: sqls_rt_bool,
  DB_FILE: DB_FILE,
  DB_INIT_SQL: DB_INIT_SQL
}
