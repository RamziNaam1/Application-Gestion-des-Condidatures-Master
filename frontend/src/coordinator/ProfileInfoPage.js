import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { BiCamera } from 'react-icons/bi';
import adminphoto from '../images/adminphoto.png';
import { MdChangeCircle } from 'react-icons/md';

const ProfileInfoPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    department: '',
    role: '',
    biography: '',
    socialMediaLinks: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [uploadedImage, setUploadedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    // Check if admin information exists in localStorage
    const storedcordInfo = localStorage.getItem('cordInfo');
    if (storedcordInfo) {
      setFormData(JSON.parse(storedcordInfo));
    }

    // Check if admin image exists in localStorage
    const storedImageUrl = localStorage.getItem('cordImage');
    if (storedImageUrl) {
      setImageUrl(storedImageUrl);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setUploadedImage(file);

    const imageUrl = URL.createObjectURL(file);
    setImageUrl(imageUrl);
    localStorage.setItem('cordImage', imageUrl);
  };

  const handleGeneralInfoSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('fullName', formData.fullName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('phoneNumber', formData.phoneNumber);
    formDataToSend.append('department', formData.department);
    formDataToSend.append('role', formData.role);
    formDataToSend.append('biography', formData.biography);
    formDataToSend.append('image', uploadedImage);

    fetch('http://localhost:8081/cordinatorinfo', {
      method: 'POST',
      body: formDataToSend,
    })
      .then((response) => {
        if (response.ok) {
          console.log('General information saved successfully');
          localStorage.setItem('cordInfo', JSON.stringify(formData));
        } else {
          console.error('Failed to save general information');
        }
      })
      .catch((error) => {
        console.error('Error saving general information:', error);
      });
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleChangePassword = () => {
    console.log('Password change logic');
    closeModal();
  };

  return (
    <Container className="admin-profile-container">
      <h1 className="admin-profile-heading" style={{fontWeight:'bold',color:'#0077b6'}}>PROFILE</h1>
      <Row className="mb-3">
        <Col xs={12} md={6} className="d-flex justify-content-end">
          <Button className="change-password-button" onClick={openModal} style={{  marginBottom:'70px' ,marginTop: '-60px', marginRight: '-560px',backgroundColor:'#27374d' }}>
            <MdChangeCircle style={{ marginRight: '5px' }} />
            Change Password
          </Button>
        </Col>
      </Row>
      <Form>
        {/* Profile Photo Upload */}
        <Row className="mb-3">
          <Col xs={12} className="mb-3">
            <div className="d-flex align-items-center justify-content-end">
              {/* Container for the image */}
              <div
                style={{
                  width: '350px',
                  height: '400px',
                  borderRadius: '10%',
                  border: '2px solid #ced4da', // Added border
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Added box shadow
                  backgroundColor: '#e0e0e0', // Added background color
                  marginRight: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Image container */}
                <div
                  style={{
                    width: '250px',
                    height: '250px',
                    overflow: 'hidden',
                    position: 'relative',
                    borderRadius: '50%', // Added border radius
                  }}
                >
                  <label
                    htmlFor="upload-photo"
                    className="profile-photo-section d-flex align-items-center justify-content-center"
                    style={{
                      cursor: 'pointer',
                      width: '100%',
                      height: '100%',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={imageUrl || adminphoto}
                      alt="Profile"
                      style={{ width: '250px', height: '250px', objectFit: 'cover', borderRadius: '50%' }}
                      className="rounded-circle img-fluid"
                    />
                    <div
                      className="photo-icon"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        opacity: uploadedImage ? 0 : 1,
                        transition: 'opacity 0.2s ease-in-out',
                      }}
                    >
                      <BiCamera size={24} />
                    </div>
                  </label>
                </div>
              </div>
              {/* End of image container */}
              <div>
                {/* "Upload Photo" text */}
                <Form.Label className="mt-2" htmlFor="upload-photo" style={{ display: 'none' }}>
                  Upload Photo
                </Form.Label>
                <Form.Control
                  type="file"
                  id="upload-photo"
                  name="image"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </Col>
        </Row>




        {/* General Information Section */}
        <Row className="mb-3"style={{marginTop:'-470px'}}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">General Information</Form.Label>
            <Row>
              {/* Full Name */}
              <Col xs={6} className="mb-3">
                <Form.Group controlId="fullName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter full name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              {/* Email Address */}
              <Col xs={6} className="mb-3">
                <Form.Group controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              {/* Phone Number */}
              <Col xs={6} className="mb-3">
                <Form.Group controlId="phoneNumber">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter phone number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              {/* Department/Unit */}
              <Col xs={6} className="mb-3">
                <Form.Group controlId="department">
                  <Form.Label>Department/Unit</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter department/unit"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              {/* Role/Position */}
              <Col xs={6} className="mb-3">
                <Form.Group controlId="role">
                  <Form.Label>Role/Position</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter role/position"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              {/* Biography */}
              <Col xs={6} className="mb-3">
                <Form.Group controlId="biography">
                  <Form.Label>Biography</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter biography"
                    name="biography"
                    value={formData.biography}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form.Group>
        </Row>


        {/* Save General Info Button */}
        <Button
          type="submit"
          className="submit-button"
          style={{ width: '150px', display: 'block', margin: 'auto' ,backgroundColor:'#27374d'}}
          onClick={handleGeneralInfoSubmit}
        >
          Save Info
        </Button>
      </Form>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3" controlId="currentPassword">
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter current password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="newPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="confirmNewPassword">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleChangePassword}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProfileInfoPage;
