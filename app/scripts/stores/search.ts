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
let isSearching = false
let retriggerSearch = false

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
    if (isSearching) {
      retriggerSearch = true
      return
    }
    if (search === '') {
      searchResults = undefined
      this.emit(SEARCH_RESULTS_UPDATED)
    } else {
      isSearching = true
      fuzzySearch.search(search).then((results) => {
        searchResults = results
        isSearching = false
        this.emit(SEARCH_RESULTS_UPDATED)
        if (retriggerSearch) {
          retriggerSearch = false
          this.recomputeSearchResults()
        }
      })
    }
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
