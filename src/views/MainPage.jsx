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
} from "@fortawesome/free-solid-svg-icons";
import AllprojectPage from "./AllprojectPage";
import Devis from "../DevisFacure/views/Devis";
import Facture from "../DevisFacure/views/Facture";
import ModifierClient from "../DevisFacure/views/ModifierClient";
import NavbarClient from "../DevisFacure/views/NavbarClient";
import NouveauDevis from "../DevisFacure/views/NouveauDevis";
import Historique from "../DevisFacure/views/Historique";
import ProspectDetail from "../DevisFacure/views/Prospect";
import EditProspect from "../DevisFacure/views/Prospect";
import EditUser from "../DevisFacure/views/ModifierClient";
import Prospect from "../DevisFacure/views/Prospect";
import Services from "../DevisFacure/views/Services";
import GestionUserPage from "./GestionUserPage";
import { GestionEntity } from "./GestionEntity";
import MyProfil from "./MyProfil";
import { Routes, Route, NavLink } from "react-router-dom";
import { ShowContext } from "../contexte/useShow";
import { useContext, useEffect, useState } from "react";
import Tippy from "@tippyjs/react";
import { useNavigate } from "react-router-dom";
import { UrlContext } from "../contexte/useUrl";
import Iconsofticeo from "../images/Iconsofticeo.png";
import logosofticeo from "../images/logosofticeo.png";

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
  }, []);

  function createProject() {
    setShowcreateTask(true);
  }

  function switchToGestProj() {
    localStorage.setItem("navBar", JSON.stringify("Gestion de projet"));
    navigate(`${entity}/AllProject`);
    setDescrNavBar(
      "Bienvenue sur votre espace de gestion de projet, où chaque tâche trouve sa <b>solution</b> et chaque équipe atteint ses <b> objectifs</b> !"
    );
    setTitreNavBar("Gestion de projet");
    setStatusNavBar(1);
  }

  function switchToGestDevis() {
    localStorage.setItem("navBar", JSON.stringify("Gestion de devis-facture"));
    navigate(`${entity}/services`);
    setDescrNavBar(
      " Bienvenue dans votre espace de gestion de devis et factures, où chaque transaction est <b>simplifiée</b> et chaque détail est <b>maîtrisé</b> ! "
    );
    setTitreNavBar("Gestion de devis-facture");
    setStatusNavBar(2);
  }

  function switchToGestClient() {
    localStorage.setItem("navBar", JSON.stringify("Gestion client"));
    navigate(`${entity}/prospect`);
    setDescrNavBar(
      "Bienvenue dans votre espace Client, pour une gestion simple et <b>optimisée</b> de vos relations clients !"
    );
    setTitreNavBar("Gestion client");
    setStatusNavBar(4);
  }

  function switchToGestRH() {
    localStorage.setItem("navBar", JSON.stringify("Gestion RH"));
    navigate(`${entity}/`);
    setDescrNavBar(
      " Bienvenue dans votre espace RH, pour une gestion simple et <b>efficace<b> de votre équipe !  "
    );
    setTitreNavBar("Gestion RH");
    setStatusNavBar(3);
  }

  return (
    <>
      <div className="flex justify-between w-full border-b-4 border-blue-500 py-0 flex-wrap">
        <div className="flex items-center cursor-pointer" onClick={() => navigate(`${entity}/AllProject`)}>
          <div className="w-20 block xl:hidden pl-4">
            <img src={Iconsofticeo} alt="Sofiticeo" />
          </div>
          <div className="w-40 hidden xl:block pl-4">
            <img src={logosofticeo} alt="Sofiticeo" />
          </div>
        </div>
        {(showAdmin || showUser) && (
          <div
          className="input text-xs cursor-pointer text-gray-500 flex flex-wrap items-center hidden xl:flex"
        >
          {/* Gestion de projet */}
          <div
            onClick={switchToGestProj}
              className={`relative flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
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
                Gestion de projet
              </span>
            </div>
          
            {/* Gestion de devis-facture */}
            <div
              onClick={switchToGestDevis}
              className={`relative flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
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
                Gestion de devis-facture
              </span>
            </div>
          
            {/* Gestion RH */}
            <div
              onClick={switchToGestRH}
              className={`relative flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
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
                Gestion RH
              </span>
            </div>
          
            {/* Gestion client */}
            <div
              onClick={switchToGestClient}
              className={`relative flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
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
                Gestion client
              </span>
            </div>
          </div>
        
        )}

        <div className="text-xs flex items-center text-gray-700">
          {(showAdmin || showUser) && (
            <>
              <div className="flex mr-5 items-center">
                <div
                  style={{
                    backgroundImage: `url(${url}/storage/${user.photo_profile})`,
                  }}
                  className="mr-1 bg-cover bg-center rounded-3xl w-14 h-12"
                ></div>
                <p className="input text-black font-bold">{user.nom}</p>
              </div>
              <NavLink to={`${entity}/Settings`}>
                <Tippy content="Paramètres">
                  <FontAwesomeIcon
                    icon={faGear}
                    className="mr-5 mt-1 focus:outline-none iconeResponsive"
                  />
                </Tippy>
              </NavLink>
            </>
          )}
          <FontAwesomeIcon
            onClick={logout}
            icon={faSignOutAlt}
            className="mr-5 iconeResponsive"
          />
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
                      to={`${entity}/AllProject`}
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
                      to={`${entity}/services`}
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
                      to={`${entity}/devis`}
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
                      to={`${entity}/facture`}
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
                  <li className="mr-5  mt-2 pb-2">
                    <NavLink
                      to={`${entity}/historique`}
                      className={({ isActive }) =>
                        isActive
                          ? "mr-2 border-b-4 border-yellow-500 pb-2"
                          : "mr-2 pb-2"
                      }
                    >
                      <FontAwesomeIcon icon={faHistory} className="mr-2" />
                      Historiques
                    </NavLink>
                  </li>
                </ul>
              )}
              {statusNavBar === 4 && (
                <ul className="ulNavBar border-b-2">
                  <li className="mr-5  mt-2 pb-2">
                    <NavLink
                      to={`${entity}/prospect`}
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
                </ul>
              )}
            </div>
          )}
          <div className="Page mt-5">
            <Routes>
              {(showAdmin || showUser) && (
                <>
                  <Route
                    path=":entity/AllProject"
                    element={<AllprojectPage />}
                  />
                  {showAdmin && (
                    <Route
                      path=":entity/AddUser"
                      element={<GestionUserPage />}
                    />
                  )}
                  <Route path=":entity/Settings" element={<MyProfil />} />
                </>
              )}
              <Route path="/gestionEntity" element={<GestionEntity />} />
              <Route path=":entity/devis" element={<Devis />} />
              <Route path=":entity/facture" element={<Facture />} />
              <Route path=":entity/historique" element={<Historique />} />
              <Route path=":entity/services" element={<Services />} />
              <Route path=":entity/prospect" element={<Prospect />} />
            </Routes>
          </div>
        </div>
        <div className="Page mt-5">
          <Routes>
            <Route path="/ModifierClient/:id" element={<ModifierClient />} />
            <Route path="/prospect/:id" element={<ProspectDetail />} />
            <Route path="/NavbarClient" element={<NavbarClient />} />
            <Route path="/NouveauDevis/:id" element={<NouveauDevis />} />
            <Route path="/EditProspect/:id" element={<EditProspect />} />
            <Route path="/edit/:id" element={<EditUser />} />
            <Route path="/ProspectDetail/:id" element={<ProspectDetail />} />
          </Routes>
        </div>
      </div>

      <div className="Page mt-5">
        <Routes>
          <Route path="/ModifierClient/:id" element={<ModifierClient />} />
          <Route path="/NavbarClient" element={<NavbarClient />} />
          <Route path="/NouveauDevis/:id" element={<NouveauDevis />} />
        </Routes>
      </div>
    </>
  );
}
