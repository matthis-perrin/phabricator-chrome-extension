import * as React from 'react'

import {SearchResults, SearchResult} from '../models/search'
import {SEARCH_RESULTS_UPDATED, SearchStore} from '../stores/search'


interface PhabSearchResultsState {
  searchResults?: SearchResults
}

export class PhabSearchResults extends React.Component<{}, PhabSearchResultsState> {
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
    const mapResults = (searchResults: SearchResult[]): JSX.Element => {
      return (
        <div>
          {searchResults.map((searchResult) => {
            return <div>{searchResult.task.id + ' - ' + searchResult.task.title}</div>
          })}
        </div>
      )
    }
    return (
      <span>
        <div>{`Top (${this.state.searchResults.topResults.length})`}</div>
        <div>{mapResults(this.state.searchResults.topResults)}</div>
        <div>{`Others (${this.state.searchResults.otherResults.length})`}</div>
        <div>{mapResults(this.state.searchResults.otherResults)}</div>
      </span>
    )
  }

  render() {
    return (
      <div className="phab-search-results">
        {this.renderBody()}
      </div>
    )
  }
}
