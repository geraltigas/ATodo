import styles from './AToDo.module.css';
import Flow from '../../components/Flow/Flow';
import useDocumentEvent from "../../hooks/useEvent.ts";
import {nowSelectedAtom} from "../../state/tasksAtoms.ts";
import {useAtomValue} from "jotai";
import NowSelectedBoard from "../../components/NowSelectedBoard/NowSelectedBoard.tsx";
import FatherNodeBoard from "../../components/FatherNodeBoard/FatherNodeBoard.tsx";

export default function AToDo() {

    useDocumentEvent();

    const nowSelected = useAtomValue(nowSelectedAtom);

    return (
        <div className={styles.AToDo}>
            <FatherNodeBoard/>
            <Flow
            />
            {(nowSelected.type === 'node' || nowSelected.type === 'modify-node') && (
                <NowSelectedBoard/>
            )}
        </div>
    );
}
