import React from 'react'
import Logo from './logo'
import Channels from './channels'

const ChannelList = () => {
  return (
    <div className="bg-purple-darker bg-teal-800 w-1/5 pb-6 hidden md:block">
      <Logo />
      <Channels />
    </div>
  )
}

export default ChannelList
