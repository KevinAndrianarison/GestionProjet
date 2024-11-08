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
import { UserContext } from "../contexte/useUser";
import { ComsContext } from "../contexte/useComs";
import TableauKanban from "./TableauKanban";
import GestionPlanning from "./GestionPlanning";
import LigneBudgetaire from "./LigneBudgetaire";
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
  } = useContext(ShowContext);
  const {
    categorie,
    setNomProjet,
    nomProjet,
    dateDebut,
    setDateFin,
    dateFin,
    description,
    ListMembres,
    getAllproject,
    getProjectWhenChef,
    getProjectWhenMembres,
    ListChefs,
    idProjet,
    getOneProjet,
  } = useContext(ProjectContext);

  const { ListTask, setIdTask, getOneTask } = useContext(TaskContext);

  const [showListemembre, setShowListemembre] = useState(false);
  const [coms, setComs] = useState("");
  const [oldValueTitre, setOldValueTitre] = useState("");
  const [oldDescription, setOldDescription] = useState("");
  const [nomFileUploaded, setNomFileUploaded] = useState("");
  const [file, setFile] = useState(null);
  const [verifyIfChef, setVerifyIfChef] = useState(false);
  const [newFieldType, setNewFieldType] = useState("text");
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [inputFields, setInputFields] = useState([]);
  const editorRef = useRef("");
  const { setMessageSucces, setMessageError } = useContext(MessageContext);
  const { url } = useContext(UrlContext);
  const { setIduser, setNomuser, setIdRoleuser } = useContext(UserContext);
  const { getAllComs, listeCommentaire } = useContext(ComsContext);
  const fileInputRef = useRef(null);
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

  const userString = localStorage.getItem("user");
  let user = JSON.parse(userString);

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
    let idIfChef;
    if (!description) {
      setIsdivDescription(false);
    }
    setOldValueTitre(nomProjet);
    setOldDescription(description);
    ListChefs.forEach((list) => {
      
      if (
        list.utilisateur.grade === "chef" ||
        list.utilisateur.role === "admin"
      ) {
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
    setInputFields([
      ...inputFields,
      { type: newFieldType, label: newFieldLabel },
    ]);
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
      .delete(`${url}/api/commentaires/${id}`, {
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

  function removeInputField(index) {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  }

  function addInputField() {
    setIsOpen(false);
    setShowAddFieldModal(true);
  }

  function setTask(id) {
    setIdTask(id);
    getOneTask(id);
  }

  function addtask() {
    setIsOpen(false);
    setShowTask(true);
  }

  function deleteTask(id) {
    setIdTask(id);
    setShowDeletetask(true);
  }

  function envoyerComs() {
    const userString = localStorage.getItem("user");
    let user = JSON.parse(userString);
    const formData = new FormData();
    formData.append("file", file || "");
    formData.append("contenu", coms || "");
    formData.append("gest_proj_projet_id", idProjet || "");
    formData.append("gest_com_utilisateur_id", user.id || "");

    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .post(`${url}/api/commentaires`, formData, {
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

  function modifierProjet() {
    if (
      nomProjet !== oldValueTitre ||
      editorRef.current.getContent() !== oldDescription
    ) {
      let formData = {
        titre: nomProjet,
        date_debut: dateDebut,
        date_fin: dateFin,
        description: editorRef.current.getContent(),
      };

      const tokenString = localStorage.getItem("token");
      let token = JSON.parse(tokenString);
      const userString = localStorage.getItem("user");
      let user = JSON.parse(userString);
      axios
        .put(
          `${url}/api/entreprises/projets/${user.id}/${idProjet}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
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
        })
        .catch((err) => {
          console.error(err);
        });

      if (nomProjet !== oldValueTitre) {
        setOldValueTitre(nomProjet);
      }
      if (editorRef.current.getContent() !== oldDescription) {
        setOldDescription(editorRef.current.getContent());
      }
    }
  }

  return (
    <>
      <div
        className={styles.modalOverlay}
        onClick={() => setShowDetails(false)}
      >
        <div
          className={styles.modalContent}
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
          <button
            className={styles.closeButton}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <FontAwesomeIcon
              icon={faTimes}
              className="text-red-600 font-bold border-4 border-red-500 rounded-full px-1 py-0.5"
            />
          </button>
          <div className="mx-auto">
            <div className="grid grid-cols-12">
              <div className="col-span-10">
                <h1 className={styles.titreProjet}>
                  {isInputTitre && (
                    <>
                      <FontAwesomeIcon icon={faFile} className="mr-2" />
                      <input
                        type="text"
                        className="input w-full text-black pl-2 pr-3 block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-transparent focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none focus:border-transparent"
                        value={nomProjet}
                        onInput={(e) => {
                          if (e.target.value) {
                            e.target.classList.add(
                              "ring-2",
                              "ring-inset",
                              "ring-[rgba(0, 184, 148, 1.0)]"
                            );
                          } else {
                            e.target.classList.remove(
                              "ring-2",
                              "ring-inset",
                              "ring-[rgba(0, 184, 148, 1.0)]"
                            );
                          }
                        }}
                        onChange={(e) => setNomProjet(e.target.value)}
                        disabled={categorie !== "Mes projets" && !verifyIfChef}
                      />
                    </>
                  )}
                  {isdivTitre && (
                    <p
                      className={styles.titreProjetP}
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
                    <div className=" flex flex-wrap items-end text-gray-600 text-xs sm:text-xs md:text-xs lg:text-xs xl:text-xs font-bold items-end">
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
                              {list.role === "membre" && <b>(Membre),&nbsp;</b>}
                            </li>
                          ))}
                        </ul>
                      )}
                      <Tippy content={showListemembre ? "Moins" : "Plus"}>
                        <FontAwesomeIcon
                          icon={faEllipsis}
                          onClick={() => setShowListemembre(!showListemembre)}
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
                        disabled={categorie !== "Mes projets" && !verifyIfChef}
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
                {(categorie === "Mes projets" || verifyIfChef) && (
                  <div className="buttonList w-[100%]">
                    <div className={styles.fullScreen}>
                      <button
                        className="w-full text-xs font-medium text-white py-2 bg-blue-500"
                        onClick={() => setProject()}
                      >
                        <FontAwesomeIcon icon={faPlus} className=" mr-2 px-1" />
                        Inviter membre
                      </button>
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
                )}
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
          )}
          <div className="flex flex-wrap bg-blue-100 mt-2 py-2 text-gray-500 rounded px-5  text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm">
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
          </div>
          {isTask && (
            <div className="overflow-x-auto shadow-lg text-xs">
              <div className="mt-1 flex  items-center min-w-max  border py-2 px-2">
                <li className={styles.options}>
                  <input type="checkbox" className="w-5 mr-2" />
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
                        <li className="cursor-pointer flex p-2 bg-gray-100  text-left pl-5">
                          <input type="checkbox" className="mr-4" />
                          <p>First</p>
                        </li>
                        <li className="cursor-pointer flex p-2 bg-gray-100  text-left pl-5">
                          <input type="checkbox" className="mr-4" />
                          <p>Second</p>
                        </li>
                      </ul>
                    )}
                  </div>
                </li>
                <li className={styles.designation}>Désignation</li>
                <li className={styles.status}>Status</li>
                <li className={styles.limite}>Date limite</li>
                <li className={styles.par}>Créé par</li>
                <li className={styles.responsable}>Responsable</li>
                <li className="ml-4 w-5"></li>
                <li className="ml-4 w-5 "></li>
              </div>
              {ListTask.map((list) => (
                <div
                  key={list.id}
                  className="min-h-[55vh] max-h-[55vh] border min-w-max overflow-y-auto "
                >
                  <div className=" py-2 flex  min-w-max border px-2">
                    <li className={styles.options}>
                      <input type="checkbox" className="w-5 mr-2" />
                      <p className="w-5"></p>
                    </li>
                    <h1 className={styles.designation}>{list.titre}</h1>
                    <h1 className={styles.status}> {list.utilisateur.nom}</h1>
                    <h1 className={styles.limite}> {list.utilisateur.nom}</h1>
                    <h1 className={styles.par}> {list.utilisateur.nom}</h1>
                    <h1 className={styles.responsable}>
                      {" "}
                      {list.utilisateur.nom}
                    </h1>
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
            </div>
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
                  className="modal-content"
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
                        setInputFields([]);
                      }}
                      className=" bg-yellow-500 text-white px-4 py-2 rounded-sm"
                    >
                      Annuler
                    </button>
                  </div>
                  {(categorie === "Mes projets" || verifyIfChef) && (
                    <div className="section mt-5 text-xs">
                      {inputFields.length !== 0 && (
                        <div className="label">Liste des champs :</div>
                      )}
                      <div className=" w-full  sections">
                        {inputFields.map((input, index) => (
                          <div key={index} className="w-full relative mt-1">
                            {input.label && (
                              <label className="input text-black font-bold input-label">
                                {input.label} :
                              </label>
                            )}
                            {!input.label && (
                              <label className="input text-black font-bold input-label">
                                &nbsp;
                              </label>
                            )}

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
                      </div>
                      <div className="flex justify-between w-full flex-wrap">
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
                  )}
                </div>
              </div>
            )}

            <div className={styles.form}>
              <h1 className="font-bold mt-2">Commenter ici :</h1>
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
              <div className={styles.comsContent}>
                <h1 className="text-xl font-bold mb-2">Commentaires</h1>
                <ul className={styles.coms}>
                  {listeCommentaire.map((comment) => (
                    <li
                      key={comment.id}
                      className="flex justify-between flex-wrap items-center border-b py-3 pr-2"
                    >
                      <div className="flex w-full flex-wrap">
                        {comment.utilisateur.photo_profil === null && (
                          <div className={styles.profil}></div>
                        )}
                        {comment.utilisateur.photo_profil !== null && (
                          <div
                            className="profil bg-cover bg-center"
                            style={{
                              backgroundImage: `url(${url}/storage/${comment.utilisateur.photo_profil})`,
                            }}
                          ></div>
                        )}

                        <div className={styles.contents}>
                          <p className="text-gray-700 ">{comment.contenu}</p>
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
      </div>
    </>
  );
}
