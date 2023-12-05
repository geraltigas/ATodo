import styles from './Flow.module.css';
import {applyNodeChanges, Background, BackgroundVariant, Controls, ReactFlow,} from 'reactflow';
import React, {useEffect, useRef,} from 'react';
import {Dialog, Snackbar, Step, StepLabel, Stepper,} from '@mui/material';
import {useAtom, useSetAtom} from 'jotai';
import {
    AppStorage,
    AppStorageAtom,
    isModifiedAtom,
    nodeTypes,
    nowSelectedAtom,
    showAlertAtom,
    showDialogAtom,
    showEdgesAtom,
    showNodesAtom,
    taskStackAtom,
} from '../../state/tasksAtoms';
import TaskCreate from "../TaskCreater/TaskCreate.tsx";
import {invoke} from "@tauri-apps/api";
import {parse} from 'flatted';
import {useOnConnect, useOnEdgeClick, useOnMouseEnter, useOnMouseLeave, useOnNodeClick} from "../../hooks/useEvent.ts";
// import {parse, stringify} from "flatted";

// let callback: (event: KeyboardEvent) => void | null = null;
//
// let releaseCallback: (event: KeyboardEvent) => void | null = null;
//
// const doubleClickTime = 200;
// let doubeClickCheck: boolean = false;
// const emptyFunction: ()=>void = ()=>{};
// const doubleClickChecker: ()=>void = emptyFunction;

// const saveTasks: (showNodes: TaskNodeShow[], showEdges: TaskEdgeShow[], taskStack: Task[]) => Promise<string> = (showNodes: TaskNodeShow[], showEdges: TaskEdgeShow[], taskStack: Task[]) => {
//     let taskStorage: TaskStorage = {
//         styleMap: [],
//         taskStack: taskStack,
//     };
//
//     let topTask: Task = taskStack[taskStack.length - 1];
//
//     let styleMap: [string, NodeStyle][] = [];
//
//     showNodes.forEach((value) => {
//
//         styleMap.push([value.id, {
//             position: value.position,
//         }]);
//     });
//
//
//     showEdges.forEach((value) => {
//         topTask.subtasks.edges = [];
//         if (value.source !== "start" && value.target !== "end") {
//             console.log(value);
//             topTask.subtasks.edges.push([value.source, value.target]);
//         }
//     });
//
//     taskStorage.styleMap = styleMap;
//
//     taskStorageGlobalWarp.value = taskStorage;
//     console.log(taskStorage);
//
//     return invoke<string>("save", {key: "taskStorage", value: stringify(taskStorage)});
// }

export default function Flow({
                                 // setNowClickNode,
                                 // taskToEditId,
                             }: {
    // taskToEditId: string | null;
    // setNowClickNode: (nodeId: string | null) => void;
}) {
    const flowRef = useRef<HTMLDivElement>(null);
    // const nowClickNodeRef = useRef<string | null>(null);
    // nowClickNodeRef.current = taskToEditId;

    const setAppStorage = useSetAtom(AppStorageAtom);
    const [showNodes, setShowNodes] = useAtom(showNodesAtom);
    const [showEdges, _setShowEdges] = useAtom(showEdgesAtom);
    const [taskStack, _setTaskStack] = useAtom(taskStackAtom);


    useEffect(() => {
        invoke<string>('load', {key: "taskStorage"}).then((res) => {
            let taskStorage: AppStorage = parse(res as string);
            setAppStorage(taskStorage);
        })
        const mousedown: (event: MouseEvent) => void = (_event: MouseEvent) => {
            // switch (event.button) {
            //     case 3: // step back
            //         setTaskStack((prev) => {
            //             prev.pop();
            //             return [...prev];
            //         });
            //         const _task = taskStack[taskStack.length - 1];
            //         let {
            //             showNodes,
            //             showEdges
            //         } = getShowNodesAndEdges(_task as Task, taskStorageGlobalWarp.value?.styleMap!);
            //         setShowNodes(showNodes);
            //         setShowEdges(showEdges);
            //         break
            //     default:
            //         break;
            // }
        }
        // mouse down
        document.addEventListener('mousedown', mousedown);
        return () => {
            document.removeEventListener('mousedown', mousedown);
        }
    }, []);

    // const showNodesRef = useRef(showNodes);
    // const showEdgesRef = useRef(showEdges);
    // const taskStackRef = useRef(taskStack);
    // useEffect(() => {
    //     showNodesRef.current = showNodes;
    //     showEdgesRef.current = showEdges;
    //     taskStackRef.current = taskStack;
    // }, [showNodes, showEdges, taskStack]);

    // useEffect(() => {
    //     invoke('load', {key: "taskStorage"}).then((res) => {
    //         let taskStorage: TaskStorage = parse(res as string);
    //         let nowAtTask: Task = taskStorage.taskStack[taskStorage.taskStack.length - 1];
    //         let {showNodes, showEdges} = getShowNodesAndEdges(nowAtTask, taskStorage.styleMap);
    //         taskStorageGlobalWarp.value = taskStorage;
    //         setShowNodes(showNodes);
    //         setShowEdges(showEdges);
    //         setTaskStack([...taskStorage.taskStack]);
    //     })
    //     const mousedown: (event: MouseEvent) => void = (event: MouseEvent) => {
    //         switch (event.button) {
    //             case 3: // step back
    //                 setTaskStack((prev) => {
    //                     prev.pop();
    //                     return [...prev];
    //                 });
    //                 const _task = taskStack[taskStack.length - 1];
    //                 let {
    //                     showNodes,
    //                     showEdges
    //                 } = getShowNodesAndEdges(_task as Task, taskStorageGlobalWarp.value?.styleMap!);
    //                 setShowNodes(showNodes);
    //                 setShowEdges(showEdges);
    //                 break
    //             default:
    //                 break;
    //         }
    //     }
    //     // mouse down
    //     document.addEventListener('mousedown', mousedown);
    //     return () => {
    //         document.removeEventListener('mousedown', mousedown);
    //     }
    // }, []);

    const [nowSelected, setNowSelected] = useAtom(nowSelectedAtom);

    // const [nowClickEdge, _setNowClickEdge] = useState<string | null>(null);
    // const nowClickEdgeRef = useRef(nowClickEdge);
    // useEffect(() => {
    //     nowClickEdgeRef.current = nowClickEdge;
    // }, [nowClickEdge]);

    // const [taskToEdit, setTaskToEdit] = useState<Task>({
    //     id: dayjs().toString(),
    //     name: '',
    //     goal: '',
    //     date: dayjs().toString(),
    //     time: dayjs().toString(),
    //     status: TaskStatus.Created,
    //     dependencies: {
    //         dependencyType: TaskDependencyType.And,
    //     },
    //     subtasks: {
    //         nodes: [],
    //         edges: [],
    //     },
    //     parent: null,
    // });
    // const taskToEditRef = useRef(taskToEdit);
    // useEffect(() => {
    //     taskToEditRef.current = taskToEdit;
    // }, [taskToEdit]);

    // const [isInputing, _setIsInputing] = useState(false);
    // const isInputingRef = useRef(isInputing);
    // useEffect(() => {
    //     isInputingRef.current = isInputing;
    // }, [isInputing]);

    const [showDialog, _setShowDialog] = useAtom(showDialogAtom);
    // const showDialogRef = useRef(showDialog);
    // useEffect(() => {
    //     showDialogRef.current = showDialog;
    // }, [showDialog]);

    // const [ctrlPressed, _setCtrlPressed] = useState(false);
    // const ctrlPressedRef = useRef(ctrlPressed);
    // useEffect(() => {
    //     ctrlPressedRef.current = ctrlPressed;
    // }, [ctrlPressed]);

    const [modified, setModified] = useAtom(isModifiedAtom);
    // const modifiedRef = useRef(modified);
    // useEffect(() => {
    //     modifiedRef.current = modified;
    // }, [modified]);

    const [showAlert, _setShowAlert] = useAtom(showAlertAtom);
    // const showAlertRef = useRef(showAlert);
    // useEffect(() => {
    //     showAlertRef.current = showAlert;
    // }, [showAlert]);

    // const [alertText, setAlertText] = useState("");


    // const alertTextRef = useRef(alertText);
    // useEffect(() => {
    //     alertTextRef.current = alertText;
    // }, [alertText]);

    // const onDialogClose = useCallback(() => {
    // }, []);

    // const keyDownChecker = useCallback(
    //     (event: KeyboardEvent) => {
    //         if (isInputingRef.current) return;
    //         switch (event.key) {
    //             case 'a':
    //             case 'A':
    //                 setShowDialog((prev) => {
    //                     return !prev;
    //                 });
    //                 break;
    //             case 'd':
    //             case 'D':
    //                 break;
    //             case 'Escape':
    //                 setShowDialog(false);
    //                 break;
    //             case 'Enter':
    //                 if (showDialogRef.current) {
    //                     setShowDialog(false);
    //                     setShowNodes((prev: TaskNodeShow[]): TaskNodeShow[] => {
    //                         return [
    //                             ...prev,
    //                             {
    //                                 id: dayjs().toString(),
    //                                 type: 'task',
    //                                 position: {
    //                                     x: 0,
    //                                     y: 0,
    //                                 },
    //                                 data: {
    //                                     label: taskToEditRef.current.name,
    //                                     realTask: {...taskToEditRef.current},
    //                                 },
    //                             },
    //                         ];
    //                     });
    //                     setTaskToEdit({
    //                         id: dayjs().toString(),
    //                         name: '',
    //                         goal: '',
    //                         date: dayjs().toString(),
    //                         time: dayjs().toString(),
    //                         status: TaskStatus.Created,
    //                         dependencies: {
    //                             dependencyType: TaskDependencyType.And,
    //                         },
    //                         subtasks: {
    //                             nodes: [],
    //                             edges: [],
    //                         },
    //                         parent: null,
    //                     });
    //                 }
    //                 break;
    //             case 'Delete':
    //                 if (nowClickNodeRef.current) {
    //                     setShowNodes((prev) => {
    //                         return prev.filter(
    //                             (value) => value.id !== nowClickNodeRef.current,
    //                         );
    //                     });
    //                     setShowEdges((prev) => {
    //                         return prev.filter(
    //                             (value) =>
    //                                 value.source !== nowClickNodeRef.current &&
    //                                 value.target !== nowClickNodeRef.current,
    //                         );
    //                     });
    //                     setNowClickNode(null);
    //                     setModified(true);
    //                     break;
    //                 }
    //                 if (nowClickEdgeRef.current) {
    //                     setShowEdges((prev) => {
    //                         return prev.filter(
    //                             (value) => value.id !== nowClickEdgeRef.current,
    //                         );
    //                     });
    //                     setNowClickEdge(null);
    //                     setModified(true);
    //                     break;
    //                 }
    //                 break;
    //             // ctrl + s
    //             case "Control":
    //                 setCtrlPressed(true);
    //                 break;
    //             case 's':
    //                 if (ctrlPressedRef.current) {
    //                     console.log("save");
    //                     saveTasks(showNodesRef.current, showEdgesRef.current, taskStackRef.current).then((res) => {
    //                         setAlertText(res);
    //                         setModified(false);
    //                     }).catch((err) => {
    //                         setAlertText(err);
    //                     }).finally(() => {
    //                         setShowAlert(true);
    //                     });
    //                 }
    //                 break;
    //             default:
    //                 break;
    //         }
    //     },
    //     [showDialog],
    // );

    // const keyUpChecker = useCallback(
    //     (event: KeyboardEvent) => {
    //         if (event.key === "Control") {
    //             setCtrlPressed(false);
    //         }
    //     },
    //     [showDialog],
    // );

    const onMouseEnter = useOnMouseEnter();

    // (
    // _event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    // ) => {
    // document.removeEventListener('keydown', callback);
    // document.removeEventListener('keyup', releaseCallback);
    // document.addEventListener('keydown', keyDownChecker);
    // document.addEventListener('keyup', keyUpChecker);
    // callback = keyDownChecker;
    // releaseCallback = keyUpChecker;
    // };

    const onMouseLeave = useOnMouseLeave();
    // (
    // _event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    // ) => {
    // document.removeEventListener('keydown', callback);
    // document.removeEventListener('keyup', releaseCallback);
    // callback = (_event: KeyboardEvent) => {
    // };
    // releaseCallback = (_event: KeyboardEvent) => {
    // };
    // };

    const onConnect = useOnConnect();

    // (_params: Connection) => {
    // setShowEdges((prev) => [
    //     ...prev,
    //     {
    //         id: `${params.source}-${params.target}`,
    //         source: params.source!,
    //         target: params.target!,
    //         sourceHandle: params.sourceHandle,
    //         targetHandle: params.targetHandle,
    //         animated: true,
    //     },
    // ]);
    // setModified(true);
    // };

    const onNodeClick = useOnNodeClick();

    // document.addEventListener('', () => {
    //
    // });
    // (_event: React.MouseEvent, _node: TaskNodeShow) => {


    // if (
    //     node.type === 'origin' ||
    //     node.type === 'start' ||
    //     node.type === 'end' ||
    //     nowClickEdge !== null
    // )
    //     return;
    //
    //
    // if (doubeClickCheck) {
    //     const _task = taskStack[taskStack.length - 1];
    //     const _node = _task.subtasks!.nodes.find((value) => value.id === node.id);
    //     setTaskStack((prev) => {
    //         prev.push(_node as Task);
    //         return [...prev];
    //     });
    //     let {showNodes, showEdges} = getShowNodesAndEdges(_node as Task, taskStorageGlobalWarp.value?.styleMap!);
    //     setShowNodes(showNodes);
    //     setShowEdges(showEdges);
    //     doubeClickCheck = false;
    // } else {
    //     doubeClickCheck = true;
    //     setTimeout(() => {
    //         doubeClickCheck = false;
    //
    //     }, doubleClickTime);
    // }
    //
    // if (node.data.selected) {
    //     setShowNodes((prev) => {
    //         prev.forEach((value) => {
    //             value.data.selected = false;
    //         });
    //         return [...prev];
    //     });
    //     setNowClickNode(null);
    //     return;
    // }
    // setShowNodes((prev) => {
    //     prev.forEach((value) => {
    //         value.data.selected = value.id === node.id;
    //     });
    //     return [...prev];
    // });
    // setNowClickNode(node.id);
    // };

    const onEdgeClick = useOnEdgeClick();

    // (_event: React.MouseEvent, _edge: TaskEdgeShow) => {
    // if (edge.id === nowClickEdge) {
    //     setNowClickEdge(null);
    //     return;
    // }
    // setNowClickEdge(edge.id);
    // };

    const modifiedClassName = modified ? styles.modifiedBase + ' ' + styles.modified : styles.modifiedBase;

    return (
        <div
            className={styles.Flow}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className={modifiedClassName}></div>
            {nowSelected.type === 'edge' && <div className={styles.edgeInfo}>Selected</div>}
            <Snackbar
                open={showAlert}
                autoHideDuration={2000}
                // message={alertText}
            />
            <Stepper nonLinear className={styles.Stack}>
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
                    const update = applyNodeChanges(changes, showNodes);
                    setShowNodes(update);
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
            <Dialog open={showDialog}>
                <div className={styles.Dialog}>
                    <TaskCreate/>
                </div>
            </Dialog>
        </div>
    );
}
