import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faXmark,
  faClock,
  faPlus,
  faTrash,
  faList,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { ProjectContext } from "../contexte/useProject";
import axios from "axios";
import { UrlContext } from "../contexte/useUrl";
import { MessageContext } from "../contexte/useMessage";
import { ShowContext } from "../contexte/useShow";
import { UserContext } from "../contexte/useUser";
import Tippy from "@tippyjs/react";
import "../styles/SetProject.css";

export default function SetProject() {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [showListMembres, setShowListMembres] = useState(false);
  const [showListChefs, setShowListChefs] = useState(false);
  const [inputFields, setInputFields] = useState([]);
  const [chefDeProjet, setChefDeProjet] = useState("");

  const [searchTermChef, setSearchTermChef] = useState("");
  const [searchTermMembre, setSearchTermMembre] = useState("");
  const [isDropdownOpenChef, setIsDropdownOpenChef] = useState(false);
  const [isDropdownOpenMembre, setIsDropdownOpenMembre] = useState(false);

  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [newFieldType, setNewFieldType] = useState("text");
  const [newFieldLabel, setNewFieldLabel] = useState("");

  const {
    nomProjet,
    dateDebut,
    dateFin,
    description,
    setNomProjet,
    setDateFin,
    setDescription,
    idProjet,
    getOneProjet,
    ListMembres,
    getAllproject,
    getProjectWhenChef,
    getProjectWhenMembres,
    ListChefs,
  } = useContext(ProjectContext);
  const { setMessageSucces, setMessageError } = useContext(MessageContext);
  const { url } = useContext(UrlContext);
  const {
    setShowSpinner,
    setShowSetProject,
    setShowRetirer,
    setShowRetierChefs,
  } = useContext(ShowContext);
  const { ListeUser, setIduser, setNomuser } = useContext(UserContext);

  function handleAddField() {
    if (newFieldLabel.trim() !== "") {
      setInputFields([
        ...inputFields,
        { type: newFieldType, label: newFieldLabel },
      ]);
      setShowAddFieldModal(false);
      setNewFieldLabel("");
    }
  }

  function removeInputField(index) {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  }

  const filteredOptionsChef = ListeUser.filter((user) =>
    user.email.toLowerCase().includes(searchTermChef.toLowerCase())
  );

  const filteredOptionsMembre = ListeUser.filter((user) =>
    user.email.toLowerCase().includes(searchTermMembre.toLowerCase())
  );

  function handleSearchChangeChef(event) {
    const value = event.target.value;
    setSearchTermChef(value);
    setIsDropdownOpenChef(value !== "");
  }

  function addInputField() {
    setShowAddFieldModal(true);
  }

  function handleSearchChangeMembre(event) {
    const value = event.target.value;
    setSearchTermMembre(value);
    setIsDropdownOpenMembre(value !== "");
  }

  function addNewmembres() {
    let formData = {
      membres: userIds,
    };

    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .put(`${url}/api/entreprises/projets/${idProjet}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getOneProjet(idProjet);
        setSelectedMembers([]);
        setMessageSucces(response.data.message);
        setShowSpinner(false);
        setTimeout(() => {
          setMessageSucces("");
        }, 5000);
        getProjectWhenMembres();
        getAllproject();
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  function retirerMembres(id, nom) {
    setIduser(id);
    setNomuser(nom);
    setShowRetirer(true);
  }

  function retirerChefs(id, nom) {
    setIduser(id);
    setNomuser(nom);
    setShowRetierChefs(true);
  }

  function handleAddChefDeProjet() {
    if (filteredOptionsChef.length > 0) {
      const selectedChef = filteredOptionsChef[0];
      setChefDeProjet(selectedChef);
      setIsDropdownOpenChef(false);
      setSearchTermChef("");
      let formData = {
        chef_id: selectedChef.id,
      };
      setShowSpinner(true);
      const tokenString = localStorage.getItem("token");
      let token = JSON.parse(tokenString);
      axios
        .put(`${url}/api/entreprises/projets/chefs/${idProjet}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          getOneProjet(idProjet);
          setMessageSucces(response.data.message);
          setShowSpinner(false);
          setTimeout(() => {
            setMessageSucces("");
          }, 5000);
          getProjectWhenChef();
          getAllproject();
        })
        .catch((err) => {
          setMessageError(err.response.data.error);
          setShowSpinner(false);
          setTimeout(() => {
            setMessageError("");
          }, 5000);
        });
    }
  }

  function modifierProjet() {
    let formData = {
      titre: nomProjet,
      date_debut: dateDebut,
      date_fin: dateFin,
      description: description,
    };
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    const userString = localStorage.getItem("user");
    let user = JSON.parse(userString);
    axios
      .put(`${url}/api/entreprises/projets/${user.id}/${idProjet}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getOneProjet(idProjet);
        setMessageSucces(response.data.message);
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

  function removeInputField(index) {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  }

  function handleRemoveMember(member) {
    setSelectedMembers(selectedMembers.filter((m) => m !== member));
    setUserIds(userIds.filter((id) => id !== member.id));
  }

  function handleOptionSelect(option) {
    if (!selectedMembers.includes(option)) {
      setSelectedMembers([...selectedMembers, option]);
      setUserIds([...userIds, option.id]);
    }
    setSearchTermMembre("");
    setIsDropdownOpenMembre(false);
  }

  function closeCreateProject() {
    setShowSetProject(false);
  }

  function closeRight() {
    setShowListMembres(false);
    setShowListChefs(false);
  }

  return (
    <>
      <div className="showModals">
        <div className="contentCenter">
          <div className="formModalCreatePosts" onClick={() => closeRight()}>
            <div className="headCreateTask pb-4">
              <div className="icone">
                <FontAwesomeIcon
                  icon={faSquarePlus}
                  className="add h-7 w-7 faSquarePlus"
                />
              </div>
              <div className="titreTask">
                <input
                  type="text"
                  value={nomProjet}
                  onChange={(e) => setNomProjet(e.target.value)}
                  placeholder="Titre du projet"
                  className="input pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                />
              </div>
              <div className="close">
                <FontAwesomeIcon
                  onClick={closeCreateProject}
                  icon={faXmark}
                  className="h-7 w-7 ml-5 add cursor-pointer transition duration-200 ease-in-out hover:text-gray-500 hover:scale-110"
                />
              </div>
            </div>

            <div className="section mt-5">
              <div className="dateInputs w-full flex justify-between flex-wrap">
                <div className="inputGroup w-60 mb-5">
                  <label className="input flex items-center font-medium text-gray-700 mb-1">
                    <FontAwesomeIcon icon={faClock} className="w-4 h-4 mr-2" />
                    Date limite
                  </label>
                  <input
                    type="date"
                    value={dateFin}
                    onChange={(e) => setDateFin(e.target.value)}
                    className="input pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="label mt-2">Description :</div>

            <div className="section mt-2">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input pl-3 w-52 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
              />
            </div>

            <div className="w-52 mt-2 ">
              <button onClick={modifierProjet} className="input btnInviter">
                Modifier
              </button>
            </div>

            <div className="section mt-5 flex items-center">
              <div className="relative w-full">
                <div className="label">Ajouter un nouveau chef de projet :</div>
                <div className="flex mt-2 items-center relative">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTermChef}
                    onChange={handleSearchChangeChef}
                    className="input pl-3 pr-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                  />
                  <FontAwesomeIcon
                    icon={faPlus}
                    onClick={handleAddChefDeProjet}
                    className="absolute right-3 text-gray-400 cursor-pointer transition duration-200 hover:text-[rgba(0, 184, 148,1.0)] hover:scale-125"
                  />
                </div>
                {isDropdownOpenChef && (
                  <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
                    {filteredOptionsChef.length > 0 ? (
                      filteredOptionsChef.map((user, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200"
                          onClick={handleAddChefDeProjet}
                        >
                          {user.email}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        Aucune option disponible
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right mt-2">
              <Tippy content="Liste des chefs">
                <FontAwesomeIcon
                  icon={faList}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowListMembres(false);
                    setShowListChefs(true);
                  }}
                  className="w-5 h-5 mr-2 cursor-pointer focus:outline-none"
                />
              </Tippy>
            </div>

            <div className="section  flex items-center">
              <div className="relative w-full">
                <div className="label">Ajouter des nouveaux membres :</div>
                <div className="flex mt-2 items-center relative">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTermMembre}
                    onChange={handleSearchChangeMembre}
                    className="input pl-3 pr-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                  />
                  <FontAwesomeIcon
                    icon={faPlus}
                    onClick={() =>
                      handleOptionSelect({ email: searchTermMembre })
                    }
                    className="absolute right-3 text-gray-400 cursor-pointer transition duration-200 hover:text-[rgba(0, 184, 148,1.0)] hover:scale-125"
                  />
                </div>
                {isDropdownOpenMembre && (
                  <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
                    {filteredOptionsMembre.length > 0 ? (
                      filteredOptionsMembre.map((user, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200"
                          onClick={() => handleOptionSelect(user)}
                        >
                          {user.email}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        Aucune option disponible
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {selectedMembers.length > 0 && (
              <div className="mt-2 ">
                <div className="flex flex-wrap wrap justify-between">
                  {selectedMembers.map((member, index) => (
                    <div
                      key={index}
                      className="input text-black w-60 mt-2 bg-gray-200 rounded-md px-4 py-2 flex justify-between items-center"
                    >
                      {member.email}
                      <FontAwesomeIcon
                        icon={faXmark}
                        onClick={() => handleRemoveMember(member)}
                        className="cursor-pointer text-red-500 hover:text-red-700"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex w-full  justify-between flex-wrap">
              <div className="w-52 mt-2">
                <button onClick={addNewmembres} className="input btnInviter">
                  Ajouter
                </button>
              </div>
              <div className="mt-2">
                <Tippy content="Liste des membres">
                  <FontAwesomeIcon
                    icon={faList}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowListChefs(false);
                      setShowListMembres(true);
                    }}
                    className="w-5 h-5 mr-2 cursor-pointer focus:outline-none"
                  />
                </Tippy>
              </div>
            </div>

            <div className="section mt-5">
              <div className="label">Ajouter des champs :</div>
              <div className=" w-full sections mt-2">
                {inputFields.map((input, index) => (
                  <div key={index} className="w-full relative mt-2">
                    <label className="input text-black font-bold input-label">
                      {input.label} :
                    </label>
                    <input
                      type={input.type}
                      className="input pl-3 w-full pr-10 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                      placeholder={input.label}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => removeInputField(index)}
                      className="faTrashIcon absolute right-3 top-1/2 mt-3 transform -translate-y-1/2 text-red-500 cursor-pointer"
                    />
                  </div>
                ))}
                <div className="flex justify-between w-full flex-wrap">
                  <button
                    className="addInputField mt-3 px-4 py-2 bg-yellow-500 text-white rounded-md transition duration-200"
                    onClick={addInputField}
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Ajouter un champ
                  </button>
                  {inputFields.length !== 0 && (
                    <button
                      className="addInputField mt-3 px-4 py-2 bg-blue-500 text-white rounded-md transition duration-200"
                      onClick={addInputField}
                    >
                      Enregistrer les nouveaux données
                    </button>
                  )}
                </div>
              </div>
            </div>

            {showAddFieldModal && (
              <div className="modalInput">
                <div className="modal-content">
                  <h2 className="modal-title text-left font-bold">
                    Ajouter un champ :
                  </h2>
                  <div className="modal-body">
                    <div className=" text-left flex items-end flex-wrap   mt-5 inputGroup">
                      <label className="input text-black mr-5">
                        Type d'input :
                      </label>
                      <select
                        value={newFieldType}
                        onChange={(e) => setNewFieldType(e.target.value)}
                        className="input pl-3 w-52 pr-3 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                      >
                        <option value="text">📝 Texte</option>
                        <option value="number">🔢 Nombre</option>
                        <option value="date">📅 Date</option>
                        <option value="email">@ Email</option>
                        <option value="url">🔗 URL</option>
                        <option value="tel">📞 Téléphone</option>
                        <option value="password">🔒 Mot de passe</option>
                        <option value="search">🔍 Recherche</option>
                        <option value="color">🎨 Couleur</option>
                        <option value="file">📁 Fichier</option>
                        <option value="textarea">📝 Zone de texte</option>
                      </select>
                    </div>
                    <div className="text-left flex items-end flex-wrap inputGroup mt-3">
                      <label className="input text-black  mr-5">Label :</label>
                      <input
                        type="text"
                        value={newFieldLabel}
                        onChange={(e) => setNewFieldLabel(e.target.value)}
                        className="input pl-3 w-72 pr-3 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                        placeholder="Nom du champ"
                      />
                    </div>
                  </div>
                  <div className="modal-footer mt-5">
                    <button
                      onClick={handleAddField}
                      className="mr-2 bg-blue-500 text-white px-4 py-2 rounded-sm"
                    >
                      Ajouter
                    </button>
                    <button
                      onClick={() => setShowAddFieldModal(false)}
                      className=" bg-yellow-500 text-white px-4 py-2 rounded-sm"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {showListMembres && (
            <div className="ListMembres pl-10">
              <h1 className=" mt-10 font-bold  titreListemembres">
                <FontAwesomeIcon
                  icon={faList}
                  className=" mr-2 cursor-pointer"
                />
                Liste des membres :
              </h1>
              <ul className="heightListMembres mt-5">
                {ListMembres.map((membre, index) => (
                  <li
                    key={index}
                    className="mt-2 flex justify-between align-center onemembres"
                  >
                    <p className="mr-5">👤</p> <p>{membre.nom}</p>
                    <Tippy content="Retirer du projet">
                      <FontAwesomeIcon
                        icon={faCircleXmark}
                        className=" text-red-500 w-5 h-5 focus:outline-none"
                        onClick={() => retirerMembres(membre.id, membre.nom)}
                      />
                    </Tippy>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {showListChefs && (
            <div className="ListMembres pl-10">
              <h1 className=" mt-10 font-bold  titreListemembres">
                <FontAwesomeIcon
                  icon={faList}
                  className=" mr-2 cursor-pointer"
                />
                Liste des chefs :
              </h1>
              <ul className="heightListMembres mt-5">
                {ListChefs.map((chef, index) => (
                  <li
                    key={index}
                    className="mt-2 flex justify-between align-center onemembres"
                  >
                    <p className="mr-5">👤</p> <p>{chef.nom}</p>
                    <Tippy content="Retirer du projet">
                      <FontAwesomeIcon
                        icon={faCircleXmark}
                        className=" text-red-500 w-5 h-5 focus:outline-none"
                        onClick={() => retirerChefs(chef.id, chef.nom)}
                      />
                    </Tippy>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
