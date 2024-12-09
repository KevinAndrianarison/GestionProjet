import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faClock,
  faPlus,
  faThumbtack,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faSquareCheck } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { ShowContext } from "../contexte/useShow";
import { TaskContext } from "../contexte/useTask";
import { useContext, useRef, useState } from "react";
import { UrlContext } from "../contexte/useUrl";
import { MessageContext } from "../contexte/useMessage";
import { ProjectContext } from "../contexte/useProject";
import { EtapeContext } from "../contexte/useEtape";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";

export default function Task() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [titreTask, setTitreTask] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [chargeProvisionnel, setChargeProvisionnel] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [checklistName, setChecklistName] = useState("");
  const [selected, setSelected] = useState([]);
  const editorRef = useRef("");
  const [checklists, setChecklists] = useState([]);
  const checklistRef = useRef();
  const [userIds, setUserIds] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [statusTaskId, setStatusTaskId] = useState("");
  const [etapeId, setEtapeId] = useState("");

  const { url } = useContext(UrlContext);
  const { ListStatusTask } = useContext(TaskContext);
  const { setShowSpinner, setShowTask } = useContext(ShowContext);
  const { setMessageSucces, setMessageError } = useContext(MessageContext);
  const { idProject, ListChefs } = useContext(ProjectContext);
  const { listEtape, getAlletapeByProjets } = useContext(EtapeContext);

  function closeTask() {
    setShowTask(false);
  }

  function closeModal(e) {
    if (checklistRef.current && !checklistRef.current.contains(e.target)) {
      setShowChecklistModal(false);
    }
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

  function addElementToChecklist(index, element) {
    if (element.trim() !== "") {
      const updatedChecklists = [...checklists];
      updatedChecklists[index].elements.push(element);
      updatedChecklists[index].newElement = "";
      setChecklists(updatedChecklists);
    }
  }

  function handleNewElementChange(index, value) {
    const updatedChecklists = [...checklists];
    updatedChecklists[index].newElement = value;
    setChecklists(updatedChecklists);
  }

  function handleSearchChange(event) {
    const value = event.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(value !== "");
    const options = ListChefs.filter((user) =>
      user.utilisateur.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(options);
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

  function createTaskAndNew() {
    let formData;
    let statusId = ListStatusTask[0].id;
    let etpId = listEtape[0].id;
    if (statusTaskId) {
      statusId = "";
    }
    if (etapeId) {
      etpId = "";
    }
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    if (editorRef.current) {
      setShowSpinner(true);
      formData = {
        titre: titreTask,
        description: editorRef.current.getContent(),
        date_debut: dateDebut,
        date_limite: dateFin,
        charge_provisionnel: chargeProvisionnel,
        gest_proj_statuts_tache_id: statusTaskId || statusId,
        gest_proj_etape_id: etapeId || etpId,
      };
    }
    if (!editorRef.current) {
      setShowSpinner(true);
      formData = {
        titre: titreTask,
        description: "",
        date_debut: dateDebut,
        date_limite: dateFin,
        charge_provisionnel: chargeProvisionnel.toString(),
        gest_proj_statuts_tache_id: statusTaskId || statusId,
        gest_proj_etape_id: etapeId || etpId,
      };
    }
    axios
      .post(`${url}/api/projets/taches`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        let idTask = response.data.tache.id;
        let fomdata = {
          gest_com_utilisateur_ids: userIds,
          gest_proj_tache_id: idTask,
        };
        axios
          .post(`${url}/api/projets/responsable-taches`, fomdata, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            getAlletapeByProjets();
            setMessageSucces("Tâche crée avec succès !");
            setShowTask(false);
            setTimeout(() => {
              setMessageSucces("");
            }, 5000);
            setShowSpinner(false);
            setTimeout(() => {
              setShowTask(true);
            }, 2000);
          })
          .catch((err) => {
            console.error(err);
            setShowSpinner(false);
          });
        checklists.forEach((list) => {
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
                  .then((response) => {})
                  .catch((err) => {
                    console.error(err);
                    setShowSpinner(false);
                  });
              });
            })
            .catch((err) => {
              console.error(err);
              setShowSpinner(false);
            });
        });
        setShowSpinner(false);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  function createTask() {
    let formData;
    let statusId = ListStatusTask[0].id;
    let etpId = listEtape[0].id;
    if (statusTaskId) {
      statusId = "";
    }
    if (etapeId) {
      etpId = "";
    }
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    if (editorRef.current) {
      setShowSpinner(true);
      formData = {
        titre: titreTask,
        description: editorRef.current.getContent(),
        date_debut: dateDebut,
        charge_provisionnel: chargeProvisionnel.toString(),
        date_limite: dateFin,
        gest_proj_statuts_tache_id: statusTaskId || statusId,
        gest_proj_etape_id: etapeId || etpId,
      };
    }
    if (!editorRef.current) {
      setShowSpinner(true);
      formData = {
        titre: titreTask,
        description: "",
        date_debut: dateDebut,
        charge_provisionnel: chargeProvisionnel,
        date_limite: dateFin,
        gest_proj_statuts_tache_id: statusTaskId || statusId,
        gest_proj_etape_id: etapeId || etpId,
      };
    }
    axios
      .post(`${url}/api/projets/taches`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        let idTask = response.data.tache.id;
        let fomdata = {
          gest_com_utilisateur_ids: userIds,
          gest_proj_tache_id: idTask,
        };
        axios
          .post(`${url}/api/projets/responsable-taches`, fomdata, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            getAlletapeByProjets();
            setMessageSucces("Tâche crée avec succès !");
            setShowTask(false);
            setTimeout(() => {
              setMessageSucces("");
            }, 5000);
            setShowSpinner(false);
          })
          .catch((err) => {
            console.error(err);
            setShowSpinner(false);
          });
        checklists.forEach((list) => {
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
                  .then((response) => {})
                  .catch((err) => {
                    console.error(err);
                    setShowSpinner(false);
                  });
              });
            })
            .catch((err) => {
              console.error(err);
              setShowSpinner(false);
            });
        });
        setShowSpinner(false);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  return (
    <>
      <div className="showModalTask " onClick={() => setShowTask(false)}>
        <div
          className="formModalCreatePost "
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="close flex justify-between w-full ">
            <h1 className="TitreCreateTask input text-black">
              <FontAwesomeIcon icon={faCircleCheck} className="mr-4" />
              Nouvelle tâches
            </h1>
            <FontAwesomeIcon
              onClick={closeTask}
              icon={faXmark}
              className=" relative bottom-5 left-5  h-5 w-4 add cursor-pointer  text-red-600 font-bold border-4 border-red-500 rounded-full px-1 py-0.5"
            />
          </div>

          <div className="flex items-center flex-wrap">
            <input
              type="text"
              value={titreTask}
              placeholder="Saisissez le nom de la tâche"
              onChange={(e) => {
                setTitreTask(e.target.value);
              }}
              className="input mr-5 text-xs pl-3 pr-3 block tailleInputcreateTask  mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
            />
            <select
              value={statusTaskId}
              onChange={(e) => setStatusTaskId(e.target.value)}
              className="input w-40 mr-5 text-xs pl-3 pr-3 block tailleInputcreateTask  mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
            >
              {ListStatusTask.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.valeur}
                </option>
              ))}
            </select>
          </div>

          <textarea
            placeholder="Saisissez  la description de la tâche"
            className="shadow-sm hidden input pl-3 pr-3 block tailleInputcreateTask  mt-2  min-h-[50px] rounded-md border-0 py-1.5 text-gray-900  ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
          ></textarea>

          <div className="text-xs">
            <div className="flex-wrap  mt-5 flex">
              <div className="inputGroup w-60 mb-2 mr-2">
                <label className="input flex items-center font-medium text-gray-700 mb-1">
                  <FontAwesomeIcon icon={faClock} className="mr-2" />
                  Date début
                </label>
                <input
                  type="date"
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                  className="input pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                />
              </div>
              <div className="inputGroup w-60 mb-2 mr-2">
                <label className="input flex items-center font-medium text-gray-700 mb-1">
                  <FontAwesomeIcon icon={faClock} className=" mr-2" />
                  Date limite
                </label>
                <input
                  type="date"
                  value={dateFin}
                  onChange={(e) => setDateFin(e.target.value)}
                  className="input pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                />
              </div>
              <div className="inputGroup w-52 mb-2 mr-2">
                <label className="input flex items-center font-medium text-gray-700 mb-1">
                  <FontAwesomeIcon icon={faCalendarCheck} className=" mr-2" />
                  Charge prévisionnel
                </label>
                <input
                  type="number"
                  value={chargeProvisionnel}
                  onChange={(e) => setChargeProvisionnel(e.target.value)}
                  className="input pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-2">
              <label>
                <FontAwesomeIcon icon={faThumbtack} className=" mr-2" />
                Choisissez une étape :
              </label>
              <select
                value={etapeId}
                onChange={(e) => setEtapeId(e.target.value)}
                className="input w-60 mr-5 text-xs pl-3 pr-3 block tailleInputcreateTask  mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
              >
                {listEtape.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.nom}
                  </option>
                ))}
                {listEtape.length === 0 && (
                  <option disabled>Aucune étape trouvée...</option>
                )}
              </select>
            </div>
            <div className=" section"></div>
            <div className="hidden label mt-2">Description :</div>
            <div className=" editor mt-2">
              <Editor
                apiKey="grqm2ym9jtrry4atbeq5xsrd1rf2fe5jpsu3qwpvl7w9s7va"
                onInit={(_evt, editor) => (editorRef.current = editor)}
                initialValue=""
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
            <div className="hidden flex items-start flex-col">
              <label
                htmlFor="file-upload"
                className="input mt-2 cursor-pointer text-gray-400 px-4 py-2 rounded-md border-dashed border-2  border-gray-300 transition duration-300 mr-5"
              >
                📎 Importer un fichier
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png"
              />
            </div>

            {showChecklistModal && (
              <div
                onClick={closeModal}
                className="fixed inset-0 z-10 bg-black bg-opacity-25 flex justify-center items-center"
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
              <div key={index} className="mt-4">
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
                      <FontAwesomeIcon icon={faSquareCheck} className="mr-2" />{" "}
                      {el}
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
                    <div className="flex mt-1 w-60">
                      <button
                        className="border bg-blue-400  px-5 py-1 rounded-lg mr-2"
                        onClick={() =>
                          addElementToChecklist(index, checklist.newElement)
                        }
                      >
                        Ajouter
                      </button>
                      <button
                        className=" px-5 py-1 hover:bg-gray-300 rounded-lg"
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
            <button
              className=" py-2  mt-2  input text-black  rounded-lg"
              onClick={() => setShowChecklistModal(true)}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" /> Ajouter une
              liste de contrôle
            </button>

            <div className="section mt-2 flex items-center">
              <div className="relative w-full">
                <div className="label">Responsable(s) :</div>
                <div className="flex mt-2 items-center ">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="input pl-3 pr-10 block w-72 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
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
                          {user.utilisateur.email}
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
            <div className="mt-5 w-full flex flex-wrap justify-between">
              <button
                disabled={!titreTask || !userIds[0] || !dateDebut || !dateFin}
                onClick={createTask}
                className="input px-3 py-2 border bg-gray-400 rounded text-blue-800 font-bold cursor-pointer"
              >
                Enregistrer la tâche
              </button>
              <button
                disabled={!titreTask || !userIds[0] || !dateDebut || !dateFin}
                onClick={createTaskAndNew}
                className="input px-3 py-2 border  bg-gray-400 rounded text-blue-800 font-bold cursor-pointer"
              >
                Enregistrer et créer une nouvelle tâche
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
