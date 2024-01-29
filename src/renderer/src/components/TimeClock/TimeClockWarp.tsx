import {useState} from 'react'
import {TimeClock} from '@mui/x-date-pickers'
import styles from './TimeClockWarp.module.css'
import dayjs, {Dayjs} from 'dayjs'
import {tasks_db} from '../../../../types/sql'
import {task_api} from '../../api/task_api'
import {Signal} from '@preact/signals'

export default function TimeClockWarp({taskToEdit, maxTime, minTime}: {
  taskToEdit: Signal<tasks_db>,
  maxTime: Dayjs | undefined,
  minTime: Dayjs | undefined,
}) {
  const [view, setView] = useState<'hours' | 'minutes'>('hours')

  // const task_to_edit =

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
          {dayjs(taskToEdit.value.deadline).format('HH')}
        </div>
        :
        <div onClick={() => setView('minutes')} className={styles.unselectable}>
          {dayjs(taskToEdit.value.deadline).format('mm')}
        </div>
      </div>
      <TimeClock
        onChange={
          (e) => {
            let date = dayjs(taskToEdit.value.deadline)
            taskToEdit.value = {
              ...taskToEdit.value,
              deadline: date.set('hour', e.hour()).set('minute', e.minute()).set('second', 0).valueOf()
            }
            task_api.update_task(taskToEdit.value)
          }
        }
        className={styles.unselectable}
        value={dayjs(taskToEdit.value.deadline)}
        views={['hours', 'minutes']}
        view={view}
        ampm={false}
        maxTime={maxTime}
        minTime={minTime}
      />
    </div>
  )
}
