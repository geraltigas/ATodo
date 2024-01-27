import { signal, Signal } from '@preact/signals'
import { tasks_db } from 'src/types/sql'
import { timestamp } from '../../../types/sql'
import { app_state_api } from '../api/app_state_api'
import { task_api } from '../api/task_api'
import { reactflow_api } from '../api/reactflow_api'
import { Position } from 'reactflow'
import { useEffect } from 'preact/compat'

// now_viewing_task
const now_viewing_task_init: timestamp = 0
const now_viewing_task: Signal<timestamp> = signal<timestamp>(now_viewing_task_init)

// task stack
const task_stack_init: timestamp[] = [0]
const task_stack: Signal<timestamp[]> = signal<timestamp[]>(task_stack_init)

// edges
export type Edge = {
  id: string,
  source: string,
  target: string,
  sourceHandle: string,
  targetHandle: string,
  type: string,
  selected: boolean
}
export const edges_init: Edge[] = [
  {
    id: `start-end`,
    source: 'start',
    target: 'end',
    sourceHandle: 'start-node-source',
    targetHandle: 'end-node-target',
    type: 'default_e',
    selected: false
  }
]
const edges: Signal<Edge[]> = signal<Edge[]>(edges_init)

// nodes
export type Node = {
  id: string;
  position: {
    x: number;
    y: number;
  };
  type: 'start' | 'end' | 'origin' | 'task';
  // style: CSSProperties;
  draggable: boolean;
  selectable: boolean;
  data: {
    label: string;
    selected?: boolean;
    real_task?: timestamp;
  };
  sourcePosition?: Position;
  targetPosition?: Position;
}
export const origin_node: Node = {
  id: 'origin',
  type: 'origin',
  position: {
    x: 0,
    y: 0
  },
  draggable: false,
  selectable: false,
  data: {
    label: ''
  }
}

export const start_node: Node = {
  id: 'start',
  position: {
    x: 0,
    y: 0
  },
  type: 'start',
  selectable: false,
  draggable: false,
  data: {
    label: ''
  },
  targetPosition: Position.Right
}

export const end_node: Node = {
  id: 'end',
  position: {
    x: 100,
    y: 0
  },
  type: 'end',
  selectable: false,
  draggable: true,
  data: {
    label: ''
  }
}

export const nodes_init: Node[] = [start_node, end_node, origin_node]
const nodes: Signal<Node[]> = signal<Node[]>(nodes_init)

// now_selected
export type NowSelected = {
  type: 'node' | 'edge' | 'none';
  reference: Node | Edge | null;
}

const now_selected_init: NowSelected = {
  type: 'none',
  reference: null
}
const now_selected: Signal<NowSelected> = signal<NowSelected>(now_selected_init)

// show_alert
export type ShowAlert = {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}
const show_alert_init: ShowAlert = {
  show: false,
  message: '',
  type: 'success'
}
const show_alert: Signal<ShowAlert> = signal<ShowAlert>(show_alert_init)

// is_modified
const is_modified_init: boolean = false
const is_modified: Signal<boolean> = signal<boolean>(is_modified_init)

// is_inputting
const is_inputting_init: boolean = false
const is_inputting: Signal<boolean> = signal<boolean>(is_inputting_init)

// entered_reactflow
const entered_reactflow_init: boolean = false
const entered_reactflow: Signal<boolean> = signal<boolean>(entered_reactflow_init)

// copied_task
const copied_task_init: tasks_db | null = null
const copied_task: Signal<tasks_db | null> = signal<tasks_db | null>(copied_task_init)

export const use_data_init = () => {
  useEffect(() => {
    // init signal value
    app_state_api.get_now_viewing_task().then((id) => {
      now_viewing_task.value = id
      task_api.preload_task().then(_r => {
        app_state_api.set_task_stack(id)
        reactflow_api.set_showing_task(id)
      }).then(() => {
        app_state_api.get_now_selected_task().then((now_selected_task_id) => {
          if (now_selected_task_id) {
            let task_node = nodes.value.find((node) => {
              return node.data.real_task === now_selected_task_id
            })
            if (task_node) {
              now_selected.value = {
                type: 'node',
                reference: task_node
              }
            }
          }
          app_state_api.set_now_selected_task(null).then(_r => {
          })
        })
      })
    })
  }, [])

}

export {
  now_viewing_task,
  task_stack,
  edges,
  nodes,
  now_selected,
  show_alert,
  is_modified,
  is_inputting,
  entered_reactflow,
  copied_task
}
