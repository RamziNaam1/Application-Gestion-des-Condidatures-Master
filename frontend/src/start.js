import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { PiChalkboardTeacherFill  } from "react-icons/pi";
import { RiAdminFill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import backgroundadmin from './images/backgroundadmin.jpg';



const Start = () => {
    const styles = {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${backgroundadmin})`,
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
      };
    return (
        <div style={styles}>
            
            
            
            <Container>
                <Row className="justify-content-center align-items-center h-100">
                    
                    {/* Admin Box */}
                    <Col md={4} className="text-center mb-4">
                        <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', height: '450px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <h3 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold', marginBottom: '20px' }}>Admin</h3>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <RiAdminFill size={120} color="#000" style={{ marginBottom: '20px', alignSelf: 'center' }} />
                            </div>
                            <Link to="/AdminLogin" style={{ textDecoration: 'none' }}>
                                <Button variant="primary" style={{ marginTop: 'auto', width: '100%' }}>Start</Button>
                            </Link>
                        </div>
                    </Col>
                    
                    {/* Teacher Box */}
                    <Col md={4} className="text-center mb-4">
                        <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', height: '450px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <h3 style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold', marginBottom: '20px' }}>Teacher</h3>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <PiChalkboardTeacherFill size={120} color="#000" style={{ marginBottom: '20px', alignSelf: 'center' }} />
                            </div>
                            <Link to="/CoordinatorLogin" style={{ textDecoration: 'none' }}>
                                <Button variant="primary" style={{ marginTop: 'auto', width: '100%' }}>Start</Button>
                            </Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Start;
