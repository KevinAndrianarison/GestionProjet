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

export default function DetailsProject() {
  const { setShowDetails, setShowDeleteTask, setShowSpinner } =
    useContext(ShowContext);
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
  const editorRef = useRef("");
  const { setMessageSucces, setMessageError } = useContext(MessageContext);
  const { url } = useContext(UrlContext);

  function onClose() {
    setShowDetails(false);
  }

  function deleteProject() {
    setShowDeleteTask(true);
  }

  const [comments, setComments] = useState([
    { id: 1, text: "This is the first comment", author: "John Doe" },
    { id: 2, text: "This is another comment", author: "Jane Smith" },
    { id: 3, text: "Yet another comment", author: "Alice Johnson" },
  ]);
  const handleEdit = (id) => {};

  const handleDelete = (id) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

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
              <div className="mt-2 flex flex-wrap items-end">
                <strong className="mr-2 underline">Membres : </strong>
                {ListChefs.length !== 0 && (
                  <ul className="flex">
                    {ListChefs.map((list) => (
                      <li key={list.id}>
                        @ {list.nom} <b>(Chef de projet)</b>
                      </li>
                    ))}
                  </ul>
                )}
                {ListMembres.length !== 0 && (
                  <ul className="flex">
                    {ListMembres.map((list) => (
                      <li key={list.id}>
                        , @ {list.nom} <b>(membre)</b>
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
                        <li key={list.id}>
                          - {list.nom} <b>(Chef de projet)</b>
                        </li>
                      ))}
                    </ul>
                  )}
                  {ListMembres.length !== 0 && (
                    <ul>
                      {ListMembres.map((list) => (
                        <li key={list.id}>
                          - {list.nom} <b>(membre)</b>
                        </li>
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
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "code",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                />
              </div>

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
                        {list.assignable.nom}
                      </h1>
                      <h1 className="text-center w-[8%]">
                        <Tippy content="Modifier">
                          <FontAwesomeIcon
                            icon={faSliders}
                            className=" cursor-pointer focus:outline-none"
                          />
                        </Tippy>
                      </h1>
                      <h1 className="text-center w-[8%]">
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="text-red-500 cursor-pointer"
                        />
                      </h1>
                    </div>
                  ))}
                </>
              )}
              {categorie === "Mes projets" && (
                <button
                  onClick={modifierProjet}
                  className="w-full  text-white py-2 bg-blue-500"
                >
                  <FontAwesomeIcon icon={faEdit} className=" mr-2" />
                  Modifier le projet
                </button>
              )}

              <div>
                <div className={styles.form}>
                  <h1 className="font-bold">Commenter ici :</h1>
                  <div className={styles.formInputs}>
                    <div className="sm:col-span-3 mt-2 mr-5 w-full">
                      <div className="mt-1 ">
                        <textarea
                          className="min-h-[80px] pl-3 pr-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                          placeholder="Écrivez ici..."
                        />
                        <div className={styles.iconContainer}>
                          <Tippy content="Télécharger un fichier">
                            <FontAwesomeIcon
                              icon={faPaperclip}
                              className="relative bottom-6 text-gray-500 cursor-pointer focus:outline-none"
                            />
                          </Tippy>
                          <Tippy content="Envoyer le message">
                            <FontAwesomeIcon
                              icon={faPaperPlane}
                              className="relative bottom-6 text-gray-500 cursor-pointer focus:outline-none"
                            />
                          </Tippy>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full p-2 mt-2 bg-white  rounded-sm border">
                <h1 className="text-xl font-bold mb-4">Commentaires</h1>
                <ul className={styles.coms}>
                  {comments.map((comment) => (
                    <li
                      key={comment.id}
                      className="flex justify-between items-center border-b py-3 pr-2"
                    >
                      <div>
                        <p className="text-gray-700">{comment.text}</p>
                        <span className="text-sm text-gray-500">
                          - {comment.author}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Tippy content="Modifier">
                          <button
                            onClick={() => handleEdit(comment.id)}
                            className="text-blue-500"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        </Tippy>
                        <Tippy content="Supprimer">
                          <button
                            onClick={() => handleDelete(comment.id)}
                            className="text-red-500"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </Tippy>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="buttonList w-[25%]">
              <div className={styles.fullScreen}>
                <button className="w-full  text-white py-2 bg-blue-500">
                  {" "}
                  <FontAwesomeIcon icon={faEdit} className=" mr-2" />
                  Ajouter des membres
                </button>
                <button className="w-full  text-white py-2 bg-blue-500">
                  <FontAwesomeIcon icon={faPlus} className=" mr-2" /> Ajouter
                  une tâche
                </button>
                <button
                  onClick={deleteProject}
                  className="w-full  text-white py-2 bg-red-500"
                >
                  <FontAwesomeIcon icon={faTrash} className=" mr-2" />
                  Supprimer ce projet
                </button>
              </div>
              <div className={styles.smallScreen}>
                <Tippy content=" Ajouter des membres">
                  <FontAwesomeIcon icon={faEdit} className=" mr-2" />
                </Tippy>
                <Tippy
                  content="Ajouter une
                tâche"
                >
                  <FontAwesomeIcon icon={faPlus} className=" mr-2" />
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
    </>
  );
}
