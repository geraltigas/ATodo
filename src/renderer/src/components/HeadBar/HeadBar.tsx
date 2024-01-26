import styles from './HeadBar.module.css'
import RemoveIcon from '@mui/icons-material/Remove'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import CloseIcon from '@mui/icons-material/Close'
import { useSignal } from '@preact/signals'
import { window_control_api } from '../../api/window_control_api'

export const HeadBar = () => {

  const full_screen = useSignal(false)

  return (
    <div className={styles.HeadBar}>
      {/*<div className={styles.Title}>*/}
      {/*  AToDo*/}
      {/*</div>*/}
      <div className={styles.draggable}></div>
      <div className={styles.Menu}>
        <div className={styles.MenuButton} onClick={() => window_control_api.set_miminize()}><RemoveIcon /></div>
        <div className={styles.MenuButton} onClick={() => {
          if (full_screen.value) window_control_api.exit_maximize()
          else window_control_api.set_maximize()
          full_screen.value = !full_screen.value
        }}> {full_screen.value ? <FullscreenExitIcon /> : <FullscreenIcon />}</div>
        <div className={styles.MenuButton} onClick={() => window_control_api.set_close()}><CloseIcon /></div>
      </div>
    </div>
  )
}
