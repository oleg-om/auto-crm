import React, { useState } from 'react'

const RowCreate = (props) => {
  const [state, setState] = useState({ name: '', surname: '' })

  const onChange = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const sendData = () => {
    props.create(state)
    setState('')
  }

  return (
    <div className="py-3 w-full flex md:flex-row flex-col  justify-between px-5 shadow-xl my-2">
      <input
        className="border-2 p-2 border-gray-400 border-solid"
        value={state.name}
        name="name"
        onChange={onChange}
      />
      <input
        className="border-2 p-2 border-gray-400 border-solid"
        value={state.surname}
        name="surname"
        onChange={onChange}
      />
      <button
        className="py-3 bg-green-200 justify-center items-center rounded-sm flex md:flex-row flex-col px-5 shadow-xl my-2"
        type="button"
        onClick={sendData}
        disabled={state.name.length === 0}
      >
        Create
      </button>
    </div>
  )
}

export default RowCreate
