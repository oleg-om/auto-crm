// import React, { useState } from 'react'
// import uuid from 'react-uuid'
// import { socket } from '../redux/index'

// const AdminPannel = () => {
//   const [data, setData] = useState([])
//   socket.connect()
//   socket.emit('get clients')
//   socket.on('all users', (test) => {
//     setData(test)
//   })
//   return (
//     <div>
//       {Object.values(data).map((it) => {
//         return <p key={uuid()}>{it}</p>
//       })}
//     </div>
//   )
// }

// export default AdminPannel
