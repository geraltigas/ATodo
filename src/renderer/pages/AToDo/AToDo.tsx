import styles from './AToDo.module.css';
import Board from '../../components/Board/Board';
import Flow, { TaskNodeShow } from '../../components/Flow/Flow';
import React from 'react';

export default function AToDo() {
  const [nowClickedNode, setNowClickedNode] = React.useState<TaskNodeShow | null>(null);

  return (
    <div className={styles.AToDo}>
      <Flow setNowClickNode={setNowClickedNode} />
      {nowClickedNode !== null && <Board nowClickedNode={nowClickedNode!} setNowClickedNode={setNowClickedNode} />}
    </div>
  );
}
