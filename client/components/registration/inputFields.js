import React from 'react'

const InputFields = () => {
  return (
    <div>
      <div className="rounded-md shadow-sm">
        <input
          aria-label="Login"
          type="login"
          name="login"
          placeholder="Login"
          className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
        />
        <div className="-mt-px">
          <input
            aria-label="Password"
            name="password"
            type="password"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
            placeholder="Password"
          />
        </div>
      </div>
    </div>
  )
}

export default InputFields
