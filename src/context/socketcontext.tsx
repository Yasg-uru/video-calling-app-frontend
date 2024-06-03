// import { createContext, useEffect, useReducer, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import SocketIoClient from "socket.io-client";
// import Peer from "peerjs";
// import { v4 as UUIDv4 } from "uuid";
// import { peerReducer } from "../Reducers/PeerReducer";
// import { Add_Peer_Action } from "../Actions/PeerAction";
// const ws_socket = "http://localhost:4000";
// export const Socketcontext = createContext<any | null>(null);
// const socket = SocketIoClient(ws_socket, {
//   withCredentials: false,
//   transports: ["polling", "websocket"],
// });
// //now creating context for exporting in whole app

// interface Props {
//   children: React.ReactNode;
// }
// interface roominfo {
//   roomId: string;
//   participants: string[];
// }

// export const SocketProvider: React.FC<Props> = ({ children }) => {
//   const navigate = useNavigate();
//   const [user, setuser] = useState<Peer>();
//   const [stream, setStream] = useState<MediaStream>();
//   const [peers, dispatch] = useReducer(peerReducer, {}); //peer->state

//   const fetchparticpants = ({ roomId, participants }: roominfo) => {
//     console.log(
//       `fetched participants  with :${roomId} and their participants:${participants}`
//     );
//   };

//   const fetchUserStream = async () => {
  
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       setStream(stream);
     
//   };

  
//   useEffect(() => {
//     const userid = UUIDv4();
//     const newpeer = new Peer(userid, {
//         host: 'localhost',
//         port: 9000,
//         path: '/myapp',
        
//       });
//     console.log("this is a new peer user :", newpeer);
//     setuser(newpeer);
    
    
//     const enterRoom = ({ roomid }: { roomid: string }) => {
//       navigate(`room/${roomid}`);
//     };
//     fetchUserStream();
//     socket.on("room-created", enterRoom);
//     socket.on("get-users", fetchparticpants);
//   }, []);

//   //   receiving an event from the server while room is created
//   //   then calling the function enterroom after receiving an id from the server side
//   useEffect(() => {
//     if (!user || !stream) {
//       console.log(
//         "user and stream is not exist ............ " +
//           user +
//           "  ...    " +
//           stream
//       );
//       return;
//     }

//     socket.on("user-joined", ({ peerId }) => {
//       const call = user.call(peerId, stream);
//       console.log(`calling to new user`, peerId);
//       call.on("stream", () => {
//         dispatch(Add_Peer_Action(peerId, stream));
//       });
//     });
//     user.on("call", (call) => {
//       // what to do when other peers on the group call you when u joined
//       console.log("receiving a call");
//       call.answer(stream);
//       call.on("stream", () => {
//         dispatch(Add_Peer_Action(call.peer, stream));
//       });
//     });
//     socket.emit("ready");
//   }, [user,stream]);

//   return (
//     <Socketcontext.Provider value={{ socket, user, stream, peers }}>
//       {children}
//     </Socketcontext.Provider>
//   );
// };

import SocketIoClient from "socket.io-client";
import { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as UUIDv4 } from "uuid";
import { peerReducer } from "../Reducers/PeerReducer";
import { Add_Peer_Action } from "../Actions/PeerAction";
// const WS_Server = "http://localhost:4000";
const WS_Server = "https://video-calling-app-backend-sigma.vercel.app";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Socketcontext = createContext<any | null>(null);

const socket = SocketIoClient(WS_Server, {
    withCredentials: true,
    transports: ["polling", "websocket"]
});

interface Props {
    children: React.ReactNode
}

export const SocketProvider: React.FC<Props> = ({ children }) => {

    const navigate = useNavigate(); // will help to programatically handle navigation
    
    // state variable to store the userId 
    const [user, setUser] = useState<Peer>(); // new peer user
    const [stream, setStream] = useState<MediaStream>();

    const [peers, dispatch] = useReducer(peerReducer, {}); // peers->state

    const fetchParticipantList = ({roomId, participants}: {roomId: string, participants: string[]}) => {
        console.log("Fetched room participants");
        console.log(roomId, participants);
    }

    const fetchUserFeed = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true});
        setStream(stream);
    } 

    useEffect(() => {

        const userId = UUIDv4();
        // const newPeer = new Peer(userId, {
        //     host: "localhost",
        //     port: 9000,
        //     path: "/myapp",
          
        // });
        const newPeer = new Peer(userId, {
            host: "https://video-calling-app-frontend.vercel.app",
            port: 443,
            path: "/myapp",
            config: {
              iceServers: [
                { urls: "stun:stun.l.google.com:19302" }, // Public STUN server from Google
                // Optionally add TURN server configuration if required for specific network environments
              ]
            }
        });

        setUser(newPeer);

        fetchUserFeed();

        const enterRoom = ({ roomid} : { roomid: string}) => {
            navigate(`/room/${roomid}`); 
        }

        // we will transfer the user to the room page when we collect an event of room-created from server
        socket.on("room-created", enterRoom);

        socket.on("get-users", fetchParticipantList);
    }, []);

    useEffect(() => {
        if(!user || !stream) {
          
          console.log("this is user :",user);
          console.log('this is stream now:',stream)
           return;
        }
        socket.on("user-joined", ({peerId}) => {
            const call = user.call(peerId, stream);
            console.log("Calling the new peer", peerId);
            call.on("stream", () => {
                dispatch(Add_Peer_Action(peerId, stream));
            })
        })

        user.on("call", (call) => {
            // what to do when other peers on the group call you when u joined
            console.log("receiving a call");
            call.answer(stream);
            call.on("stream", () => {
                dispatch(Add_Peer_Action(call.peer, stream));
            })
        })

        socket.emit("ready");
    }, [user, stream])

    return (
        <Socketcontext.Provider value={{ socket, user, stream, peers }}>
            {children}
        </Socketcontext.Provider>
    );
}