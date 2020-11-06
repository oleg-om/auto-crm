import React from 'react'
import InputFields from './inputFields'
import ButtonRegistration from  './button'


const RegistrationForm = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <form className="mt-8">
        <InputFields />
        <ButtonRegistration />
      </form>
    </div>
  )
}

export default RegistrationForm