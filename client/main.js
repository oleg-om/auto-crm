import React from 'react'
import ReactDOM from 'react-dom'
import Root from './config/root'

import './assets/scss/main.scss'

const target = document.getElementById('root')

const render = (Component) => {
  const isStudy = process.env.MODE === 'study'

  ReactDOM.render(
    <div className={isStudy ? 'study-crm' : 'main-crm'}>
      <Component />
    </div>,
    target
  )
}

render(Root)

// Hot reload support for development
if (module.hot) {
  module.hot.accept('./config/root', () => {
    const newApp = require('./config/root').default
    render(newApp)
  })
}
