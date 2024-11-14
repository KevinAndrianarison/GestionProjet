import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
const ModalTache = ({ isOpen, onClose }) => {
  const [nom_tache, setNomTache] = useState('');
  const [items, setItems] = useState([]);

  // Charger les éléments du localStorage au chargement du modal
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('taches')) || [];
    setItems(storedItems);
  }, [isOpen]);

  // Ajouter un nouvel élément au localStorage et à la liste
  const handleAddItem = () => {
    const updatedItems = [...items, nom_tache];
    setItems(updatedItems);
    localStorage.setItem('taches', JSON.stringify(updatedItems));
    setNomTache(''); // Réinitialiser le champ
  };

  // Supprimer un élément de la liste et du localStorage
  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    localStorage.setItem('taches', JSON.stringify(updatedItems));
  };

  const handleClickOutside = (e) => {
    if (e.target.id === 'modal-background') {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center ${
        isOpen ? 'block' : 'hidden'
      }`}
      onClick={handleClickOutside}
      id="modal-background"
    >
      <div className="bg-white w-3/4 md:w-2/3 lg:w-1/2 p-8 rounded-lg shadow-lg relative">
        {/* Bouton de fermeture dans le coin supérieur droit */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 text-3xl"
        >
          &times;
        </button>

        {/* Contenu du modal */}
        <div className="flex">
        <div className="w-1/2 border-r pr-4 py-2">
  <h2 className="text-xl mb-4">Liste des tâches</h2>
  <ul className="text-sm overflow-y-auto max-h-[35vh]">
    {items.map((item, index) => (
      <li
        key={index}
        className="grid grid-cols-12 items-center p-2"
      >
        {/* Nom de la tâche */}
        <span className="col-span-11 truncate">{item}</span>

        {/* Bouton avec icône */}
        <button
          onClick={() => handleDeleteItem(index)}
          className="w-2 col-span-1 text-right text-red-500 hover:text-red-700"
        >
          <FontAwesomeIcon icon={faTrash} className="mr-2"/>
        </button>
      </li>
    ))}
  </ul>
</div>
          <div className="w-1/2 pl-4  items-center">
            <h2 className="text-xl mb-4">Nouvelle tâche</h2>
            <input
              type="text"
              value={nom_tache}
              onChange={(e) => setNomTache(e.target.value)}
              placeholder="Nom de l'élément"
              className="w-full p-3 border border-gray-300 rounded mb-4 text-sm"
            />
            <button
              onClick={handleAddItem}
              className="w-full bg-blue-500 text-white p-3 rounded text-sm hover:bg-blue-600"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalTache;
