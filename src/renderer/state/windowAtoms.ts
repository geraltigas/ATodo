import { atom } from 'jotai';

const fullscreenAtom = atom(false);
const boardAtom = atom(true);

const showCreateTaskAtom = atom(false);
const isInputingAtom = atom(false);

export { fullscreenAtom, boardAtom, showCreateTaskAtom, isInputingAtom };

