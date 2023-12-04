import {atom} from 'jotai';
import {Position} from 'reactflow';
import StartNode from '../components/Nodes/StartNode/StartNode';
import EndNode from '../components/Nodes/EndNode/EndNode';
import TaskNode from '../components/Nodes/TaskNode/TaskNode';
import OriginNode from '../components/Nodes/OriginNode/OriginNode';
import {TaskNodeShow} from "../lib/task/Task.ts";
import dayjs from "dayjs";

export const startNode: TaskNodeShow = {
    id: 'start',
    type: 'start',
    position: {
        x: 0,
        y: 0,
    },
    data: {
        label: '',
    },
    targetPosition: Position.Right,
};

export const endNode: TaskNodeShow = {
    id: 'end',
    type: 'end',
    position: {
        x: 200,
        y: 0,
    },
    data: {
        label: '',
    },
    sourcePosition: Position.Left,
};


export const nodeTypes = {
    start: StartNode,
    end: EndNode,
    task: TaskNode,
    origin: OriginNode,
};

export const originNode: TaskNodeShow = {
    id: 'origin',
    type: 'origin',
    position: {
        x: 0,
        y: 0,
    },
    draggable: false,
    selectable: false,
    data: {
        label: '',
    },
};

interface AppState {
    AppStorage: AppStorage;
    AppRuntime: AppRuntime;
}

// persistant
interface AppStorage {
    taskStorage: TaskStorage;
}

type Node = Task;

// runtime
interface AppRuntime {
    isModified: boolean;
    nowSelected: {
        type: 'node' | 'edge' | null;
        reference: Node | Edge | null;
    },
    showAlert: boolean;
    alertMessage: string;
}

interface TaskStorage {
    overall: Task;
    nowViewing: Task;
    styleMap: [TaskId, NodeStyle][];
}

interface Task {
    id: TaskId;
    name: string;
    goal: string;
    date: string;
    time: string;
    status: TaskStatus;
    // TODO: create a trigger mechanism for status: suspended -> in-progress -> done
    dependencies: TaskDependency;
    subtasks: Graph<Task> | null;
    parent: Task | null;
}

type TaskId = string;

enum TaskStatus {
    Created = 'created',
    InProgress = 'in-progress',
    Suspended = 'suspended',
    Done = 'done',
}

interface TaskDependency {
    dependencyType: TaskDependencyType;
}

enum TaskDependencyType {
    And = 'and',
}

type Edge = [string, string];

interface Graph<T> {
    nodes: T[];
    edges: Edge[];
}

interface NodeStyle {
    position: {
        x: number;
        y: number;
    };
}

const overallInit: Task = {
    id: dayjs('2003-01-12T00:00:00.000Z').toString(),
    name: 'Overall',
    goal: 'Good Game',
    date: dayjs('2103-01-12T00:00:00.000Z').toString(),
    time: dayjs('2103-01-12T00:00:00.000Z').toString(),
    status: TaskStatus.Created,
    dependencies: {
        dependencyType: TaskDependencyType.And,
    },
    subtasks: {
        nodes: [],
        edges: [],
    },
    parent: null
}

const taskStorageInit: TaskStorage = {
    overall: overallInit,
    nowViewing: overallInit,
    styleMap: []
}

const AppStorageInit: AppStorage = {
    taskStorage: taskStorageInit
}

const AppRuntimeInit: AppRuntime = {
    isModified: false,
    nowSelected: {
        type: null,
        reference: null,
    },
    showAlert: false,
    alertMessage: '',
}

const AppStateAtom = atom<AppState>({
    AppStorage: AppStorageInit,
    AppRuntime: AppRuntimeInit
});

export let taskStorageGlobalWarp: { value: TaskStorage | null } = {value: null};

export const showAlertAtom = atom(
    (get) => get(AppStateAtom).AppRuntime.showAlert,
    (get, set, update: boolean) => {
        set(AppStateAtom, {
            ...get(AppStateAtom),
            AppRuntime: {
                ...get(AppStateAtom).AppRuntime,
                showAlert: update
            }
        })
    });

export const alertMessageAtom = atom(
    (get) => get(AppStateAtom).AppRuntime.alertMessage,
    (get, set, update: string) => {
        set(AppStateAtom, {
            ...get(AppStateAtom),
            AppRuntime: {
                ...get(AppStateAtom).AppRuntime,
                alertMessage: update
            }
        })
    });

export const taskStackAtom = atom(
    (get) => {
        let nowViewing = get(AppStateAtom).AppStorage.taskStorage.nowViewing;
        let taskStack: Task[] = [];
        while (nowViewing !== null) {
            taskStack.push(nowViewing);
            nowViewing = nowViewing.parent!;
        }
        return taskStack;
    });

export const nowViewingAtom = atom(
    (get) => get(AppStateAtom).AppStorage.taskStorage.nowViewing,
    (get, set, update: Task) => {
        set(AppStateAtom, {
            ...get(AppStateAtom),
            AppStorage: {
                ...get(AppStateAtom).AppStorage,
                taskStorage: {
                    ...get(AppStateAtom).AppStorage.taskStorage,
                    nowViewing: update
                }
            }
        })
    });

export const showNodesAtom = atom<TaskNodeShow[]>(
    (get) => {
        return []
    },
    (get, set, update: TaskNodeShow[]) => {
        
    }
);


// const showNodesAtom = atom<TaskNodeShow[]>([originNode, startNode, endNode]);
// const showEdgesAtom = atom<TaskEdgeShow[]>([]);
// const taskStackAtom = atom<Task[]>([]);
// const modifiedAtom = atom<boolean>(false);
//
// const taskToEditBoardIdAtom = atom<string | null>(null);
//
// const taskToEditBoardAtom = atom(
//     (get) => {
//         const nodes = get(showNodesAtom);
//         const editId = get(taskToEditBoardIdAtom);
//         return nodes.find((node) => node.id === editId) || null;
//     },
//     (get, set, update: TaskNodeShow) => {
//         const nodes = get(showNodesAtom);
//         const editedNodes = nodes.map((node) =>
//             node.id === update.id ? update : node,
//         );
//         set(showNodesAtom, editedNodes);
//     },
// );

export {
    // taskToEditBoardAtom,
    // taskToEditBoardIdAtom,
    // showNodesAtom,
    // showEdgesAtom,
    // taskStackAtom,
    // modifiedAtom
};
