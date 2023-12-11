import {appStateAtom, windowSizeAtom} from "../../state/tasksAtom.ts";
import {useAtom} from "jotai";
import {invoke} from "@tauri-apps/api";
import {AppStorage} from "../../../atodo/state/tasksAtoms.ts";
import {parse} from "flatted";
import {useEffect} from "react";

export const useDataInit = () => {

    const [appState, setAppState] = useAtom(appStateAtom);

    useEffect(() => {

        invoke<string>("load", {key: "taskStorage"}).then((result) => {
            let appStorage: AppStorage = parse(result) as AppStorage;
            console.log("Overall", appStorage.taskStorage.overall);
            setAppState({
                ...appState,
                appStorage: {
                    overall: appStorage.taskStorage.overall
                }
            })
        }).catch((err) => {
            console.log(err);
        })

    }, []);

}

export const useWindowInit = () => {

    const [windowSize, setWindowSize] = useAtom(windowSizeAtom);

    useEffect(() => {
        invoke<string>("set_window_size", {
            label: "worker",
            width: windowSize.width + 1,
            height: windowSize.height + 1
        }).then((res) => {
            console.log(res);
        })
    }, []);
}