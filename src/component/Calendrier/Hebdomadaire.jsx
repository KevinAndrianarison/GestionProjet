import { useState, useEffect, useContext } from "react";
import styles from "../../styles/Calendrier.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ShowContext } from "../../contexte/useShow";
import { UrlContext } from "../../contexte/useUrl";
import { ProjectContext } from "../../contexte/useProject";

import {
  faChevronLeft,
  faChevronRight,
  faSort,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
} from "date-fns";
import fr from "date-fns/locale/fr";
import { TaskContext } from "../../contexte/useTask";
import axios from "axios";

export default function Hebdomadaire() {
  const [view, setView] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dateCompteRendu, setDateCompteRendu] = useState("");
  const [respID, setRespID] = useState("");
  const [valeur, setValeur] = useState("");
  const [modalInfo, setModalInfo] = useState(null);
  const [isPUT, setIsPUT] = useState(false);
  const [idUsers, setidUsers] = useState("");
  const [IdFeuilleTemps, setIdFeuilleTemps] = useState("");

  const { setShowSpinner } = useContext(ShowContext);
  const { url } = useContext(UrlContext);
  const { gettaskById, ListTaskById, InfosProj, gettaskByIdUser } =
    useContext(TaskContext);
  const { ListChefs } = useContext(ProjectContext);

  const userString = localStorage.getItem("user");
  let user = JSON.parse(userString);

  const transformData = (tasks) => {
    const taskMap = {};

    tasks.forEach((task) => {
      if (!taskMap[task.task]) {
        taskMap[task.task] = {
          gest_proj_reponsable_tache_id: task.gest_proj_reponsable_tache_id,
          id: task.id,
          valider: task.valider,
          name: task.task,
          hoursByDate: {},
          total: 0,
        };
      }
      taskMap[task.task].hoursByDate[task.date] = {
        hours: task.hours,
        valider: task.valider,
        id: task.idFeuilleTemps,
      };
      taskMap[task.task].total += task.hours;
    });
    return Object.values(taskMap);
  };

  const transformedData = transformData(ListTaskById);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    let user = JSON.parse(userString);
    setidUsers(user.id);
    gettaskById();
  }, []);

  const getDatesForWeek = (startDate) => {
    const start = startOfWeek(new Date(startDate), { weekStartsOn: 1 });
    return Array.from({ length: 5 }, (_, i) => ({
      date: format(addDays(start, i), "dd/MM/yyyy"),
      day: format(addDays(start, i), "EEE", { locale: fr }),
    }));
  };

  function postOrPutComteTendu() {
    const userString = localStorage.getItem("user");
    let user = JSON.parse(userString);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    if (!isPUT) {
      setShowSpinner(true);
      let formData = {
        gest_proj_reponsable_tache_id: respID,
        valeur: valeur || "0.125",
        date: dateCompteRendu.split("-").reverse().join("/"),
      };

      axios
        .post(`${url}/api/projets/feuille-temps`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          closeModal();
          if (idUsers !== user.id) {
            gettaskByIdUser(idUsers);
          } else {
            gettaskById();
          }
        })
        .catch((err) => {
          console.error(err);
          setShowSpinner(false);
        });
    }
    if (isPUT) {
      let formData = {
        gest_proj_reponsable_tache_id: respID,
        valeur: valeur.toString(),
        date: dateCompteRendu,
      };

      axios
        .put(`${url}/api/projets/feuille-temps/${IdFeuilleTemps}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          closeModal();
          if (idUsers !== user.id) {
            gettaskByIdUser(idUsers);
          } else {
            gettaskById();
          }
        })
        .catch((err) => {
          console.error(err);
          setShowSpinner(false);
        });
    }
  }

  const getDatesForMonth = (startDate) => {
    const start = startOfMonth(new Date(startDate));
    const end = endOfMonth(new Date(startDate));
    return eachDayOfInterval({ start, end }).map((date) => ({
      date: format(date, "dd/MM/yyyy"),
      day: format(date, "EEE", { locale: fr }),
    }));
  };

  const dates =
    view === "week"
      ? getDatesForWeek(currentDate)
      : getDatesForMonth(currentDate);

  const handlePrev = () => {
    setCurrentDate((prev) => addDays(prev, view === "week" ? -7 : -30));
  };

  const handleNext = () => {
    setCurrentDate((prev) => addDays(prev, view === "week" ? 7 : 30));
  };

  const getTotalForTask = (taskName) => {
    return ListTaskById.filter(
      (task) =>
        task.task === taskName && dates.some((d) => d.date === task.date)
    ).reduce((sum, task) => sum + task.hours, 0);
  };

  const getGlobalTotal = () => {
    const uniqueTasks = [...new Set(ListTaskById.map((task) => task.task))];
    return uniqueTasks.reduce(
      (sum, taskName) => sum + getTotalForTask(taskName),
      0
    );
  };

  function validerFeuilleDeTemps() {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    const elementsVisibles = getElementsVisiblesDansTableau();
    setShowSpinner(true);
    elementsVisibles.forEach((list) => {
      let formData = {
        gest_proj_reponsable_tache_id: list.gest_proj_reponsable_tache_id,
        valeur: list.hours.toString(),
        date: list.date,
        valider: true,
      };
      axios
        .put(
          `${url}/api/projets/feuille-temps/${list.idFeuilleTemps}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (idUsers !== user.id) {
            gettaskByIdUser(idUsers);
          } else {
            gettaskById();
          }
        })
        .catch((err) => {
          console.error(err);
          setShowSpinner(false);
        });
    });
  }

  const getVisibleTotalForTask = (task) => {
    return dates.reduce((sum, dateObj) => {
      const hours = task.hoursByDate[dateObj.date]?.hours || 0;
      return sum + hours;
    }, 0);
  };

  const handleCellClick = (
    taskName,
    date,
    id,
    hours,
    gest_proj_reponsable_tache_id,
    idFeuilleTemps
  ) => {
    setDateCompteRendu(date);
    setRespID(gest_proj_reponsable_tache_id);
    if (hours) {
      setIdFeuilleTemps(idFeuilleTemps);
      setValeur(hours);
      setIsPUT(true);
    }
    if (!hours) {
      setIsPUT(false);
    }
    const taskData = ListTaskById.find(
      (item) => item.task === taskName && item.date === date
    );

    setModalInfo({
      date,
      task: taskData ? taskData.task : taskName,
      hours: taskData ? taskData.hours : "0",
    });
  };

  const closeModal = () => {
    setValeur("");
    setModalInfo(null);
  };

  function getElementsVisiblesDansTableau() {
    const nomsTachesVisibles = transformedData.map((task) => task.name);
    const datesVisibles = dates.map((dateObj) => dateObj.date);
    return ListTaskById.filter(
      (task) =>
        nomsTachesVisibles.includes(task.task) &&
        datesVisibles.includes(task.date)
    );
  }

  const toutesCellulesSontVides = () => {
    return transformedData.every((task) =>
      dates.every(
        (dateObj) => task.hoursByDate[dateObj.date]?.hours === undefined
      )
    );
  };

  return (
    <>
      <div className="head flex flex-wrap text-auto justify-between">
        <div className={styles.head}>
          <div className="mb-4 flex items-center text-xs w-48">
            <FontAwesomeIcon icon={faSort} className="w-5 h-4 text-gray-500" />
            <select
              id="task"
              value={idUsers}
              onChange={(e) => {
                setidUsers(e.target.value);

                if (e.target.value === "Ma feuille de temps") {
                  setidUsers(user.id);
                  gettaskById();
                } else {
                  gettaskByIdUser(e.target.value);
                }
              }}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none"
            >
              <option value="Ma feuille de temps" className="text-xs">
                Ma feuille de temps
              </option>
              {ListChefs.map((list) => (
                <option
                  key={list.id}
                  value={list.utilisateur.id}
                  className="mr-1"
                >
                  {list.utilisateur.nom}{" "}
                  <b className="font-bold text-xs">({list.role})</b>
                </option>
              ))}
            </select>
          </div>
          <h1 className="flex flex-wrap text-yellow-600">
            - Feuille de temps -
          </h1>
          {/* <h1 className="text-xs mt-2">
            <b>Nom de la ressource :</b> Jao RAKOTO
          </h1> */}
          <h1 className="text-xs mt-1">
            <b>Nom du projet :</b> {InfosProj.nom}
          </h1>
          {InfosProj.date_debut && InfosProj.date_limite && (
            <h1 className="text-xs mt-1">
              <b>Période :</b> {InfosProj.date_debut} à {InfosProj.date_limite}
            </h1>
          )}
          {InfosProj.ligne_budgetaire && (
            <h1 className="text-xs mt-1">
              <b>Ligne budgétaire :</b> {InfosProj.ligne_budgetaire}
            </h1>
          )}

          <h1 className="text-xs mt-1">
            <b>Période actuelle :</b> {format(currentDate, "dd/MM/yyyy")}
          </h1>
          <h1 className="text-xs mt-1 flex">
            <b>Chefs de projet :</b>
            <div className="flex">
              {ListChefs.map((list) => (
                <div key={list.id} className="mr-1">
                  {list.role === "chef" && <p>{list.utilisateur.nom}, </p>}
                </div>
              ))}
            </div>
          </h1>
        </div>
      </div>
      {ListTaskById.length !== 0 && (
        <>
          <div className="flex justify-between items-center mt-4 mb-4 text-xs">
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="text-gray-500 cursor-pointer text-xl mr-4"
              onClick={handlePrev}
            />
            <div className="flex">
              <button
                onClick={() => setView("week")}
                className={`px-4 py-2 mr-2 ${
                  view === "week" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Vue Hebdomadaire
              </button>
              <button
                onClick={() => setView("month")}
                className={`px-4 py-2 ${
                  view === "month" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                Vue Mensuelle
              </button>
            </div>
            <FontAwesomeIcon
              icon={faChevronRight}
              className="text-gray-500 cursor-pointer text-xl"
              onClick={handleNext}
            />
          </div>
          <div className="min-w-max">
            <div className="bg-blue-300 flex items-center px-3 mt-5 tableau border text-sm py-2">
              <div className="w-[450px] border-gray-600 border-r">Tâches</div>
              {dates.map((dateObj, index) => (
                <div
                  key={index}
                  className="w-[100px] border-gray-600 text-center border-r"
                >
                  <div className="font-bold">{dateObj.day}</div>
                  <div>{dateObj.date}</div>
                </div>
              ))}
              <div className="w-[200px] border-gray-600 text-center">
                Total/Tâche
              </div>
            </div>

            {transformedData.map((task, index) => (
              <div key={index} className="flex px-3 tableau border text-sm">
                <div className="w-[450px] border-r text-left pr-2 py-1 overflow-auto break-words">
                  {task.name}
                </div>
                {dates.map((dateObj, idx) => {
                  const isDisabled =
                    dateObj.day === "sam." ||
                    dateObj.day === "dim." ||
                    task.hoursByDate[dateObj.date]?.valider === 1;

                  return (
                    <div
                      key={idx}
                      className={`w-[100px] text-center border-r py-1 ${
                        isDisabled ? "bg-gray-300" : "cursor-pointer"
                      }`}
                      onClick={
                        !isDisabled
                          ? () =>
                              handleCellClick(
                                task.name,
                                dateObj.date,
                                task.id,
                                task.hoursByDate[dateObj.date]?.hours,
                                task.gest_proj_reponsable_tache_id,
                                task.hoursByDate[dateObj.date]?.id
                              )
                          : null
                      }
                    >
                      {task.hoursByDate[dateObj.date]?.hours || "-"}
                    </div>
                  );
                })}

                <div className="w-[200px] text-center py-1">
                  {getVisibleTotalForTask(task)}
                </div>
              </div>
            ))}

            <div className="flex tableau border text-sm font-bold px-3 ">
              <div className="w-[450px]  text-left pr-2 py-1">
                Total général :
              </div>
              {dates.map((_, idx) => (
                <div key={idx} className="w-[100px] text-center py-1"></div>
              ))}
              <div className="w-[200px] text-center py-1">
                {getGlobalTotal()}
              </div>
            </div>
          </div>
        </>
      )}
      {ListTaskById.length === 0 && (
        <div className=" h-[40vh] flex flex-col items-center justify-center">
          <div
            style={{
              backgroundImage: `url('/pngtree-folder-archive-computer-document-empty-file-storage-blue-i-png-image_1620254-removebg-preview.png')`,
            }}
            className="bg-cover bg-center h-[200px] w-[250px]"
          ></div>
          <p className="text-sm">Feuille de temps introuvable 📁🚫</p>
        </div>
      )}

      {!toutesCellulesSontVides() && (
        <button
          onClick={validerFeuilleDeTemps}
          className="px-5 text-xs bg-blue-500 text-white py-2 cursor-pointer"
        >
          Valider la feuille de temps
        </button>
      )}

      {modalInfo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="bg-white w-[400px] p-4 rounded shadow relative"
            onClick={(e) => e.stopPropagation()}
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="absolute top-2 right-2 text-gray-500 cursor-pointer text-lg"
              onClick={closeModal}
            />
            <h2 className="text-sm font-bold mb-4 ">
              Ajouter/Modifier un compte rendu :
            </h2>
            <div className="flex text-xs">
              <p className="mr-4">
                <b>Date :</b> {modalInfo.date}
              </p>
              <p>
                <b>Tâche :</b> {modalInfo.task}
              </p>
            </div>
            <div className="text-xs mt-2 flex items-end">
              <label>Temps de travail :</label>
              <select
                value={valeur}
                onChange={(e) => {
                  setValeur(e.target.value);
                }}
                className="mt-2 py-1 ml-2 w-40 border border-gray-300 rounded-md focus:outline-none"
              >
                <option value="0.125">0.125</option>
                <option value="0.25">0.25</option>
                <option value="0.3">0.3</option>
                <option value="0.5">0.5</option>
                <option value="0.6">0.6</option>
                <option value="0.75">0.75</option>
                <option value="0.85">0.85</option>
                <option value="1">1</option>
              </select>
            </div>
            <button
              onClick={() => postOrPutComteTendu()}
              className="text-sm w-full bg-blue-500 mt-4 rounded px-5 py-1 text-white"
            >
              Valider
            </button>
          </div>
        </div>
      )}
    </>
  );
}
