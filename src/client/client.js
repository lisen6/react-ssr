import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'

import Routes from './router'
import { getClientStore } from '../client/store'

const App = () => {
  return (
    <Provider store={getClientStore()}>
      <Router>{Routes}</Router>
    </Provider>
  )
}

// hydrate同构的时候会复用页面上的html结构，添加事件
ReactDOM.hydrate(<App />, document.getElementById('root'))
