import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AiOutlineArrowLeft } from "react-icons/ai";

const ProgramForm = ({ isOpen, programMasterId, onCancel, onSuccess }) => {
  const [programDetails, setProgramDetails] = useState({
    title: '',
    objectifs: '',
    duree: '',
    structure: '',
    cours_obligatoires: '',
    cours_optionnels: '',
    admission: '',
    contact: '',
    
  });

  useEffect(() => {
    if (programMasterId) {
      fetchProgramMaster(programMasterId);
    } else {
      // Reset fields when creating a new program master
      setProgramDetails({
        title: '',
        objectifs: '',
        duree: '',
        structure: '',
        cours_obligatoires: '',
        cours_optionnels: '',
        admission: '',
        contact: '',
      });
    }
  }, [programMasterId]);

  const fetchProgramMaster = async (id) => {
    try {
      // Get the selected program title from local storage
      const selectedProgramTitle = localStorage.getItem('selectedProgramTitle');
      console.log(selectedProgramTitle);
      
      // Fetch all program masters
      const response = await axios.get(`http://localhost:8081/programMasters`);
      console.log(response.data); // Log the response data
      
      // Filter the program masters based on the selected program title
      const selectedProgramMaster = response.data.programMasters.find(programMaster => programMaster.title === selectedProgramTitle);
      
      // Set the program details to the selected program master
      if (selectedProgramMaster) {
        setProgramDetails(selectedProgramMaster);
      } else {
        console.error('Selected program master not found');
      }
    } catch (error) {
      console.error('Error fetching program master:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const { title, objectifs, duree, structure, cours_obligatoires, cours_optionnels, admission, contact } = programDetails;
  
      if (!title || !objectifs || !duree || !structure || !cours_obligatoires || !cours_optionnels || !admission || !contact) {
        console.error('All fields must be filled out');
        return Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'All fields must be filled out',
        });
      }
  
      const data = {
        title,
        objectifs,
        duree,
        structure,
        cours_obligatoires,
        cours_optionnels,
        admission,
        contact,
      };
  
      console.log('Data before send:', data); // Log the data
  
      let response;
      if (programMasterId) {
        // Update existing program master
        response = await axios.put(`http://localhost:8081/programMasters/${programMasterId}`, data);
      } else {
        // Create new program master
        response = await axios.post('http://localhost:8081/programMasters', data);
      }
  
      console.log('Server response:', response.data); // Log the server response
  
      if (response.data.success) {
        console.log("Operation succeeded");
        onSuccess();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        console.log("Operation failed");
      }
    } catch (error) {
      console.error(programMasterId ? 'Error updating program master:' : 'Error creating program master:', error);
    }
  };
  
  
  

  const handleImageChange = (e) => {
    setProgramDetails({ ...programDetails, file: e.target.files[0] });
  };

  if (!isOpen) return null;

  return (
    <div className="program-form-overlay" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <button style={{ marginTop: '-1060px', marginLeft: '-40px', marginRight: '30px', width: '40px', borderRadius: '10px', backgroundColor: '#27374d', color: '#fff', height: '30px' }}>
        <AiOutlineArrowLeft />
      </button>
      <div className="program-form-container" style={{ marginTop: '20px', width: '100%', maxWidth: '1200px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', background: '#dde6ed' }}>
        <div className="program-form-header">
          <h3>{programMasterId ? 'Edit Program Master' : 'Create Program Master'}</h3>
        </div>
        <div className="program-form-body">
          <label style={{ fontWeight: 'bold' }}>Titre du Programme</label>
          <input
            type="text"
            placeholder="Titre du Programme"
            value={programDetails.title}
            onChange={(e) => setProgramDetails({ ...programDetails, title: e.target.value })}
            className="form-control mb-3"
          />
          <label style={{ fontWeight: 'bold' }}>Objectifs du Programme</label>
          <textarea
            placeholder="Objectifs du Programme"
            value={programDetails.objectifs}
            onChange={(e) => setProgramDetails({ ...programDetails, objectifs: e.target.value })}
            className="form-control mb-3"
          />
          <label style={{ fontWeight: 'bold' }}>Durée du Programme</label>
          <input
            type="text"
            placeholder="Durée du Programme"
            value={programDetails.duree}
            onChange={(e) => setProgramDetails({ ...programDetails, duree: e.target.value })}
            className="form-control mb-3"
          />
          <label style={{ fontWeight: 'bold' }}>Structure du Programme</label>
          <textarea
            placeholder="Structure du Programme"
            value={programDetails.structure}
            onChange={(e) => setProgramDetails({ ...programDetails, structure: e.target.value })}
            className="form-control mb-3"
          />
          <label style={{ fontWeight: 'bold' }}>Cours obligatoires</label>
          <textarea
            placeholder="Cours obligatoires"
            value={programDetails.cours_obligatoires}
            onChange={(e) => setProgramDetails({ ...programDetails, cours_obligatoires: e.target.value })}
            className="form-control mb-3"
          />
          <label style={{ fontWeight: 'bold' }}>Cours optionnels</label>
          <textarea
            placeholder="Cours optionnels"
            value={programDetails.cours_optionnels}
            onChange={(e) => setProgramDetails({ ...programDetails, cours_optionnels: e.target.value })}
            className="form-control mb-3"
          />
          <label style={{ fontWeight: 'bold' }}>Admission</label>
          <textarea
            placeholder="Admission"
            value={programDetails.admission}
            onChange={(e) => setProgramDetails({ ...programDetails, admission: e.target.value })}
            className="form-control mb-3"
          />
          <label style={{ fontWeight: 'bold' }}>Contact</label>
          <textarea
            placeholder="Contact"
            value={programDetails.contact}
            onChange={(e) => setProgramDetails({ ...programDetails, contact: e.target.value })}
            className="form-control mb-3"
          />
          
        </div>
        <div className="program-form-footer">
          <button onClick={handleSubmit} className="btn btn-success me-2">{programMasterId ? 'Save' : 'Create'}</button>
          <button onClick={onCancel} className="btn btn-danger">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ProgramForm;
