import { tasks_db, timestamp } from '../types/sql'

export enum sql_type {
  select,
  insert,
  update,
  delete
}

export const task_sql = (type: sql_type, task: tasks_db): string => {
  switch (type) {
    case sql_type.select:
      return `select *
              from tasks
              where id = ${task.id}`
    case sql_type.insert:
      return `insert into tasks
              values (${task.id}, ${task.root_task}, "${task.name}", "${task.goal}", ${task.deadline},
                      ${task.time_consumed}, "${task.status}", ${task.parent}, ${task.position_x}, ${task.position_y},
                      ${task.suspended_type ? `"${task.suspended_type}"` : null},
                      ${task.suspended_info ? `"${task.suspended_info}"` : null})`
    case sql_type.update:
      return `update tasks
              set root_task      = ${task.root_task},
                  name           = "${task.name}",
                  goal           = "${task.goal}",
                  deadline       = ${task.deadline},
                  time_consumed  = ${task.time_consumed},
                  status         = "${task.status}",
                  parent         = ${task.parent},
                  position_x     = ${task.position_x},
                  position_y     = ${task.position_y},
                  suspended_type = ${task.suspended_type ? `"${task.suspended_type}"` : null},
                  suspended_info = ${task.suspended_info ? `"${task.suspended_info}"` : null}
              where id = ${task.id}`
    case sql_type.delete:
      return `delete
              from tasks
              where id = ${task.id}`
  }
}

export const insert_task_sql = (task: tasks_db): string => {
  return `insert into tasks
          values (${task.id}, ${task.root_task}, "${task.name}", "${task.goal}", ${task.deadline},
                  ${task.time_consumed}, "${task.status}", ${task.parent}, ${task.position_x}, ${task.position_y},
                  ${task.suspended_type ? `"${task.suspended_type}"` : null},
                  ${task.suspended_info ? `"${task.suspended_info}"` : null})`
}

export const insert_or_update_task_sql = (task: tasks_db): string => {
  return `insert into tasks
          values (${task.id}, ${task.root_task}, "${task.name}", "${task.goal}", ${task.deadline},
                  ${task.time_consumed}, "${task.status}", ${task.parent}, ${task.position_x}, ${task.position_y},
                  ${task.suspended_type ? `"${task.suspended_type}"` : null},
                  ${task.suspended_info ? `"${task.suspended_info}"` : null})
          on conflict(id) do update set root_task      = ${task.root_task},
                                        name           = "${task.name}",
                                        goal           = "${task.goal}",
                                        deadline       = ${task.deadline},
                                        time_consumed  = ${task.time_consumed},
                                        status         = "${task.status}",
                                        parent         = ${task.parent},
                                        position_x     = ${task.position_x},
                                        position_y     = ${task.position_y},
                                        suspended_type = ${task.suspended_type ? `"${task.suspended_type}"` : null},
                                        suspended_info = ${task.suspended_info ? `"${task.suspended_info}"` : null}`
}

export const select_task_sql = (id: number): string => {
  return `select *
          from tasks
          where id = ${id}`
}

export const update_task_sql = (task: tasks_db): string => {
  return `update tasks
          set root_task      = ${task.root_task},
              name           = "${task.name}",
              goal           = "${task.goal}",
              deadline       = ${task.deadline},
              time_consumed  = ${task.time_consumed},
              status         = "${task.status}",
              parent         = ${task.parent},
              position_x     = ${task.position_x},
              position_y     = ${task.position_y},
              suspended_type = ${task.suspended_type ? `"${task.suspended_type}"` : null},
              suspended_info = ${task.suspended_info ? `"${task.suspended_info}"` : null}
          where id = ${task.id}`
}

export const select_from_family_tree_sql = (now_viewing_task_id: timestamp): string => {
  return `WITH RECURSIVE family_tree AS (SELECT *
                                         FROM tasks
                                         WHERE id = ${now_viewing_task_id} -- Replace with the current task's ID
                                         UNION
                                         SELECT tasks.*
                                         FROM tasks
                                                INNER JOIN family_tree ON tasks.id = family_tree.parent)
          SELECT *
          FROM family_tree;`
}
