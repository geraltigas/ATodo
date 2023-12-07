import {useAtom} from "jotai/index";
import {isModifiedAtom, nowViewingAtom, Task} from "../../state/tasksAtoms.ts";
import Board from "../Board/Board.tsx";
import styles from "./FatherNodeBoard.module.css";
import {useCallback, useState} from "react";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import LeftArrowIcon from '@mui/icons-material/ArrowLeft';

export default function FatherNodeBoard() {
    const [nowViewing, setNowViewing] = useAtom(nowViewingAtom);
    const [isModified, setIsModified] = useAtom(isModifiedAtom);
    const [showFatherNodeBoard, setShowFatherNodeBoard] = useState(false);

    const setShowTask = useCallback((task: Task) => {
        setNowViewing(task);
        setIsModified(true);
    }, [nowViewing, isModified]);

    return (
        <div className={styles.Board}>
            {showFatherNodeBoard && <Board showTask={nowViewing} setShowTask={setShowTask}/>}
            <div onClick={() => setShowFatherNodeBoard(!showFatherNodeBoard)} className={styles.showFatherNodeBoard}>
                {showFatherNodeBoard ? <LeftArrowIcon/> : <ArrowRightIcon/>}
            </div>
        </div>
    )
}