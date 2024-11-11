import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faTrash, faEdit} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Modal from './Modal'; // Assurez-vous que le chemin d'importation est correct
import Swal from 'sweetalert2';

function Service() {
  const [type_service, setTypeService] = useState("service");
  const [nom_produit, setNomProduit] = useState("");
  const [remarque, setRemarque] = useState("");
  const [unite, setUnite] = useState("");
  const [prix_base, setPrixBase] = useState("");
  const [prix_hors_tva, setPrixHorsTva] = useState("");
  const [tva, setTva] = useState("");
  const [prix_ttc, setPrixTtc] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(null); // Track which row's options are open
  const [page, setPage] = useState(1); // Page actuelle
  const itemsPerPage = 4; // Nombre de prospects par page

  useEffect(() => {
    // Récupérer les services depuis le localStorage
    const fetchServicesFromLocalStorage = () => {
      const storedServices = JSON.parse(localStorage.getItem("services")) || [];
      setServices(storedServices);
    };

    fetchServicesFromLocalStorage();
  }, []);

  const currentProspects = services.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  const handleNext = () => {
    if (page < Math.ceil(services.length / itemsPerPage)) {
      setPage(page + 1);
    }
  };
  
  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const newService = { type_service, nom_produit, remarque, unite, prix_base, prix_hors_tva, tva, prix_ttc };
    setErrorMessage("");

    const updatedServices = [...services, newService];
    localStorage.setItem("services", JSON.stringify(updatedServices));
    setServices(updatedServices);

    // Réinitialiser les champs et fermer le modal
    setTypeService("");
    setNomProduit("");
    setRemarque("");
    setUnite("");
    setPrixBase("");
    setPrixHorsTva("");
    setTva("");
    setPrixTtc("");
    setIsModalOpen(false);
            // Utiliser SweetAlert2 pour afficher une alerte de succès
            Swal.fire({
              title: 'Succès!',
              text: 'Ajout de service avec succès!',
              icon: 'success',
              confirmButtonText: 'OK'
            });
  };

  const handleEditService = (service) => {
    setServiceToEdit(service);
    setTypeService(service.type_service);
    setNomProduit(service.nom_produit);
    setRemarque(service.remarque);
    setUnite(service.unite);
    setPrixBase(service.prix_base);
    setPrixHorsTva(service.prix_hors_tva);
    setTva(service.tva);
    setPrixTtc(service.prix_ttc);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedService = { type_service, nom_produit, remarque, unite, prix_base, prix_hors_tva, tva, prix_ttc };

    const updatedServices = services.map((service) =>
      service === serviceToEdit ? updatedService : service
    );
    localStorage.setItem("services", JSON.stringify(updatedServices));

    setServices(updatedServices);

    setTypeService("");
    setNomProduit("");
    setRemarque("");
    setUnite("");
    setPrixBase("");
    setPrixHorsTva("");
    setTva("");
    setPrixTtc("");
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
      setTypeService("service");
      setNomProduit("");
      setRemarque("");
      setUnite("");
      setPrixBase("");
      setPrixHorsTva("");
      setTva("");
      setPrixTtc("");
    };


  // Réinitialisation des champs à l'ouverture du modal d'ajout
  useEffect(() => {
    if (isModalOpen) {
      resetFields(); // Réinitialiser les champs lorsque le modal s'ouvre
    }
  }, [isModalOpen]); // Ce useEffect se déclenche chaque fois que isModalOpen change

  const handleDeleteService = async (serviceToDelete) => {
    // Utilisation de SweetAlert2 pour la confirmation
    const confirmed = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      reverseButtons: true, // Pour inverser les boutons
    });

    if (!confirmed.isConfirmed) {
      return; // Si l'utilisateur annule, ne rien faire
    }

    // Filtrer les services pour supprimer celui sélectionné
    const updatedServices = services.filter(service => service !== serviceToDelete);

    // Mettre à jour le localStorage avec la nouvelle liste de services
    localStorage.setItem('services', JSON.stringify(updatedServices));

    // Mettre à jour l'état des services
    setServices(updatedServices);

    // Afficher un message de succès
    Swal.fire('Supprimé!', 'Le service a été supprimé.', 'success');
  };

  return (
    <div>
            <div className="">
        <div>
          <nav className="rounded-md flex justify-between items-center p-4 ">
            <div>
              <Link className="text-2xl ">
                Tous les services
              </Link>
            </div>
           </nav>
        </div>
      </div>
      <div className="flex flex-wrap">
      <div className="w-full md:w-10/12 sm:w-10/12">
      <div className="flex items-center space-x-2">
        <nav>
          <button onClick={() => {setIsModalOpen(true); setIsEditModalOpen(false)}} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
            Nouveau service
          </button>
        </nav>
        </div>
        </div>

        <div className="w-full md:w-2/12 sm:w-2/12 ml-auto">
            <div className="flex mb-4 m-auto py-2">
            <button 
      onClick={handlePrev} 
      disabled={page === 1} 
      className={`px-4 py-1 border rounded ${page === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600"}`}
    >
      Prev
    </button>
    <button 
      onClick={handleNext} 
      disabled={page >= Math.ceil(services.length / itemsPerPage)} 
      className={`px-4 py-1 border rounded ${page >= Math.ceil(services.length / itemsPerPage) ? "text-gray-400 cursor-not-allowed" : "text-blue-600"}`}
    >
      Next
    </button>

            </div>
          </div>
          
      </div>

      {/* Table d'affichage des services */}
      <div className="w-full border rounded-lg shadow-md overflow-auto h-[600px]">
      <table className="min-w-full">
          <thead>
            <tr>
              <th className="p-4 text-left text-sm font-medium leading-6">Type</th>
              <th className="p-4 text-left text-sm font-medium leading-6">Nom du produit</th>
              <th className="p-4 text-left text-sm font-medium leading-6">Remarque</th>
              <th className="p-4 text-left text-sm font-medium leading-6">Unité</th>
              <th className="p-4 text-left text-sm font-medium leading-6">Prix de base</th>
              <th className="p-4 text-left text-sm font-medium leading-6">Prix hors TVA</th>
              <th className="p-4 text-left text-sm font-medium leading-6">TVA</th>
              <th className="p-4 text-left text-sm font-medium leading-6">Prix TTC</th>
            </tr>
          </thead>
          <tbody>
            {currentProspects.map((service, index) => (
              <tr key={index}>
                <td className="border-y p-4">{service.type_service}</td>
                <td className="border-y p-4">{service.nom_produit}</td>
                <td className="border-y p-4">{service.remarque}</td>
                <td className="border-y p-4">{service.unite}</td>
                <td className="border-y p-4">{service.prix_base}</td>
                <td className="border-y p-4">{service.prix_hors_tva}</td>
                <td className="border-y p-4">{service.tva}</td>
                <td className="border-y p-4">{service.prix_ttc}</td>
                <td className="border-y p-4">
                  <div className="relative">
                    <button  onClick={() => setIsOptionsOpen(isOptionsOpen === index ? null : index)}>
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                    {isOptionsOpen === index && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-md z-10">
                        <button 
                    onClick={() => {
                      handleEditService(service);
                      setIsOptionsOpen(null); // Ferme le menu après l'édition
                    }}                          
                    className="text-blue-500 hover:text-blue-700 flex items-center mb-2">
                        <FontAwesomeIcon icon={faEdit} className="mr-2" />                          
                          Modifier
                        </button>
                        <button 
                    onClick={() => {
                      handleDeleteService(service);
                      setIsOptionsOpen(null); // Ferme le menu après la suppression
                    }}                          
                    className="text-red-500 hover:text-red-700 flex items-center">
                        <FontAwesomeIcon icon={faTrash} className="mr-2" />
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

        <Modal isOpen={isModalOpen} onClose={() => {setIsModalOpen(false); setErrorMessage("");}}>
        <h2 className="text-xl">
          {type_service === "produit" ? "Ajouter un produit" : "Ajouter un service"}
        </h2>
        <div className="grid grid-cols overflow-y-auto sm:grid-cols-1 max-h-[70vh]">
        <div className="sm:col-span-2">
        <div className="my-2">
          <label className="block text-sm font-normal leading-6 text-gray-900">
            Type
          </label>
          <div className="mt-2 flex space-x-4">
              <label>
                <input
                  type="radio"
                  value="service"
                  checked={type_service === "service"}
                  onChange={() => setTypeService("service")}
                  className="mr-2"
                />
                Service
              </label>
              <label>
                <input
                  type="radio"
                  value="produit"
                  checked={type_service === "produit"}
                  onChange={() => setTypeService("produit")}
                  className="mr-2"
                />
                Produit
              </label>
            </div>
        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <div className="mb-4">
          <label className="block text-sm font-medium">
    {type_service === "produit" ? "Nom du produit" : "Nom du service"}
  </label>          <input
              type="text"
              value={nom_produit}
              onChange={(e) => setNomProduit(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">{type_service === "produit" ? "Remarque" : "Description"}</label>
            <textarea
              value={remarque}
              onChange={(e) => setRemarque(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none h-full"
            />
          </div>
          {type_service  === "produit" && (
          <div className="mb-4">
            <label className="block text-sm font-medium">Unité</label>
            <input
              type="text"
              value={unite}
              onChange={(e) => setUnite(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>)}

          <div className="mb-4">
            <label className="block text-sm font-medium">Prix de base</label>
            <input
              type="number"
              value={prix_base}
              onChange={(e) => setPrixBase(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Prix hors TVA</label>
            <input
              type="number"
              value={prix_hors_tva}
              onChange={(e) => setPrixHorsTva(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">TVA</label>
            <input
              type="number"
              value={tva}
              onChange={(e) => setTva(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Prix TTC</label>
            <input
              type="number"
              value={prix_ttc}
              onChange={(e) => setPrixTtc(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>
          <br />
        <div className="sm:col-span-1 py-2">
          <button
            type="submit"
            className="bg-blue-500 pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
          >
            Enregistrer
          </button>
        </div>       </form>
        </div>            </div>
      </Modal>


          <Modal isOpen={isEditModalOpen} onClose={() => {setIsEditModalOpen(false); setServiceToEdit(null)}}>
      <h2 className="text-lg font-semibold mb-4">{type_service === "produit" ? "Modifier le produit" : "Modifier le service"}
      </h2>
      <div className="grid grid-cols overflow-y-auto sm:grid-cols-1 max-h-[70vh]">
      <div className="sm:col-span-2">

        <div className="my-2">
          <label className="block text-sm font-normal leading-6 text-gray-900">
            Type
          </label>
          <div className="mt-2 flex space-x-4">
              <label>
                <input
                  type="radio"
                  value="service"
                  checked={type_service === "service"}
                  onChange={() => setTypeService("service")}
                  className="mr-2"
                />
                Service
              </label>
              <label>
                <input
                  type="radio"
                  value="produit"
                  checked={type_service === "produit"}
                  onChange={() => setTypeService("produit")}
                  className="mr-2"
                />
                Produit
              </label>
            </div>
        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <form onSubmit={handleEditSubmit} className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        <div className="mb-4">
        <label className="block text-sm font-medium">
    {type_service === "produit" ? "Nom du produit" : "Nom du service"}
  </label>        <input
            type="text"
            value={nom_produit}
            onChange={(e) => setNomProduit(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>
        <div className="mb-4">
        <label className="block text-sm font-medium">{type_service === "produit" ? "Remarque" : "Description"}</label>
        <textarea
            value={remarque}
            onChange={(e) => setRemarque(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 h-full rounded-md focus:outline-none"
          />
        </div>
        {type_service  === "produit" && (
        <div className="mb-4">
          <label className="block text-sm font-medium">Unité</label>
          <input
            type="text"
            value={unite}
            onChange={(e) => setUnite(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>            )}

        <div className="mb-4">
          <label className="block text-sm font-medium">Prix de base</label>
          <input
            type="number"
            value={prix_base}
            onChange={(e) => setPrixBase(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Prix hors TVA</label>
          <input
            type="number"
            value={prix_hors_tva}
            onChange={(e) => setPrixHorsTva(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md  focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">TVA</label>
          <input
            type="number"
            value={tva}
            onChange={(e) => setTva(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none "
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Prix TTC</label>
          <input
            type="number"
            value={prix_ttc}
            onChange={(e) => setPrixTtc(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>
        <br />
        <div className="sm:col-span-1 py-2">
          <button
            type="submit"
            className="bg-blue-500 pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-400 focus:outline-none"
          >
            Enregistrer
          </button>
        </div>
      </form></div></div>
    </Modal>
    </div>
  );
}

export default Service;
