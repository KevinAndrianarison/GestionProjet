import "../styles/LoginPage.css";
import { useState, useContext } from "react";
import { UrlContext } from "../contexte/useUrl";
import { ShowContext } from "../contexte/useShow";
import { MessageContext } from "../contexte/useMessage";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function LoginComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const entityString = localStorage.getItem("entity");
  let entity = JSON.parse(entityString);

  const { url } = useContext(UrlContext);
  const { setMessageError } = useContext(MessageContext);
  const {
    setShowSpinner,
    setShowLoginPage,
    setShowMainPage,
    setShowAdmin,
    setUser,
  } = useContext(ShowContext);
  const navigate = useNavigate();

  function loginFunction() {
    setShowSpinner(true);
    let formData = {
      email: email,
      mot_de_passe: password,
    };

    axios
      .post(`${url}/api/login`, formData)
      .then((response) => {
        setEmail("");
        setPassword("");
        if (response.data.message === "Connexion réussie") {
          localStorage.setItem(
            "user",
            JSON.stringify(response.data.utilisateur)
          );
          localStorage.setItem(
            "entity",
            JSON.stringify(response.data.nom_entreprise)
          );
          localStorage.setItem("token", JSON.stringify(response.data.token));
          localStorage.setItem("role", JSON.stringify(response.data.rôle));
          setShowLoginPage(false);
          if (response.data.rôle === "adminSuper") {
            setShowAdmin(false);
            navigate("/gestionEntity");
            setShowMainPage(true);
          }
          if (response.data.rôle === "admin") {
            navigate(`${entity}/AllProject`);
            setShowAdmin(true);
            setShowMainPage(true);
          }
          if (response.data.rôle === "employe") {
            navigate(`${entity}/AllProject`);
            setShowAdmin(false);
            setUser(true);
            setShowMainPage(true);
          }
          setShowSpinner(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setMessageError(err.response.data.message);
        setShowSpinner(false);
        setTimeout(() => {
          setMessageError("");
        }, 5000);
      });
  }

  return (
    <>
      <div className="forms">
        <h1 className="titreLogin">Connectez vous !</h1>
        <div className="inputs mt-16">
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="input w-80 pb-2 border-b-2 border-[rgba(255,255,255,0.849)] bg-transparent placeholder:text-[rgba(255,255,255,0.849)] focus:outline-none focus:border-blue-500"
            placeholder="Adresse email"
          />

          <div className="relative w-80 mt-10">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  loginFunction();
                }
              }}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="input w-full pb-2 border-b-2 border-[rgba(255,255,255,0.849)] bg-transparent placeholder:text-[rgba(255,255,255,0.849)] focus:outline-none focus:border-blue-500"
              placeholder="Mot de passe"
            />
            <span
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>

          <button
            className="btn mt-10"
            disabled={!email || !password}
            onClick={loginFunction}
          >
            Se connecter
          </button>
        </div>
        <div className="forgot mt-2">Mot de passe oubié ?</div>
        <div className="signup mt-5"></div>
      </div>
    </>
  );
}
