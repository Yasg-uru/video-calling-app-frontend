import { useContext } from "react";
import { Socketcontext } from "../context/socketcontext";

const CreateRoom: React.FC = () => {
    const {socket}=useContext(Socketcontext);
    //extracting socket object in the context 

    function initRoom(){
socket.emit("create-room");
console.log("initializing a req to create a room ")
    }
  return (
    <>
      <button onClick={initRoom} className="btn btn-secondary">
        Start a new meeting in a new room
      </button>
    </>
  );
};
export default CreateRoom;
