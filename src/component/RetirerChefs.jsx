import "../styles/Modal.css";
import { ShowContext } from "../contexte/useShow";
import { useContext } from "react";
import { UrlContext } from "../contexte/useUrl";
import { MessageContext } from "../contexte/useMessage";
import { UserContext } from "../contexte/useUser";
import { ProjectContext } from "../contexte/useProject";

import axios from "axios";

export default function RetirerChefs() {
  const { setShowRetierChefs, setShowSpinner } = useContext(ShowContext);
  const { url } = useContext(UrlContext);
  const { idRoleuser, Nomuser } = useContext(UserContext);
  const { setMessageSucces, setMessageError } = useContext(MessageContext);
  const { idProjet, getOneProjet } = useContext(ProjectContext);

  function closeRetirerChefs() {
    setShowRetierChefs(false);
  }

  function retirerChefs() {
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .delete(`${url}/api/projets/role-utilisateurs/${idRoleuser}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getOneProjet(idProjet);
        setMessageSucces(response.data.message);
        setShowRetierChefs(false);
        setTimeout(() => {
          setMessageSucces("");
        }, 5000);
      })
      .catch((err) => {
        setMessageError(err.response.data.error);
        setShowRetierChefs(false);
        setShowSpinner(false);
        setTimeout(() => {
          setMessageError("");
        }, 5000);
      });
  }

  return (
    <>
      <div className="showModal" onClick={() => setShowRetierChefs(false)}>
        <div className="formModal" onClick={(e) => e.stopPropagation()}>
          <h6 className="modal">
            Voulez-vous vraiment retirer "<b>{Nomuser}</b>" de ce projet ?
          </h6>
          <div className="valider">
            <button type="button" onClick={retirerChefs} className="SUPPR mt-5">
              OUI
            </button>
            <button
              type="button"
              onClick={closeRetirerChefs}
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
