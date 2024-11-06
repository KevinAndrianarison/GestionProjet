import "../styles/MyprojectPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ShowContext } from "../contexte/useShow";
import { useContext, useEffect, useState } from "react";
import { TaskContext } from "../contexte/useTask";
import { ComsContext } from "../contexte/useComs";
import { faAnglesRight, faSort } from "@fortawesome/free-solid-svg-icons";
import { ProjectContext } from "../contexte/useProject";

export default function AllprojectPage() {
  const [activeDropdown, setActiveDropdown] = useState("");

  const { showAdmin, showUser, setShowSpinner } = useContext(ShowContext);
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
  } = useContext(ProjectContext);

  const { getAllTaskFirst } = useContext(TaskContext);
  const { getAllComs } = useContext(ComsContext);

  useEffect(() => {
    if (categorie === "Tous les projets") {
      setShowSpinner(true);
      getAllproject();
    }
    if (categorie === "Mes projets") {
      setShowSpinner(true);

      getProjectWhenChef();
    }
    if (categorie === "Les projets dont je fait partie") {
      setShowSpinner(true);
      getProjectWhenMembres();
    }
  }, [categorie]);

  useEffect(() => {
    if (showAdmin) {
      setCategorie("Tous les projets");
      setShowSpinner(true);
      getAllproject();
    }
    if (showUser) {
      setCategorie("Mes projets");
      setShowSpinner(true);
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
            </select>
          </div>
        </div>
        <div className="contentMyproject   mt-2">
          <div className="headMyProject">
            <li className="pl-5 Titres">Titre</li>
            <li className="Priorite mr-3">Description</li>
          </div>
          {ListeProject.length !== 0 && (
            <div className="LISTES">
              {ListeProject.map((list, index) => (
                <div
                  key={list.id}
                  className="BodyProject "
                  onClick={() => {
                    setListChefAndMembres([...list.chefs, ...list.membres]);
                    setIdProject(list.id);
                    getOneProjet(list.id);
                    getAllTaskFirst(list.id);
                    getAllComs(list.id);
                  }}
                >
                  <li className="pl-5 Titres">{list.nom}</li>

                  <li
                    className="Priorite  mr-2"
                    dangerouslySetInnerHTML={{ __html: list.description }}
                  ></li>
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
                    setListChefAndMembres([...list.chefs, ...list.membres]);
                    setIdProject(list.id);
                    getOneProjet(list.id);
                    getAllTaskFirst(list.id);
                    getAllComs(list.id);
                  }}
                >
                  <li className="pl-5 Titres">{list.titre}</li>
                  <li
                    className="Priorite"
                    dangerouslySetInnerHTML={{ __html: list.description }}
                  ></li>
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
                    setListChefAndMembres([...list.chefs, ...list.membres]);
                    setIdProject(list.id);
                    getOneProjet(list.id);
                    getAllTaskFirst(list.id);
                    getAllComs(list.id);
                  }}
                >
                  <li className="pl-5 Titres">{list.titre}</li>
                  <li
                    className="Priorite"
                    dangerouslySetInnerHTML={{ __html: list.description }}
                  ></li>
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
      </div>
    </>
  );
}
