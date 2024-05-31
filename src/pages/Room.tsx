import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom"
import { Socketcontext } from "../context/socketcontext";

const Room:React.FC=()=>{
    const {id}=useParams();
//while loading this component first we need to emit joined room event 
const {socket}=useContext(Socketcontext);

useEffect(()=>{
socket.emit("joined-room",{roomId:id});

},[])
return <div className="bg-black h-[100vh] w-full text-white">
    Room:{id}
</div>
}
export default Room 