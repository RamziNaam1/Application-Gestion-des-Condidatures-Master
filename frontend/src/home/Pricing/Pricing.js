import React, { useState } from 'react';
import { Button } from '../../globalStyles';
import { GiCog } from "react-icons/gi";
import { HiOutlineDesktopComputer, HiOutlineLightningBolt } from "react-icons/hi";
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
  DiscoverButton,
  NavButton
  
} from './Pricing.elements';

const Pricing = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cards = [
    {
      icon: <GiCog />,
      title: "Master of Mechanics",
      description: "Design, analysis, and manufacturing of mechanical systems"
    },
    {
      icon: <HiOutlineLightningBolt />,
      title: "Master of Electronics",
      description: "Design, analysis, and application of electronic circuits and systems"
    },
    {
      icon: <HiOutlineDesktopComputer />,
      title: "Master of Computer Science",
      description: "Theory and practice of computing, including Computer Science"
    },
    {
      icon: <GiCog />,
      title: "Program 1",
      description: "Description of Program 1"
    },
    {
      icon: <HiOutlineLightningBolt />,
      title: "Program 2",
      description: "Description of Program 2"
    },
    {
      icon: <HiOutlineDesktopComputer />,
      title: "Program 3",
      description: "Description of Program 3"
    },
    {
      icon: <GiCog />,
      title: "Program 4",
      description: "Description of Program 4"
    },
    {
      icon: <HiOutlineLightningBolt />,
      title: "Program 5",
      description: "Description of Program 5"
    },
    {
      icon: <HiOutlineDesktopComputer />,
      title: "Program 6",
      description: "Description of Program 6"
    }
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === cards.length - 1 ? 0 : prevIndex + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? cards.length - 1 : prevIndex - 1));
  };

  return (
    <IconContext.Provider value={{ color: '#a9b3c1', size: 64 }}>
      <PricingSection>
        <PricingWrapper>
          <PricingHeading>MASTER PROGRAMS</PricingHeading>
          <PricingContainer>
            {cards.map((card, index) => (
              <PricingCard key={index} to='/sign-up' style={{ display: index === currentIndex || index === currentIndex + 1 || index === currentIndex - 1 ? 'block' : 'none' }}>
                <PricingCardInfo>
                  <PricingCardIcon>
                    {card.icon}
                  </PricingCardIcon>
                  <PricingCardPlan>{card.title}</PricingCardPlan>
                  <PricingCardFeatures>
                    {card.description}
                  </PricingCardFeatures>
                  <Button primary>Choose Program</Button>
                </PricingCardInfo>
              </PricingCard>
            ))}
          </PricingContainer>
          <NavButton onClick={handlePrev}>&lt; Prev</NavButton>
          <DiscoverButton onClick={handleNext}>Next &gt;</DiscoverButton>
        </PricingWrapper>
      </PricingSection>
    </IconContext.Provider>
  );
}

export default Pricing;
