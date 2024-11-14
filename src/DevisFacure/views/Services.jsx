import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowLeft, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import React from "react";
import { Link } from 'react-router-dom';

function Service() {
  const [type_service, setTypeService] = useState("service");
  const [nom_produit, setNomProduit] = useState("");
  const [remarque, setRemarque] = useState("");
  const [unite, setUnite] = useState("");
  const [prix_base, setPrixBase] = useState("");
  const [prix_hors_tva, setPrixHorsTva] = useState("");
  const [tva, setTva] = useState("");
  const [prix_ttc, setPrixTtc] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // État pour le message d'erreur
  const [services, setServices] = useState([]); // État pour stocker les données récupérées
  const [showForm, setShowForm] = useState(false); // État pour gérer l'affichage du formulaire

  // Fonction pour récupérer les données depuis le localStorage
  const fetchDataFromLocalStorage = () => {
    const storedData = localStorage.getItem('servicesData');
    if (storedData) {
      setServices(JSON.parse(storedData));
    }
  };

  useEffect(() => {
    fetchDataFromLocalStorage(); // Appeler la fonction pour récupérer les données depuis le localStorage
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newService = { designation, description};
    setErrorMessage("");

    const updatedServices = [...services, newService];
    localStorage.setItem("services", JSON.stringify(updatedServices));
    setServices(updatedServices);

    resetFields();

    setIsModalOpen(false);
            Swal.fire({
              title: 'Succès!',
              text: 'Ajout de service avec succès!',
              icon: 'success',
              confirmButtonText: 'OK'
            });
  };

  useEffect(() => {
    if (isEditModalOpen && serviceToEdit) {
      setDesignation(serviceToEdit.designation || '');
      setDescription(serviceToEdit.description || '');
    } else if (!isEditModalOpen) {
      resetFields();
    }
  }, [isEditModalOpen, serviceToEdit]);


  const handleEditService = (service) => {
    setServiceToEdit(service);
    setDescription(service.description);
    setDesignation(service.designation);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedService = {designation, description};

    const updatedServices = services.map((service) =>
      service === serviceToEdit ? updatedService : service
    );
    localStorage.setItem("services", JSON.stringify(updatedServices));

    setServices(updatedServices);
    resetFields();

    setIsEditModalOpen(false);
            // Utiliser SweetAlert2 pour afficher une alerte de succès
            Swal.fire({
              title: 'Succès!',
              text: 'Modification de service avec succès!',
              icon: 'success',
              confirmButtonText: 'OK'
            });
  };

    // Réinitialiser les champs lorsque le modal d'ajout est ouvert
    const resetFields = () => {
      setDesignation("");
      setDescription("");
    const newService = {
      type_service,
      nom_produit,
      remarque,
      unite,
      prix_base,
      prix_hors_tva,
      tva,
      prix_ttc,
    };

    setErrorMessage(""); // Réinitialiser le message d'erreur

    const updatedServices = [...services, newService];
    setServices(updatedServices); // Mettre à jour l'état avec les nouveaux services

    // Mettre à jour le localStorage avec les nouvelles données
    localStorage.setItem('servicesData', JSON.stringify(updatedServices));

    // Réinitialiser tous les champs après la soumission
    setTypeService("");
    setNomProduit("");
    setRemarque("");
    setUnite("");
    setPrixBase("");
    setPrixHorsTva("");
    setTva("");
    setPrixTtc("");
    setShowForm(false); // Masquer le formulaire après soumission
  };

  return (
    <div>
      <div className="">
        <nav className="rounded-md flex justify-between items-center p-4 text-slate-900">
          {/* Élément à gauche */}
          <div>
            <Link to="/" className="text-2xl">
              Tous les services
            </Link>
          </div>

          {/* Élément à droite */}
          <div className="">
            {showForm ? (
              <button
                onClick={() => setShowForm(false)}
                className="flex items-center"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Retour
              </button>
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center"
              >
                Ajouter
                <FontAwesomeIcon icon={faPlus} className="ml-2" />
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* Affichage du formulaire ou de la liste des services */}
      {showForm ? (
        <div>
          <form onSubmit={handleSubmit} className="formContent flex mt-5">
            {/* Type de service */}
            <div className="sm:col-span-3 w-60 mr-5">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Type de service
              </label>
              <input
                type="text"
                value={type_service}
                onChange={(e) => setTypeService(e.target.value)}
                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
              />
            </div>

              <div className="sm:col-span-3 w-60 mr-5">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Type
              </label>
                <select
                  value={type_service}
                  onChange={(e) => setTypeService(e.target.value)}
                  className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
                >
                  <option value=""></option>
                  <option value="service">Service</option>
                  <option value="produit">Produit</option>
                </select>
            </div>

            {/* Nom du produit */}
            <div className="sm:col-span-3 w-60 mr-5">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Nom du produit
              </label>
              <input
                type="text"
                value={nom_produit}
                onChange={(e) => setNomProduit(e.target.value)}
                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
              />
            </div>

            {/* Remarque */}
            <div className="sm:col-span-3 w-60 mr-5">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Remarque
              </label>
              <input
                type="text"
                value={remarque}
                onChange={(e) => setRemarque(e.target.value)}
                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
              />
            </div>

            {/* Unité */}
            <div className="sm:col-span-3 w-60 mr-5">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Unité
              </label>
              <input
                type="text"
                value={unite}
                onChange={(e) => setUnite(e.target.value)}
                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
              />
            </div>

            {/* Prix de base */}
            <div className="sm:col-span-3 w-60 mr-5">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Prix de base
              </label>
              <input
                type="text"
                value={prix_base}
                onChange={(e) => setPrixBase(e.target.value)}
                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
              />
            </div>

            {/* Prix hors TVA */}
            <div className="sm:col-span-3 w-60 mr-5">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Prix hors TVA
              </label>
              <input
                type="text"
                value={prix_hors_tva}
                onChange={(e) => setPrixHorsTva(e.target.value)}
                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
              />
            </div>

            {/* TVA */}
            <div className="sm:col-span-3 w-60 mr-5">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                TVA
              </label>
              <input
                type="text"
                value={tva}
                onChange={(e) => setTva(e.target.value)}
                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
              />
            </div>

            {/* Prix TTC */}
            <div className="sm:col-span-3 w-60 mr-5">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Prix TTC
              </label>
              <input
                type="text"
                value={prix_ttc}
                onChange={(e) => setPrixTtc(e.target.value)}
                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
              />
            </div>

            <div className="w-full mt-5">
              <button type="submit" className="mt-5 bg-blue-500 text-white p-2 rounded">
                Soumettre
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="w-full border rounded-lg shadow-md">
          <table className="min-w-full ">
            <thead className="">
              <tr className="">
                <th className="p-4 text-left text-sm font-medium leading-6 border-b-10">Type</th>
                <th className="p-4 text-left text-sm font-medium leading-6">Nom du produit</th>
                <th className="p-4 text-left text-sm font-medium leading-6">Remarque</th>
                <th className="p-4 text-left text-sm font-medium leading-6">Unité</th>
                <th className="p-4 text-left text-sm font-medium leading-6">Prix de base</th>
                <th className="p-4 text-left text-sm font-medium leading-6">Prix hors TVA</th>
                <th className="p-4 text-left text-sm font-medium leading-6">TVA</th>
                <th className="p-4 text-left text-sm font-medium leading-6">Prix TTC</th>
              </tr>
            </thead>
            <tbody className="border-gray-300  ">
              {services.map((service, index) => (
                <tr key={index} className="">
                  <td className="border-y p-4">{service.type_service}</td>
                  <td className="border-y p-4">{service.nom_produit}</td>
                  <td className="border-y p-4">{service.remarque}</td>
                  <td className="border-y p-4">{service.unite}</td>
                  <td className="border-y p-4">{service.prix_base}</td>
                  <td className="border-y p-4">{service.prix_hors_tva}</td>
                  <td className="border-y p-4">{service.tva}</td>
                  <td className="border-y p-4">{service.prix_ttc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Service;
