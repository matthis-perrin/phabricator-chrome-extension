import {Promise} from 'rsvp'
import {levenshtien, LevenshtienSearchResult} from './damerau-levenshtein'

import {Task} from './models/task'
import {
  SearchRange,
  SearchResult,
  SearchResults,
} from './models/search'

interface SearchScore extends LevenshtienSearchResult {
  _content: string
  _search: string
  _field: {[key: string]: string}
}

function searchScoreFromLevenshtien(levenshtein: LevenshtienSearchResult): SearchScore {
  return {
    steps: levenshtein.steps,
    relative: levenshtein.relative,
    similarity: levenshtein.similarity,
    _content: '',
    _search: '',
    _field: {},
  }
}

interface DetailedSearchResult {
  task: Task
  globalStepsScore: number
  globalRelativeScore: number
  bestGlobalRelativeScore: number
  detailedResult: SearchScore[]
  matches: {[key: string]: SearchRange[]}
}


export class FuzzySearch {
  private _tasks: Task[]

  constructor(tasks: Task[]) {
    this._tasks = tasks
  }

  search(searchString: string): Promise<SearchResults> {
    return new Promise<SearchResults>((resolve, reject) => {
      // Score each tasks
      scoreTasks(searchString, this._tasks).then((results: DetailedSearchResult[]) => {
        // Sort results by score
        results.sort((res1, res2) => {
          if (res1.bestGlobalRelativeScore !== res2.bestGlobalRelativeScore) {
            return res2.bestGlobalRelativeScore - res1.bestGlobalRelativeScore
          }
          if (res1.globalRelativeScore !== res2.globalRelativeScore) {
            return res2.globalRelativeScore - res1.globalRelativeScore
          }
          return res1.globalStepsScore - res2.globalStepsScore
        })


        // Count how many relevant results we want to return
        let topResultCount = 0
        for (let i = 0; i < results.length; i++) {
          if (results[i].bestGlobalRelativeScore >= 0.4) {
            topResultCount++
          } else {
            break
          }
        }

        // Split results in two groups
        const topResults = results.slice(0, topResultCount)
        const otherResults = results.slice(topResultCount)


        // Extract context for the top results
        for (let result of topResults) {
          const matches: {[key: string]: SearchRange[]} = {}
          for (let i = 0; i < result.detailedResult.length; i++) {
            const detail = result.detailedResult[i]
            const value = valueFromKey(result.task, detail._field.key) || ''
            const index = value.toLowerCase().indexOf(detail._content)
            const matchesInString = findMatches(detail._search, detail._content)
            matchesInString.forEach((match) => { match.index += index })
            if (!matches[detail._field.key]) {
              matches[detail._field.key] = []
            }
            matches[detail._field.key] = matches[detail._field.key].concat(matchesInString)
          }

          // Merge matches by field
          for (let matchKey of Object.keys(matches)) {
            let matchData = matches[matchKey]
            if (matchData.length > 1) {
              const stack: SearchRange[] = []
              matchData.sort((match1, match2) => {
                return match1.index - match2.index
              })
              stack.push(matchData[0])
              matchData.slice(1).forEach((range, i) => {
                let top = stack[stack.length - 1]
                if (top.index + top.length < range.index) {
                  stack.push(range)
                } else {
                  top.length = range.index - top.index + range.length
                }
              })
              matches[matchKey] = stack
            }
          }
          result.matches = matches
        }


        // Sort top results again using the match context
        topResults.sort((res1, res2) => {
          if (res1.globalRelativeScore !== res2.globalRelativeScore) {
            return res2.globalRelativeScore - res1.globalRelativeScore
          }
          if (res1.globalStepsScore !== res2.globalStepsScore) {
            return res1.globalStepsScore - res2.globalStepsScore
          }
          return sortRange((Object as any).values(res1.matches)[0], (Object as any).values(res2.matches)[0])
        })


        // Format results
        const resultMapper = (res: DetailedSearchResult): SearchResult => { return {
          task: res.task,
          score: {
            steps: res.globalStepsScore,
            relative: res.globalRelativeScore,
            best: res.bestGlobalRelativeScore,
          },
          matches: res.matches,
        }}

        resolve({
          topResults: topResults.map(resultMapper),
          otherResults: otherResults.map(resultMapper),
        })
      })
    })
  }

}


function scoreTasks(searchString: string, tasks: Task[]): Promise<DetailedSearchResult[]> {
  if (tasks.length === 0) {
    return Promise.resolve<DetailedSearchResult[]>([])
  }
  const taskNumber = Math.min(50, tasks.length)
  const results = tasks.slice(0, taskNumber).map<DetailedSearchResult>(scoreTask.bind(null, searchString))
  const promise = new Promise<DetailedSearchResult[]>((resolve, reject) => {
    setTimeout(() => {
      scoreTasks(searchString, tasks.slice(taskNumber)).then((recursionResults: DetailedSearchResult[]) => {
        resolve(results.concat(recursionResults))
      })
    }, 0)
  })
  return promise
}


function scoreTask(searchString: string, task: Task): DetailedSearchResult {
  const splitters = /\W/
  const splitSearchStrings = searchString.split(splitters).filter(Boolean)
  const fields = fieldsForTask(task)
    let detailedResult: SearchScore[] = []
    let globalStepsScoreSet = false
    let globalStepsScore = 1e10
    let globalRelativeScore = 0
    let bestGlobalRelativeScore = globalRelativeScore

    let contributions = 0

    // Find best match for each token
    for (let searchToken of splitSearchStrings) {
      searchToken = searchToken.toLowerCase()
      let bestPerField: {[field: string]: SearchScore} = {}
      for (let field of fields) {
        for (let contentToken of (valueFromKey(task, field.key) || '').split(splitters).filter(Boolean)) {
          contentToken = contentToken.toLowerCase()
          let innerBest = searchScoreFromLevenshtien(levenshtien(searchToken, contentToken))
          innerBest._content = contentToken
          if (contentToken.length > searchToken.length) {
            for (let i = 0; i <= contentToken.length - searchToken.length; i++) {
              const subContent = contentToken.substring(i, searchToken.length + i)
              const score = searchScoreFromLevenshtien(levenshtien(searchToken, subContent))
              if (isBetterLevenshtien(score, innerBest)) {
                innerBest = score
                innerBest._content = subContent
              }
            }
          }
          if (!bestPerField[field.key] || isBetterLevenshtien(innerBest, bestPerField[field.key])) {
            innerBest._search = searchToken
            innerBest._field = field
            bestPerField[field.key] = innerBest
          }
        }
      }
      const allScores: SearchScore[] = (Object as any).values(bestPerField)
      const bestScores = allScores.filter((best) => { return best.similarity > 0.2 })
      detailedResult = detailedResult.concat(bestScores)
      for (let best of bestScores) {
        if (!globalStepsScoreSet) {
          globalStepsScore = 0
          globalStepsScoreSet = true
        }
        globalStepsScore += best.steps * best.steps
        globalRelativeScore += best.similarity * best.similarity
        bestGlobalRelativeScore = Math.max(globalRelativeScore, bestGlobalRelativeScore)
        contributions++
      }
    }
    return {
      task: task,
      globalStepsScore: globalStepsScore / contributions,
      globalRelativeScore: globalRelativeScore / contributions,
      bestGlobalRelativeScore: bestGlobalRelativeScore,
      detailedResult: detailedResult,
      matches: {}
    }
}


function fieldsForTask(task: Task): {[key: string]: string}[] {
  const fields = [
    {'key': 'title'},
    {'key': 'owner.text'},
    {'key': 'id'},
  ]
  for (let i = 0; i < task.tags.length; i++) {
    fields.push({'key': `tags.${i}.text`})
  }
  return fields
}


function valueFromKey(obj: Task, key: string): string | null {
  const keys = key.split('.')
  let value: any = obj
  for (let key of keys) {
    try {
      value = value[key]
    } catch(e) {
      return null
    }
  }
  return value as string
}


function isBetterLevenshtien(score1: SearchScore, score2: SearchScore): boolean {
  if (score1.similarity === score2.similarity) {
    return score1.steps < score2.steps
  }
  return score1.similarity > score2.similarity
}


function sortRange(rangeData1: SearchRange[], rangeData2: SearchRange[]): number {
  const lengthCount = (sum: number, range: SearchRange) => { return sum + (range.length * range.length) }
  const indexMin = (min: number, range: SearchRange) => { return Math.min(min, range.index) }
  const lengthScore1 = rangeData1.reduce(lengthCount, 0)
  const lengthScore2 = rangeData2.reduce(lengthCount, 0)
  if (lengthScore1 === lengthScore2) {
    const indexMin1 = rangeData1.reduce(indexMin, 1e10)
    const indexMin2 = rangeData2.reduce(indexMin, 1e10)
    return indexMin1 - indexMin2
  }
  return lengthScore2 - lengthScore1
}


function findMatches(search: string, str: string): SearchRange[] {
  const allMatches = findMatchesRecursive(search, str, 0, [])
  const allRanges = []
  for (let matches of allMatches) {
    const ranges = []
    const consecutives = []
    let searchIndexes = (Object as any).values(matches)
    for (let index of searchIndexes) {
      index = parseFloat(index)
      if (index === null) {
        continue
      }
      if (consecutives.length === 0) {
        consecutives.push([index])
        continue
      }
      const last = consecutives[consecutives.length - 1]
      const lastIndex = last[last.length - 1]
      if (index === lastIndex + 1) {
        last.push(index)
        continue
      }
      consecutives.push([index])
    }
    for (let consecutive of consecutives) {
      ranges.push({index: matches.indexOf(consecutive[0]), length: consecutive.length})
    }
    allRanges.push(ranges)
  }
  allRanges.sort(sortRange)
  return allRanges[0]
}

type Match = (number | undefined)[]
function findMatchesRecursive(search: string, str: string, startIndex: number, matches: Match): Match[] {
  if (startIndex >= search.length) {
    return [matches]
  }

  const charToMatch = search[startIndex]
  const possibleMatches = [matches]
  for (let i = 0; i < str.length; i++) {
    if (str[i] === charToMatch) {
      if (matches[i] === undefined) {
        const newMatches = matches.slice()
        newMatches[i] = startIndex
        possibleMatches.push(newMatches)
      }
    }
  }
  if (possibleMatches.length > 1) {
    possibleMatches.shift()
  }

  let finalMatches: Match[] = []
  for (let _matches of possibleMatches) {
    const recursRes = findMatchesRecursive(search, str, startIndex + 1, _matches)
    finalMatches = finalMatches.concat(recursRes)
  }

  return finalMatches
}
