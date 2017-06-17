// import * as $j from 'jquery'
import * as React from 'react'

import {search} from '../actions/actions'
import {
  ESCAPE,
  KeyboardStore,
  SEARCH_SHORTCUT
} from '../stores/keyboard'
import {SEARCH_SET, SearchStore} from '../stores/search'

interface PhabSearchInputState {
  searchValue: string
}

export class PhabSearchInput extends React.Component<{}, PhabSearchInputState> {
  input: HTMLInputElement | undefined

  state = {
    searchValue: ''
  }

  componentWillMount() {
    KeyboardStore.on(SEARCH_SHORTCUT, this.handleSearchShortcut)
    KeyboardStore.on(ESCAPE, this.handleEscape)
    SearchStore.on(SEARCH_SET, this.handleSearchSet)
  }

  private focusInput = () => {
    if (this.input) {
      this.input.focus()
    }
  }

  private blurInput = () => {
    if (this.input) {
      this.input.blur()
    }
  }

  private selectInputContent = () => {
    if (this.input) {
      this.input.setSelectionRange(0, this.input.value.length)
    }
  }

  private handleSearchShortcut = (event: JQueryEventObject) => {
    this.focusInput()
    this.selectInputContent()
  }

  private handleEscape = (event: JQueryEventObject) => {
    this.blurInput()
    search('')
  }

  private onInputRender = (input: HTMLInputElement) => {
    this.input = input
  }

  private onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    search(event.target.value)
  }

  private handleSearchSet = () => {
    this.setState({searchValue: SearchStore.getSearch()})
  }

  render() {
    return (
      <div className="phab-search-input">
        <i className="phab-search-input__icon material-icons">search</i>
        <input
          type="text"
          ref={this.onInputRender}
          onChange={this.onInputChange}
          value={this.state.searchValue}
        />
      </div>
    )
  }
}
