import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faFolderPlus,
  faFilter,
  faXmark,
  faTrash,
  faMarker,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import Hebdomadaire from "./Calendrier/Hebdomadaire";
import Mensuel from "./Calendrier/Mensuel";
import Tippy from "@tippyjs/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TaskContext } from "../contexte/useTask";
import axios from "axios";
import { UrlContext } from "../contexte/useUrl";

export default function Calendrier() {
  const [isMensuel, setIsmentuel] = useState(false);
  const [date, setDate] = useState("");
  const [isHebd, setIshebd] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [task, setTask] = useState("");
  const [workHours, setWorkHours] = useState("");

  
  const { gettaskById, ListTaskById } = useContext(TaskContext);
  const { url } = useContext(UrlContext);

  function handleOutsideClick(e) {
    if (e.target.classList.contains("modal-overlay")) {
      closeModal();
    }
  }
  function openModal() {
    gettaskById();
    setIsModalOpen(true);
  }
  function closeModal() {
    setIsModalOpen(false);
  }

  function postcompteRendu() {
    const VAR_HEURE_DE_TRAVAIL = 8;
    let formdata;
    if (!task) {
      let idTask = ListTaskById[0].gest_proj_reponsable_tache_id;
      formdata = {
        gest_proj_reponsable_tache_id: idTask,
        valeur: (workHours / VAR_HEURE_DE_TRAVAIL).toString(),
        date: date,
      };

      fetchPOSTCompteRendu(formdata);
    } else {
      formdata = {
        gest_proj_reponsable_tache_id: task,
        valeur: (workHours / VAR_HEURE_DE_TRAVAIL).toString(),
        date: date,
      };
      fetchPOSTCompteRendu(formdata);
    }
  }

  function fetchPOSTCompteRendu(formdata) {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);

    axios
      .post(`${url}/api/projets/feuille-temps`, formdata, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        gettaskById();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function limitInputToLength(event) {
    const value = event.target.value;
    if (value.length > 2) {
      event.target.value = value.slice(0, 2);
    }
    setWorkHours(event.target.value);
  }

  return (
    <>
      <div className="flex items-center">
        <div
          onClick={() => {
            setIsmentuel(false);
            setIshebd(true);
          }}
          className={
            isHebd
              ? "px-3 py-1 bg-yellow-500 cursor"
              : "px-3 py-1 cursor-pointer"
          }
        >
          <FontAwesomeIcon icon={faCalendarDay} /> Vue d'ensemble
        </div>
        <div
          onClick={() => {
            setIshebd(false);
            setIsmentuel(true);
          }}
          className={
            isMensuel
              ? "px-3 py-1 bg-yellow-500 cursor hidden"
              : "px-3 py-1 cursor-pointer hidden"
          }
        >
          <FontAwesomeIcon icon={faFilter} /> Validation
        </div>
        <Tippy content="Faire un compte rendus">
          <FontAwesomeIcon
            icon={faFolderPlus}
            className="hidden ml-5 bg-white px-1 text-gray-500 py-1 rounded-3xl cursor-pointer focus:outline-none"
            onClick={openModal}
          />
        </Tippy>
      </div>

      {isHebd && (
        <div className="mt-2 overflow-x-auto min-h-[65vh] p-3">
          <Hebdomadaire />
        </div>
      )}
      {isMensuel && (
        <div className="mt-2 overflow-x-auto min-h-[65vh] p-3">
          <Mensuel />
        </div>
      )}

      {isModalOpen && (
        <div
          className="z-10   modal-overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
          onClick={handleOutsideClick}
        >
          <div className="w-[500px] modal-container bg-white p-5 rounded-lg relative">
            <FontAwesomeIcon
              icon={faXmark}
              className="absolute top-2 right-2 text-gray-500 cursor-pointer"
              onClick={closeModal}
            />
            <h2 className="text-sm font-bold mb-4 ">Créer un compte rendu</h2>
            <div className="flex justify-between">
              <div className="mb-4 text-xs mr-2 w-[45%]">
                <label
                  htmlFor="task"
                  className="block text-xs font-medium text-gray-700"
                >
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 block w-full p-2 border text-xs border-gray-300 rounded-md focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="mb-4 text-xs mr-2 w-[45%]">
                <label
                  htmlFor="task"
                  className="block text-xs font-medium text-gray-700"
                >
                  Choisir une tâche
                </label>
                <select
                  id="task"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                >
                  <option disabled className="text-xs">
                    Sélectionner une tâche
                  </option>
                  {ListTaskById.map((list) => (
                    <option
                      key={list.id}
                      value={list.gest_proj_reponsable_tache_id}
                    >
                      {list.tache.titre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4  w-[45%]">
                <label
                  htmlFor="workHours"
                  className="block text-xs font-medium text-gray-700"
                >
                  Heure de travail
                </label>
                <input
                  type="number"
                  id="workHours"
                  value={workHours}
                  onChange={limitInputToLength}
                  className="mt-1 block w-full p-2 border text-xs border-gray-300 rounded-md focus:outline-none"
                  placeholder="Entrez les heures"
                />
              </div>
            </div>
            <button
              onClick={postcompteRendu}
              className="w-full bg-blue-500 text-xs text-white p-2 rounded-md"
              disabled={!date || !workHours}
            >
              Valider
            </button>
            <Accordion
              className="bg-yellow-100 rounded-lg mt-2  "
              type="single"
              collapsible
            >
              <AccordionItem value="item-1" className="border-none ">
                <AccordionTrigger className="text-xs font-bold px-3 h-[30px] ">
                  Liste de mes compte rendus
                </AccordionTrigger>
                <AccordionContent className="bg-white max-h-[100px] overflow-y-auto">
                  <div className="border flex items-center px-2 py-1 text-xs ">
                    <div className="mr-2">
                      <div className="justify-between flex">
                        <li className="font-bold">20-10-2024</li>
                        <li>8h </li>
                      </div>
                      <p className="mt-2">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Delectus mollitia commodi similique reprehenderit
                        blanditiis quae vitae molestiae voluptatem? Consectetur
                        eligendi neque dolor eos quae ullam, iste magnam
                        aspernatur? Veritatis, tenetur!
                      </p>
                    </div>
                    <FontAwesomeIcon
                      icon={faMarker}
                      className="text-yellow-500 cursor-pointer mr-1"
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="text-red-500 cursor-pointer mr-1"
                    />
                  </div>
                  <div className="border flex items-center px-2 py-1 text-xs ">
                    <div className="mr-2 w-[95%]">
                      <div className="justify-between flex">
                        <li className="font-bold">20-10-2024</li>
                        <li>8h </li>
                      </div>
                      <p className="mt-2">Tâche 1</p>
                    </div>
                    <FontAwesomeIcon
                      icon={faMarker}
                      className="text-yellow-500 cursor-pointer mr-1"
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="text-red-500 cursor-pointer mr-1"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      )}
    </>
  );
}
