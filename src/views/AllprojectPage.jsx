import "../styles/MyprojectPage.css";
import { ShowContext } from "../contexte/useShow";
import { useContext, useEffect, useState, useRef } from "react";
import { TaskContext } from "../contexte/useTask";
import { ComsContext } from "../contexte/useComs";
import { EtapeContext } from "../contexte/useEtape";
import { UrlContext } from "../contexte/useUrl";
import { MessageContext } from "../contexte/useMessage";
import axios from "axios";
import {
  faAnglesRight,
  faSort,
  faPlusCircle,
  faFolderPlus,
  faToolbox,
  faXmark,
  faTags,
  faTrash,
  faSliders,
  faListUl,
} from "@fortawesome/free-solid-svg-icons";
import { ProjectContext } from "../contexte/useProject";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function AllprojectPage() {
  const [activeDropdown, setActiveDropdown] = useState("");
  const [position, setPosition] = useState("bottom");

  const { setShowcreateTask } = useContext(ShowContext);
  const { url } = useContext(UrlContext);
  const { setMessageSucces, setMessageError } = useContext(MessageContext);

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
    getAllCtg,
    ListeCtg,
    getAllRess,
    ListeRess,
    setListeProjectWhenChef,
    setListeProjectWhenMembres,
    setListeProjectWhenResp,
    setListeProject,
  } = useContext(ProjectContext);
  const { getAllTaskFirst } = useContext(TaskContext);
  const { getAllComs } = useContext(ComsContext);
  const { getAlletapeByProjetsFirst } = useContext(EtapeContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nomRess, setNomRess] = useState("");
  const [idCtg, setIdCtg] = useState("");

  const [nomCateg, setNomCateg] = useState("");
  const modalRef = useRef(null);

  const userString = localStorage.getItem("user");
  let user = JSON.parse(userString);

  const toggleModal = () => {
    setShowcreateTask(false);
    setIsModalOpen((prev) => !prev);
  };

  function createProject() {
    setIsModalOpen(false);
    setShowcreateTask(true);
  }

  function postCTG() {
    let formData = {
      valeur: nomCateg,
    };
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .post(`${url}/api/projets/categorie-materielles`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getAllCtg();
        setMessageSucces(response.data.message);
        setNomCateg("");
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

  function postRess() {
    let idctg = ListeCtg[0].id;
    let formData = {
      valeur: nomRess,
      gest_proj_materielle_categorie_id: idCtg || idctg,
    };
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .post(`${url}/api/projets/materielles`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getAllRess();
        setMessageSucces(response.data.message);
        setNomRess("");
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

  function deleteCtg(id) {
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .delete(`${url}/api/projets/categorie-materielles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getAllCtg();
        getAllRess();
        setMessageSucces(response.data.message);
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

  function deleteRess(id) {
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .delete(`${url}/api/projets/materielles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getAllRess();
        setMessageSucces(response.data.message);
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
    getAllRess();
    getAllCtg();
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
            {(user.grade === "chef" || user.role === "admin") && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <FontAwesomeIcon
                    variant="outline"
                    icon={faPlusCircle}
                    className="cursor-pointer ml-5 focus:outline-none"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuRadioGroup
                    value={position}
                    onValueChange={setPosition}
                    className="text-xs "
                  >
                    <h1
                      onClick={createProject}
                      className="hover:bg-yellow-500 hover:font-bold p-2 rounded cursor-pointer"
                    >
                      {" "}
                      <FontAwesomeIcon
                        variant="outline"
                        icon={faFolderPlus}
                        className="cursor-pointer mr-2 text-gray-500 focus:outline-none"
                      />
                      Créer un projet
                    </h1>
                    <h1
                      onClick={toggleModal}
                      className="hover:bg-yellow-500 hover:font-bold p-2 rounded cursor-pointer flex items-first"
                    >
                      <FontAwesomeIcon
                        variant="outline"
                        icon={faToolbox}
                        className="cursor-pointer mr-2 text-gray-500 focus:outline-none"
                      />
                      Gérer les ressources matérielles{" "}
                    </h1>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </h1>
          {isModalOpen && (
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            >
              <div className="bg-white w-[500px] rounded-sm shadow-lg p-6 relative">
                <button
                  onClick={toggleModal}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={faXmark} size="lg" />
                </button>
                <h2 className="text-sm font-bold mb-4">
                  <FontAwesomeIcon
                    variant="outline"
                    icon={faToolbox}
                    className="cursor-pointer mr-2 text-gray-500 focus:outline-none"
                  />{" "}
                  Créer des ressources matérielles
                </h2>
                <div className="flex justify-between items-center">
                  <div className="w-[45%]">
                    <label>Nom de la ressource :</label>
                    <input
                      type="text"
                      value={nomRess}
                      onChange={(e) => setNomRess(e.target.value)}
                      className="mt-2 w-full input pl-3 pr-3 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                    />
                  </div>
                  <div className="w-[45%]">
                    <label>Choisissez une catégorie :</label>
                    <div className="flex items-center">
                      <select
                        value={idCtg}
                        onChange={(e) => setIdCtg(e.target.value)}
                        className="input pl-3 mt-2 mr-1 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                      >
                        {ListeCtg.map((list) => (
                          <option value={list.id} key={list.id}>
                            {list.valeur}
                          </option>
                        ))}
                        {ListeCtg.length === 0 && (
                          <option disabled>Aucune catégorie trouvé</option>
                        )}
                      </select>
                      <Sheet>
                        <Tippy content="Gérer les catégories">
                          <SheetTrigger asChild>
                            <FontAwesomeIcon
                              variant="outline"
                              icon={faTags}
                              className="w-5 mt-2 text-yellow-500 focus:outline-none cursor-pointer"
                            />
                          </SheetTrigger>
                        </Tippy>

                        <SheetContent onClick={(e) => e.stopPropagation()}>
                          <SheetTitle className="text-sm">
                            <FontAwesomeIcon
                              variant="outline"
                              icon={faTags}
                              className="cursor-pointer mr-2 focus:outline-none"
                            />{" "}
                            Créer une nouvelle catégorie
                          </SheetTitle>
                          <div className="mt-5">
                            <input
                              type="text"
                              value={nomCateg}
                              onChange={(e) => setNomCateg(e.target.value)}
                              placeholder="Nom de la catégorie"
                              className="mt-2 w-full input pl-3 text-xs pr-3 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                            />
                            <button
                              onClick={postCTG}
                              disabled={!nomCateg}
                              className="text-xs bg-yellow-500 py-2 w-full font-bold rounded mt-2"
                            >
                              Ajouter
                            </button>
                          </div>
                          <div className="mt-5">
                            <h1 className="font-bold text-sm">
                              <FontAwesomeIcon
                                variant="outline"
                                icon={faListUl}
                                className="cursor-pointer mr-2 focus:outline-none"
                              />{" "}
                              Liste des catégories :
                            </h1>
                            <div className="mt-2 text-xs">
                              {ListeCtg.map((list) => (
                                <div key={list.id} className="flex border p-2">
                                  <h1 className="w-[95%] ">{list.valeur}</h1>
                                  <FontAwesomeIcon
                                    variant="outline"
                                    icon={faTrash}
                                    onClick={() => deleteCtg(list.id)}
                                    className="cursor-pointer text-red-500 focus:outline-none"
                                  />{" "}
                                </div>
                              ))}
                              {ListeCtg.length === 0 && (
                                <p className="text-center mt-2 text-gray-500">
                                  Aucune catégorie trouvé
                                </p>
                              )}
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                  </div>
                </div>
                <button
                  onClick={postRess}
                  disabled={!nomRess}
                  className="bg-blue-500 w-full py-2 rounded text-white mt-4"
                >
                  Valider
                </button>
                <div className="mt-4 ">
                  <h1 className="font-bold text-sm">
                    <FontAwesomeIcon
                      variant="outline"
                      icon={faListUl}
                      className="cursor-pointer mr-2 focus:outline-none"
                    />{" "}
                    Liste des ressources matérielles :{" "}
                  </h1>
                  <div className="mt-2 max-h-[300px] overflow-y-auto">
                    {ListeRess.map((list) => (
                      <div key={list.id} className="flex border p-2">
                        <h1 className="w-[95%] ">{list.valeur}</h1>
                        <FontAwesomeIcon
                          variant="outline"
                          icon={faTrash}
                          onClick={() => deleteRess(list.id)}
                          className="cursor-pointer text-red-500 focus:outline-none"
                        />{" "}
                      </div>
                    ))}
                    {ListeRess.length === 0 && (
                      <p className="text-gray-500 text-center mt-2">
                        Aucune ressource trouvé
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

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
          <div className="contentMyproject border-blue-100 rounded  mt-2">
            <div className="headMyProject border-blue-100  bg-blue-100">
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
                    className="BodyProject border-blue-100 "
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
                    className="BodyProject  border-blue-100"
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
                    className="BodyProject  border-blue-100"
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
                    className="BodyProject  border-blue-100"
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
