import '@testing-library/jest-dom';
import { NodeStyle, TaskDependency, TaskDependencyType, TaskReference, TaskStatus } from '../renderer/lib/task/Task';
import dayjs, { Dayjs } from 'dayjs';
import Graph from '../renderer/lib/graph/Graph';
import { fromJSON, parse, stringify, toJSON } from 'flatted';

// describe('App', () => {
//   it('should render', () => {
//     expect(render(<App />)).toBeTruthy();
//   });
// });

interface Task {
  id: TaskReference;
  name: string;
  goal: string;
  date: Dayjs | null;
  time: Dayjs | null;
  status: TaskStatus;
  // TODO: create a trigger mechanism for status: suspended -> in-progress -> done
  dependencies: TaskDependency;
  subtasks: Graph<Task>;
  parent: Task | null;
}

interface TaskStorage {
  taskStack: Task[];
  styleMap: Map<TaskReference, NodeStyle | null>;
}

describe('App', () => {
  it('testSerializer', () => {
    const taskStorage: TaskStorage = {
      taskStack: [],
      styleMap: new Map<TaskReference, NodeStyle | null>(),
    };

    const overall: Task = {
      id: 'overall',
      name: 'overall',
      goal: 'overall',
      date: dayjs('2021-01-01'),
      time: dayjs('2021-01-01'),
      status: TaskStatus.Created,
      dependencies: {
        dependencyType: TaskDependencyType.And,
      },
      subtasks: {
        nodes: [],
        edges: [],
      },
      parent: null,
    };

    const task1: Task = {
      id: 'task1',
      name: 'task1',
      goal: 'task1',
      date: dayjs('2021-01-01'),
      time: dayjs('2021-01-01'),
      status: TaskStatus.Created,
      dependencies: {
        dependencyType: TaskDependencyType.And,
      },
      subtasks: {
        nodes: [],
        edges: [],
      },
      parent: overall,
    };

    const task2: Task = {
      id: 'task2',
      name: 'task2',
      goal: 'task2',
      date: dayjs('2021-01-01'),
      time: dayjs('2021-01-01'),
      status: TaskStatus.Created,
      dependencies: {
        dependencyType: TaskDependencyType.And,
      },
      subtasks: {
        nodes: [],
        edges: [],
      },
      parent: overall,
    };

    overall.subtasks.nodes.push(task1);
    overall.subtasks.nodes.push(task2);
    overall.subtasks.edges.push([task1.id, task2.id]);

    const task3: Task = {
      id: 'task3',
      name: 'task3',
      goal: 'task3',
      date: dayjs('2021-01-01'),
      time: dayjs('2021-01-01'),
      status: TaskStatus.Created,
      dependencies: {
        dependencyType: TaskDependencyType.And,
      },
      subtasks: {
        nodes: [],
        edges: [],
      },
      parent: task1,
    };

    const task4: Task = {
      id: 'task4',
      name: 'task4',
      goal: 'task4',
      date: dayjs('2021-01-01'),
      time: dayjs('2021-01-01'),
      status: TaskStatus.Created,
      dependencies: {
        dependencyType: TaskDependencyType.And,
      },
      subtasks: {
        nodes: [],
        edges: [],
      },
      parent: task1,
    };

    task1.subtasks.nodes.push(task3);
    task1.subtasks.nodes.push(task4);
    task1.subtasks.edges.push([task3.id, task4.id]);

    taskStorage.taskStack.push(overall);
    taskStorage.taskStack.push(task1);

    taskStorage.styleMap.set(overall.id, {
      position: { x: 0, y: 0 },
    });

    taskStorage.styleMap.set(task1.id, {
      position: { x: 0, y: 0 },
    });

    taskStorage.styleMap.set(task2.id, {
      position: { x: 100, y: 0 },
    });

    taskStorage.styleMap.set(task3.id, {
      position: { x: 0, y: 0 },
    });

    taskStorage.styleMap.set(task4.id, {
      position: { x: 100, y: 0 },
    });

    console.log(taskStorage);

    const serialized = stringify(taskStorage);

    console.log(serialized);

    const deserialized = parse(serialized);

    console.log(deserialized);

    // const taskMap = new Map<string, Task>();
    // const overall: Task = {
    //   id: dayjs('2021-01-01').toString(),
    //   name: 'overall',
    //   goal: 'overall',
    //   date: dayjs('2021-01-01'),
    //   time: dayjs('2021-01-01'),
    //   status: TaskStatus.Created,
    //   dependencies: {
    //     dependencyType: TaskDependencyType.And,
    //   },
    //   subtasks: {
    //     nodes: ['task1', 'task2'],
    //     edges: [['task1', 'task2']],
    //   },
    //   parent: null,
    // };
    // const task1: Task = {
    //   id: dayjs('2021-01-01').toString(),
    //   name: 'task1',
    //   goal: 'task1',
    //   date: dayjs('2021-01-01'),
    //   time: dayjs('2021-01-01'),
    //   status: TaskStatus.Created,
    //   dependencies: {
    //     dependencyType: TaskDependencyType.And,
    //   },
    //   subtasks: {
    //     nodes: ['task3', 'task4'],
    //     edges: [['task3', 'task4']],
    //   },
    //   parent: 'overall',
    // };
    //
    // const task2: Task = {
    //   id: dayjs('2021-01-01').toString(),
    //   name: 'task2',
    //   goal: 'task2',
    //   date: dayjs('2021-01-01'),
    //   time: dayjs('2021-01-01'),
    //   status: TaskStatus.Created,
    //   dependencies: {
    //     dependencyType: TaskDependencyType.And,
    //   },
    //   subtasks: {
    //     nodes: [],
    //     edges: [],
    //   },
    //   parent: 'overall',
    // };
    //
    // const task3: Task = {
    //   id: dayjs('2021-01-01').toString(),
    //   name: 'task3',
    //   goal: 'task3',
    //   date: dayjs('2021-01-01'),
    //   time: dayjs('2021-01-01'),
    //   status: TaskStatus.Created,
    //   dependencies: {
    //     dependencyType: TaskDependencyType.And,
    //   },
    //   subtasks: {
    //     nodes: [],
    //     edges: [],
    //   },
    //   parent: 'overall',
    // };
    //
    // const task4: Task = {
    //   id: dayjs('2021-01-01').toString(),
    //   name: 'task4',
    //   goal: 'task4',
    //   date: dayjs('2021-01-01'),
    //   time: dayjs('2021-01-01'),
    //   status: TaskStatus.Created,
    //   dependencies: {
    //     dependencyType: TaskDependencyType.And,
    //   },
    //   subtasks: {
    //     nodes: [],
    //     edges: [],
    //   },
    //   parent: 'overall',
    // };
    //
    // taskMap.set('overall', overall);
    // taskMap.set('task1', task1);
    // taskMap.set('task2', task2);
    // taskMap.set('task3', task3);
    //
    // const styleMap = new Map<string, NodeStyle>();
    // styleMap.set('overall', {
    //   position: { x: 0, y: 0 },
    // });
    //
    // styleMap.set('task1', {
    //   position: { x: 0, y: 0 },
    // });
    //
    // styleMap.set('task2', {
    //   position: { x: 100, y: 0 },
    // });
    //
    // styleMap.set('task3', {
    //   position: { x: 0, y: 0 },
    // });
    //
    // styleMap.set('task4', {
    //   position: { x: 100, y: 0 },
    // });
    //
    // const storage: TaskStorage = {
    //   taskStack: ['overall'],
    //   taskMap: taskMap,
    //   styleMap: styleMap,
    // };
    //
    // const serialized = JSON.stringify(storage);
    // const deserialized = JSON.parse(serialized);
    // const deserializedStorage: TaskStorage = {
    //   taskStack: deserialized.taskStack,
    //   taskMap: new Map<string, Task>(Object.entries(deserialized.taskMap)),
    //   styleMap: new Map<string, NodeStyle>(
    //     Object.entries(deserialized.styleMap),
    //   ),
    // };
    //
    // console.log(serialized);
    // console.log(deserializedStorage);
    //
    // expect(storage).toEqual(deserializedStorage);
  });
});
