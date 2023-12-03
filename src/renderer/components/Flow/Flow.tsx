import styles from './Flow.module.css';
import { applyNodeChanges, Background, BackgroundVariant, Controls, NodeProps, Position, ReactFlow } from 'reactflow';
import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
import { Dialog } from '@mui/material';
import TaskCreater from '../TaskCreater/TaskCreater';
import { combineDateTime, Task } from '../../lib/task/Task';
import StartNode from '../Nodes/StartNode/StartNode';
import EndNode from '../Nodes/EndNode/EndNode';
import TaskNode from '../Nodes/TaskNode/TaskNode';
import { Connection } from '@reactflow/core/dist/esm/types/general';
import AddIcon from '@mui/icons-material/Add';

let callback: (event: KeyboardEvent) => void = (event: KeyboardEvent) => {

};

const OriginNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <AddIcon fontSize={'large'} color={'error'} className={styles.OriginNode} />
  );
};

export interface TaskNodeShow {
  id: string;
  position: {
    x: number;
    y: number;
  };
  type?: string;
  style?: CSSProperties;
  draggable?: boolean;
  data: {
    label: string;
    selected?: boolean;
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

const startNode: TaskNodeShow = {
  id: 'start',
  type: 'start',
  position: {
    x: 0,
    y: 0
  },
  data: {
    label: ''
  },
  targetPosition: Position.Right
};

const endNode: TaskNodeShow = {
  id: 'end',
  type: 'end',
  position: {
    x: 200,
    y: 0
  },
  data: {
    label: ''
  },
  sourcePosition: Position.Left
};

const testTaskNode: TaskNodeShow = {
  id: 'test',
  type: 'task',
  position: {
    x: 100,
    y: 0
  },
  data: {
    label: 'test'
  }
};

const nodeTypes = {
  start: StartNode,
  end: EndNode,
  task: TaskNode,
  origin: OriginNode
};

const egdesTest: TaskEdgeShow[] = [
  {
    id: 'start-test',
    source: 'start',
    target: 'test',
    sourceHandle: 'start-node-target',
    targetHandle: 'task-node-source',
    animated: true
  },
  {
    id: 'test-end',
    source: 'test',
    target: 'end',
    sourceHandle: 'task-node-target',
    targetHandle: 'end-node-source',
    animated: true
  }
];

const originNode: TaskNodeShow = {
  id: 'origin',
  type: 'origin',
  position: {
    x: 0,
    y: 0
  },
  draggable: false,
  data: {
    label: ''
  }
};

export default function Flow(
  {
    setNowClickNode
  }: {
    setNowClickNode: React.Dispatch<React.SetStateAction<TaskNodeShow | null>>
  }) {

  const flowRef = useRef<HTMLDivElement>(null);

  const [showNodes, setShowNodes] = useState<TaskNodeShow[]>([originNode, startNode, testTaskNode, endNode]);
  const [showEdges, setShowEdges] = useState<TaskEdgeShow[]>(egdesTest);

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
              type: 'task',
              position: {
                x: 0,
                y: 0
              },
              data: {
                label: taskToEditRef.current.name
              }
            }];
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

  const onConnect = (params: Connection) => {
    setShowEdges((prev) => [...prev, {
      id: `${params.source}-${params.target}`,
      source: params.source!,
      target: params.target!,
      sourceHandle: params.sourceHandle,
      targetHandle: params.targetHandle,
      animated: true
    }]);
  };

  const onNodeClick = (event: React.MouseEvent, node: TaskNodeShow) => {
    if (node.type === 'origin' || node.type === 'start' || node.type === 'end') return;
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
    setNowClickNode(node);
  };

  return (
    <div className={styles.Flow} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <ReactFlow ref={flowRef}
                 nodes={showNodes}
                 edges={showEdges}
                 onNodesChange={(changes) => {
                   setShowNodes((prev) => applyNodeChanges(changes, prev));
                 }}
                 onNodeClick={onNodeClick}
                 onConnect={onConnect}
                 nodeTypes={nodeTypes}
                 fitView
                 snapToGrid={true}
                 snapGrid={[15, 15]}>
        <Background
          gap={10}
          color='black'
          variant={BackgroundVariant.Dots} />
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
