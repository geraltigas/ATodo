import styles from "./Worker.module.css"
import {useDataInit} from "./WorkerHooks.ts";
import {useAtom, useAtomValue} from "jotai";
import {appStateAtom, scheduledTasksAtom, windowSizeAtom} from "../../state/tasksAtom.ts";
import {useEffect, useRef, useState} from "react";
import {invoke} from "@tauri-apps/api";
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import TaskShow from "../../components/TaskShow/TaskShow.tsx";
import {Task, TaskStatus, TimeRecord} from "../../../atodo/state/tasksAtoms.ts";
import useEvent, {useOnMouseEnter, useOnMouseLeave} from "../../hooks/useEvent.ts";
import SuspendedTasks from "../../components/SuspendedTasks/SuspendedTasks.tsx";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

const timeRecord: (timeRecord: TimeRecord, setShowTimeConsumed: (_: TimeRecord) => void) => void = (timeRecord: TimeRecord, setShowTimeConsumed: (_: TimeRecord) => void) => {
    if (timeRecord.seconds === 59) {
        timeRecord.seconds = 0;
        if (timeRecord.minutes === 59) {
            timeRecord.minutes = 0;
            timeRecord.hours++;
        } else {
            timeRecord.minutes++;
        }
    } else {
        timeRecord.seconds++;
    }
    setShowTimeConsumed({...timeRecord});
}

let timeOutId: NodeJS.Timeout[] = [];

let lastTask: Task | null = null;


const Worker = () => {

    useDataInit();
    useEvent();
    // useWindowInit();

    const containerRef = useRef<HTMLDivElement>(null);

    const windowSize = useAtomValue(windowSizeAtom);
    const [appState, setAppState] = useAtom(appStateAtom);
    const scheduledTasks = useAtomValue(scheduledTasksAtom);
    const [showSuspendedTasks, setShowSuspendedTasks] = useState(false);

    useEffect(() => {
        console.log("scheduledTasks changed", scheduledTasks)
    }, [scheduledTasks]);

    const [showExpend, setShowExpend] = useState(false);

    const [showTimeConsumed, setShowTimeConsumed] = useState<TimeRecord>({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [showTimeMode, setShowTimeMode] = useState<"noSecond" | "withSecond">("withSecond");
    const [timeRecordOn, setTimeRecordOn] = useState(false);

    useEffect(() => {
        if (timeRecordOn) {
            timeOutId.forEach((id) => {
                clearTimeout(id);
            })
            timeOutId = [];
            timeOutId.unshift(setTimeout(() => {
                timeRecord(showTimeConsumed, setShowTimeConsumed)
            }, 1000))
        } else {
            timeOutId.forEach((id) => {
                clearTimeout(id);
            })
            timeOutId = [];
        }
    }, [timeRecordOn, showTimeConsumed]);

    let time: string;
    if (showTimeMode === "noSecond") {
        time = (showTimeConsumed.hours === 0 ? '' : (showTimeConsumed.hours < 10 ? '0' + showTimeConsumed.hours.toString() + ":" : showTimeConsumed.hours.toString() + ":")) + (showTimeConsumed.minutes < 10 ? '0' + showTimeConsumed.minutes.toString() : showTimeConsumed.minutes.toString());
    } else {
        time = (showTimeConsumed.hours === 0 ? '' : (showTimeConsumed.hours < 10 ? '0' + showTimeConsumed.hours.toString() + ":" : showTimeConsumed.hours.toString() + ":")) + (showTimeConsumed.minutes < 10 ? '0' + showTimeConsumed.minutes.toString() : showTimeConsumed.minutes.toString()) + ":" + (showTimeConsumed.seconds < 10 ? '0' + showTimeConsumed.seconds.toString() : showTimeConsumed.seconds.toString());
    }

    useEffect(() => {
        if (containerRef.current) {
            // get container size, padding , border, margin
            let width = containerRef.current.clientWidth;
            let height = containerRef.current.clientHeight;
            // set window size
            invoke<string>("set_window_size", {
                label: "worker",
                width: width + 1,
                height: height + 1
            }).then(_r => {
            })
        }
    }, [showExpend, showSuspendedTasks])

    useEffect(() => {
        setTimeout(() => {
            if (containerRef.current) {
                // get container size, padding , border, margin
                let width = containerRef.current.clientWidth;
                let height = containerRef.current.clientHeight;
                // set window size
                invoke<string>("set_window_size", {
                    label: "worker",
                    width: width + 1,
                    height: height + 1
                }).then(_r => {
                })
            }
        }, 0)
    }, [appState])

    useEffect(() => {
        if (scheduledTasks.length === 0) {
            setTimeRecordOn(false);
            setShowTimeConsumed({
                hours: 0,
                minutes: 0,
                seconds: 0,
            })
            return;
        }
        if (lastTask && lastTask.id === scheduledTasks[0].id) {
            return;
        }
        lastTask = scheduledTasks[0];
        setShowTimeConsumed(scheduledTasks[0].timeConsumed)
        if (scheduledTasks[0].status === TaskStatus.InProgress) {
            setTimeRecordOn(true);
        }
    }, [scheduledTasks]);

    const expendOnClick = () => {
        setShowExpend((prev) => {
            console.log(prev);
            return !prev;
        })
    }

    const onMouseEnter = useOnMouseEnter();
    const onMouseLeave = useOnMouseLeave();

    const toggleShowSuspendedTasks = () => {
        setShowSuspendedTasks((prev) => {
            return !prev;
        })
    }

    return (
        <div className={styles.WorkerBackground} style={
            {
                width: windowSize.width,
                height: windowSize.height
            }
        } onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <div data-tauri-drag-region='' className={styles.container} ref={containerRef}>
                <div className={styles.taskShow}>
                    <div className={styles.leftShow}>
                        {scheduledTasks.length !== 0 && <div className={styles.taskFont} data-tauri-drag-region=''>
                            {scheduledTasks[0].name}
                        </div>}
                        {scheduledTasks.length !== 0 &&
                            <div className={styles.taskFont} onClick={() => {
                                setShowTimeMode((prev) => {
                                    if (prev === "noSecond") {
                                        return "withSecond";
                                    } else {
                                        return "noSecond";
                                    }
                                })
                                setAppState({...appState})
                            }}>
                                {time}
                            </div>}
                        {scheduledTasks.length === 0 && <div data-tauri-drag-region=''>You are free?</div>}
                    </div>
                    <div className={styles.rightButtons}>
                        <div onClick={toggleShowSuspendedTasks} className={styles.expand}>
                            <FormatListBulletedIcon/>
                        </div>
                        <div onClick={expendOnClick} className={styles.expand}>
                            {showExpend ? <CloseFullscreenIcon/> : <OpenInFullIcon/>}
                        </div>
                    </div>
                </div>
                {showExpend && scheduledTasks.length !== 0 &&
                    <TaskShow scheduledTasks={scheduledTasks} setTimeRecordOn={setTimeRecordOn}
                              timeRecord={showTimeConsumed}/>}
                {showSuspendedTasks && <SuspendedTasks/>}
            </div>
        </div>
    )
}

export default Worker