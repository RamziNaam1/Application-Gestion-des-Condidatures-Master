import React, { useState } from 'react';
import { BiHome, BiMessage, BiSolidReport, BiStats, BiTask, BiHelpCircle, BiLogOut } from 'react-icons/bi';
import { FaBars } from "react-icons/fa";
import AssignmentPage from './AssignmentPage';
import MessagePage from './MessagePage';
import DemandeList from './DemandeList';
import HelpPage from './HelpPage';
import Resultat from './Resultat';
import axios from 'axios';
import issat from '../images/issat.png';
import AdminInfo from './AdminInfo';
import Main from './main';
import { PiChalkboardTeacherFill } from "react-icons/pi";
import { IoIosInformationCircle } from "react-icons/io";



import './dashboard.css'

function Dashboard() {
  const [activeNavItem, setActiveNavItem] = useState(null);
  const [showAssignmentPage, setShowAssignmentPage] = useState(false);
  const [showDemandeList, setShowDemandeList] = useState(false);
  const [showMessagePage, setShowMessagePage] = useState(false);
  const [showHelpPage, setShowHelpPage] = useState(false);
  const [showAdminInfo, setShowAdminInfo] = useState(false);
  const [showResultat, setShowResultat] = useState(false);
  const [showMain, setShowMain] = useState(false);



  const handleNavItemClick = (event, navItem) => {
    event.preventDefault();
    switch (navItem) {
      case 'assignment':
        setShowAssignmentPage(true);
        setShowDemandeList(false);
        setShowMessagePage(false);
        setShowHelpPage(false);
        setShowAdminInfo(false);
        setShowResultat(false)
        setShowMain(false);
        break;
      case 'demandelist':
        setShowAssignmentPage(false);
        setShowDemandeList(true);
        setShowMessagePage(false);
        setShowHelpPage(false);
        setShowAdminInfo(false);
        setShowResultat(false)
        setShowMain(false);
        break;
      case 'info':
        setShowAssignmentPage(false);
        setShowDemandeList(false);
        setShowMessagePage(false);
        setShowHelpPage(false);
        setShowAdminInfo(true);
        setShowResultat(false)
        setShowMain(false);
        break;
      case 'help':
        setShowAssignmentPage(false);
        setShowDemandeList(false);
        setShowMessagePage(false);
        setShowHelpPage(true);
        setShowAdminInfo(false);
        setShowResultat(false)
        setShowMain(false);
        break;
      case 'message':
        setShowAssignmentPage(false);
        setShowDemandeList(false);
        setShowMessagePage(true);
        setShowHelpPage(false);
        setShowAdminInfo(false);
        setShowResultat(false)
        setShowMain(false);
        break;
        case 'resultat':
        setShowAssignmentPage(false);
        setShowDemandeList(false);
        setShowMessagePage(false);
        setShowHelpPage(false);
        setShowAdminInfo(false);
        setShowResultat(true)
        setShowMain(false);
        break;
        case 'main':
          setShowAssignmentPage(false);
          setShowDemandeList(false);
          setShowMessagePage(false);
          setShowHelpPage(false);
          setShowAdminInfo(false);
          setShowResultat(false)
          setShowMain(true);
          break;
      default:
        setShowMain(true);
        setShowAssignmentPage(false);
        setShowDemandeList(false);
        setShowMessagePage(false);
        setShowHelpPage(false);
        setShowAdminInfo(false);
    }
    setActiveNavItem(navItem);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:8081/logout');
      const data = response.data;
      if (data.success) {
        document.cookie = 'jwt=; expires=1h; path=/;';
        window.location.href = '/AdminLogin';
      } else {
        console.error('Logout failed:', data.message);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="dashboard" style={{ backgroundColor: '#dde6ed', display: 'flex', gap: '40px', padding: '20px' }}>
      {/* Sidebar */}
      <div className="sidebar-wrapper" style={{ position: 'fixed', top: 0, bottom: 0, left: 0, backgroundColor: '#dde6ed', display: 'flex', flexDirection: 'column', gap: '2.3rem', height: '94vh', overflowY: 'auto',marginLeft:'10px'}}>
        <div className="logo" style={{ textAlign: 'center', padding: '20px', color: '#27374d', alignItems: 'center', display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <img src={issat} alt="Logo" className="logo_icon" style={{ width: '70px', height: '70px' }} />
        </div>
        <div className="menu--list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <a href="/main" className={`item ${activeNavItem === 'main' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '1.1rem', textDecoration: 'none', fontWeight: '600', padding: '10px', borderRadius: '10px', transition: '0.3s ease-in-out', color: activeNavItem === 'main' ? '#ffffff' : '#27374d', backgroundColor: activeNavItem === 'main' ? '#27374d' : 'transparent' }} onClick={(e) => handleNavItemClick(e, 'main')}>
            <BiHome className="icon" />
            Dashboard
          </a>
          <a href="/assignment" className={`item ${activeNavItem === 'assignment' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '1.1rem', textDecoration: 'none', fontWeight: '600', padding: '10px', borderRadius: '10px', transition: '0.3s ease-in-out', color: activeNavItem === 'assignment' ? '#ffffff' : '#27374d', backgroundColor: activeNavItem === 'assignment' ? '#27374d' : 'transparent' }} onClick={(e) => handleNavItemClick(e, 'assignment')}>
            <BiTask className="icon" />
            Program List
          </a>
          <a href="/report" className={`item ${activeNavItem === 'demandelist' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '1.1rem', textDecoration: 'none', fontWeight: '600', padding: '10px', borderRadius: '10px', transition: '0.3s ease-in-out', color: activeNavItem === 'demandelist' ? '#ffffff' : '#27374d', backgroundColor: activeNavItem === 'demandelist' ? '#27374d' : 'transparent' }} onClick={(e) => handleNavItemClick(e, 'demandelist')}>
            <BiSolidReport className="icon" />
            Demandes List
          </a>
          <a href="/stats" className={`item ${activeNavItem === 'info' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '1.1rem', textDecoration: 'none', fontWeight: '600', padding: '10px', borderRadius: '10px', transition: '0.3s ease-in-out', color: activeNavItem === 'info' ? '#ffffff' : '#27374d', backgroundColor: activeNavItem === 'info' ? '#27374d' : 'transparent' }} onClick={(e) => handleNavItemClick(e, 'info')}>
            <IoIosInformationCircle className="icon" />
            Personal Info
          </a>
          <a href="/message" className={`item ${activeNavItem === 'message' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '1.1rem', textDecoration: 'none', fontWeight: '600', padding: '10px', borderRadius: '10px', transition: '0.3s ease-in-out', color: activeNavItem === 'message' ? '#ffffff' : '#27374d', backgroundColor: activeNavItem === 'message' ? '#27374d' : 'transparent' }} onClick={(e) => handleNavItemClick(e, 'message')}>
            <BiMessage className="icon" />
            Message
          </a>
          <a href="/help" className={`item ${activeNavItem === 'help' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '1.1rem', textDecoration: 'none', fontWeight: '600', padding: '10px', borderRadius: '10px', transition: '0.3s ease-in-out', color: activeNavItem === 'help' ? '#ffffff' : '#27374d', backgroundColor: activeNavItem === 'help' ? '#27374d' : 'transparent' }} onClick={(e) => handleNavItemClick(e, 'help')}>
            <PiChalkboardTeacherFill  className="icon" />
            Cordinators
          </a>
          <a href="/resultat" className={`item ${activeNavItem === 'resultat' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '1.1rem', textDecoration: 'none', fontWeight: '600', padding: '10px', borderRadius: '10px', transition: '0.3s ease-in-out', color: activeNavItem === 'resultat' ? '#ffffff' : '#27374d', backgroundColor: activeNavItem === 'resultat' ? '#27374d' : 'transparent' }} onClick={(e) => handleNavItemClick(e, 'resultat')}>
            < FaBars className="icon"  />
            Resultat
          </a>
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '20px', fontSize: '1.1rem', textDecoration: 'none', fontWeight: '600', padding: '10px', borderRadius: '10px' }}>
          <a href="/AdminLogin" className="item" style={{ color: '#27374d' }} onClick={handleLogout}>
            <BiLogOut className="icon" />
            Logout
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="main-content" style={{flex:'1',marginLeft:'20px', height:"100vh",overflow:'auto'}}>
        <div className="dashboard--content" style={{ background: '#fff', flex: 1, borderRadius: '20px', padding: '2rem', display: 'flex', gap: '1.5rem', justifyContent: 'space-between',  marginLeft:'200px'}}>
          {showAssignmentPage && <AssignmentPage />}
          {showMessagePage && <MessagePage />}
          {showHelpPage && <HelpPage />}
          {showAdminInfo && <AdminInfo />}
          {showDemandeList && <DemandeList />}
          {showResultat && <Resultat/>}
          {showMain && <Main/>}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
