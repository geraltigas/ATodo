import styles from './Flow.module.css';
import {
    applyNodeChanges,
    Background,
    BackgroundVariant, Connection,
    Controls,
    ReactFlow,
} from 'reactflow';
import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    Dialog,
    Snackbar,
    Step,
    StepConnector,
    stepConnectorClasses,
    StepLabel,
    Stepper,
    styled
} from '@mui/material';
import TaskCreater from '../TaskCreater/TaskCreater';
import {
    NodeStyle,
    Task,
    TaskDependencyType,
    TaskEdgeShow,
    TaskNodeShow,
    TaskStatus,
    TaskStorage
} from '../../lib/task/Task';
import {useAtom} from 'jotai';
import {
    modifiedAtom,
    nodeTypes, originNode,
    showEdgesAtom,
    showNodesAtom, startNode, taskStackAtom, taskStorageGlobalWarp,
} from '../../state/tasksAtoms';
import dayjs from 'dayjs';
import {invoke} from "@tauri-apps/api";
import {parse, stringify} from "flatted";

let callback: (event: KeyboardEvent) => void = (_event: KeyboardEvent) => {
};

let releaseCallback: (event: KeyboardEvent) => void = (_event: KeyboardEvent) => {

};

const doubleClickTime = 200;
let doubeClickCheck: boolean = false;
// const emptyFunction: ()=>void = ()=>{};
// const doubleClickChecker: ()=>void = emptyFunction;

const QontoConnector = styled(StepConnector)(({theme}) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 10,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#784af4',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#784af4',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderTopWidth: 3,
        borderRadius: 1,
    },
}));

const getShowNodesAndEdges: (task: Task, styleMap: [string, NodeStyle][]) => {
    showNodes: TaskNodeShow[],
    showEdges: TaskEdgeShow[]
} = (task: Task, styleMap: [string, NodeStyle][]) => {
    let showNodes: TaskNodeShow[] = [];
    let showEdges: TaskEdgeShow[] = [];

    let subtasks: Task[] = task.subtasks.nodes;

    let styleMap_ = new Map(styleMap);

    subtasks.forEach((value) => {
        let style: NodeStyle = styleMap_.get(value.id) as NodeStyle;
        let taskNodeShow: TaskNodeShow = {
            id: value.id,
            position: style.position,
            type: 'task',
            data: {
                label: value.name,
                realTask: value,
            },
        };
        showNodes.push(taskNodeShow);
    });

    let edges: [string, string][] = task.subtasks.edges;
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


    // showNodes.push(endNode);

    let maxX: number = 0;
    let sumY: number = 0;
    let numY: number = 0;


    task.subtasks.nodes.forEach((value) => {
        let style: NodeStyle = styleMap_.get(value.id) as NodeStyle;
        if (style.position.x > maxX) {
            maxX = style.position.x;
        }
        sumY += style.position.y;
        numY++;
    });

    let avgY: number = sumY / numY;


    showNodes.push(originNode);
    showNodes.push(startNode);

    showNodes.push({
        id: "end",
        position: {
            x: maxX + 100,
            y: avgY,
        },
        type: 'end',
        data: {
            label: "End",
        },
    });

    return {showNodes, showEdges};
}

const saveTasks: (showNodes: TaskNodeShow[], showEdges: TaskEdgeShow[], taskStack: Task[]) => Promise<string> = (showNodes: TaskNodeShow[], showEdges: TaskEdgeShow[], taskStack: Task[]) => {
    let taskStorage: TaskStorage = {
        styleMap: [],
        taskStack: taskStack,
    };

    let topTask: Task = taskStack[taskStack.length - 1];

    let styleMap: [string, NodeStyle][] = [];

    showNodes.forEach((value) => {

        styleMap.push([value.id, {
            position: value.position,
        }]);
    });



    showEdges.forEach((value) => {
        topTask.subtasks.edges = [];
        if (value.source !== "start" && value.target !== "end") {
            console.log(value);
            topTask.subtasks.edges.push([value.source, value.target]);
        }
    });

    taskStorage.styleMap = styleMap;

    taskStorageGlobalWarp.value = taskStorage;
    console.log(taskStorage);

    return invoke<string>("save", {key: "taskStorage", value: stringify(taskStorage)});
}

export default function Flow({
                                 setNowClickNode,
                                 taskToEditId,
                             }: {
    taskToEditId: string | null;
    setNowClickNode: (nodeId: string | null) => void;
}) {
    const flowRef = useRef<HTMLDivElement>(null);
    const nowClickNodeRef = useRef<string | null>(null);
    nowClickNodeRef.current = taskToEditId;

    const [showNodes, setShowNodes] = useAtom(showNodesAtom);
    const [showEdges, setShowEdges] = useAtom(showEdgesAtom);
    const [taskStack, setTaskStack] = useAtom(taskStackAtom);
    const showNodesRef = useRef(showNodes);
    const showEdgesRef = useRef(showEdges);
    const taskStackRef = useRef(taskStack);
    useEffect(() => {
        showNodesRef.current = showNodes;
        showEdgesRef.current = showEdges;
        taskStackRef.current = taskStack;
    }, [showNodes, showEdges, taskStack]);

    useEffect(() => {
        invoke('load', {key: "taskStorage"}).then((res) => {
            let taskStorage: TaskStorage = parse(res as string);
            let nowAtTask: Task = taskStorage.taskStack[taskStorage.taskStack.length - 1];
            let {showNodes, showEdges} = getShowNodesAndEdges(nowAtTask, taskStorage.styleMap);
            taskStorageGlobalWarp.value = taskStorage;
            setShowNodes(showNodes);
            setShowEdges(showEdges);
            setTaskStack([...taskStorage.taskStack]);
        })
        const mousedown: (event: MouseEvent) => void = (event: MouseEvent) => {
            switch (event.button) {
                case 3: // step back
                    setTaskStack((prev) => {
                        prev.pop();
                        return [...prev];
                    });
                    const _task = taskStack[taskStack.length - 1];
                    let {showNodes, showEdges} = getShowNodesAndEdges(_task as Task, taskStorageGlobalWarp.value?.styleMap!);
                    setShowNodes(showNodes);
                    setShowEdges(showEdges);
                    break
                default:
                    break;
            }
        }
        // mouse down
        document.addEventListener('mousedown', mousedown);
        return () => {
            document.removeEventListener('mousedown', mousedown);
        }
    }, []);

    const [nowClickEdge, setNowClickEdge] = useState<string | null>(null);
    const nowClickEdgeRef = useRef(nowClickEdge);
    useEffect(() => {
        nowClickEdgeRef.current = nowClickEdge;
    }, [nowClickEdge]);

    const [taskToEdit, setTaskToEdit] = useState<Task>({
        id: dayjs().toString(),
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
        parent: null,
    });
    const taskToEditRef = useRef(taskToEdit);
    useEffect(() => {
        taskToEditRef.current = taskToEdit;
    }, [taskToEdit]);

    const [isInputing, setIsInputing] = useState(false);
    const isInputingRef = useRef(isInputing);
    useEffect(() => {
        isInputingRef.current = isInputing;
    }, [isInputing]);

    const [showDialog, setShowDialog] = useState(false);
    const showDialogRef = useRef(showDialog);
    useEffect(() => {
        showDialogRef.current = showDialog;
    }, [showDialog]);

    const [ctrlPressed, setCtrlPressed] = useState(false);
    const ctrlPressedRef = useRef(ctrlPressed);
    useEffect(() => {
        ctrlPressedRef.current = ctrlPressed;
    }, [ctrlPressed]);

    const [modified, setModified] = useAtom(modifiedAtom);
    const modifiedRef = useRef(modified);
    useEffect(() => {
        modifiedRef.current = modified;
    }, [modified]);

    const [showAlert, setShowAlert] = useState(false);
    const showAlertRef = useRef(showAlert);
    useEffect(() => {
        showAlertRef.current = showAlert;
    }, [showAlert]);

    const [alertText, setAlertText] = useState("");


    const alertTextRef = useRef(alertText);
    useEffect(() => {
        alertTextRef.current = alertText;
    }, [alertText]);

    const onDialogClose = useCallback(() => {
    }, []);

    const keyDownChecker = useCallback(
        (event: KeyboardEvent) => {
            if (isInputingRef.current) return;
            switch (event.key) {
                case 'a':
                case 'A':
                    setShowDialog((prev) => {
                        return !prev;
                    });
                    break;
                case 'd':
                case 'D':
                    break;
                case 'Escape':
                    setShowDialog(false);
                    break;
                case 'Enter':
                    if (showDialogRef.current) {
                        setShowDialog(false);
                        setShowNodes((prev: TaskNodeShow[]): TaskNodeShow[] => {
                            return [
                                ...prev,
                                {
                                    id: dayjs().toString(),
                                    type: 'task',
                                    position: {
                                        x: 0,
                                        y: 0,
                                    },
                                    data: {
                                        label: taskToEditRef.current.name,
                                        realTask: {...taskToEditRef.current},
                                    },
                                },
                            ];
                        });
                        setTaskToEdit({
                            id: dayjs().toString(),
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
                            parent: null,
                        });

                        // const style: NodeStyle = {
                        //   position: {
                        //     x: flowRef.current?.offsetWidth ? flowRef.current.offsetWidth / 2 : 0,
                        //     y: flowRef.current?.offsetHeight ? flowRef.current.offsetHeight / 2 : 0
                        //   }
                        // };
                        // addTask(taskToEditRef.current, style);
                        // setShowDialog(false);
                    }
                    break;
                case 'Delete':
                    if (nowClickNodeRef.current) {
                        setShowNodes((prev) => {
                            return prev.filter(
                                (value) => value.id !== nowClickNodeRef.current,
                            );
                        });
                        setShowEdges((prev) => {
                            return prev.filter(
                                (value) =>
                                    value.source !== nowClickNodeRef.current &&
                                    value.target !== nowClickNodeRef.current,
                            );
                        });
                        setNowClickNode(null);
                        setModified(true);
                        break;
                    }
                    if (nowClickEdgeRef.current) {
                        setShowEdges((prev) => {
                            return prev.filter(
                                (value) => value.id !== nowClickEdgeRef.current,
                            );
                        });
                        setNowClickEdge(null);
                        setModified(true);
                        break;
                    }
                    break;
                // ctrl + s
                case "Control":
                    setCtrlPressed(true);
                    break;
                case 's':
                    if (ctrlPressedRef.current) {
                        console.log("save");
                        saveTasks(showNodesRef.current, showEdgesRef.current, taskStackRef.current).then((res) => {
                            setAlertText(res);
                            setModified(false);
                        }).catch((err) => {
                            setAlertText(err);
                        }).finally(() => {
                            setShowAlert(true);
                        });
                    }
                    break;
                default:
                    break;
            }
        },
        [showDialog],
    );

    const keyUpChecker = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === "Control") {
                setCtrlPressed(false);
            }
        },
        [showDialog],
    );

    const onMouseEnter = (
        _event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        document.removeEventListener('keydown', callback);
        document.removeEventListener('keyup', releaseCallback);
        document.addEventListener('keydown', keyDownChecker);
        document.addEventListener('keyup', keyUpChecker);
        callback = keyDownChecker;
        releaseCallback = keyUpChecker;
    };

    const onMouseLeave = (
        _event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    ) => {
        document.removeEventListener('keydown', callback);
        document.removeEventListener('keyup', releaseCallback);
        callback = (_event: KeyboardEvent) => {
        };
        releaseCallback = (_event: KeyboardEvent) => {
        };
    };

    const onConnect = (params: Connection) => {
        setShowEdges((prev) => [
            ...prev,
            {
                id: `${params.source}-${params.target}`,
                source: params.source!,
                target: params.target!,
                sourceHandle: params.sourceHandle,
                targetHandle: params.targetHandle,
                animated: true,
            },
        ]);
        setModified(true);
    };

    const onNodeClick = (_event: React.MouseEvent, node: TaskNodeShow) => {
        if (
            node.type === 'origin' ||
            node.type === 'start' ||
            node.type === 'end' ||
            nowClickEdge !== null
        )
            return;


        if (doubeClickCheck) {
            const _task = taskStack[taskStack.length - 1];
            const _node = _task.subtasks.nodes.find((value) => value.id === node.id);
            setTaskStack((prev) => {
                prev.push(_node as Task);
                return [...prev];
            });
            let {showNodes, showEdges} = getShowNodesAndEdges(_node as Task, taskStorageGlobalWarp.value?.styleMap!);
            setShowNodes(showNodes);
            setShowEdges(showEdges);
            doubeClickCheck = false;
        } else {
            doubeClickCheck = true;
            setTimeout(() => {
                doubeClickCheck = false;

            }, doubleClickTime);
        }

        if (node.data.selected) {
            setShowNodes((prev) => {
                prev.forEach((value) => {
                    value.data.selected = false;
                });
                return [...prev];
            });
            setNowClickNode(null);
            return;
        }
        setShowNodes((prev) => {
            prev.forEach((value) => {
                value.data.selected = value.id === node.id;
            });
            return [...prev];
        });
        setNowClickNode(node.id);
    };

    const onEdgeClick = (_event: React.MouseEvent, edge: TaskEdgeShow) => {
        if (edge.id === nowClickEdge) {
            setNowClickEdge(null);
            return;
        }
        setNowClickEdge(edge.id);
    };

    const modifiedClassName = modified ? styles.modifiedBase + ' ' + styles.modified : styles.modifiedBase;

    return (
        <div
            className={styles.Flow}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className={modifiedClassName}></div>
            {nowClickEdge !== null && <div className={styles.edgeInfo}>Selected</div>}
            <Snackbar
                open={showAlert}
                autoHideDuration={2000}
                message={alertText}
            />
            <Stepper nonLinear connector={<QontoConnector/>} className={styles.Stack}>
                {taskStack.map((task) => (
                    <Step key={task.name} completed={false}>
                        <StepLabel>{task.name}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <ReactFlow
                ref={flowRef}
                nodes={showNodes}
                edges={showEdges}
                onNodesChange={(changes) => {
                    setShowNodes((prev) => applyNodeChanges(changes, prev));
                    changes.forEach((value) => {
                        if (value.type === 'position' && value.dragging) {
                            setModified(true);
                        }
                    });
                }}
                onNodeClick={onNodeClick}
                onEdgeClick={onEdgeClick}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background gap={10} color="black" variant={BackgroundVariant.Dots}/>
                <Controls/>
            </ReactFlow>
            <Dialog open={showDialog} onClose={onDialogClose}>
                <div className={styles.Dialog}>
                    <TaskCreater
                        taskToEdit={taskToEdit}
                        setTaskToEdit={setTaskToEdit}
                        setIsInputing={setIsInputing}
                    />
                </div>
            </Dialog>
        </div>
    );
}
