import React, { useEffect, useState } from 'react'
import '../styles/sidebar.css'
import logo from "../assets/logo.png"
import { Link, useNavigate } from 'react-router-dom'

import {AiOutlineHome} from "react-icons/ai"
import {MdOutlineGames} from "react-icons/md"
import {TfiTicket} from "react-icons/tfi"
import {FiSettings} from "react-icons/fi"
import {FiHelpCircle} from "react-icons/fi"
import {BsTelephone} from "react-icons/bs"

import { auth, db, provider } from "../firebase/config";
import { signInWithPopup } from "firebase/auth";

import {doc,getDoc,setDoc} from "firebase/firestore"

import { useAppData } from '../AppContext/AppContext'

function Sidebar() {

    const [{user,registered},dispatch]=useAppData()
    const navigate=useNavigate()
    const [reg,setReg]=useState(false)
    const [name,setName]=useState("")
    const [age,setAge]=useState("")
    const [luser,setLuser]=useState({uid:"nil"})

    useEffect(()=>{
        setReg(false)
        setLuser({uid:"nil"})
    },[])

    useEffect(()=>{
        checkUser(luser.uid)
    },[luser,reg])

    const login=async()=>{
        try {
            const res = await signInWithPopup(auth, provider);
            setLuser(res.user)
          } catch (e) {
            console.log(`Google sign in failed: ${e}`);
          }
        };
        const regTrue=()=>{
            dispatch({
                type:"SET_USER",
                user:luser
            })
            dispatch({
                type:"SET_REG",
                registered:true
            })
            setReg(false)
            navigate("/")
        }

    const checkUser = async (id) => {
        const res = await getDoc(doc(db, "users", id));
        luser.uid=="nil"?console.log("ter"):res.data()?regTrue():setReg(true)
    }

    const register=async()=>{
        await setDoc(doc(db, "users", luser.uid), {
            name: name,
            events:[],
            age:age
          });
          setName("")
          setAge("")
          setReg(false)
          navigate("/")
    }
    
    
    const logout=async()=>{
        dispatch({
            type:"SET_USER",
            user: {}
        })
        setLuser({uid:"nil"})
        setReg(false)
        navigate("/")
    }
  return (
    <div className='sidebar'>
        {reg&&<div className="register">
            <p>Welcome new user ,</p>
            <div className='form'>
                <input type="text" placeholder='Name' onChange={(e)=>setName(e.target.value)}/>
                <input type="text" placeholder='Age'onChange={(e)=>setAge(e.target.value)}/>
                <button onClick={register}>Register</button>
            </div>
        </div>}
        <div className='logo'>
            <img src={logo} alt="" />
        </div>
        <div className='main-links'>
            <div className='link-icon-group'>
                <AiOutlineHome color='white' size="25px"/>
                <Link to="/">Home</Link>
            </div>

            <div className="link-icon-group">
                <MdOutlineGames color='white' size="25px"/> 
                <Link to="/your-events">Your Events</Link>
            </div>

            <div className="link-icon-group"> 
                <TfiTicket color='white' size="25px"/>
                <Link to="/your-tickets">Your Tickets</Link>
            </div>
            
        </div>
        <div className='sub-links'>
        <div className="link-icon-group"> 
                <FiSettings color='white' size="25px"/>
                <Link>Settings</Link>
            </div>
            <div className="link-icon-group"> 
                <FiHelpCircle color='white' size="25px"/>
                <Link>Help</Link>
            </div>
            <div className="link-icon-group"> 
                <BsTelephone color='white' size="25px"/>
                <Link>Contact us</Link>
            </div>

        </div>


        <div className='profile-info'>
            

            {user.displayName?
            <div className="prinfo">
                <div className="pfp"><img src={user?.photoURL}/></div>
                <div className="details">
                    <p>{user?.displayName}</p>
                    <button className='logout-button' onClick={logout}>Logout</button>
                </div>
            </div>
            
            :<button className='login-button' onClick={login}>Login</button>}
        </div>

        <hr className='line'/>
    </div>
  )
}

export default Sidebar