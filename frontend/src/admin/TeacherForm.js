import React, { useState, useEffect } from 'react';
import axios from 'axios';
import sketch5 from '../images/sketch5.jpg';
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Button } from 'react-bootstrap';

const TeacherForm = ({teacher ,onCancel}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cin: '',
    city: '',
    contact: '',
    address: '',
    dob: '',
    gender: '',
    expertise: '',
    selectedProgram: '',
    loginEmail: '',
    loginPassword: ''
  });

  const [programTitles, setProgramTitles] = useState([]);

  useEffect(() => {
    const fetchProgramTitles = async () => {
      try {
        const response = await axios.get('http://localhost:8081/programMasters/titles');
        setProgramTitles(response.data);
      } catch (error) {
        console.error('Error fetching program titles:', error);
      }
    };
    if (teacher) {
      setFormData({
        name: teacher.name,
        email: teacher.email,
        cin: teacher.cin,
        city: teacher.city,
        contact: teacher.contact,
        address: teacher.address,
        dob: teacher.dob,
        gender: teacher.gender,
        expertise: teacher.expertise,
        selectedProgram: teacher.program,
        loginEmail: teacher.login_email,
        loginPassword: teacher.login_password
      });
    }


    fetchProgramTitles();
  }, [teacher]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        // If formData contains an ID, it means we're updating an existing teacher
        await axios.put(`http://localhost:8081/teachers/${formData.id}`, formData);
        console.log('Teacher updated successfully!');
      } else {
        // If formData doesn't contain an ID, it means we're creating a new teacher
        const response = await axios.post('http://localhost:8081/teachers', formData);
        console.log('Teacher saved successfully:', response.data);
      }
      // Reset the form data after successful submission
      setFormData({
        name: '',
        email: '',
        cin: '',
        city: '',
        contact: '',
        address: '',
        dob: '',
        gender: '',
        expertise: '',
        selectedProgram: '',
        loginEmail: '',
        loginPassword: ''
      });
    } catch (error) {
      console.error('Error saving/updating teacher:', error);
      // Handle error appropriately
    }
  };
  


  return (
   
    <div className="container py-5">
      <Button  onClick={onCancel} className="back-button">
        <AiOutlineArrowLeft />
      </Button>
      <style>
        {`
        .back-button {
          margin-top:40px;
          margin-left:270px;
          position: absolute;
          top: 20px;
          left: 30px;
          background-color: #27374d;
          border: none;
          border-radius: 50%;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #dde6ed;
          cursor: pointer;
          
        }

        .back-button:hover {
          background-color: #dde6ed;
          color:#27374d;
        }

        .back-button:focus {
          outline: none;
        }

        .back-icon {
          font-size: 1.5rem;
          

        `}
      </style>
      <div className="row">
        <div className="col-md-6" style={{marginTop:'-60px'}}>
          <div style={{
            
            padding: '40px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            backgroundColor:'#27374d',
            color:'#f0f0f0'
          }}>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="name">Your name</label>
                <input className="form-control" id="name" name="name" type="text" placeholder="For example, Davis George" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="email">E-mail</label>
                <input className="form-control" id="email" name="email" type="email" placeholder="example@gmail.com" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="cin">CIN</label>
                <input className="form-control" id="cin" name="cin" type="text" value={formData.cin} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="city">City</label>
                <input className="form-control" id="city" name="city" type="text" placeholder="Select a city" value={formData.city} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="contact">Cell number</label>
                <input className="form-control" id="contact" name="contact" type="tel" placeholder="+380 XX XXX XX XX" value={formData.contact} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="address">Address</label>
                <input className="form-control" id="address" name="address" type="text" placeholder="123 Main St" value={formData.address} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="dob">Birth of Date</label>
                <input className="form-control" id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="gender">Gender</label>
                <div>
                  <input id="gender_male" name="gender" type="radio" className="form-check-input" value="male" onChange={handleChange} />
                  <label htmlFor="gender_male" className="form-check-label me-3">Male</label>
                  <input id="gender_female" name="gender" type="radio" className="form-check-input" value="female" onChange={handleChange} />
                  <label htmlFor="gender_female" className="form-check-label">Female</label>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="expertise">Subject/Area of Expertise</label>
                <input className="form-control" id="expertise" name="expertise" type="text" placeholder="Your expertise" value={formData.expertise} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="selectedProgram">Select Program Master</label>
                <select className="form-select" id="selectedProgram" name="selectedProgram" value={formData.selectedProgram} onChange={handleChange}>
                  <option value="">Select a program</option>
                  {Array.isArray(programTitles) && programTitles.map((title, index) => (
                  <option key={`${title}-${index}`} value={title}>{title}</option>
                  ))}
                 </select>
              </div>
              <div className="mini-box" style={{backgroundColor:'#f0f0f0',padding: '20px',borderRadius: '8px',color:'#27374d'}}>
                <h3>Login Informations</h3>
                <div className="mb-3">
                  <label className="form-label" htmlFor="loginEmail">Login Email</label>
                  <input className="form-control" id="loginEmail" name="loginEmail" type="email" placeholder="example@gmail.com" value={formData.loginEmail} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="loginPassword">Login Password</label>
                  <input className="form-control" id="loginPassword" name="loginPassword" type="password" placeholder="Password" value={formData.loginPassword} onChange={handleChange} required />
                </div>
              </div>
              <div className="mb-3">
                <button className="btn btn-primary" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-md-6">
          <img className="img-fluid" src={sketch5} alt="Form Illustration" />
        </div>
      </div>
    </div>
  );
};

export default TeacherForm;
