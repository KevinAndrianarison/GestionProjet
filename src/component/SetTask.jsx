import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faXmark,
  faClock,
  faPlus,
  faTrash,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useRef, useState } from "react";
import { ProjectContext } from "../contexte/useProject";
import { TaskContext } from "../contexte/useTask";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { UrlContext } from "../contexte/useUrl";
import { MessageContext } from "../contexte/useMessage";
import { ShowContext } from "../contexte/useShow";
import "../styles/SetProject.css";
import Tippy from "@tippyjs/react";

export default function SetTask() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [formDATA, setformDATA] = useState({});
  const [idValue, setidValue] = useState("");
  const [idValuePOST, setidValuePOST] = useState("");

  const editorRef = useRef("");

  useEffect(() => {
    setSelectedMember(responsable);
    getAllChamps();
  }, []);

  const { ListChefs, idProject } = useContext(ProjectContext);

  const {
    titreTask,
    dateDebut,
    dateFin,
    description,
    setTitreTask,
    setDateFin,
    idTask,
    getOneTask,
    getAllTask,
    responsable,
    ListResp,
    getAllChamps,
    ListChamps,
    setListChamps,
    ListChampsWithoutValue,
  } = useContext(TaskContext);

  const { setMessageSucces, setMessageError } = useContext(MessageContext);
  const { url } = useContext(UrlContext);
  const { setShowSpinner, setShowSetTask } = useContext(ShowContext);

  function handleSearchChange(event) {
    const value = event.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(value !== "");
    const options = ListChefs.filter((user) =>
      user.utilisateur.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(options);
  }
  function handleChange(e, id) {
    const { type, value, files } = e.target;
    if (type === "file") {
      const formData = new FormData();
      formData.append("file", e.target.files[0] || "");
      formData.append("gest_proj_champ_id", id);
      formData.append("gest_proj_tache_id", idTask);
      setidValuePOST(id);
      setformDATA(formData);
    } else {
      let formData = {
        valeur: value,
        gest_proj_champ_id: id,
        gest_proj_tache_id: idTask,
      };
      setidValuePOST(id);
      setformDATA(formData);
    }
  }
  function handleChangePUT(e, id) {
    const { type, value, files } = e.target;
    setListChamps((prevChamps) =>
      prevChamps.map((champ) => {
        if (champ.applic_champs[0].id === id) {
          champ.applic_champs[0].valeur =
            type === "file" ? files[0].name : value;
        }
        return champ;
      })
    );
    if (type === "file") {
      const formData = new FormData();
      formData.append("file", e.target.files[0] || "");
      setidValue(id);
      setformDATA(formData);
    } else {
      let formData = {
        valeur: value,
      };
      setidValue(id);
      setformDATA(formData);
    }
  }

  function postValueInput() {
    if (idValuePOST) {
      const tokenString = localStorage.getItem("token");
      let token = JSON.parse(tokenString);
      axios
        .post(`${url}/api/projets/champ-applic`, formDATA, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setformDATA({});
          setidValuePOST("");
          getAllChamps();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  function postValueInputPUT() {
    if (idValue) {
      const tokenString = localStorage.getItem("token");
      let token = JSON.parse(tokenString);
      axios
        .put(`${url}/api/projets/champ-applic/${idValue}`, formDATA, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setformDATA({});
          setidValue("");
          getAllChamps();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  function retirerResp(id) {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .delete(`${url}/api/projets/responsable-taches/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setMessageSucces(response.data.message);
        setTimeout(() => {
          setMessageSucces("");
        }, 5000);
        getOneTask(idTask);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function addNewmember() {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    let formData = {
      gest_com_utilisateur_ids: userIds,
      gest_proj_tache_id: idTask,
    };
    axios
      .post(`${url}/api/projets/responsable-taches`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setMessageSucces(response.data.message);
        setTimeout(() => {
          setMessageSucces("");
        }, 5000);
        setUserIds([]);
        setSelected([]);
        getOneTask(idTask);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  function modifierTask() {
    let formData;
    if (!editorRef.current) {
      formData = {
        titre: titreTask,
        description: description,
        date_limite: dateFin,
      };
    }
    if (editorRef.current) {
      formData = {
        titre: titreTask,
        description: editorRef.current.getContent(),
        date_limite: dateFin,
      };
    }

    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);

    axios
      .put(`${url}/api/projets/taches/${idTask}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setMessageSucces(response.data.message);
        setTimeout(() => {
          setMessageSucces("");
        }, 5000);
        getOneTask(idTask);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  function handleRemoveMember(member) {
    setSelected(
      selected.filter((m) => m.utilisateur.email !== member.utilisateur.email)
    );
    setUserIds(userIds.filter((id) => id !== member.utilisateur.id));
  }

  function handleOptionSelect(option) {
    setIsDropdownOpen(false);
    setSearchTerm("");
    if (!selected.includes(option)) {
      setSelected([...selected, option]);
      setUserIds([...userIds, option.utilisateur.id]);
    }
  }

  function closeSetTask() {
    setShowSetTask(false);
  }

  return (
    <>
      <div className="showModals" onClick={closeSetTask}>
        <div
          className="formModalCreatePosts text-xs"
          onClick={(e) => {
            postValueInputPUT();
            postValueInput();
            e.stopPropagation();
          }}
        >
          <div className="headCreateTask pb-4">
            <div className="icone">
              <FontAwesomeIcon
                icon={faSquarePlus}
                className="add h-5 w-4 faSquarePlus"
              />
            </div>
            <div className="titreTask">
              <input
                type="text"
                value={titreTask}
                onChange={(e) => setTitreTask(e.target.value)}
                placeholder="Titre du projet"
                className="input pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
              />
            </div>
            <div className="close">
              <FontAwesomeIcon
                onClick={closeSetTask}
                icon={faXmark}
                className="h-5 w-4 ml-5 add cursor-pointer transition duration-200 ease-in-out hover:text-gray-500 hover:scale-110"
              />
            </div>
          </div>

          <div className="section mt-5">
            <div className="dateInputs w-full flex justify-between flex-wrap">
              <div className="inputGroup w-60 mb-5">
                <label className="input flex items-center font-medium text-gray-700 mb-1">
                  <FontAwesomeIcon icon={faClock} className="w-4 h-4 mr-2" />
                  Date limite
                </label>
                <input
                  type="date"
                  value={dateFin || ""}
                  onChange={(e) => setDateFin(e.target.value)}
                  className="input pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="label mt-2">Description :</div>
          <div className="editor">
            <Editor
              apiKey="grqm2ym9jtrry4atbeq5xsrd1rf2fe5jpsu3qwpvl7w9s7va"
              onInit={(_evt, editor) => {
                editorRef.current = editor;
              }}
              initialValue={description}
              init={{
                height: 200,
                min_height: 200,
                menubar: false,
                branding: false,
                plugins: "textcolor",
                toolbar: "bold italic forecolor",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </div>
          <div className="w-52 mt-2 ">
            <button onClick={modifierTask} className="input btnInviter">
              Modifier
            </button>
          </div>

          <div>
            {ListChamps.map((item, index) => (
              <div key={index} className=" mt-4 flex flex-col">
                <label className="font-bold" htmlFor={`input-${index}`}>
                  {item.label} :
                </label>
                {item.type === "file" ? (
                  <a
                    href={`${url}/storage/${item.applic_champs[0].valeur}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline mt-1"
                  >
                    {
                      item.applic_champs[0].valeur.split("/")[
                        item.applic_champs[0].valeur.split("/").length - 1
                      ]
                    }
                  </a>
                ) : (
                  <input
                    type={item.type}
                    value={item.applic_champs[0].valeur || ""}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleChangePUT(e, item.applic_champs[0].id);
                    }}
                    className="input w-full pl-2 pr-2 block mt-1 mr-2  rounded-sm border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                  />
                )}
              </div>
            ))}
            {ListChampsWithoutValue.map((item, index) => (
              <div key={index} className=" mt-4 flex flex-col">
                <label className="font-bold" htmlFor={`input-${index}`}>
                  {item.label} :
                </label>
                <input
                  type={item.type}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleChange(e, item.id);
                  }}
                  className="input pl-2 pr-2 block mt-1  rounded-sm border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                />
              </div>
            ))}
          </div>

          {ListResp.length !== 0 && (
            <div className="border p-2 rounded mt-4">
              <h1 className="font-bold mb-2">
                Liste des responsables de cette tâche :
              </h1>

              {ListResp.map((list) => (
                <li
                  key={list.id}
                  className=" flex items-center justify-between"
                >
                  {list.utilisateur.nom}
                  <Tippy content="Retirer">
                    <FontAwesomeIcon
                      onClick={() => retirerResp(list.id)}
                      icon={faXmark}
                      className="text-red-500 focus:outline-none"
                    />
                  </Tippy>
                </li>
              ))}
              {ListResp.length === 0 && (
                <p className="mt-2 text-center text-xs text-gray-500">
                  Aucun responsable trouvé...
                </p>
              )}
            </div>
          )}

          <div className="section mt-5 flex items-center">
            <div className="relative w-full">
              <div className="label w-full">Nouveaux responsables :</div>
              <div className="flex mt-2 items-center relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="input pl-3 pr-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <FontAwesomeIcon
                  onClick={() => {
                    setSearchTerm("");
                    setIsDropdownOpen(false);
                  }}
                  icon={faXmark}
                  className=" h-3 w-3 relative text-gray-400 cursor-pointer right-5"
                />
              </div>

              {isDropdownOpen && (
                <div className="relative max-h-[100px] overflow-y-auto mt-1 w-full rounded-md bg-white shadow-lg z-10">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((user, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200"
                        onClick={() => handleOptionSelect(user)}
                      >
                        {user.utilisateur.email}{" "}
                        <b className="text-blue-500 text-xs">({user.role})</b>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      Aucune option disponible
                    </div>
                  )}
                </div>
              )}
              {selected.length > 0 && (
                <div>
                  <div className="flex flex-wrap">
                    {selected.map((member, index) => (
                      <div
                        key={index}
                        className="mr-5 input text-black w-60 mt-2 bg-gray-200 rounded-md px-4 py-2 flex justify-between items-center"
                      >
                        {member.utilisateur.email}
                        <FontAwesomeIcon
                          icon={faXmark}
                          className="cursor-pointer text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveMember(member)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-52 mt-2 ">
            <button onClick={addNewmember} className="input btnInviter">
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
