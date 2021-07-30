import React from 'react'
import InputFields from './inputFields'
import ButtonRegistration from './button'
import NickNameField from './nicNameField'

const RegistrationForm = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <form className="mt-8">
        <div className="rounded-b-md">
          <InputFields />
          <NickNameField />
        </div>
        <ButtonRegistration />
      </form>
    </div>
  )
}

export default RegistrationForm
