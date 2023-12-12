import {isMouseEnterAtom} from "../state/tasksAtom.ts";
import {useAtom} from "jotai";
import React, {useCallback, useEffect} from "react";
import {useAtomValue} from "jotai/index";
import {invoke} from "@tauri-apps/api";

const useEvent = () => {
    useDocumentOnEnterDown();
}

export default useEvent;

export const useOnMouseEnter = (): (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void => {
    const [isMouseEnter, setIsMouseEnter] = useAtom(isMouseEnterAtom);

    return useCallback((_e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setIsMouseEnter(true);
        console.log('mouse enter')
    }, [isMouseEnter]);
}

export const useOnMouseLeave = (): (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void => {
    const [isMouseEnter, setIsMouseEnter] = useAtom(isMouseEnterAtom);

    return useCallback((_e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setIsMouseEnter(false);
        console.log('mouse leave')
    }, [isMouseEnter]);
}

type KeyBoardCallBack = (event: KeyboardEvent) => void;
const documentKeyBoardEventsReference: Map<string, { type: string, func: KeyBoardCallBack }> = new Map();

const enterMapKey = 'enter-keydown';

const useDocumentOnEnterDown = () => {
    const isMouseEnter = useAtomValue(isMouseEnterAtom);

    const callback = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Enter' && isMouseEnter) {
            invoke<string>("open_atodo").then((_res) => {
                invoke<string>("close_worker").then((_res) => {
                });
            }).catch((err) => {
                console.log(err);
            });
            return;
        }
    }, [isMouseEnter]);

    useEffect(() => {
        if (documentKeyBoardEventsReference.has(enterMapKey)) {
            document.removeEventListener('keydown', documentKeyBoardEventsReference.get(enterMapKey)!.func);
        }
        documentKeyBoardEventsReference.set(enterMapKey, {type: 'keydown', func: callback});
        document.addEventListener('keydown', callback);
    }, [isMouseEnter]);
}


