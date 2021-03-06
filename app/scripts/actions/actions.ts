import {
  ActionTypes,
  Dispatcher,
} from '../dispatcher'
import {Task} from '../models/task'

export function setAppVisible(isVisible: boolean) {
  Dispatcher.dispatch(ActionTypes.SET_APP_VISIBLE, {isVisible})
}

export function search(search: string) {
  Dispatcher.dispatch(ActionTypes.SET_SEARCH, {search})
}

export function setTasks(tasks: Task[]) {
  Dispatcher.dispatch(ActionTypes.SET_TASKS, {tasks})
}
