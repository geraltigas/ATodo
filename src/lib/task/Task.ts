import dayjs from 'dayjs';
import {AppStorage, NodeStyle, Task, TaskDependencyType, TaskId, TaskStatus} from "../../state/tasksAtoms.ts";

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


export const buildTaskStorage = (): AppStorage => {
    const overall: Task = {
        id: dayjs('2023-01-12T00:00:00.123Z').toString(),
        name: 'Overall',
        goal: 'Good Game',
        date: dayjs('2023-01-12T00:00:00.123Z').toString(),
        time: dayjs('2023-01-12T00:00:00.123Z').toString(),
        status: TaskStatus.Created,
        dependencies: {
            dependencyType: TaskDependencyType.And,
        },
        subtasks: {
            nodes: [],
            edges: [],
        },
        parent: null
    };

    const task1: Task = {
        id: dayjs('2023-01-12T00:00:01.001Z').toString(),
        name: 'Task 1',
        goal: 'Task 1 Goal',
        date: dayjs('2023-01-12T00:00:01.001Z').toString(),
        time: dayjs('2023-01-12T00:00:01.001Z').toString(),
        status: TaskStatus.Created,
        dependencies: {
            dependencyType: TaskDependencyType.And,
        },
        subtasks: {
            nodes: [],
            edges: [],
        },
        parent: overall
    };

    const task2: Task = {
        id: dayjs('2023-01-12T00:00:02.002Z').toString(),
        name: 'Task 2',
        goal: 'Task 2 Goal',
        date: dayjs('2023-01-12T00:00:02.002Z').toString(),
        time: dayjs('2023-01-12T00:00:02.002Z').toString(),
        status: TaskStatus.Created,
        dependencies: {
            dependencyType: TaskDependencyType.And,
        },
        subtasks: {
            nodes: [],
            edges: [],
        },
        parent: overall
    };

    const task3: Task = {
        id: dayjs('2023-01-12T00:00:03.003Z').toString(),
        name: 'Task 3',
        goal: 'Task 3 Goal',
        date: dayjs('2023-01-12T00:00:03.003Z').toString(),
        time: dayjs('2023-01-12T00:00:03.003Z').toString(),
        status: TaskStatus.Created,
        dependencies: {
            dependencyType: TaskDependencyType.And,
        },
        subtasks: {
            nodes: [],
            edges: [],
        },
        parent: overall
    };

    const task4: Task = {
        id: dayjs('2023-01-12T00:00:04.004Z').toString(),
        name: 'Task 4',
        goal: 'Task 4 Goal',
        date: dayjs('2023-01-12T00:00:04.004Z').toString(),
        time: dayjs('2023-01-12T00:00:04.004Z').toString(),
        status: TaskStatus.Created,
        dependencies: {
            dependencyType: TaskDependencyType.And,
        },
        subtasks: {
            nodes: [],
            edges: [],
        },
        parent: overall
    };

    overall.subtasks.nodes.push(task1);
    overall.subtasks.nodes.push(task2);
    overall.subtasks.edges.push([task1.id, task2.id]);

    task1.subtasks.nodes.push(task3);
    task1.subtasks.nodes.push(task4);
    task1.subtasks.edges.push([task3.id, task4.id]);

    const styleMap: [TaskId, NodeStyle][] = [];
    styleMap.push([overall.id, {
        position: {
            x: 0,
            y: 0,
        }
    }]);

    styleMap.push([task1.id, {
        position: {
            x: 100,
            y: -150,
        }
    }]);

    styleMap.push([task2.id, {
        position: {
            x: 200,
            y: 150,
        }
    }]);

    styleMap.push([task3.id, {
        position: {
            x: 100,
            y: -50,
        }
    }]);

    styleMap.push([task4.id, {
        position: {
            x: 100,
            y: 50,
        }
    }]);

    return {
        taskStorage: {
            overall: overall,
            nowViewing: overall,
            styleMap: styleMap,
        }
    };
}

//
// class TaskManager {
//   private root: TaskReference = dayjs('2003-01-12T00:00:00.000Z').toString();
//
//   //   {
//   //   id: dayjs('2003-01-12T00:00:00.000Z'),
//   //   name: 'Overall',
//   //   goal: 'Good Game',
//   //   date: null,
//   //   time: null,
//   //   status: TaskStatus.Created,
//   //   dependencies: new TaskDependency(),
//   //   subtasks: new Graph<Task>(),
//   //   parent: null
//   // };
//
//   private cursor: TaskReference = this.root;
//   private tasksMap: Map<string, Task> = new Map<string, Task>();
//   // private styleMap: Map<string, NodeStyle> = new Map<string, NodeStyle>();
//
//   constructor() {
//     // console.log('TaskManager constructor');
//     // objectStoreService.get('tasksMap').then((tasks) => {
//     //   if (tasks) {
//     //     this.tasksMap = new Map<string, Task>(JSON.parse(tasks));
//     //   }
//     // }).then(() => {
//     //   objectStoreService.get('styleMap').then((styles) => {
//     //     if (styles) {
//     //       this.styleMap = new Map<string, NodeStyle>(JSON.parse(styles));
//     //     }
//     //   });
//     // });
//   }
//
//   // public getRoot(): Task {
//   //   if (this.tasksMap.size === 0) {
//   //     return new Task();
//   //   }
//   //   return this.tasksMap.get(this.root)!;
//   // }
//
//   public getCurser(): Task {
//     return this.tasksMap.get(this.cursor)!;
//   }
//
//   // public getGraph(): Graph<Task> {
//   //   let graph = new Graph<Task>();
//   //   let nowAt = this.getCurser();
//   //   nowAt.subtasks.forEachNode((node) => {
//   //     graph.addNode(this.tasksMap.get(node)!);
//   //   });
//   //   nowAt.subtasks.forEachEdge((edge) => {
//   //     graph.addEdge(edge[0], edge[1]);
//   //   });
//   //   return graph;
//   // }
//
//   // public moveUp(): Task {
//   //   const parent = this.getCurser().parent;
//   //   if (parent !== null) {
//   //     this.cursor = parent;
//   //   }
//   //   return this.getCurser();
//   // }
//
//   // public move(task: Task): void {
//   //   this.cursor = task.id.toString();
//   // }
//
//   // findTask(filter: (task: Task) => boolean): Task[] {
//   //   return [];
//   // }
//
//   // public setStyle(task: Task, style: NodeStyle) {
//   //   this.styleMap.set(task.id.toString(), style);
//   // }
//   //
//   // public getStyle(task: Task): NodeStyle | undefined {
//   //   return this.styleMap.get(task.id.toString());
//   // }
//   //
//   // public getNode(node: string): Task | undefined {
//   //   return this.tasksMap.get(node);
//   // }
// }

// const taskManager = new TaskManager();

// export {TaskDependencyType, TaskStatus};
// export type {Task};

