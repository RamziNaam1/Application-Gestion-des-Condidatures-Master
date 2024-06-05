import React, { useEffect, useState } from 'react';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput } from 'mdb-react-ui-kit';
import { Link, useNavigate } from 'react-router-dom';
import validation from './loginValidation';
import axios from 'axios';
import front from './images/front.png';
import { FaUserGraduate } from 'react-icons/fa';
import Swal from 'sweetalert2';
import loginsuceess from './images/loginsuccess.png';

function Login({ setUsername }) {
  useEffect(() => {
    // Apply the background color style to the body element
    document.body.style.backgroundColor = 'hsl(0, 0%, 96%)';

    // Clean up function to remove the style when the component unmounts
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []); // Empty dependency array ensures that the effect runs only once after the component mounts

  const navigate = useNavigate();
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear previous error message when input changes
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors(validation(values)); // Validate inputs

    if (Object.values(errors).every((value) => value === '')) {
      try {
        const res = await axios.post('http://localhost:8081/login', values);
        if (res.data.success) {
          console.log("data : " + res.data.token);
          console.log("username: ", res.data.username); // Check if username is received
          setUsername(res.data.username); // Set the username using setUsername function

          localStorage.setItem('token', res.data.token);
          localStorage.setItem('username', res.data.username); // Store username in localStorage
          document.cookie = `token=${res.data.token}; path=/`; // Store token in cookie
          navigate('/EtudiantPage'); // Redirect to home page
          // Display SweetAlert on successful login
          Swal.fire({
            title: "WELCOME",
            imageUrl: loginsuceess,
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Custom image"
          });

        } else {
          alert('Invalid credentials'); // Display error message for invalid credentials
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred. Please try again later.'); // Handle network errors
      }
    }
  };

  return (
    <MDBContainer fluid className='p-4'>
      <MDBRow>
        <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center position-relative'>
          {/* Additional Image */}
          <div style={{
            position: 'absolute',
            top: '50px', // Adjust position as needed to make the image appear slightly on top
            left: '60%',
            transform: 'translateX(-50%)',
            zIndex: 1, // Ensure the image is above the text
          }}>
            <img src={front} alt="" style={{ maxWidth: '80%', height: 'auto' }} />
          </div>
          {/* End Additional Image */}
          <h1 className="my-5 display-3 fw-bold ls-tight px-3">
            START<br />
            <span className="text-primary"> with peace of mind</span>
          </h1>
        </MDBCol>

        <MDBCol md='6'>
          <MDBCard className='my-5' style={{ overflow: 'hidden', height: '500px', width: '600px' }}>

            <MDBCardBody className='p-5 d-flex flex-column align-items-center' style={{ marginTop: '30px' }}>
              <FaUserGraduate size={64} className='mb-4' style={{ color: '#000', marginTop: '-30px' }} /> {/* Using FaUser icon */}
              <h4 style={{ marginBottom: '20px', marginTop: '10px', fontWeight: 'bold', color: '#0077b6' }}>Welcome Back</h4>

              <form className='w-100' onSubmit={handleSubmit}> {/* Move onSubmit to the form element */}
                <div className='mb-4 w-100'>
                  {errors.email && <span className='text-danger'>{errors.email}</span>}
                  <MDBInput label='Email' id='email' type='email' name='email' onChange={handleInput} autoComplete='email' style={{ borderColor: '#0077b6', borderWidth: '2px' }} />
                </div>
                <div className='mb-4 w-100'>
                  {errors.password && <span className='text-danger'>{errors.password}</span>}
                  <MDBInput label='Password' id='password' type='password' name='password' onChange={handleInput} autoComplete='current-password' style={{ borderColor: '#0077b6', borderWidth: '2px' }} />
                </div>
                <MDBBtn className=' mb-4' size='md' style={{ height: '40px', width: '200px', marginLeft: '150px', backgroundColor: '#0077b6' }} type="submit">
                  Sign in
                </MDBBtn>
              </form>
              <div className='d-flex justify-content-between w-100 mb-4' style={{ fontWeight: 'bold', }}>
                <Link to='/signup' style={{ textDecoration: 'none', color: '#0077b6' }}>Sign Up</Link>
                <a href='/forgot-password' style={{ textDecoration: 'none', color: '#0077b6' }}>Forgot Password</a>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;
