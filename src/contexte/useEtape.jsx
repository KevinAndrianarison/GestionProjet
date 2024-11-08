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
        setListEtape(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <EtapeContext.Provider
      value={{
        listEtape,
        idEtape,
        setListEtape,
        getAlletapeByProjets,
        setIdEtape
      }}
    >
      {children}
    </EtapeContext.Provider>
  );
}
