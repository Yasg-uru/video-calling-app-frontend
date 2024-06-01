import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Socketcontext } from "../context/socketcontext";
import UserFeedPlayer from "../components/UserFeedPlayer";

const Room: React.FC = () => {
  const { id } = useParams();
  //while loading this component first we need to emit joined room event
  const { socket, user, stream, peers } = useContext(Socketcontext);

  useEffect(() => {
    if (user) {
      console.log("New user with id", user._id, "has joined room", id);
      socket.emit("joined-room", { roomId: id, peerId: user._id });
    }
    console.log(peers)
  }, [user, id, socket]);
  console.log("this is a stream inside room:",stream)
  return (
    <div className="bg-black h-[100vh] w-full text-white">
      Room:{id}
      user own user feed
      <UserFeedPlayer stream={stream} />
      <br />
      other peoples feed
      {Object.keys(peers).map((peerId) => (
        <UserFeedPlayer key={peerId} stream={peers[peerId].stream} />
      ))}
    </div>
  );
};
export default Room;
