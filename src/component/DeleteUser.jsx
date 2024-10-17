import "../styles/Modal.css";
import { ShowContext } from "../contexte/useShow";
import { useContext } from "react";
import { UrlContext } from "../contexte/useUrl";
import { MessageContext } from "../contexte/useMessage";
import { UserContext } from "../contexte/useUser";

import axios from "axios";

export default function DeleteUser() {
  const { setShowDeleteUser, setShowSpinner } = useContext(ShowContext);
  const { url } = useContext(UrlContext);
  const { getAllUser, iduser } = useContext(UserContext);
  const { setMessageSucces, setMessageError } = useContext(MessageContext);

  function closeDeluser() {
    setShowDeleteUser(false);
  }

  function deleteuser() {
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .delete(`${url}/api/employes/${iduser}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getAllUser();
        setMessageSucces(response.data.message);
        setShowSpinner(false);
        setShowDeleteUser(false);
        setTimeout(() => {
          setMessageSucces("");
        }, 5000);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  return (
    <>
      <div className="showModal">
        <div className="formModal">
          <h6 className="modal">Voulez-vous vraiment supprimer ce compte ?</h6>
          <div className="valider">
            <button type="button" onClick={deleteuser} className="SUPPR mt-5">
              OUI
            </button>
            <button type="button" onClick={closeDeluser} className="NON mt-5">
              NON
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
