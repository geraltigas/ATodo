import {useEffect} from 'react'
import {tick, time_record, WORKER_GLOBAL} from '../../state/worker'
import {window_control_api} from '../../api/window_control_api'
import {schedule} from '../../lib/Scheduler'

export const use_observe_window_size = () => {
  useEffect(() => {
    WORKER_GLOBAL.window_element = document.getElementById('window_size_observe') as HTMLDivElement
    WORKER_GLOBAL.resize_observer = new ResizeObserver(async (entries) => {
      for (let entry of entries) {
        window_control_api.set_resizable(true).then(() => {
          return window_control_api.set_window_size(entry.contentRect.width, entry.contentRect.height)
        }).then(() => {
          return window_control_api.set_resizable(false)
        }).then(() => {
        })
      }
    })
    WORKER_GLOBAL.resize_observer.observe(WORKER_GLOBAL.window_element)
    WORKER_GLOBAL.ringing_audio = document.getElementById('ringing_audio') as HTMLAudioElement
  }, [])
}

let interval_id: NodeJS.Timeout

export const use_init_data = () => {
  useEffect(() => {
    schedule()

    if (interval_id) {
      clearInterval(interval_id)
    }
    interval_id = setInterval(() => {
      if (tick.value) {
        time_record.value = time_record.value + 1
      }
    }, 1000)

  }, [])
}
