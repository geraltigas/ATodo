import Board from '../Board/Board'
import { Node, now_selected } from '../../state/app'
import { useComputed } from '@preact/signals'

export default function NowSelectedBoard() {
  let selected_task_id_signal = useComputed(() => {
    let tmp = (now_selected.value.reference as Node)
    if (tmp === null) {
      return 0
    }
    return Number(tmp.id)
  })
  return (
    <>
      <Board task_id_signal={selected_task_id_signal} />
    </>
  )
}
