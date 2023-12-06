// let events = new Map<string, CallBack>();
import React, {useCallback, useEffect} from "react";
import {useAtom, useAtomValue} from "jotai";
import {
    alertMessageAtom,
    AppStorageAtom,
    Edge,
    enteredFlowAtom,
    isInputtingAtom,
    isModifiedAtom,
    nowSelectedAtom,
    nowViewingAtom,
    selectedMapAtom,
    showAlertAtom,
    showDialogAtom,
    styleMapAtom,
    Task,
    TaskEdgeShow,
    TaskNodeShow,
    taskToEditAtom,
    taskToEditInit
} from "../state/tasksAtoms.ts";
import {Connection} from "reactflow";
import dayjs from "dayjs";
import {storage} from "../interface/storage.ts";

type KeyBoardCallBack = (event: KeyboardEvent) => void;
const documentKeyBoardEventsReference: Map<string, { type: string, func: KeyBoardCallBack }> = new Map();

type MouseCallBack = (event: MouseEvent) => void;
const documentMouseEventsReference: Map<string, { type: string, func: MouseCallBack }> = new Map();

export const updateReference = (newTask: Task) => {
    let parent = newTask.parent;
    let subtasks = newTask.subtasks.nodes;

    if (parent !== null) {
        let oldTaskIndex = parent.subtasks.nodes.findIndex((task) => task.id === newTask.id);
        // remove old task
        parent.subtasks.nodes.splice(oldTaskIndex, 1);
        parent.subtasks.nodes.push(newTask);
    }
    subtasks.forEach((task) => {
        task.parent = newTask;
    });
}

// sometimes, It is worth to have duplicate state to make the code more readable.

const useEvent = () => {

    useDocumentOnADown();
    useDocumentOnEnterDown();
    useDocumentOnDeleteDown();
    useDocumentOnSpaceDown();
    useDocumentOnMouse3Down();
    useDocumentOnCtrlSDown();

}

export const useOnMouseEnter = () => {
    const [enteredAtom, setEnteredAtom] = useAtom(enteredFlowAtom);
    return useCallback((_event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setEnteredAtom(true);
    }, [enteredAtom])
}

export const useOnMouseLeave = () => {
    const [enteredAtom, setEnteredAtom] = useAtom(enteredFlowAtom);
    return useCallback((_event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setEnteredAtom(false);
    }, [enteredAtom]);
}

export const useOnConnect = () => {
    const [nowViewing, setNowViewing] = useAtom(nowViewingAtom);
    return useCallback((params: Connection) => {
        console.log("connect", params);
        if (params.source === 'start' || params.target === "end") return;
        let source = params.source!;
        let target = params.target!;
        let edge: Edge = [source, target];
        let newNowViewing: Task = {
            ...nowViewing,
            subtasks: {
                ...nowViewing.subtasks,
                edges: [...nowViewing.subtasks.edges, edge]
            }
        };
        updateReference(newNowViewing);
        setNowViewing(newNowViewing);
    }, [nowViewing]);
}

export const useOnNodeClick = () => {
    const [nowSelected, setNowSelected] = useAtom(nowSelectedAtom);
    const [selectedMap, setSelectedMap] = useAtom(selectedMapAtom);
    return useCallback((_event: React.MouseEvent, node: TaskNodeShow) => {
        if (node.data.realTask === undefined) return;

        let newMap: Map<string, boolean> = new Map();

        if (nowSelected.type === 'node' && (nowSelected.reference! as Task).id === node.data.realTask.id) {
            setNowSelected({
                type: null,
                reference: null
            })
            newMap = new Map(selectedMap);
            newMap.delete((nowSelected.reference! as Task).id);
            setSelectedMap(newMap);
            return
        } else if (nowSelected.type === 'node' && (nowSelected.reference! as Task).id !== node.data.realTask.id) {
            newMap = new Map(selectedMap);
            newMap.delete((nowSelected.reference! as Task).id);
            setSelectedMap(newMap);
        }

        newMap.set(node.data.realTask.id, true);

        setSelectedMap(newMap);

        setNowSelected({
            type: 'node',
            reference: node.data.realTask!
        })
    }, [nowSelected]);
}

export const useOnEdgeClick = () => {
    const [nowSelected, setNowSelected] = useAtom(nowSelectedAtom);
    const [selectedMap, setSelectedMap] = useAtom(selectedMapAtom);


    return useCallback((_event: React.MouseEvent, edge: TaskEdgeShow) => {
        if (nowSelected.type === 'edge' && (nowSelected.reference! as Edge)[0] === edge.source && (nowSelected.reference! as Edge)[1] === edge.target) {
            setNowSelected({
                type: null,
                reference: null
            })
            return
        }
        setSelectedMap(new Map());
        setNowSelected({
            type: 'edge',
            reference: [edge.source, edge.target]
        })
    }, [nowSelected, selectedMap]);
}

const aMapKey = 'a-keydown';

const useDocumentOnADown = () => {

    const [showDialog, setShowDialog] = useAtom(showDialogAtom);
    const isInputting = useAtomValue(isInputtingAtom);

    const callback = useCallback((event: KeyboardEvent) => {
        if (event.key === 'a' || event.key === 'A') {
            if (isInputting) return;
            if (showDialog) {
                setShowDialog(false);
                return;
            }
            setShowDialog(true);
        }
    }, [showDialog, isInputting]);

    useEffect(() => {
        if (documentKeyBoardEventsReference.has(aMapKey)) {
            document.removeEventListener('keydown', documentKeyBoardEventsReference.get(aMapKey)!.func);
        }
        documentKeyBoardEventsReference.set(aMapKey, {type: 'keydown', func: callback});
        document.addEventListener('keydown', callback);
    }, [showDialog, isInputting]);
}

const enterMapKey = 'enter-keydown';

const useDocumentOnEnterDown = () => {
    const [showDialog, setShowDialog] = useAtom(showDialogAtom);
    const [taskToEdit, setTaskToEdit] = useAtom(taskToEditAtom);
    const [nowViewing, setNowViewing] = useAtom(nowViewingAtom);
    const [styleMap, setStyleMap] = useAtom(styleMapAtom);

    const callback = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Enter' && showDialog) {
            let subtasks = nowViewing.subtasks.nodes;
            let id = dayjs().toString();
            console.log("add node id", id)
            subtasks.push({
                ...taskToEdit,
                id: id
            });
            let newNowViewing = {
                ...nowViewing,
                subtasks: {
                    ...nowViewing.subtasks,
                    // nodes: subtasks
                }
            }
            newNowViewing.subtasks.nodes = subtasks;
            subtasks.forEach((task) => {
                task.parent = newNowViewing;
            })

            setNowViewing(newNowViewing);
            setTaskToEdit({...taskToEditInit});
            setShowDialog(false);
            setStyleMap([...styleMap, [id, {position: {x: 0, y: 0}}]]);
        }
    }, [taskToEdit, showDialog, nowViewing, styleMap]);

    useEffect(() => {
        if (documentKeyBoardEventsReference.has(enterMapKey)) {
            document.removeEventListener('keydown', documentKeyBoardEventsReference.get(enterMapKey)!.func);
        }
        documentKeyBoardEventsReference.set(enterMapKey, {type: 'keydown', func: callback});
        document.addEventListener('keydown', callback);
    }, [taskToEdit, showDialog, nowViewing, styleMap]);
}

const deleteMapKey = 'delete-keydown';

const useDocumentOnDeleteDown = () => {

    const [nowSelected, setNowSelected] = useAtom(nowSelectedAtom);

    const callback = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Delete' && nowSelected.type === 'node') {
            console.log("delete node")
            setNowSelected({
                type: 'delete-node',
                reference: nowSelected.reference
            })
            return;
        }

        if (event.key === 'Delete' && nowSelected.type === 'edge') {
            console.log("delete edge")
            setNowSelected({
                type: 'delete-edge',
                reference: nowSelected.reference
            })
            return;
        }
    }, [nowSelected]);

    useEffect(() => {
        if (documentKeyBoardEventsReference.has(deleteMapKey)) {
            document.removeEventListener('keydown', documentKeyBoardEventsReference.get(deleteMapKey)!.func);
        }
        documentKeyBoardEventsReference.set(deleteMapKey, {type: 'keydown', func: callback});
        document.addEventListener('keydown', callback);
    }, [nowSelected]);
}

const spaceMapKey = 'space-keydown';

const useDocumentOnSpaceDown = () => {

    const [nowSelected, setNowSelected] = useAtom(nowSelectedAtom);
    const [nowViewing, setNowViewing] = useAtom(nowViewingAtom);

    const callback = useCallback((event: KeyboardEvent) => {
        if (event.key === ' ' && nowSelected.type === 'node') {
            console.log("space node")
            setNowSelected({
                type: null,
                reference: null
            })
            console.log("nowSelected", nowSelected.reference)
            setNowViewing(nowSelected.reference as Task);
            return;
        }
    }, [nowSelected, nowViewing]);

    useEffect(() => {
        if (documentKeyBoardEventsReference.has(spaceMapKey)) {
            document.removeEventListener('keydown', documentKeyBoardEventsReference.get(spaceMapKey)!.func);
        }
        documentKeyBoardEventsReference.set(spaceMapKey, {type: 'keydown', func: callback});
        document.addEventListener('keydown', callback);
    }, [nowSelected, nowViewing]);
}

const ctrlSMapKey = 'ctrl-s-keydown';

const useDocumentOnCtrlSDown = () => {

    const [isModified, setIsModified] = useAtom(isModifiedAtom);
    const appStorage = useAtomValue(AppStorageAtom);
    const [showAlert, setShowAlert] = useAtom(showAlertAtom);
    const [alertMessage, setAlertMessage] = useAtom(alertMessageAtom);

    const callback = useCallback((event: KeyboardEvent) => {
        if (event.ctrlKey && event.key === 's') {
            console.log("ctrl-s");
            if (isModified) {
                storage.setAppStorage('taskStorage', appStorage).then(() => {
                    setIsModified(false);
                    setShowAlert(true);
                    setAlertMessage("Saved!");
                }).catch((err) => {
                    setShowAlert(true);
                    setAlertMessage("Failed to save!:" + err);
                }).finally(() => {
                    setTimeout(() => {
                        setShowAlert(false);
                    }, 2000);
                })
            }
        }
    }, [isModified, appStorage, showAlert, alertMessage]);

    useEffect(() => {
        if (documentKeyBoardEventsReference.has(ctrlSMapKey)) {
            document.removeEventListener('keydown', documentKeyBoardEventsReference.get(ctrlSMapKey)!.func);
        }
        documentKeyBoardEventsReference.set(ctrlSMapKey, {type: 'keydown', func: callback});
        document.addEventListener('keydown', callback);
    }, [isModified, appStorage, showAlert, alertMessage]);
}


// ------------------ mouse event ------------------

const mouse3MapKey = 'mouse3-mousedown';

const useDocumentOnMouse3Down = () => {

    const [nowViewing, setNowViewing] = useAtom(nowViewingAtom);

    const callback = useCallback((event: MouseEvent) => {
        if (event.button === 3) {
            console.log("mouse3")
            if (nowViewing.parent !== null) {
                setNowViewing(nowViewing.parent);
            }
        }
    }, [nowViewing]);

    useEffect(() => {
        if (documentMouseEventsReference.has(mouse3MapKey)) {
            document.removeEventListener('mousedown', documentMouseEventsReference.get(mouse3MapKey)!.func);
        }
        documentMouseEventsReference.set(mouse3MapKey, {type: 'mousedown', func: callback});
        document.addEventListener('mousedown', callback);
    }, [nowViewing]);
}

export default useEvent;