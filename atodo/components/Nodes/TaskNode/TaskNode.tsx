import {Handle, NodeProps, Position} from 'reactflow';
import React from 'react';
import styles from './TaskNode.module.css';
import {Task, TaskStatus} from "../../../state/tasksAtoms.ts";

const TaskNode: React.FC<NodeProps> = ({data}) => {
    const classNames = [styles.TaskNode];
    const status: TaskStatus = data.realTask.status;
    if (data.selected) {
        classNames.push(styles.focused);
    }

    switch (status) {
        case TaskStatus.Created:
            classNames.push(styles.TaskNodeCreated);
            break;
        case TaskStatus.Done:
            classNames.push(styles.TaskNodeDone);
            break;
        case TaskStatus.InProgress:
            classNames.push(styles.TaskNodeInProgress);
            break;
        case TaskStatus.Suspended:
            classNames.push(styles.TaskNodeSuspended);
            break;
        case TaskStatus.Paused:
            classNames.push(styles.TaskNodePaused);
            break;
    }

    console.log(status)
    console.log(classNames)

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
