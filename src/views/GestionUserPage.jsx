import { useContext, useEffect, useState } from "react";
import "../styles/GestionUserPage.css";
import {
  faTrash,
  faList,
  faGrip,
  faEllipsis,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ShowContext } from "../contexte/useShow";
import { UrlContext } from "../contexte/useUrl";
import { MessageContext } from "../contexte/useMessage";
import { UserContext } from "../contexte/useUser";
import Tippy from "@tippyjs/react";

import axios from "axios";

export default function GestionUserPage() {
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [showMessageErrorEmail, setShowMessageErrorEmail] = useState(false);
  const [showList, setShowList] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState("");

  const { setShowDeleteUser, setShowSpinner } = useContext(ShowContext);
  const { url } = useContext(UrlContext);
  const { getAllUser, ListeUser, setIduser } = useContext(UserContext);
  const { setMessageSucces, setMessageError } = useContext(MessageContext);

  function switchToGrid() {
    setShowList(false);
    setShowGrid(true);
  }

  const toggleDropdown = (index) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  function deleteuser(id) {
    setIduser(id);
    setShowDeleteUser(true);
  }

  function switchToList() {
    setShowGrid(false);
    setShowList(true);
  }

  useEffect(() => {
    getAllUser();
  }, []);

  function inviterMembre() {
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    const userString = localStorage.getItem("user");
    let user = JSON.parse(userString);
    let formData = {
      nom: nom,
      email: email,
      entreprise_id: user.gest_com_entreprise_id,
    };

    axios
      .post(`${url}/api/invitation`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setMessageSucces(response.data.message);
        setEmail("");
        setNom("");
        getAllUser();
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

  function RegexEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setShowMessageErrorEmail(!regex.test(email));
    if (email === "") {
      setShowMessageErrorEmail(false);
    }
  }

  return (
    <div className="formulaireAddUsers pb-5" onClick={closeDropdown}>
      <h1 className="titreFormddUser">Inviter une personne :</h1>
      <div className="formContent flex mt-5">
        <div className="sm:col-span-3 w-60 mr-5">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Nom complet
          </label>
          <div className="mt-2">
            <input
              type="text"
              value={nom}
              onChange={(e) => {
                setNom(e.target.value);
              }}
              className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
            />
          </div>
        </div>
        <div className="sm:col-span-3 w-60 mr-5">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Adresse email
          </label>
          <div className="mt-2">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                RegexEmail(e.target.value);
              }}
              className="pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
            />
          </div>
          {showMessageErrorEmail && (
            <p className="errEmail text-xs">Adresse email invalide</p>
          )}
        </div>

        <div className="sm:col-span-3 w-44 mr-5">
          <label className="labelBTN text-sm font-medium leading-6 text-gray-900">
            &nbsp;
          </label>
          <div className="mt-2 divBtnInviter">
            <button
              disabled={!email || !nom || showMessageErrorEmail}
              className="btnInviter"
              onClick={inviterMembre}
            >
              Inviter
            </button>
          </div>
        </div>
      </div>
      <div className="listUser mt-5">
        <h1 className="titleList">
          Liste des employés ({Math.abs(ListeUser.length - 1)})
        </h1>
        <div className="showDisplay">
          <div
            onClick={switchToList}
            className={`listIcon mr-5 ${showList ? "active" : ""}`}
          >
            <FontAwesomeIcon icon={faList} className="w-5 h-4 mr-2" />
            Liste
          </div>
          <div
            onClick={switchToGrid}
            className={`listIcon ${showGrid ? "active" : ""}`}
          >
            <FontAwesomeIcon icon={faGrip} className="w-5 h-5 mr-2" />
            Grid
          </div>
        </div>
        {showGrid && (
          <div className="ListMembresGrid mt-4">
            {ListeUser.map(
              (list, index) =>
                list.role === "employe" && (
                  <div key={list.id} className="OneMembre mt-2 mr-10">
                    {!list.photo_profil && <div className="photouser mt-2"></div>}
                    {list.photo_profil && (
                      <div
                        className="photousers bg-cover bg-center mt-2"
                        style={{
                          backgroundImage: `url(${url}/storage/${list.photo_profil})`,
                        }}
                      ></div>
                    )}

                    <div className="infosuser">
                      <div>
                        <h1>{list.nom}</h1>
                        <p className="poste">{list.grade}</p>
                      </div>
                      <div className="adresse">{list.telephone}</div>
                      <div className="email">
                        <p>{list.email}</p>
                      </div>
                    </div>
                    <div className="deleteuser">
                      <Tippy content="Options">
                        <FontAwesomeIcon
                          icon={faEllipsis}
                          className="w-5 h-5 mt-2 mr-2  cursor-pointer focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(index);
                          }}
                        />
                      </Tippy>
                      {activeDropdown === index && (
                        <ul className="border dropdown-menu absolute z-10 right-2 mt-8 py-1 w-32 bg-white shadow-lg rounded-md">
                          {/* <li className=" dropdown-item flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200">
                            <FontAwesomeIcon icon={faBan} className="text-yellow-500 mr-2" />
                            Bloquer
                          </li> */}
                          {(list.grade === "membre" ||
                            list.grade === "invite") && (
                            <li
                              onClick={() => {
                                setgradeChef(list.id);
                              }}
                              className="dropdown-item flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                            >
                              <FontAwesomeIcon
                                icon={faRotate}
                                className="red-icon mr-2 text-gray-500"
                              />
                              Changer le grade en «<b>Chef</b>»
                            </li>
                          )}
                          {(list.grade === "invite" ||
                            list.grade === "chef") && (
                            <li
                              onClick={() => {
                                setgradeMembre(list.id);
                              }}
                              className="dropdown-item flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                            >
                              <FontAwesomeIcon
                                icon={faRotate}
                                className="red-icon mr-2 text-gray-500"
                              />
                              Changer le grade en «<b>Membre</b>»
                            </li>
                          )}
                          {(list.grade === "chef" ||
                            list.grade === "membre") && (
                            <li
                              onClick={() => setgradeInvite(list.id)}
                              className="dropdown-item flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                            >
                              <FontAwesomeIcon
                                icon={faRotate}
                                className="red-icon mr-2 text-gray-500"
                              />
                              Changer le grade en «<b>Invité</b>»
                            </li>
                          )}
                          <li
                            onClick={() => {
                              deleteuser(list.id);
                            }}
                            className="dropdown-item flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="red-icon mr-2"
                            />
                            Supprimer
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                )
            )}
          </div>
        )}
        {showList && (
          <div className="ListMembresList mt-5">
            <div className="headList">
              <li className="nomList">Nom complet</li>
              <li className="adresseList">Adresse email</li>
              <li className="posteList">Poste</li>
              <li className="deleteList"></li>
            </div>
            <div className="bodyValue">
              {ListeUser.map(
                (list, index) =>
                  list.role === "employe" && (
                    <div key={list.id} className="BodyList">
                      <li className="nomList">{list.nom}</li>
                      <li className="adresseList">{list.email}</li>
                      <li className="posteList">{list.poste}</li>
                      <li className="deleteList  more relative">
                        <Tippy content="Options">
                          <FontAwesomeIcon
                            icon={faEllipsis}
                            className="w-5 h-5  cursor-pointer focus:outline-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(index);
                            }}
                          />
                        </Tippy>
                        {activeDropdown === index && (
                          <ul className="border dropdown-menu absolute z-10 right-0 py-1 w-60 bg-white shadow-lg rounded-md">
                            {/* <li className="dropdown-item flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200">
                          <FontAwesomeIcon icon={faBan} className=" text-yellow-500 mr-2" />
                          Bloquer
                        </li> */}
                            {(list.grade === "membre" ||
                              list.grade === "invite") && (
                              <li
                                onClick={() => {
                                  setgradeChef(list.id);
                                }}
                                className="dropdown-item flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                              >
                                <FontAwesomeIcon
                                  icon={faRotate}
                                  className="red-icon mr-2 text-gray-500"
                                />
                                Changer le grade en «<b>Chef</b>»
                              </li>
                            )}
                            {(list.grade === "invite" ||
                              list.grade === "chef") && (
                              <li
                                onClick={() => {
                                  setgradeMembre(list.id);
                                }}
                                className="dropdown-item flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                              >
                                <FontAwesomeIcon
                                  icon={faRotate}
                                  className="red-icon mr-2 text-gray-500"
                                />
                                Changer le grade en «<b>Membre</b>»
                              </li>
                            )}
                            {(list.grade === "chef" ||
                              list.grade === "membre") && (
                              <li
                                onClick={() => setgradeInvite(list.id)}
                                className="dropdown-item flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                              >
                                <FontAwesomeIcon
                                  icon={faRotate}
                                  className="red-icon mr-2 text-gray-500"
                                />
                                Changer le grade en «<b>Invité</b>»
                              </li>
                            )}
                            <li
                              onClick={() => {
                                deleteuser(list.id);
                              }}
                              className="dropdown-item flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="red-icon mr-2"
                              />
                              Supprimer
                            </li>
                          </ul>
                        )}
                      </li>
                    </div>
                  )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
