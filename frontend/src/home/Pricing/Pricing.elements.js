import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button } from '../../globalStyles'; 

export const PricingSection = styled.div`
  padding: 100px 0 160px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #4b59f7;
`;

export const PricingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  max-width: 1100px;
  padding: 0 50px;
`;

export const PricingHeading = styled.h1`
  color: #fff;
  font-size: 48px;
  margin-bottom: 24px;
`;

export const PricingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  &::-webkit-scrollbar { 
    display: none; /* Safari and Chrome */
  }

  @media screen and (max-width: 960px) {
    flex-direction: column;
    padding: 0 30px;
  }
`;

export const PricingCard = styled(Link)`
  background: #242424;
  box-shadow: 0 6px 20px rgba(56, 125, 255, 0.2);
  width: 280px;
  height: 500px;
  text-decoration: none;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
  margin: 0 10px;

  &:hover {
    transform: translateY(-10px);
  }

  @media screen and (max-width: 960px) {
    width: 100%;
    margin-bottom: 50px;
  }
`;

export const PricingCardInfo = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px;
  justify-content: space-between;
  align-items: center;
  color: #fff;
`;

export const PricingCardIcon = styled.div`
  margin-bottom: 24px;
`;

export const PricingCardPlan = styled.h3`
  margin-bottom: 5px;
  font-size: 24px;
  text-align: center;
`;

export const PricingCardFeatures = styled.ul`
  margin: 16px 0 32px;
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #a9b3c1;
  text-align: center;
`;

export const PricingCardFeature = styled.li`
  margin-bottom: 10px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1100px;
  padding: 0 50px;
  margin-top: 30px;

  @media screen and (max-width: 960px) {
    flex-direction: row;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    justify-content: center;
  }
`;

export const DiscoverButton = styled(Button)`
  background: #ffffff;
  color: #1c2237;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: #1c2237;
    color: #ffffff;
  }
  @media screen and (max-width: 960px) {
    margin-top: 0;
    margin-left: 10px;
  }
`;

export const NavButton = styled(Button)`
  background: #ffffff;
  color: #1c2237;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: #1c2237;
    color: #ffffff;
  }

  @media screen and (max-width: 960px) {
    margin-top: 20px;
  }
`;
