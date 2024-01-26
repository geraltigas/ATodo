import { app_state_db, timestamp } from '../../../types/sql'
import { sql_api } from './sql_api'
import { task_api } from './task_api'
import { task_stack } from '../state/app'

export class app_state_api {
  public static get_root_task(): Promise<timestamp> {
    return new Promise((resolve, reject) => {
      sql_api.select(`SELECT *
                      FROM app_state
                      WHERE id = 0;`)
        .then((res) => {
          resolve((res[0] as app_state_db).root_task)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  public static set_root_task(id: timestamp): Promise<boolean> {
    return sql_api.rt_bool(`UPDATE app_state
                            SET root_task = ${id}
                            WHERE id = 0;`)
  }

  public static get_now_viewing_task(): Promise<timestamp> {
    return new Promise((resolve, reject) => {
      sql_api.select(`SELECT *
                      FROM app_state
                      WHERE id = 0;`)
        .then((res) => {
          resolve((res[0] as app_state_db).now_viewing_task)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  public static set_now_viewing_task(id: timestamp): Promise<boolean> {
    return sql_api.rt_bool(`UPDATE app_state
                            SET now_viewing_task = ${id}
                            WHERE id = 0;`)
  }

  public static set_task_stack(now_viewing_task: timestamp) {
    let ids: timestamp[] = []
    task_api.get_task_stack_family_tree(now_viewing_task).then((res) => {
      res.forEach((value) => {
        ids.push(value.id)
      })
      task_stack.value = ids
    }).catch((err) => {
      console.log(err)
    })
  }
}
