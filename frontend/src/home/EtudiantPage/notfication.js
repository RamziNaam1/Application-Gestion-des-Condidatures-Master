import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaDotCircle } from "react-icons/fa";

function Notification() {
  const [demandes, setDemandes] = useState([]);
  const [resultat, setResultat] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8081/userapplications', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Response from server:', response.data);
        setDemandes(response.data || []);
      } catch (error) {
        console.error('Error fetching demandes:', error);
      }
    };

    const fetchResultat = async () => {
      try {
        const response = await axios.get('http://localhost:8081/Getresultat');
        console.log('Response from server:', response.data);
        setResultat(response.data || []);
      } catch (error) {
        console.error('Error fetching resultat:', error);
      }
    };

    // Retrieve username from local storage
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
    console.log('testUsername:', storedUsername); // Log the retrieved username

    fetchDemandes();
    fetchResultat();
  }, []);

  const filteredDemandes = demandes.filter(demande => demande.username === username);

  const isInResultat = (title, username) => {
    return resultat.some(item => item.title === title && item.username === username);
  };

  return (
    <div style={{
      marginTop: '40px',
      width: '80%', // Adjust as needed
      margin: '0 auto', // Center the box horizontally
      backgroundColor: '#f0f0f0', // Example background color
      border: '2px solid #ccc', // Example border
      padding: '20px', // Example padding
      boxSizing: 'border-box', // Include padding in width calculation
      marginTop: '40px'
    }}>
      <div className="container">
        <h2 className="my-4 text-center" style={{ fontWeight: 'bold' }}>Demandes </h2>
        <div className="row">
          <div className="col-md-6 offset-md-3">
            {filteredDemandes && filteredDemandes.length > 0 ? (
              filteredDemandes.map((demande, index) => (
                <div key={index} className="card mb-3" style={{
                  width: '1000px',
                  marginLeft: '-200px',
                  backgroundColor: '#fff', // Background color of each card
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Box shadow for each card
                  padding: '10px', // Padding for each card
                  marginBottom: '15px' // Bottom margin for each card
                }}>
                  <div className="card-body">
                    <h5 className="card-title" style={{ fontSize: '25px' }}>Title: {demande.title}</h5>
                    <p className="card-text" style={{ color: 'green' }}>Date: {demande.date}</p>
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', marginLeft: 'auto', marginTop: '-20px' }}>
                    <li className="status in-progress" style={{ color: isInResultat(demande.title, username) ? 'green' : '#f2993f' }}>
                      {isInResultat(demande.title, username) ? (
                        <>
                          <FaDotCircle style={{ color: 'green', borderColor: '#FFB161', marginRight: '6px' }} />
                          Success
                        </>
                      ) : (
                          <>
                            <FaDotCircle style={{ color: '#FFC182', borderColor: '#FFB161', marginRight: '6px' }} />
                            In Progress...
                          </>
                        )}
                    </li>
                  </ul>
                </div>
              ))
            ) : (
                <p className="text-center">No demandes available</p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notification;
