import "../styles/MainPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolderOpen,
  faPlusCircle,
  faUserPlus,
  faSignOutAlt,
  faGear,
  faListOl,
  faDollarSign,
  faScroll,
  faPersonRays,
  faHistory,
  faDiagramProject,
  faReceipt,
  faUsersGear,
  faStar,
  faBars,
  faXmark,
  faPerson
} from "@fortawesome/free-solid-svg-icons";
import AllprojectPage from "./AllprojectPage";
import Devis from "../DevisFacure/views/Devis";
import Facture from "../DevisFacure/views/Facture";
import ModifierClient from "../DevisFacure/views/ModifierClient";
import NavbarClient from "../DevisFacure/views/NavbarClient";
import NouveauDevis from "../DevisFacure/views/NouveauDevis";
import Fournisseurs from "../DevisFacure/views/Fournisseurs.jsx";
import ProspectDetail from "../DevisFacure/views/Prospect";
import EditProspect from "../DevisFacure/views/Prospect";
import EditUser from "../DevisFacure/views/ModifierClient";
import Prospect from "../DevisFacure/views/Prospect";
import Services from "../DevisFacure/views/Services";
import GestionUserPage from "./GestionUserPage";
import { GestionEntity } from "./GestionEntity";
import MyProfil from "./MyProfil";
import InfoSociete from "./InfoSociete";
import { Routes, Route, NavLink } from "react-router-dom";
import { ShowContext } from "../contexte/useShow";
import { useContext, useEffect, useState } from "react";
import Tippy from "@tippyjs/react";
import { useNavigate } from "react-router-dom";
import { UrlContext } from "../contexte/useUrl";
import logosofticeo from "../images/logosofticeo.png";
import GestionFacParams from "../DevisFacure/views/GestionFacParams.jsx";

export default function MainPage() {
  const [statusNavBar, setStatusNavBar] = useState(1);
  const [TitreNavBar, setTitreNavBar] = useState("Gestion de projet");
  const [DescrNavBar, setDescrNavBar] = useState(
    "Bienvenue sur votre espace de gestion de projet, où chaque tâche trouve sa <b>solution</b> et chaque équipe atteint ses <b> objectifs</b> !"
  );
  const entityString = localStorage.getItem("entity");
  const userString = localStorage.getItem("user");
  const navigate = useNavigate();
  let entity = JSON.parse(entityString);
  let user = JSON.parse(userString);
  const { url } = useContext(UrlContext);
  const [showMenuMobile, setshowMenuMobile] = useState(false);

  const { setShowLogout, setShowcreateTask, showUser, showAdmin } =
    useContext(ShowContext);

  function logout() {
    setShowLogout(true);
  }

  useEffect(() => {
    const navBarString = localStorage.getItem("navBar");
    let navBar = JSON.parse(navBarString);
    if (navBar === "Gestion de projet") {
      switchToGestProj();
    }
    if (navBar === "Gestion de devis-facture") {
      switchToGestDevis();
    }
    if (navBar === "Gestion RH") {
      switchToGestRH();
    }
    if (navBar === "Gestion client") {
      switchToGestClient();
    }
    if (navBar === "Setting") {
      switchToSetting();
    }
  }, []);

  function createProject() {
    setShowcreateTask(true);
  }

  function switchToGestProj() {
    localStorage.setItem("navBar", JSON.stringify("Gestion de projet"));
    navigate(`${entity}/GestionProjet/AllProject`);
    setDescrNavBar(
      "Bienvenue sur votre espace de gestion de projet, où chaque tâche trouve sa <b>solution</b> et chaque équipe atteint ses <b> objectifs</b> !"
    );
    setTitreNavBar("Gestion de projet");
    setStatusNavBar(1);
    setshowMenuMobile(false);
  }

  function switchToGestDevis() {
    localStorage.setItem("navBar", JSON.stringify("Gestion de devis-facture"));
    navigate(`${entity}/GestionDevisFactures/services`);
    setDescrNavBar(
      " Bienvenue dans votre espace de gestion de devis et factures, où chaque transaction est <b>simplifiée</b> et chaque détail est <b>maîtrisé</b> ! "
    );
    setTitreNavBar("Gestion de devis-facture");
    setStatusNavBar(2);
    setshowMenuMobile(false);
  }

  function switchToGestClient() {
    localStorage.setItem("navBar", JSON.stringify("Gestion client"));
    navigate(`${entity}/GestionClientsFournisseurs/prospect/`);
    setDescrNavBar(
      "Bienvenue dans votre espace Client, pour une gestion simple et <b>optimisée</b> de vos relations clients !"
    );
    setTitreNavBar("Gestion client");
    setStatusNavBar(4);
    setshowMenuMobile(false);
  }

  function switchToGestRH() {
    localStorage.setItem("navBar", JSON.stringify("Gestion RH"));
    navigate(`${entity}/GestionClientsFournisseurs/GestionRH/`);
    setDescrNavBar(
      " Bienvenue dans votre espace RH, pour une gestion simple et <b>efficace<b> de votre équipe !  "
    );
    setTitreNavBar("Gestion RH");
    setStatusNavBar(3);
    setshowMenuMobile(false);
  }

  function switchToSetting() {
    localStorage.setItem("navBar", JSON.stringify("Setting"));
    navigate(`${entity}/Settings/entity`);
    setDescrNavBar(
      ""
    );
    setTitreNavBar("Paramètres");
    setStatusNavBar(5);
    setshowMenuMobile(false);
  }

  return (
    <>
      <div 
        onClick={() => setshowMenuMobile(false)}
        className={`bg-white backdrop-blur-sm p-6 rounded-lg shadow-lg opacity-40 top-0 left-0 fixed transition-all ${showMenuMobile === false ?  "w-0 h-0": "w-full h-full"}`}>
      </div>
      <div className={`bg-white max-w-[90%] fixed shadow-2xl border-t-4 border-blue-500 ${showMenuMobile === false ?  "w-0 h-0 top-0 right-[-100px]": "w-[400px] p-4 top-0 right-0"}`}>
          <p className="text-red-600 text-xl p-4"><FontAwesomeIcon icon={faXmark} className="cursor-pointer" onClick={() => setshowMenuMobile(false)}/></p>
          {(showAdmin || showUser) && (
            <>
              <div className="flex mr-5 items-center mb-4">
                <div
                  style={{
                    backgroundImage: `url(${url}/storage/${user.photo_profile})`,
                  }}
                  className="mr-1 bg-cover bg-center rounded-3xl w-11 sm:w-13 lg:w-15 xl:w-17 2xl:w-19 h-7 sm:h-9 lg:h-11 xl:h-13 2xl:h-15"
                ></div>
                <p className="input text-black font-bold">{user.nom}</p>
              </div>
              <hr className="mb-2"></hr>
            </>
          )}
          {(showAdmin || showUser) && (
            <div className="input text-xs cursor-pointer text-gray-500 items-center p-0">
            {/* Gestion de projet */}
            <div
              title="Gestion de projet"
              onClick={switchToGestProj}
              className={`relative flex items-center px-2 py-1 rounded-lg transition-all duration-300 ${
                statusNavBar === 1
                  ? "bg-blue-100 text-blue-500"
                  : "hover:bg-blue-50 hover:text-blue-500"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full shadow-md ${
                  statusNavBar === 1 ? "bg-blue-500" : "bg-gray-300"
                } transition-transform transform ${
                  statusNavBar === 1 ? "scale-110" : "scale-100"
                }`}
              >
                <FontAwesomeIcon
                  icon={faDiagramProject}
                  className="text-white text-xl w-4"
                />
              </div>
              <span
                className={`ml-4 text-sm font-medium transition-all duration-300 ${
                  statusNavBar === 1 ? "opacity-100" : "opacity-100"
                }`}
              >
                Gestion de projet
              </span>
            </div>
        
            {/* Gestion de devis-facture */}
            <div
              title="Gestion de devis-facture"
              onClick={switchToGestDevis}
              className={`relative flex items-center px-2 py-1 rounded-lg transition-all duration-300 ${
                statusNavBar === 2
                  ? "bg-blue-100 text-blue-500"
                  : "hover:bg-blue-50 hover:text-blue-500"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full shadow-md ${
                  statusNavBar === 2 ? "bg-blue-500" : "bg-gray-300"
                } transition-transform transform ${
                  statusNavBar === 2 ? "scale-110" : "scale-100"
                }`}
              >
                <FontAwesomeIcon
                  icon={faReceipt}
                  className="text-white text-xl w-4"
                />
              </div>
              <span
                className={`ml-4 text-sm font-medium transition-all duration-300 opacity-100`}
              >
                Gestion de devis-facture
              </span>
            </div>
        
            {/* Gestion RH */}
            <div
              title="Gestion RH"
              onClick={switchToGestRH}
              className={`relative flex items-center px-2 py-1 rounded-lg transition-all duration-300 ${
                statusNavBar === 3
                  ? "bg-blue-100 text-blue-500"
                  : "hover:bg-blue-50 hover:text-blue-500"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full shadow-md ${
                  statusNavBar === 3 ? "bg-blue-500" : "bg-gray-300"
                } transition-transform transform ${
                  statusNavBar === 3 ? "scale-110" : "scale-100"
                }`}
              >
                <FontAwesomeIcon
                  icon={faUsersGear}
                  className="text-white text-xl w-4"
                />
              </div>
              <span
                className={`ml-4 text-sm font-medium transition-all duration-300 opacity-100`}
              >
                Gestion RH
              </span>
            </div>
        
            {/* Gestion client */}
            <div
              title="Gestion client"
              onClick={switchToGestClient}
              className={`relative flex items-center px-2 py-1 rounded-lg transition-all duration-300 ${
                statusNavBar === 4
                  ? "bg-blue-100 text-blue-500"
                  : "hover:bg-blue-50 hover:text-blue-500"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full shadow-md ${
                  statusNavBar === 4 ? "bg-blue-500" : "bg-gray-300"
                } transition-transform transform ${
                  statusNavBar === 4 ? "scale-110" : "scale-100"
                }`}
              >
                <FontAwesomeIcon
                  icon={faStar}
                  className="text-white text-xl w-4"
                />
              </div>
              <span
                className={`ml-4 text-sm font-medium transition-all duration-300 opacity-100`}
              >
                Gestion client
              </span>
            </div>
          </div>
          )}
          <hr></hr>
      </div>
      <div className="flex justify-between w-full border-b-4 border-blue-500 py-4 flex-wrap">
        <div className="flex items-center cursor-pointer" onClick={() => navigate(`${entity}/GestionProjet/AllProject`)}>
          <div className="w-32 sm:w-36 lg:w-40 xl:w-44 2xl:w-48 pl-4">
            <img src={logosofticeo} alt="Sofiticeo" />
          </div>
        </div>
        {(showAdmin || showUser) && (
          <div
          className="input text-xs cursor-pointer text-gray-500 flex-wrap items-center hidden xl:flex p-0"
        >
          {/* Gestion de projet */}
          <div title="Gestion de projet"
            onClick={switchToGestProj}
              className={`relative flex items-center px-2 py-1 rounded-lg transition-all duration-300 ${
                statusNavBar === 1
                  ? "bg-blue-100 text-blue-500"
                  : "hover:bg-blue-50 hover:text-blue-500"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full shadow-md ${
                  statusNavBar === 1 ? "bg-blue-500" : "bg-gray-300"
                } transition-transform transform ${
                  statusNavBar === 1 ? "scale-110" : "scale-100"
                }`}
              >
                <FontAwesomeIcon
                  icon={faDiagramProject}
                  className="text-white text-xl w-4"
                />
              </div>
              <span
                className={`ml-4 text-sm font-medium transition-all duration-300 ${
                  statusNavBar === 1 ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
                } group-hover:opacity-100 group-hover:max-w-xs`}
              >
                {statusNavBar === 1 && "Gestion de projet"}
              </span>
            </div>
          
            {/* Gestion de devis-facture */}
            <div title="Gestion de devis-facture"
              onClick={switchToGestDevis}
              className={`relative flex items-center px-2 py-1 rounded-lg transition-all duration-300 ${
                statusNavBar === 2
                  ? "bg-blue-100 text-blue-500"
                  : "hover:bg-blue-50 hover:text-blue-500"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full shadow-md ${
                  statusNavBar === 2 ? "bg-blue-500" : "bg-gray-300"
                } transition-transform transform ${
                  statusNavBar === 2 ? "scale-110" : "scale-100"
                }`}
              >
                <FontAwesomeIcon icon={faReceipt} className="text-white text-xl w-4" />
              </div>
              <span
                className={`ml-4 text-sm font-medium transition-all duration-300 ${
                  statusNavBar === 2 ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
                } group-hover:opacity-100 group-hover:max-w-xs`}
              >
                {statusNavBar === 2 && "Gestion de devis-facture"}
              </span>
            </div>
          
            {/* Gestion RH */}
            <div title="Gestion RH"
              onClick={switchToGestRH}
              className={`relative flex items-center px-2 py-1 rounded-lg transition-all duration-300 ${
                statusNavBar === 3
                  ? "bg-blue-100 text-blue-500"
                  : "hover:bg-blue-50 hover:text-blue-500"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full shadow-md ${
                  statusNavBar === 3 ? "bg-blue-500" : "bg-gray-300"
                } transition-transform transform ${
                  statusNavBar === 3 ? "scale-110" : "scale-100"
                }`}
              >
                <FontAwesomeIcon icon={faUsersGear} className="text-white text-xl w-4" />
              </div>
              <span
                className={`ml-4 text-sm font-medium transition-all duration-300 ${
                  statusNavBar === 3 ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
                } group-hover:opacity-100 group-hover:max-w-xs`}
              >
                {statusNavBar === 3 && "Gestion RH"}
              </span>
            </div>
          
            {/* Gestion client */}
            <div title="Gestion client"
              onClick={switchToGestClient}
              className={`relative flex items-center px-2 py-1 rounded-lg transition-all duration-300 ${
                statusNavBar === 4
                  ? "bg-blue-100 text-blue-500"
                  : "hover:bg-blue-50 hover:text-blue-500"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full shadow-md ${
                  statusNavBar === 4 ? "bg-blue-500" : "bg-gray-300"
                } transition-transform transform ${
                  statusNavBar === 4 ? "scale-110" : "scale-100"
                }`}
              >
                <FontAwesomeIcon icon={faStar} className="text-white text-xl w-4" />
              </div>
              <span
                className={`ml-4 text-sm font-medium transition-all duration-300 ${
                  statusNavBar === 4 ? "opacity-100 max-w-xs" : "opacity-0 max-w-0"
                } group-hover:opacity-100 group-hover:max-w-xs`}
              >
                {statusNavBar === 4 && "Gestion client"}
              </span>
            </div>
          </div>
        
        )}

        <div className="text-xs flex items-center text-gray-700">
          {(showAdmin || showUser) && (
            <>
              <div className="mr-5 items-center hidden xl:flex">
                <div
                  style={{
                    backgroundImage: `url(${url}/storage/${user.photo_profile})`,
                  }}
                  className="mr-1 bg-cover bg-center rounded-3xl w-11 sm:w-13 lg:w-15 xl:w-17 2xl:w-19 h-7 sm:h-9 lg:h-11 xl:h-13 2xl:h-15"
                ></div>
                <p className="input text-black font-bold">{user.nom}</p>
              </div>
              <div className="flex xl:hidden">
                <Tippy content="Menu">
                    <FontAwesomeIcon
                      icon={faBars}
                      className="mr-5 mt-1 cursor-pointer w-16 h-5"
                      onClick={() => setshowMenuMobile(true)}
                    />
                  </Tippy>
              </div>
              <div className="flex cursor-pointer">
                  <Tippy content="Paramètres">
                    <FontAwesomeIcon
                      onClick={switchToSetting}
                      icon={faGear}
                      className="mr-5 mt-1 focus:outline-none"
                    />
                  </Tippy>
              </div>
            </>
          )}
          <div className="flex">
            <Tippy content="Se déconnecter">
              <FontAwesomeIcon
                onClick={logout}
                icon={faSignOutAlt}
                className="mr-5 mt-1 cursor-pointer"
              />
            </Tippy>
          </div>
        </div>
      </div>
      <div className="mains">
        <div className="header">
          {(showAdmin || showUser) && (
            <div className="titles mt-2 flex items-center">
              {TitreNavBar}
              {((statusNavBar === 1 && user.grade === "chef") ||
                (statusNavBar === 1 && user.role === "admin")) && (
                <Tippy content="Créer un projet ">
                  <FontAwesomeIcon
                    onClick={createProject}
                    icon={faPlusCircle}
                    className="cursor-pointer ml-5 focus:outline-none iconeResponsive"
                  />
                </Tippy>
              )}
            </div>
          )}

          {(showAdmin || showUser) && (
            <div
              className="description  mt-2"
              dangerouslySetInnerHTML={{ __html: DescrNavBar }}
            ></div>
          )}
        </div>
        <div className="body text-xs">
          {(showAdmin || showUser) && (
            <div className="navBar mt-4">
              {statusNavBar === 1 && (
                <ul className="ulNavBar border-b-2">
                  <li className="mr-5 mt-2 pb-2">
                    <NavLink
                      to={`${entity}/GestionProjet/AllProject`}
                      className={({ isActive }) =>
                        isActive
                          ? "mr-2 border-b-4 border-yellow-500 pb-2 "
                          : "mr-2 pb-2"
                      }
                    >
                      <FontAwesomeIcon icon={faFolderOpen} className="mr-2" />
                      Tous les projets
                    </NavLink>
                  </li>

                  {showAdmin && (
                    <li className="mr-5  mt-2 pb-2">
                      <NavLink
                        to={`${entity}/AddUser`}
                        className={({ isActive }) =>
                          isActive
                            ? "mr-2 border-b-4 border-yellow-500 pb-2 "
                            : "mr-2 pb-2"
                        }
                      >
                        <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                        Ajouter un nouveau employé
                      </NavLink>
                    </li>
                  )}
                </ul>
              )}
              {statusNavBar === 2 && (
                <ul className="ulNavBar border-b-2">
                  <li className="mr-5 mt-2 pb-2">
                    <NavLink
                      to={`${entity}/GestionDevisFactures/services`}
                      className={({ isActive }) =>
                        isActive
                          ? "mr-2 border-b-4 border-yellow-500 pb-2 "
                          : "mr-2 pb-2"
                      }
                    >
                      <FontAwesomeIcon icon={faListOl} className="mr-2" />
                      Services
                    </NavLink>
                  </li>

                  <li className="mr-5  mt-2 pb-2">
                    <NavLink
                      to={`${entity}/GestionDevisFactures/devis`}
                      className={({ isActive }) =>
                        isActive
                          ? "mr-2 border-b-4 border-yellow-500 pb-2 "
                          : "mr-2 pb-2"
                      }
                    >
                      <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                      Devis
                    </NavLink>
                  </li>
                  <li className="mr-5  mt-2 pb-2">
                    <NavLink
                      to={`${entity}/GestionDevisFactures/facture`}
                      className={({ isActive }) =>
                        isActive
                          ? "mr-2 border-b-4 border-yellow-500 pb-2 "
                          : "mr-2 pb-2"
                      }
                    >
                      <FontAwesomeIcon icon={faScroll} className="mr-2" />
                      Facturation
                    </NavLink>
                  </li>
                  {(showAdmin) && (
                    <li className="mr-5  mt-2 pb-2">
                      <NavLink
                        to={`${entity}/GestionDevisFactures/Parametres`}
                        className={({ isActive }) =>
                          isActive
                            ? "mr-2 border-b-4 border-yellow-500 pb-2"
                            : "mr-2 pb-2"
                        }
                      >
                        <FontAwesomeIcon icon={faGear} className="mr-2" />
                        Paramètres
                      </NavLink>
                    </li>
                  )}
                </ul>
              )}
              {statusNavBar === 4 && (
                <ul className="ulNavBar border-b-2">
                  <li className="mr-5  mt-2 pb-2">
                    <NavLink
                      to={`${entity}/GestionClientsFournisseurs/prospect`}
                      className={({ isActive }) =>
                        isActive
                          ? "mr-2 border-b-4 border-yellow-500 pb-2 "
                          : "mr-2 pb-2"
                      }
                    >
                      <FontAwesomeIcon icon={faPersonRays} className="mr-2" />
                      Prospects
                    </NavLink>
                  </li>
                  <li className="mr-5  mt-2 pb-2">
                    <NavLink
                      to={`${entity}/GestionClientsFournisseurs/fornisseurs`}
                      className={({ isActive }) =>
                        isActive
                          ? "mr-2 border-b-4 border-yellow-500 pb-2"
                          : "mr-2 pb-2"
                      }
                    >
                      <FontAwesomeIcon icon={faHistory} className="mr-2" />
                      Fournisseurs
                    </NavLink>
                  </li>
                </ul>
              )}
              
                <ul className="ulNavBar border-b-2">
                {statusNavBar === 5 && (
                  <>
                    <li className="mr-5  mt-2 pb-2">
                      <NavLink
                        to={`${entity}/Settings/entity`}
                        className={({ isActive }) =>
                          isActive
                            ? "mr-2 border-b-4 border-yellow-500 pb-2 "
                            : "mr-2 pb-2"
                        }
                      >
                        <FontAwesomeIcon icon={faPersonRays} className="mr-2" />
                        Paramètres de la société
                      </NavLink>
                    </li>

                    <li className="mr-5  mt-2 pb-2">
                    <NavLink
                      to={`${entity}/Settings/ParametresDevis`}
                      className={({ isActive }) =>
                        isActive
                          ? "mr-2 border-b-4 border-yellow-500 pb-2 "
                          : "mr-2 pb-2"
                      }
                    >
                      <FontAwesomeIcon icon={faPersonRays} className="mr-2" />
                      Paramètres des devis
                    </NavLink>
                    </li>

                    <li className="mr-5  mt-2 pb-2">
                    <NavLink
                      to={`${entity}/Settings/ParametresFacturations`}
                      className={({ isActive }) =>
                        isActive
                          ? "mr-2 border-b-4 border-yellow-500 pb-2 "
                          : "mr-2 pb-2"
                      }
                    >
                      <FontAwesomeIcon icon={faPersonRays} className="mr-2" />
                      Paramètres des facturations
                    </NavLink>
                    </li>

                    <li className="mr-5  mt-2 pb-2">
                      <NavLink
                        to={`${entity}/Settings/MonProfil`}
                        className={({ isActive }) =>
                          isActive
                            ? "mr-2 border-b-4 border-yellow-500 pb-2 "
                            : "mr-2 pb-2"
                        }
                      >
                        <FontAwesomeIcon icon={faPerson} className="mr-2" />
                        Mon Profil
                      </NavLink>
                    </li>
                  </>
                  )}
                </ul>
            </div>
          )}
          <div className="Page mt-5">
            <Routes>
              {(showAdmin || showUser) && (
                <>
                  <Route
                    path=":entity/GestionProjet/AllProject"
                    element={<AllprojectPage />}
                  />
                  {showAdmin && (
                    <Route
                      path=":entity/GestionDevisFactures/Parametres"
                      element={<GestionFacParams />}
                    />
                  )}
                  {showAdmin && (
                    <Route
                      path=":entity/AddUser"
                      element={<GestionUserPage />}
                    />
                  )}
                  {showAdmin && (
                    <Route path=":entity/Settings/entity" element={<InfoSociete />} />
                  )}
                </>
              )}
              <Route path="/gestionEntity" element={<GestionEntity />} />
              <Route path=":entity/GestionDevisFactures/devis" element={<Devis />} />
              <Route path=":entity/GestionDevisFactures/facture" element={<Facture />} />
              <Route path=":entity/GestionClientsFournisseurs/fornisseurs" element={<Fournisseurs />} />
              <Route path=":entity/GestionDevisFactures/services" element={<Services />} />
              <Route path=":entity/GestionClientsFournisseurs/prospect" element={<Prospect />} />
            </Routes>

            <Routes>
              <Route path="/ModifierClient/:id" element={<ModifierClient />} />
              <Route path="/prospect/:id" element={<ProspectDetail />} />
              <Route path="/NavbarClient" element={<NavbarClient />} />
              <Route path="/NouveauDevis/:id" element={<NouveauDevis />} />
              <Route path="/EditProspect/:id" element={<EditProspect />} />
              <Route path="/edit/:id" element={<EditUser />} />
              <Route path="/ProspectDetail/:id" element={<ProspectDetail />} />
            </Routes>

            <Routes>
              <Route path="/ModifierClient/:id" element={<ModifierClient />} />
              <Route path="/NavbarClient" element={<NavbarClient />} />
              <Route path="/NouveauDevis/:id" element={<NouveauDevis />} />
              <Route path=":entity/Settings/MonProfil" element={<MyProfil/>} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}
