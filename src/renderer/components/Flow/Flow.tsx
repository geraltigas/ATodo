import styles from './Flow.module.css';
import { applyNodeChanges, Background, Controls, Position, ReactFlow } from 'reactflow';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dialog } from '@mui/material';
import TaskCreater from '../TaskCreater/TaskCreater';
import { combineDateTime, Task } from '../../lib/task/Task';
// import { isInputingAtom } from '../../state/windowAtoms';
// import useTasks from '../../hooks/useTasks';
// import useShowDialog from '../../hooks/useShowDialog';
// import { Task } from '../../lib/task/Task';

let callback: (event: KeyboardEvent) => void = (event: KeyboardEvent) => {

};

const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left
};

export interface TaskNodeShow {
  id: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
  };
  sourcePosition?: Position | undefined;
  targetPosition?: Position | undefined;
}

export interface TaskEdgeShow {
  id: string;
  source: string;
  target: string;
}

export default function Flow() {

  const flowRef = useRef<HTMLDivElement>(null);

  const [showNodes, setShowNodes] = useState<TaskNodeShow[]>([]);
  const [showEdges, setShowEdges] = useState<TaskEdgeShow[]>([]);

  console.log(showNodes);

  const [taskToEdit, setTaskToEdit] = useState(new Task());
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
          setShowDialog(false);
          setShowNodes((prev: TaskNodeShow[]): TaskNodeShow[] => {
            return [...prev, {
              id: combineDateTime(taskToEditRef.current.date, taskToEditRef.current.time).toString(),
              position: {
                x: flowRef.current?.offsetWidth ? flowRef.current.offsetWidth / 2 : 0,
                y: flowRef.current?.offsetHeight ? flowRef.current.offsetHeight / 2 : 0
              },
              data: {
                label: taskToEditRef.current.name
              },
              ...nodeDefaults
            }];
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

  // const warpApplyNodesChanges = (changes: NodeChange[]) => {
  //   const nodes = applyNodeChanges(changes, showNodes);
  //   for (let change of changes) {
  //     if (change.type === 'position') {
  //       change = change as NodePositionChange;
  //       if (change.dragging) {
  //         setStyle(change.id, {
  //           position: {
  //             x: change.position!.x,
  //             y: change.position!.y
  //           }
  //         });
  //       }
  //     }
  //   }
  // };

  return (
    <div className={styles.Flow} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <ReactFlow ref={flowRef}
                 nodes={showNodes}
                 edges={showEdges}
                 onNodesChange={(changes) => {
                   setShowNodes((prev) => applyNodeChanges(changes, prev));
                 }}
                 fitView
                 snapToGrid={true}
                 snapGrid={[15, 15]}>
        <Background />
        <Controls />
      </ReactFlow>
      <Dialog open={showDialog} onClose={onDialogClose}>
        <div className={styles.Dialog}>
          <TaskCreater taskToEdit={taskToEdit} setTaskToEdit={setTaskToEdit} setIsInputing={setIsInputing} />
        </div>
      </Dialog>
    </div>
  );
}
