import { task_relation_db, tasks_db, timestamp } from '../../../types/sql'
import { sql_api } from './sql_api'
import { edges, is_modified, nodes, now_viewing_task, root_task } from '../state/app'
import { insert_or_update_task_sql, select_from_family_tree_sql } from '../../../shared/sql'
import dayjs from 'dayjs'

type mutated<T> = {
  mutated: boolean,
  to_delete: boolean,
  value: T
}

export class task_api {
  private static task_buffer: Map<timestamp, mutated<tasks_db>> = new Map()
  private static task_relation_buffer: Map<string, mutated<task_relation_db>> = new Map()

  public static get_task(id: timestamp): Promise<tasks_db> {
    return new Promise((resolve, reject) => {
      if (task_api.task_buffer.has(id)) {
        resolve(task_api.task_buffer.get(id)!.value)
      } else {
        task_api.get_task_from_db(id)
          .then((res) => {
            task_api.task_buffer.set(id, {
              mutated: false,
              to_delete: false,
              value: res
            })
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      }
    })
  }

  public static delete_task(id: timestamp) {
    if (task_api.task_buffer.has(id)) {
      task_api.task_buffer.set(id, {
        mutated: false,
        to_delete: true,
        value: task_api.task_buffer.get(id)!.value
      })
    }
    is_modified.value = true
    nodes.value = nodes.value.filter((value) => {
      return value.data.real_task !== id
    })
  }

  private static get_empyt_task(): tasks_db {
    return {
      id: dayjs().valueOf(),
      root_task: root_task.value,
      name: '',
      goal: '',
      deadline: dayjs().valueOf(),
      time_consumed: 0,
      status: 'created',
      parent: now_viewing_task.value,
      position_x: 0,
      position_y: 0,
      suspended_type: null,
      suspended_info: null
    }
  }

  public static add_empty_task(): boolean {
    let task = task_api.get_empyt_task()
    return task_api.add_task(task)
  }

  public static add_task(task: tasks_db): boolean {
    task_api.task_buffer.set(task.id, {
      mutated: true,
      to_delete: false,
      value: task
    })
    nodes.value = [...nodes.value, {
      id: task.id.toString(),
      type: 'task',
      position: { x: task.position_x, y: task.position_y },
      data: {
        label: task.name,
        real_task: task.id
      },
      draggable: true,
      selectable: true
    }]
    is_modified.value = true
    return true
  }

  public static get_subtasks(id: timestamp): Promise<tasks_db[]> {
    return new Promise((resolve, reject) => {
      sql_api.select(`SELECT *
                      FROM tasks
                      WHERE parent = ${id};`)
        .then((res) => {
          res.forEach((value) => {
            task_api.task_buffer.set(value.id, {
              mutated: false,
              to_delete: false,
              value: value as tasks_db
            })
          })
          resolve(res as tasks_db[])
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  public static get_subtaks_from_buffer(id: timestamp): tasks_db[] {
    let res: tasks_db[] = []
    task_api.task_buffer.forEach((value, _key) => {
      if (value.value.parent === id) {
        res.push(value.value)
      }
    })
    return res
  }

  public static get_sibling_relations_from_buffer(id: timestamp): task_relation_db[] {
    let res: task_relation_db[] = []
    task_api.task_relation_buffer.forEach((value, _key) => {
      if (value.value.source === id || value.value.target === id) {
        res.push(value.value)
      }
    })
    return res
  }

  public static get_subtasks_relations_from_buffer(id: timestamp): task_relation_db[] {
    let subtasks_ids: Set<timestamp> = new Set()
    task_api.task_buffer.forEach((value, _key) => {
      if (value.value.parent === id) {
        subtasks_ids.add(value.value.id)
      }
    })

    let res: task_relation_db[] = []

    task_api.task_relation_buffer.forEach((value, _key) => {
      if ((subtasks_ids.has(value.value.source) || subtasks_ids.has(value.value.target)) && !value.to_delete) {
        res.push(value.value)
      }
    })
    return res
  }

  public static get_subtasks_relation_from_db(id: timestamp): Promise<task_relation_db[]> {
    return new Promise((resolve, reject) => {
      sql_api.select(`WITH RECURSIVE subtask_ids AS (SELECT id
                                                     FROM tasks
                                                     WHERE parent = ${id}
                                                     UNION ALL
                                                     SELECT t.id
                                                     FROM tasks t
                                                            INNER JOIN subtask_ids si ON t.parent = si.id)
                      SELECT tr.*
                      FROM tasks_relation tr
                             INNER JOIN subtask_ids si ON tr.source = si.id;`)
        .then((res) => {
          resolve(res as task_relation_db[])
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  // public static get_subtasks_relation_from_buffer(id: timestamp): task_relation_db[] {
  //   let res: task_relation_db[] = []
  //   task_api.task_relation_buffer.forEach((value, _key) => {
  //     if (value.value.source === id) {
  //       res.push(value.value)
  //     }
  //   })
  //   return res
  // }

  public static update_task(task: tasks_db): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      if (task_api.task_buffer.has(task.id)) {
        task_api.task_buffer.set(task.id, {
          mutated: true,
          to_delete: false,
          value: task
        })
        is_modified.value = true
      } else {
        task_api.task_buffer.set(task.id, {
          mutated: false,
          to_delete: false,
          value: task
        })
      }
      is_modified.value = true
      resolve(true)
    })
  }

  public static set_task_position(id: timestamp, x: number, y: number): boolean {
    if (task_api.task_buffer.has(id)) {
      let task = task_api.task_buffer.get(id)!
      task.value.position_x = x
      task.value.position_y = y
      task_api.task_buffer.set(id, {
        mutated: true,
        to_delete: false,
        value: task.value
      })
      is_modified.value = true
      return true
    } else {
      return false
    }
  }

  public static get_task_stack_family_tree(id: timestamp): Promise<tasks_db[]> {
    return new Promise((resolve, reject) => {
      sql_api.select(select_from_family_tree_sql(id))
        .then((res) => {
          res.forEach((value) => {
            task_api.task_buffer.set(value.id, {
              mutated: false,
              to_delete: false,
              value: value as tasks_db
            })
          })
          resolve(res as tasks_db[])
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  public static add_relation(source: timestamp, target: timestamp): boolean {
    task_api.task_relation_buffer.set(`${source}-${target}`, {
      mutated: true,
      to_delete: false,
      value: {
        id: `${source}-${target}`,
        source: source,
        target: target
      }
    })
    edges.value = [...edges.value, {
      id: `${source}-${target}`,
      source: source.toString(),
      target: target.toString(),
      sourceHandle: 'task-node-source',
      targetHandle: 'task-node-target',
      type: 'default_e',
      selected: false
    }]
    is_modified.value = true
    return true
  }

  public static delete_relation(source: timestamp, target: timestamp): boolean {
    if (task_api.task_relation_buffer.has(`${source}-${target}`)) {
      let relation = task_api.task_relation_buffer.get(`${source}-${target}`)!
      if (relation.mutated) {
        // task_api.task_relation_buffer.delete(`${source}-${target}`)
        relation.to_delete = true
        relation.mutated = false
      } else {
        relation.to_delete = true
        task_api.task_relation_buffer.set(`${source}-${target}`, relation)
      }
    } else {
      task_api.task_relation_buffer.set(`${source}-${target}`, {
        mutated: false,
        to_delete: true,
        value: {
          id: `${source}-${target}`,
          source: source,
          target: target
        }
      })
    }
    is_modified.value = true
    edges.value = edges.value.filter((value) => {
      return value.source !== source.toString() || value.target !== target.toString()
    })
    return true
  }

  public static flush_to_db(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let sqls: string[] = []
      task_api.task_buffer.forEach((value, _key) => {
        if (value.mutated) {
          sqls.push(insert_or_update_task_sql(value.value))
        } else if (value.to_delete) {
          sqls.push(`DELETE
                     FROM tasks
                     WHERE id = ${value.value.id};`)
        }
      })
      task_api.task_relation_buffer.forEach((value, _key) => {
        if (value.mutated) {
          sqls.push(`INSERT INTO tasks_relation (id, source, target)
                     VALUES ('${value.value.id}', ${value.value.source}, ${value.value.target})
                     ON CONFLICT (id) DO UPDATE
                       SET source = ${value.value.source},
                           target = ${value.value.target};`)
        } else {
          sqls.push(`DELETE
                     FROM tasks_relation
                     WHERE id = '${value.value.id}';`)
        }
      })
      sql_api.sqls_rt_bool(sqls).then((res) => {
        task_api.task_buffer.forEach((value, key) => {
          if (value.mutated) {
            task_api.task_buffer.set(key, {
              mutated: false,
              to_delete: false,
              value: value.value
            })
          }
          if (value.to_delete) {
            task_api.task_buffer.delete(key)
          }
        })
        task_api.task_relation_buffer.forEach((value, key) => {
          if (value.mutated) {
            task_api.task_relation_buffer.set(key, {
              mutated: false,
              to_delete: false,
              value: value.value
            })
          }
          if (value.to_delete) {
            task_api.task_relation_buffer.delete(key)
          }
        })
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  }

  static get_task_from_db(id: timestamp): Promise<tasks_db> {
    return new Promise((resolve, reject) => {
      sql_api.select(`SELECT *
                      FROM tasks
                      WHERE id = ${id};`)
        .then((res) => {
          if (res.length === 0) {
            reject(`No task with id ${id} found.`)
          } else {
            resolve(res[0] as tasks_db)
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  static set_task_to_db(task: tasks_db): Promise<boolean> {
    return sql_api.rt_bool(insert_or_update_task_sql(task))
  }

  public static get_task_from_buffer(id: timestamp): tasks_db {
    let task = task_api.task_buffer.get(id)
    if (task === undefined) {
      return task_api.get_empyt_task()
    } else {
      return task.value
    }
  }

  public static preload_task(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      sql_api.select(`SELECT *
                      FROM tasks`)
        .then((res) => {
          if (res.length === 0) {
            reject(`No task found.`)
          } else {
            res.forEach((value) => {
              task_api.task_buffer.set(value.id, {
                mutated: false,
                to_delete: false,
                value: value as tasks_db
              })
            })
            resolve(true)
          }
        })
        .catch((err) => {
          reject(err)
        })
      sql_api.select(`SELECT *
                      FROM tasks_relation`)
        .then((res) => {
          if (res.length === 0) {
            reject(`No task relation found.`)
          } else {
            res.forEach((value) => {
              task_api.task_relation_buffer.set(`${value.source}-${value.target}`, {
                mutated: false,
                to_delete: false,
                value: value as task_relation_db
              })
            })
            resolve(true)
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  private static get_subtasks_relation_from_buffer(id: timestamp) {
    let res: task_relation_db[] = []
    task_api.task_relation_buffer.forEach((value, _key) => {
      if (value.value.source === id) {
        res.push(value.value)
      }
    })
    return res
  }
}
