import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faTrash, faEdit} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Modal from './Modal'; // Assurez-vous que le chemin d'importation est correct
import Swal from 'sweetalert2';
import ModalTache from './ModalTache';
import { BASE_URL } from "../contextes/ApiUrls";
import axios from "axios";


function Service() {
  const [designation, setDesignation] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(null); // Track which row's options are open
  const [page, setPage] = useState(1); // Page actuelle
  const itemsPerPage = 15; // Nombre de prospects par page
  const [isModalTacheOpen, setIsModalTacheOpen] = useState(false);
  const [refreshService, setRefreshService] = useState(false);

  
  useEffect(() => {
    const fetchServices = async () => {  
      const tokenString = localStorage.getItem("token");
      let token = JSON.parse(tokenString);
  
      try {
        const response = await axios.get(`${BASE_URL}services`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

  
        if (response.status === 200) {
          setServices(response.data);
          console.log(response.data);
        }
      } catch (error) {
        if (error.response) {
          console.error("Erreur réponse API :", error.response);
          console.error("Statut :", error.response.status);
          console.error("Détails :", error.response.data);
        } else {
          console.error("Erreur de connexion :", error.message);
        }
      }
    };
  
    fetchServices();
  }, [refreshService]);
  

  const currentServices = services.slice(
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
  
  const formData = {
    designation,
    description
  };

  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const tokenString = localStorage.getItem("token");
    const token = JSON.parse(tokenString);

    try {
      console.log(formData);
      const response = await axios.post(`${BASE_URL}services`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      setRefreshService(!refreshService);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    try {
      const response = await axios.put(`${BASE_URL}services/${serviceToEdit.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setServices(
        services.map((service) =>
          service.id === response.data.id ? response.data : service
        )
      );
      resetFields();
      setIsEditModalOpen(false);
      setRefreshService(!refreshService);

      Swal.fire({
        title: "Succès!",
        text: "Modification de service avec succès!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      setErrorMessage("Erreur lors de la modification du service.");
      console.error("Erreur:", error);
    }
  }

    // Réinitialiser les champs lorsque le modal d'ajout est ouvert
    const resetFields = () => {
      setDesignation("");
      setDescription("");
    };

  // Réinitialisation des champs à l'ouverture du modal d'ajout
  useEffect(() => {
    if (isModalOpen) {
      resetFields(); // Réinitialiser les champs lorsque le modal s'ouvre
    }
  }, [isModalOpen]); // Ce useEffect se déclenche chaque fois que isModalOpen change

  const handleDeleteService = async (serviceToDelete) => {
    const confirmed = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      reverseButtons: true,
    });

    if (!confirmed.isConfirmed) {
      return;
    }

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
      <div>
        <ModalTache isOpen={isModalTacheOpen} onClose={() => setIsModalTacheOpen(false)} />
      </div>
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
        <div className="w-full border rounded-lg shadow-md">
          <div className="overflow-auto h-[500px]">
            <table className="min-w-full">
              <thead className="sticky top-0 bg-white shadow z-1">
                <tr>
                  <th className="p-4 text-left text-sm font-medium leading-6">Designation</th>
                  <th className="p-4 text-left text-sm font-medium leading-6">Description</th>
                  <th className="p-4 text-left text-sm font-medium leading-6">Tâche</th>
                  <th className="p-4 text-left text-sm font-medium leading-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentServices.map((service, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border-y p-4">{service.designation}</td>
                    <td className="border-y p-4">{service.description}</td>
                    <td className="border-y p-4">
                      {service.nombre_tâche}
                      <button
                        onClick={() => setIsModalTacheOpen(true)}
                        className="ml-2 px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                      >
                        +
                      </button>
                    </td>
                    <td className="border-y p-4">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setIsOptionsOpen(isOptionsOpen === index ? null : index)
                          }
                          className="p-2 hover:bg-gray-200 rounded"
                        >
                          <FontAwesomeIcon icon={faEllipsisV} />
                        </button>
                        {isOptionsOpen === index && (
                          <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-md">
                            <button
                              onClick={() => {
                                handleEditService(service);
                                setIsOptionsOpen(null); // Ferme le menu après l'édition
                              }}
                              className="text-blue-500 hover:text-blue-700 flex items-center mb-2 px-2 py-1"
                            >
                              <FontAwesomeIcon icon={faEdit} className="mr-2" />
                              Modifier
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteService(service.id);
                                setIsOptionsOpen(null);
                              }}
                              className="text-red-500 hover:text-red-700 flex items-center px-2 py-1"
                            >
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
        </div>


          <Modal isOpen={isModalOpen} onClose={() => {setIsModalOpen(false); setErrorMessage("");}}>
          <h2 className="text-xl">Ajouter un service</h2>
          <div className="grid grid-cols overflow-y-auto sm:grid-cols-1 max-h-[70vh]">
          <div className="">
        
          
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4">
            
            <div className="mb-4">
            <label className="block text-sm font-medium">Désignation</label>
            <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none py-0"
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
          </div></form></div></div>
        </Modal>


            <Modal isOpen={isEditModalOpen} onClose={() => {setIsEditModalOpen(false); setServiceToEdit(null)}}>
        <h2 className="text-lg font-semibold mb-4">Modifier le service</h2>
        <div className="grid grid-cols overflow-y-auto sm:grid-cols-1 max-h-[70vh]">
        <div className="sm:col-span-2">

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <form onSubmit={handleEditSubmit} className="mt-5 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4">
          <div className="mb-4">
          <label className="block text-sm font-medium">Désignation</label>
          <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>
          <div className="mb-4">
          <label className="block text-sm font-medium">Description</label>
          <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none py-0"
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
    </div>
  );
}

export default Service;

