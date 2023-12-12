import dayjs, {Dayjs} from "dayjs";
import {Task} from "../../state/tasksAtoms.ts";
import {useState} from "react";
import {TimeClock} from "@mui/x-date-pickers";
import styles from "./TimeClockWarp.module.css";

export default function TimeClockWarp({
                                          taskToEdit,
                                          setTaskToEdit,
                                          maxTime,
                                          minTime,
                                      }: {
    taskToEdit: Task,
    setTaskToEdit: (task: Task) => void,
    maxTime: Dayjs | undefined,
    minTime: Dayjs | undefined,
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
                    {dayjs(taskToEdit.deadline).format('HH')}
                </div>
                :
                <div onClick={() => setView('minutes')} className={styles.unselectable}>
                    {dayjs(taskToEdit.deadline).format('mm')}
                </div>
            </div>
            <TimeClock
                onChange={
                    (e) => {
                        let date = dayjs(taskToEdit.deadline);
                        let task = {
                            ...taskToEdit,
                            deadline: date.set('hour', e!.hour()).set('minute', e!.minute()).set('second', 0).toString(),
                        }
                        setTaskToEdit(task);
                    }
                }
                className={styles.unselectable}
                value={dayjs(taskToEdit.deadline)}
                views={['hours', 'minutes']}
                view={view}
                ampm={false}
                maxTime={maxTime}
                minTime={minTime}
            />
        </div>
    )
}