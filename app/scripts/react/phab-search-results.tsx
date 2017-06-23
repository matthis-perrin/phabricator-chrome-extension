import * as React from 'react'
import * as cx from 'classnames'

import {SearchResults, SearchResult} from '../models/search'
import {SEARCH_RESULTS_UPDATED, SearchStore} from '../stores/search'
import {PhabTaskRow} from './phab-task-row'

interface PhabSearchResultsState {
  searchResults?: SearchResults
}

export class PhabSearchResults extends React.Component<{}, PhabSearchResultsState> {
  displayName: 'PhabSearchResults'

  state = {
    searchResults: undefined
  } as PhabSearchResultsState

  componentWillMount() {
    SearchStore.on(SEARCH_RESULTS_UPDATED, this.handleSearchResultsUpdated)
  }

  private handleSearchResultsUpdated = () => {
    this.setState({searchResults: SearchStore.getSearchResults()})
  }

  private renderBody() {
    if (!this.state.searchResults) {
      return 'Empty search'
    }

    const topResults = this.state.searchResults.topResults
    const otherResults = this.state.searchResults.otherResults

    const mapResults = (searchResults: SearchResult[]): JSX.Element => {
      return (
        <div>
          {searchResults.map((searchResult: SearchResult, i: number): JSX.Element => {
            const task = searchResult.task
            const props = {
              className: cx({
                'phab-task-row-wrapper': true,
                'phab-task-row-wrapper--odd': i % 2 === 1
              }),
              style: { borderColor: `transparent transparent transparent ${task.priority.colorHex}` },
              key: `task-${task.id}`,
            }
            return (
              <div {...props}>
                <PhabTaskRow
                  task={task}
                  searchResult={searchResult}
                />
              </div>
            )
          })}
        </div>
      )
    }
    if (topResults.length > 0) {
      return (
        <span>
          <div>{`Top (${topResults.length})`}</div>
          <div>{mapResults(topResults)}</div>
        </span>
      )
    } else {
      return (
        <span>
          <div>{`Others (${otherResults.length})`}</div>
          <div>{mapResults(otherResults)}</div>
        </span>
      )
    }
  }

  render() {
    return (
      <div className="phab-search-results">
        {this.renderBody()}
      </div>
    )
  }
}
