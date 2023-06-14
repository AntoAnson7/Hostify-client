import React from 'react'
import { useAppData } from '../AppContext/AppContext'
import { useState, useEffect } from "react";
import {useParams} from 'react-router-dom'
import Web3 from "web3";
import Ticket from "../contracts/Ticket.json";
import "../styles/evadm.css"

function Eventadmin() {
  let {id} = useParams()
  const [{user}]=useAppData()
  const [state, setState] = useState({ web3: null, contract: null });
  const [regs,setRegs]=useState([])

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

  const getTicketDetails = async () => {
    const { contract } = state;
    const res = await contract.methods.getTicketsByEvent(stoB32(id)).call();
    setRegs(res)
  };

  const revokeTicket=async(_tid)=>{
    const { contract } = state;
    await contract.methods.invalidateTicket(_tid).send({
      from: "0xB5c668A63b1C7f41A88530c562E23B54717bCfa8",
      gas: 500000,
    });
    alert("Ticket has been Invalidated!")
  }

  useEffect(()=>{
    state.contract&&getTicketDetails()
  },[state.contract])

  return (
    <div className='admin'>
      {regs&&regs.length>0?(
        <div className="outside">
          <h1 style={{marginBottom:"50px"}}>Registrations</h1>
          {regs.map(r=>(
            <div className="registrations">
              <p><span>txid: </span>{r.transactionId}</p>
              <p><span>userid: </span>{r.userId}</p>
              {r.isValid?<p style={{color:"#25D366",fontWeight:"bold"}}><span>status: </span>VALID</p>:<p style={{color:"red",fontWeight:"bold"}}><span>status: </span>INVALID</p>}
              {r.isValid?<button className='more' onClick={()=>revokeTicket(r.ticketId)}>Revoke</button>:<></>}
            </div>
          ))}
        </div>
      ):(
        <p className='no-eve'>Uh oh! Your event has no registrations yet! 😟</p>
      )}
    </div>
  )
}

export default Eventadmin