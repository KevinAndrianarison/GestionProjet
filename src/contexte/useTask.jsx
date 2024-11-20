import { createContext, useContext, useState } from "react";
import axios from "axios";
import { UrlContext } from "../contexte/useUrl";
import { ProjectContext } from "../contexte/useProject";
import { ShowContext } from "../contexte/useShow";

export const TaskContext = createContext({
  ListTask: [],
  ListChamps: [],
  ListChampsWithoutValue: [],
  ListResp: [],
  ListStatusTask: [],
  ListTaskToMove: [],
  idTask: "",
  idInput: "",
  titreTask: "",
  dateDebut: "",
  dateFin: "",
  idStatus: "",
  description: "",
});
export function TaskContextProvider({ children }) {
  const [ListTask, setListTask] = useState([]);
  const [ListChamps, setListChamps] = useState([]);
  const [ListChampsWithoutValue, setListChampsWithoutValue] = useState([]);
  const [ListTaskToMove, setListTaskToMove] = useState([]);
  const [ListResp, setListResp] = useState([]);
  const [ListStatusTask, setListStatusTask] = useState([]);
  const [idTask, setIdTask] = useState("");
  const [idStatus, setIdStatus] = useState("");
  const [titreTask, setTitreTask] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [idInput, setidInput] = useState("");
  const [description, setDescription] = useState("");

  const { idProject, setIdProject } = useContext(ProjectContext);
  const { url } = useContext(UrlContext);
  const { setShowSetTask, setShowTask, setShowSpinner } =
    useContext(ShowContext);

  function getAllTask() {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .get(`${url}/api/projets/taches/${idProject}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setListTask(response.data.reverse());
        setShowSpinner(false);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  function getAllTaskFirst(id) {
    setListTask([]);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .get(`${url}/api/projets/taches/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setListTask(response.data.reverse());
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function getAllStatusTask() {
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .get(`${url}/api/projets/statuts-taches/${idProject}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setListStatusTask(response.data);
        setShowTask(true);
        setShowSpinner(false);
      })
      .catch((err) => {
        console.error(err);
        setShowTask(false);
      });
  }
  function getAllStatusTaskKanban() {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .get(`${url}/api/projets/statuts-taches/${idProject}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setListStatusTask(response.data);
        setShowSpinner(false);
      })
      .catch((err) => {
        console.error(err);
        setShowTask(false);
      });
  }

  function getAllChamps() {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .get(`${url}/api/projets/champs/tache/${idTask}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setListChamps(response.data.linkedChamps);
        setListChampsWithoutValue(response.data.nonLinkedChamps);
        setShowSpinner(false);
      })
      .catch((err) => {
        console.error(err);
        setShowTask(false);
      });
  }

  function getAllChampsByProject() {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .get(`${url}/api/projets/champs/${idProject}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setListChamps(response.data);
        setShowSpinner(false);
      })
      .catch((err) => {
        console.error(err);
        setShowTask(false);
      });
  }

  function getOneTask(id) {
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);

    axios
      .get(`${url}/api/projets/taches/tache/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTitreTask(response.data.titre);
        setDateDebut(response.data.date_debut);
        setDateFin(response.data.date_fin);
        setDescription(response.data.description);
        setListResp(response.data.responsables);
        setIdTask(response.data.id);
        setShowSetTask(true);
        setShowSpinner(false);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  return (
    <TaskContext.Provider
      value={{
        ListTask,
        idTask,
        titreTask,
        dateDebut,
        dateFin,
        description,
        ListStatusTask,
        ListResp,
        idStatus,
        ListTaskToMove,
        ListChamps,
        ListChampsWithoutValue,
        idInput,
        setListChampsWithoutValue,
        setidInput,
        getAllChampsByProject,
        getAllChamps,
        setListTask,
        setListChamps,
        setListTaskToMove,
        setIdStatus,
        setListResp,
        getAllTask,
        setIdTask,
        getOneTask,
        setTitreTask,
        setDateDebut,
        setDateFin,
        setDescription,
        getAllTaskFirst,
        setListStatusTask,
        getAllStatusTask,
        getAllStatusTaskKanban,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
