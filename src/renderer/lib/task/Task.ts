import Graph from '../graph/Graph';
import dayjs, { Dayjs } from 'dayjs';

enum TaskStatus {
  Created = 'created',
  InProgress = 'in-progress',
  Suspended = 'suspended',
  Done = 'done',
}

enum TaskDependencyType {
  And = 'and',
}

class TaskDependency {
  dependencyType: TaskDependencyType = TaskDependencyType.And;
  dependencies: Task[] = [];

}

class Task {
  name: string = '';
  goal: string = '';
  date: Dayjs | null = dayjs();
  time: Dayjs | null = dayjs();
  status: TaskStatus = TaskStatus.Created;
  // TODO: create a trigger mechanism for status: suspended -> in-progress -> done
  dependencies: TaskDependency = new TaskDependency();
  subtasks: Graph<Task> = new Graph<Task>();

}

class TaskManager {
  tasks: Graph<Task> = new Graph<Task>();

  addTask(task: Task): void {
    this.tasks.addNode(task);
  }

  findTask(filter: (task: Task) => boolean): Task[] {
    return [];
  }

  setGraph(task: Task): void {
    this.tasks = task.subtasks;
  }
}

export default TaskManager;
export { Task, TaskDependencyType, TaskStatus };
