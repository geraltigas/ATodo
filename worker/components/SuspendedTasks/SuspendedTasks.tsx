import {useAtomValue} from "jotai";
import {suspendedTasksAtom} from "../../state/tasksAtom.ts";
import {openTaskBoardAndSave} from "../TaskShow/TaskShow.tsx";
import {Task} from "../../../atodo/state/tasksAtoms.ts";
import React from "react";
import styles from "./SuspendedTasks.module.css"

const SuspendedTasks = () => {

    const suspendedTasks = useAtomValue(suspendedTasksAtom);
    console.log("suspendedTasks", suspendedTasks)

    const onClick = (task: Task) => {
        return (_e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            openTaskBoardAndSave(task);
        }
    }

    return (
        <div className={styles.SuspendedTasks}>
            {suspendedTasks.map((task, index) => {
                return (
                    <div key={index} onClick={onClick(task)}>
                        <div>{task.name}:{task.info?.type}</div>
                        {Object.entries(task.info!.trigger).map(([key, value], index) => {
                            return (
                                <div key={index}>
                                    <div>{key}:{value}</div>
                                </div>
                            )
                        })}
                    </div>

                )
            })}
            {suspendedTasks.length === 0 && <div>no suspended tasks</div>}
        </div>
    )
}

export default SuspendedTasks;