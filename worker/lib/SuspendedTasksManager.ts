import {CyclicalityTrigger, SuspendedType, Task, TaskStatus, TimeTrigger} from "../../atodo/state/tasksAtoms.ts";
import dayjs from "dayjs";
import {UpdateOverall} from "../state/tasksAtom.ts";
import {stringify} from "flatted";
import {appStoragePersistence} from "../pages/Worker/WorkerHooks.ts";
import {invoke} from "@tauri-apps/api";

export class SuspendedTasksBuffer {
    private static intervalIds: Map<string, NodeJS.Timeout> = new Map();

    public static init(suspenedTasks: Task[]) {
        suspenedTasks.forEach((task) => {
            if (task.info?.type === SuspendedType.Constructing) {// do nothing
            } else if (task.info?.type === SuspendedType.Unsupported) {// do nothing
            } else if (task.info?.type === SuspendedType.Email) {// TODO: add email trigger
            } else if (task.info?.type === SuspendedType.Time) {
                let cb = () => {
                    console.log("cb")
                    if (dayjs().isAfter(dayjs((task.info!.trigger as TimeTrigger).time))) {
                        console.log("time trigger")
                        task.status = TaskStatus.InProgress;
                        task.info = null;
                        UpdateOverall.value();
                        let str = stringify(appStoragePersistence);
                        invoke<string>("save", {key: "taskStorage", value: str}).then((res) => {
                            console.log(res)
                        })
                        let setIntervalId = SuspendedTasksBuffer.intervalIds.get(task.id);
                        if (setIntervalId !== undefined) {
                            clearInterval(setIntervalId);
                        }
                    }
                }
                if (SuspendedTasksBuffer.intervalIds.has(task.id)) {
                    let setIntervalId = SuspendedTasksBuffer.intervalIds.get(task.id);
                    clearInterval(setIntervalId);
                }
                let setIntervalId = setInterval(cb, 60 * 1000);
                SuspendedTasksBuffer.intervalIds.set(task.id, setIntervalId);
                cb();
            } else if (task.info?.type === SuspendedType.Cyclicality) {
                let cb = () => {
                    let lastTime = dayjs((task.info!.trigger as CyclicalityTrigger).lastTime);
                    let nowAt = (task.info!.trigger as CyclicalityTrigger).nowAt;
                    let interval = (task.info!.trigger as CyclicalityTrigger).interval;
                    let now = dayjs();
                    let nextTime = lastTime.add(interval.split(" ").filter((s) => s !== "").map((s) => parseInt(s))[nowAt], "day");
                    if (now.isAfter(nextTime)) {
                        task.status = TaskStatus.InProgress;
                        task.info!.trigger = {
                            interval: interval,
                            nowAt: (nowAt + 1) % interval.length,
                            lastTime: now.format()
                        }
                        UpdateOverall.value();
                        let str = stringify(appStoragePersistence);
                        invoke<string>("save", {key: "taskStorage", value: str}).then((res) => {
                            console.log(res)
                        })
                        let setIntervalId = SuspendedTasksBuffer.intervalIds.get(task.id);
                        if (setIntervalId !== undefined) {
                            clearInterval(setIntervalId);
                        }
                    }
                }
                if (SuspendedTasksBuffer.intervalIds.has(task.id)) {
                    let setIntervalId = SuspendedTasksBuffer.intervalIds.get(task.id);
                    clearInterval(setIntervalId);
                }
                let setIntervalId = setInterval(cb, 60 * 1000);
                SuspendedTasksBuffer.intervalIds.set(task.id, setIntervalId);
                cb();
            } else {
            }
        })
    }
}

