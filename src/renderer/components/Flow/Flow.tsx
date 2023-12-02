import styles from './Flow.module.css';
import { applyNodeChanges, Background, Controls, NodePositionChange, ReactFlow } from 'reactflow';
import React, { useCallback, useEffect, useRef } from 'react';
import { Dialog } from '@mui/material';
import { useAtom } from 'jotai';
import { taskToEditAtom } from '../../state/tasksAtoms';
import TaskCreater from '../TaskCreater/TaskCreater';
import { isInputingAtom, showCreateTaskAtom } from '../../state/windowAtoms';
import useTasks from '../../hooks/useTasks';
import { NodeStyle } from '../../lib/task/Task';
import { NodeChange } from '@reactflow/core/dist/esm/types/changes';

let callback: (event: KeyboardEvent) => void = (event: KeyboardEvent) => {

};


export default function Flow() {

  const flowRef = useRef<HTMLDivElement>(null);

  const {
    showNodes,
    showEdges,
    addTask,
    addEdge,
    setStyle
  } = useTasks();

  const [showDialog, setShowDialog] = useAtom(showCreateTaskAtom);
  const [taskToEdit, setTaskToEdit] = useAtom(taskToEditAtom);

  const taskToEditRef = useRef(taskToEdit);
  useEffect(() => {
    taskToEditRef.current = taskToEdit;
  }, [taskToEdit]);

  const [isInputing, setIsInputing] = useAtom(isInputingAtom);
  const isInputingRef = useRef(isInputing);
  useEffect(() => {
    isInputingRef.current = isInputing;
  }, [isInputing]);

  const showDialogRef = useRef(showDialog);
  useEffect(() => {
    showDialogRef.current = showDialog;
  }, [showDialog]);

  const onDialogClose = useCallback(() => {

  }, []);

  const keyDownChecker = useCallback((event: KeyboardEvent) => {
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
          const style: NodeStyle = {
            position: {
              x: flowRef.current?.offsetWidth ? flowRef.current.offsetWidth / 2 : 0,
              y: flowRef.current?.offsetHeight ? flowRef.current.offsetHeight / 2 : 0
            }
          };
          addTask(taskToEditRef.current, style);
          setShowDialog(false);
        }
        break;
      default:
        break;
    }
  }, [showDialog]);

  const onMouseEnter = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    document.removeEventListener('keydown', callback);
    document.addEventListener('keydown', keyDownChecker);
    callback = keyDownChecker;
  };

  const onMouseLeave = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    document.removeEventListener('keydown', callback);
    callback = (event: KeyboardEvent) => {

    };
  };

  const warpApplyNodesChanges = (changes: NodeChange[]) => {
    const nodes = applyNodeChanges(changes, showNodes);
    for (let change of changes) {
      if (change.type === 'position') {
        change = change as NodePositionChange;
        if (change.dragging) {
          setStyle(change.id, {
            position: {
              x: change.position!.x,
              y: change.position!.y
            }
          });
        }
      }
    }
  };

  return (
    <div className={styles.Flow} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <ReactFlow ref={flowRef}
                 nodes={showNodes}
                 edges={showEdges}
                 onNodesChange={warpApplyNodesChanges}
                 fitView
                 snapToGrid={true}
                 snapGrid={[15, 15]}>
        <Background />
        <Controls />
      </ReactFlow>
      <Dialog open={showDialog} onClose={onDialogClose}>
        <div className={styles.Dialog}>
          <TaskCreater />
        </div>
      </Dialog>
    </div>
  );
}
