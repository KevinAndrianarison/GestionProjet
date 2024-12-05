import axios from "axios";
import { createContext, useContext, useState } from "react";
import { UrlContext } from "../contexte/useUrl";
import { ShowContext } from "../contexte/useShow";

export const ProjectContext = createContext({
  ListeProject: [],
  ListeRess: [],
  ListeCtg: [],
  idProject: "",
  ListeProjectWhenChef: [],
  ListeProjectWhenMembres: [],
  ListMembres: [],
  ListJalon: [],
  ListChefs: [],
  ListStatus: [],
  ListChefAndMembres: [],
  oneProject: {},
  nomProjet: "",
  dateDebut: "",
  nbJours: "",
  dateFin: "",
  description: "",
  idProjet: "",
  categorie: "",
  ligneBudgetaire: "",
  ListClient: [],
});
export function ProjectContextProvider({ children }) {
  const [ListeCtg, setListeCtg] = useState([]);
  const [ListeRess, setListeRess] = useState([]);
  const [ListeMateriel, setListeMateriel] = useState([]);
  const [ListeProject, setListeProject] = useState([]);
  const [ListJalon, setListJalon] = useState([]);
  const [ListClient, setListClient] = useState([]);
  const [LisGrandEtap, setLisGrandEtap] = useState([]);
  const [idProject, setIdProject] = useState("");
  const [nbJours, setNbJours] = useState("");
  const [ListeProjectWhenChef, setListeProjectWhenChef] = useState([]);
  const [ListeProjectWhenResp, setListeProjectWhenResp] = useState([]);
  const [ListeProjectWhenMembres, setListeProjectWhenMembres] = useState([]);
  const [oneProject, setOneProject] = useState({});
  const [nomProjet, setNomProjet] = useState("");
  const [nomClient, setnomClient] = useState("");
  const [TJM, setTJM] = useState("");
  const [ligneBudgetaire, setLigneBudgetaire] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [description, setDescription] = useState("");
  const [categorie, setCategorie] = useState("");
  const [idProjet, setIdProjet] = useState("");
  const [ListMembres, setListMembres] = useState([]);
  const [ListStatus, setListStatus] = useState([]);
  const [ListChefs, setListChefs] = useState([]);
  const [ListChefAndMembres, setListChefAndMembres] = useState([]);
  const { url } = useContext(UrlContext);
  const { setShowSpinner, setShowDetails, setShowListProjet } =
    useContext(ShowContext);

  function getAllproject() {
    setListeProject([]);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);

    axios
      .get(`${url}/api/projets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setListeProjectWhenMembres([]);
        setListeProjectWhenChef([]);
        setListeProjectWhenResp([]);
        setShowListProjet(true);
        setListeProject(response.data.reverse());
      })
      .catch((err) => {
        console.error(err);
        setShowListProjet(true);
      });
  }

  function getAllClients() {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);

    axios
      .get(`${url}/api/clients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setListClient(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function getProjectWhenChef() {
    setListeProjectWhenChef([]);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .get(`${url}/api/projets/chef`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setListeProject([]);
        setListeProjectWhenMembres([]);
        setListeProjectWhenResp([]);
        setShowListProjet(true);
        setListeProjectWhenChef(response.data.reverse());
      })
      .catch((err) => {
        console.error(err);
        setShowListProjet(true);
      });
  }

  function getProjectWhenMembres() {
    setListeProjectWhenMembres([]);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .get(`${url}/api/projets/membre`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setListeProject([]);
        setListeProjectWhenChef([]);
        setListeProjectWhenResp([]);
        setShowListProjet(true);
        setListeProjectWhenMembres(response.data.reverse());
      })
      .catch((err) => {
        console.error(err);
        setShowListProjet(true);
      });
  }

  function getProjectWhenResp() {
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
        setListeProject([]);
        setListeProjectWhenChef([]);
        setListeProjectWhenMembres([]);
        setShowListProjet(true);
        setListeProjectWhenResp(response.data.reverse());
      })
      .catch((err) => {
        console.error(err);
        setShowListProjet(true);
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
  function getAllCtg() {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);

    axios
      .get(`${url}/api/projets/categorie-materielles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setListeCtg(response.data);
        setShowSpinner(false);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  function getAllJalon(id) {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);

    axios
      .get(`${url}/api/projets/jalons/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {

        setListJalon(response.data);
        setShowSpinner(false);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  function getAllRess() {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);

    axios
      .get(`${url}/api/projets/materielles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setListeRess(response.data);
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
        getAllJalon(id);
        setListeMateriel(response.data.materiels);
        setLigneBudgetaire(response.data.ligne_budgetaire);
        setnomClient(response.data.client.nom_societe);
        setLisGrandEtap(response.data.etapes);
        setNomProjet(response.data.nom);
        setNbJours(response.data.nb_jour);
        setTJM(response.data.taux_j_moyen);
        setDateDebut(response.data.date_debut);
        setDateFin(response.data.date_limite);
        setDescription(response.data.description);
        setIdProjet(response.data.id);
        setShowDetails(true);
        setListMembres(response.data.membres);
        setListChefs(response.data.utilisateur_roles);
        setShowSpinner(false);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
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
        ListClient,
        ligneBudgetaire,
        nomClient,
        nbJours,
        TJM,
        ListeCtg,
        LisGrandEtap,
        ListeRess,
        ListeMateriel,
        ListJalon,
        getAllCtg,
        getAllJalon,
        setListJalon,
        setListeMateriel,
        getAllRess,
        setListeRess,
        setLisGrandEtap,
        setListeCtg,
        setTJM,
        setNbJours,
        setnomClient,
        setLigneBudgetaire,
        getAllClients,
        setListClient,
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
