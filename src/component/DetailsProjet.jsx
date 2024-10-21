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
  faFile,
  faCloudArrowDown,
} from "@fortawesome/free-solid-svg-icons";
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

  const { ListTask, getAllTask, setIdTask, getOneTask } =
    useContext(TaskContext);

  const [showListemembre, setShowListemembre] = useState(false);
  const [coms, setComs] = useState("");
  const [nomFileUploaded, setNomFileUploaded] = useState("");
  const [file, setFile] = useState(null);
  const [newFieldType, setNewFieldType] = useState("text");
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [inputFields, setInputFields] = useState([]);
  const editorRef = useRef("");
  const { setMessageSucces, setMessageError } = useContext(MessageContext);
  const { url } = useContext(UrlContext);
  const { setIduser, setNomuser } = useContext(UserContext);
  const { getAllComs, listeCommentaire } = useContext(ComsContext);
  const fileInputRef = useRef(null);

  const userString = localStorage.getItem("user");
  let user = JSON.parse(userString);

  function onClose() {
    setShowDetails(false);
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
    setShowAddFieldModal(false);
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

  const handleEdit = (id) => {};

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

  function removeInputField(index) {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  }

  function addInputField() {
    setShowAddFieldModal(true);
  }

  function setTask(id) {
    setIdTask(id);
    getOneTask(id);
  }

  function addtask() {
    getAllTask();
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
    let formData = {
      titre: nomProjet,
      date_debut: dateDebut,
      date_fin: dateFin,
      description: editorRef.current.getContent(),
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
        if (categorie === "Tous les projets") {
          getAllproject();
        }
        if (categorie === "Mes projets") {
          getProjectWhenChef();
        }
        if (categorie === "Les projets dont je fait partie") {
          getProjectWhenMembres();
        }
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
      <div
        className={styles.modalOverlay}
        onClick={() => setShowDetails(false)}
      >
        <div
          className={styles.modalContent}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <h1 className={styles.titreProjet}>
            <input
              type="text"
              className="input pl-3 pr-3 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
              value={nomProjet}
              onChange={(e) => setNomProjet(e.target.value)}
              disabled={categorie !== "Mes projets"}
            />
          </h1>
          <div className="detailsContent flex">
            <div className={styles.left}>
              <div className="mt-2 flex flex-wrap  items-end">
                <strong className="mr-2 underline">Membres : </strong>
                {ListChefs.length !== 0 && (
                  <ul className="flex flex-wrap">
                    {ListChefs.map((list) => (
                      <li key={list.id}>
                        @ {list.nom} <b>(Chef de projet),&nbsp;</b>
                      </li>
                    ))}
                  </ul>
                )}
                {ListMembres.length !== 0 && (
                  <ul className="flex">
                    {ListMembres.map((list) => (
                      <li key={list.id}>
                        @ {list.nom} <b>(membre),&nbsp;</b>
                      </li>
                    ))}
                  </ul>
                )}
                <Tippy content={showListemembre ? "Moins" : "Plus"}>
                  <FontAwesomeIcon
                    icon={faEllipsis}
                    onClick={() => setShowListemembre(!showListemembre)}
                    className="w-5 h-5 cursor-pointer text-gray-400 focus:outline-none"
                  />
                </Tippy>
              </div>
              {showListemembre && (
                <div className="border p-2 w-[90%]">
                  <h1 className="font-bold">Listes des membres : </h1>
                  {ListChefs.length !== 0 && (
                    <ul>
                      {ListChefs.map((list) => (
                        <div
                          key={list.id}
                          className="flex justify-between items-center"
                        >
                          <li>
                            - {list.nom} <b>(Chef de projet)</b>{" "}
                          </li>
                          {categorie === "Mes projets" && (
                            <Tippy content="Retirer">
                              <FontAwesomeIcon
                                onClick={() => retirerChefs(list.id, list.nom)}
                                icon={faXmark}
                                className=" cursor-pointer text-gray-400 focus:outline-none"
                              />
                            </Tippy>
                          )}
                        </div>
                      ))}
                    </ul>
                  )}
                  {ListMembres.length !== 0 && (
                    <ul>
                      {ListMembres.map((list) => (
                        <div
                          key={list.id}
                          className="flex justify-between items-center"
                        >
                          <li>
                            - {list.nom} <b>(membre)</b>
                          </li>
                          {categorie === "Mes projets" && (
                            <Tippy content="Retirer">
                              <FontAwesomeIcon
                                onClick={() =>
                                  retirerMembres(list.id, list.nom)
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
                </div>
              )}

              <div className="mt-2 flex items-end flex-wrap">
                <strong className="mr-2">Début :</strong> <div>{dateDebut}</div>
              </div>
              {dateFin && (
                <p className="mt-2 flex items-end flex-wrap">
                  <strong className="mr-2">Date limite :</strong>
                  <input
                    type="date"
                    disabled={categorie !== "Mes projets"}
                    className="input pl-3 pr-3 block rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                    value={dateFin}
                    onChange={(e) => setDateFin(e.target.value)}
                  />
                </p>
              )}

              {ListTask.length !== 0 && (
                <>
                  {" "}
                  <h1 className="mt-2 font-bold">Tâches : </h1>
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
                        {list.utilisateur.nom}
                      </h1>
                      {categorie === "Mes projets" && (
                        <h1 className="text-center w-[8%]">
                          <Tippy content="Modifier">
                            <FontAwesomeIcon
                              icon={faSliders}
                              onClick={() => setTask(list.id)}
                              className=" cursor-pointer focus:outline-none"
                            />
                          </Tippy>
                        </h1>
                      )}
                      {categorie === "Mes projets" && (
                        <h1 className="text-center w-[8%]">
                          <FontAwesomeIcon
                            icon={faTrash}
                            onClick={() => deleteTask(list.id)}
                            className="text-red-500 cursor-pointer"
                          />
                        </h1>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
            {categorie === "Mes projets" && (
              <div className="buttonList w-[25%]">
                <div className={styles.fullScreen}>
                  <button
                    className="w-full  text-white py-2 bg-blue-500"
                    onClick={() => setProject()}
                  >
                    <FontAwesomeIcon icon={faEdit} className=" mr-2 px-1" />
                    Ajouter des membres
                  </button>
                  <button
                    onClick={addtask}
                    className="w-full  text-white py-2 bg-blue-500"
                  >
                    <FontAwesomeIcon icon={faPlus} className=" mr-2 px-1" />{" "}
                    Ajouter une tâche
                  </button>
                  <button
                    onClick={deleteProject}
                    className="w-full  text-white py-2 bg-red-500"
                  >
                    <FontAwesomeIcon icon={faTrash} className=" mr-2 px-1" />
                    Supprimer ce projet
                  </button>
                </div>
                <div className={styles.smallScreen}>
                  <Tippy content=" Ajouter des membres">
                    <FontAwesomeIcon
                      onClick={() => setProject()}
                      icon={faEdit}
                      className=" mr-2"
                    />
                  </Tippy>
                  <Tippy
                    content="Ajouter une
                tâche"
                  >
                    <FontAwesomeIcon
                      onClick={addtask}
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
          <div>
            <h1 className="mt-2 font-bold">Descriptions : </h1>
            <div className="editor">
              <Editor
                apiKey="grqm2ym9jtrry4atbeq5xsrd1rf2fe5jpsu3qwpvl7w9s7va"
                onInit={(_evt, editor) => {
                  editorRef.current = editor;
                }}
                initialValue={description}
                disabled={categorie !== "Mes projets"}
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
            {categorie === "Mes projets" && (
              <button
                onClick={modifierProjet}
                className="w-full  text-white py-2 bg-blue-500"
              >
                <FontAwesomeIcon icon={faEdit} className=" mr-2" />
                Modifier le projet
              </button>
            )}

            {categorie === "Mes projets" && (
              <div className="section mt-5">
                <div className="label font-bold">Ajouter des champs :</div>
                <div className=" w-full  sections mt-2">
                  {inputFields.map((input, index) => (
                    <div key={index} className="w-full relative mt-2">
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
            )}

            {showAddFieldModal && (
              <div
                className="modalInput"
                onClick={() => setShowAddFieldModal(false)}
              >
                <div
                  className="modal-content"
                  onClick={(e) => e.stopPropagation()}
                >
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

            <div className={styles.form}>
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
              <div className="w-full pt-2 px-2 mt-2 bg-white  rounded-sm border">
                <h1 className="text-xl font-bold mb-2">Commentaires</h1>
                <ul className={styles.coms}>
                  {listeCommentaire.map((comment) => (
                    <li
                      key={comment.id}
                      className="flex justify-between flex-wrap items-center border-b py-3 pr-2"
                    >
                      <div>
                        <p className="text-gray-700 whitespace-pre-line">
                          {comment.contenu}
                        </p>
                        <span className="text-sm text-gray-500 flex flex-wrap">
                          <p className="mr-2">- {comment.utilisateur.nom}</p>
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
                        <div className="flex space-x-2">
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
