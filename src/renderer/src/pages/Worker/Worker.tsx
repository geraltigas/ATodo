import styles from './Worker.module.css'
// import { appStateAtom, scheduledTasksAtom, windowSizeAtom } from '../../state/tasksAtom'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
// import {Task, TaskStatus, TimeRecord} from "../../../atodo/state/tasksAtoms";
import { use_event_worker, useOnMouseEnter, useOnMouseLeave } from '../../hooks/use_event_worker'
import SuspendedTasks from '../../components/SuspendedTasks/SuspendedTasks'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import { use_init_data, use_observe_window_size } from './worker_hooks'
import { scheduled_tasks } from '../../state/worker'
import { useSignal } from '@preact/signals'
import TaskShow from '../../components/TaskShow/TaskShow'
import { ShowTime } from '../../components/ShowTime/ShowTime'

// const time_record_tick = (timeRecord: timestamp) => {
//   time_record.value = timeRecord + 1
// }
//
// let timeOutId: NodeJS.Timeout[] = []
// let lastTask: tasks_db | null = null


const Worker = () => {

  use_init_data()
  use_event_worker()
  use_observe_window_size()

  let show_task = useSignal(false)
  let show_suspended_tasks = useSignal(false)
  const onMouseEnter = useOnMouseEnter()
  const onMouseLeave = useOnMouseLeave()


  const expendOnClick = () => {
    show_task.value = !show_task.value
  }

  const toggleShowSuspendedTasks = () => {
    show_suspended_tasks.value = !show_suspended_tasks.value
  }

  return (
    <div className={styles.container} id={'window_size_observe'} onMouseLeave={onMouseLeave}
         onMouseEnter={onMouseEnter}>
      <div className={styles.taskShow}>
        <div className={styles.leftShow}>
          {scheduled_tasks.value.length !== 0 && <div className={styles.taskFont + ' ' + styles.app_drag}>
            {scheduled_tasks.value[0].name}
          </div>}
          {scheduled_tasks.value.length !== 0 && <ShowTime />}
          {scheduled_tasks.value.length === 0 && <div className={styles.app_drag}>You are free?</div>}
        </div>
        <div className={styles.rightButtons}>
          <div onClick={toggleShowSuspendedTasks} className={styles.expand}>
            <FormatListBulletedIcon />
          </div>
          <div onClick={expendOnClick} className={styles.expand}>
            {show_task.value ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
          </div>
        </div>
      </div>
      {show_task.value && scheduled_tasks.value.length !== 0 &&
        <TaskShow />}
      {show_suspended_tasks.value && <SuspendedTasks />}
    </div>
  )
}

export default Worker
