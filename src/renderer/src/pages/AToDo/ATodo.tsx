import styles from './AToDo.module.css'
import Flow from '../../components/Flow/Flow'
import useDocumentEvent from '../../hooks/use_event_atodo'
import NowSelectedBoard from '../../components/NowSelectedBoard/NowSelectedBoard'
import FatherNodeBoard from '../../components/FatherNodeBoard/FatherNodeBoard'
import { now_selected } from '../../state/atodo'

export default function ATodo() {

  useDocumentEvent()

  // const nowSelected = useAtomValue(nowSelectedAtom)

  return (
    <div className={styles.Window}>
      <div className={styles.AToDo}>
        <FatherNodeBoard />
        <Flow
        />
        {(now_selected.value.type === 'node') && (
          <NowSelectedBoard />
        )}
      </div>
    </div>

  )
}
