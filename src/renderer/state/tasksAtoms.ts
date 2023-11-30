import { atom } from 'jotai';
import { Task } from '../lib/task/Task';

export interface TaskNode {

}

const taskToEditAtom = atom<Task>(new Task());

const nodesAtom = atom<Task[]>([]);
const edgesAtom = atom([]);

export { nodesAtom, edgesAtom, taskToEditAtom };


