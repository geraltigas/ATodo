// import {suspendedTasksAtom} from "../../state/tasksAtom.ts";
// import {Task} from "../../../atodo/state/tasksAtoms";
import styles from './SuspendedTasks.module.css'

const SuspendedTasks = () => {

  // const suspendedTasks = useAtomValue(suspendedTasksAtom)
  // console.log('suspendedTasks', suspendedTasks)

  // const onClick = (task: Task) => {
  //   return (_e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  //     openTaskBoardAndSave(task)
  //   }
  // }

  return (
    <div className={styles.SuspendedTasks}>
      {/*{suspendedTasks.map((task, index) => {*/}
      {/*  return (*/}
      {/*    <div key={index} onClick={onClick(task)} className={styles.card}>*/}
      {/*      <div className={styles.fontOneLine}>*/}
      {/*        <pre className={styles.redFont + ' ' + styles.noMargin}>{task.name}:</pre>*/}
      {/*        <pre className={styles.noMargin}>{task.info?.type}</pre>*/}
      {/*      </div>*/}
      {/*      {Object.entries(task.info!.trigger).map(([key, value], index) => {*/}
      {/*        return (*/}
      {/*          <div key={index} className={styles.fontOneLine}>*/}
      {/*            <pre className={styles.redFont + ' ' + styles.noMargin}>{key}:</pre>*/}
      {/*            <pre className={styles.noMargin}>{value}</pre>*/}
      {/*          </div>*/}
      {/*        )*/}
      {/*      })}*/}
      {/*    </div>*/}

      {/*  )*/}
      {/*})}*/}
      {/*{suspendedTasks.length === 0 && <div>no suspended tasks</div>}*/}
    </div>
  )
}

export default SuspendedTasks
