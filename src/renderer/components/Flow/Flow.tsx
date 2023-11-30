import styles from './Flow.module.css';
import { Background, Controls, ReactFlow } from 'reactflow';
import React, { useCallback, useEffect, useRef } from 'react';
import { Dialog } from '@mui/material';
import { useAtom } from 'jotai';
import { edgesAtom, nodesAtom, taskToEditAtom } from '../../state/tasksAtoms';
import TaskCreater from '../TaskCreater/TaskCreater';
import { isInputingAtom, showCreateTaskAtom } from '../../state/windowAtoms';
import dayjs, { Dayjs } from 'dayjs';
import { Task } from '../../lib/task/Task';

let callback: (event: KeyboardEvent) => void = (event: KeyboardEvent) => {

};

function combineDateTime(date: Dayjs | null, time: Dayjs | null): Dayjs {
  if (date && time) {
    return dayjs(date)
      .hour(time.hour())
      .minute(time.minute())
      .second(time.second());
  }

  return dayjs();
}

export default function Flow() {

  const [nodes, setNodes] = useAtom(nodesAtom);
  const [edges, setEdges] = useAtom(edgesAtom);
  const [showDialog, setShowDialog] = useAtom(showCreateTaskAtom);
  const [taskToEdit, setTaskToEdit] = useAtom(taskToEditAtom);

  const taskToEditRef = useRef(taskToEdit);
  useEffect(() => {
    taskToEditRef.current = taskToEdit;
  }, [taskToEdit]);

  useEffect(() => {
    console.log('nodes: ', nodes);
  }, [nodes]);

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
        console.log('showDialog: ', showDialogRef.current);
        if (showDialogRef.current) {
          setNodes((prev: Task[]): Task[] => {
            return [...prev, taskToEditRef.current];
          });
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

  return (
    <div className={styles.Flow} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <ReactFlow
        // nodes={nodes}
        // edges={edges}
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
