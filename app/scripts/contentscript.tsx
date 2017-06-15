import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {DomInterface} from './dom_interface'
import {FuzzySearch} from './search'

const mainDiv = DomInterface.injectMainDiv().get(0)
ReactDOM.render(<div>Test</div>, mainDiv)
const tasks = DomInterface.parseTasks()
const fuzzySearch = new FuzzySearch(tasks)
console.log(fuzzySearch.search('paper'))
