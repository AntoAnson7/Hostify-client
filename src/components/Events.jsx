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
  const [response,setResponse]=useState({})
  const [img,setimg]=useState([])
  const [newe,setNewe]=useState(false)
  // const [url,setUrl]=useState("")

  const [tn,setTn]=useState(null)

  useEffect(()=>{
    response.events?.map(a=>{
      setimg([...img,getImageURL(`images/${a}`)])
    })
  },[user])

  const getdata=async()=>{
    const res = await getDoc(doc(db, "users", user.uid));
    setResponse(res.data())
    
    res.data().events.map(a=>{
      getEvent(a)
    })  
  }
  async function getImageURL(imageName) {
    try {
      // Create a reference to the image file
      const imageRef = ref(storage, imageName);
  
      // Get the download URL
      const url = await getDownloadURL(imageRef);
  
      return url
      // Use the URL here or return it to the calling function
    } catch (error) {
      return "nil"
    }

  }
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const getEvent=async(a)=>{
    const res=await getDoc(doc(db,"events",a))
    setimg([...img,res.data().url])
  }

  useEffect(()=>{
    registered&&getdata()
  },[])

  const formsubmit=async(data)=>{
    const imageref=ref(storage,`images/${data.ename}${user.uid.substring(0,6)}`)
    
    uploadBytes(imageref,tn).then(()=>{
      // const lurl=getImageURL(`images/${data.ename}${user.uid.substring(0,6)}`)
      // setUrl(lurl)
    })
    
    await setDoc(doc(db,"events",`${data.ename}${user.uid.substring(0,6)}`),{
      name:data.ename,
      descr:data.edescr,
      date:data.date,
      owner:user.uid,
    })

    await updateDoc(doc(db,"users",user.uid),{
      events:arrayUnion(`${data.ename}${user.uid.substring(0,6)}`)
    })

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
          {response.events?.map(a=>(<p style={{color:"black"}} className='card'>{a}</p>))}    

          {/* {response.events?.map(a=>(<img src={getImageURL(`images/${a}`)}/>))}     */}
        </div>
      </div>
    </div>
  )
}

export default Events
