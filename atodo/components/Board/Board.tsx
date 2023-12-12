import styles from './Board.module.css';
import React from 'react';
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField} from '@mui/material';
import {DateCalendar} from '@mui/x-date-pickers';
import dayjs, {Dayjs} from 'dayjs';
import {useAtomValue, useSetAtom} from "jotai";
import {isInputtingAtom, nowViewingAtom, Task, TaskStatus} from "../../state/tasksAtoms.ts";
import TimeClockWarp from "../TimeClock/TimeClockWarp.tsx";

export default function Board({
                                  showTask,
                                  setShowTask
                              }: {
    showTask: Task,
    setShowTask: (task: Task) => void
}) {

    const setIsInputting = useSetAtom(isInputtingAtom);
    const nowViewing = useAtomValue(nowViewingAtom);

    const nowViewingBoardDeadline: Dayjs | undefined = nowViewing.parent ? dayjs(nowViewing.parent.deadline) : undefined;

    const isLastDay: boolean = dayjs(showTask.deadline).isSame(dayjs(nowViewing.deadline), 'day');

    const isNowViewingBoard: boolean = nowViewing.id === showTask.id;

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

    const onStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowTask({
            ...showTask,
            status: e.target.value as TaskStatus,
        })
    }

    return (
        <div className={styles.Board}>
            <TextField
                label={'Name'}
                variant={'outlined'}
                value={(showTask).name}
                onChange={onNameChange}
                onFocus={() => setIsInputting(true)}
                onBlur={() => setIsInputting(false)}
            />
            <TextField
                label="Goal"
                multiline
                rows={5}
                value={(showTask).goal}
                onChange={onGoalChange}

                onFocus={() => setIsInputting(true)}
                onBlur={() => setIsInputting(false)}
            />
            <DateCalendar
                onChange={onDateChange}
                value={dayjs((showTask).deadline)}
                className={styles.DateCalendar}
                maxDate={isNowViewingBoard ? nowViewingBoardDeadline : dayjs(nowViewing.deadline)}
            />
            <TimeClockWarp taskToEdit={showTask} setTaskToEdit={setShowTask}
                           maxTime={isLastDay ? dayjs(nowViewing.deadline) : undefined}/>
            <FormControl className={styles.FormControl}>
                <FormLabel>State</FormLabel>
                <RadioGroup
                    value={showTask.status}
                    onChange={onStatusChange}
                >
                    <FormControlLabel value={TaskStatus.Created} control={<Radio/>} label={"Created"}/>
                    <FormControlLabel value={TaskStatus.InProgress} control={<Radio/>} label={"InProgress"}/>
                    <FormControlLabel value={TaskStatus.Suspended} control={<Radio/>} label={"Suspended"}/>
                    <FormControlLabel value={TaskStatus.Paused} control={<Radio/>} label={"Paused"}/>
                    <FormControlLabel value={TaskStatus.Done} control={<Radio/>} label={"Done"}/>
                </RadioGroup>
            </FormControl>
        </div>
    );
}
