import styles from './ShowTime.module.css'
import { from_timestamp_to_timerecord } from '../TaskShow/TaskShow'
import { time_record } from '../../state/worker'
import { useSignal } from '@preact/signals'

export const ShowTime = () => {
  const with_second = useSignal(true)
  let time: string
  let showTimeConsumed = from_timestamp_to_timerecord(time_record.value)
  if (!with_second.value) {
    time = (showTimeConsumed.hours === 0 ? '' : (showTimeConsumed.hours < 10 ? '0' + showTimeConsumed.hours.toString() + ':' : showTimeConsumed.hours.toString() + ':')) + (showTimeConsumed.minutes < 10 ? '0' + showTimeConsumed.minutes.toString() : showTimeConsumed.minutes.toString())
  } else {
    time = (showTimeConsumed.hours === 0 ? '' : (showTimeConsumed.hours < 10 ? '0' + showTimeConsumed.hours.toString() + ':' : showTimeConsumed.hours.toString() + ':')) + (showTimeConsumed.minutes < 10 ? '0' + showTimeConsumed.minutes.toString() : showTimeConsumed.minutes.toString()) + ':' + (showTimeConsumed.seconds < 10 ? '0' + showTimeConsumed.seconds.toString() : showTimeConsumed.seconds.toString())
  }
  return (
    <div className={styles.taskFont} onClick={() => {
      console.log('click')
      with_second.value = !with_second.value
    }}>
      {time}
    </div>
  )
}
