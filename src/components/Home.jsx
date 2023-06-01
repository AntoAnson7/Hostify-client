import React from 'react'
import "../styles/home.css"
import { useEffect, useState } from 'react'
import { getStorage, ref,uploadBytes,getDownloadURL } from "firebase/storage";
import "../styles/events.css"
import { auth, db, provider,storage } from "../firebase/config";
import { useForm } from "react-hook-form";
import {arrayUnion, doc,getDoc,getDocs,setDoc, updateDoc,collection} from "firebase/firestore"

import { useAppData } from '../AppContext/AppContext'


function Home() {

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
      <div className='home-page'>
        <img src="https://firebasestorage.googleapis.com/v0/b/hostify-da6a3.appspot.com/o/assets%2Fhome-bg.png?alt=media&token=b675646b-eb3e-40a0-9a72-c138a18cdb06" alt="" />
      </div>
      <div className="carousel">
        {ev?.map(e=>(
          <div className="edetails">
            <p className='ename'>{e.name}</p><p className='date'>{e.date}</p>
            <img src={e.url} className='event-banner'/>
            <p>{e.descr}</p>
            <button>Register Now</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home