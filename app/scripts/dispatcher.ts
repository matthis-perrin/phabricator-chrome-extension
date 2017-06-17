import {EventEmitter2} from 'eventemitter2'


export enum ActionTypes {
  SET_SEARCH
}


export interface SetSearchPayload {
  search: string
}


type PayloadTypes = SetSearchPayload


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
