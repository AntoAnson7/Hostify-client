import React from 'react'
import { useEffect, useState } from 'react'
import { ref,uploadBytes,getDownloadURL } from "firebase/storage";
import "../styles/events.css"
import { db,storage } from "../firebase/config";
import { useForm } from "react-hook-form";
import {arrayUnion, doc,getDoc,setDoc, updateDoc} from "firebase/firestore"
import { useAppData } from '../AppContext/AppContext'
import { useNavigate } from 'react-router-dom';

function Events() {
  const [{user}]=useAppData()
  const [response,setResponse]=useState([])
  const [newe,setNewe]=useState(false)
  const [tn,setTn]=useState(null)
  const[userEvents,setUserEvents]=useState([])
  const navigate=useNavigate()
  const {
    register,
    handleSubmit,
  } = useForm();


  const getData=async()=>{
    if(user.uid!=null){
      const res=await getDoc(doc(db,"users",user.uid))
      setResponse(res.data().events)
    }
    else{
      console.log("Not logged in")
    }
    
  }

  const getinfo=async()=>{
    let temp=[]
    let obj={}
    for(let i=0;i<response.length;i++){
      const res=await getDoc(doc(db,"events",response[i]))
      obj=res.data()
      obj["eventId"]=response[i]
      temp.push(obj)
    }
    setUserEvents(temp)
  }

  useEffect(()=>{
    getData()
  },[])

  useEffect(()=>{
    getinfo()
  },[response])

  async function getImageURL(imageName,data) {
    try {
      const imageRef = ref(storage, imageName);
      const url = await getDownloadURL(imageRef);
      const name=data.ename.split(' ').join('')

      await setDoc(doc(db,"events",`${name}${user.uid?.substring(0,6)}`),{
        name:data.ename,
        descr:data.edescr,
        date:data.date,
        owner:user.uid,
        url:url
      })
  
      await updateDoc(doc(db,"users",user.uid),{
        events:arrayUnion(`${name}${user.uid.substring(0,6)}`)
      })
  
      alert(`New event: ${data.ename} created succesfull`)
      setNewe(false)
    
    } catch (error) {
      return "nil"
    }

  }
  
  const formsubmit=async(data)=>{
    const name=data.ename.split(' ').join('')
    const imageref=ref(storage,`images/${name}${user.uid.substring(0,6)}`)
    
    uploadBytes(imageref,tn).then(()=>{
      getImageURL(`images/${name}${user.uid.substring(0,6)}`,data)
    })
  }

  return (
    <div className='events'>
          {newe&&<div className="new-event">
            <div 
            style={{display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
            padding:"20px",
            height:"50px"}}
            >
              <button className='close' onClick={()=>setNewe(!newe)}>X</button>
            </div>
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
          <h1 style={{marginBottom:"90px"}}>Your events , </h1>
          <button onClick={()=>setNewe(!newe)} style={{fontWeight:"bold",fontSize:"17px"}}>Create new + </button>
        </div>
        <div className='events-cards'>
          {userEvents.length>0?userEvents.map(ue=>(
            <div className="ebox">
              <img src={ue.url} className='uebanner' onClick={()=>navigate(`/event-admin/${ue.eventId}`)}/>
              <p className='hov'>
                <p>{ue.name}</p>
                <button className='del'>Delete Event</button>
              </p>
            </div>
          )):<p className='no-eve'>Uh oh! Seem's like you have'nt created an Event yet! <span onClick={()=>setNewe(!newe)}>Click here</span> to create one!</p>}
        </div>
      </div>
    </div>
  )
}

export default Events
