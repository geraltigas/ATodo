import TaskManager, { Task } from '../lib/task/Task';

class TaskService {
  taskManager: TaskManager = new TaskManager();

  addTask(task: Task): void {
    this.taskManager.addTask(task);
  }


}
