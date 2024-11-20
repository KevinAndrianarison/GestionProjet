import "../styles/MyprojectPage.css";
import { ShowContext } from "../contexte/useShow";
import { useContext, useEffect, useState } from "react";
import { TaskContext } from "../contexte/useTask";
import { ComsContext } from "../contexte/useComs";
import { EtapeContext } from "../contexte/useEtape";
import { faAnglesRight, faSort } from "@fortawesome/free-solid-svg-icons";
import { ProjectContext } from "../contexte/useProject";
import { faTrash, faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AllprojectPage() {
  const [activeDropdown, setActiveDropdown] = useState("");

  const {
    showAdmin,
    showUser,
    setShowSpinner,
    setShowDeleteTask,
    showListProjet,
    setShowListProjet,
  } = useContext(ShowContext);
  const {
    getAllproject,
    setIdProject,
    ListeProject,
    getProjectWhenChef,
    ListeProjectWhenChef,
    getProjectWhenMembres,
    ListeProjectWhenMembres,
    setListChefAndMembres,
    categorie,
    setCategorie,
    getOneProjet,
    getProjectWhenResp,
    ListeProjectWhenResp,
  } = useContext(ProjectContext);
  const { getAllTaskFirst } = useContext(TaskContext);
  const { getAllComs } = useContext(ComsContext);
  const { getAlletapeByProjetsFirst } = useContext(EtapeContext);

  useEffect(() => {
    if (categorie === "Tous les projets") {
      setShowListProjet(false);
      getAllproject();
    }
    if (categorie === "Mes projets") {
      setShowListProjet(false);
      getProjectWhenChef();
    }
    if (categorie === "Les projets dont je fait partie") {
      setShowListProjet(false);
      getProjectWhenMembres();
    }
    if (categorie === "Responsable hierarchique") {
      setShowListProjet(false);
      getProjectWhenResp();
    }
  }, [categorie]);

  useEffect(() => {
    if (showAdmin) {
      setCategorie("Tous les projets");
      setShowListProjet(false);
      getAllproject();
    }
    if (showUser) {
      setCategorie("Mes projets");
      setShowListProjet(false);
      getProjectWhenChef();
    }
  }, []);

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  return (
    <>
      <div className="myprojectPage pb-5" onClick={closeDropdown}>
        <div>
          <h1 className="titreMyproject mr-5">
            <FontAwesomeIcon icon={faAnglesRight} className="w-6 h-4" />
            Les projets
          </h1>
          <div className="flex flex-wrap items-end mt-2">
            <h1 className="mr-5 font-bold">
              {" "}
              <FontAwesomeIcon icon={faSort} className="w-8 h-5" />
              Trier par :
            </h1>
            <select
              value={categorie}
              onChange={(e) => {
                setCategorie(e.target.value);
              }}
              className="input pl-3 w-52 pr-3 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
            >
              {showAdmin && (
                <option value="Tous les projets">📁 Tous les projets</option>
              )}
              <option value="Mes projets">📁 Mes projets</option>
              <option value="Les projets dont je fait partie">
                📁 Les projets dont je fait partie
              </option>
              <option value="Responsable hierarchique">
                📁 Responsable hierarchique
              </option>
            </select>
          </div>
        </div>
        {!showListProjet && (
          <div className="contentMyproject  border-0 mt-2">
            <div className="flex flex-col space-y-3">
              <Skeleton className="bg-gray-100 h-10 w-[90%] rounded" />
              <div className="space-y-3">
                <Skeleton className="bg-gray-100 h-5 w-[90%]" />
                <Skeleton className="h-4 w-[75%]" />
                <Skeleton className=" h-4 w-[50%]" />
              </div>
            </div>
          </div>
        )}

        {showListProjet && (
          <div className="contentMyproject   mt-2">
            <div className="headMyProject">
              <li className="pl-5 Titres ">Titre</li>
              <li className="Priorite pl-3">Description</li>
              <li className="w-5"></li>
              <li className="w-5"></li>
            </div>
            {ListeProject.length !== 0 && (
              <div className="LISTES ">
                {ListeProject.map((list, index) => (
                  <div
                    key={list.id}
                    className="BodyProject "
                    onClick={() => {
                      setListChefAndMembres(list.utilisateur_roles.chefs);
                      setIdProject(list.id);
                      setShowSpinner(true);
                      getOneProjet(list.id);
                      getAlletapeByProjetsFirst(list.id);
                      getAllComs(list.id);
                    }}
                  >
                    <li className="pl-5 text-xs Titres truncate">{list.nom}</li>

                    <li
                      className="Priorite  mr-2 pl-3 truncate"
                      dangerouslySetInnerHTML={{ __html: list.description }}
                    ></li>
                    <li>
                      <Tippy content="Modifier">
                        <FontAwesomeIcon
                          icon={faSliders}
                          className="text-gray-600 w-5 focus:outline-none hidden"
                        />
                      </Tippy>
                    </li>
                    <li
                      className="w-5"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIdProject(list.id);
                        setShowDeleteTask(true);
                      }}
                    >
                      <Tippy content="Supprimer">
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="text-red-500 focus:outline-none"
                        />
                      </Tippy>
                    </li>
                  </div>
                ))}
              </div>
            )}
            {ListeProjectWhenChef.length !== 0 && (
              <div className="LISTES">
                {ListeProjectWhenChef.map((list, index) => (
                  <div
                    key={list.id}
                    className="BodyProject"
                    onClick={() => {
                      setListChefAndMembres(list.utilisateur_roles.chefs);
                      setIdProject(list.id);
                      setShowSpinner(true);
                      getOneProjet(list.id);
                      getAlletapeByProjetsFirst(list.id);
                      getAllComs(list.id);
                    }}
                  >
                    <li className="pl-5 Titres truncate">{list.nom}</li>
                    <li
                      className="Priorite  mr-2 pl-3 truncate"
                      dangerouslySetInnerHTML={{ __html: list.description }}
                    ></li>
                    <li>
                      <Tippy content="Modifier">
                        <FontAwesomeIcon
                          icon={faSliders}
                          className="text-gray-600 w-5 focus:outline-none hidden"
                        />
                      </Tippy>
                    </li>
                    <li
                      className="w-5"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIdProject(list.id);
                        setShowDeleteTask(true);
                      }}
                    >
                      <Tippy content="Supprimer">
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="text-red-500 focus:outline-none"
                        />
                      </Tippy>
                    </li>
                  </div>
                ))}
              </div>
            )}
            {ListeProjectWhenMembres.length !== 0 && (
              <div className="LISTES">
                {ListeProjectWhenMembres.map((list, index) => (
                  <div
                    key={list.id}
                    className="BodyProject"
                    onClick={() => {
                      setListChefAndMembres(list.utilisateur_roles.chefs);
                      setIdProject(list.id);
                      setShowSpinner(true);
                      getOneProjet(list.id);
                      getAlletapeByProjetsFirst(list.id);
                      getAllComs(list.id);
                    }}
                  >
                    <li className="pl-5 Titres truncate">{list.nom}</li>
                    <li
                      className="Priorite  mr-2 pl-3 truncate"
                      dangerouslySetInnerHTML={{ __html: list.description }}
                    ></li>
                    <li>
                      <Tippy content="Modifier">
                        <FontAwesomeIcon
                          icon={faSliders}
                          className="text-gray-600 w-5 focus:outline-none hidden"
                        />
                      </Tippy>
                    </li>
                    <li
                      className="w-5"
                      onClick={() => {
                        setIdProject(list.id);
                        setShowDeleteTask(true);
                      }}
                    >
                      <Tippy content="Supprimer">
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="text-red-500 focus:outline-none"
                        />
                      </Tippy>
                    </li>
                  </div>
                ))}
              </div>
            )}
            {ListeProjectWhenResp.length !== 0 && (
              <div className="LISTES">
                {ListeProjectWhenResp.map((list, index) => (
                  <div
                    key={list.id}
                    className="BodyProject"
                    onClick={() => {
                      setListChefAndMembres(list.utilisateur_roles.chefs);
                      setIdProject(list.id);
                      setShowSpinner(true);
                      getOneProjet(list.id);
                      getAlletapeByProjetsFirst(list.id);
                      getAllComs(list.id);
                    }}
                  >
                    <li className="pl-5 Titres truncate">{list.nom}</li>
                    <li
                      className="Priorite  mr-2 pl-3 truncate"
                      dangerouslySetInnerHTML={{ __html: list.description }}
                    ></li>
                    <li>
                      <Tippy content="Modifier">
                        <FontAwesomeIcon
                          icon={faSliders}
                          className="text-gray-600 w-5 focus:outline-none hidden"
                        />
                      </Tippy>
                    </li>
                    <li
                      className="w-5"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIdProject(list.id);
                        setShowDeleteTask(true);
                      }}
                    >
                      <Tippy content="Supprimer">
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="text-red-500 focus:outline-none"
                        />
                      </Tippy>
                    </li>
                  </div>
                ))}
              </div>
            )}
            {ListeProjectWhenMembres.length === 0 &&
              ListeProjectWhenChef.length === 0 &&
              ListeProject.length === 0 && (
                <div className="emptyContent h-[85%]">
                  <div className="w-40 h-40 empty"></div>
                </div>
              )}
          </div>
        )}
      </div>
    </>
  );
}
