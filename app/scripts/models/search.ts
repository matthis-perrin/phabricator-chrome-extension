import {Task} from './task'

export interface SearchRange {
  index: number
  length: number
}

export interface SearchRangeWithSimilarity extends SearchRange {
  similarity: number
}

export interface SearchResult {
  task: Task
  score: {
    steps: number
    relative: number
    best: number
  }
  matches: SearchMatch
}

export interface SearchResults {
  topResults: SearchResult[]
  otherResults: SearchResult[]
}

export type SearchMatch = {[key: string]: SearchRangeWithSimilarity[]}
