import { Handle, Position } from 'reactflow'
import styles from './TaskNode.module.css'
import { tasks_db } from '../../../../../types/sql'
import { task_api } from '../../../api/task_api'
import { Node, now_selected } from '../../../state/atodo'

const TaskNode = ({ data }) => {
  const classNames = [styles.TaskNode]
  const task_db_: tasks_db = task_api.get_task_from_buffer(data.real_task)
  if (now_selected.value.type === 'node' && (now_selected.value.reference! as Node).id === data.real_task.toString()) {
    classNames.push(styles.focused)
  }

  switch (task_db_.status) {
    case 'created':
      classNames.push(styles.TaskNodeCreated)
      break
    case 'done':
      classNames.push(styles.TaskNodeDone)
      break
    case 'in_progress':
      classNames.push(styles.TaskNodeInProgress)
      break
    case 'suspended':
      classNames.push(styles.TaskNodeSuspended)
      break
    case 'paused':
      classNames.push(styles.TaskNodePaused)
      break
  }

  // const realTask: Task = data.realTask

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
      <div>{task_db_.name}</div>
    </div>
  )
}

export default TaskNode
