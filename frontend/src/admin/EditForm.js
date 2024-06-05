import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function EditForm({ programMaster, fetchProgramMasters }) {
  // Initialize state variables with programMaster values
  const [title, setTitle] = useState(programMaster.title || '');
  const [details, setDetails] = useState(programMaster.details || '');
  const [objectifs, setObjectifs] = useState(programMaster.objectifs || '');
  const [structure, setStructure] = useState(programMaster.structure || '');
  const [coursObligatoires, setCoursObligatoires] = useState(programMaster.coursObligatoires || '');
  const [coursOptionnels, setCoursOptionnels] = useState(programMaster.coursOptionnels || '');
  const [admission, setAdmission] = useState(programMaster.admission || '');
  const [contact, setContact] = useState(programMaster.contact || '');
  const [duration, setDuration] = useState(programMaster.duree || '');

  // Update state variables when programMaster prop changes
  useEffect(() => {
    setTitle(programMaster.title || '');
    setDetails(programMaster.details || '');
    setObjectifs(programMaster.objectifs || '');
    setStructure(programMaster.structure || '');
    setCoursObligatoires(programMaster.coursObligatoires || '');
    setCoursOptionnels(programMaster.coursOptionnels || '');
    setAdmission(programMaster.admission || '');
    setContact(programMaster.contact || '');
    setDuration(programMaster.duree || '');
  }, [programMaster]);

  const updateProgramMaster = async () => {
    try {
      // Send updated data to the server
      await axios.put(`http://localhost:8081/programMasters/${programMaster.id}`, {
        title,
        details,
        objectifs,
        structure,
        coursObligatoires,
        coursOptionnels,
        admission,
        contact,
        duree: duration // Updated duration
      });

      // Fetch updated program masters after updating
      fetchProgramMasters();

      // Show success message
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Error updating program master:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="text-center mt-5 mb-3">Edit Program Master</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          {/* Input fields for editing program details */}
          {/* Add onChange event handlers to update state variables */}
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              id="title"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="details" className="form-label">Details</label>
            <textarea
              id="details"
              className="form-control"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="objectifs" className="form-label">Objectifs</label>
            <textarea
              id="objectifs"
              className="form-control"
              value={objectifs}
              onChange={(e) => setObjectifs(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="structure" className="form-label">Structure</label>
            <input
              type="text"
              id="structure"
              className="form-control"
              value={structure}
              onChange={(e) => setStructure(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="coursObligatoires" className="form-label">Cours Obligatoires</label>
            <input
              type="text"
              id="coursObligatoires"
              className="form-control"
              value={coursObligatoires}
              onChange={(e) => setCoursObligatoires(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="coursOptionnels" className="form-label">Cours Optionnels</label>
            <input
              type="text"
              id="coursOptionnels"
              className="form-control"
              value={coursOptionnels}
              onChange={(e) => setCoursOptionnels(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="admission" className="form-label">Admission</label>
            <input
              type="text"
              id="admission"
              className="form-control"
              value={admission}
              onChange={(e) => setAdmission(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="contact" className="form-label">Contact</label>
            <input
              type="text"
              id="contact"
              className="form-control"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="duration" className="form-label">Duration</label>
            <input
              type="text"
              id="duration"
              className="form-control"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          {/* Button to trigger update */}
          <button className="btn btn-primary" onClick={updateProgramMaster}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default EditForm;
