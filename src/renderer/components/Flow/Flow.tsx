import styles from './Flow.module.css';
import {
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  Position,
  ReactFlow,
} from 'reactflow';
import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Dialog } from '@mui/material';
import TaskCreater from '../TaskCreater/TaskCreater';
import { Task } from '../../lib/task/Task';
import { Connection } from '@reactflow/core/dist/esm/types/general';
import { useAtom } from 'jotai';
import {
  nodeTypes,
  showEdgesAtom,
  showNodesAtom,
} from '../../state/tasksAtoms';
import dayjs from 'dayjs';

let callback: (event: KeyboardEvent) => void = (event: KeyboardEvent) => {};

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

export interface TaskEdgeShow {
  id: string;
  source: string;
  target: string;
  sourceHandle: string | null;
  targetHandle: string | null;
  animated?: boolean;
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

  const onDialogClose = useCallback(() => {}, []);

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
                    realTask: { ...taskToEditRef.current },
                  },
                },
              ];
            });
            setTaskToEdit(new Task());

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
          }
          console.log('delete');
          break;
        default:
          break;
      }
    },
    [showDialog],
  );

  const onMouseEnter = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    document.removeEventListener('keydown', callback);
    document.addEventListener('keydown', keyDownChecker);
    callback = keyDownChecker;
  };

  const onMouseLeave = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    document.removeEventListener('keydown', callback);
    callback = (event: KeyboardEvent) => {};
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
  };

  const onNodeClick = (event: React.MouseEvent, node: TaskNodeShow) => {
    if (node.type === 'origin' || node.type === 'start' || node.type === 'end')
      return;
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

  return (
    <div
      className={styles.Flow}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ReactFlow
        ref={flowRef}
        nodes={showNodes}
        edges={showEdges}
        onNodesChange={(changes) => {
          setShowNodes((prev) => applyNodeChanges(changes, prev));
        }}
        onNodeClick={onNodeClick}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background gap={10} color="black" variant={BackgroundVariant.Dots} />
        <Controls />
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
