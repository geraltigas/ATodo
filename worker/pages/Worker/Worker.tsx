import styles from "./Worker.module.css"
import {useDataInit} from "./WorkerHooks.ts";
import {useAtom, useAtomValue} from "jotai";
import {appStateAtom, scheduledTasksAtom, windowSizeAtom} from "../../state/tasksAtom.ts";
import {useEffect, useRef, useState} from "react";
import {invoke} from "@tauri-apps/api";
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import TaskShow from "../../components/TaskShow/TaskShow.tsx";
import {TimeRecord} from "../../../atodo/state/tasksAtoms.ts";

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


const Worker = () => {

    useDataInit();
    // useWindowInit();

    const containerRef = useRef<HTMLDivElement>(null);

    const windowSize = useAtomValue(windowSizeAtom);
    const [appState, setAppState] = useAtom(appStateAtom);
    const scheduledTasks = useAtomValue(scheduledTasksAtom);

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
            setTimeout(() => {
                timeRecord(showTimeConsumed, setShowTimeConsumed)
            }, 1000)
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
            // get container size, pading , border, margin
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
    }, [showExpend])

    useEffect(() => {
        setTimeout(() => {
            if (containerRef.current) {
                // get container size, pading , border, margin
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
        if (scheduledTasks.length !== 0) {
            setShowTimeConsumed(scheduledTasks[0].timeConsumed)
        }
    }, [scheduledTasks]);

    const expendOnClick = () => {
        setShowExpend((prev) => {
            console.log(prev);
            return !prev;
        })
    }

    const expendClassName = !showExpend ? styles.expand : styles.expand + " " + styles.expandHide;

    return (
        <div className={styles.WorkerBackground} style={
            {
                width: windowSize.width,
                height: windowSize.height
            }
        }>
            <div data-tauri-drag-region className={styles.container} ref={containerRef}>
                <div className={styles.taskShow}>
                    {scheduledTasks.length !== 0 && <div className={styles.taskName} data-tauri-drag-region>
                        {scheduledTasks[0].name}
                    </div>}
                    {scheduledTasks.length !== 0 &&
                        <div className={styles.taskTime} data-tauri-drag-region onClick={() => {
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
                    {scheduledTasks.length === 0 && <div data-tauri-drag-region>You are free?</div>}
                    <div onClick={expendOnClick} className={expendClassName}>
                        {showExpend ? <CloseFullscreenIcon/> : <OpenInFullIcon/>}
                    </div>
                </div>
                {showExpend && scheduledTasks.length !== 0 &&
                    <TaskShow scheduledTasks={scheduledTasks} setTimeRecordOn={setTimeRecordOn}
                              timeRecord={showTimeConsumed}/>}
            </div>
        </div>
    )
}

export default Worker