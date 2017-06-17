import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {DomInterface} from './dom_interface'
import {FuzzySearch} from './search'

import {PhabSearchInput} from './react/phab-search-input'
import {PhabOverlay} from './react/phab-overlay'

const mainDiv = DomInterface.injectMainDiv().get(0)
const app = (
  <PhabOverlay>
    <PhabSearchInput />
  </PhabOverlay>
)
ReactDOM.render(app, mainDiv)

const tasks = DomInterface.parseTasks()
const fuzzySearch = new FuzzySearch(tasks)
console.log(fuzzySearch.search('paper'))
