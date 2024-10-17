import "../styles/Modal.css";
import { ShowContext } from "../contexte/useShow";
import { useContext } from "react";

export default function SeRetirer() {
  const { setShowSeretirer } = useContext(ShowContext);

  function closeSeRetirer() {
    setShowSeretirer(false);
  }

  return (
    <>
      <div className="showModal">
        <div className="formModal">
          <h6 className="modal">
            Voulez-vous vraiment vous retirer du projet ?
          </h6>
          <div className="valider">
            <button type="button" className="SUPPR mt-5">
              OUI
            </button>
            <button type="button" onClick={closeSeRetirer} className="NON mt-5">
              NON
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
