// import * as $j from 'jquery'
import * as React from 'react'
import * as cx from 'classnames'

import {
  ESCAPE,
  keyboardStore,
  SEARCH_SHORTCUT
} from '../stores/keyboard'

interface PhabSearchInputState {

}

export class PhabSearchInput extends React.Component<{}, PhabSearchInputState> {
  input: HTMLInputElement | undefined

  state = {
  }

  componentWillMount() {
    keyboardStore.on(SEARCH_SHORTCUT, this.handleSearchShortcut)
    keyboardStore.on(ESCAPE, this.handleEscape)
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

  private emptyInputContent = () => {
    if (this.input) {
      this.input.value = ''
    }
  }

  private handleSearchShortcut = (event: JQueryEventObject) => {
    this.focusInput()
    this.selectInputContent()
  }

  private handleEscape = (event: JQueryEventObject) => {
    this.blurInput()
    this.emptyInputContent()
  }

  render() {
    const className = cx({
      'phab-search-input': true,
      // 'phab-overlay--visible': this.state.isVisible,
    })
    return (
      <div className={className}>
        <i className="phab-search-input__icon material-icons">search</i>
        <input type="text" ref={(input) => { this.input = input }}/>
      </div>
    )
  }
}
