import React from 'react';
import { InfoSection } from '../../';
import { Container } from '../../../globalStyles';
import faculte2 from '../../../images/faculte2.png';
import { homeObjTwo } from './Data'; // Import homeObjTwo data

function Products() {
  return (
    <>
      <style>
        {`
          body {
            margin: 0;
            padding: 0;
            min-height: 100vh;
            background-color: #101522;
          }
        `}
      </style>
      <Container>
        <div style={{ padding: '160px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
          <h1 style={{ color: '#fff', fontWeight: 'bold', marginBottom: '20px', marginTop: '0' }}>Welcome to ISSAT Sousse</h1>
          <div style={{ margin: 'auto', maxWidth: '80%' }}>
            <img src={faculte2} alt="" style={{ margin: 'auto', display: 'block', width: '100%', height: 'auto' }} />
          </div>
        </div>
      </Container>

      <InfoSection
        lightBg={true} // Set lightBg to true to maintain the background color of homeObjTwo
        {...homeObjTwo} // Spread the homeObjTwo data
      /> {/* Render homeObjTwo */}
    </>
  );
}

export default Products;
