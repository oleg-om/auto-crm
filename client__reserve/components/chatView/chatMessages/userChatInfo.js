import React from 'react'

const UserChatInfo = (props) => {
  return (
    <div className="flex items-end">
      <span className="font-bold text-md mr-2 font-sans">{props.userName}</span>
    </div>
  )
}

export default UserChatInfo
