import {AppStorage, AppStorageInit} from "../state/tasksAtoms.ts";
import {invoke} from "@tauri-apps/api";
import {parse, stringify} from "flatted";

// useEffect(() => {
//     invoke<string>('load', {key: "taskStorage"}).then((res) => {
//         let taskStorage: AppStorage = parse(res as string);
//         setAppStorage(taskStorage);
//     })
// }, []);

export const storage = {
    async getAppStorage(key: string): Promise<AppStorage> {
        try {
            const res = await invoke<string>('load', {key: key});
            return parse(res);
        } catch (err) {
            console.log(err);
            return AppStorageInit;
        }
    },
    async setAppStorage(key: string, value: AppStorage): Promise<void> {
        try {
            await invoke<void>('save', {key: key, value: stringify(value)});
        } catch (err) {
            console.log(err);
        }
    }
}