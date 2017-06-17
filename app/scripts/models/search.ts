import {Task} from './task'

export interface SearchRange {
  index: number
  length: number
}

export interface SearchResult {
  task: Task
  score: {
    steps: number
    relative: number
    best: number
  }
  matches: {[key: string]: SearchRange[]}
}

export interface SearchResults {
  topResults: SearchResult[]
  otherResults: SearchResult[]
}
