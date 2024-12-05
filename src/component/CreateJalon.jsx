import { ShowContext } from "../contexte/useShow";
import { useContext, useState, useEffect } from "react";
import { MessageContext } from "../contexte/useMessage";
import { UrlContext } from "../contexte/useUrl";
import { ProjectContext } from "../contexte/useProject";
import { EtapeContext } from "../contexte/useEtape";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faTrash,
  faThumbtack,
} from "@fortawesome/free-solid-svg-icons";

export default function CreateJalon() {
  const { url } = useContext(UrlContext);
  const { getAlletapeByProjets, listEtape } = useContext(EtapeContext);
  const { idProjet, ListJalon, getAllJalon, idProject } =
    useContext(ProjectContext);
  const { setMessageSucces, setMessageError } = useContext(MessageContext);
  const { setShowcreateJalon, setShowSpinner } = useContext(ShowContext);

  const [nomjalon, setNomJalon] = useState("");
  const [datejalon, setDatejalon] = useState("");
  const [descriptionjalon, setDescriptionjalon] = useState("");
  const [etapeId, setEtapeId] = useState("");

  function closeCreateJalon() {
    setShowcreateJalon(false);
  }

  useEffect(() => {
    getAlletapeByProjets();
  }, []);

  function postJalon() {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    let idEtape = listEtape[0].id;
    setShowSpinner(true);
    let formData = {
      nom: nomjalon,
      description: descriptionjalon,
      date: datejalon,
      gest_proj_etape_id: etapeId || idEtape,
    };

    axios
      .post(`${url}/api/projets/jalons`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getAllJalon(idProject);
        setMessageSucces(response.data.message);
        setNomJalon("");
        setDescriptionjalon("");
        setDatejalon("");
        setTimeout(() => {
          setMessageSucces("");
        }, 5000);
        setShowSpinner(false);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  function deleteJalon(id) {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    setShowSpinner(true);

    axios
      .delete(`${url}/api/projets/jalons/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getAllJalon(idProject);
        setMessageSucces(response.data.message);
        setTimeout(() => {
          setMessageSucces("");
        }, 5000);
        setShowSpinner(false);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={closeCreateJalon}
    >
      <div
        className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-md font-bold text-gray-800">Créer des jalons</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={closeCreateJalon}
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom *
            </label>
            <input
              type="text"
              placeholder="Nom du jalon"
              value={nomjalon}
              onChange={(e) => setNomJalon(e.target.value)}
              required
              className="w-full mt-1 p-2 focus:outline-none border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              placeholder="Ajouter une description"
              value={descriptionjalon}
              onChange={(e) => setDescriptionjalon(e.target.value)}
              className="w-full mt-1 p-2 focus:outline-none min-h-[50px] border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={datejalon}
              onChange={(e) => setDatejalon(e.target.value)}
              className="w-full mt-1 focus:outline-none p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">
              <FontAwesomeIcon icon={faThumbtack} className=" mr-2" />
              Choisissez une étape :
            </label>
            <select
              value={etapeId}
              onChange={(e) => setEtapeId(e.target.value)}
              className="input w-full mr-5 text-xs pl-3 pr-3 block tailleInputcreateTask  mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
            >
              {listEtape.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.nom}
                </option>
              ))}
              {listEtape.length === 0 && (
                <option disabled>Aucune étape trouvée...</option>
              )}
            </select>
          </div>
          <button
            onClick={postJalon}
            disabled={!nomjalon && !datejalon && !(listEtape.length !== 0)}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Ajouter
          </button>
        </div>

        {ListJalon.length !== 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-semibold text-gray-800 mb-2">
              Liste des jalons :
            </h3>
            <ul className="space-y-3 max-h-[200px] overflow-y-auto">
              {ListJalon.map((jalon) => (
                <li
                  key={jalon.id}
                  className="flex text-xs justify-between items-center px-3 py-1 border rounded-md bg-gray-50 shadow-sm"
                >
                  <div className="flex items-center w-full">
                    <strong className="block text-gray-900 w-[75%]">
                      {jalon.nom}
                    </strong>
                    <p className=" text-gray-600">{jalon.date}</p>
                  </div>
                  <button className="text-red-500 text-xs">
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => deleteJalon(jalon.id)}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
