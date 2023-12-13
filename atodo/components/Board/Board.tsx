import styles from './Board.module.css';
import React from 'react';
import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography} from '@mui/material';
import {DateCalendar, DatePicker, TimePicker} from '@mui/x-date-pickers';
import dayjs, {Dayjs} from 'dayjs';
import {useAtomValue, useSetAtom} from "jotai";
import {
    ConstructingTrigger,
    EmailTrigger,
    getInitSuspendedInfo,
    isInputtingAtom,
    nowViewingAtom,
    SuspendedType,
    Task,
    TaskStatus,
    TimeTrigger
} from "../../state/tasksAtoms.ts";
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

    let suspendedInfo: React.JSX.Element = (<div></div>);
    if (showTask.status === TaskStatus.Suspended) {
        switch (showTask.info?.type) {
            case SuspendedType.Constructing:
                suspendedInfo = (<TextField
                        label="Why"
                        multiline
                        rows={5}
                        value={(showTask.info?.trigger as ConstructingTrigger).why}
                        onChange={(e) => {
                            setShowTask({
                                ...showTask,
                                info: {
                                    ...showTask.info!,
                                    trigger: {
                                        ...showTask.info!.trigger,
                                        why: e.target.value,
                                    }
                                }
                            })
                        }}
                        className={styles.textField}
                        onFocus={() => setIsInputting(true)}
                        onBlur={() => setIsInputting(false)}
                    />
                );
                break;
            case SuspendedType.Time:
                let now = dayjs();
                let triggerTime: Dayjs = dayjs((showTask.info.trigger as TimeTrigger).time);
                let isFirstDay = triggerTime.isSame(now, 'day');
                let isLastDay = triggerTime.isSame(showTask.deadline, 'day');
                let minTime = isFirstDay ? now : undefined;
                let maxTime = isLastDay ? dayjs(showTask.deadline) : undefined;
                suspendedInfo = (
                    <div>
                        <DatePicker
                            label="Date"
                            minDate={now}
                            maxDate={dayjs(showTask.deadline)}
                            value={triggerTime}
                            className={styles.marginTop}
                            onChange={(date) => {
                                setShowTask({
                                    ...showTask,
                                    info: {
                                        ...showTask.info!,
                                        trigger: {
                                            ...showTask.info!.trigger,
                                            time: date!.toString(),
                                        }
                                    }
                                })
                            }}
                        />
                        <TimePicker
                            label="Time"
                            value={triggerTime}
                            minTime={minTime}
                            maxTime={maxTime}
                            className={styles.marginTop}
                            onChange={(date) => {
                                setShowTask({
                                    ...showTask,
                                    info: {
                                        ...showTask.info!,
                                        trigger: {
                                            ...showTask.info!.trigger,
                                            time: date!.toString(),
                                        }
                                    }
                                })
                            }}
                        />
                    </div>);
                break;
            case SuspendedType.Email:
                suspendedInfo = (<TextField
                        label="Email"
                        multiline
                        rows={5}
                        value={(showTask.info?.trigger as EmailTrigger).email}
                        className={styles.textField}
                        onChange={(e) => {
                            setShowTask({
                                ...showTask,
                                info: {
                                    ...showTask.info!,
                                    trigger: {
                                        ...showTask.info!.trigger,
                                        email: e.target.value,
                                    }
                                }
                            })
                        }}
                        onFocus={() => setIsInputting(true)}
                        onBlur={() => setIsInputting(false)}
                    />
                );
                break;
            case SuspendedType.QQ:
                suspendedInfo = (<TextField
                        label="QQ"
                        multiline
                        rows={5}
                        className={styles.textField}
                        value={(showTask.info?.trigger as EmailTrigger).email}
                        onChange={(e) => {
                            setShowTask({
                                ...showTask,
                                info: {
                                    ...showTask.info!,
                                    trigger: {
                                        ...showTask.info!.trigger,
                                        email: e.target.value,
                                    }
                                }
                            })
                        }}
                        onFocus={() => setIsInputting(true)}
                        onBlur={() => setIsInputting(false)}
                    />
                );
                break;
            case SuspendedType.WeChat:
                suspendedInfo = (<TextField
                        label="WeChat"
                        multiline
                        rows={5}
                        className={styles.textField}
                        value={(showTask.info?.trigger as EmailTrigger).email}
                        onChange={(e) => {
                            setShowTask({
                                ...showTask,
                                info: {
                                    ...showTask.info!,
                                    trigger: {
                                        ...showTask.info!.trigger,
                                        email: e.target.value,
                                    }
                                }
                            })
                        }}
                        onFocus={() => setIsInputting(true)}
                        onBlur={() => setIsInputting(false)}
                    />
                );
                break;
            default:
                break;
        }
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
            {showTask.status === TaskStatus.Suspended &&
                <div>
                    <FormControl className={styles.FormControl}>
                        <FormLabel>Suspended Type</FormLabel>
                        <RadioGroup
                            value={showTask.info?.type}
                            onChange={(e) => {
                                setShowTask({
                                    ...showTask,
                                    info: getInitSuspendedInfo(e.target.value as SuspendedType)
                                })
                            }}
                        >
                            <FormControlLabel value={SuspendedType.Time} control={<Radio/>} label={"Time"}/>
                            <FormControlLabel value={SuspendedType.Constructing} control={<Radio/>}
                                              label={"Constructing"}/>
                            <FormControlLabel value={SuspendedType.Email} control={<Radio/>} label={"Email"}/>
                            <FormControlLabel value={SuspendedType.QQ} control={<Radio/>} label={"QQ"}/>
                            <FormControlLabel value={SuspendedType.WeChat} control={<Radio/>} label={"WeChat"}/>
                        </RadioGroup>
                    </FormControl>
                    <Typography variant={"h6"} className={styles.SuspendedInfo}>Suspended Info</Typography>
                    {suspendedInfo}
                </div>
            }
            <div className={styles.footer}></div>
        </div>
    );
}
