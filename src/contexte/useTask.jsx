import { createContext, useContext, useState } from "react";
import axios from "axios";
import { UrlContext } from "../contexte/useUrl";
import { ProjectContext } from "../contexte/useProject";
import { ShowContext } from "../contexte/useShow";

export const TaskContext = createContext({
  ListTask: [],
  ListTaskById: [],
  ListChamps: [],
  ListTaskComs: [],
  ListChampsWithoutValue: [],
  ListControleModale: [],
  ListResp: [],
  ListRespModale: [],
  ListStatusTask: [],
  ListTaskToMove: [],
  idTask: "",
  idInput: "",
  titreTask: "",
  dateDebut: "",
  dateFin: "",
  idStatus: "",
  description: "",
  titreTaskModale: "",
  dateDebutModale: "",
  dateFinModale: "",
  descriptionModale: "",
  InfosProj: {},
});
export function TaskContextProvider({ children }) {
  const [ListTask, setListTask] = useState([]);
  const [ListTaskComs, setListTaskComs] = useState([]);
  const [ListTaskById, setListTaskById] = useState([]);
  const [ListChamps, setListChamps] = useState([]);
  const [ListChampsWithoutValue, setListChampsWithoutValue] = useState([]);
  const [ListTaskToMove, setListTaskToMove] = useState([]);
  const [ListResp, setListResp] = useState([]);
  const [ListRespModale, setListRespModale] = useState([]);
  const [ListControleModale, setListControleModale] = useState([]);
  const [ListStatusTask, setListStatusTask] = useState([]);
  const [idTask, setIdTask] = useState("");
  const [InfosProj, setInfosProj] = useState({});
  const [idStatus, setIdStatus] = useState("");
  const [titreTask, setTitreTask] = useState("");
  const [titreTaskModale, setTitreTaskModale] = useState("");
  const [dateDebutModale, setDateDebutModale] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [dateFinModale, setDateFinModale] = useState("");
  const [idInput, setidInput] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionModale, setDescriptionModale] = useState("");

  const { idProject, setIdProject } = useContext(ProjectContext);
  const { url } = useContext(UrlContext);
  const { setShowSetTask, setShowTask, setShowSpinner, setShowModaleTask } =
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

  function gettaskById() {
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);

    axios
      .get(`${url}/api/projets/taches/responsable-tache/${idProject}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setInfosProj(response.data.projet);
        setListTaskById(transformData(response.data.tacheRespossableByProjet));
        setShowSpinner(false);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  function gettaskByIdUser(id) {
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);

    axios
      .get(`${url}/api/projets/taches/responsable-tache/${idProject}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setInfosProj(response.data.projet);
        setListTaskById(transformData(response.data.tacheRespossableByProjet));
        setShowSpinner(false);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  function transformData(rawData) {
    const result = [];

    rawData.forEach((item) => {
      const { feuillesTemps, tache } = item;
      if (feuillesTemps.length === 0) {
        result.push({
          date: null,
          idFeuilleTemps: null,
          valider: null,
          gest_proj_reponsable_tache_id: item.gest_proj_reponsable_tache_id,
          task: tache.titre,
          hours: null,
          id: tache.id,
        });
      } else {
        feuillesTemps.forEach((feuille) => {
          result.push({
            date: feuille.date,
            idFeuilleTemps: feuille.id,
            valider: feuille.valider,
            gest_proj_reponsable_tache_id: item.gest_proj_reponsable_tache_id,
            task: tache.titre,
            hours: parseFloat(feuille.valeur),
            id: tache.id,
          });
        });
      }
    });

    return result;
  }

  function getComsTask() {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);

    axios
      .get(`${url}/api/projets/taches/commentaires/${idTask}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setListTaskComs(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function getFeuilledeTempsByResp() {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);

    axios
      .get(`${url}/api/projets/feuille-temps`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {})
      .catch((err) => {
        console.error(err);
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
        setDateFin(response.data.date_limite);
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
  function getOneTaskModal(id) {
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
        setTitreTaskModale(response.data.titre);
        setDateDebutModale(response.data.date_debut);
        setDateFinModale(response.data.date_limite);
        setDescriptionModale(response.data.description);
        setListRespModale(response.data.responsables);
        setListControleModale(response.data.controle_taches);
        setIdTask(response.data.id);
        setShowModaleTask(true);
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
        ListTaskById,
        titreTaskModale,
        dateDebutModale,
        dateFinModale,
        descriptionModale,
        ListRespModale,
        ListControleModale,
        ListTaskComs,
        InfosProj,
        setInfosProj,
        gettaskByIdUser,
        setListControleModale,
        getFeuilledeTempsByResp,
        setTitreTaskModale,
        setListTaskComs,
        setListRespModale,
        setDescriptionModale,
        setDateDebutModale,
        setListTaskById,
        setListChampsWithoutValue,
        setidInput,
        getAllChampsByProject,
        setDateFinModale,
        getAllChamps,
        setListTask,
        setListChamps,
        setListTaskToMove,
        setIdStatus,
        setListResp,
        getAllTask,
        getComsTask,
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
        gettaskById,
        getOneTaskModal,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
