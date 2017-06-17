import {EventEmitter2} from 'eventemitter2'

import {
  ActionTypes,
  Dispatcher,
  SetSearchPayload,
} from '../dispatcher'

let search = ''

export const SEARCH_SET = 'SEARCH_SET'

class _SearchStore extends EventEmitter2 {
  constructor() {
    super()
    Dispatcher.register(ActionTypes.SET_SEARCH, this.handleSetSearch)
  }

  public getSearch(): string {
    return search
  }

  private handleSetSearch = (payload: SetSearchPayload) => {
    search = payload.search
  }
}

export const SearchStore = new _SearchStore()
