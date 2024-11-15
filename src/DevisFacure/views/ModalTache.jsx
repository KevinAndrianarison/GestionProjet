import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

const ModalTache = ({ isOpen, onClose }) => {
  const [nom_tache, setNomTache] = useState('');
  const [editTache, setEditTache] = useState('');
  const [items, setItems] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('taches')) || [];
    setItems(storedItems);
  }, [isOpen]);

  const handleAddItem = () => {
    const updatedItems = [...items, nom_tache];
    setItems(updatedItems);
    localStorage.setItem('taches', JSON.stringify(updatedItems));
    setNomTache(''); 
    Swal.fire({
      title: 'Succès!',
      text: 'Ajout de tâche avec succès!',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  };

  const handleEditItem = (index) => {
    setEditIndex(index);
    setEditTache(items[index]);
  };

  const handleSaveEdit = () => {
    const updatedItems = [...items];
    updatedItems[editIndex] = editTache;
    setItems(updatedItems);
    localStorage.setItem('taches', JSON.stringify(updatedItems));
    setEditIndex(null);
    setEditTache('');
  }

  const handleDeleteItem = async (index) => {
    const confirmed = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      reverseButtons: true,
    });

    if (!confirmed.isConfirmed) {
      return;
    }
  
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    localStorage.setItem('taches', JSON.stringify(updatedItems));

    Swal.fire('Supprimé!', 'La tâche a été supprimée.', 'success');
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
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 text-3xl mr-3"
        >
          &times;
        </button>

        <div className="flex">
          <div className="w-1/2 border-r pr-4 py-2">
            <h2 className="text-xl mb-4">Liste des tâches</h2>
            <ul className="text-sm overflow-y-auto max-h-[35vh]">
              {items.map((item, index) => (
                <li
                  key={index}
                  className="grid grid-cols-12 items-center p-2"
                >
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={editTache} 
                      onChange={(e) => setEditTache(e.target.value)}
                      onBlur={handleSaveEdit}
                      autoFocus
                      className="col-span-11"
                    />
                  ) : (
                    <span
                      className="col-span-11 truncate cursor-pointer"
                      onClick={() => handleEditItem(index)}
                    >
                      {item}
                    </span>
                  )}

                  <button
                    onClick={() => handleDeleteItem(index)}
                    className="w-2 col-span-1 text-right text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-1/2 pl-4 items-center">
            <h2 className="text-xl mb-4">Nouvelle tâche</h2>
            <div className="flex flex-col justify-center items-center h-4/5">
              <input
                type="text"
                value={nom_tache}
                onChange={(e) => setNomTache(e.target.value)}
                placeholder="Nom de la tâche"
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
    </div>
  );
};
// Validation des props avec prop-types
ModalTache.propTypes = {
  isOpen: PropTypes.bool.isRequired, // La prop isOpen doit être un booléen et est requise
  onClose: PropTypes.func.isRequired, // La prop onClose doit être une fonction et est requise
  children: PropTypes.node, // La prop children peut être n'importe quel élément React
};
export default ModalTache;
