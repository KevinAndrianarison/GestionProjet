import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faXmark,
  faClock,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { ProjectContext } from "../contexte/useProject";
import { TaskContext } from "../contexte/useTask";

import axios from "axios";
import { UrlContext } from "../contexte/useUrl";
import { MessageContext } from "../contexte/useMessage";
import { ShowContext } from "../contexte/useShow";
import "../styles/SetProject.css";

export default function SetTask() {
  const [inputFields, setInputFields] = useState([]);

  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [newFieldType, setNewFieldType] = useState("text");
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setSelectedMember(responsable);
  }, []);

  const { ListChefAndMembres, idProject } = useContext(ProjectContext);

  const {
    titreTask,
    dateDebut,
    dateFin,
    description,
    setTitreTask,
    setDateFin,
    setDescription,
    idTask,
    getOneTask,
    getAllTask,
    responsable,
  } = useContext(TaskContext);

  const { setMessageSucces, setMessageError } = useContext(MessageContext);
  const { url } = useContext(UrlContext);
  const { setShowSpinner, setShowSetTask } = useContext(ShowContext);

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

  function handleSearchChange(event) {
    const value = event.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(value !== "");
  }

  function removeInputField(index) {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  }

  const filteredOptions = ListChefAndMembres.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function addInputField() {
    setShowAddFieldModal(true);
  }

  function modifierTask() {
    let formData = {
      titre: titreTask,
      date_debut: dateDebut,
      date_fin: dateFin,
      description: description,
      employe_id: selectedMember.id,
      
    };

    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);

    axios
      .put(`${url}/api/projets/${idProject}/taches/${idTask}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getAllTask(idProject);
        getOneTask(idTask);
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

  function handleRemoveMember() {
    setSelectedMember(null);
    setSearchTerm("");
  }

  function handleOptionSelect(option) {
    setSelectedMember(option);
    setSearchTerm(option.email);
    setIsDropdownOpen(false);
  }

  function closeSetTask() {
    setShowSetTask(false);
  }

  return (
    <>
      <div className="showModals">
        <div className="contentCenter">
          <div className="formModalCreatePosts">
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
                  value={titreTask}
                  onChange={(e) => setTitreTask(e.target.value)}
                  placeholder="Titre du projet"
                  className="input pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                />
              </div>
              <div className="close">
                <FontAwesomeIcon
                  onClick={closeSetTask}
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
                value={description || ""}
                onChange={(e) => setDescription(e.target.value)}
                className="input pl-3 w-52 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
              />
            </div>

            <div className="section mt-5 flex items-center">
              <div className="relative w-full">
                <div className="label">Le responsable :</div>
                <div className="flex mt-2 items-center relative">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="input pl-3 pr-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                    value={selectedMember ? selectedMember.email : searchTerm}
                    onChange={handleSearchChange}
                  />
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="absolute right-3 text-gray-400 cursor-pointer transition duration-200 hover:text-[rgba(0, 184, 148,1.0)] hover:scale-125"
                    onClick={() => handleRemoveMember()}
                  />
                </div>

                {isDropdownOpen && (
                  <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((user, index) => (
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

            <div className="w-52 mt-2 ">
              <button onClick={modifierTask} className="input btnInviter">
                Modifier
              </button>
            </div>

            <div className="section mt-5">
              <div className="label">Ajouter des champs :</div>
              <div className=" w-full sections mt-2">
                {inputFields.map((input, index) => (
                  <div key={index} className="w-full relative mt-2">
                    <label className="font-bold input-label">
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
                <button
                  className="addInputField mt-3 px-4 py-2 bg-yellow-500 text-white rounded-md transition duration-200"
                  onClick={addInputField}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Ajouter un champ
                </button>
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
        </div>
      </div>
    </>
  );
}
