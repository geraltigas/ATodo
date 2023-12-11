import {Button} from "@mui/material";
import styles from "./TaskShow.module.css"
import {Task, TaskStatus, TimeRecord} from "../../../atodo/state/tasksAtoms.ts";
import React from "react";
import {useAtom} from "jotai";
import {appStateAtom} from "../../state/tasksAtom.ts";
import {invoke} from "@tauri-apps/api";
import {stringify} from "flatted";
import {appStoragePersistence} from "../../pages/Worker/WorkerHooks.ts";

const addTimeRecord = (base: TimeRecord, addTimeRecord: TimeRecord) => {
    base.hours += addTimeRecord.hours;
    base.minutes += addTimeRecord.minutes;
    base.seconds += addTimeRecord.seconds;
    if (base.seconds >= 60) {
        base.seconds -= 60;
        base.minutes++;
    }
    if (base.minutes >= 60) {
        base.minutes -= 60;
        base.hours++;
    }
    return base;
}

const isDone = (task: Task): boolean => {
    let isDone: boolean = true;
    task.subtasks.nodes.forEach((subtask) => {
        if (subtask.status !== TaskStatus.Done) {
            isDone = false;
        }
    })
    return isDone;
}

const isSuspended = (task: Task): boolean => {
    let isSuspended: boolean = true;
    task.subtasks.nodes.forEach((subtask) => {
        if (subtask.status !== TaskStatus.Suspended && subtask.status !== TaskStatus.Done) {
            isSuspended = false;
        }
    })
    return isSuspended;
}

function TaskShow(
    {
        scheduledTasks,
        timeRecord,
        setTimeRecordOn,
    }: {
        scheduledTasks: Task[],
        timeRecord: TimeRecord,
        setTimeRecordOn: (timeRecordOn: boolean) => void
    }) {

    const [appStatus, setAppStatus] = useAtom(appStateAtom);

    const showStart: boolean = scheduledTasks[0].status === TaskStatus.Created || scheduledTasks[0].status === TaskStatus.Suspended || scheduledTasks[0].status === TaskStatus.Paused;
    const showInterrupt: boolean = scheduledTasks[0].status === TaskStatus.InProgress;
    const showPause: boolean = scheduledTasks[0].status === TaskStatus.InProgress;
    const showDone: boolean = scheduledTasks[0].status === TaskStatus.InProgress;

    const onStartClick = (_event: React.MouseEvent<HTMLButtonElement>) => {
        let temp: Task | null = scheduledTasks[0];
        temp.status = TaskStatus.InProgress;
        while (temp !== null) {
            temp.status = TaskStatus.InProgress;
            temp = temp.parent;
        }
        setAppStatus({...appStatus});
        let str = stringify(appStoragePersistence);
        invoke<string>("save", {key: "taskStorage", value: str}).then((res) => {
            console.log(res)
        })
        setTimeRecordOn(true)
        console.log('Start')
    }

    const onSuspendClick = (_event: React.MouseEvent<HTMLButtonElement>) => {
        let temp: Task | null = scheduledTasks[0];
        temp.status = TaskStatus.Suspended;
        temp.timeConsumed = {...timeRecord};
        while (temp.parent !== null) {
            if (isSuspended(temp.parent)) {
                temp.parent.status = TaskStatus.Suspended;
            }
            addTimeRecord(temp.parent.timeConsumed, timeRecord)
            temp = temp.parent;
        }
        setAppStatus({...appStatus});
        let str = stringify(appStoragePersistence);
        invoke<string>("save", {key: "taskStorage", value: str}).then((res) => {
            console.log(res)
        })
        setTimeRecordOn(false)
        console.log('Suspend')
    }

    const onPauseClick = (_event: React.MouseEvent<HTMLButtonElement>) => {
        let temp: Task | null = scheduledTasks[0];
        temp.status = TaskStatus.Paused;
        temp.timeConsumed = {...timeRecord};
        while (temp !== null) {
            temp.status = TaskStatus.Paused;
            addTimeRecord(temp.timeConsumed, timeRecord);
            temp = temp.parent;
        }
        setAppStatus({...appStatus});
        let str = stringify(appStoragePersistence);
        invoke<string>("save", {key: "taskStorage", value: str}).then((res) => {
            console.log(res)
        })
        setTimeRecordOn(false)
        console.log('Pause')
    }

    const onDoneClick = (_event: React.MouseEvent<HTMLButtonElement>) => {
        let temp: Task | null = scheduledTasks[0];
        temp.status = TaskStatus.Done;
        temp.timeConsumed = {...timeRecord};
        while (temp.parent !== null) {
            if (isDone(temp.parent)) {
                temp.parent.status = TaskStatus.Done;
            }
            addTimeRecord(temp.parent.timeConsumed, timeRecord)
            temp = temp.parent;
        }
        setAppStatus({...appStatus});
        let str = stringify(appStoragePersistence);
        invoke<string>("save", {key: "taskStorage", value: str}).then((res) => {
            console.log(res)
        })
        setTimeRecordOn(false)
        console.log('Done')
    }


    return (
        <div>
            <div className={styles.showGoal}>
                {scheduledTasks[0].goal}
            </div>
            <div className={styles.buttons}>
                {showStart &&
                    <Button size="small" variant="contained" color="primary" onClick={onStartClick}>Start</Button>}
                {showInterrupt &&
                    <Button size="small" variant="contained" color="error" onClick={onSuspendClick}>Suspend</Button>}
                {showPause && <Button size="small" variant="contained" onClick={onPauseClick}>Pause</Button>}
                {showDone &&
                    <Button size="small" variant="contained" color="success" onClick={onDoneClick}>Done</Button>}
            </div>
        </div>
    )
}

export default TaskShow