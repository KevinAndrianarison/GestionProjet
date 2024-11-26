import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import { BASE_URL } from "../contextes/ApiUrls";
import axios from "axios";

const ModalTache = ({ isOpen, onClose, selectedServiceId }) => {
  const [nom_tache, setNomTache] = useState('');
  const [editTache, setEditTache] = useState(null);
  const [taches, setTaches] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const fetchTaches = async () => {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);

    try {
      const response = await axios.get(`${BASE_URL}services/detail-services/${selectedServiceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setTaches(response.data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  };

  useEffect(() => {
    if (selectedServiceId) {
      fetchTaches();
    }
  }, [selectedServiceId]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    const tokenString = localStorage.getItem("token");
    const token = JSON.parse(tokenString);

    const formData = {
      designation: nom_tache,
      description: "",
      gest_fact_service_id: selectedServiceId,
    };

    try {
      await axios.post(`${BASE_URL}services/detail-services`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(formData);
      fetchTaches();
      setNomTache('');
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche :", error);
    }
  };

  // Modifier une tâche
  const handleEditTask = async () => {
    if (!editTache || !editTache.id) {
      console.error("L'ID de la tâche est manquant !");
      return;
    }

    const tokenString = localStorage.getItem("token");
    const token = JSON.parse(tokenString);

    try {
      await axios.put(`${BASE_URL}services/detail-services/${editTache.id}`, editTache, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTaches((prev) =>
        prev.map((tache) =>
          tache.id === editTache.id ? { ...tache, designation: editTache.designation } : tache
        )
      );
      console.log(editTache);
      setEditIndex(null);
      setEditTache(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche :", error);
    }
  };

  // Supprimer une tâche
  const handleDeleteTask = async (taskId) => {
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

    const tokenString = localStorage.getItem("token");
    const token = JSON.parse(tokenString);
    try {
      await axios.delete(`${BASE_URL}services/detail-services/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTaches((prev) => prev.filter((tache) => tache.id !== taskId));
      Swal.fire('Supprimé!', 'La tâche a été supprimée.', 'success');
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche :", error);
    }
  };

  const handleClickOutside = (e) => {
    if (e.target.id === 'modal-background') {
      onClose();
    }
  };
  console.log(taches);
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
              {taches.map((tache) => (
                <li key={tache.id} className="grid grid-cols-12 items-center p-2">
                  {editIndex === tache.id ? (
                    <input
                      type="text"
                      value={editTache?.designation || ""}
                      onChange={(e) =>
                        setEditTache((prev) => ({ ...prev, designation: e.target.value }))
                      }
                      onBlur={handleEditTask}
                      autoFocus
                      className="col-span-11"
                    />
                  ) : (
                    <span
                      className="col-span-11 truncate cursor-pointer"
                      onClick={() => {
                        setEditTache(tache);
                        setEditIndex(tache.id);
                      }}
                    >
                      {tache.designation}
                    </span>
                  )}

                  <button
                    onClick={() => handleDeleteTask(tache.id)}
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
                onClick={handleAddTask}
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

ModalTache.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedServiceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default ModalTache;
