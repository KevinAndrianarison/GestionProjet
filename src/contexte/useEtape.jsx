import axios from "axios";
import { createContext, useContext, useState } from "react";
import { UrlContext } from "../contexte/useUrl";
import { ProjectContext } from "../contexte/useProject";

export const EtapeContext = createContext({
  listEtape: [],
  idEtape: "",
});
export function EtapeContextProvider({ children }) {
  const [listEtape, setListEtape] = useState([]);
  const [idEtape, setIdEtape] = useState("");
  const { url } = useContext(UrlContext);
  const { idProjet } = useContext(ProjectContext);

  function getAlletapeByProjets() {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .get(`${url}/api/projets/etapes/${idProjet}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setListEtape(enrichDataWithChamps(response.data));
        // setListEtape(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function getAlletapeByProjetsFirst(id) {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .get(`${url}/api/projets/etapes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setListEtape(enrichDataWithChamps(response.data));
        // setListEtape(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const enrichDataWithChamps = (rawData) => {
    const enrichedData = JSON.parse(JSON.stringify(rawData));

    return enrichedData.map((etape) => {
      const champsVisibles =
        etape.projet?.champs?.filter((champ) => champ.visible === 1) || [];
      etape.taches.forEach((tache) => {
        const valeursMap = {};
        tache.applic_champs?.forEach((applicChamp) => {
          valeursMap[applicChamp.gest_proj_champ_id] = applicChamp.valeur;
        });
        tache.champsVisibles = champsVisibles.map((champ) => ({
          id: champ.id,
          label: champ.label,
          valeur: valeursMap[champ.id] || null,
        }));
      });

      return etape;
    });
  };

  return (
    <EtapeContext.Provider
      value={{
        listEtape,
        idEtape,
        setListEtape,
        getAlletapeByProjets,
        getAlletapeByProjetsFirst,
        setIdEtape,
      }}
    >
      {children}
    </EtapeContext.Provider>
  );
}
