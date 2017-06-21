import * as React from 'react'
import * as cx from 'classnames'

import {
  ESCAPE,
  KeyboardStore,
  SEARCH_SHORTCUT
} from '../stores/keyboard'

interface PhabOverlayState {
  isVisible: boolean
}

export class PhabOverlay extends React.Component<{}, PhabOverlayState> {
  displayName: 'PhabOverlay'

  state = {
    isVisible: false
  }

  componentWillMount() {
    KeyboardStore.on(SEARCH_SHORTCUT, this.handleSearchShortcut)
    KeyboardStore.on(ESCAPE, this.handleEscape)
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
