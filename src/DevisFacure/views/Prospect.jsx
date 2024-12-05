import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { BASE_URL } from "../contextes/ApiUrls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash, faEdit,
  faEllipsisV,
  faFile,
  faBuilding,
  faHome,
  faLaptop
} from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import Modal from './Modal';
import Notiflix from 'notiflix';
import React from "react";
import Select from 'react-select';
import useGeonames from '../contextes/useGeonames';
import { UrlContext } from "../../contexte/useUrl";
import { ShowContext } from "../../contexte/useShow";
import { Skeleton } from "@/components/ui/skeleton";


function ProspectSCT() {
  const { countriesAndCities, loading, error } = useGeonames();
  const [filteredCities, setFilteredCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 

  const [isFirstModalOpen, setFirstModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 25;

  const [type_client, setTypeClient] = useState("societe");
  const [tel_societe, setTel_societe] = useState("");
  const [email_societe, setEmail_societe] = useState("");
  const [nom_societe, setNomSociete] = useState("");
  const [site_web, setSiteWeb] = useState("");
  const [numero_siren, setNumeroSiren] = useState("");
  const [numero_siret, setNumeroSiret] = useState("");
  const [affiliation_tva, setaffiliation_tva] = useState(false);
  const [numero_tva, setnumero_tva] = useState("");

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [sexe, setSexe] = useState("");
  const [telephone, setTelephone] = useState("");
  
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState(null);
  const [pays, setPays] = useState(null);
  

  const [prospects, setProspects] = useState([]);
  const [prospectToEdit, setProspectToEdit] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [showActionsIdProsp, setShowActionsIdProsp] = useState(null);
  
  const { url } = useContext(UrlContext);
  const { setShowSpinner, showAdmin } = useContext(ShowContext);

  useEffect(() => {
    if (!isFirstModalOpen) {
      resetFormFields();
    }
  }, [isFirstModalOpen]);


  useEffect(() => {
    const fetchData = async () => {
      const tokenString = localStorage.getItem("token");
      let token = JSON.parse(tokenString);
      setIsLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}clients`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setProspects(response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        Notiflix.Notify.failure("Erreur lors de la récupération des données:");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [refresh]);

  const currentProspects = prospects.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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

  const handleCountryChange = (selectedCountry) => {
    setPays(selectedCountry);
    setVille(null);
    const country = countriesAndCities.find((c) => c.pays === selectedCountry.value);
    setFilteredCities(country ? country.villes : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowSpinner(true);
    let errors = [];

    
    if (type_client === "societe") {
      if (!nom_societe) errors.push("Le nom de la société est requis.");
      if (!email_societe || !validateEmail(email_societe))
        errors.push("L'adresse email de la société est invalide.");
      if (!adresse) errors.push("L'adresse est requise.");
      if (!pays) errors.push("Le pays est requis.");
      if (!ville) errors.push("La ville est requise.");
      if (!nom) errors.push("Le nom du contact est requis.");
      if (!email || !validateEmail(email))
        errors.push("L'adresse email du contact est invalide.");
      if (!telephone) errors.push("Le numéro de téléphone du contact est requis.");
    } else {
      if (!nom) errors.push("Le nom complet est requis.");
      if (!email || !validateEmail(email))
        errors.push("L'adresse email est invalide.");
      if (!telephone) errors.push("Le numéro de téléphone est requis.");
      if (!pays) errors.push("Le pays est requis.");
      if (!ville) errors.push("La ville est requise.");
      if (!adresse) errors.push("L'adresse est requise.");
    }

    if (errors.length > 0) {
      setShowSpinner(false);
      Notiflix.Notify.failure(errors.join("\n"));
      return;
    }
  
    const formData = {
      nom_societe: type_client === "societe" ? nom_societe : "",
      email_societe: type_client === "societe" ? email_societe : "",
      affilation_tva: String(affiliation_tva),
      numero_tva,
      tel_societe,
      numero_siren,
      numero_siret,
      nom,
      email,
      sexe,
      telephone,
      site_web,
      adresse,
      ville: ville?.value,
      pays: pays?.value,
      type: type_client,
    };
  
    const tokenString = localStorage.getItem("token");
    const token = JSON.parse(tokenString);
    try {
      if(!prospectToEdit.id) {
        const response = await axios.post(`${url}/api/clients`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        Notiflix.Notify.success("Client ajouté avec succès !");
      }else{
        const response = await axios.put(`${BASE_URL}clients/${prospectToEdit.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Notiflix.Notify.success("Client modifié avec succès !");
      }
  
      setShowSpinner(false);

      resetFormFields();
      setRefresh(!refresh);
  
      setFirstModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      if (error.response?.data?.message) {
        Notiflix.Notify.failure(error.response.data.message);
      } else {
        Notiflix.Notify.failure("Une erreur inattendue s'est produite. Veuillez réessayer.");
      }
      setShowSpinner(false);
    }
  };
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const resetFormFields = () => {
    setProspectToEdit({});
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
    setEmail_societe("");
    setaffiliation_tva(false);
    setnumero_tva("");
    setTel_societe("");
    setNumeroSiret("");
  };


  const handleDelete = async (prospectId) => {
    setShowActionsIdProsp((prevId) => (prevId === prospectId ? null : prospectId));
  
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
      const response = await axios.delete(`${BASE_URL}clients/${prospectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response) {
        setRefresh(!refresh);
      }
      Notiflix.Report.success(
        'Succès',
        'Client supprimé avec succès.',
        'Fermer'
      );
    } catch (error) {
      console.error('Erreur lors de la suppression des données :', error);
      Notiflix.Report.failure(
        'Echec',
        'Echec lors de la suppression du client.',
        'Fermer'
      );
    }
  };


  const handleEditClick = async (id) => {
    setShowActionsIdProsp((prevId) => (prevId === id ? null : id));
    setShowSpinner(true);
    resetFormFields();
    setProspectToEdit({ id: id });

    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    try {
      const response = await axios.get(`${BASE_URL}clients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setNomSociete(response.data.nom_societe);
        setNom(response.data.nom);
        setEmail(response.data.email);
        setSexe(response.data.sexe);
        setTelephone(response.data.telephone);
        setSiteWeb(response.data.site_web);
        setAdresse(response.data.adresse);
        setPays({ value: response.data.pays, label: response.data.pays });
        setVille({ value: response.data.ville, label: response.data.ville });
        setNumeroSiren(response.data.numero_siren);
        setTypeClient(response.data.type);
        setEmail_societe(response.data.email);
        setaffiliation_tva(Boolean(response.data.affilation_tva));
        setnumero_tva(response.data.numero_tva);
        setTel_societe(response.data.tel_societe);
        setNumeroSiret(response.data.numero_siret);
        setShowSpinner(false);
        setFirstModalOpen(true);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données du prospect:", error);
      Notiflix.Notify.failure("Erreur lors de la récupération des données du prospect:");
    }
  };

  
  
  return (
    <>
      <div className="w-full mb-3 ">
        <button onClick={() => setFirstModalOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Nouveau Client
        </button>
      </div>
      
      <div className="flex flex-wrap align-center">
        <div className="w-full md:w-10/12 sm:w-10/12">
          <h1 className="text-sm" style={{ fontFamily: "Righteous" }}>Tous les clients</h1>
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

      <div className="w-full border rounded-lg shadow-md p-0 relative overflow-x-auto">
        <div className="divide-y divide-gray-200 p-0 bg-slate-100 font-bold z-0 min-w-[1000px]">
          <div className="grid grid-cols-[5fr,5fr,4fr,4fr,3fr,1fr] px-4 py-2">
            <div>Nom société</div>
            <div>Nom du contact</div>
            <div>Téléphone du contact</div>
            <div>Email du contact</div>
            <div className="text-center">Pièces Jointes</div>
            <div></div>
          </div>
        </div>
        <div className="divide-y divide-gray-200 p-0 h-[600px] overflow-y-auto min-w-[1000px]">
          {isLoading ? (
            <div className="w-full  border-0 mt-2">
            <div className="flex flex-col space-y-3">
              <Skeleton className="bg-gray-100 h-10 w-[90%] rounded" />
              <div className="space-y-3">
                <Skeleton className="bg-gray-100 h-5 w-[90%]" />
                <Skeleton className="h-4 w-[75%]" />
                <Skeleton className=" h-4 w-[50%]" />
              </div>
              <div className="space-y-3">
                <Skeleton className="bg-gray-100 h-5 w-[90%]" />
                <Skeleton className="h-4 w-[75%]" />
                <Skeleton className=" h-4 w-[50%]" />
              </div>
            </div>
          </div>
          ) : (
            <>
              {currentProspects.map((prospect) => (
                <React.Fragment key={prospect.id}>
                  <div className="grid grid-cols-[5fr,5fr,4fr,4fr,3fr,1fr] px-4 py-2 font-normal hover:shadow-md hover:bg-slate-50">
                    <Link to={`${prospect.id}`}>
                      <div>
                      {prospect.type === 'societe' 
                        ? (<>
                          <h1 className="font-extrabold pb-1"><FontAwesomeIcon icon={faBuilding} className='mr-2'/>{prospect.nom_societe} (Société)</h1>
                          <p>{prospect.email_societe}<br></br>{prospect.tel_societe}</p>
                        </>)
                        : prospect.type === 'particulier'
                        ? (<>
                            <h1 className="font-extrabold pb-1"><FontAwesomeIcon icon={faHome} className='mr-2'/>{prospect.nom} (Particulier)</h1>
                            <p>{prospect.email}<br></br>{prospect.telephone}</p>
                          </>)
                        : (<>
                          <h1 className="font-extrabold pb-1"><FontAwesomeIcon icon={faLaptop} className='mr-2'/>{prospect.nom} (Auto-Entrepreneur)</h1>
                          <p>{prospect.email}<br></br>{prospect.telephone}</p>
                        </>)}
                      </div>
                    </Link>
                    <Link to={`${prospect.id}`}><div>{prospect.nom}</div></Link>
                    <Link to={`${prospect.id}`}><div>{prospect.telephone}</div></Link>
                    <Link to={`${prospect.id}`}><div>{prospect.email}</div></Link>
                    <Link to={`${prospect.id}`}>
                      <div className="text-center" title="Nombre de pièces jointe">
                        {(() => {
                          let nb_link = 0;
                          let nb_linkShow = '';
                          if (prospect.assurance) {nb_link = nb_link + 1;}
                          if (prospect.cabisse) {nb_link = nb_link + 1;}
                          if (prospect.piece_identite) {nb_link = nb_link + 1;}
                          if (prospect.contrats) {nb_link = nb_link + 1;}
                          nb_link = nb_link + prospect.files.length;
                          nb_linkShow = (nb_link > 9) ? '+9' : nb_link;
                          return (
                            <>
                              ({nb_linkShow}) P.J
                            </>
                          );
                        })()}
                      </div>
                    </Link>
                    <div className="relative text-right">
                      <button
                        onClick={() => toggleActions(prospect.id)}
                        className="rounded hover:text-red-500"
                      >
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>
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
                    </div>
                  </div>
                </React.Fragment>
              ))}
              {prospects.length === 0 && <p className="text-slate-400"><i>Aucun prospect disponible.</i></p>}
            </>
          )}
        </div>
    </div>

    <Modal 
      isOpen={isFirstModalOpen} 
      onClose={() => {
        setFirstModalOpen(false);}}>
        <h2 className="text-sm font-semibold mb-2">Nouveau client :</h2>
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 bg-white">
          <div className="sm:col-span-1 p-1">
              {/* Option Société */}
              <div
                onClick={() => setTypeClient("societe")}
                className={`cursor-pointer px-4 py-2 border rounded-lg ${
                  type_client === "societe"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                Société
              </div>
            </div>
            <div className="sm:col-span-1 p-1">
              {/* Option Particulier */}
              <div
                onClick={() => setTypeClient("Auto-Entrepreneur")}
                className={`cursor-pointer px-4 py-2 border rounded-lg ${
                  type_client === "Auto-Entrepreneur"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                Auto-Entrepreneur
              </div>
            </div>
            <div className="sm:col-span-1 p-1">
              {/* Option Particulier */}
              <div
                onClick={() => setTypeClient("particulier")}
                className={`cursor-pointer px-4 py-2 border rounded-lg ${
                  type_client === "particulier"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                Particulier
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
              <div className="max-h-[55vh] overflow-y-auto px-4">
                {type_client === "societe" && (
                    <>
                      <hr className="my-2"></hr>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
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

                        <div className="sm:col-span-1">
                          <label className="block text-sm font-medium leading-6 text-gray-900">
                            Email de la société
                          </label>
                          <input
                            type="text"
                            value={email_societe}
                            onChange={(e) => setEmail_societe(e.target.value)}
                            className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-1">
                          <label className="block text-sm font-medium leading-6 text-gray-900">
                            Téléphone de la société
                          </label>
                          <input
                            type="text"
                            value={tel_societe}
                            onChange={(e) => setTel_societe(e.target.value)}
                            className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-1">
                          <label className="block text-sm font-medium leading-6 text-gray-900">
                            Numéro Siren
                          </label>
                          <input
                            type="text"
                            value={numero_siren}
                            onChange={(e) => setNumeroSiren(e.target.value)}
                            className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-1">
                          <label className="block text-sm font-medium leading-6 text-gray-900">
                            Numéro SIRET
                          </label>
                          <input
                            type="text"
                            value={numero_siret}
                            onChange={(e) => setNumeroSiret(e.target.value)}
                            className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-1">
                          <label className="block text-sm font-medium leading-6 text-gray-900">
                            Affiliation TVA
                          </label>
                          <select
                              value={affiliation_tva}
                              onChange={(e) => setaffiliation_tva(e.target.value === "true")}
                              className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
                          >
                              <option value="true">Oui</option>
                              <option value="false">Non</option>
                          </select>
                        </div>

                        {affiliation_tva && (
                          <div className="sm:col-span-1">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                              Numéro TVA
                            </label>
                            <input
                              type="text"
                              value={numero_tva}
                              onChange={(e) => setnumero_tva(e.target.value)}
                              className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
                            />
                          </div>
                        )}

                      </div>
                      <hr className="my-4"></hr>
                    </>
                  )}
              
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-2 mb-2">
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {type_client === "societe" ? "Nom complet du contact" : "Nom complet"}
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
                      {type_client === "societe" ? "Email du contact" : "Adresse e-mail"}
                    </label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                      {type_client === "societe" ? "Téléphone du contact" : "Numéro de téléphone"}
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
                      Genre
                    </label>
                    <select
                        value={sexe}
                        onChange={(e) => setSexe(e.target.value)}
                        className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
                    >
                      <option value=""></option>
                      <option value="Masculin">Masculin</option>
                      <option value="Féminin">Féminin</option>
                      <option value="Non Precisé">Non Precisé</option>
                    </select>
                  </div>
              </div>

              <hr className="my-2"></hr>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-2 mb-2">
                {loading && <p>Chargement...</p>}
                {error && <p>{error}</p>}

                {!loading && !error && (
                    <>
                      {/* Select pour les pays */}
                      <div className="sm:col-span-1">
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                          Pays
                        </label>
                        <Select value={pays}
                          options={countriesAndCities.map((country) => ({
                            value: country.pays,
                            label: country.pays,
                          }))}
                          onChange={handleCountryChange}
                          placeholder="Sélectionnez un pays"
                          className="basic-select"
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }), 
                          }}
                        />
                      </div>

                      {/* Select pour les villes */}
                      <div className="sm:col-span-1">
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                          Ville
                        </label>
                        <Select
                          options={filteredCities.map((city) => ({
                            value: city,
                            label: city,
                          }))}
                          value={ville}
                          onChange={(selectedOption) => setVille(selectedOption)}
                          placeholder="Sélectionnez une ville"
                          className="basic-select z-30"
                          isDisabled={!filteredCities.length}
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                        />
                      </div>
                    </>
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
              </div>
              </div>

            <div className="w-[300px] max-w-[100%] py-2 mt-5">
              <button 
                type="submit"
                className="bg-blue-500 px-3 block w-full rounded-md border-0 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none">
                Enregistrer
              </button>
            </div>
          </form>

    </Modal>

    </>
  );
}

export default ProspectSCT;