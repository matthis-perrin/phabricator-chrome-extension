import {EventEmitter2} from 'eventemitter2'

import {
  ActionTypes,
  Dispatcher,
  SetAppVisiblePayload,
} from '../dispatcher'

let isAppVisible: boolean = false

export const APP_VISIBLE_UPDATED = 'APP_VISIBLE_UPDATED'

class _AppStore extends EventEmitter2 {
  constructor() {
    super()
    Dispatcher.register(ActionTypes.SET_APP_VISIBLE, this.handleSetAppVisible)
  }

  public isAppVisible(): boolean {
    return isAppVisible
  }

  private handleSetAppVisible = (payload: SetAppVisiblePayload) => {
    isAppVisible = payload.isVisible
    this.emit(APP_VISIBLE_UPDATED)
  }
}

export const AppStore = new _AppStore()
