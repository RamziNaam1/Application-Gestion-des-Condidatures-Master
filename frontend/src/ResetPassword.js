import React, { useState } from 'react';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput } from 'mdb-react-ui-kit';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'password') {
      setPassword(value);
    } else {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    try {
      const res = await axios.post('http://localhost:8081/reset-password', { token, password });
      if (res.data.success) {
        Swal.fire('Success', 'Password reset successfully', 'success');
        navigate('/login');
      } else {
        setMessage('Error resetting password. Please try again.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('Error resetting password. Please try again.');
    }
  };

  return (
    <MDBContainer fluid className='p-4'>
      <MDBRow>
        <MDBCol md='6'>
          <MDBCard className='my-5'>
            <MDBCardBody className='p-5'>
              <h4 className='mb-4'>Reset Password</h4>
              <form onSubmit={handleSubmit}>
                <MDBInput
                  label='New Password'
                  id='password'
                  type='password'
                  name='password'
                  onChange={handleInputChange}
                  required
                  className='mb-4'
                />
                <MDBInput
                  label='Confirm Password'
                  id='confirmPassword'
                  type='password'
                  name='confirmPassword'
                  onChange={handleInputChange}
                  required
                  className='mb-4'
                />
                <MDBBtn type='submit' className='mb-4'>
                  Reset Password
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

export default ResetPassword;
