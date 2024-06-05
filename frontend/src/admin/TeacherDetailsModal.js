// TeacherDetailsModal.js

import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const TeacherDetailsModal = ({ teacher, isOpen, onClose }) => {
  return (
    <Modal  size='lg' show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton style={{ backgroundColor: '#27374d', color: '#dde6ed' }}>
        <Modal.Title style={{color:'#fff'}}>Teacher Details</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: '#f0f0f0' }}>
        {teacher ? (
          <div className="teacher-details">
            <h6 style={{fontWeight:'bold'}}> Informations Personnelles</h6>
            <div className="detail-item">
              <span className="detail-label">Name:</span> {teacher.name}
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span> {teacher.email}
            </div>
            <div className="detail-item">
              <span className="detail-label">CIN:</span> {teacher.cin}
            </div>
            <div className="detail-item">
              <span className="detail-label">Contact:</span> {teacher.contact}
            </div>
            <div className="detail-item">
              <span className="detail-label">Address:</span> {teacher.address}
            </div>
            <div className="detail-item">
              <span className="detail-label">Date of Birth:</span> {teacher.dob}
            </div>
            <div className="detail-item">
              <span className="detail-label">Gender:</span> {teacher.gender}
            </div>
            <div className="detail-item">
              <span className="detail-label">Program:</span> {teacher.program}
            </div>
            <div className="detail-item">
              <span className="detail-label">Expertise:</span> {teacher.expertise}
            </div>
            <h6 style={{fontWeight:'bold'}}> Détails du Compte</h6>

            <div className="detail-item">
              <span className="detail-label">Login Email:</span> {teacher.login_email}
            </div>
            <div className="detail-item">
              <span className="detail-label">Login Password:</span> {teacher.login_password}
            </div>
          </div>
        ) : (
          <p>No details available</p>
        )}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: '#27374d', color: '#dde6ed' }}>
        <Button variant="secondary" onClick={onClose} style={{ backgroundColor: '#dde6ed', color: '#27374d', border: 'none' }}>
          Close
        </Button>
      </Modal.Footer>
      <style jsx>{`
        .teacher-details {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          background-color: #ffffff;
          border-radius: 5px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .detail-label {
          font-weight: bold;
          color: #27374d;
        }
        .modal-title {
          font-weight: 700;
        }
      `}</style>
    </Modal>
  );
};

export default TeacherDetailsModal;
