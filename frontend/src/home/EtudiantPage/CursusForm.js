import React, { useState } from 'react';
import { Form, Button, Container, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuildingColumns, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

function CursusForm() {
  const [formData, setFormData] = useState({
    degreeType: '',
    yearOfDegree: '',
    department: '',
    specialization: '',
    session: '',
    averageGrade: '',
    generalProgram: '',
    lastDiploma: '',
    issuingInstitution: '',
    yearOfLastDiploma: '',
    fieldOfStudy: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleDropdownSelect = (value, name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Container className="mt-5">
      <div className="border rounded p-4 shadow-sm">
        <h4 className="mb-4">Cursus Information</h4>

        {/* First Section */}
        <Form.Group as={Col} controlId="degreeType" className="mb-4">
          <Form.Label style={{ fontFamily: 'Arial', fontSize: '16px'}}>
            <FontAwesomeIcon icon={faBuildingColumns} className="me-2" />
            <span className="fw-bold fs-5">Baccalauréat ou diplôme équivalent:</span>
          </Form.Label>
          
        </Form.Group>
        <hr className="my-2" />

        <Form.Group as={Col} controlId="yearOfDegree" style={{ width: "50%" }} >
        <Form.Label style={{ fontFamily: 'Arial', fontSize: '14px' }}>Année du bac:</Form.Label>
        <Form.Control
            as="select"
            name="yearOfDegree"
            value={formData.yearOfDegree}
            onChange={handleInputChange}
            className="ui-selectonemenu ui-widget ui-state-default ui-corner-all"
            style={{ 
                borderCollapse: 'separate',
                color: 'rgb(119, 141, 155)',
                display: 'table-cell',
                fontFamily: 'ralewaymedium',
                height: '38.8px',
                textIndent: '0px',
                verticalAlign: 'middle'
              }}
        >
            <option value="">Select Year</option>
            {/* Generate options for years from 1990 to current year */}
            {Array.from({ length: new Date().getFullYear() - 1989 }, (_, index) => (
            <option key={index} value={String(new Date().getFullYear() - index)}>{new Date().getFullYear() - index}</option>
            ))}
        </Form.Control>
        </Form.Group>



        <Form.Group as={Col} controlId="department">
          <Form.Label>Section:</Form.Label>
          <div  className="ui-selectonemenu ui-widget ui-state-default ui-corner-all" style={{ width: "50%" }}>
            <Form.Control
              as="select"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              style={{ 
                borderCollapse: 'separate',
                color: 'rgb(119, 141, 155)',
                display: 'table-cell',
                fontFamily: 'ralewaymedium',
                height: '38.8px',
                textIndent: '0px',
                verticalAlign: 'middle'
              }}
            >
              <option value="">Select Section</option>
              <option value="Mathematique">Mathematique</option>
              <option value="Technique">Technique</option>
              <option value="Lettre">Lettre</option>
              <option value="Science">Science</option>
              <option value="Economie">Economie</option>
              <option value="Sport">Sport</option>
              <option value="Informatique">Informatique</option>
              {/* Add more options here */}
            </Form.Control>
          </div>
        </Form.Group>

        <Form.Group as={Col} controlId="specialization">
          <Form.Label>Mention:</Form.Label>
          <div  className="ui-selectonemenu ui-widget ui-state-default ui-corner-all" style={{ width: "50%" }}>
            <Form.Control
              as="select"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              style={{ 
                borderCollapse: 'separate',
                color: 'rgb(119, 141, 155)',
                display: 'table-cell',
                fontFamily: 'ralewaymedium',
                height: '38.8px',
                textIndent: '0px',
                verticalAlign: 'middle'
              }}
            >
              <option value="">Select Mention</option>
              <option value="Passable">Passable</option>
              <option value="Assez bien">Assez bien</option>
              <option value="Bien">Bien</option>
              <option value="Très bien">Très bien</option>
              {/* Add more options here */}
            </Form.Control>
          </div>
        </Form.Group>

        <Form.Group as={Col} controlId="session">
          <Form.Label>Session:</Form.Label>
          <div  className="ui-selectonemenu ui-widget ui-state-default ui-corner-all" style={{ width: "50%" }}>
            <Form.Control
              as="select"
              name="session"
              value={formData.session}
              onChange={handleInputChange}
              style={{ 
                borderCollapse: 'separate',
                color: 'rgb(119, 141, 155)',
                display: 'table-cell',
                fontFamily: 'ralewaymedium',
                height: '38.8px',
                textIndent: '0px',
                verticalAlign: 'middle'
              }}
            >
              <option value="">Select Session</option>
              <option value="Principale">Principale</option>
              <option value="Controle">Controle</option>
              {/* Add more options here */}
            </Form.Control>
          </div>
        </Form.Group>

        {/* Second Section */}
        <Form.Group as={Col} controlId="generalProgram" className="mb-4">
          <Form.Label>
            <FontAwesomeIcon icon={faGraduationCap} className="me-2" />
            <span className="fw-bold fs-5">Cursus général:</span>
          </Form.Label>
          
          
        </Form.Group>
        <hr className="my-2" />

        <Form.Group as={Col} controlId="lastDiploma" style={{ width: "50%" }}>
            <Form.Label>Dernier diplome obtenu:</Form.Label>
            <Form.Control
                as="select" // Set the input type to "select"
                name="lastDiploma"
                value={formData.lastDiploma}
                onChange={handleInputChange}
                style={{ 
                borderCollapse: 'separate',
                color: 'rgb(119, 141, 155)',
                display: 'table-cell',
                fontFamily: 'ralewaymedium',
                height: '38.8px',
                textIndent: '0px',
                verticalAlign: 'middle'
                }}
            >
                {/* Options for the select dropdown */}
                <option value="">Select diplome</option>
                <option value="Licence National">Licence National</option>
                <option value="Licence Applique">Licence Applique</option>
                <option value="Licence Fondamentale">Licence Fondamentale</option>
                <option value="Master">Master</option>
            </Form.Control>
        </Form.Group>

        <Form.Group as={Col} controlId="issuingInstitution" style={{ width: "50%" }}>
          <Form.Label>Etablissement du diplome:</Form.Label>
          <Form.Control
            type="text"
            name="issuingInstitution"
            value={formData.issuingInstitution}
            onChange={handleInputChange}
            style={{ 
                borderCollapse: 'separate',
                color: 'rgb(119, 141, 155)',
                display: 'table-cell',
                fontFamily: 'ralewaymedium',
                height: '38.8px',
                textIndent: '0px',
                verticalAlign: 'middle'
              }}
          />
        </Form.Group>

        <Form.Group as={Col} controlId="yearOfLastDiploma">
          <Form.Label>Année d'obtention du diplôme:</Form.Label>
          <div  className="ui-selectonemenu ui-widget ui-state-default ui-corner-all" style={{ width: "50%" }}>
            <Form.Control
              as="select"
              name="yearOfLastDiploma"
              value={formData.yearOfLastDiploma}
              onChange={handleInputChange}
              style={{ 
                borderCollapse: 'separate',
                color: 'rgb(119, 141, 155)',
                display: 'table-cell',
                fontFamily: 'ralewaymedium',
                height: '38.8px',
                textIndent: '0px',
                verticalAlign: 'middle'
              }}
            >
              <option value="">Select Year</option>
              {/* Generate options for years from 1990 to current year */}
              {Array.from({ length: new Date().getFullYear() - 1989 }, (_, index) => (
                <option key={index} value={String(new Date().getFullYear() - index)}>{new Date().getFullYear() - index}</option>
              ))}
            </Form.Control>
          </div>
        </Form.Group>

        <Form.Group as={Col} controlId="fieldOfStudy">
          <Form.Label>Domaine:</Form.Label>
          <div  className="ui-selectonemenu ui-widget ui-state-default ui-corner-all" style={{ width: "50%" }}>
            <Form.Control
              as="select"
              name="fieldOfStudy"
              value={formData.fieldOfStudy}
              onChange={handleInputChange}
              style={{ 
              borderCollapse: 'separate',
              color: 'rgb(119, 141, 155)',
              display: 'table-cell',
              fontFamily: 'ralewaymedium',
              height: '38.8px',
              textIndent: '0px',
              verticalAlign: 'middle'
            }}
            >
              <option value="">Select Domaine</option>
              <option value="Economie et Gestion">Economie et Gestion</option>
              <option value="Genie Logiciel">Genie Logiciel</option>
              <option value="Genie Civil">Genie Civil</option>
              <option value="Genie Mecanique">Genie Mecanique</option>
              <option value="Genie Electronique">Genie Electronique</option>
              <option value="Genie Mecatronique">Genie Mecatronique</option>
              {/* Add more options here */}
            </Form.Control>
          </div>
        </Form.Group>

        <Button type="submit" onClick={handleSubmit}>Submit</Button>
      </div>
    </Container>
  );
}

export default CursusForm;
