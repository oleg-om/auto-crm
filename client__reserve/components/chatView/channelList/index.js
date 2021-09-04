import React from 'react'
import Logo from './logo'
import Channels from './channels'
import ChangeChannelButton from './changeChannelButton'

const ChannelList = () => {
  return (
    <div className="bg-purple-darker bg-teal-800 w-1/5 pb-6 hidden md:block">
      <Logo />
      <Channels />
      <ChangeChannelButton />
    </div>
  )
}

export default ChannelList
