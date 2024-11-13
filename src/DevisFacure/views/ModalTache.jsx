import { useState, useEffect } from 'react';

const ModalTache = ({ isOpen, onClose }) => {
  const [itemName, setItemName] = useState('');
  const [items, setItems] = useState([]);

  // Charger les éléments du localStorage au chargement du modal
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];
    setItems(storedItems);
  }, [isOpen]);

  // Ajouter un nouvel élément au localStorage et à la liste
  const handleAddItem = () => {
    const updatedItems = [...items, itemName];
    setItems(updatedItems);
    localStorage.setItem('items', JSON.stringify(updatedItems));
    setItemName(''); // Réinitialiser le champ
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
      onClick={handleClickOutside}     id="modal-background">
      <div className="bg-white w-3/4 md:w-1/2 lg:w-1/3 p-5 rounded-lg shadow-lg flex">
        <div className="w-1/2 border-r pr-4">
          <h2 className="text-xl font-semibold mb-4">Liste des éléments</h2>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index} className="p-2 bg-gray-100 rounded">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-1/2 pl-4">
          <h2 className="text-xl font-semibold mb-4">Ajouter un élément</h2>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Nom de l'élément"
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            onClick={handleAddItem}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Enregistrer
          </button>
        </div>
        <div className="flex items-center">
        <button onClick={onClose} className="text-red-500 text-right text-4xl ml-auto">
          &times;
        </button>
        </div>
      </div>


    </div>
  );
};

export default ModalTache;
