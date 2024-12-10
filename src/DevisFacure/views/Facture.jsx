import { useState, useEffect, useContext, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faLeftLong, faEdit, faEllipsisV, faImage, faFilePdf, faDownload, faFileInvoiceDollar, faCircleChevronRight, faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { BASE_URL } from "../contextes/ApiUrls";
import axios from "axios";
import Modal from './Modal';
import Notiflix from 'notiflix';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { format, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { UrlContext } from "../../contexte/useUrl";

const Facture = () => {
  const { url } = useContext(UrlContext);
  const [type_fournisseur, setTypeFournisseur] = useState("societe");
  const [nom_societe, setNomSociete] = useState("");

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");

  const [factures, setFactures] = useState([]);
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

  const [pdfUrl, setPdfurl] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [ajoutfournisseur, setAjoutFournisseur] = useState(false);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const formatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
  const searchRef = useRef(null);
  const [gest_fac_founisseur_id, setGestFacFournisseurId] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFournisseurs, setFilteredFournisseurs] = useState(fournisseurs);

  const handleCheckboxChange = (e) => {
    setTypeAssigner(e.target.checked);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setFilteredFournisseurs([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = fournisseurs.filter((fournisseur) => {
      const searchField = fournisseur.type_fournisseur === "societe" ? fournisseur.nom_societe : fournisseur.nom;
      return searchField?.toLowerCase().includes(term);
    });

    const sortedFilteredFournisseurs = filtered.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    setFilteredFournisseurs(sortedFilteredFournisseurs);
  };

  const handleSelectFournisseur = (id, nom_societe, nom) => {
    setGestFacFournisseurId(id);
    setSearchTerm(nom_societe || nom || '');
    setFilteredFournisseurs([]);
  };

  const resetSearch = () => {
    setSearchTerm("");
    setGestFacFournisseurId(""); // Réinitialise l'ID sélectionné
    setFilteredFournisseurs([]);
  };

  const resetFormulaireFournisseur = () => {
    setNomSociete("");
    setNom("");
    setEmail("");
    setTelephone("");
    setTypeFournisseur("societe");
    setRefresh(!refresh);
    setAjoutFournisseur(false);
  };


  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePrevMonth = () => {
    const newDate = subMonths(currentDate, 1);
    setSelectedMonth(newDate.getMonth() + 1);
    setSelectedYear(newDate.getFullYear());
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
    setSelectedMonth(newDate.getMonth() + 1);
    setSelectedYear(newDate.getFullYear());
    setCurrentDate(newDate);
  };

  const filteredFactures = factures.filter((facture) => {
    const factureDate = new Date(facture.date_facturation);
    const factureMonth = factureDate.getMonth() + 1;
    const factureYear = factureDate.getFullYear();
    return factureMonth === selectedMonth && factureYear === selectedYear;
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
    setAjoutFournisseur('');
    resetSearch();
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
    setGestFacFournisseurId('');
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
  

  useEffect(() => {
    const fetchDataFournisseur = async () => {
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
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        Notiflix.Notify.failure("Erreur lors de la récupération des données:");
      } finally {
      }
    };
    fetchDataFournisseur();
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
      gest_fac_founisseur_id
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
    formData.append("gest_fac_founisseur_id", newFacture.gest_fac_founisseur_id);


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
        handleCloseModal();
      }
      Notiflix.Notify.success("Facture ajoutée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la facture :", error);
      Notiflix.Notify.failure("Erreur lors de l'ajout de la facture.");
    }
    finally {
      handleCloseModal();
    }
  };

  const updateFacture = async (id, formData) => {
    const tokenString = localStorage.getItem("token");
    const token = JSON.parse(tokenString);

    const updatedFormData = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== "piece_jointe" && formData[key] !== undefined && formData[key] !== null) {
        updatedFormData.append(key, formData[key]);
      }
    });

    if (formData.piece_jointe && formData.piece_jointe instanceof File) {
      updatedFormData.append("piece_jointe", formData.piece_jointe);
    } else if (formData.piece_jointe) {
      console.log("La pièce jointe n'est pas un fichier valide :", formData.piece_jointe);
    }

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
        setRefresh(!refresh);
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
      setGestFacFournisseurId(selectedFacture.gest_fac_founisseur_id);
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

  const fileName = imgUrl
    ? imgUrl.split('/').pop() 
    : pdfUrl
      ? pdfUrl.split('/').pop()
      : "Fichier inconnu";


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


  const generatePDF = () => {
    const doc = new jsPDF();

    const selectedMonthText = format(currentDate, "MMMM", { locale: fr });
    const selectedYearText = format(currentDate, "yyyy");

    doc.setFontSize(18);
    doc.text(`Factures ${selectedMonthText} ${selectedYearText}`, 15, 20);

    const tableData = filteredFactures.map(facture => ({
      montant_ht: facture.montant_ht,
      prix_tva: facture.prix_tva,
      montant_httc: facture.montant_httc,
    }));

    const columns = [
      { title: "Montant HT", dataKey: "montant_ht" },
      { title: "TVA", dataKey: "prix_tva" },
      { title: "Montant TTC", dataKey: "montant_httc" },
    ];

    const totalPagesExp = "{total_pages_count_string}";

    doc.autoTable({
      head: [columns.map(col => col.title)],
      body: tableData.map(row => Object.values(row)),
      startY: 30,
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      didDrawPage: function (data) {
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height;
        const pageWidth = pageSize.width;
        const pageNumber = doc.internal.getNumberOfPages();
        const pageText = `Page ${pageNumber} / ${totalPagesExp}`;
        doc.setFontSize(10);
        doc.setTextColor(169, 169, 169); // Gris
        const textWidth = doc.getStringUnitWidth(pageText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const textX = (pageWidth - textWidth) / 1.6;
        const textY = pageHeight - 10;
        doc.text(pageText, textX, textY);
      },
    });

    if (typeof doc.putTotalPages === "function") {
      doc.putTotalPages(totalPagesExp);
    }

    const fileName = `factures_${selectedMonthText}_${selectedYearText}.pdf`;
    doc.save(fileName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = [];

    if (type_fournisseur === "societe") {
      if (!nom_societe) errors.push("Le nom de la société est requis.");
      if (!nom) errors.push("Le nom du contact est requis.");
      if (!email || !validateEmail(email)) errors.push("L'adresse email du contact est invalide.");
      if (!telephone) errors.push("Le numéro de téléphone du contact est requis.");
    } else {
      if (!nom) errors.push("Le nom complet est requis.");
      if (!email || !validateEmail(email)) errors.push("L'adresse email est invalide.");
      if (!telephone) errors.push("Le numéro de téléphone est requis.");
    }

    if (errors.length > 0) {
      Notiflix.Notify.failure(errors.join("\n"));
      return;
    }

    const formData = {
      nom_societe: type_fournisseur === "societe" ? nom_societe : "",
      email_societe: type_fournisseur === "societe" ? email_societe : "",
      nom,
      email,
      telephone,
      type: type_fournisseur,
    };

    const tokenString = localStorage.getItem("token");
    const token = JSON.parse(tokenString);

    try {
      const response = await axios.post(`${url}/api/fournisseurs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      Notiflix.Notify.success("Fournisseur ajouté avec succès !");
      resetFormulaireFournisseur();
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      if (error.response?.data?.message) {
        Notiflix.Notify.failure(error.response.data.message);
      } else {
        Notiflix.Notify.failure("Une erreur inattendue s'est produite. Veuillez réessayer.");
      }
    }
  };

  return (
    <div>
      <div className="w-full mb-3 ">
        <button onClick={handleOpenModal}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Nouvelle facture
        </button>
      </div>

      <div className="flex items-center justify-between w-full pb-4">
        <div className="text-sm font-semibold">
          <FontAwesomeIcon icon={faFileInvoiceDollar} style={{ color: "#1877F2", }} size="lg" /> Nombre de facture : {filteredFactures.length}
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrevMonth}
          >
            <FontAwesomeIcon icon={faCircleChevronLeft} style={{ color: "#1877F2", }} size="lg" />
          </button>
          <span className="text-sm font-semibold">
            {format(currentDate, "MMMM yyyy", { locale: fr })}
          </span>
          <button
            onClick={handleNextMonth}
          >
            <FontAwesomeIcon icon={faCircleChevronRight} style={{ color: "#1877F2", }} size="lg" />
          </button>
        </div>

        <button
          onClick={generatePDF}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Télécharger <FontAwesomeIcon icon={faDownload} />
        </button>
      </div>
      <div className="w-full border rounded-lg shadow-md overflow-auto h-[600px]">
        <table className="min-w-full">
          <thead className='bg-slate-100'>
            <tr>
              <th className="text-center p-2 font-bold">N°</th>
              <th className="text-center p-2 font-bold">Fournisseur</th>
              <th className="text-center p-2 font-bold">Catégorie</th>
              <th className="text-center p-2 font-bold">Date de facture</th>
              <th className="text-right p-2 font-bold">Total TVA</th>
              <th className="text-right p-2 font-bold">Total prix TTC</th>
              <th className="text-center p-2 font-bold">Justificatif</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredFactures.map((facture, index) => (
              <tr
                key={facture.id}
                className={`${index % 2 === 0 ? "bg-gray-50 shadow-sm" : "bg-white"}  ${showActionsIdProsp !== facture.id ? "hover:shadow-lg hover:scale-x-100" : ""} transition-all px-4 py-2 rounded`}
              >
                <td className="border-y p-2 text-center">{facture.id}</td>
                <td className="border-y p-2 text-center">Tsara Restaurant</td>
                <td className="border-y p-2 text-center">Frais repas</td>
                <td className="border-y p-2 text-center">{format(new Date(facture.date_facturation), "dd/MM/yyyy")}</td>
                <td className="border-y p-2 text-right">{formatter.format(facture.prix_tva)}</td>
                <td className="border-y p-2 text-right">{formatter.format(facture.montant_httc)}</td>
                <td className="border-y p-2 text-center">
                  {facture.piece_jointe ? (
                    /\.(pdf)$/i.test(facture.piece_jointe) ? (
                      <FontAwesomeIcon
                        icon={faFilePdf}
                        onClick={() => {
                          const fileUrl = `https://bg.societe-manage.com/public/storage/${facture.piece_jointe}`;
                          setPdfurl(fileUrl);
                          setImgUrl('');
                          handleOpenModal();
                        }}
                        className="text-red-500 cursor-pointer"
                      />
                    ) : /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i.test(facture.piece_jointe) ? (
                      <FontAwesomeIcon
                        icon={faImage}
                        onClick={() => {
                          const fileUrl = `https://bg.societe-manage.com/public/storage/${facture.piece_jointe}`;
                          setImgUrl(fileUrl);
                          setPdfurl('');
                          setAlt('Pièce d\'identité');
                          handleOpenModal();
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
                <td className="border-y p-2 w-[25px] relative overflow-visible">
                  <button
                    onClick={() => {
                      toggleActions(facture.id);
                    }}
                    className="rounded hover:text-red-500"
                  >
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </button>
                  {showActionsIdProsp === facture.id && (
                    <div className="absolute right-0 mt-2 bg-white shadow-lg rounded p-2 pr-6 z-50">
                      <button
                        onClick={() => {
                          handleEditClick(facture.id);
                        }}
                        className="text-blue-500 hover:text-blue-700 flex items-center mb-2"
                      >
                        <FontAwesomeIcon icon={faEdit} className="mr-2" />
                        Modifier
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(facture.id);
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
            {fileName && (
              <div className="text-sm font-semibold mb-2 text-gray-700">
                {fileName}
              </div>
            )}

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
          </div>
        ) : (ajoutfournisseur) ? (
          <>
            <button
              onClick={resetFormulaireFournisseur}
              className=" text-blue-400 text-sm px-2  rounded-md shadow-sm  transition-all relative z-10">
              <FontAwesomeIcon icon={faLeftLong} />
            </button>

            <h2 className="text-sm font-semibold mb-2">Nouveau fournisseur :</h2>
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 bg-white">
              <div className="sm:col-span-1 p-1">
                <div
                  onClick={() => setTypeFournisseur("societe")}
                  className={`cursor-pointer px-4 py-2 border rounded-lg ${type_fournisseur === "societe"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                    }`}
                >
                  Société
                </div>
              </div>
              <div className="sm:col-span-1 p-1">
                <div
                  onClick={() => setTypeFournisseur("Auto-Entrepreneur")}
                  className={`cursor-pointer px-4 py-2 border rounded-lg ${type_fournisseur === "Auto-Entrepreneur"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                    }`}
                >
                  Auto-Entrepreneur
                </div>
              </div>
              <div className="sm:col-span-1 p-1">
                <div
                  onClick={() => setTypeFournisseur("particulier")}
                  className={`cursor-pointer px-4 py-2 border rounded-lg ${type_fournisseur === "particulier"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                    }`}
                >
                  Particulier
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className='grid grid-cols-1 lg:grid-cols-1 gap-6 pt-4'>
              <div className="overflow-y-auto max-h-[75vh] rounded-lg shadow-sm w-full">
                <div className="border rounded-t-x">
                  {type_fournisseur === "societe" && (
                    <>
                      <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                        <label className="block text-sm font-medium leading-6 text-gray-900 mt-1.5">
                          Dénomination de la société
                        </label>
                        <input
                          type="text"
                          value={nom_societe}
                          onChange={(e) => setNomSociete(e.target.value)}
                          className="w-full p-2 rounded text-sm"
                        />
                      </div>
                    </>
                  )}
                  <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                    <label className="block text-sm font-medium leading-6 text-gray-900 mt-1.5">
                      {type_fournisseur === "societe" ? "Nom complet du contact" : "Nom complet"}
                    </label>
                    <input
                      type="text"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      className="w-full p-2 rounded text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                    <label className="block text-sm font-medium leading-6 text-gray-900 mt-1.5">
                      {type_fournisseur === "societe" ? "Email du contact" : "Adresse e-mail"}
                    </label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 rounded text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                    <label className="block text-sm font-medium leading-6 text-gray-900 mt-1.5">
                      {type_fournisseur === "societe" ? "Téléphone du contact" : "Numéro de téléphone"}
                    </label>
                    <input
                      type="text"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      className="w-full p-2 rounded text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <button
                  type="submit"
                  className="w-1/2 bg-blue-500 text-white p-2 rounded text-sm hover:bg-blue-600">
                  Enregistrer
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-sm font-semibold my-3">{factureToEdit?.id ? "Modifier une facture" : "Nouvelle facture"}</h2>
            <form className="grid grid-cols-1 lg:grid-cols-1 gap-6 ">
              <div className="">
                <div className="">
                  <div className='overflow-y-auto max-h-[75vh] rounded-lg shadow-sm w-full'>
                    <div className="border rounded-t-xl">
                      <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                        <label className="block text-sm font-medium text-gray-700 my-2">
                          Fournisseur
                        </label>
                        <div className="relative" ref={searchRef}>
                          <div className="flex items-center">
                            <div className="flex-grow">
                              <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Rechercher un fournisseur..."
                                className="w-full pl-2 pr-2 py-2 rounded text-sm"
                              />
                            </div>
                            <div className="flex-shrink-0 w-1/6 text-right mr-1">
                              <FontAwesomeIcon
                                icon={faPlus}
                                className="text-blue-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                                style={{ fontSize: '16px' }}
                                title="Ajouter un nouveau fournisseur"
                                onClick={() => {
                                  handleOpenModal();
                                  setAjoutFournisseur(true);
                                }}
                              />
                            </div>
                          </div>
                          {filteredFournisseurs.length > 0 && (
                            <ul className="absolute left-0 right-0 bg-white border rounded mt-1 max-h-40 overflow-y-auto z-10">
                              {filteredFournisseurs.map((fournisseur) => {
                                return (
                                  <li
                                    key={fournisseur.id}
                                    onClick={() => handleSelectFournisseur(fournisseur.id, fournisseur.nom_societe, fournisseur.nom)}
                                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm">
                                    <span className="">{fournisseur.nom_societe || fournisseur.nom}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                        <label className="block text-sm font-medium text-gray-700 my-2">Catégorie</label>
                        <input
                          type="text"
                          placeholder='Catégorie'
                          className="w-full p-2 rounded text-sm">
                        </input>
                      </div>

                      <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">

                        <label className="block text-sm font-medium text-gray-700 my-2">Montant HT</label>

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={montant_ht}
                            onChange={(e) => {
                              setMontantHT(e.target.value);
                              calculTtcTva();
                            }}
                            placeholder="Montant HT"
                            className="flex-1 p-2 text-sm"
                          />

                          <select
                            value={devise}
                            onChange={(e) => setDevise(e.target.value)}
                            className="py-1 text-sm"
                          >
                            <option value="EUR">€ EUR</option>
                            <option value="USD">$ USD</option>
                            <option value="MGA">Ar MGA</option>
                          </select>
                        </div>
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
                        <label className="block text-sm font-medium text-gray-700 my-2">Total prix TVA</label>
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
                        <label className="block text-sm font-medium text-gray-700 my-2">Total prix TTC</label>
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
                        <label className="block text-sm font-medium text-gray-700 my-2">Date de facture</label>
                        <input
                          type="date"
                          value={date_facturation}
                          onChange={(e) => setDateFacturation(e.target.value)}
                          placeholder="Date de facturation"
                          className="w-full p-2 rounded text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                        <label className="block text-sm font-medium text-gray-700 my-2">Justificatif</label>
                        <input
                          type="file"
                          onChange={(e) => handleUpload(e, "piece_jointe")} placeholder="Piece jointe"
                          className="w-full p-2 rounded text-sm"
                        />
                      </div>

                    </div>
                  </div>
                  <div className="lg:col-span-1 mt-3">
                    <div className="mb-3 ml-2 flex items-center">
                      <input
                        type="checkbox"
                        id="exampleCheckbox"
                        checked={type_assigner}
                        onChange={handleCheckboxChange}
                        className=""
                      />
                      <label htmlFor="exampleCheckbox" className="text-sm text-gray-700 ml-2">
                        Assigner à société
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveFacture}
                      className="w-1/2 bg-blue-500 text-white p-2 rounded text-sm hover:bg-blue-600 mb-2"
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