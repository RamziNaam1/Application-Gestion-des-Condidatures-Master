import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2

import 'bootstrap/dist/css/bootstrap.min.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState('');
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    cin: '',
    dateOfBirth: '',
    sexe: '',
    gouvernoratDeNaissance: '',
    paysDeNaissance: '',
    situation: '',
    rue: '',
    ville: '',
    codePostal: '',
    gouvernorat: '',
    telephone: '',
    profile_photo: null
  });

  useEffect(() => {
    const username = localStorage.getItem('username');

    axios.get('http://localhost:8081/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      const users = response.data.users;
      const loggedInUser = users.find(user => user.username === username);
      if (loggedInUser) {
        setUser(loggedInUser);
        setFormData({
          email: loggedInUser.email,
          cin: loggedInUser.cin,
          dateOfBirth: loggedInUser.date_of_birth,
          sexe: loggedInUser.sexe,
          gouvernoratDeNaissance: loggedInUser.gouvernorat_de_naissance,
          paysDeNaissance: loggedInUser.pays_de_naissance,
          situation: loggedInUser.situation,
          rue: loggedInUser.rue,
          ville: loggedInUser.ville,
          codePostal: loggedInUser.code_postal,
          gouvernorat: loggedInUser.gouvernorat,
          telephone: loggedInUser.telephone,
          profile_photo: null
        });
        const profileImageUrl = `http://localhost:8081/${loggedInUser.profile_photo}`;
        setProfileImage(profileImageUrl);
        localStorage.setItem('profileImage', profileImageUrl);
      } else {
        setError('User not found');
      }
    })
    .catch(error => {
      setError(error.response ? error.response.data.message : 'An error occurred');
      console.log('Error:', error.response ? error.response.data : error);
    });
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'profile_photo') {
      setFormData(prevState => ({
        ...prevState,
        profile_photo: e.target.files[0]
      }));

      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
        localStorage.setItem('profileImage', reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      const { name, value } = e.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataWithImage = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataWithImage.append(key, value);
    });

    axios.put(`http://localhost:8081/users/${user.id}`, formDataWithImage, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      console.log(response.data.message);
      axios.get(`http://localhost:8081/users/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(res => {
        const updatedUser = res.data.user;
        setUser(updatedUser);
        const updatedProfileImageUrl = `http://localhost:8081/${updatedUser.profile_photo}`;
        setProfileImage(updatedProfileImageUrl);
        localStorage.setItem('profileImage', updatedProfileImageUrl);
      })
      .catch(err => console.log('Error fetching updated user data:', err));
    })
    .catch(error => {
      console.error('Error updating user information:', error);
    })
    .finally(() => {
      // Show alert using SweetAlert2 regardless of success or failure
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500
      });
    });
  };

  if (error) {
    return <div className="alert alert-danger" role="alert">{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card" style={{backgroundColor:"#ececec"}}>
        <div className="card-body">
          <h1 className="text-center" style={{marginRight:'1100px',fontWeight:'bold',fontSize:'40px',color:'#27374d'}}>Profile</h1>
          <div className="text-center mb-4">
            <label htmlFor="profile_photo_input" style={{ cursor: 'pointer' }}>
              <img src={profileImage} alt="Profile" className="img-thumbnail rounded-circle"  style={{ width: '250px' ,height:'250px'}} />
              <h4 style={{fontWeight:'bold'}}>profile Image</h4>
            </label>
            <input id="profile_photo_input" type="file" name="profile_photo" onChange={handleChange} accept="image/*" style={{ display: 'none' }} />
          </div>

          <form onSubmit={handleSubmit}>
            <h3 style={{marginTop:'100px',fontWeight:'bold',color:'#27374d'}}>Personal Information</h3>
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label style={{ fontWeight: 'bold', color: '#27374d' }}>Email:</label>
                  <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label style={{ fontWeight: 'bold', color: '#27374d' }}>CIN:</label>
                  <input type="text" className="form-control" name="cin" value={formData.cin} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label style={{ fontWeight: 'bold', color: '#27374d' }}>Date of Birth:</label>
                  <input type="date" className="form-control" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label style={{ fontWeight: 'bold', color: '#27374d' }}>Sexe:</label>
                  <input type="text" className="form-control" name="sexe" value={formData.sexe} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label style={{ fontWeight: 'bold', color: '#27374d' }}>Gouvernorat de Naissance:</label>
                  <input type="text" className="form-control" name="gouvernoratDeNaissance" value={formData.gouvernoratDeNaissance} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label style={{ fontWeight: 'bold', color: '#27374d' }}>Pays de Naissance:</label>
                  <input type="text" className="form-control" name="paysDeNaissance" value={formData.paysDeNaissance} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label style={{ fontWeight: 'bold', color: '#27374d' }}>Situation:</label>
                  <input type="text" className="form-control" name="situation" value={formData.situation} onChange={handleChange} />
                </div>
              </div>
            </div>

            <h3 style={{ fontWeight: 'bold', color: '#27374d' }}>Address</h3>
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label style={{ fontWeight: 'bold', color: '#27374d' }}>Rue:</label>
                  <input type="text" className="form-control" name="rue" value={formData.rue} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label style={{ fontWeight: 'bold', color: '#27374d' }}>Ville:</label>
                  <input type="text" className="form-control" name="ville" value={formData.ville} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label style={{ fontWeight: 'bold', color: '#27374d' }}>Code Postal:</label>
                  <input type="text" className="form-control" name="codePostal" value={formData.codePostal} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label style={{ fontWeight: 'bold', color: '#27374d' }}>Gouvernorat:</label>
                  <input type="text" className="form-control" name="gouvernorat" value={formData.gouvernorat} onChange={handleChange} />
                </div>
              </div>
            </div>

            <h3 style={{ fontWeight: 'bold', color: '#27374d' }}>Contact</h3>
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label style={{ fontWeight: 'bold', color: '#27374d' }}>Telephone:</label>
                  <input type="text" className="form-control" name="telephone" value={formData.telephone} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
