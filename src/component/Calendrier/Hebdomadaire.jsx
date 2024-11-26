import { useState } from "react";
import styles from "../../styles/Calendrier.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faSort,
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

export default function Hebdomadaire() {
  const [view, setView] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  const [data, setData] = useState([
    { date: "22/09/2024", task: "Tâche 1 : Analyse", hours: 2 },
    { date: "22/09/2024", task: "Tâche 2 : Réunion", hours: 1 },
    { date: "23/12/2024", task: "Tâche 3 : Développement", hours: 4 },
    { date: "25/12/2024", task: "Tâche 4 : Tests", hours: 3 },
  ]);

  const getDatesForWeek = (startDate) => {
    const start = startOfWeek(new Date(startDate), { weekStartsOn: 1 });
    return Array.from({ length: 5 }, (_, i) => ({
      date: format(addDays(start, i), "dd/MM/yyyy"),
      day: format(addDays(start, i), "EEE", { locale: fr }),
    }));
  };

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
    return data
      .filter(
        (task) =>
          task.task === taskName && dates.some((d) => d.date === task.date)
      )
      .reduce((sum, task) => sum + task.hours, 0);
  };

  const getGlobalTotal = () => {
    const uniqueTasks = [...new Set(data.map((task) => task.task))];
    return uniqueTasks.reduce(
      (sum, taskName) => sum + getTotalForTask(taskName),
      0
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
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none"
            >
              <option className="text-xs">Ma feuille de temps</option>
              <option value="task1">User 1</option>
              <option value="task2">User 2</option>
              <option value="task3">User 3</option>
            </select>
          </div>
          <h1 className="flex flex-wrap text-yellow-600">
            - Ma Feuille de temps -
          </h1>
          <h1 className="text-xs mt-2">
            <b>Nom de la ressource :</b> Jao RAKOTO
          </h1>
          <h1 className="text-xs mt-1">
            <b>Nom du projet :</b> Module de gestion de projet
          </h1>
          <h1 className="text-xs mt-1">
            <b>Période :</b> 10-11-2021 à 12-11-2020
          </h1>
          <h1 className="text-xs mt-1">
            <b>Ligne budgétaire :</b> budget-Mod-gestProjet-sbz-softiceo-2024
          </h1>
          <h1 className="text-xs mt-1">
            <b>Période actuelle :</b> {format(currentDate, "dd/MM/yyyy")}
          </h1>
          <h1 className="text-xs mt-1">
            <b>Chefs de projet :</b> Jao RAKOTO
          </h1>
        </div>
      </div>

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

        {data.map((task, index) => (
          <div key={index} className="flex px-3 tableau border text-sm">
            <div className="w-[450px] border-r text-left pr-2 py-1 overflow-auto break-words">
              {task.task}
            </div>
            {dates.map((dateObj, idx) => (
              <div key={idx} className="w-[100px] text-center border-r py-1">
                {task.date === dateObj.date ? task.hours : "-"}
              </div>
            ))}
            <div className="w-[200px] text-center py-1">
              {getTotalForTask(task.task)}
            </div>
          </div>
        ))}
        <div className="flex tableau border text-sm font-bold px-3 ">
          <div className="w-[450px]  text-left pr-2 py-1">Total général :</div>
          {dates.map((_, idx) => (
            <div key={idx} className="w-[100px] text-center py-1"></div>
          ))}
          <div className="w-[200px] text-center py-1">{getGlobalTotal()}</div>
        </div>
      </div>
    </>
  );
}
