import "../styles/Modal.css";
import { ShowContext } from "../contexte/useShow";
import { useContext } from "react";
import { MessageContext } from "../contexte/useMessage";
import { UrlContext } from "../contexte/useUrl";
import { TaskContext } from "../contexte/useTask";

import axios from "axios";

export default function Deleteetape() {
  const { url } = useContext(UrlContext);
  const { idInput, getAllChampsByProject } = useContext(TaskContext);
  const { setMessageSucces, setMessageError } = useContext(MessageContext);
  const { setShowDeletechamps, setShowSpinner } = useContext(ShowContext);

  function closeDeleChamps() {
    setShowDeletechamps(false);
  }

  function deleteChamps() {
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .delete(`${url}/api/projets/champs/${idInput}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getAllChampsByProject();
        setMessageSucces(response.data.message);
        setShowSpinner(false);
        setShowDeletechamps(false);
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
      <div className="showModal" onClick={() => setShowDeletechamps(false)}>
        <div className="formModal" onClick={(e) => e.stopPropagation()}>
          <h6 className="modal">Voulez-vous vraiment supprimer ce champs ?</h6>
          <div className="valider">
            <button onClick={deleteChamps} type="button" className="SUPPR mt-5">
              OUI
            </button>
            <button
              type="button"
              onClick={closeDeleChamps}
              className="NON mt-5"
            >
              NON
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
