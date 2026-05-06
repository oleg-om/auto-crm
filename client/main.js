import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import Root from './config/root'

import './assets/scss/main.scss'

const target = document.getElementById('root')

const isStudy = process.env.MODE === 'study'

const wrap = (RootComponent) => (
  <div className={isStudy ? 'study-crm' : 'main-crm'}>
    <RootComponent />
  </div>
)

if (module.hot) {
  const root = createRoot(target)
  const render = (RootComponent) => {
    root.render(wrap(RootComponent))
  }
  render(Root)
  module.hot.accept('./config/root', () => {
    const NextRoot = require('./config/root').default
    render(NextRoot)
  })
} else {
  hydrateRoot(target, wrap(Root))
}
