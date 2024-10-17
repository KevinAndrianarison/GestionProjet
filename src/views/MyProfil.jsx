import "../styles/MyProfil.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGears, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState, useContext, useEffect } from "react";
import { ShowContext } from "../contexte/useShow";
import { MessageContext } from "../contexte/useMessage";
import { UrlContext } from "../contexte/useUrl";
import axios from "axios";

export default function MyProfil() {
  const [password, setPassword] = useState("");
  const [passwordNow, setPasswordNow] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showMessageMdpError, setShowMessageMdpError] = useState(false);
  const [nomSociete, setnomSociete] = useState("");
  const [nomComplet, setnomComplet] = useState("");
  const [showMessageErrorEmail, setShowMessageErrorEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [poste, setPoste] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const { url } = useContext(UrlContext);
  const { setMessageSucces, setMessageError } = useContext(MessageContext);
  const { setShowSpinner, showAdmin } = useContext(ShowContext);

  function RegexEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setShowMessageErrorEmail(!regex.test(email));
    if (email === "") {
      setShowMessageErrorEmail(false);
    }
  }

  useEffect(() => {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);

    const request1 = axios.get(`${url}/api/administrateurs/entreprise`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const request2 = axios.get(`${url}/api/administrateurs/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    Promise.all([request1, request2])
      .then(([entrepriseResponse, profileResponse]) => {
        setnomSociete(entrepriseResponse.data.entreprise.nom);
        setnomComplet(profileResponse.data.administrateur.nom);
        setEmail(profileResponse.data.administrateur.email);
        setTelephone(profileResponse.data.administrateur.telephone);
        setPoste(profileResponse.data.administrateur.poste);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  function putMdp() {
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    const roleString = localStorage.getItem("role");
    let role = JSON.parse(roleString);

    let APIname;

    if (role === "admin") {
      APIname = "api/administrateurs/change-password";
    }
    if (role === "employe") {
      APIname = "api/employes/change-password";
    }

    let formdata = {
      ancien_mot_de_passe: passwordNow,
      nouveau_mot_de_passe: passwordVerify,
    };
    axios
      .post(`${url}/${APIname}`, formdata, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setMessageSucces("Modification de mot de passe réussi !");
        setPasswordNow("");
        setPassword("");
        setPasswordVerify("");
        setShowSpinner(false);
        setTimeout(() => {
          setMessageSucces("");
        }, 5000);
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

  function putInfos() {
    const userString = localStorage.getItem("user");
    const tokenString = localStorage.getItem("token");
    let user = JSON.parse(userString);
    let token = JSON.parse(tokenString);
    const roleString = localStorage.getItem("role");
    let role = JSON.parse(roleString);

    setShowSpinner(true);
    if (nomSociete && role === "admin") {
      let formData = {
        nom: nomSociete,
      };
      axios
        .put(`${url}/api/entreprises/${user.gest_com_entreprise_id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          localStorage.setItem(
            "entity",
            JSON.stringify(response.data.entreprise.nom)
          );
          setMessageSucces("Modification réussi !");
          setShowSpinner(false);
          setTimeout(() => {
            setMessageSucces("");
          }, 5000);
        })
        .catch((err) => {
          console.error(err);
          setShowSpinner(false);
        });
    }
    if (nomComplet || email || telephone || poste) {
      let APIname;

      if (role === "admin") {
        APIname = "api/administrateurs/profile";
      }
      if (role === "employe") {
        APIname = "api/employes/profile";
      }

      let formData = {
        nom: nomComplet,
        email: email,
        telephone: String(telephone),
        poste: poste,
      };
      axios
        .put(`${url}/${APIname}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          
          localStorage.setItem(
            "user",
            JSON.stringify(response.data.administrateur)
          );
          setMessageSucces("Modification réussi !");
          setShowSpinner(false);
          setTimeout(() => {
            setMessageSucces("");
          }, 5000);
        })
        .catch((err) => {
          console.error(err);
          setShowSpinner(false);
        });
    }
  }

  function toggleEditing() {
    if (isEditing) {
      putInfos();
    }
    setIsEditing(!isEditing);
  }

  return (
    <>
      <div className="setInfosPerso mt-10">
        <h1 className="titreInfos">
          <FontAwesomeIcon icon={faGears} className="mr-2 w-6 h-6" />
          Ajouter ou modifier vos informations personnelles
        </h1>
        <div className="informationsForm mt-5">
          {showAdmin && (
            <div className="sm:col-span-3 w-60 mr-5">
              <label className="block text-sm font-bold leading-6 text-gray-900">
                Nom de la société
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  value={nomSociete || ""}
                  disabled={!isEditing}
                  onChange={(e) => setnomSociete(e.target.value)}
                  className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="sm:col-span-3 w-60 mr-5">
            <label className="block text-sm font-bold leading-6 text-gray-900">
              Votre nom complet
            </label>
            <div className="mt-2">
              <input
                type="text"
                value={nomComplet || ""}
                disabled={!isEditing}
                onChange={(e) => setnomComplet(e.target.value)}
                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
              />
            </div>
          </div>
          <div className="sm:col-span-3 w-60 mr-5">
            <label className="block text-sm font-bold leading-6 text-gray-900">
              Adresse email
            </label>
            <div className="mt-2">
              <input
                type="email"
                value={email || ""}
                disabled={!isEditing}
                onChange={(e) => {
                  setEmail(e.target.value);
                  RegexEmail(e.target.value);
                }}
                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
              />
            </div>
            {showMessageErrorEmail && (
              <p className="errEmail">Adresse email invalide</p>
            )}
          </div>
          <div className="sm:col-span-3 w-60 mr-5">
            <label className="block text-sm font-bold leading-6 text-gray-900">
              Téléphone
            </label>
            <div className="mt-2">
              <input
                type="number"
                value={telephone || ""}
                disabled={!isEditing}
                onChange={(e) => setTelephone(e.target.value)}
                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
              />
            </div>
          </div>
          <div className="sm:col-span-3 w-60 mr-5">
            <label className="block text-sm font-bold leading-6 text-gray-900">
              Poste
            </label>
            <div className="mt-2">
              <input
                type="text"
                value={poste || ""}
                disabled={!isEditing}
                onChange={(e) => setPoste(e.target.value)}
                className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
              />
            </div>
          </div>
          <div className="sm:col-span-3 w-44 mr-5">
            <label className=" text-sm font-medium leading-6 text-gray-900">
              &nbsp;
            </label>
            <div className="mt-2 ">
              <button
                onClick={toggleEditing}
                className={isEditing ? "btnEnregistrer" : "btnInviter"}
              >
                {isEditing ? "Enregistrer" : "Modifier"}
              </button>
            </div>
          </div>
        </div>
        <h1 className="titreInfos mt-10">
          <FontAwesomeIcon icon={faGears} className="mr-2 w-6 h-6" />
          Modifier votre mot de passe
        </h1>

        <div className="informationsForm mt-5">
          <div className="sm:col-span-3 w-60 mr-5">
            <label className="block text-sm font-bold leading-6 text-gray-900">
              Mot de passe actuel
            </label>
            <div className="mt-2 relative">
              <input
                type="text"
                value={passwordNow}
                onChange={(e) => setPasswordNow(e.target.value)}
                className="pl-3 pr-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
              />
            </div>
          </div>
          <div className="sm:col-span-3 w-60 mr-5">
            <label className="block text-sm font-bold leading-6 text-gray-900">
              Nouveau mot de passe
            </label>
            <div className="mt-2 relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (e.target.value !== passwordVerify) {
                    if (passwordVerify === "") {
                      setShowMessageMdpError(false);
                    } else {
                      setShowMessageMdpError(true);
                    }
                  } else {
                    setShowMessageMdpError(false);
                  }
                }}
                className="pl-3 pr-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
              />
              <span
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-black"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>
          <div className="sm:col-span-3 w-60 mr-5">
            <label className="block text-sm font-bold leading-6 text-gray-900">
              Confirmer le mot de passe
            </label>
            <div className="mt-2 relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordVerify}
                onChange={(e) => {
                  setPasswordVerify(e.target.value);
                  if (e.target.value !== password) {
                    setShowMessageMdpError(true);
                  } else {
                    setShowMessageMdpError(false);
                  }
                }}
                className="pl-3 pr-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
              />
              <span
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-black"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                />
              </span>
            </div>
            {showMessageMdpError && (
              <p className="errEmail">Vérifier votre mot de passe</p>
            )}
          </div>
          <div className="sm:col-span-3 w-44 mr-5">
            <label className=" text-sm font-medium leading-6 text-gray-900">
              &nbsp;
            </label>
            <div className="mt-2 ">
              <button
                onClick={putMdp}
                disabled={showMessageMdpError}
                className="btnInviter"
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
