import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importer FontAwesomeIcon
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'; // Importer l'icône spécifique

function Service() {
  return (
    <div>
      <h1>
        <FontAwesomeIcon icon={faCirclePlus} /> Créer un service
      </h1>
    </div>
  );
}

export default Service;
