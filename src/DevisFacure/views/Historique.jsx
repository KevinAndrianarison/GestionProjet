import { useState, useEffect } from 'react';
import ModalFornisseur from './ModalFornisseur';
import ModalEditFornisseur from './ModalEditFornisseur';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';

const Historique = () => {
  const [fournisseurs, setFournisseurs] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 4; // Nombre de factures par page
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [fournisseurToEdit, setFournisseurToEdit] = useState(null);
  const [showActionsIdProsp, setShowActionsIdProsp] = useState(null);


  useEffect(() => {
    const storedFournisseurs = JSON.parse(localStorage.getItem('factures')) || [];
    setFournisseurs(storedFournisseurs);
  }, []);

  const addFournisseur = (newFournisseur) => {
    const uniqueId = new Date().getTime(); // Générer un ID unique basé sur le timestamp
    const updatedFournisseur = { ...newFournisseur, id: uniqueId };
    const updatedFournisseurs = [...fournisseurs, updatedFournisseur];
    setFournisseurs(updatedFournisseurs);
    localStorage.setItem('fournisseur', JSON.stringify(updatedFournisseurs));
  };
  

  const closeModal = () => setIsModalOpen(false);

  const openEditModal = (fournisseur) => {
    setFournisseurToEdit(fournisseur);
    setIsEditModalOpen(true);
    setShowActionsIdProsp(null);
  };

  useEffect(() => {
    if (isModalOpen) {
      setShowActionsIdProsp(null);
    }
  }, [isModalOpen]);

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setFournisseurToEdit(null);
  };

  const updateFacture = (updatedFacture) => {
    const updatedFournisseurs = fournisseurs.map((facture) =>
      facture.id === updatedFacture.id ? updatedFacture : facture
    );
    setFournisseurs(updatedFournisseurs);
    localStorage.setItem('fournisseur', JSON.stringify(updatedFournisseurs));
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
  
    if (confirmed.isConfirmed) {
      const updatedFournisseurs = fournisseurs.filter((fournisseur) => fournisseur.id !== fournisseurId);
      setFournisseurs(updatedFournisseurs);
      localStorage.setItem('fournisseurs', JSON.stringify(updatedFournisseurs));
      Swal.fire('Supprimé!', 'Le fournisseur a été supprimée.', 'success');
    }
  };
  

  
  const currentFournisseurs= fournisseurs.slice(
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
        <h1 className="text-2xl">Touts les fournisseurs</h1>
      </header>

      <div className="flex flex-wrap my-5">
          <div className="w-full md:w-10/12 sm:w-10/12">
            <div className="flex items-center space-x-2">
              <button
              onClick={() => setIsModalOpen(true)} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              >
              Nouveau fournisseur
              </button>
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
          <thead>
            <tr>
              <th className="text-left p-6 text-sm font-bold">Nom société</th>
              <th className="text-left p-6 text-sm font-bold">Nom</th>
              <th className="text-left p-6 text-sm font-bold">Email</th>
              <th className="text-left p-6 text-sm font-bold">Téléphone</th>
              <th className="text-left p-6 text-sm font-bold">Ville</th>
            </tr>
          </thead>
          <tbody>
            {currentFournisseurs.map((fournisseur) => (
              <tr key={fournisseur.id}>
                <td className="border-y py-5 px-6">{fournisseur.nom_societe}</td>
                <td className="border-y py-5 px-6">{fournisseur.nom}</td>
                <td className="border-y py-5 px-6">{fournisseur.email}</td>
                <td className="border-y py-5 px-6">{fournisseur.telephone}</td>
                <td className="border-y py-5 px-6">{fournisseur.ville}</td>
                <td className="border-y py-5 px-6 w-[25px] relative">
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

      <ModalFornisseur 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        addFournisseur={addFournisseur} 
      />

      <ModalEditFornisseur
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        fournisseurToEdit={fournisseurToEdit}
        updateFournisseur={updateFacture}
      />

    </div>
  );
};

export default Historique;
