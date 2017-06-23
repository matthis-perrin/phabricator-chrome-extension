import {EventEmitter2} from 'eventemitter2'

import {
  ActionTypes,
  Dispatcher,
  SetTasksPayload,
} from '../dispatcher'

import {Task} from '../models/task'

let tasks: Task[] = []

export const TASKS_UPDATED = 'SEARCH_SET'

class _TasksStore extends EventEmitter2 {
  constructor() {
    super()
    Dispatcher.register(ActionTypes.SET_TASKS, this.handleSetTasks)
  }

  public getTasks(): Task[] {
    return tasks
  }

  private handleSetTasks = (payload: SetTasksPayload) => {
    tasks = payload.tasks
    this.emit(TASKS_UPDATED)
  }
}

export const TasksStore = new _TasksStore()
