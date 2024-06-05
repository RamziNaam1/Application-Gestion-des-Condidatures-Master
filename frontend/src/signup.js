import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import validation from './signupValidation';
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput
} from 'mdb-react-ui-kit';

function SignUp() {
  useEffect(() => {
    document.body.style.backgroundColor = 'hsl(0, 0%, 96%)';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: '',
    email: '',
    confirm_email: '',
    password: '',
    confirm_password: '',
    cin: '',
    confirm_cin: '',
    sexe: '',
    dateOfBirth: '',
    gouvernoratDeNaissance: '',
    paysDeNaissance: '',
    situation: '',
    rue: '',
    ville: '',
    codePostal: '',
    gouvernorat: '',
    telephone: ''
  });
  const [errors, setErrors] = useState({});
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files[0];
    setProfilePhoto(file);
    if (file) {
      setProfilePhotoPreview(URL.createObjectURL(file));
    } else {
      setProfilePhotoPreview(null);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validation(values);
    setErrors(validationErrors);

    if (Object.values(validationErrors).every(value => value === '')) {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });
      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto);
      }
      axios.post('http://localhost:8081/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(res => {
          navigate('/login');
        })
        .catch(err => console.log(err));
    }
  };

  return (
    <MDBContainer fluid className='p-4'>
      <MDBRow className='justify-content-center'>
        <MDBCol md='8'>
          <h1 className="my-5 display-3 fw-bold ls-tight px-3 text-center">
            Create an Account <br />
            <span className="text-primary">for Free</span>
          </h1>
          <MDBCard className='' style={{ overflow: 'hidden', margin: '0 0 50px', padding: '20px' }}>
            <MDBCardBody className='p-5'>
              <form onSubmit={handleSubmit}>
                <h3 style={{marginLeft:'330px', fontWeight:'bold'}}>Profile Photo</h3>
                <div className="mb-4 text-center" style={{ position: 'relative', display: 'inline-block', backgroundColor: '#e0f7fa', padding: '20px', borderRadius: '10px' ,marginLeft:'330px'}}>
                  <input type="file" accept="image/*" onChange={handleProfilePhotoChange} style={{ position: 'absolute', width: '150px', height: '150px', opacity: 0, cursor: 'pointer' }} />
                  <div style={{ width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', cursor: 'pointer' }}>
                    {profilePhotoPreview ? (
                      <img src={profilePhotoPreview} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                        <span style={{ color: '#0077b6' }}>Click to upload</span>
                      </div>
                    )}
                  </div>
                </div>

                <h3 style={{ fontWeight:'bold'}}>Personal Information</h3>
                {errors.username && <span className='text-danger'>{errors.username}</span>}
                <MDBInput wrapperClass='mb-4' label='Username' type='text' name='username' onChange={handleInput} style={{ borderColor: '#0077b6', borderWidth: '2px' }} />

                {errors.cin && <span className='text-danger'>{errors.cin}</span>}
                <MDBInput wrapperClass='mb-4' label='CIN' type='text' name='cin' onChange={handleInput} style={{ borderColor: '#0077b6', borderWidth: '2px' }} />

                {errors.confirm_cin && <span className='text-danger'>{errors.confirm_cin}</span>}
                <MDBInput wrapperClass='mb-4' label='Confirm CIN' type='text' name='confirm_cin' onChange={handleInput} style={{ borderColor: '#0077b6', borderWidth: '2px' }} />

                {errors.sexe && <span className='text-danger'>{errors.sexe}</span>}
                <MDBInput wrapperClass='mb-4' label='Sexe' type='text' name='sexe' onChange={handleInput} style={{ borderColor: '#0077b6', borderWidth: '2px' }} />

                {errors.dateOfBirth && <span className='text-danger'>{errors.dateOfBirth}</span>}
                <MDBInput wrapperClass='mb-4' label='Date de Naissance' type='date' name='dateOfBirth' onChange={handleInput} style={{ borderColor: '#0077b6', borderWidth: '2px' }} />

                {errors.gouvernoratDeNaissance && <span className='text-danger'>{errors.gouvernoratDeNaissance}</span>}
                <MDBInput wrapperClass='mb-4' label='Gouvernorat de Naissance' type='text' name='gouvernoratDeNaissance' onChange={handleInput} style={{ borderColor: '#0077b6', borderWidth: '2px' }} />

                {errors.paysDeNaissance && <span className='text-danger'>{errors.paysDeNaissance}</span>}
                <MDBInput wrapperClass='mb-4' label='Pays de Naissance' type='text' name='paysDeNaissance' onChange={handleInput} style={{ borderColor: '#0077b6', borderWidth: '2px' }} />

                {errors.situation && <span className='text-danger'>{errors.situation}</span>}
                <MDBInput wrapperClass='mb-4' label='Situation' type='text' name='situation' onChange={handleInput} style={{ borderColor: '#0077b6', borderWidth: '2px' }} />

                <h3 style={{ fontWeight:'bold'}}>Account Details</h3>
                {errors.email && <span className='text-danger'>{errors.email}</span>}
                <MDBInput wrapperClass='mb-4' label='Email' type='email' name='email' onChange={handleInput} style={{ borderColor: '#0077b6', borderWidth: '2px' }} />

                {errors.confirm_email && <span className='text-danger'>{errors.confirm_email}</span>}
                <MDBInput wrapperClass='mb-4' label='Confirm Email' type='email' name='confirm_email' onChange={handleInput} style={{ borderColor: '#0077b6', borderWidth: '2px' }} />

                {errors.password && <span className='text-danger'>{errors.password}</span>}
                <MDBInput wrapperClass='mb-4' label='Password' type='password' name='password' onChange={handleInput} style={{ borderColor: '#0077b6', borderWidth: '2px' }} />

                {errors.confirm_password && <span className='text-danger'>{errors.confirm_password}</span>}
                <MDBInput wrapperClass='mb-4' label='Confirm Password' type='password' name='confirm_password' onChange={handleInput} style={{ borderColor: '#0077b6', borderWidth: '2px' }} />

                <h3 style={{ fontWeight:'bold'}}>Address Details</h3>
                {errors.rue && <span className='text-danger'>{errors.rue}</span>}
                <MDBInput wrapperClass='mb-4' label='Rue' type='text' name='rue' onChange={handleInput} style={{ borderColor: '#0077b6', borderWidth: '2px' }} />

                {errors.ville && <span className='text-danger'>{errors.ville}</span>}
                <MDBInput wrapperClass='mb-4' label='Ville' type='text' name='ville' onChange={handleInput} style={{ borderColor: '#0077b6', borderWidth: '2px' }} />

                {errors.codePostal && <span className='text-danger'>{errors.codePostal}</span>}
                <MDBInput wrapperClass='mb-4' label='Code Postal' type='text' name='codePostal' onChange={handleInput} style={{ borderColor: '#0077b6', borderWidth: '2px' }} />

                {errors.gouvernorat && <span className='text-danger'>{errors.gouvernorat}</span>}
                <MDBInput wrapperClass='mb-4' label='Gouvernorat' type='text' name='gouvernorat' onChange={handleInput} style={{ borderColor: '#0077b6', borderWidth: '2px' }} />

                {errors.telephone && <span className='text-danger'>{errors.telephone}</span>}
                <MDBInput wrapperClass='mb-4' label='Téléphone' type='text' name='telephone' onChange={handleInput} style={{ borderColor: '#0077b6', borderWidth: '2px' }} />

                <MDBBtn className='mb-4' size='md' style={{ height: '40px', width: '200px', marginLeft: '340px', marginRight: 'auto', backgroundColor: '#0077b6' }} type="submit">
                  Sign Up
                </MDBBtn>
                <div className='d-flex justify-content-center mt-3'>
                  <Link to='/login' style={{ textDecoration: 'none', color: '#0077b6', fontWeight: 'bold', marginLeft: '40px' }}>I Have An Account</Link>
                </div>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default SignUp;
