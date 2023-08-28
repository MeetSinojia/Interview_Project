import React, { useContext, useState, useEffect, useRef } from 'react';
import { Button, TextField } from '@material-ui/core';
import { SocketContext } from '../Context';

const ChatPage = () => {
  const { chatMessages, sendChatMessage } = useContext(SocketContext);
  const [message, setMessage] = useState('');
  const chatEndRef = useRef(null); // Ref to scroll chat to the latest message

  useEffect(() => {
    chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendChatMessage(message);
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <div className="chat-container">
        {chatMessages.map((msg, index) => (
          <div key={index}>{msg.name}: {msg.text}</div>
        ))}
        <div ref={chatEndRef} /> {/* Scroll to the latest message */}
      </div>
      <TextField
        variant="outlined"
        label="Type a message..."
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleSendMessage}>Send</Button>
    </div>
  );
};

export default ChatPage;
