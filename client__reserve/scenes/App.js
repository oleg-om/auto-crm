import React from 'react'
import { Link } from 'react-router-dom'
import logo from './logo.svg'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload!!!
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Link to="/autoparts/order/list">
          <button
            type="button"
            className="py-3 justify-center items-center rounded-sm flex md:flex-row flex-col px-5 shadow-xl my-2"
          >
            Список
          </button>
        </Link>
        <Link to="/autoparts/order/create">
          <button
            type="button"
            className="py-3 justify-center items-center rounded-sm flex md:flex-row flex-col px-5 shadow-xl my-2"
          >
            Создать
          </button>
        </Link>
        <Link to="/place/create">
          <button
            type="button"
            className="py-3 justify-center items-center rounded-sm flex md:flex-row flex-col px-5 shadow-xl my-2"
          >
            Адреса
          </button>
        </Link>
      </header>
    </div>
  )
}

export default App
