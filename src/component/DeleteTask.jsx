import "../styles/Modal.css";
import { ShowContext } from "../contexte/useShow";
import { useContext } from "react";
import { ProjectContext } from "../contexte/useProject";
import { MessageContext } from "../contexte/useMessage";
import { UrlContext } from "../contexte/useUrl";
import { TaskContext } from "../contexte/useTask";

import axios from "axios";

export default function DeleteTask() {
  const {
    idProject,
    getProjectWhenChef,
    getAllproject,
    getProjectWhenMembres,
  } = useContext(ProjectContext);
  const { url } = useContext(UrlContext);
  const { setMessageSucces, setMessageError } = useContext(MessageContext);
  const { setShowDeletetask, setShowSpinner } = useContext(ShowContext);
  const { idTask, getAllTask } = useContext(TaskContext);

  function closeDelTask() {
    setShowDeletetask(false);
  }

  function deleteTask() {
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .delete(`${url}/api/projets/${idProject}/taches/${idTask}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getAllTask(idProject);
        getProjectWhenChef();
        getAllproject();
        getProjectWhenMembres();
        setMessageSucces(response.data.message);
        setShowSpinner(false);
        setShowDeletetask(false);
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
      <div className="showModal">
        <div className="formModal">
          <h6 className="modal">
            Voulez-vous vraiment supprimer cette tâche ?
          </h6>
          <div className="valider">
            <button onClick={deleteTask} type="button" className="SUPPR mt-5">
              OUI
            </button>
            <button type="button" onClick={closeDelTask} className="NON mt-5">
              NON
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
