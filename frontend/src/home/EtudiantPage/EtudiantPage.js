import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faEnvelope, faHandshake, faBook, faFile } from '@fortawesome/free-solid-svg-icons';
import { FaBell, FaUser } from "react-icons/fa";

import CursusForm from './CursusForm';
import issatra from '../../images/issatra.png';
import Contact from './contact';
import profile from '../../images/profile.jpg';
import ProfileForm from './ProfileForm';
import Demandes from './MesDemandes';
import PreinscriptionForm from './MasterProgram';
import Notfication from './notfication';
import axios from 'axios';

function EtudiantPage() {
  const [activeNavItem, setActiveNavItem] = useState('demandes');
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const username = localStorage.getItem('username');
        const profileImageUrl = localStorage.getItem('profileImage');

        const response = await axios.get('http://localhost:8081/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const users = response.data.users;
        const loggedInUser = users.find(user => user.username === username);
        if (loggedInUser) {
          setUser({
            ...loggedInUser,
            profile_photo: profileImageUrl || loggedInUser.profile_photo
          });
        } else {
          setError('User not found');
        }
      } catch (error) {
        setError(error.response ? error.response.data.message : 'An error occurred');
        console.log('Error:', error.response ? error.response.data : error);
      }
    };

    fetchUserData();
  }, []);

  const handleNavItemClick = (navItem) => {
    setActiveNavItem(navItem);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:8081/logout');
      const data = response.data;
      if (data.success) {
        document.cookie = 'jwt=; expires=1h; path=/;';
        window.location.href = '/login';
      } else {
        console.error('Logout failed:', data.message);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (error) {
    return <div className="alert alert-danger" role="alert">{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar expand="lg" className="shadow-sm px-4" style={{ backgroundColor: '#27374d', color: 'white', fontFamily: 'your-desired-font', padding: '0px' }}>
        <Container fluid>
          <Navbar.Brand href="#">
            <img src={issatra} width="120" height="66" className="d-inline-block align-top" alt="" />
          </Navbar.Brand>
          <Nav className="ms-auto d-flex align-items-center">
            
            
            <Nav.Link href="#" className={`${activeNavItem === 'profile' ? 'active' : ''}`} onClick={() => handleNavItemClick('profile')} style={{ color: '#fff', marginRight: '10px', marginLeft: '-10px' }}><FaUser style={{ marginRight: '6px',marginBottom:'6px' }}/>Profile</Nav.Link>
            <Nav.Link href="#" className={`${activeNavItem === 'notfication' ? 'active' : ''}`} onClick={() => handleNavItemClick('notfication')} style={{ color: '#fff' }}><FaBell style={{ marginRight: '6px',marginBottom:'6px' }} />Status</Nav.Link>
            <Nav.Link onClick={handleLogout} style={{ color: '#fff' }}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Déconnexion
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <style jsx>{`
        .custom-nav {
          margin-left: 150px;
          margin-right: 150px;
          border-radius: 15px;
        }
        .custom-nav .nav-link {
          transition: background-color 0.3s, color 0.3s, border-radius 0.3s;
        }
        .custom-nav .nav-link.active,
      `}</style>
      <Nav className="d-flex justify-content-around px-4 py-2 bg-light custom-nav">
        <Nav.Link href="#" className={`text-dark fw-bold px-3 ${activeNavItem === 'demandes' ? 'active' : ''}`} onClick={() => handleNavItemClick('demandes')}>
          <FontAwesomeIcon icon={faFile} className="me-1" />Mes demandes
        </Nav.Link>
        <Nav.Link href="#" className={`text-dark fw-bold px-3 ${activeNavItem === 'cursus' ? 'active' : ''}`} onClick={() => handleNavItemClick('cursus')}>
          <FontAwesomeIcon icon={faBook} className="me-1" />Mon cursus
        </Nav.Link>
        <Nav.Link href="#" className={`text-dark fw-bold px-3 ${activeNavItem === 'preinscription' ? 'active' : ''}`} onClick={() => handleNavItemClick('preinscription')}>
          <FontAwesomeIcon icon={faHandshake} className="me-1" />Déposer demande de pré-inscription
        </Nav.Link>
        <Nav.Link href="#" className={`text-dark fw-bold px-3 ${activeNavItem === 'contact' ? 'active' : ''}`} onClick={() => handleNavItemClick('contact')}>
          <FontAwesomeIcon icon={faEnvelope} className="me-1" />Contact
        </Nav.Link>
      </Nav>

      {activeNavItem === 'cursus' && <CursusForm />}
      {activeNavItem === 'profile' && <ProfileForm />}
      {activeNavItem === 'demandes' && <Demandes />}
      {activeNavItem === 'preinscription' && <PreinscriptionForm />}
      {activeNavItem === 'notfication' && <Notfication />}
      {activeNavItem === 'contact' && <Contact />}
    </div>
  );
}

export default EtudiantPage;
