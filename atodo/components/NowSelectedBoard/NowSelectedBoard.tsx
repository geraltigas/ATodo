import {nowSelectedAtom, Task} from "../../state/tasksAtoms.ts";
import {useAtom} from "jotai";
import Board from "../Board/Board.tsx";

export default function NowSelectedBoard() {
    const [nowSelected, setNowSelected] = useAtom(nowSelectedAtom);
    return (
        <>
            <Board showTask={nowSelected.reference as Task} setShowTask={(task) => setNowSelected({
                type: 'modify-node',
                reference: task,
            })}/>
        </>
    )
}