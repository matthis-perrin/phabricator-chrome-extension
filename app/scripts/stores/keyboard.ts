import * as $j from 'jquery'
import {EventEmitter2} from 'eventemitter2'

export const SEARCH_SHORTCUT = 'SEARCH_SHORTCUT'
export const ESCAPE = 'ESCAPE'

class KeyboardStore extends EventEmitter2 {
  constructor() {
    super()
    $j(document).bind('keydown', this.handleKeyDown)
  }

  private handleKeyDown = (event: JQueryEventObject) => {
    const isSearchShortcut = event.metaKey && event.keyCode == 70 // cmd + f
    if (isSearchShortcut) {
      this.emit(SEARCH_SHORTCUT, event)
      return
    }
    const isEscape = event.keyCode == 27 // Escape
    if (isEscape) {
      this.emit(ESCAPE, event)
      return
    }
  }
}

export const keyboardStore = new KeyboardStore()
