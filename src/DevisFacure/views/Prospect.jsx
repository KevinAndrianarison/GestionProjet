import { useState, useEffect } from "react";
import axios from "axios";
import { FULL_URL } from "../contextes/ApiUrls";
import Geonames from "../contextes/geonames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash, faEdit,
  faEllipsisV,
  faPlusCircle
} from "@fortawesome/free-solid-svg-icons";
import { FaBuilding, FaUser } from 'react-icons/fa';
import { Link } from "react-router-dom";
import Modal from './Modal';
import Swal from 'sweetalert2';

function ProspectSCT() {
  const [isFirstModalOpen, setFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setSecondModalOpen] = useState(false);
  const [type_client, setTypeClient] = useState("societe");
  const [nom_societe, setNomSociete] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [sexe, setSexe] = useState("");
  const [telephone, setTelephone] = useState("");
  const [site_web, setSiteWeb] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [pays, setPays] = useState("");
  const [numero_siren, setNumeroSiren] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // État pour le message d'erreur
  const [prospects, setProspects] = useState([]); // État pour stocker les données récupérées
  const [page, setPage] = useState(1); // Page actuelle
  const itemsPerPage = 4; // Nombre de prospects par page
  const [selectedProspectId, setSelectedProspectId] = useState(null);
  const [prospectToEdit, setProspectToEdit] = useState({});
  const [type_client_edit, setTypeClientEdit] = useState(""); 
  const [showActionsIdProsp, setShowActionsIdProsp] = useState(null);

  const handleDelete = async (prospectId) => {
    // Demander confirmation avant de supprimer
    setShowActionsIdProsp((prevId) => (prevId === prospectId ? null : prospectId));
  
    // Utilisation de SweetAlert2 pour la confirmation
    const confirmed = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      reverseButtons: true,  // Pour inverser les boutons
    });
  
    if (!confirmed.isConfirmed) {
      return; // Si l'utilisateur annule, ne rien faire
    }

    try {
      const response = await axios.delete(`${FULL_URL}gest/fact/prospects/${prospectId}`);
      console.log('Données supprimées :', response.data);
      setProspects(prospects.filter((prospect) => prospect.id !== prospectId));
      Swal.fire('Supprimé!', 'Le prospect a été supprimé.', 'success');
    } catch (error) {
      console.error('Erreur lors de la suppression des données :', error);
      Swal.fire('Erreur', "Une erreur est survenue lors de la suppression.", 'error');
    }
  };
    
     // Charger tous les prospects une seule fois
      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`${FULL_URL}gest/fact/entreprises/1/prospects`);
            if (response.status === 200) {
              setProspects(response.data);
            }
          } catch (error) {
            console.error("Erreur lors de la récupération des données:", error);
          }
        };
        fetchData();
      }, []);
  
      // Découper les prospects à afficher pour la page actuelle
      const currentProspects = prospects.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
      );

      // Gestion de la navigation entre pages
      const handleNext = () => {
        if (page < Math.ceil(prospects.length / itemsPerPage)) {
          setPage(page + 1);
        }
      };

      const handlePrev = () => {
        if (page > 1) {
          setPage(page - 1);
        }
      };

      const toggleActions = (id) => {
        setShowActionsIdProsp((prevId) => (prevId === id ? null : id));
      };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Réinitialiser le message d'erreur
    if (!email.includes("@") || !email.includes(".")) {
      setErrorMessage("Veuillez entrer une adresse e-mail valide.");
      return;
    }
      if (type_client === "societe" && !nom_societe.trim()) {
        setErrorMessage("Le nom de la société est requis pour le type 'société'.");
        return; // Arrête la soumission si la condition n'est pas remplie
      }
    const formData = {
      nom_societe,
      nom,
      email,
      sexe,
      telephone,
      site_web,
      adresse,
      ville,
      pays,
      numero_siren,
      type: type_client,
    };
    console.log("Données du formulaire : ", formData);

    try {
      const response = await axios.post(FULL_URL, formData);
      console.log("Réponse de l'API:", response.data);
      setErrorMessage("");

      // Réinitialiser tous les champs après la soumission
      setNomSociete("");
      setNom("");
      setEmail("");
      setSexe("");
      setTelephone("");
      setSiteWeb("");
      setAdresse("");
      setVille("");
      setPays("");
      setNumeroSiren("");
      setTypeClient("societe");

      // Mettre à jour l'état prospects pour inclure le nouveau prospect
      setProspects([...prospects, response.data]);

      setFirstModalOpen(false);
      setTimeout(() => {
        alert("Ajout de client avec succès !");
      }, 500);
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  const handleEditClick = async (id) => {
    setSelectedProspectId(id);
    setShowActionsIdProsp((prevId) => (prevId === id ? null : id));
    try {
      const response = await axios.get(`${FULL_URL}gest/fact/prospects/${id}`);
      if (response.status === 200) {
        setProspectToEdit(response.data); // Mettre les données dans l'état
        setTypeClientEdit(response.data.type); // Initialiser le type pour l'édition
        setSecondModalOpen(true); // Ouvrir le modal
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données du prospect:", error);
    }
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const editedData = {
      ...prospectToEdit,
      type: type_client_edit, // Utilisation de type_client_edit pour l'édition
    };

      // Supprimer les champs spécifiques aux sociétés si le type est "particulier"
  if (type_client_edit === "particulier") {
    editedData.nom_societe = null; //asiana "delete" + esapce  eo aloha raha hamafa
    editedData.numero_siren = null;
    editedData.site_web = null;
  }
    setErrorMessage("");

    if (type_client_edit === "societe" && (!editedData.nom_societe || !editedData.nom_societe.trim())) {
      setErrorMessage("Le nom de la société est requis pour le type 'société'.");
      return; // Arrête la soumission si la condition n'est pas remplie
    }
    console.log("Données envoyées pour la mise à jour :", editedData); // Vérification
  
    try {
      const response = await axios.put(`${FULL_URL}gest/fact/prospects/${prospectToEdit.id}/entreprises/1`, editedData);
      console.log("Réponse de mise à jour :", response.data);
      setSecondModalOpen(false);
      fetchDataAndStore();
      setTimeout(() => {
        alert("Modification de client avec succès !");
      }, 500);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du prospect:", error);
    }
  };
  
  
  return (
    <div>
      <div className="">
        <div>
          <nav className="rounded-md flex justify-between items-center p-4 ">
            <div>
              <Link to="/" className="text-2xl ">
                Tous les prospects
              </Link>
            </div>
           </nav>
        </div>
      </div>

        {/* Boutons de navigation */}
        <div className="flex flex-wrap">
          <div className="w-full md:w-10/12 sm:w-10/12">
            <div className="flex items-center space-x-2">

              <button
              onClick={() => setFirstModalOpen(true)} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              >
              Nouveau prospect
              </button>
              </div>
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
                disabled={page >= Math.ceil(prospects.length / itemsPerPage)} 
                className={`px-4 py-1 border rounded ${page >= Math.ceil(prospects.length / itemsPerPage) ? "text-gray-400 cursor-not-allowed" : "text-blue-600"}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Tableau des prospects */}
        <div className="w-full border rounded-lg shadow-md overflow-auto h-[600px] p-4">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left p-4 text-sm font-bold leading-6">Type</th>
                <th className="text-left p-4 text-sm font-bold leading-6">Nom société</th>
                <th className="text-left p-4 text-sm font-bold leading-6">Nom</th>
                <th className="text-left p-4 text-sm font-bold leading-6">Email</th>
              </tr>
            </thead>
            <tbody className="border-gray-300">
              {currentProspects.map((prospect) => (
                <tr key={prospect.id}>
                  <td className="border-y py-2 px-4">
                    {prospect.type !== 'particulier' ? (
                      <FaBuilding title={prospect.type} className="inline-block mr-2" />
                    ) : (
                      <FaUser title={prospect.type} className="inline-block mr-2" />
                    )}
                  </td>
                  <td className="border-y px-4">{prospect.nom_societe}</td>
                  <td className="border-y px-4">{prospect.nom}</td>
                  <td className="border-y px-4">{prospect.email}</td>
                  <td className="border-y w-[25px] relative">
                    <button
                    onClick={() => toggleActions(prospect.id)}
                    className="rounded hover:text-red-500"
                  >
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </button>

                  {/* Affichage conditionnel des boutons Modifier et Effacer pour le prospect en cours */}
                  {showActionsIdProsp === prospect.id && (
                    <div className="absolute right-0 mt-2 bg-white shadow-lg rounded p-2 z-10">
                      <button
                        onClick={() => handleEditClick(prospect.id)}
                        className="text-blue-500 hover:text-blue-700 flex items-center mb-2"
                      >
                        <FontAwesomeIcon icon={faEdit} className="mr-2" />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(prospect.id)}
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
          {prospects.length === 0 && <p className="text-#707070-500"><i>Aucun prospect disponible.</i></p>}
        </div>

        <div className="p-6">
        <div >

      <Modal isOpen={isFirstModalOpen} onClose={() => setFirstModalOpen(false)}>
        
          <div className="grid grid-cols overflow-y-auto sm:grid-cols-1 max-h-[70vh]">
          <div className="flex flex-wrap mt-3 mb-2">
            <div className="w-full md:w-6/12 sm:w-6/12">
            <h2 className="text-xl font-bold"><FontAwesomeIcon icon={faPlusCircle} className="mr-2" />Nouveau prospect</h2>
              </div>
            <div className="w-full md:w-5/12 sm:w-5/12 ml-auto">
            <label className="block text-sm font-normal leading-6 text-gray-900">
                <select
                  onChange={(e) => setTypeClient(e.target.value)} 
                  className="w-full border rounded-md p-1"
                >
                  <option value="societe"><FaBuilding className="inline-block mr-2" /> Une société</option>
                  <option value="particulier">Un Particulier</option>
                </select>
              </label>
            </div>
          </div>
          <hr></hr>
          <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">

            {type_client === "societe" && (
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Dénomination de la société
                </label>
                <input
                  type="text"
                  value={nom_societe}
                  onChange={(e) => setNomSociete(e.target.value)}
                  className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
                />
              </div>
            )}

            <div className="sm:col-span-1">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Nom complet
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
              />
              {errorMessage && (
                <span className="text-red-600 text-sm">{errorMessage}</span>
              )}
            </div>

            <div className="sm:col-span-1">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Téléphone
              </label>
              <input
                type="text"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Sexe
              </label>
              <select
                value={sexe}
                onChange={(e) => setSexe(e.target.value)}
                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
              >
                <option value=""></option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
            </div>

            {type_client === "societe" && (
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Site Web
                </label>
                <input
                  type="text"
                  value={site_web}
                  onChange={(e) => setSiteWeb(e.target.value)}
                  className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
                />
              </div>
            )}

            <div className="sm:col-span-1">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Adresse
              </label>
              <input
                type="text"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
              />
            </div>
            <Geonames />
            {type_client === "societe" && (
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Numéro SIREN
                </label>
                <input
                  type="text"
                  value={numero_siren}
                  onChange={(e) => setNumeroSiren(e.target.value)}
                  className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
                />
              </div>
            )}
            <br />
            <div className="sm:col-span-1 py-2">
            <button 
                type="submit"
                className="text-white-500 bg-blue-500 pl-3 pr-3 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
>
                Enregistrer
              </button>
            </div>

        </form>            
      </div>
    </Modal>


      <Modal isOpen={isSecondModalOpen} onClose={() => setSecondModalOpen(false)}>
  <h2 className="text-xl">Modifier le prospect</h2>
  <div className="grid grid-cols overflow-y-auto sm:grid-cols-1 max-h-[70vh]">
    <div className="sm:col-span-2">
    <div>
            <label className="block text-sm font-normal leading-6 text-gray-900">
              Type de client
            </label>
            <div className="mt-2 flex space-x-4">
              <label>
                <input
                  type="radio"
                  value="societe"
                  checked={type_client_edit === "societe"}
                  onChange={() => setTypeClientEdit("societe")}
                  className="mr-2"
                />
                Société
              </label>
              <label>
                <input
                  type="radio"
                  value="particulier"
                  checked={type_client_edit === "particulier"}
                  onChange={() => setTypeClientEdit("particulier")}
                  className="mr-2"
                />
                Particulier
              </label>
            </div>
          </div>

      <form onSubmit={handleFormSubmit} className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      {type_client_edit  === "societe" && (

        <div className="sm:col-span-1">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Dénomination de la société
          </label>
          <input
            type="text"
            value={prospectToEdit.nom_societe || ""}
            onChange={(e) =>
              setProspectToEdit({ ...prospectToEdit, nom_societe: e.target.value })
            }
            className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
          />
        </div>
            )}

        <div className="sm:col-span-1">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Nom complet
          </label>
          <input
            type="text"
            value={prospectToEdit.nom || ""}
            onChange={(e) =>
              setProspectToEdit({ ...prospectToEdit, nom: e.target.value })
            }
            className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-1">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Email
              </label>
              <input
                type="email"
                value={prospectToEdit.email || ""}
                onChange={(e) =>
                  setProspectToEdit({ ...prospectToEdit, email: e.target.value })
                }                
                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
              />
              {errorMessage && (
                <span className="text-red-600 text-sm">{errorMessage}</span>
              )}
            </div>

            <div className="sm:col-span-1">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Téléphone
              </label>
              <input
                type="text"
                value={prospectToEdit.telephone || ""}
                onChange={(e) =>
                  setProspectToEdit({ ...prospectToEdit, telephone: e.target.value })
                }
                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Sexe
              </label>
              <select
            value={prospectToEdit.sexe || ""}
            onChange={(e) =>
              setProspectToEdit({ ...prospectToEdit, sexe: e.target.value })
            }
                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
              >
                <option value=""></option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
            </div>

            {type_client_edit === "societe" && (
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Site Web
                </label>
                <input
                  type="text"
                  value={prospectToEdit.site_web || ""}
                  onChange={(e) =>
                    setProspectToEdit({ ...prospectToEdit, site_web: e.target.value })
                  }
                  className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
                />
              </div>
            )}

            <div className="sm:col-span-1">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Adresse
              </label>
              <input
                type="text"
                value={prospectToEdit.adresse || ""}
                onChange={(e) =>
                  setProspectToEdit({ ...prospectToEdit, adresse: e.target.value })
                }
                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Ville
              </label>
              <input
                type="text"
                value={prospectToEdit.ville || ""}
                onChange={(e) =>
                  setProspectToEdit({ ...prospectToEdit, ville: e.target.value })
                }
                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Pays
              </label>
              <input
                type="text"
                value={prospectToEdit.pays || ""}
                onChange={(e) =>
                  setProspectToEdit({ ...prospectToEdit, pays: e.target.value })
                }
                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
              />
            </div>

            {type_client_edit  === "societe" && (
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Numéro SIREN
                </label>
                <input
                  type="text"
                  value={prospectToEdit.numero_siren || ""}
                  onChange={(e) =>
                    setProspectToEdit({ ...prospectToEdit, numero_siren: e.target.value })
                  }
                  className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
                />
              </div>
            )}
<br />
        <div className="sm:col-span-1 py-2">
          <button
            type="submit"
            className="bg-blue-500 pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  </div>
</Modal>

    </div>
    </div>
    </div>
  );
}

export default ProspectSCT;
