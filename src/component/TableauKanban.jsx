import React, { useContext, useState } from "react";
import styles from "../styles/Kanban.module.css";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TaskContext } from "../contexte/useTask";

import {
  faEllipsisVertical,
  faPlus,
  faClock,
  faEllipsis,
  faXmark,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-regular-svg-icons";

export default function TableauKanban() {
  const { ListTask } = useContext(TaskContext);
  const [columns, setColumns] = useState({
    todo: { name: "A faire", tasks: [] },
    inProgress: { name: "En cours", tasks: [] },
    done: { name: "Terminés", tasks: [] },
  });
  const [showTaskForm, setShowTaskForm] = useState({});
  const [taskInput, setTaskInput] = useState("");
  const [columnInput, setColumnInput] = useState("");
  const [showColumnForm, setShowColumnForm] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeColumnDropdown, setActiveColumnDropdown] = useState(null);

  function addTask(columnId) {
    if (!taskInput.trim()) return;
    const newTask = { id: uuidv4(), title: taskInput };
    setColumns((prevColumns) => ({
      ...prevColumns,
      [columnId]: {
        ...prevColumns[columnId],
        tasks: [...prevColumns[columnId].tasks, newTask],
      },
    }));
    setShowTaskForm((prev) => ({ ...prev, [columnId]: false }));
    setTaskInput("");
  }

  function toggleDropdown(taskId) {
    setActiveDropdown((prev) => (prev === taskId ? null : taskId));
    setActiveColumnDropdown(null);
  }

  function toggleColumnDropdown(columnId) {
    setActiveColumnDropdown((prev) => (prev === columnId ? null : columnId));
    setActiveDropdown(null);
  }

  function closeDropdown() {
    setActiveDropdown(null);
    setActiveColumnDropdown(null);
  }

  function handleHideForm(columnId) {
    setShowTaskForm((prev) => ({ ...prev, [columnId]: false }));
    setTaskInput("");
  }

  function handleShowForm(columnId) {
    setShowTaskForm((prev) => ({ ...prev, [columnId]: true }));
  }

  function addColumn() {
    if (!columnInput.trim()) return;
    const columnId = uuidv4();
    setColumns((prevColumns) => ({
      ...prevColumns,
      [columnId]: { name: columnInput, tasks: [] },
    }));
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

  function handleDragStart(e, taskId, sourceColumnId) {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceColumnId", sourceColumnId);
  }

  function handleDrop(e, targetColumnId) {
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColumnId = e.dataTransfer.getData("sourceColumnId");

    if (sourceColumnId === targetColumnId) return;

    const task = columns[sourceColumnId].tasks.find((t) => t.id === taskId);
    setColumns((prevColumns) => ({
      ...prevColumns,
      [sourceColumnId]: {
        ...prevColumns[sourceColumnId],
        tasks: prevColumns[sourceColumnId].tasks.filter((t) => t.id !== taskId),
      },
      [targetColumnId]: {
        ...prevColumns[targetColumnId],
        tasks: [...prevColumns[targetColumnId].tasks, task],
      },
    }));
  }

  function handleDeleteColumn(columnId) {
    setColumns((prevColumns) => {
      const newColumns = { ...prevColumns };
      delete newColumns[columnId];
      return newColumns;
    });
    closeDropdown();
  }

  return (
    <div
      className=" flex flex-wrap bg-gray-100 min-h-[65vh] py-4"
      onClick={closeDropdown}
    >
      <div className="  flex justify-center flex-wrap overflow-auto">
        {Object.entries(columns).map(([columnId, column]) => (
          <div
            key={columnId}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, columnId)}
            className="ml-2"
          >
            <h2 className="px-3 py-1   flex items-center justify-between">
              {column.name}
              <div className="relative">
                <FontAwesomeIcon
                  icon={faEllipsisVertical}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleColumnDropdown(columnId);
                  }}
                />
                {activeColumnDropdown === columnId && (
                  <ul className="border text-black font-light dropdown-menu absolute z-50 right-0 w-60 bg-white shadow-lg rounded-md">
                    <li
                      className="dropdown-item flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleDeleteColumn(columnId)}
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
              {ListTask.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id, columnId)}
                  className="w-[250px] bg-white border shadow-lg p-3 rounded shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown(task.id);
                  }}
                >
                  <p className="flex  justify-end cursor-pointer">
                    <FontAwesomeIcon
                      icon={faEllipsis}
                      className="relative bottom-2"
                    />
                  </p>

                  {activeDropdown === task.id && (
                    <ul className="border dropdown-menu absolute z-50 right-1 w-32 bg-white shadow-lg rounded-md">
                      <li className="dropdown-item flex items-center px-3 py-1 cursor-pointer hover:bg-gray-200">
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="red-icon mr-2"
                        />
                        Supprimer
                      </li>
                    </ul>
                  )}

                  <p className="text-xs bg-yellow-500 w-14 py-1 text-center rounded-xl">
                    Status
                  </p>
                  <p className="mt-2">{task.titre}</p>
                  <div className="flex flex-wrap-reverse justify-between">
                    <div className="flex mt-1 items-end">
                      <p className="relative flex items-center justify-center text-xs bg-green-400 w-28 h-6 text-center rounded-xl">
                        <FontAwesomeIcon icon={faClock} className="mr-2" />{" "}
                        {task.date_fin}
                      </p>
                    </div>
                    <div className="flex items-end text-gray-500">
                      <p>
                        <FontAwesomeIcon
                          icon={faMessage}
                          className="mr-1 cursor-pointer"
                        />{" "}
                        8
                      </p>
                    </div>
                    <div className={styles.imgKanban}></div>
                  </div>
                </div>
              ))}
            </div>
            {showTaskForm[columnId] ? (
              <div className="mt-2">
                <input
                  type="text"
                  className="py-2 border border-2 rounded px-3 w-full focus:outline-none"
                  placeholder="Ecrire ici..."
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                />
                <div className="  flex items-center mt-2">
                  <button
                    onClick={() => addTask(columnId)}
                    className="px-3 py-1 bg-blue-500 rounded mr-2 border"
                  >
                    Ajouter une carte
                  </button>
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="mr-1 cursor-pointer hover:bg-gray-300 py-1 px-1.5 rounded"
                    onClick={() => handleHideForm(columnId)}
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleShowForm(columnId)}
                className=" hidden mt-2 text-gray-500 pr-3 py-1 text-left"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" /> Ajouter une
                carte
              </button>
            )}
          </div>
        ))}
      </div>
      <div className=" mt-5 ml-4">
        {showColumnForm ? (
          <div>
            <input
              type="text"
              className="py-2 border border-2 rounded px-3 w-full focus:outline-none"
              placeholder="Nom de la nouvelle liste..."
              value={columnInput}
              onChange={(e) => setColumnInput(e.target.value)}
            />
            <div className="flex items-center mt-2">
              <button
                onClick={addColumn}
                className="px-3 py-1 bg-blue-500 rounded mr-2 border"
              >
                Ajouter une liste
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
