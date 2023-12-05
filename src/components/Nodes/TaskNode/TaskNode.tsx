import {Handle, NodeProps, Position} from 'reactflow';
import React from 'react';
import styles from './TaskNode.module.css';
import {Task} from "../../../state/tasksAtoms.ts";

const TaskNode: React.FC<NodeProps> = ({data}) => {
    const classNames = [styles.TaskNode];
    if (data.selected) {
        classNames.push(styles.focused);
    }

    const realTask: Task = data.realTask;

    return (
        <div className={classNames.join(' ')}>
            <Handle
                type={'source'}
                position={Position.Right}
                className={styles.TaskNodeHandle}
                id={'task-node-source'}
                isConnectable={true}
            />
            <Handle
                type={'target'}
                position={Position.Left}
                className={styles.TaskNodeHandle}
                id={'task-node-target'}
                isConnectable={true}
            />
            <div>{realTask.name}</div>
        </div>
    );
};

export default TaskNode;
