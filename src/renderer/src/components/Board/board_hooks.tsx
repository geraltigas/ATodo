import React from 'react'
import { task_api } from '../../api/task_api'
import { useCallback } from 'preact/compat'
import dayjs, { Dayjs } from 'dayjs'
import { TextField } from '@mui/material'
import {
  ConstructingTrigger,
  CyclicalityTrigger,
  EmailTrigger,
  tasks_db,
  TimeTrigger,
  UnsupportedTrigger
} from '../../../../types/sql'
import { is_inputting } from '../../state/atodo'
import { DateCalendar, DatePicker, TimePicker } from '@mui/x-date-pickers'
import { Signal } from '@preact/signals'
import { to_json, to_obj } from '../../lib/serialize'

export const useOnNameChange = (task_signal) => {
  return useCallback((_e: React.ChangeEvent<HTMLInputElement>) => {
    let temp = { ...task_signal.value }
    temp.name = _e.target.value
    task_api.update_task(temp)
    task_signal.value = temp
  }, [task_signal])
}

export const useOnGoalChange = (task_signal) => {
  return useCallback((_e: React.ChangeEvent<HTMLInputElement>) => {
    let temp = { ...task_signal.value }
    temp.goal = _e.target.value
    task_api.update_task(temp)
    task_signal.value = temp
  }, [task_signal])
}

export const useOnDateChange = (task_signal) => {
  return useCallback((_date: Dayjs | null) => {
    if (_date === null) {
      return
    }
    let temp = { ...task_signal.value }
    temp.deadline = _date.valueOf()
    task_api.update_task(temp)
    task_signal.value = temp
  }, [task_signal])
}

export const useOnStatusChange = (task_signal) => {
  return useCallback((_e: React.ChangeEvent<HTMLInputElement>) => {
    let temp = { ...task_signal.value }
    // @ts-ignore
    temp.status = _e.target.value
    task_api.update_task(temp)
    task_signal.value = temp
  }, [task_signal])
}

export const useSuspendedInfoView = (show_task: tasks_db, task_signal: Signal<tasks_db>, styles) => {
  let suspendedInfo = (<div></div>)
  if (show_task.status === 'suspended') {
    switch (show_task.suspended_type) {
      case 'constructing':
        suspendedInfo = (<TextField
            label="Why"
            multiline
            rows={5}
            value={(() => {
              let tmp = (to_obj(show_task.suspended_info!) as ConstructingTrigger)
              if (tmp && tmp.why) {
                return tmp.why
              } else {
                return ''
              }
            })()}
            onChange={(e) => {
              show_task.suspended_info = to_json({
                why: e.target.value
              })
              task_signal.value = { ...show_task }
              task_api.update_task(show_task)
            }}
            className={styles.textField}
            onFocus={() => is_inputting.value = true}
            onBlur={() => is_inputting.value = false}
          />
        )
        break
      case 'time':
        let now = dayjs()
        let triggerTime: Dayjs = dayjs((() => {
          let tmp = (to_obj(show_task.suspended_info!) as TimeTrigger)
          if (tmp && tmp.time) {
            return tmp.time
          } else {
            return dayjs().valueOf()
          }
        })())
        let isFirstDay = triggerTime.isSame(now, 'day')
        let isLastDay = triggerTime.isSame(show_task.deadline, 'day')
        let minTime = isFirstDay ? now : undefined
        let maxTime = isLastDay ? dayjs(show_task.deadline) : undefined
        suspendedInfo = (
          <div>
            <DatePicker
              label="Date"
              minDate={now}
              maxDate={dayjs(show_task.deadline)}
              value={triggerTime}
              className={styles.marginTop}
              onChange={(date) => {
                show_task.suspended_info = to_json({
                  time: date!.toString()
                })
                task_signal.value = { ...show_task }
                task_api.update_task(show_task)
              }}
            />
            <TimePicker
              label="Time"
              value={triggerTime}
              minTime={minTime}
              maxTime={maxTime}
              className={styles.marginTop}
              onChange={(date) => {
                show_task.suspended_info = to_json({
                  time: date!.toString()
                })
                task_signal.value = { ...show_task }
                task_api.update_task(show_task)
              }}
            />
          </div>)
        break
      case 'email':
        suspendedInfo = (<TextField
            label="Email"
            multiline
            rows={5}
            value={(() => {
              let tmp = (to_obj(show_task.suspended_info!) as EmailTrigger)
              if (tmp && tmp.email) {
                return tmp.email
              } else {
                return ''
              }
            })()}
            className={styles.textField}
            onChange={(e) => {
              show_task.suspended_info = to_json({
                email: e.target.value
              })
              task_signal.value = { ...show_task }
              task_api.update_task(show_task)
            }}
            onFocus={() => is_inputting.value = true}
            onBlur={() => is_inputting.value = false}
          />
        )
        break
      case 'unsupported':
        suspendedInfo = (<TextField
            label="Why"
            multiline
            rows={5}
            className={styles.textField}
            value={(() => {
              let tmp = (to_obj(show_task.suspended_info!) as UnsupportedTrigger)
              if (tmp && tmp.why) {
                return tmp.why
              } else {
                return ''
              }
            })()}
            onChange={(e) => {
              show_task.suspended_info = to_json({
                why: e.target.value
              })
              task_signal.value = { ...show_task }
              task_api.update_task(show_task)
            }}
            onFocus={() => is_inputting.value = true}
            onBlur={() => is_inputting.value = false}
          />
        )
        break
      case 'cyclical':
        suspendedInfo = (
          <div>
            <DateCalendar
              onChange={(date) => {
                show_task.suspended_info = to_json({
                  lastTime: date!.hour(4).minute(0).second(0).toString()
                })
                task_signal.value = { ...show_task }
                task_api.update_task(show_task)
              }}
              value={(() => {
                let tmp = (to_obj(show_task.suspended_info!) as CyclicalityTrigger)
                if (tmp && tmp.lastTime) {
                  return dayjs(tmp.lastTime)
                } else {
                  return dayjs().hour(4).minute(0).second(0)
                }
              })()}
              className={styles.cycleDateCalendar}
            />
            <TextField
              label="Interval Days"
              multiline
              rows={5}
              className={styles.textField}
              value={(() => {
                let tmp = (to_obj(show_task.suspended_info!) as CyclicalityTrigger)
                if (tmp && tmp.interval) {
                  return tmp.interval
                } else {
                  return ''
                }
              })()}
              onChange={(e) => {
                // check if the input is valid : 1 2 3 4 5, only number and space
                let reg = /^[0-9 ]+$/
                if (!reg.test(e.target.value)) {
                  return
                }
                show_task.suspended_info = to_json({
                  interval: e.target.value,
                  nowAt: 0,
                  lastTime: dayjs().hour(4).minute(0).second(0).toString()
                })
                task_api.update_task(show_task)
              }}
              onFocus={() => is_inputting.value = true}
              onBlur={() => is_inputting.value = false}
            />
          </div>
        )
        break
      default:
        break
    }
  }
  return suspendedInfo
}
