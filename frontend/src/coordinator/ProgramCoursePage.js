import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

import { FaBook, FaClock, FaUniversity, FaPhone } from 'react-icons/fa';

function ProgramCoursePage() {
  const [programCourses, setProgramCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [originalProgramCourses, setOriginalProgramCourses] = useState([]);

  useEffect(() => {
    const fetchProgramCourses = async () => {
      try {
        const tokenTeacher = localStorage.getItem('tokenTeacher');
        const response = await axios.get('http://localhost:8081/programCourses', {
          headers: {
            Authorization: `Bearer ${tokenTeacher}`
          }
        });
        console.log('Response from server:', response); // Log the entire response object
        setProgramCourses(response.data.programCourses);
        setOriginalProgramCourses(response.data.programCourses);
        setLoading(false);
        console.log('Program courses fetched successfully:', response.data.programCourses);
      } catch (error) {
        console.error('Error fetching program courses:', error);
        setLoading(false);
      }
    };

    fetchProgramCourses();
  }, []);

  const handleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedCourses = [...programCourses];
    updatedCourses[index][name] = value;
    setProgramCourses(updatedCourses);
  };

  const handleCancelEdit = () => {
    setProgramCourses(originalProgramCourses);
    setEditMode(false);
  };

  const handleSaveChanges = () => {
    // Implement logic to save changes
    // This function will be called when the user clicks the save button
    // You can add your save logic here
  
    // Show success message using SweetAlert2
    Swal.fire({
      title: "Good job!",
      text: "Information saved",
      icon: "success"
    });
  
    // Leave edit mode
    setEditMode(false);
  };

  return (
    <div className="container-xl mt-5">
      <div className="d-flex justify-content-end mb-3">
        {!editMode ? (
          <button className="btn btn-primary" onClick={handleEditMode}>Edit</button>
        ) : (
          <>
            <button className="btn btn-success me-2" onClick={handleSaveChanges}>Save</button>
            <button className="btn btn-danger" onClick={handleCancelEdit}>Cancel</button>
          </>
        )}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : programCourses.length > 0 ? (
        <div>
          <div className="row">
            {programCourses.map((course, index) => (
              <div key={course.id} className="col-md-12">
                <div className="card shadow-sm p-3 mb-5 bg-white rounded" style={{ height: 'auto', transition: '0.3s', cursor: 'pointer', ':hover': { boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', transition: '0.3s' } }}>
                  <div className="card-body" style={{ backgroundColor: '#e9ecef' }}>
                    <h5 className="card-title" style={{ display: 'flex', alignItems: 'center', color: '#27374d', fontSize: '20px' }}><FaBook style={{ marginRight: '10px', color: '#27374d', fontSize: '24px' }} />{course.title}</h5>
                    <hr style={{ backgroundColor: '#007bff' }} />
                    <div className="row">
                      <div className="col-md-6">
                        <p><FaUniversity style={{ marginRight: '5px' }} /> <span style={{ marginLeft: '5px', color: '#333', fontSize: '16px' }}></span></p>
                        <div className="bg-light p-3 rounded mb-4" style={{ backgroundColor: '#e9ecef' }}>
                          <h6 className="text-muted" style={{ fontSize: '16px' }}>Objectifs</h6>
                          <p style={{ fontSize: '16px' }}>{editMode ? <input type="text" name="objectifs" value={course.objectifs} onChange={(e) => handleInputChange(index, e)} style={{ width: '100%', height: '80px' }} /> : course.objectifs}</p>
                        </div>
                        <div className="bg-light p-3 rounded mb-4" style={{ backgroundColor: '#e9ecef' }}>
                          <h6 className="text-muted" style={{ fontSize: '16px' }}>Structure</h6>
                          <p style={{ fontSize: '16px' }}>{editMode ? <input type="text" name="structure" value={course.structure} onChange={(e) => handleInputChange(index, e)} style={{ width: '100%', height: '80px' }} /> : course.structure}</p>
                        </div>
                        <div className="bg-light p-3 rounded mb-4" style={{ backgroundColor: '#e9ecef' }}>
                          <h6 className="text-muted" style={{ fontSize: '16px' }}>Cour Obligatoire</h6>
                          <p style={{ fontSize: '16px' }}>{editMode ? <input type="text" name="cours_obligatoires" value={course.cours_obligatoires} onChange={(e) => handleInputChange(index, e)} style={{ width: '100%', height: '80px' }} /> : course.cours_obligatoires}</p>
                        </div>
                        <div className="bg-light p-3 rounded mb-4" style={{ backgroundColor: '#e9ecef' }}>
                          <h6 className="text-muted" style={{ fontSize: '16px' }}>Cour Optionnel</h6>
                          <p style={{ fontSize: '16px' }}>{editMode ? <input type="text" name="cours_optionnels" value={course.cours_optionnels} onChange={(e) => handleInputChange(index, e)} style={{ width: '100%', height: '80px' }} /> : course.cours_optionnels}</p>
                        </div>
                        <div className="bg-light p-3 rounded mb-4" style={{ backgroundColor: '#e9ecef' }}>
                          <h6 className="text-muted" style={{ fontSize: '16px' }}>Admission</h6>
                          <p style={{ fontSize: '16px' }}>{editMode ? <input type="text" name="admission" value={course.admission} onChange={(e) => handleInputChange(index, e)} style={{ width: '100%', height: '80px' }} /> : course.admission}</p>
                        </div>
                      </div>
                      <div className="col-md-4" style={{ marginLeft: '150px' }}>
                        <div className="  mt-5 p-3 rounded" style={{ backgroundColor: '#27374d' }}>
                          <h6 className="text" style={{ color:'#e9ecef',fontSize: '16px' }}><FaClock style={{  color:'#e9ecef', marginRight: '5px' }} /> Duration</h6>
                          <p style={{ color:'#e9ecef',fontSize: '16px' }}>{editMode ? <input type="text" name="duree" value={course.duree} onChange={(e) => handleInputChange(index, e)} style={{ width: '100%', height: '40px' }} /> : course.duree}</p>
                        </div>
                        <div className="mt-4  p-3 rounded" style={{backgroundColor: '#27374d' }}>
                          <h6 className="text" style={{ color:'#e9ecef',fontSize: '16px' }}><FaPhone style={{ color:'#e9ecef',marginRight: '5px' }} /> Contact</h6>
                          <p style={{ color:'#e9ecef',fontSize: '16px' }}>{editMode ? <input type="text" name="contact" value={course.contact} onChange={(e) => handleInputChange(index, e)} style={{ width: '100%', height: '40px' }} /> : course.contact}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center">No program courses found for this teacher.</p>
      )}
    </div>
  );
      }  
export default ProgramCoursePage;

