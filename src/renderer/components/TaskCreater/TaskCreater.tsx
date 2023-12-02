import { TextField, Typography } from '@mui/material';
import { DateCalendar, TimeClock } from '@mui/x-date-pickers';
import React from 'react';
import styles from './TaskCreater.module.css';
import { Task } from '../../lib/task/Task';

export default function TaskCreater(
  {
    taskToEdit,
    setTaskToEdit,
    setIsInputing
  }: {
    taskToEdit: Task,
    setTaskToEdit: React.Dispatch<React.SetStateAction<Task>>,
    setIsInputing: React.Dispatch<React.SetStateAction<boolean>>
  }) {

  // const [isInputing, setIsInputing] = useAtom(isInputingAtom);

  // const [taskToEdit, setTaskToEdit] = useAtom(taskToEditAtom);

  // const [name, setName] = React.useState('');
  // const [goal, setGoal] = React.useState('');
  // const [date, setDate] = React.useState<Dayjs | null>(dayjs());
  // const [time, setTime] = React.useState<Dayjs | null>(dayjs());

  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <Typography variant='h3' gutterBottom className={styles.title}> Add
          Task
        </Typography>
        <div className={styles.description}>
          <TextField label='Name' variant='outlined' className={styles.input}
                     onChange={(e) => setTaskToEdit({ ...taskToEdit, name: e.target.value })}
                     onFocus={() => setIsInputing(true)}
                     onBlur={() => setIsInputing(false)} />
          <TextField
            label='Goal'
            multiline
            rows={7}
            className={styles.input + ' ' + styles.textfield}
            onChange={(e) => setTaskToEdit({ ...taskToEdit, goal: e.target.value })}
            onFocus={() => setIsInputing(true)}
            onBlur={() => setIsInputing(false)}
          />
        </div>
      </div>

      <div className={styles.right}>
        <DateCalendar onChange={(e) => {
          setTaskToEdit({ ...taskToEdit, date: e });
        }}
                      value={taskToEdit.date} />
        <div className={styles.TimeClock}>
          <Typography variant='h4' gutterBottom style={{
            textAlign: 'center',
            marginTop: '15px'
          }}>
            {taskToEdit.time!.format('HH:mm')}
          </Typography>
          <TimeClock
            onChange={(e) => {
              setTaskToEdit({ ...taskToEdit, time: e });
            }
            }
            value={taskToEdit.time}
            views={['hours', 'minutes']} />
        </div>

      </div>
    </div>
  );
}
