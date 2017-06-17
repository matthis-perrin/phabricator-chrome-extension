import {
  ActionTypes,
  Dispatcher,
} from '../dispatcher'

export function search(search: string) {
  Dispatcher.dispatch(ActionTypes.SET_SEARCH, {search})
}
