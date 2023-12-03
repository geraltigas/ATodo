import styles from './Board.module.css';
import { TaskNodeShow } from '../Flow/Flow';

export default function Board(
  {
    nowClickedNode, setNowClickedNode
  }: {
    nowClickedNode: TaskNodeShow
    setNowClickedNode: React.Dispatch<React.SetStateAction<TaskNodeShow | null>>
  }) {
  return (
    <div className={styles.Board}>
      <h1>Board</h1>
    </div>
  );
}
