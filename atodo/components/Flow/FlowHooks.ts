import {AppStorageAtom, AppStorageInit, nowSelectedAtom, Task} from "../../state/tasksAtoms.ts";
import {useSetAtom} from "jotai";
import {storage} from "../../interface/storage.ts";
import {useEffect} from "react";
import {invoke} from "@tauri-apps/api";

const findTask = (id: string, rverall: Task): Task | null => {
    if (rverall.id === id) {
        return rverall;
    }
    if (rverall.subtasks.nodes.length > 0) {
        for (let i = 0; i < rverall.subtasks.nodes.length; i++) {
            const res = findTask(id, rverall.subtasks.nodes[i]);
            if (res !== null) {
                return res;
            }
        }
    }
    return null;
}

export const useDataInit = () => {
    const setAppStorage = useSetAtom(AppStorageAtom);
    const setNowSelected = useSetAtom(nowSelectedAtom);

    useEffect(() => {
        storage.getAppStorage("taskStorage").then((res1) => {
            invoke<string>("load", {key: "nowViewingTask"}).then((res) => {
                console.log(res)
                if (res !== "") {
                    let task: Task = findTask(res, res1.taskStorage.overall)!;
                    console.log(task)
                    if (task !== null) {
                        res1.taskStorage.nowViewing = task.parent!;
                        setNowSelected({
                            type: 'node',
                            reference: task
                        });
                    }
                    setAppStorage(res1);
                } else {
                    if (res1 === null) {
                        setAppStorage(AppStorageInit);
                        return;
                    }
                    setAppStorage(res1);
                    console.log(res1)
                }
            }).finally(() => {
                invoke<string>("save", {key: "nowViewingTask", value: ""}).then((res) => {
                    console.log("clean old nowViewingTask ", res)
                })
            })

        }).catch((err) => {
            setAppStorage(err)
        })
    }, []);
}