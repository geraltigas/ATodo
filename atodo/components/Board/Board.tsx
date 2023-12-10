import styles from './Board.module.css';
import React from 'react';
import {TextField} from '@mui/material';
import {DateCalendar} from '@mui/x-date-pickers';
import dayjs, {Dayjs} from 'dayjs';
import {useSetAtom} from "jotai";
import {isInputtingAtom, Task} from "../../state/tasksAtoms.ts";
import TimeClockWarp from "../TimeClock/TimeClockWarp.tsx";

export default function Board({
                                  showTask,
                                  setShowTask
                              }: {
    showTask: Task,
    setShowTask: (task: Task) => void
}) {

    // const [showTask, setShowTask] = useAtom(nowSelectedAtom);
    const setIsInputting = useSetAtom(isInputtingAtom);

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowTask({
            ...showTask,
            name: e.target.value,
        })
    };

    const onGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowTask({
            ...showTask,
            goal: e.target.value,
        })
    };

    const onDateChange = (date: Dayjs | null) => {
        let time = dayjs(showTask.deadline);
        setShowTask({
            ...showTask,
            deadline: date!.set('hour', time.hour()).set('minute', time.minute()).set('second', 0).toString(),
        })
    };

    return (
        <div className={styles.Board}>
            <TextField
                label={'Name'}
                variant={'outlined'}
                // defaultValue={(showTask.reference! as Task).name}
                value={(showTask).name}
                onChange={onNameChange}
                onFocus={() => setIsInputting(true)}
                onBlur={() => setIsInputting(false)}
            />
            <TextField
                label="Goal"
                multiline
                rows={5}
                // defaultValue={(showTask.reference! as Task).goal}
                value={(showTask).goal}
                onChange={onGoalChange}

                onFocus={() => setIsInputting(true)}
                onBlur={() => setIsInputting(false)}
            />
            <DateCalendar
                onChange={onDateChange}
                value={dayjs((showTask).deadline)}
                className={styles.DateCalendar}
            />
            {/*<div>*/}
            {/*    <Typography*/}
            {/*        variant="h5"*/}
            {/*        gutterBottom*/}
            {/*        style={{*/}
            {/*            textAlign: 'center',*/}
            {/*            marginBottom: '0',*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        {dayjs((showTask as Task).time).format('HH:mm')}*/}
            {/*    </Typography>*/}
            {/*    <TimeClock*/}
            {/*        onChange={onTimeChange}*/}
            {/*        // defaultValue={dayjs((showTask.reference! as Task).time)}*/}
            {/*        value={dayjs((showTask as Task).time)}*/}
            {/*        views={['hours', 'minutes']}*/}
            {/*    />*/}
            {/*</div>*/}
            <TimeClockWarp taskToEdit={showTask} setTaskToEdit={setShowTask}/>
        </div>
    );
}
