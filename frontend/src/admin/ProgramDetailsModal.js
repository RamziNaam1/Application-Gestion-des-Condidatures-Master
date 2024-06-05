import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaBook, FaClock, FaUniversity, FaPhone } from 'react-icons/fa';

const ProgramDetailsModal = ({ programMaster, isOpen, onClose }) => {
  if (!programMaster) return null;

  return (
    <Modal size="lg" show={isOpen} onHide={onClose} >
      <Modal.Header closeButton>
        <Modal.Title>Program Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container-xl">
          <div className="card shadow-sm p-3 mb-5 bg-white rounded" style={{ height: 'auto', transition: '0.3s' }}>
            <div className="card-body" style={{ backgroundColor: '#e9ecef' }}>
              <h5 className="card-title" style={{ display: 'flex', alignItems: 'center', color: '#27374d', fontSize: '20px' }}>
                <FaBook style={{ marginRight: '10px', color: '#27374d', fontSize: '24px' }} />
                {programMaster.title}
              </h5>
              <hr style={{ backgroundColor: '#007bff' }} />
              <div className="row">
                <div className="col-md-6">
                  <p><FaUniversity style={{ marginRight: '5px' }} /> <span style={{ marginLeft: '5px', color: '#333', fontSize: '16px' }}>{programMaster.details}</span></p>
                  <div className="bg-light p-3 rounded mb-4" style={{ backgroundColor: '#e9ecef' ,width:'600px',marginLeft:'40px'}}>
                    <h6 className="text-muted" style={{ fontSize: '16px' }}>Objectifs</h6>
                    <p style={{ fontSize: '16px' }}>{programMaster.objectifs}</p>
                  </div>
                  <div className="bg-light p-3 rounded mb-4" style={{ backgroundColor: '#e9ecef' ,width:'600px',marginLeft:'40px'}}>
                    <h6 className="text-muted" style={{ fontSize: '16px' }}>Structure</h6>
                    <p style={{ fontSize: '16px' }}>{programMaster.structure}</p>
                  </div>
                  <div className="bg-light p-3 rounded mb-4" style={{ backgroundColor: '#e9ecef' ,width:'600px',marginLeft:'40px'}}>
                    <h6 className="text-muted" style={{ fontSize: '16px' }}>Cours obligatoires</h6>
                    <p style={{ fontSize: '16px' }}>{programMaster.cours_obligatoires}</p>
                  </div>
                  <div className="bg-light p-3 rounded mb-4" style={{ backgroundColor: '#e9ecef',width:'600px',marginLeft:'40px' }}>
                    <h6 className="text-muted" style={{ fontSize: '16px' }}>Cours optionnels</h6>
                    <p style={{ fontSize: '16px' }}>{programMaster.cours_optionnels}</p>
                  </div>
                  <div className="bg-light p-3 rounded mb-4" style={{ backgroundColor: '#e9ecef' ,width:'600px',marginLeft:'40px'}}>
                    <h6 className="text-muted" style={{ fontSize: '16px' }}>Admission</h6>
                    <p style={{ fontSize: '16px' }}>{programMaster.admission}</p>
                  </div>
                </div>
                <div className="col-md-4" style={{ marginLeft: '150px' }}>
                  <div className="mt-5 p-3 rounded" style={{ backgroundColor: '#27374d' ,width:'600px',marginLeft:'-100px'}}>
                    <h6 className="text" style={{ color: '#e9ecef', fontSize: '16px' }}>
                      <FaClock style={{ color: '#e9ecef', marginRight: '5px' }} /> Duration
                    </h6>
                    <p style={{ color: '#e9ecef', fontSize: '16px' }}>{programMaster.duree}</p>
                  </div>
                  <div className="mt-4 p-3 rounded" style={{ backgroundColor: '#27374d',width:'600px',marginLeft:'-100px' }}>
                    <h6 className="text" style={{ color: '#e9ecef', fontSize: '16px' }}>
                      <FaPhone style={{ color: '#e9ecef', marginRight: '5px' }} /> Contact
                    </h6>
                    <p style={{ color: '#e9ecef', fontSize: '16px' }}>{programMaster.contact}</p>
                  </div>
                </div>
              </div>
              {programMaster.image && (
                <img
                  src={programMaster.image}
                  alt="Program"
                  style={{ maxWidth: '100%', marginTop: '20px' }}
                />
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProgramDetailsModal;
