import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import './Application.css'; // Import the CSS file
import './current.css';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { FaUserGraduate } from 'react-icons/fa';

const ApplicationForm = ({ show, onHide, title, username }) => {
  const [cin, setCin] = useState('');
  const [selectedFile1, setSelectedFile1] = useState(null);
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [selectedFile3, setSelectedFile3] = useState(null);
  const [selectedFileBac, setSelectedFileBac] = useState(null); // New state for "relevé du baccalauréat"
  const [moyenne_totale, setMoyenneTotale] = useState(null);
  const [score_accumulator, setScoreAccumulator] = useState(null);
  const [scoreBac, setScoreBac] = useState(null); // New state for scoreBac

  useEffect(() => {
    const storedFormData = localStorage.getItem('formData');
    if (storedFormData) {
      const formData = JSON.parse(storedFormData);
      const storedCin = formData.cin;
      setCin(storedCin);
    }
  }, []);

  const handleFileChange = (e) => {
    const fileInputName = e.target.name;
    const files = e.target.files;

    if (files.length > 0) {
      switch (fileInputName) {
        case 'file1':
          setSelectedFile1(files[0]);
          break;
        case 'file2':
          setSelectedFile2(files[0]);
          break;
        case 'file3':
          setSelectedFile3(files[0]);
          break;
        case 'fileBac': // Handle the new file input
          setSelectedFileBac(files[0]);
          break;
        default:
          break;
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('username', username);
      formData.append('cin', cin);
      formData.append('file1', selectedFile1);
      formData.append('file2', selectedFile2);
      formData.append('file3', selectedFile3);
      formData.append('fileBac', selectedFileBac); // Append the new file

      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Data saved:', response.data);
      if (response.data && response.data.moyenne_totale !== undefined && response.data.score_accumulator !== undefined && response.data.score_bac !== undefined) {
        console.log('Data saved successfully');
        console.log('Moyenne Totale:', response.data.moyenne_totale);
        console.log('Score Accumulator:', response.data.score_accumulator);
        console.log('Score Bac:', response.data.score_bac);

        setMoyenneTotale(response.data.moyenne_totale);
        setScoreAccumulator(response.data.score_accumulator);
        setScoreBac(response.data.score_bac);

        formData.append('moyenne_totale', response.data.moyenne_totale.toString());
        formData.append('score_accumulator', response.data.score_accumulator.toString());
        formData.append('score_bac', response.data.score_bac.toString());
      } else {
        console.error('Data saved but missing expected fields:', response.data);
      }

      const token = localStorage.getItem('token');
      const saveResponse = await axios.post('http://localhost:8081/application', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Data saved:', saveResponse.data);

      onHide(); // Close the modal after successful submission
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Application saved",
        showConfirmButton: false,
        timer: 1500
      });

    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>ApplicationForm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form encType="multipart/form-data">
          <div className="form-container" style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', marginBottom: '10px', marginRight: '260px', backgroundColor: '#ccc', borderRadius: '10px' }}>
            <Form.Group controlId="formTitle">
              <Form.Label style={{ fontWeight: 'bold' }}>Title</Form.Label>
              <Form.Control type="text" value={title} readOnly style={{ width: '450px' }} />
            </Form.Group>
            <Form.Group controlId="formUsername">
              <Form.Label style={{ fontWeight: 'bold' }}>Student</Form.Label>
              <Form.Control type="text" value={username} readOnly style={{ width: '450px' }} />
            </Form.Group>
            <Form.Group controlId="formCin">
              <Form.Label style={{ fontWeight: 'bold' }}>CIN</Form.Label>
              <Form.Control type="text" value={cin} readOnly style={{ width: '450px' }} />
            </Form.Group>
          </div>
          <div className="user-icon-container">
            <FaUserGraduate className="user-icon" style={{ marginLeft: '550px', marginTop: '-300px', width: '200px', height: '200px', color: 'rgb(82, 82, 82)' }} />
          </div>
          <Form.Group>
            <Form.Label htmlFor="pdfFile1" style={{ fontWeight: 'bold' }}>Télécharger Relevé de Notes 1:</Form.Label>
            <Form.Control type="file" name="file1" accept=".pdf" required onChange={handleFileChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="pdfFile2" style={{ fontWeight: 'bold' }}>Télécharger Relevé de Notes 2:</Form.Label>
            <Form.Control type="file" name="file2" accept=".pdf" required onChange={handleFileChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="pdfFile3" style={{ fontWeight: 'bold' }}>Télécharger Relevé de Notes 3:</Form.Label>
            <Form.Control type="file" name="file3" accept=".pdf" required onChange={handleFileChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="pdfFileBac" style={{ fontWeight: 'bold' }}>Télécharger Relevé du Baccalauréat:</Form.Label>
            <Form.Control type="file" name="fileBac" accept=".pdf" required onChange={handleFileChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button onClick={handleSubmit} style={{ backgroundColor: '#27374d', color: '#fff' }}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ApplicationForm;
