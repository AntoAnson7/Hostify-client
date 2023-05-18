import React from 'react'
import '../styles/sidebar.css'
import logo from "../assets/logo.png"
import { Link } from 'react-router-dom'

import {AiOutlineHome} from "react-icons/ai"
import {MdOutlineGames} from "react-icons/md"
import {TfiTicket} from "react-icons/tfi"
import {FiSettings} from "react-icons/fi"
import {FiHelpCircle} from "react-icons/fi"
import {BsTelephone} from "react-icons/bs"

function Sidebar() {
  return (
    <div className='sidebar'>
        <div className='logo'>
            <img src={logo} alt="" />
        </div>
        <div className='main-links'>
            <div className='link-icon-group'>
                <AiOutlineHome color='white' size="25px"/>
                <Link>Home</Link>
            </div>

            <div className="link-icon-group">
                <MdOutlineGames color='white' size="25px"/> 
                <Link to="/your-events">Your Events</Link>
            </div>

            <div className="link-icon-group"> 
                <TfiTicket color='white' size="25px"/>
                <Link>Your Tickets</Link>
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

        {/* <hr className='sidebar-sep'/> */}

        <div className='profile-info'>proinfo</div>
    </div>
  )
}

export default Sidebar