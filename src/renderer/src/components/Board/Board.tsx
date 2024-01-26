import styles from './Board.module.css'
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography } from '@mui/material'
import { DateCalendar } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import TimeClockWarp from '../TimeClock/TimeClockWarp'
import { tasks_db, timestamp } from '../../../../types/sql'
import { task_api } from '../../api/task_api'
import { Signal, useSignal, useSignalEffect } from '@preact/signals'
import { is_inputting } from '../../state/app'
import { timeConstraints } from './time_constraint_lib'
import {
  useOnDateChange,
  useOnGoalChange,
  useOnNameChange,
  useOnStatusChange,
  useSuspendedInfoView
} from './board_hooks'


export default function Board({ task_id_signal }: {
  task_id_signal: Signal<timestamp>
}) {

  let task_signal = useSignal(task_api.get_task_from_buffer(task_id_signal.value))

  useSignalEffect(() => {
    task_signal.value = task_api.get_task_from_buffer(task_id_signal.value)
  })

  const onNameChange = useOnNameChange(task_signal)
  const onGoalChange = useOnGoalChange(task_signal)
  const onDateChange = useOnDateChange(task_signal)
  const onStatusChange = useOnStatusChange(task_signal)

  let {
    minTime,
    maxTime,
    minDate,
    maxDate
  } = timeConstraints(task_signal.value)

  let suspendedInfo = useSuspendedInfoView(task_signal.value, task_signal, styles)

  return (
    <div className={styles.Board}>
      <TextField
        label={'Name'}
        variant={'outlined'}
        value={task_signal.value.name}
        onChange={onNameChange}
        className={styles.Name}
      />
      <TextField
        label="Goal"
        multiline
        rows={5}
        value={task_signal.value.goal}
        onChange={onGoalChange}
        onFocus={() => is_inputting.value = true}
        onBlur={() => is_inputting.value = false}
      />
      <DateCalendar
        onChange={onDateChange}
        value={dayjs(task_signal.value.deadline)}
        className={styles.DateCalendar}
        maxDate={maxDate}
        minDate={minDate}
      />
      <TimeClockWarp
        taskToEdit={task_id_signal.value}
        maxTime={maxTime}
        minTime={minTime}
      />
      <FormControl className={styles.FormControl}>
        <FormLabel>State</FormLabel>
        <RadioGroup
          value={task_signal.value.status}
          onChange={onStatusChange}
        >
          <FormControlLabel value={'created'} control={<Radio />} label={'Created'} />
          <FormControlLabel value={'in_progress'} control={<Radio />} label={'InProgress'} />
          <FormControlLabel value={'suspended'} control={<Radio />} label={'Suspended'} />
          <FormControlLabel value={'paused'} control={<Radio />} label={'Paused'} />
          <FormControlLabel value={'done'} control={<Radio />} label={'Done'} />
        </RadioGroup>
      </FormControl>
      {task_signal.value.status === 'suspended' &&
        <div>
          <FormControl className={styles.FormControl}>
            <FormLabel>Suspended Type</FormLabel>
            <RadioGroup
              value={task_signal.value.suspended_type}
              onChange={(e) => {
                // @ts-ignore
                const tmp = { ...task_signal.value, suspended_type: e.target.value } as tasks_db
                task_signal.value = tmp
                task_api.update_task(tmp).then(_r => {
                }).catch(e => {
                  console.log(e)
                })
              }}
            >
              <FormControlLabel value={'time'} control={<Radio />} label={'Time'} />
              <FormControlLabel value={'cyclical'} control={<Radio />}
                                label={'Cyclicality'} />
              <FormControlLabel value={'constructing'} control={<Radio />}
                                label={'Constructing'} />
              <FormControlLabel value={'email'} control={<Radio />} label={'Email'} />
              <FormControlLabel value={'unsupported'} control={<Radio />} label={'Undefined'} />
            </RadioGroup>
          </FormControl>
          <Typography variant={'h6'} className={styles.SuspendedInfo}>Suspended Info</Typography>
          {suspendedInfo}
        </div>
      }
      <div className={styles.footer}></div>
    </div>
  )
}
