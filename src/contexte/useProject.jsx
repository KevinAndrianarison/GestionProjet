import axios from "axios";
import { createContext, useContext, useState } from "react";
import { UrlContext } from "../contexte/useUrl";
import { ShowContext } from "../contexte/useShow";

export const ProjectContext = createContext({
  ListeProject: [],
  idProject: "",
  ListeProjectWhenChef: [],
  ListeProjectWhenMembres: [],
  ListMembres: [],
  ListChefs: [],
  ListStatus: [],
  ListChefAndMembres: [],
  oneProject: {},
  nomProjet: "",
  dateDebut: "",
  dateFin: "",
  description: "",
  idProjet: "",
  categorie: "",
});
export function ProjectContextProvider({ children }) {
  const [ListeProject, setListeProject] = useState([]);
  const [idProject, setIdProject] = useState("");
  const [ListeProjectWhenChef, setListeProjectWhenChef] = useState([]);
  const [ListeProjectWhenResp, setListeProjectWhenResp] = useState([]);
  const [ListeProjectWhenMembres, setListeProjectWhenMembres] = useState([]);
  const [oneProject, setOneProject] = useState({});
  const [nomProjet, setNomProjet] = useState({});
  const [dateDebut, setDateDebut] = useState({});
  const [dateFin, setDateFin] = useState({});
  const [description, setDescription] = useState({});
  const [categorie, setCategorie] = useState("");
  const [idProjet, setIdProjet] = useState({});
  const [ListMembres, setListMembres] = useState([]);
  const [ListStatus, setListStatus] = useState([]);
  const [ListChefs, setListChefs] = useState([]);
  const [ListChefAndMembres, setListChefAndMembres] = useState([]);
  const { url } = useContext(UrlContext);
  const { setShowSpinner, setShowDetails } = useContext(ShowContext);

  function getAllproject() {
    setListeProjectWhenMembres([]);
    setListeProjectWhenChef([]);
    setListeProject([]);
    setListeProjectWhenResp([]);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);

    axios
      .get(`${url}/api/projets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setShowSpinner(false);
        setListeProject(response.data);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }
  function getProjectWhenChef() {
    setListeProject([]);
    setListeProjectWhenMembres([]);
    setListeProjectWhenChef([]);
    setListeProjectWhenResp([]);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .get(`${url}/api/projets/chef`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setShowSpinner(false);
        setListeProjectWhenChef(response.data.reverse());
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  function getProjectWhenMembres() {
    setListeProject([]);
    setListeProjectWhenChef([]);
    setListeProjectWhenMembres([]);
    setListeProjectWhenResp([]);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .get(`${url}/api/projets/membre`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setShowSpinner(false);
        setListeProjectWhenMembres(response.data.reverse());
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  function getProjectWhenResp() {
    setListeProject([]);
    setListeProjectWhenChef([]);
    setListeProjectWhenMembres([]);
    setListeProjectWhenResp([]);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .get(`${url}/api/projets/resp`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setShowSpinner(false);
        setListeProjectWhenResp(response.data.reverse());
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  function getAllStatus() {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);

    axios
      .get(`${url}/api/projets/statuts-projets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setListStatus(response.data);
        setShowSpinner(false);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  function getOneProjet(id) {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .get(`${url}/api/projets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);

        setNomProjet(response.data.nom);
        setDateDebut(response.data.date_debut);
        setDateFin(response.data.date_fin);
        setDescription(response.data.description);
        setIdProjet(response.data.id);
        setShowDetails(true);
        setListMembres(response.data.membres);
        setListChefs(response.data.utilisateur_roles);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  return (
    <ProjectContext.Provider
      value={{
        ListeProject,
        oneProject,
        ListeProjectWhenChef,
        ListeProjectWhenMembres,
        idProject,
        nomProjet,
        dateDebut,
        dateFin,
        description,
        idProjet,
        ListMembres,
        ListChefs,
        ListChefAndMembres,
        categorie,
        ListStatus,
        ListeProjectWhenResp,
        setCategorie,
        setListeProjectWhenResp,
        getProjectWhenResp,
        setListeProject,
        setOneProject,
        getAllproject,
        getProjectWhenChef,
        setIdProject,
        getProjectWhenMembres,
        getOneProjet,
        setNomProjet,
        setDateDebut,
        setDateFin,
        setDescription,
        setListChefs,
        setListMembres,
        setListChefAndMembres,
        setListeProjectWhenMembres,
        setListeProjectWhenChef,
        setListStatus,
        setIdProjet,
        getAllStatus,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
