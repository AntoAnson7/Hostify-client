import React, { useEffect, useState } from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import { db } from "../firebase/config";
import { getDoc,doc } from 'firebase/firestore';
import { useAppData } from '../AppContext/AppContext'
import '../styles/reg.css'

import Web3 from "web3";
import Ticket from "../contracts/Ticket.json";

function Registration() {
    let {id} = useParams()
    const navigate=useNavigate()
    const [state, setState] = useState({ web3: null, contract: null });
    const [event,setEvent]=useState(null)
    const [{user}]=useAppData()

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
    
      function B32tos(bytes32) {
        let str = "";
        for (let i = 0; i < bytes32.length; i++) {
          const charCode = bytes32[i];
          if (charCode !== 0) {
            str += String.fromCharCode(charCode);
          }
        }
        return str;
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
    
      const createTicket = async (_eid, _uid,owner) => {
        if(user?.uid===owner){
          alert("Uh oh! you cant register for your own event!")
        }
        else{
          const { contract } = state;
          _eid = stoB32(_eid);
          _uid = stoB32(_uid);
          await contract.methods.createTicket(_eid, _uid).send({
            from: "0xB5c668A63b1C7f41A88530c562E23B54717bCfa8",
            gas: 500000,
          });
          alert("Registered succesfully!");
          navigate("/");
        }
      };
    
      const [tid, settid] = useState("");

    const getData=async()=>{
        const res=await getDoc(doc(db,"events",id))
        setEvent(res.data())
    }

    useEffect(()=>{
        getData()
    },[])
  return (
    <div className='regmain'>
        <div className="img-box">
            <img src={event?.url} alt="" className='reg-banner'/>
        </div>
        
        <div className="data">
            <h1>{event?.name}</h1>
            <p>{event?.date}</p>
            <p>{event?.descr}</p>
            {user.uid&&<button onClick={()=>createTicket(id,user.uid,event.owner)}>Register now!</button>}
        </div>
        
    </div>
  )
}

export default Registration