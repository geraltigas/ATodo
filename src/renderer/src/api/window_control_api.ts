import { window_size_retore } from '../state/app'
import { task_api } from './task_api'
import { WORKER_GLOBAL } from '../state/worker'
import { timestamp } from '../../../types/sql'
import { app_state_api } from './app_state_api'

export class window_control_api {
  public static set_frameless(): void {
    // @ts-ignore
    window.win.set_frameless()
  }

  public static set_fullscreen(): void {
    // @ts-ignore
    window.win.fullscreen(true)
  }

  public static set_miminize(): void {
    // @ts-ignore
    window.win.miminize(true)
  }

  public static set_maximize(): void {
    // @ts-ignore
    window.win.maximize(true)
  }

  public static set_close(): void {
    // @ts-ignore
    window.win.close(true)
  }

  public static exit_maximize(): void {
    // @ts-ignore
    window.win.unmaximize(true)
  }

  public static async set_window_size(width: number, height: number): Promise<void> {
    // @ts-ignore
    // await win.set_window_size(width, height)
    return new Promise<void>((resolve, reject) => {
      // @ts-ignore
      window.win.set_window_size(width, height).then(() => {
        resolve()
      }).catch((err) => {
        reject(err)
      })
    })
  }

  public static async set_resizable(set: boolean): Promise<void> {
    // @ts-ignore
    // await win.set_resizable(set)
    return new Promise<void>((resolve, reject) => {
      // @ts-ignore
      window.win.set_resizable(set).then(() => {
        resolve()
      }).catch((err) => {
        reject(err)
      })
    })
  }

  public static async get_window_size(): Promise<number[]> {
    // @ts-ignore
    // return win.get_window_size()
    return new Promise<number[]>((resolve, reject) => {
      // @ts-ignore
      window.win.get_window_size().then((size: number[]) => {
        resolve(size)
      }).catch((err) => {
        reject(err)
      })
    })
  }

  public static back_to_atodo(unregister_all_event_listener: (() => void) | null, navigate: (path: string) => void): void {
    window_control_api.set_resizable(true).then(() => {
      if (unregister_all_event_listener !== null) {
        unregister_all_event_listener()
      }
      return window_control_api.set_window_size(window_size_retore.value[0], window_size_retore.value[1])
    }).then(() => {
      return task_api.flush_to_db()
    }).then(() => {
      WORKER_GLOBAL.resize_observer!.disconnect()
      navigate('/')
    })
  }

  public static edit_suspened_task(id: timestamp, navigate: (path: string) => void): void {
    let task = task_api.get_task_from_buffer(id)
    app_state_api.set_now_viewing_task(task.parent).then(() => {
      return app_state_api.set_now_selected_task(task.id)
    }).then(() => {
      window_control_api.back_to_atodo(null, navigate)
    })
  }
}
