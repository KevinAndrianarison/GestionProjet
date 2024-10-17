import "../styles/GestionEntity.css";
import {
  faTrash,
  faPlus,
  faBarsProgress,
  faListUl,
  faCheckDouble,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UrlContext } from "../contexte/useUrl";
import { MessageContext } from "../contexte/useMessage";
import { EntityContext } from "../contexte/useEntity";
import { ShowContext } from "../contexte/useShow";
import axios from "axios";

export function GestionEntity() {
  const [email, setEmail] = useState("");
  const [nomSociete, setNomSociete] = useState("");
  const [nomAdmin, setNomAdmin] = useState("");
  const [showMessageErrorEmail, setShowMessageErrorEmail] = useState(false);

  const { setMessageSucces, setMessageError } = useContext(MessageContext);
  const { url } = useContext(UrlContext);
  const { setShowSpinner, setShowDeleteEntity } = useContext(ShowContext);
  const { setNomEntity, setIdEntity, getListeEntity, ListeSociete } =
    useContext(EntityContext);

  function deleteEntity(nom, id) {
    setNomEntity(nom);
    setIdEntity(id);
    setShowDeleteEntity(true);
  }

  useEffect(() => {
    getListeEntity();
  }, []);

  function createSociete() {
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);

    let formData = {
      nom_utilisateur: nomAdmin,
      email: email,
      nom_entreprise: nomSociete,
    };
    axios
      .post(`${url}/api/register`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setNomAdmin("");
        setNomSociete("");
        setEmail("");
        setMessageSucces("Le compte a été créé avec succès !");
        setShowSpinner(false);
        getListeEntity();
        setTimeout(() => {
          setMessageSucces("");
        }, 5000);
      })
      .catch((err) => {
        setMessageError(err.response.data.message);
        setShowSpinner(false);
        setTimeout(() => {
          setMessageError("");
        }, 5000);
      });
  }

  function RegexEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setShowMessageErrorEmail(!regex.test(email));
    if (email === "") {
      setShowMessageErrorEmail(false);
    }
  }

  return (
    <div className="mainSuperAdmin">
      <div>
        <h1 className="text-3xl font-bold text-left">
          <FontAwesomeIcon icon={faBarsProgress} className="mr-4" />
          Gestion des sociétés
        </h1>

        <div className="flexsuper">
          <div className="left p-6 rounded-lg border shadow-sm mt-10">
            <h2 className="text-xl font-semibold  mb-4">
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Ajouter une société
            </h2>
            <div className="space-y-4 mt-5">
              <div>
                <label className="block font-medium mb-1">
                  Nom de la société
                </label>
                <input
                  type="text"
                  value={nomSociete}
                  onChange={(e) => setNomSociete(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Nom complet de la société"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Nom de l'admin</label>
                <input
                  type="text"
                  value={nomAdmin}
                  onChange={(e) => setNomAdmin(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Nom de l'administrateur"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Adresse email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    RegexEmail(e.target.value);
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="admin@example.com"
                />
                {showMessageErrorEmail && (
                  <p className="errEmail">Adresse email invalide</p>
                )}
              </div>

              <button
                onClick={createSociete}
                disabled={
                  !nomSociete || !nomAdmin || !email || showMessageErrorEmail
                }
                className="w-52 bg-blue-500 text-white py-2 rounded-md duration-300"
              >
                <FontAwesomeIcon icon={faCheckDouble} className="mr-2" />
                Ajouter
              </button>
            </div>
          </div>

          <div className="right mt-10 p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              <FontAwesomeIcon icon={faListUl} className="mr-2" />
              Liste des sociétés
            </h2>
            <div className="pl-5 listeSociete pt-2 border pb-2  text-sm font-bold">
              <li className="nomSociete">Société</li>
              <li className="nomAdmin">Admin</li>
              <li className="AdresseEmail">Email</li>
              <li className="trash mr-3"></li>
            </div>

            {ListeSociete.length !== 0 && (
              <div className="contentListSociete text-sm">
                {ListeSociete.map((list) => (
                  <div
                    key={list.id}
                    className="pl-5 pt-2 border  pb-2 listeSociete"
                  >
                    <li className="nomSociete">{list.nom}</li>
                    <li className="nomAdmin">{list.administrateurs[0].nom}</li>
                    <li className="AdresseEmail">
                      {list.administrateurs[0].email}
                    </li>
                    <li
                      className="trash"
                      onClick={() => {
                        deleteEntity(list.nom, list.id);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="faTrash mr-2"
                      />
                    </li>
                  </div>
                ))}
              </div>
            )}

            {ListeSociete.length == 0 && (
              <div className="emptyContent h-[80%]">
                <div className="empty w-40 h-40"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
