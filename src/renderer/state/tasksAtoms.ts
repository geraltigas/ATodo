// const nodeDefaults = {
//   sourcePosition: Position.Right,
//   targetPosition: Position.Left
// };
//
// // bridge between service data and UI data
// export function getShowNodes(nodes: Task): ShowNode[] {
//   console.log('getShowNodes', nodes);
//   let showNodes: ShowNode[] = [];
//   nodes.subtasks.forEachNode((node) => {
//     let node_: Task = taskService.getNode(node)!;
//     const style = taskService.getStyle(node_)!;
//     showNodes.push({
//       id: node_.id.toString(),
//       position: style.position,
//       data: {
//         label: node_.name
//       },
//       ...nodeDefaults
//     });
//   });
//
//   return showNodes;
// }
//
// export function getShowEdges(nodes: Task): ShowEdge[] {
//   let showEdges: ShowEdge[] = [];
//   nodes.subtasks.forEachEdge((edge) => {
//     showEdges.push({
//       id: `${edge[0]}-${edge[1]}`,
//       source: edge[0],
//       target: edge[1]
//     });
//   });
//
//   return showEdges;
// }
//
// // service data
// // source
// const taskNowAtAtom = atom<Task>(taskService.getNowAt());
// // derived
// // read-only
// const showNodesAtom = atom((get) => getShowNodes(get(taskNowAtAtom)), (get, set, update: ShowNode) => {
//   console.log('showNodesAtom', update);
// });
// const showEdgesAtom = atom((get) => getShowEdges(get(taskNowAtAtom)));
//
// // UI data
// const taskToEditAtom = atom<Task>(new Task());
//
// export { taskToEditAtom, taskNowAtAtom, showNodesAtom, showEdgesAtom };

import { TaskEdgeShow, TaskNodeShow } from '../components/Flow/Flow';
import { atom } from 'jotai';
import { Position } from 'reactflow';
import StartNode from '../components/Nodes/StartNode/StartNode';
import EndNode from '../components/Nodes/EndNode/EndNode';
import TaskNode from '../components/Nodes/TaskNode/TaskNode';
import { OriginNode } from '../components/Nodes/OriginNode/OriginNode';

const startNode: TaskNodeShow = {
  id: 'start',
  type: 'start',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    label: '',
  },
  targetPosition: Position.Right,
};

const endNode: TaskNodeShow = {
  id: 'end',
  type: 'end',
  position: {
    x: 200,
    y: 0,
  },
  data: {
    label: '',
  },
  sourcePosition: Position.Left,
};

const testTaskNode: TaskNodeShow = {
  id: 'test',
  type: 'task',
  position: {
    x: 100,
    y: 0,
  },
  data: {
    label: 'test',
  },
};

export const nodeTypes = {
  start: StartNode,
  end: EndNode,
  task: TaskNode,
  origin: OriginNode,
};

const egdesTest: TaskEdgeShow[] = [
  {
    id: 'start-test',
    source: 'start',
    target: 'test',
    sourceHandle: 'start-node-target',
    targetHandle: 'task-node-source',
    animated: true,
  },
  {
    id: 'test-end',
    source: 'test',
    target: 'end',
    sourceHandle: 'task-node-target',
    targetHandle: 'end-node-source',
    animated: true,
  },
];

const originNode: TaskNodeShow = {
  id: 'origin',
  type: 'origin',
  position: {
    x: 0,
    y: 0,
  },
  draggable: false,
  selectable: false,
  data: {
    label: '',
  },
};

const showNodesAtom = atom<TaskNodeShow[]>([originNode, startNode, endNode]);
const showEdgesAtom = atom<TaskEdgeShow[]>([]);

const taskToEditBoardIdAtom = atom<string | null>(null);

const taskToEditBoardAtom = atom(
  (get) => {
    const nodes = get(showNodesAtom);
    const editId = get(taskToEditBoardIdAtom);
    return nodes.find((node) => node.id === editId) || null;
  },
  (get, set, update: TaskNodeShow) => {
    const nodes = get(showNodesAtom);
    const editedNodes = nodes.map((node) =>
      node.id === update.id ? update : node,
    );
    set(showNodesAtom, editedNodes);
  },
);

export {
  taskToEditBoardAtom,
  taskToEditBoardIdAtom,
  showNodesAtom,
  showEdgesAtom,
};
