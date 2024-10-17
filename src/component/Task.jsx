import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faXmark,
  faClock,
  faTrash,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import { ShowContext } from "../contexte/useShow";
import { TaskContext } from "../contexte/useTask";
import { useContext, useState } from "react";
import { UrlContext } from "../contexte/useUrl";
import { MessageContext } from "../contexte/useMessage";
import { ProjectContext } from "../contexte/useProject";
import Tippy from "@tippyjs/react";
import axios from "axios";

export default function Task() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [titreTask, setTitreTask] = useState("");
  const [description, setDescription] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [activeTab, setActiveTab] = useState("create");

  const { url } = useContext(UrlContext);
  const { ListTask, getAllTask, setIdTask, getOneTask } =
    useContext(TaskContext);
  const { setShowDeletetask, setShowSpinner, setShowTask } =
    useContext(ShowContext);
  const { setMessageSucces, setMessageError } = useContext(MessageContext);

  const {
    getProjectWhenChef,
    getProjectWhenMembres,
    ListChefAndMembres,
    idProject,
    getAllproject,
  } = useContext(ProjectContext);

  function closeTask() {
    setShowTask(false);
  }

  function deleteTask(id) {
    setIdTask(id);
    setShowDeletetask(true);
  }

  const filteredOptions = ListChefAndMembres.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleSearchChange(event) {
    const value = event.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(value !== "");
  }

  function handleOptionSelect(option) {
    setSelectedMember(option);
    setSearchTerm(option.email);
    setIsDropdownOpen(false);
  }

  function handleRemoveMember() {
    setSelectedMember(null);
    setSearchTerm("");
  }

  function setTask(id) {    
    setIdTask(id);
    getOneTask(id);
  }

  function createTask() {
    setShowSpinner(true);
    let chefsId = [];
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    const userString = localStorage.getItem("user");
    let user = JSON.parse(userString);
    chefsId.push(user.id);
    let dateActuelle = new Date();
    let dateFormatee =
      dateActuelle.getFullYear() +
      "-" +
      ("0" + (dateActuelle.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + dateActuelle.getDate()).slice(-2);

    let formData = {
      titre: titreTask,
      description: description,
      entreprise_id: user.entreprise_id,
      date_debut: dateFormatee,
      date_fin: dateFin,
      employe_id: [selectedMember.id][0],
    };

    axios
      .post(`${url}/api/projets/${idProject}/taches`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getAllTask(idProject);
        getProjectWhenMembres();
        getProjectWhenChef();
        getAllproject();
        setTitreTask("");
        setDescription("");
        setDateFin("");
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

  return (
    <>
      <div className="showModalTask " onClick={() => setShowTask(false)}>
        <div
          className="formModalCreatePost "
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="input flex justify-evenly text-black font-bold mb-5 tabs w-full">
            <button
              className={`tab ${activeTab === "create" ? "active" : ""}`}
              onClick={() => setActiveTab("create")}
            >
              Créer une tâche
            </button>
            <button
              className={`tab ${activeTab === "list" ? "active" : ""}`}
              onClick={() => setActiveTab("list")}
            >
              Liste des tâches
            </button>
          </div>
          {activeTab === "create" ? (
            <>
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
                    placeholder="Titre"
                    className="input pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                  />
                </div>
                <div className="close">
                  <FontAwesomeIcon
                    onClick={closeTask}
                    icon={faXmark}
                    className="h-7 w-7 ml-5 add cursor-pointer transition duration-200 ease-in-out hover:text-gray-500 hover:scale-110"
                  />
                </div>
              </div>
              <div className="section mt-5">
                <div className="dateInputs w-full flex justify-between flex-wrap">
                  <div className="inputGroup w-60 mb-5">
                    <label className="input flex items-center font-medium text-gray-700 mb-1">
                      <FontAwesomeIcon
                        icon={faClock}
                        className="w-4 h-4 mr-2"
                      />
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
              <div className="section mt-5 flex items-center">
                <div className="relative w-full">
                  <div className="label">Assigner à un membre :</div>
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
              <div className="mt-5">
                <button
                  disabled={!titreTask || !dateFin || !selectedMember}
                  onClick={createTask}
                  className="btnInviter"
                >
                  Créer une tâche
                </button>
              </div>
            </>
          ) : (
            <div className="task-list">
              <div className="font-bold text-black py-2 flex border justify-between w-full titreTask">
                <h1 className="text-black  input ml-4 w-[40%]">Titre</h1>
                <h1 className="text-black  input w-[40%]">Responsable</h1>
                <h1 className="text-center w-[8%]"></h1>
                <h1 className="text-center w-[8%] mr-2"></h1>
              </div>
              <div className="taskContentList overflow-y-scroll">
                {ListTask.map((list) => (
                  <div
                    key={list.id}
                    className=" py-2 flex border justify-between w-full titreTask"
                  >
                    <h1 className="text-black  input ml-4 w-[40%]">
                      {list.titre}
                    </h1>
                    <h1 className="text-black  input w-[40%]">
                      {" "}
                      {list.assignable.nom}
                    </h1>
                    <h1
                      onClick={() => setTask(list.id)}
                      className="text-center w-[8%]"
                    >
                      <Tippy content="Modifier">
                        <FontAwesomeIcon
                          icon={faSliders}
                          className=" cursor-pointer focus:outline-none"
                        />
                      </Tippy>
                    </h1>
                    <h1
                      onClick={() => deleteTask(list.id)}
                      className="text-center w-[8%]"
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-red-500 cursor-pointer"
                      />
                    </h1>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
