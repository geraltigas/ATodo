import { BrowserWindow } from 'electron'
import { init_database } from './sql/sql'

const sqlite3 = require('sqlite3').verbose()

export const DB_FILE = './storage.db'
export const DB_INIT_SQL = '-- clear all tables\n' +
  'drop table if exists tasks;\n' +
  'drop table if exists app_state;\n' +
  'drop table if exists root_tasks;\n' +
  'drop table if exists tasks_relation;\n' +
  '\n' +
  'create table if not exists tasks\n' +
  '(\n' +
  '  id             timestamp primary key,\n' +
  '  root_task      timestamp,\n' +
  '  name           text,\n' +
  '  goal           text,\n' +
  '  deadline       timestamp,\n' +
  '  time_consumed  timestamp,\n' +
  '  status         text check ( status in (\'created\', \'in_progress\', \'paused\', \'suspended\', \'done\')),\n' +
  '  parent         timestamp,\n' +
  '  position_x     integer,\n' +
  '  position_y     integer,\n' +
  '  suspended_type text check ( suspended_type in (\'time\', \'cyclical\', \'email\', \'constructing\', \'unsupported\', null) ),\n' +
  '  suspended_info text\n' +
  ');\n' +
  '\n' +
  '-- create index of task table, id, root_task, name\n' +
  'create index if not exists tasks_id_idx on tasks (id);\n' +
  'create index if not exists tasks_root_task_idx on tasks (root_task);\n' +
  'create index if not exists tasks_name_idx on tasks (name);\n' +
  '\n' +
  'create table if not exists tasks_relation\n' +
  '(\n' +
  '  id     text primary key,\n' +
  '  source timestamp,\n' +
  '  target timestamp\n' +
  ');\n' +
  '\n' +
  'create index if not exists tasks_relation_source_idx on tasks_relation (source);\n' +
  'create index if not exists tasks_relation_target_idx on tasks_relation (target);\n' +
  '\n' +
  '-- create singleton table for application runtime state\n' +
  'create table if not exists app_state\n' +
  '(\n' +
  '  id                integer primary key check ( id = 0 ),\n' +
  '  root_task         timestamp,\n' +
  '  now_viewing_task  timestamp,\n' +
  '  now_selected_task timestamp\n' +
  ');\n' +
  '\n' +
  'create table if not exists root_tasks\n' +
  '(\n' +
  '  id timestamp primary key\n' +
  ');\n' +
  '\n' +
  'insert into tasks (id, root_task, name, goal, deadline, time_consumed, status, parent, position_x, position_y,\n' +
  '                   suspended_type, suspended_info)\n' +
  'values (0, 0, \'Work\', \'Rise\', 4102444800, 0, \'created\', -1, 100, 100, NULL, NULL);\n' +
  'insert into app_state (id, root_task, now_viewing_task)\n' +
  'VALUES (0, 0, 0);\n' +
  'insert into root_tasks (id)\n' +
  'VALUES (0);\n' +
  '\n' +
  '-- Uncaught SyntaxError: missing ) after argument list\n' +
  'select *\n' +
  'from tasks\n' +
  'where (id = 0);\n'

export let GLOBAL = {
  ATODO_WINDOW: null as BrowserWindow | null,
  WORKER_WINDOW: null as BrowserWindow | null,
  // sqlite3 connection
  DB: new sqlite3.Database(DB_FILE, (err: Error | null) => {
    // print pwd
    if (err) {
      console.error(err.message)
    }
    // check nunmber of tables
    GLOBAL.DB.all('SELECT name FROM sqlite_master WHERE type=\'table\'', (err: Error | null, rows: any[]) => {
      if (err) {
        console.error(err.message)
      }
      if (rows.length === 0) {
        console.log('Database is empty, initializing...')
        // init db
        init_database(DB_FILE).then(_r => {
          console.log('Database is ready.')
        }).catch(e => {
          console.error(e)
        })
      } else {
        console.log('Database is ready.')
      }
    })
    console.log('Connected to the database.')
  })
}
