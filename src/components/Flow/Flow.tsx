import styles from './Flow.module.css';
import {applyNodeChanges, Background, BackgroundVariant, Controls, ReactFlow,} from 'reactflow';
import {Dialog, Snackbar, Step, StepLabel, Stepper,} from '@mui/material';
import {useAtom, useAtomValue} from 'jotai';
import {
    alertMessageAtom,
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
import {useOnConnect, useOnEdgeClick, useOnMouseEnter, useOnMouseLeave, useOnNodeClick} from "../../hooks/useEvent.ts";
import {useDataInit} from "./FlowHooks.ts";

export default function Flow() {
    // init
    useDataInit();

    const showEdges = useAtomValue(showEdgesAtom);
    const taskStack = useAtomValue(taskStackAtom);
    const nowSelected = useAtomValue(nowSelectedAtom);
    const showDialog = useAtomValue(showDialogAtom);
    const showAlert = useAtomValue(showAlertAtom);
    const alertText = useAtomValue(alertMessageAtom);

    const [modified, setModified] = useAtom(isModifiedAtom);
    const [showNodes, setShowNodes] = useAtom(showNodesAtom);

    const onMouseEnter = useOnMouseEnter();
    const onMouseLeave = useOnMouseLeave();
    const onConnect = useOnConnect();
    const onNodeClick = useOnNodeClick();
    const onEdgeClick = useOnEdgeClick();

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
                message={alertText}
            />
            <Stepper nonLinear className={styles.Stack}>
                {taskStack.map((task) => (
                    <Step key={task.name} completed={false}>
                        <StepLabel>{task.name}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <ReactFlow
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
                snapGrid={[2, 2]}
                snapToGrid={true}
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
