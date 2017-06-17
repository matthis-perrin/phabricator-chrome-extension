import {EventEmitter2} from 'eventemitter2'

import {
  ActionTypes,
  Dispatcher,
  SetSearchPayload,
} from '../dispatcher'
import {SearchResults} from '../models/search'
import {FuzzySearch} from '../search'
import {TasksStore, TASKS_UPDATED} from '../stores/tasks'

let search = ''
let searchResults: SearchResults | undefined
let fuzzySearch = new FuzzySearch(TasksStore.getTasks())

export const SEARCH_UPDATED = 'SEARCH_UPDATED'
export const SEARCH_RESULTS_UPDATED = 'SEARCH_RESULTS_UPDATED'

class _SearchStore extends EventEmitter2 {
  constructor() {
    super()
    Dispatcher.register(ActionTypes.SET_SEARCH, this.handleSetSearch)
    TasksStore.on(TASKS_UPDATED, this.handleTasksUpdated)
  }

  public getSearch(): string {
    return search
  }

  public getSearchResults(): SearchResults | undefined {
    return searchResults
  }

  private recomputeSearchResults = () => {
    searchResults = fuzzySearch.search(search)
    this.emit(SEARCH_RESULTS_UPDATED)
  }

  private handleTasksUpdated = () => {
    fuzzySearch = new FuzzySearch(TasksStore.getTasks())
    this.recomputeSearchResults()
  }

  private handleSetSearch = (payload: SetSearchPayload) => {
    search = payload.search
    this.emit(SEARCH_UPDATED)
    this.recomputeSearchResults()
  }
}

export const SearchStore = new _SearchStore()
