import "../styles/Modal.css";
import { ShowContext } from "../contexte/useShow";
import { useContext } from "react";
import { UrlContext } from "../contexte/useUrl";
import { MessageContext } from "../contexte/useMessage";
import { UserContext } from "../contexte/useUser";
import { ProjectContext } from "../contexte/useProject";

import axios from "axios";

export default function RetierMembres() {
  const { setShowRetirer, setShowSpinner } = useContext(ShowContext);
  const { url } = useContext(UrlContext);
  const { iduser, Nomuser } = useContext(UserContext);
  const { setMessageSucces, setMessageError } = useContext(MessageContext);
  const { idProjet, getOneProjet, getAllproject, getProjectWhenMembres } =
    useContext(ProjectContext);

  function closeRetireruser() {
    setShowRetirer(false);
  }

  function retirerMembres() {
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    let formData = {
      membre_id: iduser,
    };

    axios
      .put(
        `${url}/api/entreprises/projet/${idProjet}/membre-retire`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        getOneProjet(idProjet);
        setMessageSucces(response.data.message);
        setShowSpinner(false);
        setShowRetirer(false);
        setTimeout(() => {
          setMessageSucces("");
        }, 5000);
        getProjectWhenMembres();
        getAllproject();
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
            Voulez-vous vraiment retirer "<b>{Nomuser}</b>" de ce projet ?
          </h6>
          <div className="valider">
            <button
              type="button"
              onClick={retirerMembres}
              className="SUPPR mt-5"
            >
              OUI
            </button>
            <button
              type="button"
              onClick={closeRetireruser}
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
