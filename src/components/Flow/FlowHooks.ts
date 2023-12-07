import {AppStorageAtom} from "../../state/tasksAtoms.ts";
import {useSetAtom} from "jotai";
import {storage} from "../../interface/storage.ts";
import {useEffect} from "react";

export const useDataInit = () => {
    const setAppStorage = useSetAtom(AppStorageAtom);
    useEffect(() => {
        storage.getAppStorage("taskStorage").then((res) => {
            setAppStorage(res);
            console.log(res)
        }).catch((err) => {
            setAppStorage(err)
        })
    }, []);
}