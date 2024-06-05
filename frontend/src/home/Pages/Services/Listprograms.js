import React from 'react';
import { Button } from '../../globalStyles';
import { GiCog } from "react-icons/gi";
import { HiOutlineDesktopComputer ,HiOutlineLightningBolt} from "react-icons/hi";


import { IconContext } from 'react-icons/lib';
import {
  PricingSection,
  PricingWrapper,
  PricingHeading,
  PricingContainer,
  PricingCard,
  PricingCardInfo,
  PricingCardIcon,
  PricingCardPlan,
  PricingCardFeatures,
  DiscoverButton
} from '/Listprogram.elements';

 const Listprograms = () => {
  return (
    <IconContext.Provider value={{ color: '#a9b3c1', size: 64 }}>
      <PricingSection>
        <PricingWrapper>
          <PricingHeading>MASTER PROGRAMS</PricingHeading>
          <PricingContainer>
            <PricingCard to='/sign-up'>
              <PricingCardInfo>
                <PricingCardIcon>
                  <GiCog />
                </PricingCardIcon>
                <PricingCardPlan>Master of Mechanics</PricingCardPlan>
                <PricingCardFeatures>
                  Design, analysis, and manufacturing of mechanical systems
                </PricingCardFeatures>
                <Button primary>Choose Program</Button>
              </PricingCardInfo>
            </PricingCard>
            <PricingCard to='/sign-up'>
              <PricingCardInfo>
                <PricingCardIcon>
                  <HiOutlineLightningBolt />
                </PricingCardIcon>
                <PricingCardPlan>Master of Electronics</PricingCardPlan>
                <PricingCardFeatures>
                Design, analysis, and application of electronic circuits and systems
                </PricingCardFeatures>
                <Button primary>Choose Program</Button>
              </PricingCardInfo>
            </PricingCard>
            <PricingCard to='/sign-up'>
              <PricingCardInfo>
                <PricingCardIcon>
                  <HiOutlineDesktopComputer />
                </PricingCardIcon>
                <PricingCardPlan>Master of Computer Science</PricingCardPlan>
                <PricingCardFeatures>
                Theory and practice of computing, including Computer Science
                </PricingCardFeatures>
                <Button primary>Choose Program</Button>
              </PricingCardInfo>
            </PricingCard>
          </PricingContainer>
          <DiscoverButton>Discover Programs</DiscoverButton>
        </PricingWrapper>
      </PricingSection>
    </IconContext.Provider>
  );
}

export default Listprograms;
