// Import necessary modules and libraries
import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client'; // Import Socket.IO client library
import Peer from 'simple-peer'; // Import the SimplePeer library for WebRTC

// Create a context for sharing state and functions across components
const SocketContext = createContext();

// Create a Socket.IO connection to the server
const socket = io('http://localhost:5000');
// Note: You should replace 'http://localhost:5000' with your actual server URL when deploying

// Define a context provider component
const ContextProvider = ({ children }) => {
  // State variables using useState
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState(); // User's video and audio stream
  const [name, setName] = useState(''); // User's name
  const [call, setCall] = useState({}); // Details about the call
  const [me, setMe] = useState(''); // User's own socket ID

  // Refs for accessing DOM elements directly
  const myVideo = useRef(); // Ref for user's video element
  const userVideo = useRef(); // Ref for remote user's video element
  const connectionRef = useRef(); // Ref for WebRTC connection

  useEffect(() => {
    // Fetch user's media stream (video and audio)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream; // Display user's video in their video element
      });

    // Listen for 'me' event to get user's socket ID
    socket.on('me', (id) => setMe(id));

    // Listen for 'callUser' event to receive incoming call
    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []); // Empty dependency array means this effect runs only once on component mount

  // Function to answer an incoming call
  const answerCall = () => {
    setCallAccepted(true);

    // Create a new peer connection
    const peer = new Peer({ initiator: false, trickle: false, stream });

    // Listen for 'signal' event and emit 'answerCall' to the caller
    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    // Listen for 'stream' event and display remote user's video
    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal); // Signal the caller
    connectionRef.current = peer; // Store the connection
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  const toggleAudio = (isMuted) => {
    stream.getAudioTracks().forEach((track) => {
      track.enabled = !isMuted;
    });
  };

  const toggleVideo = (isCameraOff) => {
    stream.getVideoTracks().forEach((track) => {
      track.enabled = !isCameraOff;
    });
  };

  // Return the SocketContext.Provider with state and functions as values
  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
      toggleAudio, // Add toggleAudio to the value object
      toggleVideo,
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
