import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import { FaUniversity, FaBook, FaClock, FaPhone ,FaArrowLeft } from 'react-icons/fa';
import { FaRegPenToSquare } from "react-icons/fa6";
import ApplicationForm from './ApplicationForm';
import'./masterProgram.css';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import './splide.css';

const MasterProgram = ({ program, onClick, isCurrent }) => {
  return (
    <Col xs={12} sm={6} md={6} lg={3} className="mb-4" style={{ width: '100%', height: '200px', marginTop: '50px' }}>
      <Card
        className={`h-100 master-program-card ${isCurrent ? 'current-slide' : ''}`}
        onClick={() => onClick(program)}
      >
        <Card.Body className="d-flex flex-column justify-content-center align-items-center">
          <Card.Title cclassName="program-title text-center font-weight-bold" style={{fontWeight:'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{program.title}</Card.Title>
          <Card.Text className="program-description">
            {program.description}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

const MasterDetails = ({ program, onClick }) => {
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState('');
  const [cin, setCin] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0); // State for current slide index

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = ({ nom, prenom }) => {
    // Handle form submission logic here
    console.log('Nom:', nom);
    console.log('Prenom:', prenom);
    // You may want to perform further actions here, such as sending data to the server
    setShowModal(false);
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    // Retrieve 'cin' value from localStorage
    const storedCin = localStorage.getItem('cin');
    if (storedCin) {
      setCin(storedCin);
    }
  }, []);

  return (
    <Container className="mt-4">
      <div className="container-xl " style={{ marginTop: '5px' }}>
        <Button onClick={onClick} className="mb-4" style={{ borderRadius: '10px', backgroundColor: '#27374d' }}><FaArrowLeft /></Button>
        <div className="row">
          <div className="col-md-12">
            <div className="card shadow-sm p-3 mb-5 bg-white rounded" style={{ height: 'auto', transition: '0.3s', cursor: 'pointer', ':hover': { boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', transition: '0.3s' } }}>
              <div className="card-body" style={{ backgroundColor: '#e9ecef' }}>
                <h5 className="card-title d-flex align-items-center" style={{ color: '#27374d', fontSize: '20px' }}>
                  <FaBook style={{ marginRight: '10px', color: '#27374d', fontSize: '24px' }} />
                  {program.title}
                </h5>
                <hr style={{ backgroundColor: '#007bff' }} />
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <FaUniversity style={{ marginRight: '5px' }} />
                      <span style={{ marginLeft: '5px', color: '#333', fontSize: '16px' }}>{program.structure}</span>
                    </p>
                    <div className="bg-light p-3 rounded mb-4" style={{ backgroundColor: '#e9ecef' }}>
                      <h6 className="text-muted" style={{ fontSize: '16px' }}>Objectifs</h6>
                      <p style={{ fontSize: '16px' }}>{program.objectifs}</p>
                    </div>
                    <div className="bg-light p-3 rounded mb-4" style={{ backgroundColor: '#e9ecef' }}>
                      <h6 className="text-muted" style={{ fontSize: '16px' }}>Cours Obligatoire</h6>
                      <p style={{ fontSize: '16px' }}>{program.cours_obligatoires}</p>
                    </div>
                    <div className="bg-light p-3 rounded mb-4" style={{ backgroundColor: '#e9ecef' }}>
                      <h6 className="text-muted" style={{ fontSize: '16px' }}>Cours Optionnel</h6>
                      <p style={{ fontSize: '16px' }}>{program.cours_optionnels}</p>
                    </div>
                    <div className="bg-light p-3 rounded mb-4" style={{ backgroundColor: '#e9ecef' }}>
                      <h6 className="text-muted" style={{ fontSize: '16px' }}>Admission</h6>
                      <p style={{ fontSize: '16px' }}>{program.admission}</p>
                    </div>
                  </div>
                  <div className="col-md-4" style={{ marginLeft: '150px' }}>
                    <div className="  mt-5 p-3 rounded" style={{ backgroundColor: '#27374d' }}>
                      <h6 className="text" style={{ color: '#e9ecef', fontSize: '16px' }}><FaClock style={{ color: '#e9ecef', marginRight: '5px' }} /> Durée</h6>
                      <p style={{ color: '#e9ecef', fontSize: '16px' }}>{program.duree}</p>
                    </div>
                    <div className="mt-4  p-3 rounded" style={{ backgroundColor: '#27374d' }}>
                      <h6 className="text" style={{ color: '#e9ecef', fontSize: '16px' }}><FaPhone style={{ color: '#e9ecef', marginRight: '5px' }} /> Contact</h6>
                      <p style={{ color: '#e9ecef', fontSize: '16px' }}>{program.contact}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={handleOpenModal}
          style={{ position: 'absolute', right: '250px', top: '200px', backgroundColor: '#27374d' }}
        >
          Demande<FaRegPenToSquare style={{ marginLeft: '10px', fontSize: '24px' }} />
        </Button>
      </div>
      <ApplicationForm show={showModal} onHide={handleCloseModal} onSubmit={handleSubmit} title={program.title} username={username} cin={cin} />
    </Container>
  );
};

const PreinscriptionForm = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programMasters, setProgramMasters] = useState([]);
  const [username, setUsername] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0); // State for current slide index

  useEffect(() => {
    // Fetch program masters from the server
    const fetchProgramMasters = async () => {
      try {
        const response = await axios.get('http://localhost:8081/programMasters');
        setProgramMasters(response.data.programMasters);
      } catch (error) {
        console.error('Error fetching program masters:', error);
      }
    };

    fetchProgramMasters();
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleProgramClick = (program) => {
    setSelectedProgram(program);
  };

  const handleGoBack = () => {
    setSelectedProgram(null);
  };

  return (
    <Container className="mt-11">
      <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '20px', margin: '20px auto', height: '130vh', backgroundColor: '#F9fcff' }}>
        {selectedProgram ? (
          <MasterDetails
            program={selectedProgram}
            onClick={handleGoBack}
          />
        ) : (
          <>
            <h2 className="mb-4" style={{fontWeight:'bold',}}>Master Programs</h2>
            <Row>
              <div id="splide-container"> {/* Unique ID for SplideJS container */}
                <Splide
                  options={{ // SplideJS options
                    type: 'loop',
                    perPage: 3,
                    gap: '20px',
                    focus: 'center',
                  }}
                  onMoved={(splide, newIndex) => setCurrentSlide(newIndex)} // Update currentSlide state on slide change
                >
                  {programMasters.map((program, index) => (
                    <SplideSlide key={index}>
                      <MasterProgram
                        program={program}
                        onClick={handleProgramClick}
                        isCurrent={index === currentSlide} // Ensure isCurrent prop is passed
                      />
                    </SplideSlide>
                  ))}
                </Splide>
              </div>
            </Row>
          </>
        )}
      </div>
    </Container>
  );
};

export default PreinscriptionForm;
