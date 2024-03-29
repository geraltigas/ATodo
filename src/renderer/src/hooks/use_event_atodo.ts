// import from preact
import {useCallback, useEffect} from 'preact/compat'
import {Connection, Edge as ReactflowEdge, Node as ReactflowNode} from 'reactflow'
import {root_task, window_size_retore} from '../state/app'
import {
  copied_task,
  Edge,
  entered_reactflow,
  is_inputting,
  is_modified,
  Node,
  now_selected,
  now_viewing_task,
  show_alert
} from '../state/atodo'
import {task_api} from '../api/task_api'
import {batch} from '@preact/signals'
import {reactflow_api} from '../api/reactflow_api'
import dayjs from 'dayjs'
import {app_state_api} from '../api/app_state_api'
import {window_control_api} from '../api/window_control_api'
import {Page, route} from "../App";
// import {sql_api} from "../interface/sql_api.ts";

type KeyBoardCallBack = (event: KeyboardEvent) => void;
const documentKeyBoardEventsReference: Set<KeyBoardCallBack> = new Set()

type MouseCallBack = (event: MouseEvent) => void;
const documentMouseEventsReference: Set<MouseCallBack> = new Set()

// export const updateReference = (newTask: Task) => {
//   let parent = newTask.parent
//   let subtasks = newTask.subtasks.nodes
//
//   if (parent !== null) {
//     let oldTaskIndex = parent.subtasks.nodes.findIndex((task) => task.id === newTask.id)
//     // remove old task
//     parent.subtasks.nodes.splice(oldTaskIndex, 1)
//     parent.subtasks.nodes.push(newTask)
//   }
//   subtasks.forEach((task) => {
//     task.parent = newTask
//   })
// }

// sometimes, It is worth to have duplicate state to make the code more readable.

const use_event_atodo = () => {
  useDocumentOnADown()
  useDocumentOnEnterDown()
  useDocumentOnDeleteDown()
  useDocumentOnSpaceDown()
  useDocumentOnMouse3Down()
  useDocumentOnCtrlSDown()
  useDocumentOnCtrlCDown()
  useDocumentOnCtrlVDown()
}

export const useOnMouseEnter = () => {
  return useCallback((_event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    entered_reactflow.value = true
  }, [])
}

export const useOnMouseLeave = () => {
  return useCallback((_event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    entered_reactflow.value = false
  }, [])
}

export const useOnConnect = () => {
  return useCallback((params: Connection) => {
    batch(() => {
      task_api.add_relation(Number(params.source!), Number(params.target!))
      console.log(task_api.get_task_relation_buffer())
      reactflow_api.update_subtasks_relation(now_viewing_task.value)
    })
  }, [])
}

export const useOnNodeClick = () => {
  return useCallback((_event: React.MouseEvent, node: ReactflowNode) => {

    if (node.type === 'task') {
      if (now_selected.value.type === 'node' && (now_selected.value.reference as Node).id === node.id) {
        now_selected.value = {
          type: 'none',
          reference: null
        }
      } else {
        now_selected.value = {
          type: 'node',
          // @ts-ignore
          reference: node
        }
      }
    }

  }, [])
}

export const useOnEdgeClick = () => {

  return useCallback((_event: React.MouseEvent, edge: ReactflowEdge) => {
    if (now_selected.value.type === 'edge' && (now_selected.value.reference as Edge).id === edge.id) {
      now_selected.value = {
        type: 'none',
        reference: null
      }
    } else {
      now_selected.value = {
        type: 'edge',
        reference: edge as Edge
      }
    }
  }, [])

}

const useDocumentOnADown = () => {

  const callback = useCallback((event: KeyboardEvent) => {
    if (event.key === 'a' && !is_inputting.value) {
      task_api.add_empty_task()
      console.log(task_api.get_task_buffer())
      reactflow_api.update_subtasks_relation(now_viewing_task.value)
    }
  }, [])

  useEffect(() => {
    documentKeyBoardEventsReference.add(callback)
    document.addEventListener('keydown', callback)
  }, [])
}

const useDocumentOnEnterDown = () => {

  // open worker
  const callback = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter' && !is_inputting.value) {
      if (is_modified.value) {
        show_alert.value = {
          show: true,
          message: 'You have unsaved changes!',
          type: 'error'
        }
        setTimeout(() => {
          show_alert.value = {
            show: false,
            message: '',
            type: 'error'
          }
        }, 2000)
        return
      }
      window_control_api.get_window_size().then((res) => {
        window_size_retore.value = res
        unregister_all_event_listener()
        route.value = Page.Worker
      })
    }
  }, [])

  useEffect(() => {
    documentKeyBoardEventsReference.add(callback)
    document.addEventListener('keydown', callback)
  }, [])
}

const useDocumentOnDeleteDown = () => {

  const callback = useCallback((event: KeyboardEvent) => {
    if ((event.key === ' ' || event.key == 'Delete') && now_selected.value.type !== 'none') {
      console.log()
      if (now_selected.value.type === 'node') {
        task_api.delete_task(Number((now_selected.value.reference as Node).id))
        console.log(task_api.get_task_buffer())
        now_selected.value = {
          type: 'none',
          reference: null
        }
      } else if (now_selected.value.type === 'edge') {
        batch(() => {
          task_api.delete_relation(Number((now_selected.value.reference as Edge).source), Number((now_selected.value.reference as Edge).target))
          console.log(task_api.get_task_relation_buffer())
          now_selected.value = {
            type: 'none',
            reference: null
          }
          reactflow_api.update_subtasks_relation(now_viewing_task.value)
        })

      }

    }
  }, [])

  useEffect(() => {
    documentKeyBoardEventsReference.add(callback)
    document.addEventListener('keydown', callback)
  }, [])
}

const useDocumentOnSpaceDown = () => {

  const callback = useCallback((event: KeyboardEvent) => {
    if (event.key === ' ' && now_selected.value.type === 'node' && !is_inputting.value) {
      batch(() => {
        is_modified.value = true
        let tmp = Number((now_selected.value.reference as Node).id)
        reactflow_api.set_showing_task(tmp)
        app_state_api.set_task_stack(tmp)
        now_selected.value = {
          type: 'none',
          reference: null
        }
        now_viewing_task.value = tmp
      })
    }
  }, [])

  useEffect(() => {
    documentKeyBoardEventsReference.add(callback)
    document.addEventListener('keydown', callback)
  }, [])
}

const useDocumentOnCtrlSDown = () => {

  const callback = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 's' && is_modified.value && entered_reactflow.value && !is_inputting.value) {
      console.log(task_api.get_task_buffer())
      console.log(task_api.get_task_relation_buffer())
      task_api.flush_to_db().then((_res) => {
        batch(() => {
          reactflow_api.set_showing_task(now_viewing_task.value)
          is_modified.value = false
          show_alert.value = {
            show: true,
            message: 'Saved!',
            type: 'success'
          }
          setTimeout(() => {
            show_alert.value = {
              show: false,
              message: '',
              type: 'success'
            }
          }, 2000)
        })

      }).catch((err) => {

        show_alert.value = {
          show: true,
          message: 'Failed to save:' + err,
          type: 'error'
        }
        setTimeout(() => {
          show_alert.value = {
            show: false,
            message: '',
            type: 'error'
          }
        }, 2000)

      })
    }
  }, [])

  useEffect(() => {
    documentKeyBoardEventsReference.add(callback)
    document.addEventListener('keydown', callback)
  }, [])
}

const useDocumentOnCtrlCDown = () => {

  const callback = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'c' && !is_inputting.value) {
      if (now_selected.value.type === 'node') {
        task_api.get_task(Number((now_selected.value.reference as Node).id)).then((res) => {
          copied_task.value = {
            ...res,
            id: dayjs().valueOf(),
            position_x: res.position_x + 10,
            position_y: res.position_y + 10,
            time_consumed: 0
          }
        })
      }
    }
  }, [])

  useEffect(() => {
    documentKeyBoardEventsReference.add(callback)
    document.addEventListener('keydown', callback)
  }, [])
}

const useDocumentOnCtrlVDown = () => {

  const callback = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'v' && copied_task.value && !is_inputting.value) {
      task_api.add_task(copied_task.value)
      copied_task.value = null
    }
  }, [])

  useEffect(() => {
    documentKeyBoardEventsReference.add(callback)
    document.addEventListener('keydown', callback)
  }, [])
}

// ------------------ mouse event ------------------

const useDocumentOnMouse3Down = () => {

  const callback = useCallback((event: MouseEvent) => {
    if (event.button === 3) {
      if (now_viewing_task.value !== root_task.value) {
        batch(() => {
          is_modified.value = true
          let tmp = task_api.get_task_from_buffer(now_viewing_task.value)
          now_viewing_task.value = tmp.parent
          app_state_api.set_now_viewing_task(tmp.parent).then((_r) => {
          }).catch((_err) => {
            console.log(_err)
          })
          reactflow_api.set_showing_task(tmp.parent)
          app_state_api.set_task_stack(tmp.parent)
          now_selected.value = {
            type: 'none',
            reference: null
          }
        })
      }
    }
  }, [])

  useEffect(() => {
    documentMouseEventsReference.add(callback)
    document.addEventListener('mousedown', callback)
  }, [])
}

const unregister_all_event_listener = () => {
  documentKeyBoardEventsReference.forEach((callback) => {
    document.removeEventListener('keydown', callback)
  })
  documentMouseEventsReference.forEach((callback) => {
    document.removeEventListener('mousedown', callback)
  })
}

export default use_event_atodo
