import axios from "axios";
import { createContext, useContext, useState } from "react";
import { UrlContext } from "../contexte/useUrl";

export const ComsContext = createContext({
  listeCommentaire: [],
});
export function ComsContextProvider({ children }) {
  const [listeCommentaire, setListeCommentaire] = useState([]);
  const { url } = useContext(UrlContext);

  function getAllComs(id) {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .get(`${url}/api/commentaires/${id}/projet`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setListeCommentaire(response.data.reverse());
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <ComsContext.Provider
      value={{
        listeCommentaire,
        setListeCommentaire,
        getAllComs,
      }}
    >
      {children}
    </ComsContext.Provider>
  );
}
