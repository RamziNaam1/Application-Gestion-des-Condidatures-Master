// AdminChat.js

import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';


const MessagePage= () => {
  const [sock, setSock] = useState(null);
  const [message, setMessage] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');

  useEffect(() => {
      const newSock = new SockJS('http://localhost:8081/sockjs');

      newSock.onopen = () => {
          console.log('Connected to server');
      };

      newSock.onmessage = (e) => {
          console.log('Message received:', e.data);
          setReceivedMessage(e.data);
      };

      newSock.onclose = () => {
          console.log('Disconnected from server');
      };

      setSock(newSock);

      return () => {
          newSock.close();
      };
  }, []);

  const sendMessage = () => {
      if (sock) {
          sock.send(message);
      }
  };

  return (
      <div>
          <h1>Admin Component</h1>
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={sendMessage}>Send Message</button>
          <p>Received Message: {receivedMessage}</p>
      </div>
  );
};
export default MessagePage;

