import styles from './TaskShow.module.css'
import React from 'react'
import {tasks_db, timestamp} from '../../../../types/sql'
import {scheduled_tasks, tick, time_record, TimeRecord, WORKER_GLOBAL} from '../../state/worker'
import {task_api} from '../../api/task_api'
import {Button} from '@mui/material'
import {schedule} from '../../lib/Scheduler'
import {window_control_api} from '../../api/window_control_api'

let ringing_interval_id: NodeJS.Timeout
const RINGING_INTERVAL = 45 * 60 * 1000

export const from_timestamp_to_timerecord = (timestamp: number): TimeRecord => {
  let date = new Date(timestamp * 1000)
  let year = date.getFullYear() - 1970
  let month = date.getMonth()
  let day = date.getDate() - 1
  let hours = date.getHours() + year * 365 * 24 + month * 30 * 24 + day * 24 - 8
  return {
    hours: hours,
    minutes: date.getMinutes(),
    seconds: date.getSeconds()
  }
}

export const from_timerecord_to_timestamp = (timeRecord: TimeRecord): number => {
  let date = new Date()
  let raw_h = timeRecord.hours + 8
  let year = Math.floor(timeRecord.hours / (365 * 24))
  raw_h -= year * 365 * 24
  let month = Math.floor(raw_h / (30 * 24))
  raw_h -= month * 30 * 24
  let day = Math.floor(raw_h / 24)
  raw_h -= day * 24
  date.setFullYear(1970 + year)
  date.setMonth(month)
  date.setDate(day + 1)
  date.setHours(raw_h)
  date.setMinutes(timeRecord.minutes)
  date.setSeconds(timeRecord.seconds)
  return date.valueOf()
}

// export const openTaskBoardAndSave = (task: Task) => {
//     let str = stringify(appStoragePersistence);
//     invoke<string>("save", {key: "nowViewingTask", value: task.id}).then((res) => {
//         console.log(res)
//         invoke<string>("save", {key: "taskStorage", value: str}).then((res) => {
//             console.log(res)
//             invoke<string>("open_atodo").then((_res) => {
//                 invoke<string>("close_worker").then((_res) => {
//                 });
//             }).catch((err) => {
//                 console.log(err);
//             });
//         });
//     });
// }

const addTime = (base: timestamp, addTime: timestamp) => {
  return base + addTime
}

const minusTime = (base: timestamp, minusTime: timestamp) => {
  return base - minusTime
}

const isDone = (task: tasks_db): boolean => {
  let isDone: boolean = true
  let subtasks = task_api.get_subtasks_from_buffer(task.id)
  subtasks.forEach((subtask) => {
    if (subtask.status !== 'done') {
      isDone = false
    }
  })
  return isDone
}

const isSuspended = (task: tasks_db): boolean => {
  let isSuspended: boolean = true
  task_api.get_subtasks_from_buffer(task.parent).forEach((subtask) => {
    if (subtask.status !== 'suspended' && subtask.status !== 'done') {
      isSuspended = false
    }
  })
  return isSuspended
}

function TaskShow() {

  const showStart: boolean = scheduled_tasks.value[0].status === 'created' || scheduled_tasks.value[0].status === 'suspended' || scheduled_tasks.value[0].status === 'paused'
  const showInterrupt: boolean = scheduled_tasks.value[0].status === 'in_progress'
  const showPause: boolean = scheduled_tasks.value[0].status === 'in_progress'
  const showDone: boolean = scheduled_tasks.value[0].status === 'in_progress'

  const onStartClick = (_event: React.MouseEvent<HTMLButtonElement>) => {
    let temp: tasks_db | null = scheduled_tasks.value[0]
    temp.status = 'in_progress'
    task_api.update_task(temp)
    while (temp.parent !== -1) {
      temp.status = 'in_progress'
      task_api.update_task(temp)
      temp = task_api.get_task_from_buffer(temp.parent)
    }
    tick.value = true
    schedule()
    task_api.flush_to_db().then((_r) => {
    }).catch((err) => {
      console.log(err)
    })
    ringing_interval_id = setInterval(() => {
      WORKER_GLOBAL.ringing_audio!.play()
      window_control_api.show_notification('Time to take a break!', `You have been working for ${RINGING_INTERVAL / 60 / 1000} minutes!`)
    }, RINGING_INTERVAL)
  }

  const onSuspendClick = (_event: React.MouseEvent<HTMLButtonElement>) => {
    let temp: tasks_db = scheduled_tasks.value[0]
    temp.status = 'suspended'
    let delta: timestamp = minusTime(time_record.value, temp.time_consumed)
    temp.time_consumed = time_record.value
    task_api.update_task(temp)
    while (temp.parent !== -1) {
      let parent = task_api.get_task_from_buffer(temp.parent)
      if (isSuspended(parent)) {
        parent.status = 'suspended'
      }
      parent.time_consumed = addTime(parent.time_consumed, delta)
      task_api.update_task(parent)
      temp = parent
    }
    window_control_api.edit_suspened_task(scheduled_tasks.value[0].id)
    task_api.flush_to_db().then((_r) => {
    }).catch((err) => {
      console.log(err)
    })
    clearInterval(ringing_interval_id)
  }

  const onPauseClick = (_event: React.MouseEvent<HTMLButtonElement>) => {
    let temp: tasks_db = scheduled_tasks.value[0]
    temp.status = 'paused'
    let delta: timestamp = minusTime(time_record.value, temp.time_consumed)
    temp.time_consumed = time_record.value
    task_api.update_task(temp)
    while (temp.parent !== -1) {
      let parent = task_api.get_task_from_buffer(temp.parent)
      parent.status = 'paused'
      parent.time_consumed = addTime(parent.time_consumed, delta)
      task_api.update_task(parent)
      temp = parent
    }
    tick.value = false
    schedule()
    task_api.flush_to_db().then((_r) => {
    }).catch((err) => {
      console.log(err)
    })
    clearInterval(ringing_interval_id)
  }

  const onDoneClick = (_event: React.MouseEvent<HTMLButtonElement>) => {
    let temp: tasks_db = scheduled_tasks.value[0]
    temp.status = 'done'
    let delta: timestamp = minusTime(time_record.value, temp.time_consumed)
    temp.time_consumed = time_record.value
    task_api.update_task(temp)
    while (temp.parent !== -1) {
      let parent = task_api.get_task_from_buffer(temp.parent)
      if (isDone(parent)) {
        parent.status = 'done'
      }
      parent.time_consumed = addTime(parent.time_consumed, delta)
      task_api.update_task(parent)
      temp = parent
    }
    schedule()
    task_api.flush_to_db().then((_r) => {
    }).catch((err) => {
      console.log(err)
    })
  }

  return (
    <div>
            <pre className={styles.showGoal}>
                {scheduled_tasks.value[0].goal}
            </pre>
      <div className={styles.buttons}>
        {showStart &&
          <Button size="small" variant="contained" color="primary" onClick={onStartClick}>Start</Button>}
        {showInterrupt &&
          <Button size="small" variant="contained" color="error" onClick={onSuspendClick}>Suspend</Button>}
        {showPause && <Button size="small" variant="contained" onClick={onPauseClick}>Pause</Button>}
        {showDone &&
          <Button size="small" variant="contained" color="success" onClick={onDoneClick}>Done</Button>}
      </div>
    </div>
  )
}

export default TaskShow
