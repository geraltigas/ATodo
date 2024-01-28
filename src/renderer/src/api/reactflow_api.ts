import {task_relation_db, tasks_db, timestamp} from '../../../types/sql'
import {task_api} from './task_api'
import {Edge, edges, edges_init, end_node, Node, nodes, origin_node, start_node} from '../state/atodo'

export class reactflow_api {
  public static set_showing_task(now_viewing_task: timestamp) {
    nodes.value = reactflow_api.inference_nodes_from_tasks(task_api.get_subtasks_from_buffer(now_viewing_task))
    edges.value = reactflow_api.inference_edges_from_tasks_relation(task_api.get_subtasks_relations_from_buffer(now_viewing_task))
  }

  public static update_subtasks_relation(now_viewing_task: timestamp) {
    let relations = task_api.get_subtasks_relations_from_buffer(now_viewing_task)
    edges.value = this.inference_edges_from_tasks_relation(relations)
  }

  private static inference_nodes_from_tasks(tasks: tasks_db[]): Node[] {
    let end_node_ = {...end_node}
    let nodes_: Node[] = [origin_node, start_node]

    let maxX: number = 0
    let sumY: number = 0
    let numY: number = 0

    tasks.forEach((task) => {
      nodes_.push({
        id: task.id.toString(),
        type: 'task',
        position: {x: task.position_x, y: task.position_y},
        data: {
          real_task: task.id
        },
        draggable: true,
        selectable: true
      })
      if (task.position_x + task.name.length * 9 > maxX) {
        maxX = task.position_x + task.name.length * 9
      }
      sumY += task.position_y
      numY++
    })

    let avgY: number = sumY / numY

    if (numY === 0) {
      avgY = -7
    }

    end_node_.position.x = maxX + 80
    end_node_.position.y = avgY + 7

    nodes_.push(end_node_)
    return nodes_
  }

  private static inference_edges_from_tasks_relation(tasks_relation: task_relation_db[]): Edge[] {
    if (tasks_relation.length === 0 && nodes.value.length === 3) return edges_init
    let edges_: Edge[] = []
    tasks_relation.forEach((relation) => {
      edges_.push({
        id: `${relation.source}-${relation.target}`,
        source: relation.source.toString(),
        target: relation.target.toString(),
        sourceHandle: 'task-node-source',
        targetHandle: 'task-node-target',
        type: 'default_e',
        selected: false
      })
    })
    let source_set: Set<string> = new Set<string>()
    let target_set: Set<string> = new Set<string>()
    let connectedMap: Map<string, boolean> = new Map<string, boolean>()
    tasks_relation.forEach((value) => {
      source_set.add(value.source.toString())
      target_set.add(value.target.toString())
    })

    let intersection: Set<string> = new Set<string>([...source_set].filter(x => target_set.has(x)))

    let sourcetarget: Set<string> = new Set<string>([...source_set].filter(x => !intersection.has(x)))
    let targetsource: Set<string> = new Set<string>([...target_set].filter(x => !intersection.has(x)))

    intersection.forEach((value) => {
      connectedMap.set(value, true)
    })

    sourcetarget.forEach((value) => {
      edges_.push({
        id: `${value}-start`,
        source: 'start',
        target: value,
        sourceHandle: 'start-node-source',
        targetHandle: 'task-node-target',
        type: 'default_e',
        selected: false
      })
      connectedMap.set(value, true)
    })

    targetsource.forEach((value) => {
      edges_.push({
        id: `${value}-end`,
        source: value,
        target: 'end',
        sourceHandle: 'task-node-source',
        targetHandle: 'end-node-target',
        type: 'default_e',
        selected: false
      })
      connectedMap.set(value, true)
    })


    if (targetsource.size === 0 && sourcetarget.size === 0) {
      if (nodes.value.length === 0) {
        edges_.push({
          id: `start-end`,
          source: 'start',
          target: 'end',
          sourceHandle: 'start-node-source',
          targetHandle: 'end-node-target',
          type: 'default_e',
          selected: false
        })
      } else {
        nodes.value.forEach((value) => {
          if (value.id === 'start' || value.id === 'end' || value.id === 'origin') return
          edges_.push({
            id: `${value.id}-end`,
            source: value.id,
            target: 'end',
            sourceHandle: 'task-node-source',
            targetHandle: 'end-node-target',
            type: 'default_e',
            selected: false
          })
          edges_.push({
            id: `start-${value.id}`,
            source: 'start',
            target: value.id,
            sourceHandle: 'start-node-source',
            targetHandle: 'task-node-target',
            type: 'default_e',
            selected: false
          })
          connectedMap.set(value.id, true)
        })
      }
    }


    nodes.value.forEach((value) => {
      // if can be transfered to number and is connected
      if (!isNaN(Number(value.id)) && value.id.trim() !== '' && !connectedMap.has(value.id)) {
        // start to node
        edges_.push({
          id: `start-${value.id}`,
          source: 'start',
          target: value.id,
          sourceHandle: 'start-node-source',
          targetHandle: 'task-node-target',
          type: 'default_e',
          selected: false
        })
        // node to end
        edges_.push({
          id: `${value.id}-end`,
          source: value.id,
          target: 'end',
          sourceHandle: 'task-node-source',
          targetHandle: 'end-node-target',
          type: 'default_e',
          selected: false
        })
      }
    })


    return edges_
  }
}
