import { NodeStyle, Task, TaskManager, taskManager } from '../lib/task/Task';
import Graph from '../lib/graph/Graph';

class TaskService {
  private taskManager: TaskManager = taskManager;

  public moveRoot(): void {
    let root = this.taskManager.getRoot();
    this.taskManager.move(root);
  }

  public getPathToRoot(): Task[] {
    let path: Task[] = [];
    let cursor = this.taskManager.getCurser();
    while (cursor.parent !== null) {
      path.push(cursor);
      cursor = this.taskManager.getNode(cursor.parent)!;
    }
    return path;
  }

  public getNowAt(): Task {
    return this.taskManager.getCurser();
  }

  public getGraph(): Graph<Task> {
    return this.taskManager.getGraph();
  }

  public addTask(task: Task, styles: NodeStyle): void {
    this.taskManager.getGraph().addNode(task);
    this.setStyle(task, styles);
  }

  public addEdge(task1: Task, task2: Task): void {
    this.taskManager.getGraph().addEdge(task1.id.toString(), task2.id.toString());
  }

  public setStyle(task: Task, style: NodeStyle): void {
    this.taskManager.setStyle(task, style);
  }

  public setStyleById(id: string, style: NodeStyle): void {
    this.taskManager.getGraph().getNodes().forEach((node) => {
      if (node.id.toString() === id) {
        this.setStyle(node, style);
      }
    });
  }

  public getNode(node: string): Task | undefined {
    return this.taskManager.getNode(node);
  }

  public getStyle(node: Task) {
    return this.taskManager.getStyle(node);
  }
}

const taskService = new TaskService();

export default taskService;

