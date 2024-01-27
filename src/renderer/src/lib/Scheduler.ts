// import {SuspendedType, Task, TaskStatus} from "./Task";
import dayjs from 'dayjs'
import { SuspendedTasksBuffer } from './SuspendedTasksManager'
import { tasks_db, timestamp } from '../../../types/sql'
import { task_api } from '../api/task_api'
import { root_task } from '../state/app'
import { scheduled_tasks, suspended_tasks } from '../state/worker'

function iterable(tempTasks: Set<tasks_db>): boolean {
  return tempTasks.size !== 0
}

function iterateSearching(targetNodesNotSourceNodes: Set<timestamp>, scheduledTaskThisLayer: Set<tasks_db>, idTaskMap: Map<timestamp, tasks_db>, targetToSourceMap: Map<timestamp, timestamp[]>) {
  let targetNodesNotSourceNodesTemp: Set<tasks_db> = new Set()
  targetNodesNotSourceNodes.forEach((targetNode) => {
    targetNodesNotSourceNodesTemp.add(idTaskMap.get(targetNode)!)
  })

  console.log('iterateSearching start from tasks: ', targetNodesNotSourceNodesTemp)
  let iterationNum = 0

  while (iterable(targetNodesNotSourceNodesTemp)) {
    iterationNum++
    console.log('- iteration: ' + iterationNum)
    console.log('-- targetNodesNotSourceNodesTemp: ', targetNodesNotSourceNodesTemp)
    let innerTemp: Set<tasks_db> = new Set()
    targetNodesNotSourceNodesTemp.forEach((targetNode) => {
      console.log('-- now Searching task: ' + targetNode.name + ' status: ' + targetNode.status)
      switch (targetNode.status) {
        case 'created':
          let tempBool = true
          if (!targetToSourceMap.has(targetNode.id)) {
            scheduledTaskThisLayer.add(targetNode)
            console.log('-- task has no source tasks, add to scheduledTasksThisLayer: ' + targetNode.name)
            break
          }
          targetToSourceMap.get(targetNode.id)!.forEach((sourceNode) => {
            if (idTaskMap.get(sourceNode)!.status !== 'done') {
              tempBool = false
              innerTemp.add(idTaskMap.get(sourceNode)!)
            }
          })
          if (tempBool) {
            console.log('-- task has source tasks, but all source tasks are done, add to scheduledTasksThisLayer: ' + targetNode.name)
            scheduledTaskThisLayer.add(targetNode)
          } else {
            console.log('-- task has source tasks, but not all source tasks are done, add source tasks to iteration')
          }
          break
        case 'done':
          console.log('-- task is done, give up: ' + targetNode.name)
          break
        case 'in_progress':
          console.log('-- task is in progress, add to scheduledTasksThisLayer: ' + targetNode.name)
          scheduledTaskThisLayer.add(targetNode)
          break
        case 'suspended':
          if (targetNode.suspended_type === 'constructing') {
            console.log('-- task is suspended, but type is constructing, keep on searching: ' + targetNode.name)
            let tempBool = true
            if (!targetToSourceMap.has(targetNode.id)) {
              console.log('-- task has no source tasks, add to scheduledTasksThisLayer: ' + targetNode.name)
              scheduledTaskThisLayer.add(targetNode)
              break
            }
            targetToSourceMap.get(targetNode.id)!.forEach((sourceNode) => {
              if (idTaskMap.get(sourceNode)!.status !== 'done') {
                tempBool = false
                innerTemp.add(idTaskMap.get(sourceNode)!)
              }
            })
            if (tempBool) {
              console.log('-- task has source tasks, but all source tasks are done, add to scheduledTasksThisLayer: ' + targetNode.name)
              scheduledTaskThisLayer.add(targetNode)
            } else {
              console.log('-- task has source tasks, but not all source tasks are done, add source tasks to iteration')
            }
          } else {
            scheduledTaskThisLayer.add(targetNode)
          }
          break
        case 'paused':
          console.log('-- task is paused, add to scheduledTasksThisLayer: ' + targetNode.name)
          scheduledTaskThisLayer.add(targetNode)
          break
      }
    })
    targetNodesNotSourceNodesTemp = innerTemp
  }
}

export class Scheduler {
  private static scheduledTasks: tasks_db[] = []
  private static suspendedTasks: tasks_db[] = []

  public static schedule() {
    this.scheduledTasks = []
    this.suspendedTasks = []
    let temp = Array.from(this.scheduleTask(task_api.get_task_from_buffer(root_task.value)))
    temp.forEach((task) => {
      if (task.status !== 'suspended') {
        this.scheduledTasks.push(task)
      } else {
        this.suspendedTasks.push(task)
      }
    })

    SuspendedTasksBuffer.init(this.suspendedTasks)

    // reorder this.scheduledTasks
    this.scheduledTasks.sort((a, b) => {
      // combine dayjs date and time
      let aDeadline = dayjs(a.deadline)
      let bDeadline = dayjs(b.deadline)
      return aDeadline.isBefore(bDeadline) ? -1 : 1
    })
  }

  public static getSchedule(): tasks_db[] {
    return this.scheduledTasks
  }

  public static getSuspendedTasks(): tasks_db[] {
    return this.suspendedTasks
  }

  private static scheduleTask(task: tasks_db): Set<tasks_db> {
    let scheduledTasks: Set<tasks_db> = new Set()
    let scheduledTaskThisLayer: Set<tasks_db> = new Set()
    let sourceToTargetMap = new Map<timestamp, timestamp[]>()
    let targetToSourceMap = new Map<timestamp, timestamp[]>()
    let idTaskMap = new Map<timestamp, tasks_db>()
    let isConnectMap = new Map<timestamp, boolean>()
    console.log('start scheduleTask: ' + task.name)
    let subtasks = task_api.get_subtasks_from_buffer(task.id)
    let subtasks_relations = task_api.get_subtasks_relations_from_buffer(task.id)
    if (subtasks.length === 0) {
      if (task.status !== 'done') {
        console.log('root task has no subtasks, add to scheduledTasks: ' + task.name)
        scheduledTasks.add(task)
      } else {
        console.log('root task has no subtasks and task is done, return empty scheduledTasks: ' + task.name)
      }
      return scheduledTasks
    }
    subtasks_relations.forEach((edge) => {
      let source = edge.source
      let target = edge.target
      if (sourceToTargetMap.has(source)) {
        sourceToTargetMap.get(source)!.push(target)
      } else {
        sourceToTargetMap.set(source, [target])
      }
      if (targetToSourceMap.has(target)) {
        targetToSourceMap.get(target)!.push(source)
      } else {
        targetToSourceMap.set(target, [source])
      }
      isConnectMap.set(source, true)
      isConnectMap.set(target, true)
    })

    if (subtasks_relations.length === 0) {
      console.log('task has no connected task, add all tasks to scheduledTasksThisLayer')
      scheduledTaskThisLayer = new Set([...scheduledTaskThisLayer, ...subtasks])
    } else {
      console.log('task has connected task')
      subtasks.forEach((node) => {
        idTaskMap.set(node.id, node)
        if (!isConnectMap.has(node.id)) {
          scheduledTaskThisLayer.add(node)
          console.log('- task has connected task, but node is not connected, add to scheduledTasksThisLayer: ' + node.name)
        }
      })

      let sourceNodes = new Set(subtasks_relations.map((edge) => edge.source))
      let targetNodes = new Set(subtasks_relations.map((edge) => edge.target))

      let targetNodesNotSourceNodes: Set<timestamp> = new Set([...targetNodes].filter(x => !sourceNodes.has(x)))

      console.log('iterate searching start from targetNodesNotSourceNodes, add to scheduledTasksThisLayer')
      iterateSearching(targetNodesNotSourceNodes, scheduledTaskThisLayer, idTaskMap, targetToSourceMap)
    }


    console.log('scheduledTasksThisLayer: ', scheduledTaskThisLayer)
    scheduledTaskThisLayer.forEach((task) => {
      scheduledTasks = new Set([...scheduledTasks, ...this.scheduleTask(task)])
    })

    return scheduledTasks
  }
}

export const schedule = () => {
  Scheduler.schedule()
  scheduled_tasks.value = [...Scheduler.getSchedule()]
  suspended_tasks.value = [...Scheduler.getSuspendedTasks()]
}
