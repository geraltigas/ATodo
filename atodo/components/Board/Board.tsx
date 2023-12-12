import styles from './Board.module.css';
import React from 'react';
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField} from '@mui/material';
import {DateCalendar} from '@mui/x-date-pickers';
import dayjs, {Dayjs} from 'dayjs';
import {useAtomValue, useSetAtom} from "jotai";
import {isInputtingAtom, nowViewingAtom, Task, TaskStatus} from "../../state/tasksAtoms.ts";
import TimeClockWarp from "../TimeClock/TimeClockWarp.tsx";

const globalMinDate = dayjs('1970-01-01T00:00:00');
const globalMaxDate = dayjs('2100-01-01T00:00:00');

// make sure the length of tasks is greater than 0
const getMaxDate = (tasks: Task[]): Dayjs => {
    if (tasks.length === 0) {
        return globalMinDate;
    }
    let maxDate: Dayjs = dayjs(tasks[0].deadline);
    tasks.forEach((task) => {
        let taskDate = dayjs(task.deadline);
        if (taskDate.isAfter(maxDate)) {
            maxDate = taskDate;
        }
    });
    return maxDate;
}

const getMinDate = (tasks: Task[]): Dayjs => {
    if (tasks.length === 0) {
        return globalMaxDate;
    }
    let minDate: Dayjs = dayjs(tasks[0].deadline);
    tasks.forEach((task) => {
        let taskDate = dayjs(task.deadline);
        if (taskDate.isBefore(minDate)) {
            minDate = taskDate;
        }
    });
    return minDate;
}

const getMinTime = (showTaskDeadline: Dayjs, minDate: Dayjs): Dayjs | undefined => {
    let isFirstDay = showTaskDeadline.isSame(minDate, 'day');
    if (isFirstDay) {
        return minDate;
    } else {
        return undefined;
    }
}

const getMaxTime = (showTaskDeadline: Dayjs, maxDate: Dayjs): Dayjs | undefined => {
    let isLastDay = showTaskDeadline.isSame(maxDate, 'day');
    if (isLastDay) {
        return maxDate;
    } else {
        return undefined;
    }
}

const timeConstraints = (showTask: Task, _nowViewing: Task): {
    minTime: Dayjs | undefined,
    maxTime: Dayjs | undefined,
    minDate: Dayjs,
    maxDate: Dayjs,
} => {
    if (showTask.parent === null) {
        let maxDate = getMaxDate(showTask.subtasks.nodes);
        let showTaskDeadline = dayjs(showTask.deadline);
        return {
            minTime: getMinTime(showTaskDeadline, globalMinDate),
            maxTime: getMaxTime(showTaskDeadline, maxDate),
            minDate: getMaxDate(showTask.subtasks.nodes),
            maxDate: globalMaxDate,
        };
    }

    let sources: Task[] = [];
    let targets: Task[] = [];
    let siblings: Task[] = showTask.parent.subtasks.nodes;
    let siblingsEdges: [string, string][] = showTask.parent.subtasks.edges;
    siblingsEdges.forEach(([sourceId, targetId]) => {
        if (sourceId === showTask.id) {
            targets.push(siblings.find((sibling) => sibling.id === targetId)!);
        }
        if (targetId === showTask.id) {
            sources.push(siblings.find((sibling) => sibling.id === sourceId)!);
        }
    });

    let maxDateOfChildren = getMaxDate(showTask.subtasks.nodes);
    let maxDateOfSource = getMaxDate(sources);
    let minDateOfTargets = getMinDate(targets);
    let parentDeadline = dayjs(showTask.parent.deadline);

    let minDate: Dayjs;
    let maxDate: Dayjs;

    if (maxDateOfChildren.isAfter(maxDateOfSource)) {
        minDate = maxDateOfChildren;
    } else {
        minDate = maxDateOfSource;
    }

    if (minDateOfTargets.isBefore(parentDeadline)) {
        maxDate = minDateOfTargets;
    } else {
        maxDate = parentDeadline;
    }

    let showTaskDeadline = dayjs(showTask.deadline);

    return {
        minTime: getMinTime(showTaskDeadline, minDate),
        maxTime: getMaxTime(showTaskDeadline, maxDate),
        minDate: minDate,
        maxDate: maxDate,
    };
}

export default function Board({
                                  showTask,
                                  setShowTask
                              }: {
    showTask: Task,
    setShowTask: (task: Task) => void
}) {

    const setIsInputting = useSetAtom(isInputtingAtom);
    const nowViewing = useAtomValue(nowViewingAtom);


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

    let {minTime, maxTime, minDate, maxDate} = timeConstraints(showTask, nowViewing);

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
                maxDate={maxDate}
                minDate={minDate}
            />
            <TimeClockWarp taskToEdit={showTask} setTaskToEdit={setShowTask}
                           maxTime={maxTime} minTime={minTime}/>
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
