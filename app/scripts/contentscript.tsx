import * as React from 'react'
import * as ReactDOM from 'react-dom'

import {DomInterface} from './dom_interface'

const mainDiv = DomInterface.injectMainDiv().get(0)
ReactDOM.render(<div>Test</div>, mainDiv)
