import styles from './AToDo.module.css';
import Board from '../../components/Board/Board';
import Flow from '../../components/Flow/Flow';
import { useAtom } from 'jotai';
import {
  taskToEditBoardAtom,
  taskToEditBoardIdAtom,
} from '../../state/tasksAtoms';

export default function AToDo() {
  const [nowClickedNodeId, setNowClickedNodeId] = useAtom(
    taskToEditBoardIdAtom,
  );
  const [nowClickedNode, setNowClickedNode] = useAtom(taskToEditBoardAtom);

  return (
    <div className={styles.AToDo}>
      <Flow
        setNowClickNode={setNowClickedNodeId}
        taskToEditId={nowClickedNodeId}
      />
      {nowClickedNode !== null && (
        <Board
          nowClickedNode={nowClickedNode!}
          setNowClickedNode={setNowClickedNode}
        />
      )}
    </div>
  );
}
