import React from 'react'
import "../styles/topbar.css"
import { useAppData } from '../AppContext/AppContext'

function Topbar() {
  const [{user}]=useAppData()
  return (
    <div className='topbar'>
        {user.displayName?<p>Good Morning , <span>{user.displayName}!</span></p>:<></>}
    </div>
  )
}

export default Topbar