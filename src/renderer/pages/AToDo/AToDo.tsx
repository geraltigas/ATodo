import styles from './AToDo.module.css';
import Board from '../../components/Board/Board';
import Flow from '../../components/Flow/Flow';
import { useAtom } from 'jotai';
import { boardAtom } from '../../state/windowAtoms';

export default function AToDo() {
  const [showBoard, setShowBoard] = useAtom(boardAtom);
  return (
    <div className={styles.AToDo}>
      <Flow />
      {showBoard && <Board />}
    </div>
  );
}
