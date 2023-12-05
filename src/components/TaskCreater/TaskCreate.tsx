import {TextField, Typography} from '@mui/material';
import {DateCalendar, TimeClock} from '@mui/x-date-pickers';
import styles from './TaskCreater.module.css';
import dayjs from 'dayjs';
import {useAtom, useSetAtom} from "jotai";
import {isInputtingAtom, nowSelectedAtom, Task} from "../../state/tasksAtoms.ts";

export default function TaskCreate() {

    const [taskToEdit, setTaskToEdit] = useAtom(nowSelectedAtom);
    const setIsInputting = useSetAtom(isInputtingAtom);

    return (
        <div className={styles.card}>
            <div className={styles.left}>
                <Typography variant="h3" gutterBottom className={styles.title}>
                    {' '}
                    Add Task
                </Typography>
                <div className={styles.description}>
                    <TextField
                        label="Name"
                        variant="outlined"
                        className={styles.input}
                        onChange={
                            (e) => {
                                let task = {...taskToEdit.reference, name: e.target.value} as Task;
                                setTaskToEdit({
                                    type: 'node',
                                    reference: task,
                                });
                            }
                        }
                        onFocus={() => setIsInputting(true)}
                        onBlur={() => setIsInputting(false)}
                    />
                    <TextField
                        label="Goal"
                        multiline
                        rows={7}
                        className={styles.input + ' ' + styles.textfield}
                        onChange={
                            (e) => {
                                let task = {...taskToEdit.reference, goal: e.target.value} as Task;
                                setTaskToEdit({
                                    type: 'node',
                                    reference: task,
                                });
                            }
                        }
                        onFocus={() => setIsInputting(true)}
                        onBlur={() => setIsInputting(false)}
                    />
                </div>
            </div>

            <div className={styles.right}>
                <DateCalendar
                    onChange={
                        (e) => {
                            let task = {...taskToEdit.reference, date: e!.toString()} as Task;
                            setTaskToEdit({
                                type: 'node',
                                reference: task,
                            });
                        }
                    }
                    value={dayjs((taskToEdit.reference! as Task).date)}
                />
                <div className={styles.TimeClock}>
                    <Typography
                        variant="h4"
                        gutterBottom
                        style={{
                            textAlign: 'center',
                            marginTop: '15px',
                        }}
                    >
                        {dayjs((taskToEdit.reference! as Task).time).format('HH:mm')}
                    </Typography>
                    <TimeClock
                        onChange={
                            (e) => {
                                let task = {...taskToEdit.reference, time: e!.toString()} as Task;
                                setTaskToEdit({
                                    type: 'node',
                                    reference: task,
                                });
                            }
                        }
                        value={dayjs((taskToEdit.reference! as Task).time)}
                        views={['hours', 'minutes']}
                    />
                </div>
            </div>
        </div>
    );
}
