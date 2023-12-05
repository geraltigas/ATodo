import styles from './AToDo.module.css';
import Flow from '../../components/Flow/Flow';
import useDocumentEvent from "../../hooks/useEvent.ts";
import Board from "../../components/Board/Board.tsx";
import {nowSelectedAtom} from "../../state/tasksAtoms.ts";
import {useAtomValue} from "jotai";

export default function AToDo() {

    useDocumentEvent();

    const nowSelected = useAtomValue(nowSelectedAtom);

    return (
        <div className={styles.AToDo}>
            <Flow
            />
            {(nowSelected.type === 'node' || nowSelected.type === 'modify-node') && (
                <Board/>
            )}
        </div>
    );
}
