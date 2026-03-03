import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import Root from './config/root'

import './assets/scss/main.scss'

const target = document.getElementById('root')
const isStudy = process.env.MODE === 'study'

const AppWrapper = () => (
  <div className={isStudy ? 'study-crm' : 'main-crm'}>
    <Root />
  </div>
)

// React 18 rendering
if (module.hot) {
  // Development mode - use createRoot
  const root = createRoot(target)
  root.render(<AppWrapper />)

  module.hot.accept('./config/root', () => {
    root.render(<AppWrapper />)
  })
} else {
  // Production mode - use hydrateRoot for SSR or createRoot
  if (target.hasChildNodes()) {
    hydrateRoot(target, <AppWrapper />)
  } else {
    const root = createRoot(target)
    root.render(<AppWrapper />)
  }
}
