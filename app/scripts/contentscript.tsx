import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {setTasks} from './actions/actions'
import {DomInterface} from './dom_interface'
import {PhabSearchInput} from './react/phab-search-input'
import {PhabSearchResults} from './react/phab-search-results'
import {PhabOverlay} from './react/phab-overlay'

const mainDiv = DomInterface.injectMainDiv().get(0)
const app = (
  <PhabOverlay>
    <PhabSearchInput />
    <PhabSearchResults />
  </PhabOverlay>
)
ReactDOM.render(app, mainDiv)

const tasks = DomInterface.parseTasks()
setTasks(tasks)
