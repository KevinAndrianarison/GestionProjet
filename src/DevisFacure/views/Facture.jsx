import { useState, useEffect } from 'react';
import ModalFactureIn from './ModalFactureIn';
import ModalEditFactureIn from './ModalEditFactureIn';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';
import { BASE_URL } from "../contextes/ApiUrls";
import axios from "axios";

const Facture = () => {
  const [factures, setFactures] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 4; // Nombre de factures par page
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [factureToEdit, setFactureToEdit] = useState(null);
  const [showActionsIdProsp, setShowActionsIdProsp] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchFactures = async () => {
      const tokenString = localStorage.getItem("token");
      let token = JSON.parse(tokenString);
      try {
        const response = await axios.get(`${BASE_URL}factures`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setFactures(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des factures :", error);
      }
    };
    fetchFactures();
  }, [refresh]);

  const addFacture = async (newFacture) => {
    const tokenString = localStorage.getItem("token");
    const token = JSON.parse(tokenString);

    try {
      const response = await axios.post(`${BASE_URL}factures`, newFacture, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setRefresh(!refresh);

      if (response.status === 200) {
        setFactures([...factures, response.data]);
        setIsModalOpen(false);
        // Swal.fire('Succès!', 'Facture ajoutée avec succès!', 'success');
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la facture :", error);
      Swal.fire("Erreur", "Impossible d'ajouter la facture.", "error");
    }
  };

  const updateFacture = async (updatedFacture) => {
    const tokenString = localStorage.getItem("token");
    const token = JSON.parse(tokenString);
    try {
      const response = await axios.put(`${BASE_URL}factures/${updatedFacture.id}`, updatedFacture, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setFactures(
          factures.map((facture) =>
            facture.id === updatedFacture.id ? response.data : facture
          )
        );
        setRefresh(!refresh);
        setIsEditModalOpen(false);
        Swal.fire('Succès!', 'Facture mise à jour avec succès!', 'success');
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la facture :", error);
    }
  };

  const handleDelete = async (factureId) => {
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
      const response = await axios.delete(`${BASE_URL}factures/${factureId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setFactures(factures.filter((facture) => facture.id !== factureId));
        Swal.fire('Supprimée!', 'La facture a été supprimée.', 'success');
        setRefresh(!refresh);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la facture :", error);
      Swal.fire('Erreur', "Une erreur est survenue lors de la suppression.", 'error');
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const openEditModal = (facture) => {
    setFactureToEdit(facture);
    setIsEditModalOpen(true);
    setShowActionsIdProsp(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setFactureToEdit(null);
  };

  const currentFactures = factures.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleNext = () => {
    if (page < Math.ceil(factures.length / itemsPerPage)) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const toggleActions = (id) => {
    setShowActionsIdProsp((prevId) => (prevId === id ? null : id));
  };


  return (
    <div>
      <div className="w-full mb-3 ">
        <button onClick={() => setFirstModalOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Nouveau Client
        </button>
      </div>

      <div className="flex flex-wrap align-center">
        <div className="w-full md:w-10/12 sm:w-10/12">
          <h1 className="text-sm" style={{ fontFamily: "Righteous" }}>Tous les factures</h1>
        </div>

        <div className="w-full md:w-2/12 sm:w-2/12 ml-auto">
          <div className="flex mb-4 m-auto">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className={`px-4 py-1 border rounded ${page === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600"}`}
            >
              Prev
            </button>
            <button
              onClick={handleNext}
              disabled={page >= Math.ceil(factures.length / itemsPerPage)}
              className={`px-4 py-1 border rounded ${page >= Math.ceil(factures.length / itemsPerPage) ? "text-gray-400 cursor-not-allowed" : "text-blue-600"}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="w-full border rounded-lg shadow-md overflow-auto h-[600px]">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left p-6 text-sm font-bold">Numéro</th>
              <th className="text-left p-6 text-sm font-bold">Prix total HT</th>
              <th className="text-left p-6 text-sm font-bold">TVA</th>
              <th className="text-left p-6 text-sm font-bold">Prix total TTC</th>
              <th className="text-left p-6 text-sm font-bold">Pièce jointe</th>
            </tr>
          </thead>
          <tbody>
            {currentFactures.map((facture) => (
              <tr key={facture.id}>
                <td className="border-y py-5 px-6">{facture.numero}</td>
                <td className="border-y py-5 px-6">{facture.montant_ht}</td>
                <td className="border-y py-5 px-6">{facture.prix_tva}</td>
                <td className="border-y py-5 px-6">{facture.montant_ttc}</td>
                <td className="border-y py-5 px-6">{facture.piece_jointe}</td>
                <td className="border-y py-5 px-6 w-[25px] relative">
                  <button
                    onClick={() => {
                      toggleActions(facture.id)
                    }}
                    className="rounded hover:text-red-500"
                  >
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </button>
                  {showActionsIdProsp === facture.id && (
                    <div className="absolute right-0 mt-2 bg-white shadow-lg rounded p-2 z-10">
                      <button
                        onClick={() => {
                          openEditModal(facture)
                        }}
                        className="text-blue-500 hover:text-blue-700 flex items-center mb-2"
                      >
                        <FontAwesomeIcon icon={faEdit} className="mr-2" />
                        Modifier
                      </button>

                      <button
                        onClick={() => {
                          handleDelete(facture.id)
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
        {factures.length === 0 && (
          <p className="text-gray-500"><i>Aucune facture disponible.</i></p>
        )}
      </div>

      <ModalFactureIn
        isOpen={isModalOpen}
        onClose={closeModal}
        addFacture={addFacture}
      />

      <ModalEditFactureIn
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        factureToEdit={factureToEdit}
        updateFacture={updateFacture}
      />

    </div>
  );
};

export default Facture;
