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
  const [ListeProjectWhenMembres, setListeProjectWhenMembres] = useState([]);
  const [oneProject, setOneProject] = useState({});
  const [nomProjet, setNomProjet] = useState({});
  const [dateDebut, setDateDebut] = useState({});
  const [dateFin, setDateFin] = useState({});
  const [description, setDescription] = useState({});
  const [categorie, setCategorie] = useState("");
  const [idProjet, setIdProjet] = useState({});
  const [ListMembres, setListMembres] = useState([]);
  const [ListChefs, setListChefs] = useState([]);
  const [ListChefAndMembres, setListChefAndMembres] = useState([]);
  const { url } = useContext(UrlContext);
  const { setShowSpinner, setShowDetails } = useContext(ShowContext);

  function getAllproject() {
    setListeProjectWhenMembres([]);
    setListeProjectWhenChef([]);
    setListeProject([]);

    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    const userString = localStorage.getItem("user");
    let user = JSON.parse(userString);

    axios
      .get(`${url}/api/entreprises/${user.gest_com_entreprise_id}/projets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setShowSpinner(false);
        setListeProject(response.data.data.reverse());
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
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    const userString = localStorage.getItem("user");
    let user = JSON.parse(userString);
    axios
      .get(`${url}/api/entreprises/projets/${user.id}/projets-chefs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setShowSpinner(false);
        setListeProjectWhenChef(response.data.data.reverse());
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
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    const userString = localStorage.getItem("user");
    let user = JSON.parse(userString);
    axios
      .get(`${url}/api/entreprises/projets/${user.id}/projets-membre`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setShowSpinner(false);
        setListeProjectWhenMembres(response.data.data.reverse());
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
      .get(`${url}/api/entreprise/projets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setNomProjet(response.data.data.titre);
        setDateDebut(response.data.data.date_debut);
        setDateFin(response.data.data.date_fin);
        setDescription(response.data.data.description);
        setIdProjet(response.data.data.id);
        setShowDetails(true);
        setListMembres(response.data.data.membres);

        setListChefs(response.data.data.chefs);
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
        setCategorie,
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
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
