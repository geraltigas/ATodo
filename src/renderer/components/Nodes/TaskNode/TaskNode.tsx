import { Handle, NodeProps, Position } from 'reactflow';
import React from 'react';
import styles from './TaskNode.module.css';

const TaskNode: React.FC<NodeProps> = ({ data }) => {

  const classNames = [styles.TaskNode];
  if (data.selected) {
    classNames.push(styles.focused);
  }

  return (
    <div className={classNames.join(' ')}>
      <Handle
        type={'source'}
        position={Position.Right}
        className={styles.TaskNodeHandle}
        id={'task-node-source'}
        isConnectable={true} />
      <Handle
        type={'target'}
        position={Position.Left}
        className={styles.TaskNodeHandle}
        id={'task-node-target'}
        isConnectable={true} />
      <div>task</div>
    </div>
  );
};

export default TaskNode;
