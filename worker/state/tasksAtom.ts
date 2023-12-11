import {overallInit, Task} from "../../atodo/state/tasksAtoms.ts";
import {atom} from "jotai";
import {Scheduler} from "../lib/Scheduler.ts";

interface AppRuntime {
    scheduledTasks: Task[];
    windowsSize: {
        width: number;
        height: number;
    }
}

interface AppStorage {
    overall: Task,
}

interface AppState {
    appRuntime: AppRuntime;
    appStorage: AppStorage;
}

const appStateInit: AppState = {
    appStorage: {
        overall: overallInit,
    },
    appRuntime: {
        scheduledTasks: [],
        windowsSize: {
            width: 800,
            height: 600
        }
    }
}

export const appStateAtom = atom<AppState>(appStateInit);

export const windowSizeAtom = atom(
    get => get(appStateAtom).appRuntime.windowsSize,
    (_get, set, update: {
        width: number,
        height: number
    }) => {
        set(appStateAtom, {
            ...appStateInit,
            appRuntime: {
                ...appStateInit.appRuntime,
                windowsSize: update
            }
        })

    });

export const scheduledTasksAtom = atom<Task[]>(get => {
    Scheduler.setAppStorage(get(appStateAtom).appStorage.overall);
    Scheduler.schedule();
    return Scheduler.getSchedule();
});


