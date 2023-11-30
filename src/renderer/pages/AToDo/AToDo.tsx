import styles from './AToDo.module.css';
import Board from '../../components/Board/Board';
import Flow from '../../components/Flow/Flow';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export default function AToDo() {
  const showBoard = useSelector((state: RootState) => state.window.board);
  return (
    <div className={styles.AToDo}>
      <Flow />
      {showBoard && <Board />}
    </div>
  );
}
