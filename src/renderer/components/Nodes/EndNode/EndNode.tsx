import { Handle, NodeProps, Position } from 'reactflow';
import React from 'react';
import styles from './EndNode.module.css';

const EndNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className={styles.EndNode}>
      <Handle
        type={'target'}
        position={Position.Left}
        className={styles.EndNodeHandle}
        id={'end-node-target'}
        isConnectable={true} />
    </div>
  );
};

export default EndNode;
