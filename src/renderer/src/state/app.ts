// use preact to create a signal
import { Signal, signal } from '@preact/signals'
import { timestamp } from '../../../types/sql'

const root_task_init: timestamp = 0
const root_task: Signal<timestamp> = signal<timestamp>(root_task_init)

const window_size_retore: Signal<number[]> = signal<number[]>([0, 0])

export {
  root_task,
  window_size_retore
}
