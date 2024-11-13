import { createContext, useContext, useState } from "react";
import { UrlContext } from "../contexte/useUrl";
import axios from "axios";

export const UserContext = createContext({
  ListeUser: [],
  iduser: "",
  idRoleuser: "",
  Nomuser: "",
});

export function UserContextProvider({ children }) {
  const [ListeUser, setListeUser] = useState([]);
  const [iduser, setIduser] = useState("");
  const [Nomuser, setNomuser] = useState("");
  const [idRoleuser, setIdRoleuser] = useState("");
  const { url } = useContext(UrlContext);

  function getAllUser() {
    setListeUser([]);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    const userString = localStorage.getItem("user");

    let user = JSON.parse(userString);
    axios
      .get(`${url}/api/entreprises/${user.gest_com_entreprise_id}/employes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {                
        if (response.data.utilisateurs.length !== 0) {
          setListeUser(response.data.utilisateurs);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <UserContext.Provider
      value={{
        ListeUser,
        iduser,
        Nomuser,
        idRoleuser,
        setNomuser,
        getAllUser,
        setListeUser,
        setIduser,
        setIdRoleuser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
