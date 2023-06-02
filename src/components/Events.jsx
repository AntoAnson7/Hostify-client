import React from 'react'
import { useEffect, useState } from 'react'
import { getStorage, ref,uploadBytes,getDownloadURL } from "firebase/storage";
import "../styles/events.css"
import { auth, db, provider,storage } from "../firebase/config";
import { useForm } from "react-hook-form";
import {arrayUnion, doc,getDoc,setDoc, updateDoc} from "firebase/firestore"

import { useAppData } from '../AppContext/AppContext'

function Events() {
  const [{user,registered},dispatch]=useAppData()
  const [response,setResponse]=useState([])
  const [newe,setNewe]=useState(false)
  const [tn,setTn]=useState(null)
  const [tempurl,setTempurl]=useState(null)

  const getData=async()=>{
    if(user.uid!=null){
      const res=await getDoc(doc(db,"users",user.uid))
      setResponse(res.data().events)
    }
    else{
      console.log("Not logged in")
    }
    
  }

  useEffect(()=>{
    getData()
  },[user])

  async function getImageURL(imageName) {
    try {
      const imageRef = ref(storage, imageName);
      const url = await getDownloadURL(imageRef);
      setTempurl(url)
    } catch (error) {
      return "nil"
    }

  }
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const formsubmit=async(data)=>{
    const imageref=ref(storage,`images/${data.ename}${user.uid.substring(0,6)}`)
    
    uploadBytes(imageref,tn).then(()=>{
      getImageURL(`images/${data.ename}${user.uid.substring(0,6)}`)
    })
    
    await setDoc(doc(db,"events",`${data.ename}${user.uid?.substring(0,6)}`),{
      name:data.ename,
      descr:data.edescr,
      date:data.date,
      owner:user.uid,
      url:tempurl
    })

    await updateDoc(doc(db,"users",user.uid),{
      events:arrayUnion(`${data.ename}${user.uid.substring(0,6)}`)
    })

    alert(`New event: ${data.ename} created succesfull`)
    setNewe(false)
  }

  return (
    <div className='events'>
          {newe&&<div className="new-event">
            <p>Create new event</p>
            <form className='form' onSubmit={handleSubmit(formsubmit)}>
                <input className='in' type="text" placeholder='Event Name' {...register("ename")}/>
                <input className='in' type="textarea"  placeholder='Description'{...register("edescr")}/>
                <input className='in' type="text" placeholder='Start date'{...register("date")}/>
                <input type="file" name="" id="" onChange={(e)=>{setTn(e.target.files[0])}}/>
                <button type="submit" className='sub'>Create</button>
            </form> 
        </div>}
      <div>
        <div className="events-butt">
          <p>Your events ,</p>
          <button onClick={()=>setNewe(!newe)}>Create new + </button>
        </div>
        <div className='events-cards'>
          {response?.map(a=>(<p className='card' onClick={()=>console.log(a)}>{a}</p>))}    

          {/* {response.events?.map(a=>(<img src={getImageURL(`images/${a}`)}/>))}     */}
        </div>
      </div>
    </div>
  )
}

export default Events
