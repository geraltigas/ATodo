export type timestamp = number

export type tasks_db = {
  id: timestamp
  root_task: timestamp
  name: string
  goal: string
  deadline: timestamp
  time_consumed: timestamp
  status: 'created' | 'in_progress' | 'paused' | 'suspended' | 'done'
  parent: timestamp
  position_x: number
  position_y: number
  suspended_type: 'time' | 'cyclical' | 'email' | 'constructing' | 'unsupported' | null
  suspended_info: string | null
}

export type app_state_db = {
  id: 0
  root_task: timestamp
  now_viewing_task: timestamp
}

export type root_task_db = {
  id: timestamp
}

export type task_relation_db = {
  id: string
  source: timestamp
  target: timestamp
}


export interface TimeTrigger {
  time: string;
}

export interface EmailTrigger {
  email: string;
}

export interface ConstructingTrigger {
  why: string;
}

export interface UnsupportedTrigger {
  why: string;
}

export interface CyclicalityTrigger {
  interval: string;
  nowAt: number;
  lastTime: string;
}

