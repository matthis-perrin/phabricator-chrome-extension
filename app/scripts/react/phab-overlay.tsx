import * as React from 'react'
import * as cx from 'classnames'

import {
  ESCAPE,
  keyboardStore,
  SEARCH_SHORTCUT
} from '../stores/keyboard'

interface PhabOverlayState {
  isVisible: boolean
}

export class PhabOverlay extends React.Component<{}, PhabOverlayState> {
  state = {
    isVisible: false
  }

  componentWillMount() {
    keyboardStore.on(SEARCH_SHORTCUT, this.handleSearchShortcut)
    keyboardStore.on(ESCAPE, this.handleEscape)
  }

  private handleSearchShortcut = (event: JQueryEventObject) => {
    this.setState({isVisible: true})
    event.preventDefault()
    event.stopPropagation()
  }

  private handleEscape = (event: JQueryEventObject) => {
    this.setState({isVisible: false})
  }

  render() {
    const className = cx({
      'phab-overlay': true,
      'phab-overlay--visible': this.state.isVisible,
    })
    return (
      <div className={className}>
        {this.props.children}
      </div>
    )
  }
}
