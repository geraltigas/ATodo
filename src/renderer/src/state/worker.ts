import {signal, Signal} from '@preact/signals'
import {tasks_db, timestamp} from '../../../types/sql'

const mouse_enter_init: boolean = false
const mouse_enter: Signal<boolean> = signal<boolean>(mouse_enter_init)

export const WORKER_GLOBAL = {
  window_element: null as HTMLElement | null,
  resize_observer: null as ResizeObserver | null
}

export type TimeRecord = {
  minutes: number;
  seconds: number;
  hours: number;
}
export const time_record_init: timestamp = 0
const time_record: Signal<timestamp> = signal<timestamp>(time_record_init)

const scheduled_tasks: Signal<tasks_db[]> = signal<tasks_db[]>([])

const suspended_tasks: Signal<tasks_db[]> = signal<tasks_db[]>([])

const tick_init: boolean = false
const tick: Signal<boolean> = signal<boolean>(tick_init)

export {
  mouse_enter,
  mouse_enter_init,
  time_record,
  scheduled_tasks,
  suspended_tasks,
  tick
}
