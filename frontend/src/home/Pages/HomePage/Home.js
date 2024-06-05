import React from 'react';
import { InfoSection, Pricing } from '../../';
import { homeObjOne, homeObjThree, homeObjTwo, homeObjFour } from './Data';

const Home = () => {
    return (
        <>
            <InfoSection {...homeObjOne} />
            <InfoSection {...homeObjThree} />
            <InfoSection {...homeObjTwo} />
            <Pricing />
            <InfoSection
                topLine={homeObjFour.topLine}
                description={homeObjFour.description.map(section => (
                    <p style={section.style}>{section.text}</p>
                ))}
                imgStart={homeObjFour.imgStart}
                img={homeObjFour.img}
                alt={homeObjFour.alt}
                buttonLabel={homeObjFour.buttonLabel}
            />
        </>
    );
}

export default Home;
