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
} from "@fortawesome/free-solid-svg-icons";
import AllprojectPage from "./AllprojectPage";
import Devis from "../DevisFacure/views/Devis";
import Facture from "../DevisFacure/views/Facture";
import Historique from "../DevisFacure/views/Historique";
import Prospect from "../DevisFacure/views/Prospect";
import Services from "../DevisFacure/views/Services";
import GestionUserPage from "./GestionUserPage";
import { GestionEntity } from "./GestionEntity";
import MyProfil from "./MyProfil";
import { Routes, Route, NavLink } from "react-router-dom";
import { ShowContext } from "../contexte/useShow";
import { useContext, useState } from "react";
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

  function createProject() {
    setShowcreateTask(true);
  }

  function switchToGestProj() {
    navigate(`${entity}/AllProject`);
    setDescrNavBar(
      "Bienvenue sur votre espace de gestion de projet, où chaque tâche trouve sa <b>solution</b> et chaque équipe atteint ses <b> objectifs</b> !"
    );
    setTitreNavBar("Gestion de projet");
    setStatusNavBar(1);
  }

  function switchToGestDevis() {
    navigate(`${entity}/services`);
    setDescrNavBar(
      " Bienvenue dans votre espace de gestion de devis et factures, où chaque transaction est <b>simplifiée</b> et chaque détail est <b>maîtrisé</b> ! "
    );
    setTitreNavBar("Gestion de devis-facture");
    setStatusNavBar(2);
  }

  function switchToGestRH() {
    navigate(`${entity}/`);
    setDescrNavBar(
      " Bienvenue dans votre espace RH, pour une gestion simple et <b>efficace<b> de votre équipe !  "
    );
    setTitreNavBar("Gestion RH");
    setStatusNavBar(3);
  }

  return (
    <div className="mains">
      <div className="header">
        <div className="flex justify-between w-full border-b-4 border-blue-500 py-1 flex-wrap">
          <div className="flex items-center">
            <div
              className="logos w-24 h-20 cursor-pointer"
              onClick={() => navigate(`${entity}/AllProject`)}
            ></div>
            <p className="title">Softiceo</p>
          </div>
          <div className="input cursor-pointer text-gray-500 flex flex-wrap items-center">
            <div
              onClick={switchToGestProj}
              className={
                statusNavBar === 1
                  ? "bg-blue-100 text-blue-500 mr-10 rounded px-3 py-2"
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
                  ? "bg-blue-100 text-blue-500 mr-10 rounded px-3 py-2"
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
                  ? "bg-blue-100 text-blue-500 mr-10 rounded px-3 py-2"
                  : "mr-10  px-3 py-2 rounded-lg hover:bg-blue-100 hover:text-blue-500"
              }
            >
              <FontAwesomeIcon icon={faUsersGear} className="mr-2 " /> Gestion
              RH
            </div>
          </div>
          <div className=" flex items-center text-gray-700">
            {(showAdmin || showUser) && (
              <>
                <div className="flex mr-5 items-center">
                  <div
                    style={{
                      backgroundImage: `url(${url}/storage/${user.photo_profil})`,
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
                <Tippy content="Créer un projet ">
                  <FontAwesomeIcon
                    onClick={createProject}
                    icon={faPlusCircle}
                    className="mr-5 focus:outline-none iconeResponsive"
                  />
                </Tippy>
                <FontAwesomeIcon
                  onClick={logout}
                  icon={faSignOutAlt}
                  className="mr-5 iconeResponsive"
                />
              </>
            )}
          </div>
        </div>

        <div className="titles mt-2">{TitreNavBar}</div>
        {(showAdmin || showUser) && (
          <div
            className="description  mt-2"
            dangerouslySetInnerHTML={{ __html: DescrNavBar }}
          ></div>
        )}
      </div>
      <div className="body">
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
          </div>
        )}
        <div className="Page mt-5">
          <Routes>
            {(showAdmin || showUser) && (
              <>
                <Route path=":entity/AllProject" element={<AllprojectPage />} />
                {showAdmin && (
                  <Route path=":entity/AddUser" element={<GestionUserPage />} />
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
    </div>
  );
}
