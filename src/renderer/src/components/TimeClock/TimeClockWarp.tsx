import { useState } from 'react'
import { TimeClock } from '@mui/x-date-pickers'
import styles from './TimeClockWarp.module.css'
import dayjs, { Dayjs } from 'dayjs'
import { tasks_db, timestamp } from '../../../../types/sql'
import { task_api } from '../../api/task_api'
import { useSignal } from '@preact/signals'

export default function TimeClockWarp({ taskToEdit, maxTime, minTime }: {
  taskToEdit: timestamp,
  maxTime: Dayjs | undefined,
  minTime: Dayjs | undefined,
}) {
  const [view, setView] = useState<'hours' | 'minutes'>('hours')

  const task_to_edit = useSignal<tasks_db>(task_api.get_task_from_buffer(taskToEdit))

  return (
    <div className={styles.TimeClock}>
      <div
        style={{
          marginTop: '15px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          fontSize: '2rem'
        }}
        className={styles.unselectable}
      >
        <div onClick={() => setView('hours')} className={styles.unselectable}>
          {dayjs(task_to_edit.value.deadline).format('HH')}
        </div>
        :
        <div onClick={() => setView('minutes')} className={styles.unselectable}>
          {dayjs(task_to_edit.value.deadline).format('HH')}
        </div>
      </div>
      <TimeClock
        onChange={
          (_e) => {
            let date = dayjs(task_to_edit.value.deadline)

            task_to_edit.value = {
              ...task_to_edit.value,
              deadline: date.set('hour', _e!.hour()).set('minute', _e!.minute()).set('second', 0).valueOf()
            }
            task_api.update_task(task_to_edit.value).then(_r => {
            })
          }
        }
        className={styles.unselectable}
        value={dayjs(task_to_edit.value.deadline)}
        views={['hours', 'minutes']}
        view={view}
        ampm={false}
        maxTime={maxTime}
        minTime={minTime}
      />
    </div>
  )
}
