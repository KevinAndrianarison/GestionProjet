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
      <div className="flex justify-between w-full border-b-4 border-blue-500 py-1 flex-wrap">
        <div className="flex items-center">
          <div
            className="logos w-20 h-16 cursor-pointer"
            onClick={() => navigate(`${entity}/AllProject`)}
          ></div>
          <p className="title">Softiceo</p>
        </div>
        {(showAdmin || showUser) && (
          <div className="mb-1 input text-xs cursor-pointer text-gray-500 flex flex-wrap items-center">
            <div
              onClick={switchToGestProj}
              className={
                statusNavBar === 1
                  ? "ml-2 bg-blue-100 text-blue-500 mr-10 rounded px-3 py-2"
                  : "mr-10  px-3 py-2 rounded-lg hover:bg-blue-100 hover:text-blue-500"
              }
            >
              <FontAwesomeIcon icon={faDiagramProject} className="mr-2 " />{" "}
              Gestion de projet
            </div>
            <div
              onClick={switchToGestDevis}
              className={
                statusNavBar === 2
                  ? "ml-2 bg-blue-100 text-blue-500 mr-10 rounded px-3 py-2"
                  : "mr-10  px-3 py-2 rounded-lg hover:bg-blue-100 hover:text-blue-500"
              }
            >
              <FontAwesomeIcon icon={faReceipt} className="mr-2 " /> Gestion de
              devis-facture
            </div>
            <div
              onClick={switchToGestRH}
              className={
                statusNavBar === 3
                  ? "ml-2 bg-blue-100 text-blue-500 mr-10 rounded px-3 py-2"
                  : "mr-10  px-3 py-2 rounded-lg hover:bg-blue-100 hover:text-blue-500"
              }
            >
              <FontAwesomeIcon icon={faUsersGear} className="mr-2 " /> Gestion
              RH
            </div>
            <div
              onClick={switchToGestClient}
              className={
                statusNavBar === 4
                  ? "ml-2 bg-blue-100 text-blue-500 mr-10 rounded px-3 py-2"
                  : "mr-10  px-3 py-2 rounded-lg hover:bg-blue-100 hover:text-blue-500"
              }
            >
              <FontAwesomeIcon icon={faStar} className="mr-2 " /> Gestion client
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
