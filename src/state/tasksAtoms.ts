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

export interface Task {
    id: TaskId;
    name: string;
    goal: string;
    date: string;
    time: string;
    status: TaskStatus;
    dependencies: TaskDependency;
    subtasks: Graph<Task>;
    parent: Task | null;
}

export type TaskId = string;

export enum TaskStatus {
    Created = 'created',
    InProgress = 'in-progress',
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

interface Graph<T> {
    nodes: T[];
    edges: Edge[];
}

export interface NodeStyle {
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

export const AppStorageInit: AppStorage = {
    taskStorage: taskStorageInit
}

export const taskToEditInit: Task = {
    id: '',
    name: '',
    goal: '',
    date: dayjs().toString(),
    time: dayjs().toString(),
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
    taskToEdit: taskToEditInit
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

export const taskToEditAtom = atom(
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

export const showDialogAtom = atom(
    (get) => get(AppStateAtom).AppRuntime.showDialog,
    (get, set, update: boolean) => {
        set(AppStateAtom, {
            ...get(AppStateAtom),
            AppRuntime: {
                ...get(AppStateAtom).AppRuntime,
                showDialog: update
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
        if (update.id === get(nowViewingAtom).id) { // TODO: reference update, should update the children and parent's reference
            if (parent !== null) {
                parent.subtasks.nodes.filter((value) => {
                    return value.id !== update.id
                })
                parent.subtasks.nodes.push(update);
                update.parent = parent;
            }
        } else {

        }

        if (update.id == 'overall') {
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
            console.log("modify node id", update.reference)
            // let parent: Task | null = task.parent;
            // let subtasks: Graph<Task> = task.subtasks;
            // let oldTask = parent!.subtasks.nodes.find((value) => value.id === task.id)!;
            // // remove old task
            // parent!.subtasks.nodes.splice(parent!.subtasks.nodes.indexOf(oldTask), 1);
            // // add new task
            // parent!.subtasks.nodes.push(task);
            // // change the reference of the subtask of task
            // subtasks.nodes.forEach((value) => {
            //     value.parent = task;
            // });

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
            let parent: Task | null = task.parent;
            // remove old task
            parent!.subtasks.nodes.splice(parent!.subtasks.nodes.indexOf(task), 1);
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
            let nowViewing = get(nowViewingAtom);
            let subtasks: Graph<Task> = nowViewing.subtasks!;
            console.log(subtasks.edges);
            // remove edge
            let index = subtasks.edges.findIndex((value) => {
                return value[0] === edge[0] && value[1] === edge[1];
            });
            subtasks.edges.splice(index, 1);

            console.log(subtasks.edges);
            set(AppStateAtom, {
                AppStorage: {
                    ...get(AppStateAtom).AppStorage,
                    taskStorage: {
                        ...get(AppStateAtom).AppStorage.taskStorage,
                        nowViewing: {
                            ...get(AppStateAtom).AppStorage.taskStorage.nowViewing,
                            subtasks: {
                                ...get(AppStateAtom).AppStorage.taskStorage.nowViewing.subtasks!,
                                edges: subtasks.edges
                            }
                        }
                    }
                },
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
                if (style.position.x > maxX) {
                    maxX = style.position.x;
                }
                sumY += style.position.y;
                numY++;
            });
            if (numY === 0) {
                sumY = 0;
                numY = 1;
            }
        } else {
            maxX = 50;
            sumY = 0;
            numY = 1;
        }

        let avgY: number = sumY / numY;

        showNodes.push({
            id: "end",
            position: {
                x: maxX + 100,
                y: avgY,
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
        });

        let sourceSet: Set<string> = new Set<string>();
        let targetSet: Set<string> = new Set<string>();

        showEdges.forEach((value) => {
            sourceSet.add(value.source);
            targetSet.add(value.target);
        });

        let intersection: Set<string> = new Set<string>([...sourceSet].filter(x => targetSet.has(x)));

        let sourceMtarget: Set<string> = new Set<string>([...sourceSet].filter(x => !intersection.has(x)));
        let targetMsource: Set<string> = new Set<string>([...targetSet].filter(x => !intersection.has(x)));

        sourceMtarget.forEach((value) => {
            showEdges.push({
                id: `${value}-start`,
                source: "start",
                target: value,
                sourceHandle: "start-node-source",
                targetHandle: "task-node-target",
                animated: true,
            });
        });

        targetMsource.forEach((value) => {
            showEdges.push({
                id: `${value}-end`,
                source: value,
                target: "end",
                sourceHandle: "task-node-source",
                targetHandle: "end-node-target",
                animated: true,
            });
        });

        if (targetMsource.size === 0 && sourceMtarget.size === 0) {
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
                });
            }
        }

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
