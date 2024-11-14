import "../styles/Modal.css";
import { ShowContext } from "../contexte/useShow";
import { useContext } from "react";
import { MessageContext } from "../contexte/useMessage";
import { UrlContext } from "../contexte/useUrl";
import { EtapeContext } from "../contexte/useEtape";

import axios from "axios";

export default function Deleteetape() {
  const { url } = useContext(UrlContext);
  const { setMessageSucces, setMessageError } = useContext(MessageContext);
  const { setShowDeleteEtape, setShowSpinner } = useContext(ShowContext);
  const { getAlletapeByProjets, idEtape } = useContext(EtapeContext);

  function closeDeletape() {
    setShowDeleteEtape(false);
  }

  function deleteEtape() {
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .delete(`${url}/api/projets/etapes/${idEtape}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getAlletapeByProjets();
        setMessageSucces(response.data.message);
        setShowSpinner(false);
        setShowDeleteEtape(false);
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
      <div className="showModal" onClick={() => setShowDeleteEtape(false)}>
        <div className="formModal" onClick={(e) => e.stopPropagation()}>
          <h6 className="modal">
            Voulez-vous vraiment supprimer cette étape ?
          </h6>
          <div className="valider">
            <button onClick={deleteEtape} type="button" className="SUPPR mt-5">
              OUI
            </button>
            <button type="button" onClick={closeDeletape} className="NON mt-5">
              NON
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
