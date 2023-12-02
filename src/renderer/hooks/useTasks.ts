import { NodeStyle, Task } from '../lib/task/Task';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { showEdgesAtom, showNodesAtom, taskNowAtAtom } from '../state/tasksAtoms';
import taskService from '../service/TaskService';
import { NodeChange } from '@reactflow/core/dist/esm/types/changes';
import { applyNodeChanges } from 'reactflow';

export interface ShowNode {
  id: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
  };
}

export interface ShowEdge {
  id: string;
  source: string;
  target: string;
}


export interface UseTasks {
  showNodes: ShowNode[];
  showEdges: ShowEdge[];
  addTask: (task: Task, style: NodeStyle) => void;
  addEdge: (source: string, target: string) => void;
  setStyle: (id: string, style: NodeStyle) => void;
  warpApplyNodesChanges: (changes: NodeChange[]) => void;
}

export default function useTasks(): UseTasks {

  const [task, setTask] = useAtom(taskNowAtAtom);
  const showNodes = useAtomValue(showNodesAtom);
  const setShowNodes = useSetAtom(showNodesAtom);
  const showEdges = useAtomValue(showEdgesAtom);

  function addTask(task: Task, style: NodeStyle) {
    setTask((prev) => {
      console.log('addTask prev', prev);
      let ref: Task = { ...prev };
      ref.subtasks.addNode(task.id.toString());
      taskService.addTask(task, style);
      console.log('addTask', ref);
      return ref;
    });
  }

  function addEdge(source: string, target: string) {
    // // taskManager.addEdge(source, target);
    // setTask(taskManager.getRoot());
  }

  function setStyle(id: string, style: NodeStyle) {
    setTask((prev) => {
      taskService.setStyleById(id, style);
      return { ...prev };
    });
  }

  function warpApplyNodesChanges(changes: NodeChange[]) {
    const nodes = applyNodeChanges(changes, showNodes);
    for (let change of changes) {

    }
  }

  return {
    showNodes: showNodes,
    showEdges: showEdges,
    addTask,
    addEdge,
    setStyle,
    warpApplyNodesChanges
  };
}
