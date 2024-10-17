import { createContext, useContext, useState } from "react";
import axios from "axios";
import { UrlContext } from "../contexte/useUrl";
import { ProjectContext } from "../contexte/useProject";
import { ShowContext } from "../contexte/useShow";

export const TaskContext = createContext({
  ListTask: [],
  idTask: "",
  titreTask: "",
  dateDebut: "",
  dateFin: "",
  description: "",
  responsable: {},

});
export function TaskContextProvider({ children }) {
  const [ListTask, setListTask] = useState([]);
  const [idTask, setIdTask] = useState("");
  const [titreTask, setTitreTask] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [description, setDescription] = useState("");
  const [responsable, setResponsable] = useState({});


  const { idProject } = useContext(ProjectContext);

  const { url } = useContext(UrlContext);
  const { setShowSetTask } = useContext(ShowContext);

  function getAllTask(id) {
    setListTask([]);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .get(`${url}/api/projets/${id}/taches`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setListTask(response.data);
        
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function getOneTask(id) {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);

    axios
      .get(`${url}/api/projets/${idProject}/taches/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTitreTask(response.data.titre);
        setDateDebut(response.data.date_debut);
        setDateFin(response.data.date_fin);
        setDescription(response.data.description);
        setResponsable(response.data.assignable)
        
        setShowSetTask(true);
      })
      .catch((err) => {
        console.error(err);
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
        responsable,
        setListTask,
        setResponsable,
        getAllTask,
        setIdTask,
        getOneTask,
        setTitreTask,
        setDateDebut,
        setDateFin,
        setDescription,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
