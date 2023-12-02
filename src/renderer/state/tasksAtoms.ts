import { atom } from 'jotai';
import { Task } from '../lib/task/Task';
import { ShowEdge, ShowNode } from '../hooks/useTasks';
import taskService from '../service/TaskService';
import { Position } from 'reactflow';

const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left
};

// bridge between service data and UI data
export function getShowNodes(nodes: Task): ShowNode[] {
  console.log('getShowNodes', nodes);
  let showNodes: ShowNode[] = [];
  nodes.subtasks.forEachNode((node) => {
    let node_: Task = taskService.getNode(node)!;
    const style = taskService.getStyle(node_)!;
    showNodes.push({
      id: node_.id.toString(),
      position: style.position,
      data: {
        label: node_.name
      },
      ...nodeDefaults
    });
  });

  return showNodes;
}

export function getShowEdges(nodes: Task): ShowEdge[] {
  let showEdges: ShowEdge[] = [];
  nodes.subtasks.forEachEdge((edge) => {
    showEdges.push({
      id: `${edge[0]}-${edge[1]}`,
      source: edge[0],
      target: edge[1]
    });
  });

  return showEdges;
}

// service data
// source
const taskNowAtAtom = atom<Task>(taskService.getNowAt());
// derived
// read-only
const showNodesAtom = atom((get) => getShowNodes(get(taskNowAtAtom)), (get, set, update: ShowNode) => {
  console.log('showNodesAtom', update);
});
const showEdgesAtom = atom((get) => getShowEdges(get(taskNowAtAtom)));

// UI data
const taskToEditAtom = atom<Task>(new Task());

export { taskToEditAtom, taskNowAtAtom, showNodesAtom, showEdgesAtom };
