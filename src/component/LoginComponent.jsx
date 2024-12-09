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
  const entity = JSON.parse(entityString) || "";

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

  const fetchDepartements = async (token) => {
    try {
      const response = await axios.get(`${url}/api/departements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const departements = response.data;
      if (
        departements.length === 0 &&
        !departements.some((d) => d.nom === "Direction")
      ) {
        await addDepartement(token, "Direction", null);
        await fetchDepartements(token);
      }else{
        const rootDepartement = response.data.find((departement) => departement.gest_r_h_departement_id === null);
        if (rootDepartement) {
          localStorage.setItem("idDepRacine", JSON.stringify(rootDepartement.id));
        } else {
          console.warn("Aucun département racine trouvé.");
        }
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des départements :", err);
    }
  };

  const addDepartement = async (token, nom, parentId) => {
    try {
      const formData = { nom, gest_r_h_departement_id: parentId };
      await axios.post(`${url}/api/departements`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Erreur lors de l'ajout du département :", err);
    }
  };

  const loginFunction = async () => {
    setShowSpinner(true);
    try {
      const formData = { email, mot_de_passe: password };
      const response = await axios.post(`${url}/api/login`, formData);

      setEmail("");
      setPassword("");
      if (response.data.message === "Connexion réussie") {
        const { utilisateur, nom_entreprise, token, rôle } = response.data;

        localStorage.setItem("user", JSON.stringify(utilisateur));
        localStorage.setItem("entity", JSON.stringify(nom_entreprise));
        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("role", JSON.stringify(rôle));

        await fetchDepartements(token);

        setShowLoginPage(false);
        setShowMainPage(true);

        if (rôle === "adminSuper") {
          setShowAdmin(false);
          navigate("/gestionEntity");
        } else if (rôle === "admin") {
          localStorage.setItem("navBar", JSON.stringify("Gestion de projet"));
          navigate(`${entity}/AllProject`);
          setShowAdmin(true);
        } else if (rôle === "employe") {
          localStorage.setItem("navBar", JSON.stringify("Gestion de projet"));
          navigate(`${entity}/AllProject`);
          setShowAdmin(false);
          setUser(true);
        }
      }
    } catch (err) {
      setMessageError(err.response?.data?.message || "Une erreur s'est produite");
      setTimeout(() => setMessageError(""), 5000);
    } finally {
      setShowSpinner(false);
    }
  };

  return (
    <div className="forms">
      <h1 className="titreLogin">Connectez-vous !</h1>
      <div className="inputs mt-6">
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input w-80 pb-2 border-b-2 border-[rgba(255,255,255,0.849)] bg-transparent placeholder:text-[rgba(255,255,255,0.849)] focus:outline-none focus:border-blue-500"
          placeholder="Adresse email"
          aria-label="Adresse email"
        />
        <div className="relative w-80 mt-10">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onKeyDown={(e) => e.key === "Enter" && loginFunction()}
            onChange={(e) => setPassword(e.target.value)}
            className="input w-full pb-2 border-b-2 border-[rgba(255,255,255,0.849)] bg-transparent placeholder:text-[rgba(255,255,255,0.849)] focus:outline-none focus:border-blue-500"
            placeholder="Mot de passe"
            aria-label="Mot de passe"
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
      <div className="forgot mt-2">Mot de passe oublié ?</div>
    </div>
  );
}