import React, { useState } from 'react';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput } from 'mdb-react-ui-kit';
import axios from 'axios';
import Swal from 'sweetalert2';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleInputChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post('http://localhost:8081/forgot-password', { email });
      if (res.data.success) {
        Swal.fire('Success', 'Password reset link sent to your email', 'success');
        setMessage('Password reset link sent to your email.');
      } else {
        setMessage('Error sending password reset link. Please try again.');
      }
    } catch (error) {
      console.error('Error sending password reset link:', error);
      setMessage('Error sending password reset link. Please try again.');
    }
  };

  return (
    <MDBContainer fluid className='p-4'>
      <MDBRow>
        <MDBCol md='6'>
          <MDBCard className='my-5'>
            <MDBCardBody className='p-5'>
              <h4 className='mb-4'>Forgot Password</h4>
              <form onSubmit={handleSubmit}>
                <MDBInput
                  label='Email'
                  id='email'
                  type='email'
                  name='email'
                  onChange={handleInputChange}
                  required
                  className='mb-4'
                />
                <MDBBtn type='submit' className='mb-4'>
                  Send Reset Link
                </MDBBtn>
              </form>
              {message && <p>{message}</p>}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default ForgotPassword;
