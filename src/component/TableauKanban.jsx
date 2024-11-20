import React, { useContext, useState, useEffect } from "react";
import styles from "../styles/Kanban.module.css";
import { UrlContext } from "../contexte/useUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TaskContext } from "../contexte/useTask";
import { ShowContext } from "../contexte/useShow";
import Tippy from "@tippyjs/react";
import { ProjectContext } from "../contexte/useProject";

import {
  faEllipsisVertical,
  faPlus,
  faClock,
  faEllipsis,
  faXmark,
  faTrash,
  faThumbtack,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function TableauKanban() {
  const {
    ListTask,
    getAllTask,
    getAllStatusTaskKanban,
    ListStatusTask,
    setIdStatus,
    setListTaskToMove,
  } = useContext(TaskContext);
  const { url } = useContext(UrlContext);
  const { setShowSpinner, setShowDeleteStatus, setShowDeleteStatusTask } =
    useContext(ShowContext);
  const { idProjet } = useContext(ProjectContext);

  const [columnInput, setColumnInput] = useState("");
  const [showColumnForm, setShowColumnForm] = useState(false);
  const [idTask, setIdTask] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeColumnDropdown, setActiveColumnDropdown] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalUsers, setModalUsers] = useState([]);

  useEffect(() => {
    getAllStatusTaskKanban();
    getAllTask();
  }, []);

  function openModal(users) {
    setModalUsers(users);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  function toggleColumnDropdown(columnId) {
    setActiveColumnDropdown((prev) => (prev === columnId ? null : columnId));
    setActiveDropdown(null);
  }

  function closeDropdown() {
    setActiveDropdown(null);
    setActiveColumnDropdown(null);
  }

  function addColumn() {
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    let formData = {
      valeur: columnInput,
      gest_proj_projet_id: idProjet,
    };

    axios
      .post(`${url}/api/projets/statuts-taches`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getAllStatusTaskKanban();
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });

    setColumnInput("");
    setShowColumnForm(false);
  }

  function handleShowColumnForm() {
    setShowColumnForm(true);
  }

  function handleHideColumnForm() {
    setShowColumnForm(false);
    setColumnInput("");
  }

  function handleDragStart(taskId) {
    setIdTask(taskId);
  }

  function handleDrop(targetColumnId) {
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    let formData = {
      gest_proj_statuts_tache_id: targetColumnId,
    };
    axios
      .put(`${url}/api/projets/taches/${idTask}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getAllTask();
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  function handleDeleteColumn(columnId) {
    setIdStatus(columnId);
    const tasksInColumn = ListTask.filter(
      (task) => task.statut.id === columnId
    );
    setListTaskToMove(tasksInColumn);
    if (tasksInColumn.length === 0) {
      setShowDeleteStatus(true);
    }
    if (tasksInColumn.length !== 0) {
      setShowDeleteStatusTask(true);
    }
  }

  return (
    <div
      className=" flex flex-wrap bg-gray-100 min-h-[65vh]"
      onClick={closeDropdown}
    >
      <div className="overflow-x-hidden p-5 flex justify-center flex-wrap overflow-auto">
        {ListStatusTask.map((status) => (
          <div
            key={status.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(status.id)}
            className="mx-2"
          >
            <h2 className="px-3 py-1 min-w-[200px] flex items-center justify-between">
              {status.valeur}
              <div className="relative">
                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleColumnDropdown(status.id);
                  }}
                />
                {activeColumnDropdown === status.id && (
                  <ul className="flex justify-end text-black font-light dropdown-menu absolute z-50 right-0 w-60 ">
                    <li
                      className="text-xs border dropdown-item flex items-center px-3 bg-white py-2 cursor-pointer"
                      onClick={() => handleDeleteColumn(status.id)}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="red-icon mr-2"
                      />
                      Supprimer la colonne
                    </li>
                  </ul>
                )}
              </div>
            </h2>
            <div className=" overflow-y-auto">
              {ListTask.map(
                (task) =>
                  task.statut.id === status.id && (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                      className="w-[250px] bg-white border shadow-lg p-3 rounded shadow-sm"
                    >
                      <div className="px-1 min-w-[200px] flex h-2 justify-end"></div>
                      <h1 className=" text-xs font-bold">
                        <FontAwesomeIcon
                          icon={faThumbtack}
                          className="mr-2 text-gray-500"
                        />
                        {task.titre}
                      </h1>
                      <div
                        className="text-xs"
                        dangerouslySetInnerHTML={{ __html: task.description }}
                      ></div>

                      <div className="flex flex-wrap-reverse justify-between items-center mt-1">
                        <div className="flex  items-end">
                          {task.date_limite && (
                            <p className="mt-1 relative flex items-center justify-center text-xs bg-green-400 w-28 h-6 text-center rounded-xl">
                              <FontAwesomeIcon
                                icon={faClock}
                                className="mr-2"
                              />
                              {task.date_limite}
                            </p>
                          )}
                        </div>
                        <Tippy content="Responsables">
                          <div className="flex -space-x-1 overflow-hidden">
                            {task.responsables.slice(0, 2).map((resp) => (
                              <div
                                key={resp.id}
                                className="cursor-pointer inline-block bg-cover bg-center size-6 rounded-full ring-2 ring-white"
                                style={{
                                  backgroundImage: `url(${url}/storage/${resp.utilisateur.photo_profile})`,
                                }}
                                onClick={() => openModal(task.responsables)}
                              ></div>
                            ))}
                            {task.responsables.length > 2 && (
                              <div
                                onClick={() => openModal(task.responsables)}
                                className="inline-block bg-gray-300 size-6 rounded-full ring-2 ring-white flex items-center justify-center text-xs font-medium text-gray-600 cursor-pointer"
                              >
                                +{task.responsables.length - 2}
                              </div>
                            )}
                          </div>
                        </Tippy>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-sm p-5 max-w-sm w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={closeModal}
            >
              <FontAwesomeIcon icon={faXmark} size="lg" />
            </button>
            <h2 className="text-lg font-bold text-sm mb-4">
              Liste des responsables
            </h2>
            <ul className="max-h-60 overflow-y-auto">
              {modalUsers.map((user) => (
                <li key={user.id} className="flex items-center mb-2">
                  <div
                    className="w-8 h-8 bg-cover bg-center rounded-full mr-3"
                    style={{
                      backgroundImage: `url(${url}/storage/${user.utilisateur.photo_profile})`,
                    }}
                  ></div>
                  <span className="text-xs">{user.utilisateur.nom}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className=" mt-5 ml-4 text-xs">
        {showColumnForm ? (
          <div>
            <input
              type="text"
              className="py-2 border border-2 rounded px-3 w-full focus:outline-none"
              placeholder="Nouveau statut..."
              value={columnInput}
              onChange={(e) => setColumnInput(e.target.value)}
            />
            <div className="flex items-center mt-2">
              <button
                onClick={addColumn}
                className="px-10 py-1 bg-blue-500 rounded mr-2 border font-bold"
              >
                Valider
              </button>
              <FontAwesomeIcon
                icon={faXmark}
                className="mr-1 cursor-pointer hover:bg-gray-300 py-1 px-1.5 rounded"
                onClick={handleHideColumnForm}
              />
            </div>
          </div>
        ) : (
          <button onClick={handleShowColumnForm} className="mt-2 text-gray-500">
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Ajouter un statut
          </button>
        )}
      </div>
    </div>
  );
}
