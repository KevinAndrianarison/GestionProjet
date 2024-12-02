import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faEllipsisV, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';
import { BASE_URL } from "../contextes/ApiUrls";
import axios from "axios";
import Select from 'react-select';
import { monthOptions, yearOptions } from './MoisAnneeSelect'
import Modal from './Modal';
import Notiflix from 'notiflix';

const Facture = () => {
  const [factures, setFactures] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;
  const [showActionsIdProsp, setShowActionsIdProsp] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const [numero, setNumero] = useState('');
  const [montant_ht, setMontantHT] = useState('');
  const [montant_ttc, setMontantTTC] = useState('');
  const [prix_tva, setPrixTVA] = useState('');
  const [pourcentage_tva, setPourcentageTVA] = useState('');
  const [date_facturation, setDateFacturation] = useState('');
  const [date_enregistrement, setDateEnregistrement] = useState('');
  const [type_assigner, setTypeAssigner] = useState('');
  const [validation, setValidation] = useState('');
  const [piece_jointe, setPieceJointe] = useState('');
  const [devise, setDevise] = useState('');
  const [errorMessage, setErrorMessage] = useState("");

  const resetFactureFields = () => {
    setNumero('');
    setMontantHT('');
    setMontantTTC('');
    setPrixTVA('');
    setPourcentageTVA('');
    setDateFacturation('');
    setDateEnregistrement('');
    setTypeAssigner('');
    setValidation('');
    setPieceJointe('');
  };

  const handleAddFacture = () => {
    setErrorMessage('');

    const newFacture = {
      numero,
      montant_ht,
      montant_ttc,
      prix_tva,
      pourcentage_tva,
      date_facturation,
      date_enregistrement,
      type_assigner,
      devise,
      piece_jointe
    };
    addFacture(newFacture);
    resetFactureFields();
    handleCloseModal();
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const fetchFactures = async () => {
      const tokenString = localStorage.getItem("token");
      let token = JSON.parse(tokenString);
      try {
        const response = await axios.get(`${BASE_URL}factures/entrants`, {
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
        Notiflix.Notify.failure("Erreur lors de la récupération des données:");
      }
    };
    fetchFactures();
  }, [refresh]);

  const addFacture = async (newFacture) => {
    const tokenString = localStorage.getItem("token");
    const token = JSON.parse(tokenString);

    try {
      const response = await axios.post(`${BASE_URL}factures/entrants`, newFacture, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setRefresh(!refresh);

      if (response.status === 200) {
        setFactures([...factures, response.data]);
        setModalOpen(false);
      }
      Notiflix.Notify.success("Fournisseur ajouté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la facture :", error);
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
      const response = await axios.delete(`${BASE_URL}factures/entrants/${factureId}`, {
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

  

  const closeModal = () => setModalOpen(false);

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
        <button onClick={handleOpenModal}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Nouvelle facture
        </button>
      </div>

      <div className="flex flex-wrap justify-between items-center p-1">
        <div className="flex w-full md:w-auto justify-between">
          <h1 className="text-sm" style={{ fontFamily: "Righteous" }}>Tous les factures</h1>
        </div>

        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className='flex flex-col items-start'>
            <h3>Choisir un mois :</h3>
            <Select
              options={monthOptions}
              isMulti
              name="colors"
              className="basic-multi-select text-xs"
              classNamePrefix="select"
            />
          </div>
          <div className='flex flex-col items-start'>
            <h3>Choisir une année :</h3>
            <Select options={yearOptions} className="text-xs " />
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="h-4 mt-3 text-blue-600"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center p-2">
        <div className="">
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

        <div className="flex justify-end p-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Télécharger
          </button>
        </div>
      </div>


      <div className="w-full border rounded-lg shadow-md overflow-auto h-[600px]">
        <table className="min-w-full">
          <thead className='bg-slate-100'>
            <tr>
              <th className="text-left p-2 font-bold">Numéro</th>
              <th className="text-left p-2 font-bold">Prix total HT</th>
              <th className="text-left p-2 font-bold">TVA</th>
              <th className="text-left p-2 font-bold">Prix total TTC</th>
              <th className="text-left p-2 font-bold">Pièce jointe</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentFactures.map((facture) => (
              <tr key={facture.id}>
                <td className="border-y p-2 ">{facture.numero}</td>
                <td className="border-y p-2 ">{facture.montant_ht}</td>
                <td className="border-y p-2 ">{facture.prix_tva}</td>
                <td className="border-y p-2 ">{facture.montant_ttc}</td>
                <td className="border-y p-2 ">{facture.piece_jointe}</td>
                <td className="border-y p-2  w-[25px] relative">
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

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="text-xl mx-2 my-2 ">Nouvelle facture</h2>
        <form className="grid grid-cols-1 lg:grid-cols-1 gap-6 ">
          <div className="">
            <div>
              {errorMessage && (
                <span className="text-red-600 text-sm">{errorMessage}</span>
              )}
            </div>
            <div className="">
              <div className='overflow-y-auto max-h-[75vh] rounded-lg shadow-lg w-full'>
                <div className="border rounded-t-xl">
                  <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                    <label className="block text-sm font-medium text-gray-700 my-2">Numéro de facture</label>
                    <input
                      type="text"
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      placeholder="numero de facture"
                      className="w-full p-2 rounded text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                    <label className="block text-sm font-medium text-gray-700 my-2">Montant HT</label>
                    <input
                      type="text"
                      value={montant_ht}
                      onChange={(e) => setMontantHT(e.target.value)}
                      placeholder="Montant HT"
                      className="w-full p-2 rounded text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                    <label className="block text-sm font-medium text-gray-700 my-2">Pourcentage TVA</label>
                    <input
                      type="text"
                      value={pourcentage_tva}
                      onChange={(e) => setPourcentageTVA(e.target.value)}
                      placeholder="Pourcentage TVA"
                      className="w-full p-2 rounded text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                    <label className="block text-sm font-medium text-gray-700 my-2">prix TVA</label>
                    <input
                      type="text"
                      value={prix_tva}
                      onChange={(e) => setPrixTVA(e.target.value)}
                      placeholder="prix_tva"
                      className="w-full p-2 rounded text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                    <label className="block text-sm font-medium text-gray-700 my-2">Montant TTC</label>
                    <input
                      type="text"
                      value={montant_ttc}
                      onChange={(e) => setMontantTTC(e.target.value)}
                      placeholder="Montant TTC"
                      className="w-full p-2 rounded text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                    <label className="block text-sm font-medium text-gray-700 my-2">Date de facturation</label>
                    <input
                      type="date"
                      value={date_facturation}
                      onChange={(e) => setDateFacturation(e.target.value)}
                      placeholder="Date de facturation"
                      className="w-full p-2 rounded text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                    <label className="block text-sm font-medium text-gray-700 my-2">date_enregistrement</label>
                    <input
                      type="text"
                      value={date_enregistrement}
                      onChange={(e) => setDateEnregistrement(e.target.value)}
                      placeholder="date_enregistrement"
                      className="w-full p-2 rounded text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                    <label className="block text-sm font-medium text-gray-700 my-2">type_assigner</label>
                    <input
                      type="text"
                      value={type_assigner}
                      onChange={(e) => setTypeAssigner(e.target.value)}
                      placeholder="type_assigner"
                      className="w-full p-2 rounded text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                    <label className="block text-sm font-medium text-gray-700 my-2">validation</label>
                    <input
                      type="text"
                      value={validation}
                      onChange={(e) => setValidation(e.target.value)}
                      placeholder="validation"
                      className="w-full p-2 rounded text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                    <label className="block text-sm font-medium text-gray-700 my-2">Devise</label>
                    <input
                      type="text"
                      value={devise}
                      onChange={(e) => setDevise(e.target.value)}
                      placeholder="devise"
                      className="w-full p-2 rounded text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                    <label className="block text-sm font-medium text-gray-700 my-2">piece_jointe</label>
                    <input
                      type="text"
                      value={piece_jointe}
                      onChange={(e) => setPieceJointe(e.target.value)}
                      placeholder="piece_jointe"
                      className="w-full p-2 rounded text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1 mt-2">
                <button
                  type="button"
                  onClick={handleAddFacture}
                  className="w-1/2 bg-blue-500 text-white p-2 rounded text-sm hover:bg-blue-600">
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </form>

      </Modal>
    </div>
  );
};

export default Facture;
