import React, { useState } from 'react';
import Login from './login';
import Notification from './home/EtudiantPage/notfication';

function ParentComponent() {
  const [username, setUsername] = useState('');

  const handleUsernameChange = (newUsername) => {
    setUsername(newUsername);
  };

  return (
    <>
      <Login setUsername={setUsername} />
      <Notification username={username} />
    </>
  );
}

export default ParentComponent;
