import "../styles/Modal.css";
import { ShowContext } from "../contexte/useShow";
import { useContext, useState } from "react";
import { UrlContext } from "../contexte/useUrl";
import { TaskContext } from "../contexte/useTask";
import { MessageContext } from "../contexte/useMessage";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function DeleteStatusWithTask() {
  const { setShowDeleteStatusTask, setShowSpinner } = useContext(ShowContext);
  const { url } = useContext(UrlContext);
  const {
    idStatus,
    ListStatusTask,
    ListTaskToMove,
    getAllStatusTaskKanban,
    getAllTask,
  } = useContext(TaskContext);
  const { setMessageSucces, setMessageError } = useContext(MessageContext);
  const [statusTaskId, setStatusTaskId] = useState("");

  function closeDelstatus() {
    setShowDeleteStatusTask(false);
  }

  function delstatus() {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .delete(`${url}/api/projets/statuts-taches/${idStatus}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getAllStatusTaskKanban();
        getAllTask();
        setMessageSucces(response.data.message);
        setShowDeleteStatusTask(false);
        setTimeout(() => {
          setMessageSucces("");
        }, 5000);
      })
      .catch((err) => {
        console.error(err);
        setMessageError(err.response.data.error);
        getAllTask();
        setShowDeleteStatusTask(false);
        setTimeout(() => {
          setMessageError("");
        }, 5000);
        setShowSpinner(false);
      });
  }

  function delstatusBefore() {
    setShowSpinner(true);
    let formData;
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    let isStatusIfNotSelect = ListStatusTask[0].id;
    if (!statusTaskId) {
      formData = {
        gest_proj_statuts_tache_id: isStatusIfNotSelect,
      };
    }
    if (statusTaskId) {
      formData = {
        gest_proj_statuts_tache_id: statusTaskId,
      };
    }
    const promises = ListTaskToMove.map((list) => {
      return axios.put(`${url}/api/projets/taches/${list.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    });
    Promise.all(promises)
      .then((responses) => {
        delstatus();
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  return (
    <>
      <div
        className="showModal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        onClick={closeDelstatus}
      >
        <div
          className="bg-white p-5 rounded-sm relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-1 right-2 text-gray-600 hover:text-black"
            onClick={closeDelstatus}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>

          <h6 className="modal text-sm mt-2">
            Ce statut est associé à <b>plusieurs tâches</b>. Veuillez
            sélectionner le nouveau statut vers lequel déplacer ces tâches.
          </h6>
          <div className="flex justify-center ">
            <select
              value={statusTaskId}
              onChange={(e) => setStatusTaskId(e.target.value)}
              className="input w-60 mr-5 text-xs pl-3 pr-3 block tailleInputcreateTask  mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
            >
              {ListStatusTask.filter((list) => list.id !== idStatus).map(
                (list) => (
                  <option key={list.id} value={list.id}>
                    {list.valeur}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="flex justify-center mt-2">
            <button
              onClick={delstatusBefore}
              className="text-xs font-bold bg-blue-500 rounded py-2 px-5"
            >
              Valider
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
