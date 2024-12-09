import { useContext, useEffect, useState } from "react";
import "../styles/GestionUserPage.css";
import {
  faTrash,
  faList,
  faGrip,
  faEllipsis,
  faRotate,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ShowContext } from "../contexte/useShow";
import { UrlContext } from "../contexte/useUrl";
import { MessageContext } from "../contexte/useMessage";
import { UserContext } from "../contexte/useUser";
import Tippy from "@tippyjs/react";
import { Skeleton } from "@/components/ui/skeleton";
import Notiflix from 'notiflix';

import axios from "axios";
import Modal from '../DevisFacure/views/Modal';

export default function GestionUserPage() {
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [showMessageErrorEmail, setShowMessageErrorEmail] = useState(false);
  const [showList, setShowList] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState("");
  const [grade, setGrade] = useState("");

  const { setShowDeleteUser, setShowSpinner, showSkeletreonUser } =
    useContext(ShowContext);
  const { url } = useContext(UrlContext);
  const { getAllUser, ListeUser, setIduser } = useContext(UserContext);
  const { setMessageSucces, setMessageError } = useContext(MessageContext);
  const [isFirstModalOpen, setFirstModalOpen] = useState(false);

  const [departementOption, setdepartementOption] = useState([]);
  const [depatementID, setDepartementId] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [creer, setCreer] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartement, setSelectedDepartement] = useState(null);

  const toggleUserSelection = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === ListeUser.length) {
      setSelectedUsers([]);
    } else {
      const allUserIds = ListeUser.map((user) => user.id);
      setSelectedUsers(allUserIds);
    }
  };

  const toggleDropdown = (index) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  function deleteuser(id) {
    setIduser(id);
    setShowDeleteUser(true);
  }

  function switchToListOrGrid() {
    setShowGrid(!showGrid);
    setShowList(!showList);
  }

  const fetchDepartements = async () => {
    const tokenString = localStorage.getItem("token");
    const token = JSON.parse(tokenString);
  
    try {
      const response = await axios.get(`${url}/api/departements`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setdepartementOption(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  function handleGroupAction(action) {
    if (action === "changeDepartment") {
      ChangerDepartementSelection();
    } else if (action === "deleteUsers") {
      SupprimerUserSelection();
    }
  }

  const ChangerDepartementSelection = () => {
    if (selectedUsers.length === 0) {
      Notiflix.Notify.warning("Aucun utilisateur sélectionné.");
      return;
    }
    setFirstModalOpen(true);
    setCreer(false);
  }

  const ModifierDepartementAll = () => {
    if (selectedUsers.length === 0) {
      Notiflix.Notify.warning("Aucun utilisateur sélectionné.");
      return;
    }
  
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    const token = JSON.parse(tokenString);

    let formData = {
      employeIds: selectedUsers,
      gest_r_h_departement_id: selectedDepartement
    }
  
    axios
      .put(
        `${url}/api/employes/update-department`, formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setMessageSucces(response.data.message);
        getAllUser();
        setSelectedUsers([]);
        setFirstModalOpen(false);
        setShowSpinner(false);
        setTimeout(() => {
          setMessageSucces("");
        }, 5000);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  };  

  const confirmAction = (title, message) => {
    return new Promise((resolve) => {
      Notiflix.Confirm.show(
        title,
        message,
        'Oui',
        'Non',
        () => resolve(true),
        () => resolve(false)
      );
    });
  };

  const SupprimerUserSelection = async () => {
    if (selectedUsers.length === 0) {
      Notiflix.Notify.warning("Aucun utilisateur sélectionné.");
      return;
    }
    const confirmed = await confirmAction(
      'Confirmer',
      'Êtes-vous sûr de vouloir supprimer ?'
    );
    if (!confirmed) return;
    try {
      setShowSpinner(true);
      const tokenString = localStorage.getItem("token");
      const token = JSON.parse(tokenString);
      const response = await axios.delete(`${url}/api/employes/supprimer-multiples`, {
        data: { employeIds: selectedUsers },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setMessageSucces(response.data.message);
      getAllUser();
      setSelectedUsers([]);
      setTimeout(() => setMessageSucces(""), 5000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erreur lors de la suppression.";
      Notiflix.Notify.failure(errorMessage);
      console.error("Erreur :", err);
    } finally {
      setShowSpinner(false);
    }
  };
  

  useEffect(() => {
    setGrade("membre");
    getAllUser();
    fetchDepartements();
  }, []);

  function inviterMembre() {
    const idDepRacineString = localStorage.getItem("idDepRacine");
    let idDepRacine = JSON.parse(idDepRacineString);
    if(!idDepRacine){
      Notiflix.Notify.warning('Des mis à jours ont été fait \n Réconnectez-vous après avoir déconnecter pour pouvoir invité des membres');
      return;
    }
    if(depatementID === '' || depatementID === null){
      setDepartementId(idDepRacine);
    }
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    const userString = localStorage.getItem("user");
    let user = JSON.parse(userString);
    let formData = {
      nom: nom,
      email: email,
      entreprise_id: user.gest_com_entreprise_id,
      grade: grade,
      gest_r_h_departement_id : depatementID,
    };

    axios
      .post(`${url}/api/invitation`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setMessageSucces(response.data.message);
        setEmail("");
        setNom("");
        getAllUser();
        setShowSpinner(false);
        setTimeout(() => {
          setMessageSucces("");
        }, 5000);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  function setgradeChef(id) {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    let formData = {
      grade: "chef",
    };
    setShowSpinner(true);
    axios
      .put(`${url}/api/administrateurs/change-grade/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setMessageSucces(response.data.message);
        getAllUser();
        setShowSpinner(false);
        setTimeout(() => {
          setMessageSucces("");
        }, 5000);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  function setgradeMembre(id) {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    let formData = {
      grade: "membre",
    };
    setShowSpinner(true);
    axios
      .put(`${url}/api/administrateurs/change-grade/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setMessageSucces(response.data.message);
        getAllUser();
        setShowSpinner(false);
        setTimeout(() => {
          setMessageSucces("");
        }, 5000);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }
  function setgradeInvite(id) {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    let formData = {
      grade: "invite",
    };
    setShowSpinner(true);
    axios
      .put(`${url}/api/administrateurs/change-grade/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setMessageSucces(response.data.message);
        getAllUser();
        setShowSpinner(false);
        setTimeout(() => {
          setMessageSucces("");
        }, 5000);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  function RegexEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setShowMessageErrorEmail(!regex.test(email));
    if (email === "") {
      setShowMessageErrorEmail(false);
    }
  }

  const filteredDepartements = departementOption.filter((departement) =>
    departement.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (id) => {
    setSelectedDepartement(id);
  };

  return (
    <div className="formulaireAddUsers pb-5" onClick={closeDropdown}>
      <Modal 
          isOpen={isFirstModalOpen} 
          onClose={() => {
            setFirstModalOpen(false);}}>
          {creer ? (<>
              <h1 className="titreFormddUser font-bold">Inviter une personne :</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                <div className="sm:col-span-1">
                  <label className="block font-medium leading-6 text-gray-900">
                    Nom complet
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={nom}
                      onChange={(e) => {
                        setNom(e.target.value);
                      }}
                      className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="sm:col-span-1">
                  <label className="block font-medium leading-6 text-gray-900">
                    Adresse email
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        RegexEmail(e.target.value);
                      }}
                      className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                    />
                  </div>
                  {showMessageErrorEmail && (
                    <p className="errEmail text-xs">Adresse email invalide</p>
                  )}
                </div>
                <div className="sm:col-span-1">
                  <label className="block font-medium leading-6 text-gray-900">
                    Nom complet
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => {
                      setGrade(e.target.value);
                    }}
                    className="pl-3 pr-3 mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                  >
                    <option value="membre">🧑 Membre</option>
                    <option value="chef">⭐ Chef</option>
                    <option value="invite">👤 Invité</option>
                  </select>
                </div>

                <div className="sm:col-span-1">
                  <label className="block font-medium leading-6 text-gray-900">
                    Departement
                  </label>
                  <select
                    value={depatementID}
                    onChange={(e) => {setDepartementId(e.target.value)}}
                    className="pl-3 pr-3 mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                  >
                    {departementOption.map((departement) => (
                      <option key={departement.id} value={departement.id}>
                        {departement.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3 w-44 mr-5">
                  <label className=" text-sm font-medium leading-6 text-gray-900">
                    &nbsp;
                  </label>
                  <div className="divBtnInviter">
                    <button
                      disabled={!email || !nom || !grade || showMessageErrorEmail}
                      className="btnInviter"
                      onClick={inviterMembre}
                    >
                      Inviter
                    </button>
                  </div>
                </div>
              </div>
          </>) : (
            <>
              <div className="mt-5">
                <input
                  className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                  type="text"
                  placeholder="Rechercher un département..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="mt-5">
                  <div className="h-[200px] overflow-auto">
                    {filteredDepartements.length > 0 && (
                      filteredDepartements.map((departement) => (
                        <div
                          key={departement.id}
                          className={`mt-2 p-1 bg-slate-50 rounded-md ${
                            selectedDepartement === departement.id ? "bg-[rgba(0, 184, 148,0.1)]" : ""
                          }`}
                        >
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              value={departement.id}
                              checked={selectedDepartement === departement.id}
                              onChange={() => handleSelect(departement.id)}
                              className="mr-2"
                            />
                            {departement.nom}
                          </label>
                        </div>
                      ))
                    )}
                    {filteredDepartements.length === 0 && (
                      <div className="text-gray-500 text-center">Aucun département trouvé.</div>
                    )}
                  </div>
                  <button className="px-5 py-3 bg-blue-500 text-white" onClick={ModifierDepartementAll}>Modifier</button>
                </div>
              </div>
            </>
          )}
      </Modal>
      <div className="listUser mt-5">
        <h1 className="titleList font-bold flex">
          Liste des employés{" "}
          {ListeUser.length !== 0 && (
            <p className="ml-1">({Math.abs(ListeUser.length - 1)})</p>
          )}
        </h1>
        <div className="flex justify-between">
          <div className="showDisplay font-bold">
            <div
              onClick={switchToListOrGrid}
              className={`listIcon mr-5 ${showList ? "active" : ""}`}
            >
              <FontAwesomeIcon icon={faList} className="w-5 h-4 mr-2" />
              Liste
            </div>
            <div
              onClick={switchToListOrGrid}
              className={`listIcon ${showGrid ? "active" : ""}`}
            >
              <FontAwesomeIcon icon={faGrip} className="w-5 h-5 mr-2" />
              Grid
            </div>
          </div>
          <div>
            <button
              className="bg-blue-400 text-white px-3 py-2 rounded-sm"
              onClick={()=>{setFirstModalOpen(true); setCreer(true)}}>
                Inviter un employé</button>
          </div>
        </div>
        {showGrid && (
          <div className="ListMembresGrid  mt-4">
            {ListeUser.map(
              (list, index) =>
                list.role === "employe" && (
                  <div key={list.id} className="OneMembre mt-2 mr-10">
                    {!list.photo_profil && (
                      <div className="photouser mt-2"></div>
                    )}
                    {list.photo_profil && (
                      <div
                        className="photousers bg-cover bg-center mt-2"
                        style={{
                          backgroundImage: `url(${url}/storage/${list.photo_profil})`,
                        }}
                      ></div>
                    )}

                    <div className="infosuser">
                      <div>
                        <h1>{list.nom}</h1>
                        <p className="poste font-bold">{list.grade}</p>
                      </div>
                      <div className="adresse">
                        {list.telephone === "null" ? " " : list.telephone}
                      </div>
                      <div className="email text-xs font-bold">
                        <p>{list.email}</p>
                      </div>
                    </div>
                    <div className="deleteuser">
                      <Tippy content="Options">
                        <FontAwesomeIcon
                          icon={faEllipsis}
                          className="w-5 h-5 mt-2 mr-2  cursor-pointer focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(index);
                          }}
                        />
                      </Tippy>
                      {activeDropdown === index && (
                        <ul className="border dropdown-menu absolute z-10 right-2 mt-8 py-1 w-60 bg-white shadow-lg rounded-md">
                          {(list.grade === "membre" ||
                            list.grade === "invite") && (
                            <li
                              onClick={() => {
                                setgradeChef(list.id);
                              }}
                              className="dropdown-item flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                            >
                              <FontAwesomeIcon
                                icon={faRotate}
                                className="red-icon mr-2 text-gray-500"
                              />
                              Changer le grade en «<b>Chef</b>»
                            </li>
                          )}
                          {(list.grade === "invite" ||
                            list.grade === "chef") && (
                            <li
                              onClick={() => {
                                setgradeMembre(list.id);
                              }}
                              className="dropdown-item flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                            >
                              <FontAwesomeIcon
                                icon={faRotate}
                                className="red-icon mr-2 text-gray-500"
                              />
                              Changer le grade en «<b>Membre</b>»
                            </li>
                          )}
                          {(list.grade === "chef" ||
                            list.grade === "membre") && (
                            <li
                              onClick={() => setgradeInvite(list.id)}
                              className="dropdown-item flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                            >
                              <FontAwesomeIcon
                                icon={faRotate}
                                className="red-icon mr-2 text-gray-500"
                              />
                              Changer le grade en «<b>Invité</b>»
                            </li>
                          )}

                          <li
                            onClick={() => {
                              deleteuser(list.id);
                            }}
                            className="dropdown-item flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="red-icon mr-2"
                            />
                            Supprimer le compte
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                )
            )}
            {showSkeletreonUser && (
              <div className="flex gap-4 border-0 mt-2">
                <div className="w-[300px]">
                  <Skeleton className="bg-gray-100 h-10 rounded" />
                  <div className="space-y-3">
                    <Skeleton className="bg-gray-100 h-5 w-[90%]" />
                    <Skeleton className="h-4 w-[75%]" />
                    <Skeleton className=" h-4 w-[50%]" />
                  </div>
                </div>
                <div className="w-[300px]">
                  <Skeleton className="bg-gray-100 h-10 rounded" />
                  <div className="space-y-3">
                    <Skeleton className="bg-gray-100 h-5 w-[90%]" />
                    <Skeleton className="h-4 w-[75%]" />
                    <Skeleton className=" h-4 w-[50%]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {showList && (
          <div>
            {!showSkeletreonUser && (
              <>
                <div className="w-full border shadow-md p-0 relative overflow-x-auto rounded border-blue-100 mt-5">
                  <div className="divide-y divide-gray-200 p-0 bg-blue-100 font-bold z-0 min-w-[1000px]">
                    <div className="grid grid-cols-[1fr,5fr,5fr,4fr,4fr,1fr] px-4 py-2">
                      <div>
                        <input
                          type="checkbox"
                          onChange={toggleSelectAll}
                          checked={
                            selectedUsers.length === ListeUser.length &&
                            ListeUser.length > 0
                          }
                        />
                      </div>
                      <div>Employé</div>
                      <div>Département</div>
                      <div>Adresse email</div>
                      <div>Téléphone</div>
                      <div></div>
                    </div>
                  </div>
                  {ListeUser.length > 0 && (
                    <>
                      <div className="divide-y divide-gray-200 p-0 h-[400px] overflow-y-auto min-w-[1000px]">
                        {ListeUser.map(
                          (list, index) =>
                            list.role === "employe" && (
                              <div
                                key={list.id}
                                className="grid grid-cols-[1fr,5fr,5fr,4fr,4fr,1fr] px-4 py-2 font-normal hover:shadow-md hover:bg-slate-50"
                              >
                                <div>
                                  <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(list.id)}
                                    onChange={() => toggleUserSelection(list.id)}
                                  />
                                </div>
                                <div>{list.nom}</div>
                                <div>{list.departement?.nom || "..."}</div>
                                <div>{list.email}</div>
                                <div>{list.telephone}</div>
                                <div className="deleteList more relative">
                                  <Tippy content="Options">
                                    <FontAwesomeIcon
                                      icon={faEllipsis}
                                      className="w-5 h-5 cursor-pointer focus:outline-none"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleDropdown(index);
                                      }}
                                    />
                                  </Tippy>
                                  {activeDropdown === index && (
                                    <ul className="border dropdown-menu absolute z-10 right-0 py-1 w-60 bg-white shadow-lg rounded-md">
                                      <li
                                        onClick={() => {
                                          ShowUser(list.id);
                                        }}
                                        className="dropdown-item flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                                      >
                                        <FontAwesomeIcon
                                          icon={faEye}
                                          className="mr-2"
                                        />
                                        Afficher le profil
                                      </li>
                                      {(list.grade === "membre" ||
                                        list.grade === "invite") && (
                                        <li
                                          onClick={() => {
                                            setgradeChef(list.id);
                                          }}
                                          className="dropdown-item flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                                        >
                                          <FontAwesomeIcon
                                            icon={faRotate}
                                            className="red-icon mr-2 text-gray-500"
                                          />
                                          Changer le grade en «<b>Chef</b>»
                                        </li>
                                      )}
                                      {(list.grade === "invite" ||
                                        list.grade === "chef") && (
                                        <li
                                          onClick={() => {
                                            setgradeMembre(list.id);
                                          }}
                                          className="dropdown-item flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                                        >
                                          <FontAwesomeIcon
                                            icon={faRotate}
                                            className="red-icon mr-2 text-gray-500"
                                          />
                                          Changer le grade en «<b>Membre</b>»
                                        </li>
                                      )}
                                      {(list.grade === "chef" ||
                                        list.grade === "membre") && (
                                        <li
                                          onClick={() => setgradeInvite(list.id)}
                                          className="dropdown-item flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                                        >
                                          <FontAwesomeIcon
                                            icon={faRotate}
                                            className="red-icon mr-2 text-gray-500"
                                          />
                                          Changer le grade en «<b>Invité</b>»
                                        </li>
                                      )}
                                      <li
                                        onClick={() => {
                                          deleteuser(list.id);
                                        }}
                                        className="dropdown-item flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                                      >
                                        <FontAwesomeIcon
                                          icon={faTrash}
                                          className="red-icon mr-2"
                                        />
                                        Supprimer
                                      </li>
                                    </ul>
                                  )}
                                </div>
                              </div>
                            )
                        )}
                      </div>
                      <div className="divide-y divide-gray-200 p-3 overflow-y-auto min-w-[1000px]">
                        <div className="flex">
                          <div className="action-group"><p className="p-2"><b>Sélection : {selectedUsers.length} / {ListeUser.length}</b></p></div>
                          <div className="action-group ml-2">
                            <select
                              id="groupAction"
                              className="border rounded p-2"
                              onChange={(e) => handleGroupAction(e.target.value)}
                              disabled={selectedUsers.length === 0}
                            >
                              <option value="">Action</option>
                              <option value="changeDepartment">Changer de département</option>
                              <option value="deleteUsers">Supprimer les utilisateurs</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {ListeUser.length === 0 && (
                    <div className="emptyContent h-[400px]">
                      <div className="w-40 h-40 empty"></div>
                    </div>
                  )}
                </div>
              </>
            )}
            {showSkeletreonUser && (
              <div className="contentMyproject  border-0 mt-2">
                <div className="flex flex-col space-y-3">
                  <Skeleton className="bg-gray-100 h-10 w-[90%] rounded" />
                  <div className="space-y-3">
                    <Skeleton className="bg-gray-100 h-5 w-[90%]" />
                    <Skeleton className="h-4 w-[75%]" />
                    <Skeleton className=" h-4 w-[50%]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
