import {atom} from 'jotai';
import {Position} from 'reactflow';
import StartNode from '../components/Nodes/StartNode/StartNode';
import EndNode from '../components/Nodes/EndNode/EndNode';
import TaskNode from '../components/Nodes/TaskNode/TaskNode';
import OriginNode from '../components/Nodes/OriginNode/OriginNode';
import dayjs from "dayjs";
import {CSSProperties} from "react";
import {updateReference} from "../hooks/useEvent.ts";

export const startNode: TaskNodeShow = {
    id: 'start',
    type: 'start',
    position: {
        x: 0,
        y: 0,
    },
    selectable: false,
    draggable: false,
    data: {
        label: '',
    },
    targetPosition: Position.Right,
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

// persistent
export interface AppStorage {
    taskStorage: TaskStorage;
}

type Node = Task;

// runtime
interface AppRuntime {
    isModified: boolean;
    nowSelected: nowSelected;
    showAlert: boolean;
    alertMessage: string;
    showDialog: boolean;
    isInputting: boolean;
    enteredFlow: boolean;
    selectedMap: Map<string, boolean>;
    taskToEdit: Task;
    copiedTask: Task | null;
    workerOpen: boolean;
}

interface nowSelected {
    type: 'node' | 'edge' | 'delete-node' | 'delete-edge' | 'modify-node' | null;
    reference: Node | Edge | null;
}

export interface TaskStorage {
    overall: Task;
    nowViewing: Task;
    styleMap: [TaskId, NodeStyle][];
}

export interface TimeRecord {
    minutes: number;
    seconds: number;
    hours: number;
}

export enum SuspendedType {
    Time = 'time',
    Cyclicality = 'cyclicality',
    Email = 'email',
    Constructing = 'constructing',
    Unsupported = 'unsupported',
}

export interface TimeTrigger {
    time: string;
}

export interface EmailTrigger {
    email: string;
}

export interface ConstructingTrigger {
    why: string;
}

export interface UnsupportedTrigger {
    why: string;
}

export interface CyclicalityTrigger {
    interval: string;
    nowAt: number;
    lastTime: string;
}

export const getInitSuspendedInfo = (type: SuspendedType): SuspendedInfo => {
    switch (type) {
        case SuspendedType.Time:
            return {
                type: SuspendedType.Time,
                trigger: {
                    time: dayjs().add(1, 'hour').toString(),
                }
            }
        case SuspendedType.Email:
            return {
                type: SuspendedType.Email,
                trigger: {
                    email: '',
                }
            }
        case SuspendedType.Unsupported:
            return {
                type: SuspendedType.Unsupported,
                trigger: {
                    why: '',
                }
            }
        case SuspendedType.Constructing:
            return {
                type: SuspendedType.Constructing,
                trigger: {
                    why: '',
                }
            }
        case SuspendedType.Cyclicality:
            return {
                type: SuspendedType.Cyclicality,
                trigger: {
                    interval: "1",
                    nowAt: 0,
                    // dayjs() take the date , and set time to 4 am
                    lastTime: dayjs().hour(4).minute(0).second(0).millisecond(0).toString(),
                }
            }
    }
}

interface SuspendedInfo {
    type: SuspendedType;
    trigger: TimeTrigger | EmailTrigger | ConstructingTrigger | UnsupportedTrigger | CyclicalityTrigger;
}

export interface Task {
    id: TaskId;
    name: string;
    goal: string;
    deadline: string;
    timeConsumed: TimeRecord;
    status: TaskStatus;
    dependencies: TaskDependency;
    subtasks: Graph<Task>;
    parent: Task | null;
    info: SuspendedInfo | null;
}

export type TaskId = string;

export enum TaskStatus {
    Created = 'created',
    InProgress = 'in-progress',
    Paused = 'paused',
    Suspended = 'suspended',
    Done = 'done',
}

export interface TaskDependency {
    dependencyType: TaskDependencyType;
}

export enum TaskDependencyType {
    And = 'and',
}

export type Edge = [string, string];

export interface Graph<T> {
    nodes: T[];
    edges: Edge[];
}

export interface NodeStyle {
    position: {
        x: number;
        y: number;
    };
}

export const overallInit: Task = {
    id: dayjs('2003-01-12T00:00:00.000Z').toString(),
    name: 'Overall',
    goal: 'Good Game',
    deadline: dayjs('2100-01-01T00:00:00.000Z').toString(),
    timeConsumed: {
        minutes: 0,
        seconds: 0,
        hours: 0,
    },
    status: TaskStatus.Created,
    dependencies: {
        dependencyType: TaskDependencyType.And,
    },
    subtasks: {
        nodes: [],
        edges: [],
    },
    parent: null,
    info: null,
}

const taskStorageInit: TaskStorage = {
    overall: overallInit,
    nowViewing: overallInit,
    styleMap: []
}

export const AppStorageInit: AppStorage = {
    taskStorage: taskStorageInit
}

export const taskToEditInit: Task = {
    id: '',
    name: '',
    goal: '',
    deadline: dayjs().toString(),
    timeConsumed: {
        minutes: 0,
        seconds: 0,
        hours: 0,
    },
    status: TaskStatus.Created,
    dependencies: {
        dependencyType: TaskDependencyType.And,
    },
    subtasks: {
        nodes: [],
        edges: [],
    },
    parent: null,
    info: null,
}

const AppRuntimeInit: AppRuntime = {
    isModified: false,
    nowSelected: {
        type: null,
        reference: null,
    },
    showAlert: false,
    alertMessage: '',
    showDialog: false,
    isInputting: false,
    enteredFlow: true,
    selectedMap: new Map<string, boolean>(),
    taskToEdit: taskToEditInit,
    copiedTask: null,
    workerOpen: false,
}

const AppStateAtom = atom<AppState>({
    AppStorage: AppStorageInit,
    AppRuntime: AppRuntimeInit
});

export const AppStorageAtom = atom(
    (get) => get(AppStateAtom).AppStorage,
    (get, set, update: AppStorage) => {
        set(AppStateAtom, {
            ...get(AppStateAtom),
            AppStorage: update
        })
    }
);

export const workerOpenAtom = atom(
    (get) => get(AppStateAtom).AppRuntime.workerOpen,
    (get, set, update: boolean) => {
        set(AppStateAtom, {
            ...get(AppStateAtom),
            AppRuntime: {
                ...get(AppStateAtom).AppRuntime,
                workerOpen: update
            }
        })
    });
atom(
    (get) => get(AppStateAtom).AppRuntime.taskToEdit,
    (get, set, update: Task) => {
        set(AppStateAtom, {
            ...get(AppStateAtom),
            AppRuntime: {
                ...get(AppStateAtom).AppRuntime,
                taskToEdit: update
            }
        })
    });
export const copiedTaskAtom = atom(
    (get) => get(AppStateAtom).AppRuntime.copiedTask,
    (get, set, update: Task) => {
        set(AppStateAtom, {
            ...get(AppStateAtom),
            AppRuntime: {
                ...get(AppStateAtom).AppRuntime,
                copiedTask: update
            }
        })
    });

export const selectedMapAtom = atom(
    (get) => get(AppStateAtom).AppRuntime.selectedMap,
    (get, set, update: Map<string, boolean>) => {
        set(AppStateAtom, {
            ...get(AppStateAtom),
            AppRuntime: {
                ...get(AppStateAtom).AppRuntime,
                selectedMap: update
            }
        })
    });

export const isInputtingAtom = atom(
    (get) => get(AppStateAtom).AppRuntime.isInputting,
    (get, set, update: boolean) => {
        set(AppStateAtom, {
            ...get(AppStateAtom),
            AppRuntime: {
                ...get(AppStateAtom).AppRuntime,
                isInputting: update
            }
        })
    });

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

export const enteredFlowAtom = atom(
    (get) => get(AppStateAtom).AppRuntime.enteredFlow,
    (get, set, update: boolean) => {
        set(AppStateAtom, {
            ...get(AppStateAtom),
            AppRuntime: {
                ...get(AppStateAtom).AppRuntime,
                enteredFlow: update
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

        let parent = update.parent
        if (update.id === get(nowViewingAtom).id) {
            if (parent !== null) {
                let index = parent.subtasks.nodes.findIndex((value) => {
                    return value.id === update.id;
                });
                parent.subtasks.nodes[index] = update;
            }
        } else {

        }

        if (update.parent === null) {
            set(AppStateAtom, {
                ...get(AppStateAtom),
                AppStorage: {
                    ...get(AppStateAtom).AppStorage,
                    taskStorage: {
                        ...get(AppStateAtom).AppStorage.taskStorage,
                        overall: update,
                    }
                }
            })
        }


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


export const isModifiedAtom = atom(
    (get) => get(AppStateAtom).AppRuntime.isModified,
    (get, set, update: boolean) => {
        set(AppStateAtom, {
            ...get(AppStateAtom),
            AppRuntime: {
                ...get(AppStateAtom).AppRuntime,
                isModified: update
            }
        })
    });

export const nowSelectedAtom = atom(
    (get) => get(AppStateAtom).AppRuntime.nowSelected,
    (get, set, update: nowSelected) => {
        if (update.type === 'modify-node') {
            let nowViewing = get(nowViewingAtom);
            let oldTask = nowViewing.subtasks.nodes.find((value) => value.id === (update.reference! as Task).id)!;
            // remove old task
            nowViewing.subtasks.nodes.splice(nowViewing.subtasks.nodes.indexOf(oldTask), 1);
            // add new task
            nowViewing.subtasks.nodes.push(update.reference! as Task);
            // change the reference of the subtask of task
            updateReference(update.reference as Task);
            let newNowViewing = {...nowViewing};
            updateReference(newNowViewing);
            set(nowViewingAtom, newNowViewing);
            set(AppStateAtom, {
                ...get(AppStateAtom),
                AppRuntime: {
                    ...get(AppStateAtom).AppRuntime,
                    nowSelected: {
                        type: 'node',
                        reference: update.reference
                    }
                }
            });
            set(isModifiedAtom, true);
        } else if (update.type === 'delete-node') {
            console.log("delete node id", update.reference)
            let task: Task = update.reference as Task;
            let parent: Task = task.parent!;
            // remove old task
            let index = parent.subtasks.nodes.findIndex((value) => {
                return value.id === task.id;
            });
            parent.subtasks.nodes.splice(index, 1);
            let newTask = {...parent};
            // remove related edges
            let edges: Edge[] = newTask.subtasks.edges;
            let newEdges: Edge[] = [];
            edges.forEach((value) => {
                if (value[0] !== task.id && value[1] !== task.id) {
                    newEdges.push(value);
                }
            });
            newTask.subtasks.edges = newEdges;
            // remove styleMap
            let styleMap: [TaskId, NodeStyle][] = [...get(styleMapAtom)];
            let newStyleMap: [TaskId, NodeStyle][] = [];
            styleMap.forEach((value) => {
                if (value[0] !== task.id) {
                    newStyleMap.push(value);
                }
            });
            set(styleMapAtom, newStyleMap);
            updateReference(newTask);
            set(nowViewingAtom, newTask);
            // change the reference of the subtask of task
            set(AppStateAtom, {
                ...get(AppStateAtom),
                AppRuntime: {
                    ...get(AppStateAtom).AppRuntime,
                    nowSelected: {
                        type: null,
                        reference: null
                    }
                }
            })
        } else if (update.type === 'delete-edge') {
            console.log("delete edge id", update.reference)
            let edge: Edge = update.reference as Edge;
            let newNowViewing = {...get(nowViewingAtom)};
            let subtasks: Graph<Task> = newNowViewing.subtasks!;
            // remove edge
            let index = subtasks.edges.findIndex((value) => {
                return value[0] === edge[0] && value[1] === edge[1];
            });
            subtasks.edges.splice(index, 1);
            updateReference(newNowViewing);
            set(nowViewingAtom, newNowViewing);
            set(AppStateAtom, {
                ...get(AppStateAtom),
                AppRuntime: {
                    ...get(AppStateAtom).AppRuntime,
                    nowSelected: {
                        type: null,
                        reference: null
                    }
                }
            })
        } else {
            set(AppStateAtom, {
                ...get(AppStateAtom),
                AppRuntime: {
                    ...get(AppStateAtom).AppRuntime,
                    nowSelected: update
                }
            })
        }

    });

export const showNodesAtom = atom(
    (get) => {
        let nowViewing = get(nowViewingAtom);
        let _nodeStyleMap = get(styleMapAtom);
        let showNodes: TaskNodeShow[] = [];

        const nodeStyleMap = new Map(_nodeStyleMap);

        // console.log(nodeStyleMap);

        nowViewing.subtasks!.nodes.forEach((node) => {
            showNodes.push({
                id: node.id,
                type: 'task',
                position: nodeStyleMap.get(node.id)!.position,
                data: {
                    label: node.name,
                    realTask: node,
                    selected: get(selectedMapAtom).get(node.id) || false
                },
            });
        });

        showNodes.push(originNode);
        showNodes.push(startNode);

        let maxX: number = 0;
        let sumY: number = 0;
        let numY: number = 0;

        if (nowViewing.subtasks) {
            nowViewing.subtasks.nodes.forEach((value) => {
                let style: NodeStyle = nodeStyleMap.get(value.id)!;
                if (style.position.x + value.name.length * 9 > maxX) {
                    maxX = style.position.x + value.name.length * 9;
                }
                sumY += style.position.y;
                numY++;
            });
        }

        let avgY: number = sumY / numY;

        if (numY === 0) {
            avgY = -7;
        }

        showNodes.push({
            id: "end",
            position: {
                x: maxX + 80,
                y: avgY + 7,
            },
            type: 'end',
            selectable: false,
            draggable: false,
            data: {
                label: "End",
            },
        });
        return showNodes;
    },
    (get, set, update: TaskNodeShow[]) => {
        let styleMap: [TaskId, NodeStyle][] = [...get(styleMapAtom)];

        update.forEach((value) => {
            if (value.id === "start" || value.id === "end" || value.id === "origin") {
                return;
            }
            let index = styleMap.findIndex((style) => {
                return style[0] === value.id;
            });
            if (index === -1) {
                styleMap.push([value.id, {
                    position: {
                        x: 0,
                        y: 0
                    }
                }]);
            } else {
                styleMap[index] = [value.id, {
                    position: value.position
                }];
            }
        });

        set(AppStateAtom, {
            ...get(AppStateAtom),
            AppStorage: {
                ...get(AppStateAtom).AppStorage,
                taskStorage: {
                    ...get(AppStateAtom).AppStorage.taskStorage,
                    styleMap: styleMap
                }
            }
        })
    },
);

export const styleMapAtom = atom(
    (get) => {
        return get(AppStateAtom).AppStorage.taskStorage.styleMap;
    },
    (get, set, update: [TaskId, NodeStyle][]) => {
        set(AppStateAtom, {
            ...get(AppStateAtom),
            AppStorage: {
                ...get(AppStateAtom).AppStorage,
                taskStorage: {
                    ...get(AppStateAtom).AppStorage.taskStorage,
                    styleMap: update
                }
            }
        })
    },
);

export const showEdgesAtom = atom(
    (get) => {
        let connectedMap: Map<string, boolean> = new Map<string, boolean>();
        let nowViewing = get(nowViewingAtom);
        let showEdges: TaskEdgeShow[] = [];

        if (nowViewing.subtasks === null) {
            return showEdges;
        }

        let edges: Edge[] = nowViewing.subtasks.edges;
        edges.forEach((edge) => {
            showEdges.push({
                id: `${edge[0]}-${edge[1]}`,
                source: edge[0],
                target: edge[1],
                sourceHandle: "task-node-source",
                targetHandle: "task-node-target",
                animated: true,
            });
            connectedMap.set(edge[0], true);
            connectedMap.set(edge[1], true);
        });

        let sourceSet: Set<string> = new Set<string>();
        let targetSet: Set<string> = new Set<string>();

        showEdges.forEach((value) => {
            sourceSet.add(value.source);
            targetSet.add(value.target);
        });

        let intersection: Set<string> = new Set<string>([...sourceSet].filter(x => targetSet.has(x)));

        let sourcetarget: Set<string> = new Set<string>([...sourceSet].filter(x => !intersection.has(x)));
        let targetsource: Set<string> = new Set<string>([...targetSet].filter(x => !intersection.has(x)));

        sourcetarget.forEach((value) => {
            showEdges.push({
                id: `${value}-start`,
                source: "start",
                target: value,
                sourceHandle: "start-node-source",
                targetHandle: "task-node-target",
                animated: true,
            });
            connectedMap.set(value, true);
        });

        targetsource.forEach((value) => {
            showEdges.push({
                id: `${value}-end`,
                source: value,
                target: "end",
                sourceHandle: "task-node-source",
                targetHandle: "end-node-target",
                animated: true,
            });
            connectedMap.set(value, true);
        });

        if (targetsource.size === 0 && sourcetarget.size === 0) {
            if (nowViewing.subtasks.nodes.length === 0) {
                showEdges.push({
                    id: `start-end`,
                    source: "start",
                    target: "end",
                    sourceHandle: "start-node-source",
                    targetHandle: "end-node-target",
                    animated: true,
                });
            } else {
                nowViewing.subtasks.nodes.forEach((value) => {
                    showEdges.push({
                        id: `${value.id}-end`,
                        source: value.id,
                        target: "end",
                        sourceHandle: "task-node-source",
                        targetHandle: "end-node-target",
                        animated: true,
                    });
                    showEdges.push({
                        id: `start-${value.id}`,
                        source: "start",
                        target: value.id,
                        sourceHandle: "start-node-source",
                        targetHandle: "task-node-target",
                        animated: true,
                    });
                    connectedMap.set(value.id, true);
                });
            }
        }

        nowViewing.subtasks.nodes.forEach((value) => {
            if (!connectedMap.has(value.id)) {
                // start to node
                showEdges.push({
                    id: `start-${value.id}`,
                    source: "start",
                    target: value.id,
                    sourceHandle: "start-node-source",
                    targetHandle: "task-node-target",
                    animated: true,
                });
                // node to end
                showEdges.push({
                    id: `${value.id}-end`,
                    source: value.id,
                    target: "end",
                    sourceHandle: "task-node-source",
                    targetHandle: "end-node-target",
                    animated: true,
                });
            }
        });


        return showEdges;
    },
    (get, set, update: TaskEdgeShow[]) => {
        let edges: Edge[] = update.map((edge) => {
            return [edge.source, edge.target];
        });
        set(AppStateAtom, {
            ...get(AppStateAtom),
            AppStorage: {
                ...get(AppStateAtom).AppStorage,
                taskStorage: {
                    ...get(AppStateAtom).AppStorage.taskStorage,
                    nowViewing: {
                        ...get(AppStateAtom).AppStorage.taskStorage.nowViewing,
                        subtasks: {
                            ...get(AppStateAtom).AppStorage.taskStorage.nowViewing.subtasks!,
                            edges: edges
                        }
                    }
                }
            }
        })
    },
);


// UI related
export interface TaskEdgeShow {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string | null | undefined;
    targetHandle?: string | null | undefined;
    animated?: boolean;
}

export interface TaskNodeShow {
    id: string;
    position: {
        x: number;
        y: number;
    };
    type?: string;
    style?: CSSProperties;
    draggable?: boolean;
    selectable?: boolean;
    data: {
        label: string;
        selected?: boolean;
        realTask?: Task;
    };
    sourcePosition?: Position | undefined;
    targetPosition?: Position | undefined;
}
