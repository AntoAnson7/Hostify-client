import React from 'react'
import { useState, useEffect } from "react";
import Web3 from "web3";
import Ticket from "../contracts/Ticket.json";
import { useAppData } from '../AppContext/AppContext'
import { db } from "../firebase/config";
import {doc,getDoc} from "firebase/firestore"

import {useNavigate } from 'react-router-dom'
import "../styles/ticket.css"

function Tickets() {
  const [{user}]=useAppData()
  const [state, setState] = useState({ web3: null, contract: null });
  const navigate=useNavigate()
  const[a,setA]=useState()
  const[info,setInfo]=useState(false)
  const[tickets,setTickets]=useState([])
  const[index,setIndex]=useState(0)

  function stoB32(inputString) {
    const encoder = new TextEncoder();
    const data = encoder.encode(inputString);
    const buffer = new Uint8Array(32);

    if (data.length >= buffer.length) {
      buffer.set(data.slice(0, buffer.length));
    } else {
      buffer.set(data);
    }

    return (
      "0x" +
      Array.prototype.map
        .call(buffer, (x) => ("00" + x.toString(16)).slice(-2))
        .join("")
    );
  }

  function B32tos(bytes32Value) {
    const hexValue = bytes32Value.slice(2); // Remove the '0x' prefix
    const bytes = new Uint8Array(32);
  
    for (let i = 0; i < 32; i++) {
      const byte = parseInt(hexValue.substr(i * 2, 2), 16);
      bytes[i] = byte;
    }
  
    const decoder = new TextDecoder();
    const stringValue = decoder.decode(bytes);
    const nullTerminatorIndex = stringValue.indexOf('\0');
    if (nullTerminatorIndex !== -1) {
      return stringValue.substring(0, nullTerminatorIndex);
    }
  
    return stringValue;
  }
  
  
  
  useEffect(() => {
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
    const template = async () => {
      const web3 = new Web3(provider);

      const networkid = await web3.eth.net.getId();
      const deployed = await Ticket.networks[networkid];

      const contract = new web3.eth.Contract(Ticket.abi, deployed.address);

      setState({ web3: web3, contract: contract });
    };
    provider && template();
  }, []);

  const getTickets = async (_uid) => {
    const { contract } = state;
    _uid = stoB32(_uid);
    const res = await contract.methods.getTicketsByUser(_uid).call();
    // console.log(res.length != 0 ? res[0].ticketId : "No tickets found");
    setA(res)
  };

  const getTicketData = async (_tid) => {
    const { contract } = state;
    const res = await contract.methods.getTicketDetails(_tid).call();
    console.log(res);
  };

  useEffect(()=>{
    const retreiveDoc=async(instance)=>{
      const res=await getDoc(doc(db,"events",B32tos(instance.eventId)))
      setTickets(prev=>[...prev,res.data()])
      console.log(tickets)
    }
    a&&a.map(instance=>retreiveDoc(instance))
  },[a])

  useEffect(()=>{
    user.uid&&state.contract&&getTickets(user.uid)
  },[state])

  const show=(i)=>{
    setInfo(!info)
    setIndex(i)
  }

  return (
    <div className='tickets-main'>
      <h1 style={{marginBottom:"90px"}}>Your Tickets ,</h1>
      <div className="ticket-partition">
      {info&&(
                  <div className="info">
                    <div className="ban">
                      <h2>Contract Details</h2>
                      <button className='close' onClick={()=>setInfo(!info)}>X</button>
                    </div>
                    <p>Gas fee : <span>{`${parseInt(a[index].gasFee)/1000000000}`.substring(0,4)} ETH</span></p>
                    <p>Block ID : <span>{a[index].blockId}</span></p>
                    <p>Transaction ID : <span>{a[index].transactionId}</span></p>
                    <p>Block Timestamp : <span>{a[index].blockTimestamp}</span></p>
                  </div>
                )}
        {tickets.length>0?(
          tickets.map((t,i)=>(
            <div className="ticket">
              <img src={t.url} className='ticket-banner' />
              <div className="ticket-deets">
                <p><span style={{fontWeight:"bold",fontSize:"larger",color:"#7241fd"}}>{t.name}</span></p>
                <p>Owner: {t.owner.substring(0,10)}</p>
                <p>Date: {t.date}</p>
                <div style={{display:"flex",gap:"20px"}}>
                  <button className='logout-button'>Cancel ticket</button>
                  <button className='logout-button' onClick={()=>show(i)}>info</button>
                </div>
              </div>
            </div>
            
          ))
        ):(
          <p className='no-eve'>Uh oh! Seem's like you have'nt joined any Events yet! <span onClick={()=>navigate("/")}>Click here</span> to join one!</p>
        )}
      </div>
    </div>
  )
}

export default Tickets