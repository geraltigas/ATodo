import dayjs, { Dayjs } from 'dayjs'
import { task_relation_db, tasks_db } from '../../../../types/sql'
import { task_api } from '../../api/task_api'

const globalMinDate = dayjs('1970-01-01T00:00:00')
const globalMaxDate = dayjs('2100-01-01T00:00:00')

// make sure the length of tasks is greater than 0
const getMaxDate = (tasks: tasks_db[]): Dayjs => {
  if (tasks.length === 0) {
    return globalMinDate
  }
  let maxDate: Dayjs = dayjs(tasks[0].deadline)
  tasks.forEach((task) => {
    let taskDate = dayjs(task.deadline)
    if (taskDate.isAfter(maxDate)) {
      maxDate = taskDate
    }
  })
  return maxDate
}

const getMinDate = (tasks: tasks_db[]): Dayjs => {
  if (tasks.length === 0) {
    return globalMaxDate
  }
  let minDate: Dayjs = dayjs(tasks[0].deadline)
  tasks.forEach((task) => {
    let taskDate = dayjs(task.deadline)
    if (taskDate.isBefore(minDate)) {
      minDate = taskDate
    }
  })
  return minDate
}

const getMinTime = (showTaskDeadline: Dayjs, minDate: Dayjs): Dayjs | undefined => {
  let isFirstDay = showTaskDeadline.isSame(minDate, 'day')
  if (isFirstDay) {
    return minDate
  } else {
    return undefined
  }
}

const getMaxTime = (showTaskDeadline: Dayjs, maxDate: Dayjs): Dayjs | undefined => {
  let isLastDay = showTaskDeadline.isSame(maxDate, 'day')
  if (isLastDay) {
    return maxDate
  } else {
    return undefined
  }
}

export const timeConstraints = (showTask: tasks_db): {
  minTime: Dayjs | undefined,
  maxTime: Dayjs | undefined,
  minDate: Dayjs,
  maxDate: Dayjs,
} => {
  if (showTask.parent === null) {
    let subtasks = task_api.get_subtasks_from_buffer(showTask.id)
    let maxDate = getMaxDate(subtasks)
    let showTaskDeadline = dayjs(showTask.deadline)
    return {
      minTime: getMinTime(showTaskDeadline, globalMinDate),
      maxTime: getMaxTime(showTaskDeadline, maxDate),
      minDate: maxDate,
      maxDate: globalMaxDate
    }
  }

  let sources: tasks_db[] = []
  let targets: tasks_db[] = []
  let siblings: tasks_db[] = task_api.get_subtasks_from_buffer(showTask.parent)
  let siblingsEdges: task_relation_db[] = task_api.get_sibling_relations_from_buffer(showTask.parent)
  siblingsEdges.forEach((relation) => {
    if (relation.source === showTask.id) {
      targets.push(siblings.find((sibling) => sibling.id === relation.target)!)
    }
    if (relation.source === showTask.id) {
      sources.push(siblings.find((sibling) => sibling.id === relation.source)!)
    }
  })

  let maxDateOfChildren = getMaxDate(task_api.get_subtasks_from_buffer(showTask.id))
  let maxDateOfSource = getMaxDate(sources)
  let minDateOfTargets = getMinDate(targets)
  let parentDeadline = showTask.parent === -1 ? globalMaxDate : dayjs(task_api.get_task_from_buffer(showTask.parent).deadline)

  let minDate: Dayjs
  let maxDate: Dayjs

  if (maxDateOfChildren.isAfter(maxDateOfSource)) {
    minDate = maxDateOfChildren
  } else {
    minDate = maxDateOfSource
  }

  if (minDateOfTargets.isBefore(parentDeadline)) {
    maxDate = minDateOfTargets
  } else {
    maxDate = parentDeadline
  }

  let showTaskDeadline = dayjs(showTask.deadline)

  return {
    minTime: getMinTime(showTaskDeadline, minDate),
    maxTime: getMaxTime(showTaskDeadline, maxDate),
    minDate: minDate,
    maxDate: maxDate
  }
}
