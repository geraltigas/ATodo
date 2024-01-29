// import {suspendedTasksAtom} from "../../state/tasksAtom.ts";
// import {Task} from "../../../atodo/state/tasksAtoms";
import styles from './SuspendedTasks.module.css'
import {window_control_api} from '../../api/window_control_api'
import {tasks_db} from '../../../../types/sql'
import {suspended_tasks} from '../../state/worker'
import {to_obj} from '../../lib/serialize'

const SuspendedTasks = () => {

  const onClick = (task: tasks_db) => {
    return (_e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      window_control_api.edit_suspened_task(task.id)
    }
  }

  return (
    <div className={styles.SuspendedTasks}>
      {suspended_tasks.value.map((task, index) => {
        return (
          <div key={index} onClick={onClick(task)} className={styles.card}>
            <div className={styles.fontOneLine}>
              <pre className={styles.redFont + ' ' + styles.noMargin}>{task.name}:</pre>
              <pre className={styles.noMargin}>{task.suspended_type}</pre>
            </div>
            {Object.entries(to_obj(task.suspended_info!) as any).map(([key, value], index) => {
              return (
                <div key={index} className={styles.fontOneLine}>
                  <pre className={styles.redFont + ' ' + styles.noMargin}>{key}:</pre>
                  <pre className={styles.noMargin}>{value!.toString()}</pre>
                </div>
              )
            })}
          </div>
        )
      })}
      {suspended_tasks.value.length === 0 && <div>no suspended tasks</div>}
    </div>
  )
}

export default SuspendedTasks
