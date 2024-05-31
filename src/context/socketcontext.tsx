import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import SocketIoClient from "socket.io-client";
const ws_socket='http://localhost:4000';
const socket=SocketIoClient(ws_socket);
//now creating context for exporting in whole app 
export const Socketcontext=createContext<any | null > (null);

interface Props{
    children :React.ReactNode
}
export const SocketProvider:React.FC<Props>=({children})=>{
    const navigate=useNavigate();
    const enterRoom=({roomid}:{roomid:string})=>{
        navigate(`room/${roomid}`);


    }
    // receiving an event from the server while room is created 
    socket.on('room-created',enterRoom);
    //then calling the function enterroom after receiving an id from the server side 
    
return (

<Socketcontext.Provider value={{socket}}>
    {children}
</Socketcontext.Provider>
)
}