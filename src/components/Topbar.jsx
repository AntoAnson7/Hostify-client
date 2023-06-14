import React from 'react'
import { useEffect, useState } from 'react'
import "../styles/topbar.css"
import { useAppData } from '../AppContext/AppContext'

function Topbar() {
  const [greet,setGreet]=useState("Hey! Welcome , ")

  function getGreeting() {
    const currentHour = new Date().getHours();
  
    if (currentHour >= 5 && currentHour < 12) {
       setGreet("Good Morning! , ");
    } else if (currentHour >= 12 && currentHour < 17) {
      setGreet("Good Afternoon! , ");
    } else {
      setGreet("Good Evening! , ");
    }
  }
  
  useEffect(()=>{
    getGreeting()
  },[])
  const [{user}]=useAppData()
  return (
    <div className='topbar'>
        {user.displayName?<p>{greet}<span>{user.displayName}!</span></p>:<></>}
    </div>
  )
}

export default Topbar