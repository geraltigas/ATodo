import styles from "./Worker.module.css"
import {useDataInit} from "./WorkerHooks.ts";
import {useAtom, useAtomValue} from "jotai";
import {appStateAtom, schehduledTasksAtom, windowSizeAtom} from "../../state/tasksAtom.ts";
import {useEffect, useRef, useState} from "react";
import {invoke} from "@tauri-apps/api";
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import TaskShow from "../../components/TaskShow.tsx";

const Worker = () => {

    useDataInit();
    // useWindowInit();

    const containerRef = useRef<HTMLDivElement>(null);

    const [windowSize, setWindowSize] = useAtom(windowSizeAtom);
    const [appState, setAppState] = useAtom(appStateAtom);
    const schehduledTasks = useAtomValue(schehduledTasksAtom);

    const [showExpend, setShowExpend] = useState(false);

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
            }).then((res) => {
                console.log("In function set_window_size", res, width, height);
            })
        }
    }, [showExpend])


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
                    <div className={styles.taskName} data-tauri-drag-region>
                        {schehduledTasks[0].name}
                    </div>
                    <div className={styles.taskTime} data-tauri-drag-region>
                        00:02:11
                    </div>
                    <div onClick={expendOnClick} className={expendClassName}>
                        <OpenInFullIcon/>
                    </div>
                </div>
                {showExpend && <TaskShow/>}
            </div>
        </div>
    )
}

export default Worker