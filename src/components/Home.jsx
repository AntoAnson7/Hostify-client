import React from 'react'
import "../styles/home.css"
import { useEffect, useState } from 'react'
import { db} from "../firebase/config";
import {getDocs,collection} from "firebase/firestore"
import {useNavigate} from 'react-router-dom'
import "../styles/events.css"

function Home() {
  const navigate=useNavigate()
  const [ev,setEv]=useState(null)

  const getEventData=async()=>{
      const res = await getDocs(collection(db, "events"));
      setEv(res.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }

  useEffect(()=>{
    getEventData()
  },[])

  return (
    <div className="home-main">
      <div className="carousel">
        {ev?.map(e=>(
          <div className="edetails">
            <p className='ename'>{e.name}</p><p className='date'>{e.date}</p>
            <img src={e.url} className='event-banner'/>
            <p>{e.descr}</p>
            <button onClick={()=>navigate(`/register/${e.id}`)}>Register Now</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home