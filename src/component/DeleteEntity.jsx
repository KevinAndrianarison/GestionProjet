import "../styles/Modal.css";
import { ShowContext } from "../contexte/useShow";
import { EntityContext } from "../contexte/useEntity";
import { useContext } from "react";
import { MessageContext } from "../contexte/useMessage";
import { UrlContext } from "../contexte/useUrl";
import axios from "axios";

export default function DeleteEntity() {
  const { setShowDeleteEntity, setShowSpinner } = useContext(ShowContext);
  const { nomEntity, idEntity, getListeEntity } = useContext(EntityContext);
  const { url } = useContext(UrlContext);
  const { setMessageSucces, setMessageError } = useContext(MessageContext);

  function closeDelEntity() {
    setShowDeleteEntity(false);
  }

  function deleteEntity() {
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .delete(`${url}/api/entreprises/${idEntity}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setMessageSucces(response.data.message);
        setTimeout(() => {
          setMessageSucces("");
        }, 5000);
        setShowDeleteEntity(false);
        setShowSpinner(false);
        getListeEntity();
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
          <h6 className="modal">
            Voulez-vous vraiment supprimer la société "<b>{nomEntity}</b>" ?
            Toutes les <b>données</b> risquent d'être perdues.
          </h6>
          <div className="valider">
            <button type="button" onClick={deleteEntity} className="SUPPR mt-5">
              OUI
            </button>
            <button type="button" onClick={closeDelEntity} className="NON mt-5">
              NON
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
