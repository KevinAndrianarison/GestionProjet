import "../styles/Modal.css";
import { ShowContext } from "../contexte/useShow";
import { TaskContext } from "../contexte/useTask";
import { useContext, useState, useRef, useEffect } from "react";
import { UrlContext } from "../contexte/useUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProjectContext } from "../contexte/useProject";
import {
  faXmark,
  faBookmark,
  faClock,
  faList,
  faPaperPlane,
  faCaretDown,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { faSquareCheck } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";

export default function ModaleTask() {
  const { setShowModaleTask } = useContext(ShowContext);
  const { url } = useContext(UrlContext);
  const {
    titreTaskModale,
    dateFinModale,
    descriptionModale,
    ListRespModale,
    ListControleModale,
    getOneTaskModal,
    idTask,
    getComsTask,
    ListTaskComs,
  } = useContext(TaskContext);

  const { ListChefs, categorie } = useContext(ProjectContext);

  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [verifyIfChef, setVerifyIfChef] = useState(false);
  const [verifyIfresp, setVerifyIfresp] = useState(false);
  const [checklistName, setChecklistName] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [checklists, setChecklists] = useState([]);
  const checklistRef = useRef();
  const userString = localStorage.getItem("user");
  let user = JSON.parse(userString);

  const handleCloseModal = () => {
    setShowModaleTask(false);
  };
  function addChecklist() {
    setShowChecklistModal(false);
    setChecklists([
      ...checklists,
      {
        name: checklistName,
        elements: [],
        newElement: "",
        showAddElement: false,
      },
    ]);
    setChecklistName("");
  }

  useEffect(() => {
    let idIfChef;
    ListRespModale.forEach((resp) => {
      if (resp.utilisateur.id === user.id) {
        setVerifyIfresp(true);
      }
    });
    ListChefs.forEach((list) => {
      if (
        list.utilisateur.grade === "chef" ||
        list.utilisateur.role === "admin"
      ) {
        idIfChef = list.utilisateur.id;
        if (user.id === idIfChef) {
          setVerifyIfChef(true);
        }
      }
    });
    getComsTask();
  }, []);

  function fetchAddListAndElement() {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    let listeAndElement = checklists;
    setChecklists([]);
    listeAndElement.forEach((list) => {
      let formData = {
        nom: list.name,
        gest_proj_tache_id: idTask,
      };
      axios
        .post(`${url}/api/projets/controle-taches`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          let controleId = response.data.controle.id;
          list.elements.forEach((l) => {
            let formData = {
              nom: l,
              valeur: false,
              gest_proj_controle_tache_id: controleId,
            };
            axios
              .post(`${url}/api/projets/controle-elements`, formData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
              .then((response) => {
                getOneTaskModal(idTask);
              })
              .catch((err) => {
                console.error(err);
              });
          });
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }

  function removeChecklist(index) {
    const updatedChecklists = [...checklists];
    updatedChecklists.splice(index, 1);
    setChecklists(updatedChecklists);
  }

  function removeElementFromChecklist(checklistIndex, elementIndex) {
    const updatedChecklists = [...checklists];
    updatedChecklists[checklistIndex].elements.splice(elementIndex, 1);
    setChecklists(updatedChecklists);
  }

  function handleNewElementChange(index, value) {
    const updatedChecklists = [...checklists];
    updatedChecklists[index].newElement = value;
    setChecklists(updatedChecklists);
  }

  function addElementToChecklist(index, element) {
    if (element.trim() !== "") {
      const updatedChecklists = [...checklists];
      updatedChecklists[index].elements.push(element);
      updatedChecklists[index].newElement = "";
      setChecklists(updatedChecklists);
    }
  }

  function closeModal(e) {
    if (checklistRef.current && !checklistRef.current.contains(e.target)) {
      setShowChecklistModal(false);
    }
  }

  function sendComs() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    let formdata = {
      contenu: commentaire,
      date: formattedDate,
      gest_proj_tache_id: idTask,
    };
    axios
      .post(`${url}/api/projets/taches/commentaires`, formdata, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getComsTask();
        setCommentaire("");
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function setStatusElement(valeur, id, nom) {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    let formdata = {
      valeur: !valeur,
      nom: nom,
    };
    axios
      .put(`${url}/api/projets/controle-elements/${id}`, formdata, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getOneTaskModal(response.data.controle.controle_tache.tache.id);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function deleteElement(id) {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .delete(`${url}/api/projets/controle-elements/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getOneTaskModal(idTask);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function deleteComs(id) {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .delete(`${url}/api/projets/taches/commentaires/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getComsTask();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function deleteList(id) {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .delete(`${url}/api/projets/controle-taches/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getOneTaskModal(idTask);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const handleOutsideClick = (e) => {
    if (e.target.className === "showModal") {
      setShowModaleTask();
    }
  };

  return (
    <div className="showModal" onClick={handleOutsideClick}>
      <div className="formModal p-4 rounded-sm w-[80%]">
        <div
          className=" relative bottom-2 flex justify-end left-2"
          onClick={handleCloseModal}
        >
          <FontAwesomeIcon icon={faXmark} />
        </div>
        <div className="flex">
          <div className="mr-5">
            <FontAwesomeIcon icon={faBookmark} className="text-gray-700 mr-2" />
            {titreTaskModale}
          </div>
          <div className="bg-green-500 text-xs flex items-center px-2 rounded-xl">
            <FontAwesomeIcon icon={faClock} className="mr-2" />
            {dateFinModale}
          </div>
        </div>
        {descriptionModale && (
          <div
            dangerouslySetInnerHTML={{ __html: descriptionModale }}
            className="text-xs border-2 mt-2 rounded p-2"
          ></div>
        )}
        {ListRespModale.length !== 0 && (
          <div className="text-xs bg-gray-200 mt-2 p-1 flex flex-wrap">
            {ListRespModale.map((list) => (
              <li key={list.id} className="flex items-center mr-2 mt-1">
                <div
                  style={{
                    backgroundImage: `url(${url}/storage/${list.utilisateur.photo_profile})`,
                  }}
                  className="w-5 bg-cover bg-center h-5 rounded-3xl mr-1"
                ></div>
                <h1 className="text-blue-500">{list.utilisateur.nom}</h1>
              </li>
            ))}
          </div>
        )}

        {ListControleModale.map((list) => (
          <div key={list.id} className="text-xs mt-2 border-gray-300 p-1 ">
            <div className="flex justify-between">
              <h1 className="font-bold flex items-center">
                <FontAwesomeIcon icon={faList} className="mr-2" />
                {list.nom} :
              </h1>
              {(categorie === "Mes projets" || verifyIfChef) && (
                <FontAwesomeIcon
                  icon={faTrash}
                  className="cursor-pointer text-red-500"
                  onClick={() => deleteList(list.id)}
                />
              )}
            </div>
            <div className="mt-1 flex items-center">
              {list.controle_elements.map((l) => (
                <h1 key={l.id} className="flex mr-4 flex-wrap items-center">
                  <input
                    type="checkbox"
                    disabled={!verifyIfresp}
                    checked={l.valeur === 0 ? false : true}
                    value={l.valeur}
                    className="mr-2"
                    onChange={() => setStatusElement(l.valeur, l.id, l.nom)}
                  />
                  {l.nom}
                  {(categorie === "Mes projets" || verifyIfChef) && (
                    <FontAwesomeIcon
                      icon={faXmark}
                      onClick={() => deleteElement(l.id)}
                      className="text-red-500 ml-2 cursor-pointer"
                    />
                  )}
                </h1>
              ))}
              {list.controle_elements.length === 0 && (
                <div className="text-gray-500">Aucun élement trouvé !</div>
              )}
            </div>
          </div>
        ))}

        {showChecklistModal && (
          <div
            onClick={closeModal}
            className="fixed text-xs inset-0 z-10 bg-black bg-opacity-25 flex justify-center items-center"
          >
            <div
              ref={checklistRef}
              className="bg-white p-6 rounded-lg shadow-lg relative w-96"
            >
              <FontAwesomeIcon
                icon={faXmark}
                className="absolute top-2 right-2 text-gray-500 cursor-pointer w-5 h-5 "
                onClick={() => setShowChecklistModal(false)}
              />
              <h2 className="text-sm font-bold mb-4">
                Ajouter une liste de contrôle
              </h2>
              <input
                type="text"
                placeholder="Nom de la liste de contrôle"
                value={checklistName}
                onChange={(e) => setChecklistName(e.target.value)}
                className="w-full border p-2 rounded-md mb-4 focus:outline-none"
              />
              <button
                disabled={!checklistName}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={addChecklist}
              >
                Valider
              </button>
            </div>
          </div>
        )}
        {checklists.map((checklist, index) => (
          <div key={index} className="mt-4 text-xs">
            <h1 className="input text-black">
              <FontAwesomeIcon icon={faSquareCheck} className="mr-2" />
              {checklist.name}
              <FontAwesomeIcon
                icon={faXmark}
                className="text-red-500 ml-2 cursor-pointer font-bold "
                onClick={() => removeChecklist(index)}
              />
            </h1>

            {checklist.elements.map((el, elIndex) => (
              <div className=" flex mt-2 items-center" key={elIndex}>
                <p className=" flex ml-5 input text-black flex items-center">
                  <FontAwesomeIcon icon={faSquareCheck} className="mr-2" /> {el}
                </p>
                <FontAwesomeIcon
                  icon={faXmark}
                  className="ml-3 text-red-500 cursor-pointer font-bold"
                  onClick={() => removeElementFromChecklist(index, elIndex)}
                />
              </div>
            ))}
            {!checklist.showAddElement && (
              <button
                className=" px-5 py-2 bg-gray-200 mt-2 hover:bg-gray-300 rounded-lg"
                onClick={() => {
                  const updatedChecklists = [...checklists];
                  updatedChecklists[index].showAddElement = true;
                  setChecklists(updatedChecklists);
                }}
              >
                Ajouter un élément
              </button>
            )}
            {checklist.showAddElement && (
              <div className="ml-5 input mt-2 text-black">
                <input
                  className="addElement px-3 -md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                  type="text"
                  placeholder="Ajouter un élément"
                  value={checklist.newElement}
                  onChange={(e) =>
                    handleNewElementChange(index, e.target.value)
                  }
                />
                <div className="flex flex-wrap mt-1 gap-1 w-full">
                  <button
                    className="border bg-yellow-400  px-5 py-1 rounded-lg mr-2"
                    onClick={() =>
                      addElementToChecklist(index, checklist.newElement)
                    }
                  >
                    Ajouter
                  </button>
                  <button
                    className="border bg-blue-400  px-5 py-1 rounded-lg mr-2"
                    onClick={() => fetchAddListAndElement()}
                  >
                    Enregistrer
                  </button>
                  <button
                    className=" px-5 py-1 bg-gray-300 rounded-lg"
                    onClick={() => {
                      const updatedChecklists = [...checklists];
                      updatedChecklists[index].showAddElement = false;
                      updatedChecklists[index].newElement = "";
                      setChecklists(updatedChecklists);
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {(categorie === "Mes projets" || verifyIfChef) && (
          <button
            className=" py-2 text-xs mt-2  input text-black  rounded-lg"
            onClick={() => setShowChecklistModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> Ajouter une liste
            de contrôle
          </button>
        )}

        <div className="flex justify-between flex-wrap">
          <div className="mt-2 w-[300px]">
            <textarea
              className="text-xs px-3 w-full min-h-[50px]  block rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
              placeholder="Ecrire ici..."
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
            ></textarea>
            <div className="flex bottom-5 relative justify-end right-3">
              <FontAwesomeIcon
                icon={faPaperPlane}
                onClick={sendComs}
                className="text-blue-500 w-3 h-3 cursor-pointer"
              />
            </div>
          </div>
          {ListTaskComs.length !== 0 && (
            <div className="w-[500px] p-1">
              <h1 className="font-bold text-sm">
                <FontAwesomeIcon
                  icon={faCaretDown}
                  className="cursor-pointer mr-2"
                />
                Liste des commentaires
              </h1>
              <div className="mt-2 max-h-[300px] overflow-y-auto">
                {ListTaskComs.map((coms) => (
                  <li key={coms.id} className="text-xs flex mt-1">
                    <div
                      style={{
                        backgroundImage: `url(${url}/storage/${coms.utilisateur.photo_profile})`,
                      }}
                      className="w-5 bg-cover bg-center h-5 rounded-3xl  mr-1"
                    ></div>
                    <div className="bg-gray-200 p-2 rounded w-full">
                      <p>{coms.contenu}</p>
                      <div className="flex justify-end">
                        {coms.utilisateur.id === user.id && (
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="cursor-pointer text-red-500"
                            onClick={() => deleteComs(coms.id)}
                          />
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
