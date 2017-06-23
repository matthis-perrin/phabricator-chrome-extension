import * as React from 'react'
import * as cx from 'classnames'

import {AppStore, APP_VISIBLE_UPDATED} from '../stores/app'
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
    AppStore.on(APP_VISIBLE_UPDATED, this.handleAppVisibleUpdated)
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

  private handleAppVisibleUpdated = () => {
    this.setState({isVisible: AppStore.isAppVisible()})
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
