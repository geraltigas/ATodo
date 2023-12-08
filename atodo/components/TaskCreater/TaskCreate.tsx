import {TextField, Typography} from '@mui/material';
import {DateCalendar} from '@mui/x-date-pickers';
import styles from './TaskCreater.module.css';
import dayjs from 'dayjs';
import {useAtom, useSetAtom} from "jotai";
import {isInputtingAtom, taskToEditAtom} from "../../state/tasksAtoms.ts";
import TimeClockWarp from "../TimeClock/TimeClockWarp.tsx";

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
                <TimeClockWarp taskToEdit={taskToEdit} setTaskToEdit={setTaskToEdit}/>
            </div>
        </div>
    );
}
