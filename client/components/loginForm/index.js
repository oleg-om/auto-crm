import React from 'react'
import ButtonLogin from './button'
import InputFields from '../registration/inputFields'

const LoginForm = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mt-8">
        <InputFields />
        <ButtonLogin />
      </div>
    </div>
  )
}

export default LoginForm
