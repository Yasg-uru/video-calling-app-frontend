import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SocketIoClient from "socket.io-client";
import Peer from "peerjs";
import {v4 as UUIDv4} from "uuid"
const ws_socket='http://localhost:4000';
const socket=SocketIoClient(ws_socket);
//now creating context for exporting in whole app 
export const Socketcontext=createContext<any | null > (null);

interface Props{
    children :React.ReactNode
}
export const SocketProvider:React.FC<Props>=({children})=>{
    const navigate=useNavigate();
    const [user,setuser]=useState<Peer>();
    useEffect(()=>{
        const userid=UUIDv4();
        const newpeer=new Peer(userid);
    
        setuser(newpeer);
    
        const enterRoom=({roomid}:{roomid:string})=>{
            navigate(`room/${roomid}`);
    
    
        }
        socket.on('room-created',enterRoom);
    },[])
   
    // receiving an event from the server while room is created 
    //then calling the function enterroom after receiving an id from the server side 

return (

<Socketcontext.Provider value={{socket,user}}>
    {children}
</Socketcontext.Provider>
)
}