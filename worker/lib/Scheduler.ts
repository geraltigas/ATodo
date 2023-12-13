import {Task, TaskStatus} from "../../atodo/state/tasksAtoms.ts";
import dayjs from "dayjs";

function iterable(tempTasks: Set<Task>): boolean {
    return tempTasks.size !== 0;
}

function iterateSearching(targetNodesNotSourceNodes: Set<string>, scheduledTaskThisLayer: Set<Task>, idTaskMap: Map<string, Task>, targetToSourceMap: Map<string, string[]>) {
    let targetNodesNotSourceNodesTemp: Set<Task> = new Set();
    targetNodesNotSourceNodes.forEach((targetNode) => {
        targetNodesNotSourceNodesTemp.add(idTaskMap.get(targetNode)!);
    });

    while (iterable(targetNodesNotSourceNodesTemp)) {
        let innerTemp: Set<Task> = new Set();
        targetNodesNotSourceNodesTemp.forEach((targetNode) => {
            switch (targetNode.status) {
                case TaskStatus.Created:
                    let tempBool = true;
                    if (!targetToSourceMap.has(targetNode.id)) {
                        scheduledTaskThisLayer.add(targetNode);
                        break;
                    }
                    targetToSourceMap.get(targetNode.id)!.forEach((sourceNode) => {
                        if (idTaskMap.get(sourceNode)!.status !== TaskStatus.Done) {
                            tempBool = false;
                            innerTemp.add(idTaskMap.get(sourceNode)!);
                        }
                    })
                    if (tempBool) {
                        scheduledTaskThisLayer.add(targetNode);
                    }
                    break;
                case TaskStatus.Done:
                    break;
                case TaskStatus.InProgress:
                    scheduledTaskThisLayer.add(targetNode);
                    break;
                case TaskStatus.Suspended:
                    scheduledTaskThisLayer.add(targetNode);
                    break;
            }
        });
        targetNodesNotSourceNodesTemp = innerTemp;
    }
}

export class Scheduler {
    private static appStorage: Task | null = null;
    private static scheduledTasks: Task[] = [];
    private static suspendedTasks: Task[] = [];

    public static setAppStorage(appStorage: Task) {
        this.appStorage = appStorage;
    }

    public static schedule() {
        this.scheduledTasks = [];
        this.suspendedTasks = [];
        let temp = Array.from(this.scheduleTask(this.appStorage!));
        temp.forEach((task) => {
            if (task.status !== TaskStatus.Suspended) {
                this.scheduledTasks.push(task);
            } else {
                this.suspendedTasks.push(task);
            }
        })

        // reorder this.scheduledTasks
        this.scheduledTasks.sort((a, b) => {
            // combine dayjs date and time
            let aDeadline = dayjs(a.deadline);
            let bDeadline = dayjs(b.deadline);
            return aDeadline.isBefore(bDeadline) ? -1 : 1;
        })
    }

    public static getSchedule(): Task[] {
        return this.scheduledTasks;
    }

    public static getSuspendedTasks(): Task[] {
        return this.suspendedTasks;
    }

    private static scheduleTask(task: Task): Set<Task> {
        let scheduledTasks: Set<Task> = new Set();
        let scheduledTaskThisLayer: Set<Task> = new Set();
        let sourceToTargetMap = new Map<string, string[]>();
        let targetToSourceMap = new Map<string, string[]>();
        let idTaskMap = new Map<string, Task>();
        let isConnectMap = new Map<string, boolean>();
        if (task.subtasks.nodes.length === 0) {
            if (task.status !== TaskStatus.Done) {
                scheduledTasks.add(task);
            }
            return scheduledTasks;
        }
        task.subtasks.edges.forEach((edge) => {
            let source = edge[0];
            let target = edge[1];
            if (sourceToTargetMap.has(source)) {
                sourceToTargetMap.get(source)!.push(target);
            } else {
                sourceToTargetMap.set(source, [target]);
            }
            if (targetToSourceMap.has(target)) {
                targetToSourceMap.get(target)!.push(source);
            } else {
                targetToSourceMap.set(target, [source]);
            }
            isConnectMap.set(source, true);
            isConnectMap.set(target, true);
        });
        if (task.subtasks.edges.length === 0) {
            // scheduledTasks = scheduledTasks.concat(task.subtasks.nodes)
            // union operator
            scheduledTaskThisLayer = new Set([...scheduledTaskThisLayer, ...task.subtasks.nodes]);
        }
        task.subtasks.nodes.forEach((node) => {
            idTaskMap.set(node.id, node);
            if (!isConnectMap.has(node.id)) {
                scheduledTaskThisLayer.add(node);
            }
        });

        let sourceNodes = new Set(task.subtasks.edges.map((edge) => edge[0]));
        let targetNodes = new Set(task.subtasks.edges.map((edge) => edge[1]));

        let targetNodesNotSourceNodes: Set<string> = new Set([...targetNodes].filter(x => !sourceNodes.has(x)));

        iterateSearching(targetNodesNotSourceNodes, scheduledTaskThisLayer, idTaskMap, targetToSourceMap)

        scheduledTaskThisLayer.forEach((task) => {
            scheduledTasks = new Set([...scheduledTasks, ...this.scheduleTask(task)]);
        })

        return scheduledTasks;
    }
}