import React, { useState } from 'react';
import { BiHome, BiSolidReport, BiStats, BiTask, BiHelpCircle, BiLogOut } from 'react-icons/bi';
import ProgramCoursePage from './ProgramCoursePage';
import ResultPage from './ResultPage';
import ProfileInfoPage from './ProfileInfoPage';
import DemandeList from './DemandeList';
import axios from 'axios';
import issat from '../images/issat.png';
import '../admin/dashboard.css';
import { PiChalkboardTeacherFill } from "react-icons/pi";
import { IoIosInformationCircle } from "react-icons/io";
import { FaBars } from "react-icons/fa";




function CoordDashboard() {
  const [activeNavItem, setActiveNavItem] = useState(null);
  const [showProgramCoursePage, setShowProgramCoursePage] = useState(false);
  const [showDemandeList, setShowDemandeList] = useState(false);
  const [showResultPage, setShowResultPage] = useState(false);
  const [showProfileInfoPage, setShowProfileInfoPage] = useState(false);

  const handleNavItemClick = (event, navItem) => {
    event.preventDefault();
    switch (navItem) {
      case 'programcourse':
        setShowProgramCoursePage(true);
        setShowDemandeList(false);
        setShowResultPage(false);
        setShowProfileInfoPage(false);
        break;
      case 'demandelist':
        setShowProgramCoursePage(false);
        setShowDemandeList(true);
        setShowResultPage(false);
        setShowProfileInfoPage(false);
        break;
      case 'result':
        setShowProgramCoursePage(false);
        setShowDemandeList(false);
        setShowResultPage(true);
        setShowProfileInfoPage(false);
        break;
      case 'profileinfo':
        setShowProgramCoursePage(false);
        setShowDemandeList(false);
        setShowResultPage(false);
        setShowProfileInfoPage(true);
        break;
      default:
        setShowProgramCoursePage(true);
        setShowDemandeList(false);
        setShowResultPage(false);
        setShowProfileInfoPage(false);
    }
    setActiveNavItem(navItem);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:8081/logout');
      const data = response.data;
      if (data.success) {
        document.cookie = 'jwt=; expires=1h; path=/;';
        window.location.href = '/CoordinatorLogin';
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
      <div className="sidebar-wrapper" style={{ position: 'fixed', top: 0, bottom: 0, left: 0, backgroundColor: '#dde6ed', display: 'flex', flexDirection: 'column', gap: '2.3rem', height: '94vh', overflowY: 'auto', marginLeft:'10px'}}>
        <div className="logo" style={{ textAlign: 'center', padding: '20px', color: '#27374d', alignItems: 'center', display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <img src={issat} alt="Logo" className="logo_icon" style={{ width: '70px', height: '70px' }} />
        </div>
        <div className="menu--list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <a href="/" className={`item ${activeNavItem === '' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '1.1rem', textDecoration: 'none', fontWeight: '600', padding: '10px', borderRadius: '10px', transition: '0.3s ease-in-out', color: activeNavItem === '' ? '#ffffff' : '#27374d', backgroundColor: activeNavItem === '' ? '#27374d' : 'transparent' }} onClick={() => handleNavItemClick('', '')}>
            <BiHome className="icon" />
            Dashboard
          </a>
          <a href="/programcourse" className={`item ${activeNavItem === 'programcourse' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '1.1rem', textDecoration: 'none', fontWeight: '600', padding: '10px', borderRadius: '10px', transition: '0.3s ease-in-out', color: activeNavItem === 'programcourse' ? '#ffffff' : '#27374d', backgroundColor: activeNavItem === 'programcourse' ? '#27374d' : 'transparent' }} onClick={(e) => handleNavItemClick(e, 'programcourse')}>
            <BiTask className="icon" />
            Program Course
          </a>
          <a href="/demandelist" className={`item ${activeNavItem === 'demandelist' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '1.1rem', textDecoration: 'none', fontWeight: '600', padding: '10px', borderRadius: '10px', transition: '0.3s ease-in-out', color: activeNavItem === 'demandelist' ? '#ffffff' : '#27374d', backgroundColor: activeNavItem === 'demandelist' ? '#27374d' : 'transparent' }} onClick={(e) => handleNavItemClick(e, 'demandelist')}>
            <BiSolidReport className="icon" />
            Demandes List
          </a>
          <a href="/result" className={`item ${activeNavItem === 'result' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '1.1rem', textDecoration: 'none', fontWeight: '600', padding: '10px', borderRadius: '10px', transition: '0.3s ease-in-out', color: activeNavItem === 'result' ? '#ffffff' : '#27374d', backgroundColor: activeNavItem === 'result' ? '#27374d' : 'transparent' }} onClick={(e) => handleNavItemClick(e, 'result')}>
            <FaBars  className="icon" />
            Result
          </a>
          <a href="/profileinfo" className={`item ${activeNavItem === 'profileinfo' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '1.1rem', textDecoration: 'none', fontWeight: '600', padding: '10px', borderRadius: '10px', transition: '0.3s ease-in-out', color: activeNavItem === 'profileinfo' ? '#ffffff' : '#27374d', backgroundColor: activeNavItem === 'profileinfo' ? '#27374d' : 'transparent' }} onClick={(e) => handleNavItemClick(e, 'profileinfo')}>
            <IoIosInformationCircle className="icon" />
            Profile Info
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
          {showProgramCoursePage && <ProgramCoursePage />}
          {showDemandeList && <DemandeList />}
          {showResultPage && <ResultPage />}
          {showProfileInfoPage && <ProfileInfoPage />}
        </div>
      </div>
    </div>
  );
}

export default CoordDashboard;