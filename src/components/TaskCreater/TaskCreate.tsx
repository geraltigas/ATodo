import {TextField, Typography} from '@mui/material';
import {DateCalendar, TimeClock} from '@mui/x-date-pickers';
import styles from './TaskCreater.module.css';
import dayjs from 'dayjs';
import {useAtom, useSetAtom} from "jotai";
import {isInputtingAtom, taskToEditAtom} from "../../state/tasksAtoms.ts";

export default function TaskCreate() {

    const [taskToEdit, setTaskToEdit] = useAtom(taskToEditAtom);
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
                                let task = {
                                    ...taskToEdit,
                                    name: e.target.value,
                                }
                                setTaskToEdit(task);
                            }
                        }
                        onFocus={() => setIsInputting(true)}
                        onBlur={() => setIsInputting(false)}
                    />
                    <TextField
                        label="Goal"
                        variant="outlined"
                        multiline
                        rows={7}
                        className={styles.input + ' ' + styles.textfield}
                        onChange={
                            (e) => {
                                let task = {
                                    ...taskToEdit,
                                    goal: e.target.value,
                                }

                                setTaskToEdit(task);
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
                            let task = {
                                ...taskToEdit,
                                date: e!.toString(),
                            }

                            setTaskToEdit(task);
                        }
                    }
                    className={styles.unselectable}
                    value={dayjs(taskToEdit.date)}
                />
                <div className={styles.TimeClock}>
                    <Typography
                        variant="h4"
                        gutterBottom
                        style={{
                            textAlign: 'center',
                            marginTop: '15px',
                        }}
                        className={styles.unselectable}
                    >
                        {dayjs(taskToEdit.time).format('HH:mm')}
                    </Typography>
                    <TimeClock
                        onChange={
                            (e) => {
                                let task = {
                                    ...taskToEdit,
                                    time: e!.toString(),
                                }
                                setTaskToEdit(task);
                            }
                        }
                        className={styles.unselectable}
                        value={dayjs(taskToEdit.time)}
                        views={['hours', 'minutes']}
                    />
                </div>
            </div>
        </div>
    );
}
