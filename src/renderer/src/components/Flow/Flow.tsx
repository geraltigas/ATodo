import styles from './Flow.module.css'
import { applyNodeChanges, Background, BackgroundVariant, Controls, ReactFlow } from 'reactflow'
import { Snackbar, Step, StepLabel, Stepper } from '@mui/material'
import {
  useOnConnect,
  useOnEdgeClick,
  useOnMouseEnter,
  useOnMouseLeave,
  useOnNodeClick
} from '../../hooks/use_event_atodo'
import { edges, is_modified, Node, nodes, show_alert, task_stack, use_data_init } from '../../state/atodo'
import StartNode from '../Nodes/StartNode/StartNode'
import EndNode from '../Nodes/EndNode/EndNode'
import TaskNode from '../Nodes/TaskNode/TaskNode'
import OriginNode from '../Nodes/OriginNode/OriginNode'
import { task_api } from '../../api/task_api'
import DefaultEdges from '../Edges/DefaultEdges/DefaultEdges'
import { HeadBar } from '../HeadBar/HeadBar'

const nodeTypes = {
  start: StartNode,
  end: EndNode,
  task: TaskNode,
  origin: OriginNode
}

const edgeTypes = {
  default_e: DefaultEdges
}

export default function Flow() {
  // init
  use_data_init()

  // const taskStack = useAtomValue(taskStackAtom)

  const onMouseEnter = useOnMouseEnter()
  const onMouseLeave = useOnMouseLeave()
  const onConnect = useOnConnect()
  const onNodeClick = useOnNodeClick()
  const onEdgeClick = useOnEdgeClick()

  const modifiedClassName = is_modified.value ? styles.modifiedBase + ' ' + styles.modified : styles.modifiedBase

  return (
    <div
      className={styles.Flow}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <HeadBar />
      <div className={modifiedClassName}></div>
      <Snackbar
        open={show_alert.value.show}
        message={show_alert.value.message}
      />
      <Stepper nonLinear className={styles.Stack}>
        {task_stack.value.map((id) => {
          let task = task_api.get_task_from_buffer(id)
          return <Step key={task.id} completed={false}>
            <StepLabel>{task.name}</StepLabel>
          </Step>
        })}
      </Stepper>
      <ReactFlow
        nodes={nodes.value}
        edges={edges.value}
        onNodesChange={(changes) => {
          nodes.value = applyNodeChanges(changes, nodes.value) as Node[]
          changes.forEach((value) => {
            if (value.type === 'position' && value.dragging) {
              task_api.set_task_position(Number(value.id), value.position!.x, value.position!.y)
            }
          })
        }}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapGrid={[10, 10]}
        snapToGrid={true}
        fitView
      >
        <Background gap={10} color="black" variant={BackgroundVariant.Dots} />
        <Controls />
      </ReactFlow>
    </div>
  )
}
