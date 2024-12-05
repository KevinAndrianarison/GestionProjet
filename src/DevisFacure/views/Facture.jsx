import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faEllipsisV, faImage } from "@fortawesome/free-solid-svg-icons";
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
  const [montant_httc, setMontantTTC] = useState(0);
  const [prix_tva, setPrixTVA] = useState(0);
  const [pourcentage_tva, setPourcentageTVA] = useState('');

  const [date_facturation, setDateFacturation] = useState('');
  const [date_enregistrement, setDateEnregistrement] = useState('');
  const [type_assigner, setTypeAssigner] = useState('');
  const [validation, setValidation] = useState('');
  const [piece_jointe, setPieceJointe] = useState('');
  const [devise, setDevise] = useState('');
  const [factureToEdit, setFactureToEdit] = useState({});

  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [pdfUrl, setPdfurl] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [alt, setAlt] = useState('');


  const handleMonthChange = (selected) => {
    setSelectedMonths(selected);
  };

  const handleYearChange = (selected) => {
    setSelectedYear(selected ? selected.value : '');
  };

  const filteredFactures = factures.filter((facture) => {
    if (!facture.date_facturation) {
      console.warn('Date de facturation manquante pour la facture:', facture);
      return false;
    }

    const factureDate = new Date(facture.date_facturation);
    const factureMonth = factureDate.getMonth() + 1;
    const factureYear = factureDate.getFullYear();

    const monthMatch =
      selectedMonths.length === 0 ||
      selectedMonths.some((month) => Number(month.value) === factureMonth);

    const yearMatch = !selectedYear || Number(selectedYear) === factureYear;

    return monthMatch && yearMatch;
  });


  const resetFactureFields = () => {
    setFactureToEdit({});
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

  const handleOpenModal = () => {
    setModalOpen(true);
    setShowActionsIdProsp(false);
  };


  const handleCloseModal = () => {
    setModalOpen(false);
    setImgUrl('');
    setPdfurl('');
    resetFactureFields();
    setFactureToEdit({});
    setModalOpen(false);
    setSelectedImage(""); // Réinitialiser l'image sélectionnée

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
          setPieceJointe(`https://bg.societe-manage.com/public/storage/${response.data.piece_jointe}`);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des factures :", error);
        Notiflix.Notify.failure("Erreur lors de la récupération des données:");
      }
    };
    fetchFactures();
  }, [refresh]);

  const validateForm = () => {
    if (!montant_ht || !montant_httc || !prix_tva) {
      Notiflix.Notify.failure('Tous les champs doivent être remplis.');
      return false;
    }
    return true;
  };


  const handleSaveFacture = () => {
    if (!validateForm()) return;

    const factureData = {
      numero,
      montant_ht,
      montant_httc,
      prix_tva,
      pourcentage_tva,
      date_facturation,
      date_enregistrement,
      type_assigner,
      devise,
      validation,
      piece_jointe,
    };

    if (factureToEdit?.id) {
      updateFacture(factureToEdit.id, factureData);
    } else {
      addFacture(factureData);
    }
  };


  const addFacture = async (newFacture) => {
    const tokenString = localStorage.getItem("token");
    const token = JSON.parse(tokenString);

    const formData = new FormData();
    formData.append("numero", newFacture.numero);
    formData.append("montant_ht", newFacture.montant_ht);
    formData.append("montant_httc", newFacture.montant_httc);
    formData.append("prix_tva", newFacture.prix_tva);
    formData.append("pourcentage_tva", newFacture.pourcentage_tva);
    formData.append("date_facturation", newFacture.date_facturation);
    formData.append("date_enregistrement", newFacture.date_enregistrement);
    formData.append("type_assigner", newFacture.type_assigner);
    formData.append("devise", newFacture.devise);

    if (newFacture.piece_jointe) {
      formData.append("piece_jointe", newFacture.piece_jointe);
    }

    try {
      const response = await axios.post(`${BASE_URL}factures/entrants`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setRefresh(!refresh);

      if (response.status === 200) {
        setFactures([...factures, response.data]);
        setModalOpen(false);
      }
      Notiflix.Notify.success("Facture ajoutée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la facture :", error);
      Notiflix.Notify.failure("Erreur lors de l'ajout de la facture.");
    }
    finally {
      setModalOpen(false);
    }
  };


  console.log("Facture à modifier :", factureToEdit);

  const updateFacture = async (id, formData) => {
    const tokenString = localStorage.getItem("token");
    const token = JSON.parse(tokenString);

    const updatedFormData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== undefined && formData[key] !== null) {
        updatedFormData.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post(`${BASE_URL}factures/entrants/${id}`, updatedFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-HTTP-Method-Override": "PUT",
        },
      });

      if (response.status === 200) {
        setFactures((prevFactures) =>
          prevFactures.map((facture) =>
            facture.id === id ? { ...facture, ...formData } : facture
          )
        );
        handleCloseModal();
        Notiflix.Notify.success("Facture modifiée avec succès !");
      } else {
        throw new Error("Échec de la mise à jour de la facture");
      }
    } catch (error) {
      console.error("Erreur lors de la modification de la facture :", error);
      Notiflix.Notify.failure("Erreur lors de la modification de la facture.");
    }
  };

  const handleEditClick = async (id) => {
    const selectedFacture = factures.find((facture) => facture.id === id);
    if (selectedFacture) {
      setNumero(selectedFacture.numero);
      setMontantHT(selectedFacture.montant_ht);
      setMontantTTC(selectedFacture.montant_httc);
      setPrixTVA(selectedFacture.prix_tva);
      setPourcentageTVA(selectedFacture.pourcentage_tva);
      setDateFacturation(selectedFacture.date_facturation);
      setDateEnregistrement(selectedFacture.date_enregistrement);
      setTypeAssigner(selectedFacture.type_assigner);
      setValidation(selectedFacture.validation);
      setDevise(selectedFacture.devise);
      setPieceJointe(selectedFacture.piece_jointe);
      setFactureToEdit(selectedFacture);
      handleOpenModal();
    }
  };

  const handleDelete = async (factureId) => {
    setShowActionsIdProsp((prevId) => (prevId === factureId ? null : factureId));

    const confirmDelete = () => {
      return new Promise((resolve) => {
        Notiflix.Confirm.show(
          'Confirmer',
          'Êtes-vous sûr de vouloir supprimer ?',
          'Oui',
          'Non',
          () => resolve(true),
          () => resolve(false)
        );
      });
    };

    const confirmed = await confirmDelete();
    if (!confirmed) {
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
        setRefresh(!refresh);
      }
      Notiflix.Report.success(
        'Succès',
        'Fournisseur supprimé avec succès.',
        'Fermer'
      );
    } catch (error) {
      console.error("Erreur lors de la suppression de la facture :", error);
      Notiflix.Report.failure(
        'Echec',
        'Echec lors de la suppression du fournisseur.',
        'Fermer'
      );
    }
  };

  const currentFactures = filteredFactures.slice(
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

  const calculTtcTva = () => {
    const ht = parseFloat(montant_ht) || 0;
    const tva = parseFloat(pourcentage_tva) || 0;
    const calculatedPrixTVA = ht * (tva / 100);
    const calculatedMontantTTC = ht + calculatedPrixTVA;
    setPrixTVA(calculatedPrixTVA.toFixed(2));
    setMontantTTC(calculatedMontantTTC.toFixed(2));
  };

  useEffect(() => {
    if (montant_ht !== "" || pourcentage_tva !== "") {
      calculTtcTva();
    } else {
      setPrixTVA("0.00");
      setMontantTTC("0.00");
    }
  }, [montant_ht, pourcentage_tva]);


  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file && AllowedFile(file)) {
      setPieceJointe(file);
    }
  };

  const AllowedFile = (file) => {
    const allowedFileTypes = /\.(pdf|jpg|jpeg|png|gif|bmp|svg|webp)$/i;
    const maxFileSize = 2 * 1024 * 1024;

    if (!allowedFileTypes.test(file.name)) {
      Notiflix.Notify.warning(
        "Le fichier doit être un PDF ou une image valide (jpg, jpeg, png, gif, bmp, svg, webp)."
      );
      return false;
    }

    if (file.size > maxFileSize) {
      Notiflix.Notify.warning("Le fichier ne doit pas dépasser 2 Mo.");
      return false;
    }

    return true;
  };
  const fileUrl = factures.piece_jointe;

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
              name="months"
              className="basic-multi-select text-xs"
              classNamePrefix="select"
              onChange={handleMonthChange}
            />
          </div>
          <div className='flex flex-col items-start'>
            <h3>Choisir une année :</h3>
            <Select
              options={yearOptions}
              className="text-xs"
              onChange={handleYearChange}
              isClearable
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
                <td className="border-y p-2 ">{facture.id}</td>
                <td className="border-y p-2 ">{facture.montant_ht}</td>
                <td className="border-y p-2 ">{facture.prix_tva}</td>
                <td className="border-y p-2 ">{facture.montant_httc}</td>
                <td className="border-y p-2">
                  {facture.piece_jointe ? (
                    /\.(pdf|jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(facture.piece_jointe) ? (
                      <FontAwesomeIcon
                        icon={faImage}
                        onClick={() => {
                          const fileUrl = `https://bg.societe-manage.com/public/storage/${facture.piece_jointe}`;

                          if (fileUrl.endsWith('.pdf')) {
                            setPdfurl(fileUrl);
                            setImgUrl('');
                          } else if (/\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(fileUrl)) {
                            setImgUrl(fileUrl);
                            setPdfurl('');
                            setAlt('Pièce d\'identité');
                          }
                          setModalOpen(true);
                        }}

                        className="text-blue-500 cursor-pointer"
                      />
                    ) : (
                      <span>Fichier attaché</span>
                    )
                  ) : (
                    "Aucune pièce jointe"
                  )}
                </td>
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
                        onClick={() => { handleEditClick(facture.id) }}
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
        {(imgUrl || pdfUrl) ? (
          <div className="mb-4">
            {imgUrl && (
              <img
                src={imgUrl}
                alt={alt || "Aperçu du fichier"}
                className="w-full max-h-96 object-contain rounded-lg shadow-md"
              />
            )}
            {pdfUrl && (
              <iframe
                src={pdfUrl}
                title="Aperçu PDF"
                width="100%"
                height="500px"
                className="rounded-lg shadow-md"
              />
            )}
          </div>) : (
          <>
            <h2 className="text-xl mx-2 my-2 ">{factureToEdit?.id ? "Modifier la facture" : "Nouvelle facture"}</h2>
            <form className="grid grid-cols-1 lg:grid-cols-1 gap-6 ">
              <div className="">
                <div className="">
                  <div className='overflow-y-auto max-h-[75vh] rounded-lg shadow-sm w-full'>
                    <div className="border rounded-t-xl">
                      <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                        <label className="block text-sm font-medium text-gray-700 my-2">Montant HT</label>
                        <input
                          type="number"
                          value={montant_ht}
                          onChange={(e) => { setMontantHT(e.target.value); calculTtcTva(); }}
                          placeholder="Montant HT"
                          className="w-full p-2 rounded text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                        <label className="block text-sm font-medium text-gray-700 my-2">Pourcentage TVA</label>
                        <input
                          type="number"
                          value={pourcentage_tva}
                          onChange={(e) => { setPourcentageTVA(e.target.value); calculTtcTva(); }}
                          placeholder="Pourcentage TVA"
                          className="w-full p-2 rounded text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                        <label className="block text-sm font-medium text-gray-700 my-2">prix TVA</label>
                        <input
                          type="number"
                          value={prix_tva}
                          readOnly
                          onChange={(e) => setPrixTVA(e.target.value)}
                          placeholder="prix_tva"
                          className="w-full p-2 rounded text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                        <label className="block text-sm font-medium text-gray-700 my-2">Montant TTC</label>
                        <input
                          type="number"
                          value={montant_httc}
                          readOnly
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
                        <label className="block text-sm font-medium text-gray-700 my-2">Date d'enregistrement</label>
                        <input
                          type="date"
                          value={date_enregistrement}
                          onChange={(e) => setDateEnregistrement(e.target.value)}
                          placeholder="date_enregistrement"
                          className="w-full p-2 rounded text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                        <label className="block text-sm font-medium text-gray-700 my-2">Type assigner</label>
                        <select
                          value={type_assigner}
                          onChange={(e) => setTypeAssigner(e.target.value)}
                          className="w-full p-2 rounded text-sm"
                        >
                          <option value=""></option>
                          <option value="societe">Société</option>
                          <option value="particulier">Particulier</option>
                          <option value="auto_entrepreneur">Auto-entrepreneur</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                        <label className="block text-sm font-medium text-gray-700 my-2">Validation</label>
                        <select
                          value={validation}
                          onChange={(e) => setValidation(e.target.value)}
                          className="w-full p-2 rounded text-sm"
                        >
                          <option value="false">Non</option>
                          <option value="true">Oui</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                        <label className="block text-sm font-medium text-gray-700 my-2">Devise</label>
                        <select
                          value={devise}
                          onChange={(e) => setDevise(e.target.value)}
                          className="w-full p-2 rounded text-sm"
                        >
                          <option value="eur">EUR</option>
                          <option value="usd">USD</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                        <label className="block text-sm font-medium text-gray-700 my-2">Piece jointe</label>
                        <input
                          type="file"
                          onChange={(e) => handleUpload(e, "piece_jointe")} placeholder="Piece jointe"
                          className="w-full p-2 rounded text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-1 mt-2">
                    <button
                      type="button"
                      onClick={handleSaveFacture}
                      className="w-1/2 bg-blue-500 text-white p-2 rounded text-sm hover:bg-blue-600"
                    >
                      {factureToEdit?.id ? "Modifier" : "Enregistrer"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
            </>)}
      </Modal>
    </div>
  );
};

export default Facture;