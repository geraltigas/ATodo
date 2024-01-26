import { delete_database, init_database, rt_bool, select, sqls_rt_bool } from './sql'
import { test } from 'node:test'
import * as assert from 'node:assert'
import { tasks_db } from '../../types/sql'
import { insert_task_sql, select_task_sql, update_task_sql } from '../../shared/sql'

test('init_database', async () => {
  const db_file = 'src/main/sql_api/init_database.db'
  await init_database(db_file)
  const res = await select('select * from tasks') as tasks_db[]
  assert.strictEqual(res.length, 1)
  await delete_database(db_file)
})

test('select', async () => {
  const db_file = 'src/main/sql_api/select.db'
  await init_database(db_file)
  const res = await select('select * from tasks where id = 0') as tasks_db[]
  assert.deepStrictEqual(res, [{
    id: 0,
    root_task: 0,
    name: 'Work',
    goal: 'Rise',
    deadline: 4102444800,
    time_consumed: 0,
    status: 'created',
    parent: -1,
    position_x: 100,
    position_y: 100,
    suspended_type: null,
    suspended_info: null
  }])
  await delete_database(db_file)
})

test('insert', async () => {
  const db_file = 'src/main/sql_api/insert.db'
  await init_database(db_file)
  const task: tasks_db = {
    id: 1,
    root_task: 0,
    name: 'test',
    goal: 'test',
    deadline: 1231,
    time_consumed: 123,
    status: 'created',
    parent: 0,
    position_x: 200,
    position_y: 200,
    suspended_type: null,
    suspended_info: null
  }
  const res = await rt_bool(insert_task_sql(task))
  assert.deepStrictEqual(res, true)
  const res_ = await select(select_task_sql(1)) as tasks_db[]
  assert.deepStrictEqual(res_, [task])
  await delete_database(db_file)
})

test('update', async () => {
  const db_file = 'src/main/sql_api/update.db'
  await init_database(db_file)
  const task: tasks_db = {
    id: 0,
    root_task: 0,
    name: 'Work',
    goal: 'Rise',
    deadline: 4102444800,
    time_consumed: 0,
    status: 'in_progress',
    parent: -1,
    position_x: 100,
    position_y: 100,
    suspended_type: null,
    suspended_info: null
  }
  const res = await rt_bool(update_task_sql(task))
  assert.deepStrictEqual(res, true)
  const res_ = await select(select_task_sql(0)) as tasks_db[]
  assert.deepStrictEqual(res_, [task])
  await delete_database(db_file)
})

test('sqls', async () => {
  const db_file = 'src/main/sql_api/sqls.db'
  await init_database(db_file)
  const res = await sqls_rt_bool([
    insert_task_sql({
      id: 1,
      root_task: 0,
      name: 'test',
      goal: 'test',
      deadline: 1231,
      time_consumed: 123,
      status: 'created',
      parent: 0,
      position_x: 200,
      position_y: 200,
      suspended_type: null,
      suspended_info: null
    }),
    update_task_sql({
      id: 0,
      root_task: 0,
      name: 'Work',
      goal: 'Rise',
      deadline: 4102444800,
      time_consumed: 0,
      status: 'in_progress',
      parent: -1,
      position_x: 100,
      position_y: 100,
      suspended_type: null,
      suspended_info: null
    })
  ])
  assert.deepStrictEqual(res, true)
  const res_ = await select(select_task_sql(0)) as tasks_db[]
  assert.deepStrictEqual(res_, [{
    id: 0,
    root_task: 0,
    name: 'Work',
    goal: 'Rise',
    deadline: 4102444800,
    time_consumed: 0,
    status: 'in_progress',
    parent: -1,
    position_x: 100,
    position_y: 100,
    suspended_type: null,
    suspended_info: null
  }])
  const res__ = await select(select_task_sql(1)) as tasks_db[]
  assert.deepStrictEqual(res__, [{
    id: 1,
    root_task: 0,
    name: 'test',
    goal: 'test',
    deadline: 1231,
    time_consumed: 123,
    status: 'created',
    parent: 0,
    position_x: 200,
    position_y: 200,
    suspended_type: null,
    suspended_info: null
  }])
  await delete_database(db_file)
})
