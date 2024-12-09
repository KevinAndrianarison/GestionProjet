import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faPlus,
  faSliders,
  faTrash,
  faEdit,
  faEllipsis,
  faPaperclip,
  faPaperPlane,
  faXmark,
  faCloudArrowDown,
  faCaretDown,
  faGear,
  faThumbtack,
  faExpand,
  faCompress,
} from "@fortawesome/free-solid-svg-icons";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import styles from "../styles/Details.module.css";
import { ShowContext } from "../contexte/useShow";
import { useContext } from "react";
import { ProjectContext } from "../contexte/useProject";
import { TaskContext } from "../contexte/useTask";
import Tippy from "@tippyjs/react";
import { Editor } from "@tinymce/tinymce-react";
import { MessageContext } from "../contexte/useMessage";
import axios from "axios";
import { UrlContext } from "../contexte/useUrl";
import { EtapeContext } from "../contexte/useEtape";
import { UserContext } from "../contexte/useUser";
import { ComsContext } from "../contexte/useComs";
import TableauKanban from "./TableauKanban";
import GestionPlanning from "./GestionPlanning";
import LigneBudgetaire from "./LigneBudgetaire";
import Spinner from "../component/Spinner";
import SousProjet from "./SousProjet";
import Calendrier from "./Calendrier";
import Gantt from "./Gantt";

export default function DetailsProject() {
  const {
    setShowDetails,
    setShowDeleteTask,
    setShowSpinner,
    setShowRetirer,
    setShowRetierChefs,
    setShowSetProject,
    setShowTask,
    setShowDeletetask,
    setShowDeletechamps,
  } = useContext(ShowContext);
  const {
    categorie,
    setNomProjet,
    nomProjet,
    dateDebut,
    setDateFin,
    dateFin,
    description,
    getAllproject,
    getProjectWhenChef,
    getProjectWhenMembres,
    getProjectWhenResp,
    ListChefs,
    idProjet,
    getOneProjet,
    idProject,
  } = useContext(ProjectContext);
  const { setMessageSucces, setMessageError } = useContext(MessageContext);
  const { url } = useContext(UrlContext);
  const { getAlletapeByProjets, listEtape } = useContext(EtapeContext);
  const { setIduser, setNomuser, setIdRoleuser } = useContext(UserContext);
  const { getAllComs, listeCommentaire } = useContext(ComsContext);
  const {
    ListTask,
    setIdTask,
    getOneTask,
    getAllStatusTask,
    getAllChampsByProject,
    ListChamps,
    setidInput,
  } = useContext(TaskContext);

  const [showListemembre, setShowListemembre] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [coms, setComs] = useState("");
  const [listIDTache, setlistIDTache] = useState([]);
  const [oldValueTitre, setOldValueTitre] = useState("");
  const [oldDescription, setOldDescription] = useState("");
  const [nomFileUploaded, setNomFileUploaded] = useState("");
  const [file, setFile] = useState(null);
  const [verifyIfChef, setVerifyIfChef] = useState(false);
  const [isSpinner, setIsSpinner] = useState(false);
  const [newFieldType, setNewFieldType] = useState("text");
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [showComs, setShowComs] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [inputFields, setInputFields] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenParams, setIsOpenParams] = useState(false);
  const [isTask, setIsTask] = useState(true);
  const [isKanban, setIsKanban] = useState(false);
  const [isGestionPlanning, setIsGestionPlanning] = useState(false);
  const [isLigneBudg, setIsLigneBudg] = useState(false);
  const [isSousProjet, setIsSousProjet] = useState(false);
  const [isCalendrier, setIsCalendrier] = useState(false);
  const [isGantt, setIsGantt] = useState(false);
  const [isdivTitre, setIsdivTitre] = useState(true);
  const [isInputTitre, setIsInputTitre] = useState(false);
  const [isdivDescription, setIsdivDescription] = useState(true);
  const [isTinyDescription, setIsTinyDescription] = useState(false);

  const editorRef = useRef("");
  const fileInputRef = useRef(null);

  const userString = localStorage.getItem("user");
  let user = JSON.parse(userString);

  function addIdTask(id) {
    setlistIDTache((prev) =>
      prev.includes(id)
        ? prev.filter((existingId) => existingId !== id)
        : [...prev, id]
    );
  }

  function deleteSomeTask() {
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    listIDTache.forEach((list) => {
      axios
        .delete(`${url}/api/projets/taches/${list}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          getAlletapeByProjets(idProject);
          setShowSpinner(false);
        })
        .catch((err) => {
          console.error(err);
          setShowSpinner(false);
        });
    });
  }

  function setVisibility(valeur, id) {
    let formData = {
      visible: !valeur,
    };
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .put(`${url}/api/projets/champs/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getAllChampsByProject();
        setShowSpinner(false);
        getAlletapeByProjets();
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  function showGestLignBudg() {
    setIsGantt(false);
    setIsCalendrier(false);
    setIsSousProjet(false);
    setIsKanban(false);
    setIsTask(false);
    setIsGestionPlanning(false);
    setIsLigneBudg(true);
  }

  function showGestPlanning() {
    setIsGantt(false);
    setIsCalendrier(false);
    setIsSousProjet(false);
    setIsKanban(false);
    setIsTask(false);
    setIsLigneBudg(false);
    setIsGestionPlanning(true);
  }
  function deleteChamps(id) {
    setidInput(id);
    setShowDeletechamps(true);
  }

  function showTask() {
    setIsGantt(false);
    setIsCalendrier(false);
    setIsSousProjet(false);
    setIsKanban(false);
    setIsGestionPlanning(false);
    setIsLigneBudg(false);
    setIsTask(true);
  }

  function showKanban() {
    setIsTask(false);
    setIsGantt(false);
    setIsCalendrier(false);
    setIsSousProjet(false);
    setIsGestionPlanning(false);
    setIsLigneBudg(false);
    setIsKanban(true);
  }

  function showSousProjet() {
    setIsKanban(false);
    setIsTask(false);
    setIsGantt(false);
    setIsCalendrier(false);
    setIsGestionPlanning(false);
    setIsLigneBudg(false);
    setIsSousProjet(true);
  }

  function showCalendrier() {
    setIsSousProjet(false);
    setIsKanban(false);
    setIsTask(false);
    setIsGantt(false);
    setIsGestionPlanning(false);
    setIsLigneBudg(false);
    setIsCalendrier(true);
  }
  function showGantt() {
    setIsCalendrier(false);
    setIsSousProjet(false);
    setIsKanban(false);
    setIsTask(false);
    setIsGestionPlanning(false);
    setIsLigneBudg(false);
    setIsGantt(true);
  }

  useEffect(() => {
    if (categorie === "Les projets dont je fait partie") {
      showKanban();
    }
    getAllChampsByProject();
    let idIfChef;
    if (!description) {
      setIsdivDescription(false);
    }
    setOldValueTitre(nomProjet);
    setOldDescription(description);
    ListChefs.forEach((list) => {
      if (list.role === "chef" || list.utilisateur.role === "admin") {
        idIfChef = list.utilisateur.id;
        if (user.id === idIfChef) {
          setVerifyIfChef(true);
        }
      }
    });
  }, []);

  function onClose() {
    setShowDetails(false);
  }

  function handleToggle() {
    setIsOpen(!isOpen);
    setIsOpenParams(false);
  }

  function handleToggleParams() {
    setIsOpenParams(!isOpenParams);
    setIsOpen(false);
  }

  function deleteProject() {
    setShowDeleteTask(true);
  }

  function setProject() {
    setShowSetProject(true);
  }

  function handleAddField() {
    let formData = {
      label: newFieldLabel,
      type: newFieldType,
      gest_proj_projet_id: idProjet,
    };
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .post(`${url}/api/projets/champs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setMessageSucces(response.data.message);
        getAllChampsByProject();
        setShowSpinner(false);
        setTimeout(() => {
          setMessageSucces("");
        }, 5000);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
    setNewFieldLabel("");
  }

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  function handleFileUpload(event) {
    const file = event.target.files[0];
    setNomFileUploaded(file.name);
    setFile(file);
  }

  function removeFile() {
    setFile("");
    setNomFileUploaded("");
  }

  function handleDelete(id) {
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .delete(`${url}/api/projets/commentaires/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getAllComs(idProjet);
        setShowSpinner(false);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  function retirerChefs(id, nom) {
    setIdRoleuser(id);
    setNomuser(nom);
    setShowRetierChefs(true);
  }

  function addInputField() {
    setIsOpen(false);
    setShowAddFieldModal(true);
    getAllChampsByProject();
  }

  function setTask(id) {
    setIdTask(id);
    getOneTask(id);
  }

  function addtask() {
    setIsOpen(false);
    getAllStatusTask();
  }

  function deleteTask(id) {
    setIdTask(id);
    setShowDeletetask(true);
  }

  function envoyerComs() {
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, "0")}/${(
      today.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${today.getFullYear()}`;

    const userString = localStorage.getItem("user");
    let user = JSON.parse(userString);
    const formData = new FormData();
    formData.append("file", file || "");
    formData.append("contenu", coms || "");
    formData.append("date", formattedDate || "");
    formData.append("gest_proj_projet_id", idProjet || "");
    formData.append("gest_com_utilisateur_id", user.id || "");

    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .post(`${url}/api/projets/commentaires`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setNomFileUploaded("");
        setComs("");
        getAllComs(idProjet);
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

  function fetchPUT(formData) {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .put(`${url}/api/projets/${idProjet}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getOneProjet(idProjet);
        if (response.data.projet.description) {
          setIsdivDescription(true);
        }
        if (categorie === "Tous les projets") {
          getAllproject();
        }
        if (categorie === "Mes projets") {
          getProjectWhenChef();
        }
        if (categorie === "Les projets dont je fait partie") {
          getProjectWhenMembres();
        }
        if (categorie === "Responsable hierarchique") {
          getProjectWhenResp();
        }
        setIsSpinner(false);
        if (nomProjet !== oldValueTitre) {
          setOldValueTitre(nomProjet);
        }
      })
      .catch((err) => {
        console.error(err);
        setIsSpinner(false);
      });
  }

  function modifierProjet() {
    let formData;
    if (editorRef.current) {
      setIsSpinner(true);
      formData = {
        nom: nomProjet,
        date_debut: dateDebut,
        date_fin: dateFin,
        description: editorRef.current.getContent(),
      };
      fetchPUT(formData);
    }
    if (nomProjet !== oldValueTitre) {
      formData = {
        nom: nomProjet,
        date_debut: dateDebut,
        date_fin: dateFin,
        description: description,
      };
      fetchPUT(formData);
    }
  }

  return (
    <>
      <div
        className={styles.modalOverlay}
        onClick={() => setShowDetails(false)}
      >
        <div
          className={` ${
            isFullScreen
              ? "w-full h-full rounded-none bg-white p-2"
              : `bg-white shadow-lg rounded-lg ${styles.modalContent}`
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
            setIsOpenParams(false);
            modifierProjet();
            setIsTinyDescription(false);
            if (!description) {
              setIsdivDescription(false);
            }
            if (description) {
              setIsdivDescription(true);
            }
          }}
        >
          <div className=" flex items-center justify-end">
            <Tippy content={isFullScreen ? "Réduire" : "Plein écran"}>
              <FontAwesomeIcon
                onClick={() => setIsFullScreen(!isFullScreen)}
                icon={isFullScreen ? faCompress : faExpand}
                className="cursor-pointer mr-2 transform transition-transform duration-300 hover:scale-125 focus:outline-none"
              />
            </Tippy>

            <FontAwesomeIcon
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              icon={faTimes}
              className="text-red-600 font-bold border-4 border-red-500 rounded-full px-1 py-0.5 cursor-pointer"
            />
          </div>
          {!isFullScreen && (
            <>
              <div className="mx-auto">
                <div className="grid grid-cols-12">
                  <div className="col-span-10">
                    <h1 className="font-bold flex items-center">
                      {isInputTitre && (
                        <>
                          <FontAwesomeIcon icon={faFile} className="mr-2" />
                          <input
                            type="text"
                            className="input w-full text-black pl-2 pr-3 block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none focus:border-transparent"
                            value={nomProjet}
                            onInput={(e) => {
                              if (e.target.value) {
                                e.target.classList.add("ring-2", "ring-inset");
                              } else {
                                e.target.classList.remove(
                                  "ring-2",
                                  "ring-inset"
                                );
                              }
                            }}
                            onChange={(e) => setNomProjet(e.target.value)}
                            disabled={
                              categorie !== "Mes projets" && !verifyIfChef
                            }
                          />

                          {isSpinner && <Spinner />}
                        </>
                      )}
                      {isdivTitre && (
                        <p
                          onClick={(e) => {
                            setIsdivTitre(false);
                            setIsInputTitre(true);
                            e.stopPropagation();
                          }}
                        >
                          <FontAwesomeIcon icon={faFile} className="mr-2" />{" "}
                          {nomProjet}
                        </p>
                      )}
                    </h1>
                    <div
                      className="detailsContent flex"
                      onClick={() => {
                        modifierProjet();
                        setIsInputTitre(false);
                        setIsdivTitre(true);
                      }}
                    >
                      <div className={styles.left}>
                        <div className=" flex flex-wrap text-gray-600 text-xs sm:text-xs md:text-xs lg:text-xs xl:text-xs font-bold items-end">
                          <strong className="mr-2 ">Membres : </strong>
                          {ListChefs.length !== 0 && (
                            <ul className="flex flex-wrap">
                              {ListChefs.map((list) => (
                                <li key={list.id}>
                                  @ {list.utilisateur.nom}
                                  {list.role === "resp" && (
                                    <b>(Responsable hierarchique),&nbsp;</b>
                                  )}
                                  {list.role === "chef" && (
                                    <b>(Chef de projet),&nbsp;</b>
                                  )}
                                  {list.role === "membre" && (
                                    <b>(Membre),&nbsp;</b>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                          <Tippy content={showListemembre ? "Moins" : "Plus"}>
                            <FontAwesomeIcon
                              icon={faEllipsis}
                              onClick={() =>
                                setShowListemembre(!showListemembre)
                              }
                              className=" cursor-pointer text-gray-400 focus:outline-none"
                            />
                          </Tippy>
                        </div>
                        {showListemembre && (
                          <div className="border p-2 w-full text-xs">
                            <h1 className="font-bold">Listes des membres : </h1>
                            {ListChefs.length !== 0 && (
                              <ul>
                                {ListChefs.map((list) => (
                                  <div
                                    key={list.id}
                                    className="flex justify-between items-center"
                                  >
                                    <li>
                                      - {list.utilisateur.nom}{" "}
                                      {list.role === "resp" && (
                                        <b>(Responsable hierarchique),&nbsp;</b>
                                      )}
                                      {list.role === "chef" && (
                                        <b>(Chef de projet),&nbsp;</b>
                                      )}
                                      {list.role === "membre" && (
                                        <b>(Membre),&nbsp;</b>
                                      )}{" "}
                                    </li>
                                    {(categorie === "Mes projets" ||
                                      verifyIfChef) && (
                                      <Tippy content="Retirer">
                                        <FontAwesomeIcon
                                          onClick={() =>
                                            retirerChefs(
                                              list.id,
                                              list.utilisateur.nom
                                            )
                                          }
                                          icon={faXmark}
                                          className=" cursor-pointer text-gray-400 focus:outline-none"
                                        />
                                      </Tippy>
                                    )}
                                  </div>
                                ))}
                              </ul>
                            )}
                            {ListChefs.length === 0 && <p>...</p>}
                          </div>
                        )}

                        <div className="mt-2 hidden flex items-end flex-wrap">
                          <strong className="mr-2">Début :</strong>{" "}
                          <div>{dateDebut}</div>
                        </div>
                        {dateFin && (
                          <p className="mt-2 hidden flex items-end flex-wrap">
                            <strong className="mr-2">Date limite :</strong>
                            <input
                              type="date"
                              disabled={
                                categorie !== "Mes projets" && !verifyIfChef
                              }
                              className="input pl-3 pr-3 block rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                              value={dateFin}
                              onChange={(e) => setDateFin(e.target.value)}
                            />
                          </p>
                        )}
                        {!description &&
                          (categorie === "Mes projets" || verifyIfChef) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsTinyDescription(true);
                              }}
                              className="px-3 py-1 border mt-2 text-white rounded bg-gray-400"
                            >
                              Ajouter une description
                            </button>
                          )}
                      </div>
                    </div>

                    {isdivDescription && (
                      <div
                        className="bg-gray-100 editors p-1 rounded w-full text-grey text-xs mt-2"
                        dangerouslySetInnerHTML={{ __html: description }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsdivDescription(false);
                          setIsTinyDescription(true);
                        }}
                      ></div>
                    )}
                    {isTinyDescription && (
                      <>
                        <h1 className="mt-2 text-xs">Descriptions : </h1>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="mt-2 editors w-full "
                        >
                          <Editor
                            apiKey="grqm2ym9jtrry4atbeq5xsrd1rf2fe5jpsu3qwpvl7w9s7va"
                            onInit={(_evt, editor) => {
                              editorRef.current = editor;
                            }}
                            initialValue={description}
                            disabled={
                              categorie !== "Mes projets" && !verifyIfChef
                            }
                            init={{
                              height: 200,
                              min_height: 200,
                              menubar: false,
                              branding: false,
                              plugins: "textcolor",
                              toolbar: "bold italic forecolor",
                              content_style:
                                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="col-span-2 p-4">
                    <div className="buttonList w-[100%]">
                      <div className={styles.fullScreen}>
                        <button
                          className="w-full text-xs font-medium text-white py-2 bg-blue-500"
                          onClick={() => setShowComs(true)}
                        >
                          <FontAwesomeIcon
                            icon={faPaperPlane}
                            className=" mr-2 px-1"
                          />
                          Commenter
                        </button>
                        {(categorie === "Mes projets" || verifyIfChef) && (
                          <button
                            className="w-full text-xs font-medium text-white py-2 bg-blue-500"
                            onClick={() => setProject()}
                          >
                            <FontAwesomeIcon
                              icon={faPlus}
                              className=" mr-2 px-1"
                            />
                            Inviter membre
                          </button>
                        )}
                        {(categorie === "Mes projets" || verifyIfChef) && (
                          <button
                            onClick={deleteProject}
                            className="w-full text-xs text-white py-2 bg-red-500"
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              className=" mr-2 px-1"
                            />
                            Supprimer ce projet
                          </button>
                        )}
                      </div>
                      <div className={styles.smallScreen}>
                        <Tippy content=" Inviter des membres">
                          <FontAwesomeIcon
                            onClick={() => setProject()}
                            icon={faPlus}
                            className=" mr-2"
                          />
                        </Tippy>
                        <Tippy content="Supprimer ce projet">
                          <FontAwesomeIcon
                            icon={faTrash}
                            onClick={deleteProject}
                            className=" text-red-500 mr-2"
                          />
                        </Tippy>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {isTask && (
                <div className=" flex flex-wrap text-xs mt-2">
                  <h1 className="mt-2 font-bold mr-4">Tâches du groupe : </h1>
                  <div
                    className="relative"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <div className="flex">
                      <div className="mr-2">
                        {(categorie === "Mes projets" || verifyIfChef) && (
                          <button
                            className="input w-40 flex justify-evenly shadow-lg font-bold rounded-md bg-blue-500 border-0 py-1"
                            onClick={handleToggle}
                          >
                            AJOUTER
                            <FontAwesomeIcon
                              icon={faCaretDown}
                              className=" w-4 h-4 cursor-pointer focus:outline-none"
                            />
                          </button>
                        )}

                        {isOpen && (
                          <ul className="absolute left-20 w-60 z-10 bg-white border rounded-md mt-1">
                            <li
                              onClick={addInputField}
                              className="cursor-pointer p-2 bg-gray-100  text-left pl-5"
                            >
                              <FontAwesomeIcon icon={faPlus} className="mr-2" />
                              Ajouter un champ
                            </li>
                            <li
                              onClick={addtask}
                              className="cursor-pointer p-2 bg-gray-100  text-left pl-5"
                            >
                              <FontAwesomeIcon icon={faPlus} className="mr-2" />
                              Ajouter une tâche
                            </li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {listIDTache.length !== 0 && (
            <button
              onClick={deleteSomeTask}
              className="rounded px-5 text-xs mt-2 text-white bg-red-500 py-1.5"
            >
              <FontAwesomeIcon icon={faTrash} className=" mr-2" />
              Supprimer les tâches sélectionnées{" "}
            </button>
          )}

          <div className="flex flex-wrap bg-blue-100 mt-2 py-2 text-gray-500 rounded px-5  text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm">
            {(categorie === "Mes projets" ||
              categorie === "Responsable hierarchique" ||
              verifyIfChef) && (
              <li
                className={
                  isTask
                    ? "text-blue-500 mr-20 cursor-pointer"
                    : "mr-20 cursor-pointer"
                }
                onClick={showTask}
              >
                Tâches
              </li>
            )}
            {(categorie === "Mes projets" ||
              categorie === "Responsable hierarchique" ||
              verifyIfChef) && (
              <li
                className={
                  isSousProjet
                    ? "text-blue-500 mr-20 cursor-pointer"
                    : "mr-20 cursor-pointer"
                }
                onClick={showSousProjet}
              >
                Grandes étapes
              </li>
            )}

            <li
              className={
                isKanban
                  ? "text-blue-500 mr-20 cursor-pointer"
                  : "mr-20 cursor-pointer"
              }
              onClick={showKanban}
            >
              Tableaux Kanban
            </li>
            <li
              className={
                isCalendrier
                  ? "text-blue-500 mr-20 cursor-pointer"
                  : "mr-20 cursor-pointer"
              }
              onClick={showCalendrier}
            >
              Feuille de temps
            </li>
            <li
              className={
                isGantt
                  ? "text-blue-500 mr-20 cursor-pointer"
                  : "mr-20 cursor-pointer"
              }
              onClick={showGantt}
            >
              GANTT
            </li>
            {(categorie === "Mes projets" ||
              categorie === "Responsable hierarchique" ||
              verifyIfChef) && (
              <li
                className={
                  isGestionPlanning
                    ? "text-blue-500 mr-20 cursor-pointer"
                    : "mr-20 cursor-pointer"
                }
                onClick={showGestPlanning}
              >
                Gestion de planning
              </li>
            )}
            {(categorie === "Mes projets" ||
              categorie === "Responsable hierarchique" ||
              verifyIfChef) && (
              <li
                className={
                  isLigneBudg
                    ? "text-blue-500 mr-20 cursor-pointer"
                    : "mr-20 cursor-pointer"
                }
                onClick={showGestLignBudg}
              >
                Ligne budgétaire
              </li>
            )}
          </div>
          {isTask && (
            <>
              <div className="overflow-x-auto shadow-lg text-xs">
                <div className=" flex  items-center min-w-max  border py-2 px-2">
                  <li className={styles.options}>
                    <div
                      className="relative"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Tippy content="Paramètres visibles">
                        <FontAwesomeIcon
                          icon={faGear}
                          onClick={handleToggleParams}
                          className=" text-gray-500 cursor-pointer focus:outline-none w-5"
                        />
                      </Tippy>
                      {isOpenParams && (
                        <ul className="absolute w-60 z-10 bg-white border rounded-md mt-1">
                          <li className="cursor-pointer flex p-2 bg-gray-400 border-2 border-gray-400 text-left pl-5">
                            Paramètres visibles
                          </li>
                          {ListChamps.map((champ, index) => (
                            <li
                              key={index}
                              className="cursor-pointer flex p-2 bg-gray-100  text-left pl-5"
                            >
                              <input
                                type="checkbox"
                                checked={champ.visible}
                                onChange={() =>
                                  setVisibility(champ.visible, champ.id)
                                }
                                className="mr-4"
                              />
                              <p>{champ.label}</p>
                            </li>
                          ))}
                          {ListChamps.length === 0 && (
                            <li className="text-xs pl-5 p-1 text-gray-500">
                              Aucun résultat trouvé
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  </li>
                  <li className={styles.designation}>Désignation</li>
                  <li className={styles.status}>Avancement</li>
                  <li className={styles.limite}>Date debut</li>
                  <li className={styles.limite}>Date limite</li>
                  <li className={styles.responsable}>Responsable</li>
                  <div className="flex">
                    {ListChamps.map((champ) => (
                      <div key={champ.id}>
                        {champ.visible !== 0 && (
                          <li className="w-[200px] mr-2">{champ.label}</li>
                        )}
                      </div>
                    ))}
                  </div>
                  <li className="ml-4 w-5"></li>
                  <li className="ml-4 w-5 "></li>
                </div>
                <div className="min-h-[55vh] max-h-[55vh] border min-w-max overflow-y-auto ">
                  {listEtape.map((etape) => (
                    <div key={etape.id}>
                      <div className="pl-2 py-1 bg-gray-200 text-sm font-bold flex items-center">
                        <FontAwesomeIcon icon={faThumbtack} className=" mr-2" />
                        {etape.nom}
                      </div>
                      {etape.taches.map((list) => (
                        <div key={list.id}>
                          <div className=" py-2 flex  min-w-max border px-2">
                            <li className={styles.options}>
                              {(categorie === "Mes projets" ||
                                verifyIfChef) && (
                                <input
                                  type="checkbox"
                                  checked={listIDTache.includes(list.id)}
                                  onChange={() => addIdTask(list.id)}
                                  className="w-5 mr-2"
                                />
                              )}

                              <p className="w-5"></p>
                            </li>
                            <h1 className={styles.designation}>{list.titre}</h1>
                            <h1 className={`${styles.status} pl-5`}>
                              {list.avancement || 0} %
                            </h1>
                            <h1 className={styles.limite}>{list.date_debut}</h1>
                            <h1 className={styles.limite}>
                              {list.date_limite}
                            </h1>
                            <h1 className={styles.responsables}>
                              {list.responsables.map((res) => (
                                <span key={res.id}>{res.utilisateur.nom},</span>
                              ))}
                            </h1>
                            <div className="flex">
                              {list.champsVisibles.map((champ) => (
                                <div key={champ.id}>
                                  {champ.visible !== 0 && (
                                    <li className="w-[200px] mr-2">
                                      {champ.valeur || "..."}
                                    </li>
                                  )}
                                </div>
                              ))}
                            </div>{" "}
                            {(categorie === "Mes projets" || verifyIfChef) && (
                              <Tippy content="Modifier">
                                <FontAwesomeIcon
                                  icon={faSliders}
                                  onClick={() => setTask(list.id)}
                                  className=" cursor-pointer focus:outline-none w-5 ml-4 "
                                />
                              </Tippy>
                            )}
                            {(categorie === "Mes projets" || verifyIfChef) && (
                              <FontAwesomeIcon
                                icon={faTrash}
                                onClick={() => deleteTask(list.id)}
                                className="text-red-500 cursor-pointer w-5  ml-4 "
                              />
                            )}
                          </div>
                        </div>
                      ))}
                      {etape.taches.length === 0 && (
                        <p className=" text-center py-2 text-gray-500">
                          Aucune tâche trouvé...
                        </p>
                      )}
                    </div>
                  ))}

                  {listEtape.length === 0 && (
                    <p className=" text-center mt-5 text-gray-500">
                      Aucune étape trouvé...
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {isKanban && <TableauKanban />}
          {isSousProjet && <SousProjet />}
          {isCalendrier && <Calendrier />}
          {isGantt && <Gantt />}
          {isGestionPlanning && <GestionPlanning />}
          {isLigneBudg && <LigneBudgetaire />}

          <div>
            {(categorie === "Mes projets" || verifyIfChef) && (
              <button
                onClick={modifierProjet}
                className="w-full  text-white py-2 bg-blue-500 hidden"
              >
                <FontAwesomeIcon icon={faEdit} className=" mr-2" />
                Modifier le projet
              </button>
            )}

            {showAddFieldModal && (
              <div
                className="modalInput"
                onClick={() => {
                  setShowAddFieldModal(false);
                  setInputFields([]);
                }}
              >
                <div
                  className="modal-content max-h-[80vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="modal-title text-left font-bold">
                    Ajouter un champ :
                  </h2>
                  <div className="modal-body text-xs">
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
                  <div className="modal-footer text-xs mt-5">
                    <button
                      onClick={handleAddField}
                      className="mr-2 bg-blue-500 text-white px-4 py-2 rounded-sm"
                    >
                      Ajouter
                    </button>
                    <button
                      onClick={() => {
                        setShowAddFieldModal(false);
                      }}
                      className=" bg-yellow-500 text-white px-4 py-2 rounded-sm"
                    >
                      Retour
                    </button>
                  </div>
                  <div className=" text-xs">
                    {ListChamps.map((item, index) => (
                      <div key={index} className=" mt-4 flex flex-col">
                        <label className="font-bold" htmlFor={`input-${index}`}>
                          {item.label} :
                        </label>
                        <div className="flex items-center">
                          <input
                            type={item.type}
                            disabled
                            className="input w-full pl-2 pr-2 block mt-1 mr-2  rounded-sm border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                          />
                          <FontAwesomeIcon
                            icon={faTrash}
                            onClick={() => deleteChamps(item.id)}
                            className=" mr-2 px-1 text-red-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {showComs && (
              <div
                className="modalInput "
                onClick={() => {
                  setShowComs(false);
                }}
              >
                <div
                  className="modal-content max-h-[80vh] w-[50%] rounded overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={`${styles.form} text-xs w-full`}>
                    <h1 className="font-bold">Commenter ici :</h1>
                    <div className={styles.formInputs}>
                      <div className="sm:col-span-3 mt-2 mr-5 w-full">
                        <div className="mt-1 ">
                          <textarea
                            className="min-h-[80px] pl-3 pr-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                            placeholder="Écrivez ici..."
                            value={coms}
                            onChange={(e) => setComs(e.target.value)}
                          />
                          <div className={styles.iconContainer}>
                            <div className="relative bottom-7 bg-white flex items-center">
                              {nomFileUploaded && (
                                <>
                                  {" "}
                                  <FontAwesomeIcon
                                    icon={faFile}
                                    className="bg-yellow-500 text-white rounded p-1 mr-2"
                                  />
                                  <p className={styles.fileuploadLabel}>
                                    {nomFileUploaded}
                                    <FontAwesomeIcon
                                      onClick={removeFile}
                                      icon={faXmark}
                                      className="ml-1 cursor-pointer"
                                    />
                                  </p>
                                </>
                              )}
                            </div>

                            <Tippy content="Joindre un fichier">
                              <FontAwesomeIcon
                                icon={faPaperclip}
                                onClick={handleFileInputClick}
                                className="relative bottom-6 text-gray-500 cursor-pointer focus:outline-none"
                              />
                            </Tippy>
                            <Tippy content="Envoyer le message">
                              <FontAwesomeIcon
                                icon={faPaperPlane}
                                onClick={envoyerComs}
                                className="relative bottom-6 text-gray-500 mr-2 cursor-pointer focus:outline-none"
                              />
                            </Tippy>
                            <input
                              type="file"
                              ref={fileInputRef}
                              style={{ display: "none" }}
                              onChange={handleFileUpload}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {listeCommentaire.length !== 0 && (
                    <div className={`${styles.comsContent} text-xs w-full`}>
                      <h1 className="font-bold mb-2">Liste des commentaires</h1>
                      <ul className={styles.coms}>
                        {listeCommentaire.map((comment) => (
                          <li
                            key={comment.id}
                            className="flex justify-between flex-wrap items-center  py-3 pr-2"
                          >
                            <div className="flex w-full flex-wrap">
                              {comment.utilisateur.photo_profil === null && (
                                <div className={styles.profil}></div>
                              )}
                              {comment.utilisateur.photo_profil !== null && (
                                <div
                                  className="w-[25px] h-[25px] bg-cover"
                                  style={{
                                    backgroundImage: `url(${url}/storage/${comment.utilisateur.photo_profile})`,
                                  }}
                                ></div>
                              )}

                              <div className={styles.contents}>
                                <p className="text-gray-700 ">
                                  {comment.contenu}
                                </p>
                                <span className="text-sm text-gray-500 flex flex-wrap">
                                  {comment.file && (
                                    <a
                                      className={styles.lien}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      href={`${url}/storage/${comment.file}`}
                                    >
                                      {" "}
                                      <p className={styles.fileuploadLabel}>
                                        {comment.file.split("/").pop()}
                                      </p>
                                      <FontAwesomeIcon
                                        icon={faCloudArrowDown}
                                        className=" p-1 "
                                      />
                                    </a>
                                  )}
                                </span>
                              </div>
                              {comment.utilisateur.id === user.id && (
                                <div className="flex space-x-2 justify-center pl-5 w-[3%]">
                                  <Tippy content="Supprimer">
                                    <button
                                      onClick={() => handleDelete(comment.id)}
                                      className="text-red-500"
                                    >
                                      <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                  </Tippy>
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
