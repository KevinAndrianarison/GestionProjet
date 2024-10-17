import { createContext, useContext, useState } from "react";
import { UrlContext } from "./useUrl";
import axios from "axios";

export const EntityContext = createContext({
  nomEntity: "",
  idEntity: "",
});

export function EntityContextProvider({ children }) {
  const { url } = useContext(UrlContext);

  const [nomEntity, setNomEntity] = useState("");
  const [idEntity, setIdEntity] = useState("");
  const [ListeSociete, setListeSociete] = useState([]);

  function getListeEntity() {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .get(`${url}/api/entreprises`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setListeSociete(response.data.entreprises);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <EntityContext.Provider
      value={{
        nomEntity,
        idEntity,
        ListeSociete,
        setNomEntity,
        setIdEntity,
        getListeEntity,
      }}
    >
      {children}
    </EntityContext.Provider>
  );
}
