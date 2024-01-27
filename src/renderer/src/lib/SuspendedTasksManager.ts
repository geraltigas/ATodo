import dayjs from 'dayjs'
import { CyclicalityTrigger, tasks_db, timestamp, TimeTrigger } from '../../../types/sql'
import { to_json, to_obj } from './serialize'
import { task_api } from '../api/task_api'

export class SuspendedTasksBuffer {
  private static intervalIds: Map<timestamp, NodeJS.Timeout> = new Map()

  public static init(suspenedTasks: tasks_db[]) {
    suspenedTasks.forEach((task) => {
      if (task.suspended_type === 'constructing') {// do nothing
      } else if (task.suspended_type === 'unsupported') {// do nothing
      } else if (task.suspended_type === 'email') {// TODO: add email trigger
      } else if (task.suspended_type === 'time') {
        let cb = () => {
          console.log('cb')
          if (dayjs().isAfter(dayjs((to_obj(task.suspended_type!) as TimeTrigger).time))) {
            console.log('time trigger')
            task.status = 'in_progress'
            task.suspended_info = null
            task.suspended_type = null
            task_api.update_task(task)
            let setIntervalId = SuspendedTasksBuffer.intervalIds.get(task.id)
            if (setIntervalId !== undefined) {
              clearInterval(setIntervalId)
            }
          }
          // TODO: update ui
        }
        if (SuspendedTasksBuffer.intervalIds.has(task.id)) {
          let setIntervalId = SuspendedTasksBuffer.intervalIds.get(task.id)
          clearInterval(setIntervalId)
        }
        let setIntervalId = setInterval(cb, 60 * 1000)
        SuspendedTasksBuffer.intervalIds.set(task.id, setIntervalId)
        cb()
      } else if (task.suspended_type === 'cyclical') {
        let cb = () => {
          console.log('cb')
          let trigger = (to_obj(task.suspended_type!) as CyclicalityTrigger)
          let lastTime = dayjs(trigger.lastTime)
          let nowAt = trigger.nowAt
          let interval = trigger.interval
          let now = dayjs()
          let nextTime = lastTime.add(interval.split(' ').filter((s) => s !== '').map((s) => parseInt(s))[nowAt], 'day')
          if (now.isAfter(nextTime)) {
            console.log('cyclicality trigger')
            task.status = 'in_progress'
            task.suspended_info = to_json({
              interval: interval,
              nowAt: (nowAt + 1) % interval.length,
              lastTime: now.format()
            })
            task_api.update_task(task)
            let setIntervalId = SuspendedTasksBuffer.intervalIds.get(task.id)
            if (setIntervalId !== undefined) {
              clearInterval(setIntervalId)
            }
          }
          // TODO: update ui
        }
        if (SuspendedTasksBuffer.intervalIds.has(task.id)) {
          let setIntervalId = SuspendedTasksBuffer.intervalIds.get(task.id)
          clearInterval(setIntervalId)
        }
        let setIntervalId = setInterval(cb, 60 * 1000)
        SuspendedTasksBuffer.intervalIds.set(task.id, setIntervalId)
        cb()
      } else {
      }
    })
  }
}

