import { useState, useEffect } from "react";
import axios from "axios";
import { FULL_URL } from "../contextes/ApiUrls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowLeft,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Link } from "react-router-dom";

function ProspectSCT() {
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
  const [showForm, setShowForm] = useState(false); // État pour gérer l'affichage du formulaire
  const [selectedProspectId, setSelectedProspectId] = useState(null);
  const toggleParameters = (id) => {
    setSelectedProspectId(selectedProspectId === id ? null : id);
  };

  // Fonction pour récupérer les données depuis l'API
  const fetchDataAndStore = async () => {
    try {
      const response = await axios.get(FULL_URL); // Remplace FULL_URL par l'URL de l'API pour récupérer les données
      if (response.status === 200 && response.data) {
        setProspects(response.data); // Mettre à jour l'état avec les données récupérées
        localStorage.setItem("dataKey", JSON.stringify(response.data));
        console.log(
          "Données récupérées et stockées dans localStorage:",
          response.data
        );
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  };

  useEffect(() => {
    fetchDataAndStore(); // Appeler la fonction lors du montage du composant
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newId = prospects.length
      ? Math.max(...prospects.map((p) => p.id)) + 1
      : 1;

    setErrorMessage(""); // Réinitialiser le message d'erreur

    // Vérification de l'email
    if (!email.includes("@") || !email.includes(".")) {
      setErrorMessage("Veuillez entrer une adresse e-mail valide.");
      return;
    }

    const formData = {
      id: newId,
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
      setShowForm(false); // Masquer le formulaire après soumission
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  return (
    <div>
      <div className="">
        <div>
          <nav className="rounded-md flex justify-between items-center p-4 bg-slate-600 text-white">
            {/* Élément à gauche */}
            <div>
              <Link to="/" className="text-lg">
                Tous les prospects
              </Link>
            </div>

            {/* Élément à droite */}
            <div className="">
              {/* Barre de recherche et boutons */}
              {showForm ? (
                <>
                  {/* Bouton Retour */}
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex items-center"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Retour
                  </button>
                </>
              ) : (
                <>
                  {/* Barre de recherche */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      className=" border text-gray-800 bg-slate-200 border-blue rounded"
                    />
                    <button className="px-2 py-1 text-white rounded ">
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>

                    <button
                      onClick={() => setShowForm(true)}
                      className="flex items-center text-white"
                    >
                      Ajouter
                      <button className="px-2 py-1 text-white rounded">
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                      </button>
                    </button>
                  </div>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Affichage de la liste des prospects ou du formulaire */}
      {showForm ? (
        <div>
          <br />
          {/* Type de client */}
          <div className="sm:col-span-3 w-60 mr-5">
            <label className=" block text-sm font-normal leading-6 text-gray-900">
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

          <form onSubmit={handleSubmit} className=" formContent flex mt-5">
            {/* Dénomination de la société (visible uniquement si Prospect) */}
            {type_client === "societe" && (
              <div className=" sm:col-span-3 w-60 mr-5">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Dénomination de la société
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    value={nom_societe}
                    onChange={(e) => setNomSociete(e.target.value)}
                    className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-blue-300 focus:ring-2 focus:ring-inset focus:ring-gray-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Nom complet du contact */}
            <div className="sm:col-span-3 w-60 mr-5">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Nom complet
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-blue-300 focus:ring-2 focus:ring-inset focus:ring-gray-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div className="sm:col-span-3 w-60 mr-5">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Email
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-blue-300 focus:ring-2 focus:ring-inset focus:ring-gray-500 focus:outline-none"
                />
              </div>
              {errorMessage && (
                <span className="text-red-600 text-sm">{errorMessage}</span>
              )}
            </div>

            {/* Téléphone */}
            <div className="sm:col-span-3 w-60 mr-5">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Téléphone
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-blue-300 focus:ring-2 focus:ring-inset focus:ring-gray-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Sexe du contact */}
            <div className="sm:col-span-3 w-60 mr-5">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Sexe
              </label>
              <div className="mt-2">
                <select
                  value={sexe}
                  onChange={(e) => setSexe(e.target.value)}
                  className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-blue-300 focus:ring-2 focus:ring-inset focus:ring-gray-500 focus:outline-none"
                >
                  <option value=""></option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                </select>
              </div>
            </div>

            {type_client === "societe" && (
              <>
                {/* Site web */}
                <div className="sm:col-span-3 w-60 mr-5">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Site Web
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={site_web}
                      onChange={(e) => setSiteWeb(e.target.value)}
                      className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-blue-300 focus:ring-2 focus:ring-inset focus:ring-gray-500 focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}
            {/* Adresse */}
            <div className="sm:col-span-3 w-60 mr-5">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Adresse
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-blue-300 focus:ring-2 focus:ring-inset focus:ring-gray-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Ville */}
            <div className="sm:col-span-3 w-60 mr-5">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Ville
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-blue-300 focus:ring-2 focus:ring-inset focus:ring-gray-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Pays */}
            <div className="sm:col-span-3 w-60 mr-5">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Pays
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  value={pays}
                  onChange={(e) => setPays(e.target.value)}
                  className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-blue-300 focus:ring-2 focus:ring-inset focus:ring-gray-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Numéro de siren */}
            <div className="sm:col-span-3 w-60 mr-5">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Numéro SIREN
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  value={numero_siren}
                  onChange={(e) => setNumeroSiren(e.target.value)}
                  className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-blue-300 focus:ring-2 focus:ring-inset focus:ring-gray-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="w-full mt-5">
              <button
                type="submit"
                className="mt-5 bg-blue-500 text-white p-2 rounded"
              >
                Soumettre
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <table className="min-w-full">
            <thead className="my-10 ">
              <tr className="h-20 ">
                <th className="text-left text-sm font-medium leading-6 ">
                  Type
                </th>
                <th className="text-left text-sm font-medium leading-6 ">
                  Nom société
                </th>
                <th className="text-left text-sm font-medium leading-6 ">
                  Nom
                </th>
                <th className="text-left text-sm font-medium leading-6 ">
                  Email
                </th>
              </tr>
            </thead>
            <tbody>
              {prospects.map((prospect) => (
                <tr key={prospect.id}>
                  <td className="border-y border-blue-300">
                    <Link to={`/Prospect/${prospect.id}`}>{prospect.type}</Link>
                  </td>
                  <td className="border-y border-blue-300">
                    <Link to={`/Prospect/${prospect.id}`}>
                      {prospect.nom_societe}
                    </Link>
                  </td>
                  <td className="border-y border-blue-300">
                    <Link to={`/Prospect/${prospect.id}`}>{prospect.nom}</Link>
                  </td>
                  <td className="border-y border-blue-300">{prospect.email}</td>
                  <td className="border-y border-blue-300"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProspectSCT;
