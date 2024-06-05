import React from 'react';
import { BiHome, BiBookAlt, BiMessage, BiSolidReport, BiStats, BiTask, BiHelpCircle, BiLogOut } from 'react-icons/bi';
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className='menu'>
      <div className='logo'>
        <BiBookAlt className='logo_icon'/>
        <h2>EduFlex</h2>
      </div>
      <div className='menu--list'>
        <a href='/' className='item'>
          <BiHome className='icon'/>Dashboard
        </a>
        <a href='/assignment' className='item'>
          <BiTask className='icon'/>Assignment
        </a>
        <a href='/report' className='item'>
          <BiSolidReport className='icon'/>Report
        </a>
        <a href='/stats' className='item'>
          <BiStats className='icon'/>Stats
        </a>
        <a href='/message' className='item'>
          <BiMessage className='icon'/>Message
        </a>
        <a href='/help' className='item'>
          <BiHelpCircle className='icon'/>Help
        </a>
      </div>
      <div className='logout'>
        <a href='/logout' className='item'>
          <BiLogOut className='icon'/>Logout
        </a>
      </div>
    </div>
  );
}

export default Sidebar;
