import React, { useState } from 'react';
import styled from 'styled-components';



const mainFont = 'Arial, sans-serif';
const titleFont = 'Georgia, serif';
const contentFont = 'Verdana, sans-serif';

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-family: ${titleFont};
  font-weight:bald;
`;

const GuideContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  margin-left:50px;
  margin-right:50px;
  margin-top:50px

`;
const EtapeContainer = styled.div`
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-family: ${mainFont};
`;
const EtapeHeader = styled.div`
  background-color: #27374d; /* Nouvelle couleur */
  color: white; /* Couleur du texte en blanc pour contraste */
  padding: 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  font-family: ${contentFont}; 
`;


const EtapeContent = styled.div`
  padding: 10px;
`;
// Sous-composant pour chaque étape
const Etape = ({ titre, contenu, isOpen, toggleEtape }) => {
  return (
    <EtapeContainer>
      <EtapeHeader onClick={toggleEtape} style={{ cursor: 'pointer' }}>
        <h3>{titre}</h3>
      </EtapeHeader>
      {isOpen && (<EtapeContent>{contenu}</EtapeContent>)}
    </EtapeContainer>
  );
};

// Composant principal pour le guide de préinscription en mastère
const Demandes = () => {
  const [etapes, setEtapes] = useState([
    { titre: 'Etape 1: Découvrir les programmes de master', contenu: 'Explorez les différents programmes de master disponibles sur notre plateforme.', isOpen: true },
    { titre: 'Etape 2: Choisir un programme de master', contenu: 'Sélectionnez le programme de master qui correspond le mieux à vos intérêts et objectifs.', isOpen: true},
    { titre: 'Etape 3: Remplir le formulaire de demande', contenu: 'Complétez le formulaire de demande de préinscription en fournissant toutes les informations requises.',isOpen: true },
    { titre: 'Etape 4: Suivre votre demande', contenu: 'Vous pouvez consulter vos demandes (Voir tableau des demandes déposées dans le STATUS).', isOpen: true},
  ]);

  // Fonction pour basculer l'état d'une étape (ouverte/fermée)
  const toggleEtape = (index) => {
    const newEtapes = [...etapes];
    newEtapes[index].isOpen = !newEtapes[index].isOpen;
    setEtapes(newEtapes);
  };

  return (
    <GuideContainer>
      <Title style={{fontWeight:'bold'}}>Comment déposer une demande en mastère?</Title>

      {etapes.map((etape, index) => (
        <Etape
          key={index}
          titre={etape.titre}
          contenu={etape.contenu}
          isOpen={etape.isOpen}
          toggleEtape={() => toggleEtape(index)}
        />
      ))}
    </GuideContainer>
  );
};

export default Demandes;
