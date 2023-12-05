// let events = new Map<string, CallBack>();

import {CallBack} from "../state/eventAtoms.ts";
import React, {useCallback, useEffect} from "react";
import {useAtom} from "jotai";
import {
    enteredFlowAtom,
    nowSelectedAtom,
    nowViewingAtom,
    selectedMapAtom,
    showDialogAtom,
    styleMapAtom,
    TaskEdgeShow,
    TaskNodeShow,
    taskToEditAtom,
    taskToEditInit
} from "../state/tasksAtoms.ts";
import {Connection} from "reactflow";
import dayjs from "dayjs";

type CallBack = (event: KeyboardEvent) => void;
const documentEventsReference: Map<string, { type: string, func: CallBack }> = new Map();

// sometimes, It is worth to have duplicate state to make the code more readable.

const useEvent = () => {

    useDocumentOnADown();
    useDocumentOnEnterDown();

    // const documentEvents = useAtomValue(documentEventsAtom);
    // useEffect(() => {
    //     documentEventsReference.forEach((callback, event) => {
    //         // @ts-ignore
    //         document.removeEventListener(event, callback);
    //     });
    //
    //     documentEventsReference.clear();
    //
    //     documentEvents.forEach((callback, event) => {
    //         // @ts-ignore
    //         document.addEventListener(event, callback);
    //         documentEventsReference.set(event, callback);
    //     });
    //     return () => {
    //         documentEventsReference.forEach((callback, event) => {
    //             // @ts-ignore
    //             document.removeEventListener(event, callback);
    //         });
    //
    //         documentEventsReference.clear();
    //     };
    // }, [documentEvents]);
}

export const useOnMouseEnter = () => {
    const [enteredAtom, setEnteredAtom] = useAtom(enteredFlowAtom);
    return useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setEnteredAtom(true);
    }, [enteredAtom])
}

export const useOnMouseLeave = () => {
    const [enteredAtom, setEnteredAtom] = useAtom(enteredFlowAtom);
    return useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setEnteredAtom(false);
    }, [enteredAtom]);
}

export const useOnConnect = () => {
    return useCallback((params: Connection) => {
        console.log("connect", params);
    }, []);
}

export const useOnNodeClick = () => {
    const [nowSelected, setNowSelected] = useAtom(nowSelectedAtom);
    const [selectedMap, setSelectedMap] = useAtom(selectedMapAtom);
    return useCallback((_event: React.MouseEvent, node: TaskNodeShow) => {
        if (node.data.realTask === undefined) return;

        let newMap: Map<string, boolean> = new Map();

        if (nowSelected.type === 'node' && nowSelected.reference.id === node.data.realTask.id) {
            setNowSelected({
                type: null,
                reference: null
            })
            newMap = new Map(selectedMap);
            newMap.delete(nowSelected.reference.id);
            setSelectedMap(newMap);
            return
        } else if (nowSelected.type === 'node' && nowSelected.reference.id !== node.data.realTask.id) {
            newMap = new Map(selectedMap);
            newMap.delete(nowSelected.reference.id);
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


    return useCallback((event: React.MouseEvent, edge: TaskEdgeShow) => {
        if (nowSelected.type === 'edge' && nowSelected.reference[0] === edge.source && nowSelected.reference[1] === edge.target) {
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

    const callback = useCallback((event: KeyboardEvent) => {
        if (event.key === 'a' || event.key === 'A') {
            if (showDialog) {
                setShowDialog(false);
                return;
            }
            setShowDialog(true);
        }
    }, [showDialog]);

    useEffect(() => {
        if (documentEventsReference.has(aMapKey)) {
            document.removeEventListener('keydown', documentEventsReference.get(aMapKey).func);
        }
        documentEventsReference.set(aMapKey, {type: 'keydown', func: callback});
        document.addEventListener('keydown', callback);
    }, [showDialog]);
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
        if (documentEventsReference.has(enterMapKey)) {
            document.removeEventListener('keydown', documentEventsReference.get(enterMapKey).func);
        }
        documentEventsReference.set(enterMapKey, {type: 'keydown', func: callback});
        document.addEventListener('keydown', callback);
    }, [taskToEdit, showDialog, nowViewing, styleMap]);
}


export default useEvent;