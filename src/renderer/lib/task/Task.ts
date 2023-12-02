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
  dependencies: TaskReference[] = [];
}

export interface NodeStyle {
  position: {
    x: number;
    y: number;
  };
}

export function combineDateTime(date: Dayjs | null, time: Dayjs | null): Dayjs {
  if (date && time) {
    return dayjs(date)
      .hour(time.hour())
      .minute(time.minute())
      .second(time.second());
  }

  return dayjs();
}

export type TaskReference = string;

class Task {
  name: string = '';
  goal: string = '';
  date: Dayjs | null = dayjs();
  time: Dayjs | null = dayjs();
  status: TaskStatus = TaskStatus.Created;
  // TODO: create a trigger mechanism for status: suspended -> in-progress -> done
  dependencies: TaskDependency = new TaskDependency();
  subtasks: Graph<TaskReference> = new Graph<TaskReference>();
  parent: TaskReference | null = null;
}

// const deepCopyTaskDependency = (obj: TaskDependency, parent: Task): TaskDependency => {
//   return {
//     dependencyType: obj.dependencyType,
//     dependencies: obj.dependencies.map((dep) => deepCopyTask(dep))
//   };
// };

// const deepCopySubtasks = (obj: Graph<Task>, parent: Task): Graph<Task> => {
//   let graph = new Graph<Task>();
//   obj.forEachNode((node) => {
//     graph.addNode(deepCopyTaskWithParent(node, parent));
//   });
//   obj.forEachEdge((edge) => {
//     graph.addEdge(edge[0], edge[1]);
//   });
//   return graph;
// };
//
// const deepCopyTaskWithParent = (obj: Task, parent: Task): Task => {
//   const copy = deepCopyTask(obj);
//   copy.parent = parent;
//   return copy;
// };

// export const deepCopyTask = (obj: Task): Task => {
//   const copy = {
//     id: dayjs(obj.id),
//     name: obj.name,
//     goal: obj.goal,
//     date: dayjs(obj.date),
//     time: dayjs(obj.time),
//     status: obj.status,
//     dependencies: new TaskDependency(),
//     subtasks: new Graph<Task>(),
//     parent: obj.parent
//   };
//   copy.dependencies = deepCopyTaskDependency(obj.dependencies, copy);
//   copy.subtasks = deepCopySubtasks(obj.subtasks, copy);
//   return copy;
// };

export const deepCopyTask = (obj: Task): Task => {
  return JSON.parse(JSON.stringify(obj));
};

class TaskManager {
  private root: TaskReference = dayjs('2003-01-12T00:00:00.000Z').toString();

  //   {
  //   id: dayjs('2003-01-12T00:00:00.000Z'),
  //   name: 'Overall',
  //   goal: 'Good Game',
  //   date: null,
  //   time: null,
  //   status: TaskStatus.Created,
  //   dependencies: new TaskDependency(),
  //   subtasks: new Graph<Task>(),
  //   parent: null
  // };

  private cursor: TaskReference = this.root;
  private tasksMap: Map<string, Task> = new Map<string, Task>();
  private styleMap: Map<string, NodeStyle> = new Map<string, NodeStyle>();

  constructor() {
    // console.log('TaskManager constructor');
    // objectStoreService.get('tasksMap').then((tasks) => {
    //   if (tasks) {
    //     this.tasksMap = new Map<string, Task>(JSON.parse(tasks));
    //   }
    // }).then(() => {
    //   objectStoreService.get('styleMap').then((styles) => {
    //     if (styles) {
    //       this.styleMap = new Map<string, NodeStyle>(JSON.parse(styles));
    //     }
    //   });
    // });
  }

  public getRoot(): Task {
    if (this.tasksMap.size === 0) {
      return new Task();
    }
    return this.tasksMap.get(this.root)!;
  }

  public getCurser(): Task {
    return this.tasksMap.get(this.cursor)!;
  }

  public getGraph(): Graph<Task> {
    let graph = new Graph<Task>();
    let nowAt = this.getCurser();
    nowAt.subtasks.forEachNode((node) => {
      graph.addNode(this.tasksMap.get(node)!);
    });
    nowAt.subtasks.forEachEdge((edge) => {
      graph.addEdge(edge[0], edge[1]);
    });
    return graph;
  }

  public moveUp(): Task {
    const parent = this.getCurser().parent;
    if (parent !== null) {
      this.cursor = parent;
    }
    return this.getCurser();
  }

  // public move(task: Task): void {
  //   this.cursor = task.id.toString();
  // }

  // findTask(filter: (task: Task) => boolean): Task[] {
  //   return [];
  // }

  // public setStyle(task: Task, style: NodeStyle) {
  //   this.styleMap.set(task.id.toString(), style);
  // }
  //
  // public getStyle(task: Task): NodeStyle | undefined {
  //   return this.styleMap.get(task.id.toString());
  // }
  //
  // public getNode(node: string): Task | undefined {
  //   return this.tasksMap.get(node);
  // }
}

const taskManager = new TaskManager();

export { Task, TaskDependencyType, TaskStatus, taskManager, TaskManager };
