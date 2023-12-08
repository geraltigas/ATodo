import dayjs from "dayjs";
import {Task} from "../../state/tasksAtoms.ts";
import {useState} from "react";
import {TimeClock} from "@mui/x-date-pickers";
import styles from "./TimeClockWarp.module.css";

export default function TimeClockWarp({
                                          taskToEdit,
                                          setTaskToEdit,
                                      }: {
    taskToEdit: Task,
    setTaskToEdit: (task: Task) => void
}) {
    const [view, setView] = useState<'hours' | 'minutes'>('hours');

    return (
        <div className={styles.TimeClock}>
            <div
                style={{
                    marginTop: '15px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    fontSize: '2rem',
                }}
                className={styles.unselectable}
            >
                <div onClick={() => setView('hours')} className={styles.unselectable}>
                    {dayjs(taskToEdit.time).format('HH')}
                </div>
                :
                <div onClick={() => setView('minutes')} className={styles.unselectable}>
                    {dayjs(taskToEdit.time).format('mm')}
                </div>
            </div>
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
                view={view}
                ampm={false}
            />
        </div>
    )
}