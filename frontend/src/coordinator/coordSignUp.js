import React, { useState } from 'react';
import axios from 'axios';
import { RiAdminFill } from "react-icons/ri";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function CoordSignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [cin, setCIN] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const response = await axios.post('http://localhost:8081/Coord_signup', { username, email, cin, password });
      
      if (response.data.success) {
        console.log(response.data);
        // Redirect to dashboard upon successful registration
        navigate('/CoordinatorLogin');
      } else {
        // Display error message for registration failure
        alert('Failed to register user');
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Set error state to display error message
      setError('Failed to register user');
    }
  };

  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: 'hsl(218, 41%, 15%)',
      backgroundImage: 'radial-gradient(650px circle at 0% 0%, hsl(218, 41%, 35%) 15%, hsl(218, 41%, 30%) 35%, hsl(218, 41%, 20%) 75%, hsl(218, 41%, 19%) 80%, transparent 100%), radial-gradient(1250px circle at 100% 100%, hsl(218, 41%, 45%) 15%, hsl(218, 41%, 30%) 35%, hsl(218, 41%, 20%) 75%, hsl(218, 41%, 19%) 80%, transparent 100%)',
      minHeight: '100vh' // Ensure background covers the entire viewport
    }} className="overflow-hidden">
      <style>{`
        .back-button {
          position: absolute;
          top: 20px;
          left: 20px;
          background-color: rgba(167, 139, 250, 1);
          border: none;
          border-radius: 50%;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(17, 24, 39, 1);
          cursor: pointer;
        }

        .back-button:hover {
          background-color: rgba(167, 139, 250, 0.8);
        }

        .back-button:focus {
          outline: none;
        }

        .back-icon {
          font-size: 1.5rem;
        }

        .form-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 400px; /* Increase the width of the form */
          padding: 2rem;
          border-radius: 0.75rem;
          background-color: rgba(17, 24, 39, 1);
          color: rgba(243, 244, 246, 1);
          text-align: center; 
        }

        .title {
          text-align: center;
          font-size: 1.5rem;
          line-height: 2rem;
          font-weight: 700;
        }

        .form {
          margin-top: 1.5rem;
        }

        .input-group {
          margin-top: 0.75rem; /* Adjusted margin-top */
          font-size: 0.875rem;
          line-height: 1.25rem;
        }

        .input-group label {
          display: block;
          color: rgba(156, 163, 175, 1);
          margin-bottom: 4px;
        }

        .input-group input {
          width: 100%;
          border-radius: 0.375rem;
          border: 1px solid rgba(55, 65, 81, 1);
          outline: 0;
          background-color: rgba(17, 24, 39, 1);
          padding: 0.75rem 1rem;
          color: rgba(243, 244, 246, 1);
        }

        .input-group input:focus {
          border-color: rgba(167, 139, 250);
        }

        .sign {
          display: block;
          width: 100%;
          background-color: rgba(167, 139, 250, 1);
          padding: 0.75rem;
          text-align: center;
          color: rgba(17, 24, 39, 1);
          border: none;
          border-radius: 0.375rem;
          font-weight: 600;
          margin-top: 1.5rem; /* Adjusted margin-top */
        }

        .icon {
          color: #fff; /* White color */
          font-size: 3rem; /* Adjust icon size */
          margin-bottom: 1rem; /* Add some space below the icon */
        }
      `}</style>
      {/* Back Button */}
      <Link to="/CoordinatorLogin" className="back-button">
        <AiOutlineArrowLeft />
      </Link>
      {/* End Back Button */}
      <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
        <div className="row gx-lg-5 align-items-center mb-5">
          <div id="radius-shape-1" style={{
              height: '250px', // Increase the height of the form box
              width: '250px',
              top: '-10px',
              left: '250px',
              background: 'radial-gradient(#44006b, #ad1fff)',
              overflow: 'hidden'
            }} className="position-absolute rounded-circle shadow-5-strong"></div>
          <div id="radius-shape-2" style={{
              borderRadius: '38% 62% 63% 37% / 70% 33% 67% 30%',
              bottom: '20px',
              right: '170px',
              width: '300px',
              height: '350px', // Increase the height of the form box
              background: 'radial-gradient(#44006b, #ad1fff)',
              overflow: 'hidden'
            }} className="position-absolute shadow-5-strong"></div>
          {/* Form */}
          <div className="col-lg-6 mx-auto">
            <div className="form-container">
              <div className="icon"> {/* Add admin icon inside the form */}
                <RiAdminFill />
              </div>
              <p className="title">Sign Up</p>
              <form className="form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="username">Username</label>
                  <input type="text" name="username" id="username"  value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" name="email" id="email"  value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input-group">
                  <label htmlFor="cin">CIN </label>
                  <input type="text" name="cin" id="cin" value={cin} onChange={(e) => setCIN(e.target.value)} />
                </div>
                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <input type="password" name="password" id="password"  value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="input-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input type="password" name="confirmPassword" id="confirmPassword"  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <button className="sign">Sign up</button>
              </form>
              {error && <div className="text-danger">{error}</div>}
            </div>
          </div>
          {/* End Form */}
        </div>
      </div>
    </section>
  );
};

export default CoordSignUp;
