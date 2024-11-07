import { useState, useEffect } from "react";
import axios from "axios";
import { FULL_URL } from "../contextes/ApiUrls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash, faEdit
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Modal from './Modal';

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
  const [selectedProspectId, setSelectedProspectId] = useState(null);
  const [prospectToEdit, setProspectToEdit] = useState({});
  const [type_client_edit, setTypeClientEdit] = useState(""); // Pour l'édition

  const handleDelete = async (prospectId) => {
      // Demander confirmation avant de supprimer
  const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
  if (!confirmed) {
    return; // Si l'utilisateur annule, ne rien faire
  }
    try {
      const response = await axios.delete(`https://bg.societe-manage.com/public/api/gest/fact/prospects/${prospectId}`);
      console.log('Données supprimées :', response.data);
  
      // Mettre à jour la liste des prospects après suppression
      setProspects(prospects.filter((prospect) => prospect.id !== prospectId));
  
    } catch (error) {
      console.error('Erreur lors de la suppression des données :', error);
    }
    };
    
  // Fonction pour récupérer les données depuis l'API
  const fetchDataAndStore = async () => {
    try {
      const response = await axios.get(FULL_URL); // Remplace FULL_URL par l'URL de l'API pour récupérer les données
      if (response.status === 200 && response.data) {
        setProspects(response.data); // Mettre à jour l'état avec les données récupérées
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  };
  useEffect(() => {
    fetchDataAndStore(); 
  }, [prospects]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Réinitialiser le message d'erreur
    // Vérification de l'email
    if (!email.includes("@") || !email.includes(".")) {
      setErrorMessage("Veuillez entrer une adresse e-mail valide.");
      return;
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
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  const handleEditClick = async (id) => {
    setSelectedProspectId(id);
    try {
      const response = await axios.get(`https://bg.societe-manage.com/public/api/gest/fact/prospects/${id}`);
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
  
    console.log("Données envoyées pour la mise à jour :", editedData); // Vérification
    
    try {
      const response = await axios.put(`https://bg.societe-manage.com/public/api/gest/fact/prospects/${prospectToEdit.id}/entreprises/1`, editedData);
      console.log("Réponse de mise à jour :", response.data);
      setSecondModalOpen(false);
      fetchDataAndStore();
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

            <div className="">
                  <div className="flex items-center space-x-2">

                    <button
        onClick={() => setFirstModalOpen(true)} 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Ajouter
      </button>
                  </div>
            </div>
           </nav>
        </div>
      </div>

      {/* Affichage de la liste des prospects ou du formulaire */}
        <div className="w-full border rounded-lg shadow-md" >
          <table className="min-w-full ">
            <thead className="">
              <tr className="">
                <th className="text-left p-4 text-sm font-medium leading-6 border-b-10">
                  Type
                </th>
                <th className="text-left p-4 text-sm font-medium leading-6 ">
                  Nom société
                </th>
                <th className="text-left p-4 text-sm font-medium leading-6 ">
                  Nom
                </th>
                <th className="text-left p-4 text-sm font-medium leading-6 ">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="border-gray-300" >
              {prospects.map((prospect) => (
                <tr key={prospect.id}>
                  <td className="border-y py-2 px-4 "  >
                  <button onClick={() => handleEditClick(prospect.id)}>

                    {prospect.type}
                    </button>
                  </td>
                  <td className="border-y px-4">
                  <button onClick={() => handleEditClick(prospect.id)}>

                      {prospect.nom_societe}
                      </button>

                  </td>
                  <td className="border-y px-4">
                  <button onClick={() => handleEditClick(prospect.id)}>

                    {prospect.nom}
                    </button>

                  </td>
                  <td className="border-y px-4 ">
                  <button onClick={() => handleEditClick(prospect.id)}>

                  {prospect.email}
                  </button>
                  </td>
                  <td className="border-y text-right px-4">
                  <button onClick={() => handleEditClick(prospect.id)}

                      className=" rounded hover:text-red-500"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
              <button onClick={() => handleDelete(prospect.id)} className=" hover:text-red-500 ">
                <FontAwesomeIcon icon={faTrash} />
              </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          <div className="p-6">

          <div className="p-5">

      <Modal isOpen={isFirstModalOpen} onClose={() => setFirstModalOpen(false)}>
        <h2 className="text-xl ">Nouveau prospect</h2>
    <div className="grid grid-cols overflow-y-auto sm:grid-cols-1 max-h-[70vh]">
        <div className="sm:col-span-2">
            <label className="block text-sm font-normal leading-6 text-gray-900">
              Type de client
            </label>
            <div className="mt-2 flex space-x-4">
              <label>
                <input
                  type="radio"
                  value="societe"
                  checked={type_client === "societe"}
                  onChange={() => setTypeClient("societe")}
                  className="mr-2"
                />
                Société
              </label>
              <label>
                <input
                  type="radio"
                  value="particulier"
                  checked={type_client === "particulier"}
                  onChange={() => setTypeClient("particulier")}
                  className="mr-2"
                />
                Particulier
              </label>
            </div>
          </div>

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

            <div className="sm:col-span-1">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Ville
              </label>
              <input
                type="text"
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Pays
              </label>
              <input
                type="text"
                value={pays}
                onChange={(e) => setPays(e.target.value)}
                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
              />
            </div>

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
                className="bg-blue-500 pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
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
