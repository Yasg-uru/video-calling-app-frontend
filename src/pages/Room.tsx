import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Socketcontext } from "../context/socketcontext";
import UserFeedPlayer from "../components/UserFeedPlayer";

const Room: React.FC = () => {
  interface roominfo {
    roomId: string;
    participants: string[];
  }

  const { id } = useParams();
  //while loading this component first we need to emit joined room event
  const { socket, user ,stream} = useContext(Socketcontext);
  const fetchparticpants = ({ roomId, participants }: roominfo) => {
    console.log(
      `fetched participants  with :${roomId} and their participants:${participants}`
    );
  };
  useEffect(() => {
    if (user) {
      socket.emit("joined-room", { roomId: id, peerId: user._id });
    }
    socket.on("get-users", fetchparticpants);
  }, [user, id, socket]);
  return <div className="bg-black h-[100vh] w-full text-white">Room:{id}
  <UserFeedPlayer stream={stream}/>
  </div>;
};
export default Room;
