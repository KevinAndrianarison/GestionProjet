import { useState, useEffect } from 'react';
import ModalFornisseur from './ModalFornisseur';
import ModalEditFornisseur from './ModalEditFornisseur';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';
import { BASE_URL } from "../contextes/ApiUrls";
import axios from "axios";
const Fournisseurs = () => {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fournisseurToEdit, setFournisseurToEdit] = useState(null);
  const [showActionsIdProsp, setShowActionsIdProsp] = useState(null);
  const [refresh, setRefresh] = useState(false);


  useEffect(() => {
    const fetchFournisseurs = async () => {
      const tokenString = localStorage.getItem("token");
      let token = JSON.parse(tokenString);
      try {
        const response = await axios.get(`${BASE_URL}fournisseurs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setFournisseurs(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des fournisseurs :", error);
      }
    };
    fetchFournisseurs();
  }, [refresh]);

  const addFournisseur = async (newFournisseur) => {

    const tokenString = localStorage.getItem("token");
    const token = JSON.parse(tokenString);

    try {
      const response = await axios.post(`${BASE_URL}fournisseurs`, newFournisseur, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setRefresh(!refresh);

      if (response.status === 200) {
        setFournisseurs([...fournisseurs, response.data]);
        setIsModalOpen(false);
        Swal.fire('Succès!', 'Fournisseur ajouté avec succès!', 'success');
      }

    } catch (error) {
      console.error("Erreur lors de l'ajout du fournisseur :", error);
      Swal.fire("Erreur", "Impossible d'ajouter le fournisseur.", "error");
    }
  };

  const updateFournisseur = async (updatedFournisseur) => {
    const tokenString = localStorage.getItem("token");
    const token = JSON.parse(tokenString);
    try {
      const response = await axios.put(`${BASE_URL}fournisseurs/${updatedFournisseur.id}`, updatedFournisseur, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setFournisseurs(
          fournisseurs.map((fournisseur) =>
            fournisseur.id === updatedFournisseur.id ? response.data : fournisseur
          )
        );
        setRefresh(!refresh);
        setIsEditModalOpen(false);
        Swal.fire('Succès!', 'Fournisseur mis à jour avec succès!', 'success');
      }

    } catch (error) {
      console.error("Erreur lors de la mise à jour du fournisseur :", error);
    }
  };

  const handleDelete = async (fournisseurId) => {
    const confirmed = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    });

    if (!confirmed.isConfirmed) {
      return;
    }

    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    try {
      const response = await axios.delete(`${BASE_URL}fournisseurs/${fournisseurId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setFournisseurs(fournisseurs.filter((fournisseur) => fournisseur.id !== fournisseurId));
        Swal.fire('Supprimé!', 'Le fournisseur a été supprimé.', 'success');
        setRefresh(!refresh);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du fournisseur :", error);
      Swal.fire('Erreur', "Une erreur est survenue lors de la suppression.", 'error');
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const openEditModal = (fournisseur) => {
    setFournisseurToEdit(fournisseur);
    setIsEditModalOpen(true);
    setShowActionsIdProsp(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setFournisseurToEdit(null);
  };

  const currentFournisseurs = fournisseurs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleNext = () => {
    if (page < Math.ceil(fournisseurs.length / itemsPerPage)) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const toggleActions = (id) => {
    setShowActionsIdProsp((prevId) => (prevId === id ? null : id));
  };

  return (
    <div>
      <header>
        
        <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Nouveau fournisseur
            </button>
        </header>
      <div className="flex flex-wrap my-4">
        <div className="w-full md:w-10/12 sm:w-10/12">
          <div className="flex items-center space-x-2">
          <h1 className="text-sm" style={{ fontFamily: "Righteous" }}>Tous les fournisseurs</h1>

          </div>
        </div>
        <div className="w-full md:w-2/12 sm:w-2/12 ml-auto">
          <div className="flex m-auto space-x-3">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className={`px-4 py-1 border rounded ${page === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600"}`}
            >
              Prev
            </button>
            <button
              onClick={handleNext}
              disabled={page >= Math.ceil(fournisseurs.length / itemsPerPage)}
              className={`px-4 py-1 border rounded ${page >= Math.ceil(fournisseurs.length / itemsPerPage) ? "text-gray-400 cursor-not-allowed" : "text-blue-600"}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <div className="w-full border rounded-lg shadow-md overflow-auto h-[600px]">
        <table className="min-w-full">
          <thead className='bg-slate-100'>
            <tr>
              <th className="text-left py-2 px-4 text-xs font-bold">Type</th>
              <th className="text-left py-2 px-4 text-xs font-bold">Nom société</th>
              <th className="text-left py-2 px-4 text-xs font-bold">Nom responsable</th>
              <th className="text-left py-2 px-4 text-xs font-bold">Email</th>
              <th className="text-left py-2 px-4 text-xs font-bold">Téléphone</th>
              <th className="text-left py-2 px-4 text-xs font-bold">Ville</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentFournisseurs.map((fournisseur) => (
              <tr key={fournisseur.id}>
                <td className="border-y py-2 px-4">{fournisseur.type}</td>
                <td className="border-y py-2 px-4">{fournisseur.nom_societe}</td>
                <td className="border-y py-2 px-4">{fournisseur.nom}</td>
                <td className="border-y py-2 px-4">{fournisseur.email}</td>
                <td className="border-y py-2 px-4">{fournisseur.telephone}</td>
                <td className="border-y py-2 px-4">{fournisseur.ville}</td>
                <td className="border-y py-2 px-4 w-[25px] relative">
                  <button
                    onClick={() => {
                      toggleActions(fournisseur.id)
                    }}
                    className="rounded hover:text-red-500"
                  >
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </button>
                  {showActionsIdProsp === fournisseur.id && (
                    <div className="absolute right-0 mt-2 bg-white shadow-lg rounded p-2 z-10">
                      <button
                        onClick={() => {
                          openEditModal(fournisseur)
                        }}
                        className="text-blue-500 hover:text-blue-700 flex items-center mb-2"
                      >
                        <FontAwesomeIcon icon={faEdit} className="mr-2" />
                        Modifier
                      </button>

                      <button
                        onClick={() => {
                          handleDelete(fournisseur.id)
                        }}
                        className="text-red-500 hover:text-red-700 flex items-center"
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-2" />
                        Effacer
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {fournisseurs.length === 0 && (
          <p className="text-gray-500"><i>Aucune facture disponible.</i></p>
        )}
      </div>
      {/* Contenu et Table */}
      <ModalFornisseur isOpen={isModalOpen} onClose={closeModal} addFournisseur={addFournisseur} />
      <ModalEditFornisseur
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        fournisseurToEdit={fournisseurToEdit}
        updateFournisseur={updateFournisseur}
      />
    </div>
  );
};

export default Fournisseurs;
