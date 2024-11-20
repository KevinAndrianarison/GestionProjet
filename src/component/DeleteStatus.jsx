import "../styles/Modal.css";
import { ShowContext } from "../contexte/useShow";
import { useContext } from "react";
import { UrlContext } from "../contexte/useUrl";
import { TaskContext } from "../contexte/useTask";
import { MessageContext } from "../contexte/useMessage";
import axios from "axios";

export default function DeleteStatus() {
  const { setShowDeleteStatus, setShowSpinner } = useContext(ShowContext);
  const { url } = useContext(UrlContext);
  const { idStatus, getAllStatusTaskKanban } = useContext(TaskContext);
  const { setMessageSucces, setMessageError } = useContext(MessageContext);

  function closeDelstatus() {
    setShowDeleteStatus(false);
  }

  function delstatus() {
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .delete(`${url}/api/projets/statuts-taches/${idStatus}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getAllStatusTaskKanban();
        setMessageSucces(response.data.message);
        setShowDeleteStatus(false);
        setTimeout(() => {
          setMessageSucces("");
        }, 5000);
      })
      .catch((err) => {
        console.error(err);
        setMessageError(err.response.data.error);
        setShowDeleteStatus(false);
        setTimeout(() => {
          setMessageError("");
        }, 5000);
        setShowSpinner(false);
      });
  }
  return (
    <>
      <div onClick={closeDelstatus} className="showModal">
        <div onClick={(e) => e.stopPropagation()} className="formModal">
          <h6 className="modal">Voulez-vous vraiment supprimer ce status ?</h6>
          <div className="valider">
            <button type="button" onClick={delstatus} className="SUPPR mt-5">
              OUI
            </button>
            <button type="button" onClick={closeDelstatus} className="NON mt-5">
              NON
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
