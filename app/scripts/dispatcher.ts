import {EventEmitter2} from 'eventemitter2'
import {Task} from './models/task'


export enum ActionTypes {
  SET_SEARCH,
  SET_TASKS,
}


export interface SetSearchPayload {
  search: string
}
export interface SetTasksPayload {
  tasks: Task[]
}

type PayloadTypes = SetSearchPayload | SetTasksPayload


class _Dispatcher extends EventEmitter2 {
  register(actionType: ActionTypes, handler: (payload: PayloadTypes) => void) {
    this.on(actionType.toString(), handler)
    return () => {
      this.off(actionType.toString(), handler)
    }
  }

  dispatch(actionType: ActionTypes, payload: PayloadTypes) {
    this.emit(actionType.toString(), payload)
  }
}

export const Dispatcher = new _Dispatcher()
