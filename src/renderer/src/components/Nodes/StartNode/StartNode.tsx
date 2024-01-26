import {Handle, NodeProps, Position} from 'reactflow';
import React from 'react';
import styles from './StartNode.module.css';

const StartNode: React.FC<NodeProps> = () => {
    return (
        <div className={styles.StartNode}>
            <Handle
                type={'source'}
                position={Position.Right}
                className={styles.StartNodeHandle}
                id={'start-node-source'}
                isConnectable={true}/>
        </div>
    );
};

export default StartNode;
