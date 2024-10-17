import "../styles/Modal.css";
import { ShowContext } from "../contexte/useShow";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UrlContext } from "../contexte/useUrl";

export default function LogoutComponent() {
  const {
    setShowLogout,
    setShowLoginPage,
    setShowLoginComponent,
    setShowMainPage,
  } = useContext(ShowContext);
  const navigate = useNavigate();

  const { url } = useContext(UrlContext);
  const { setShowSpinner } = useContext(ShowContext);

  function closeLogout() {
    setShowLogout(false);
  }

  function logout() {
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .get(`${url}/api/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        setShowLogout(false);
        setShowMainPage(false);
        setShowLoginComponent(true);
        setShowSpinner(false);
        setShowLoginPage(true);
        navigate("/");
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
          <h6 className="modal">Voulez-vous vraiment quitter ?</h6>
          <div className="valider">
            <button onClick={logout} className="OUI mt-5">
              OUI
            </button>
            <button onClick={closeLogout} className="NON mt-5">
              NON
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
