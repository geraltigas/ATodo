import Board from '../Board/Board'
import styles from './FatherNodeBoard.module.css'
import { useState } from 'react'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import LeftArrowIcon from '@mui/icons-material/ArrowLeft'
import { now_viewing_task } from '../../state/atodo'

export default function FatherNodeBoard() {
  const [showFatherNodeBoard, setShowFatherNodeBoard] = useState(false)
  return (
    <div className={styles.Board}>
      {showFatherNodeBoard && <Board task_id_signal={now_viewing_task} />}
      <div onClick={() => setShowFatherNodeBoard(!showFatherNodeBoard)} className={styles.showFatherNodeBoard}>
        {showFatherNodeBoard ? <LeftArrowIcon /> : <ArrowRightIcon />}
      </div>
    </div>
  )
}
