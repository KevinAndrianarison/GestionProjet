import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faXmark,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { ShowContext } from "../contexte/useShow";
import { TaskContext } from "../contexte/useTask";
import { useContext, useRef, useState } from "react";
import { UrlContext } from "../contexte/useUrl";
import { MessageContext } from "../contexte/useMessage";
import { ProjectContext } from "../contexte/useProject";
import axios from "axios";
import { Editor } from "@tinymce/tinymce-react";

export default function Task() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [titreTask, setTitreTask] = useState("");
  const [dateFin, setDateFin] = useState("");
  const editorRef = useRef("");

  const { url } = useContext(UrlContext);
  const { getAllTask } = useContext(TaskContext);
  const { setShowSpinner, setShowTask } = useContext(ShowContext);
  const { setMessageSucces, setMessageError } = useContext(MessageContext);
  const { ListChefAndMembres, idProject } = useContext(ProjectContext);

  function closeTask() {
    setShowTask(false);
  }

  const filteredOptions = ListChefAndMembres.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleSearchChange(event) {
    const value = event.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(value !== "");
  }

  function handleOptionSelect(option) {
    setSelectedMember(option);
    setSearchTerm(option.email);
    setIsDropdownOpen(false);
  }

  function handleRemoveMember() {
    setSelectedMember(null);
    setSearchTerm("");
  }

  function createTask() {
    setShowSpinner(true);
    let chefsId = [];
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    const userString = localStorage.getItem("user");
    let user = JSON.parse(userString);
    chefsId.push(user.id);
    let dateActuelle = new Date();
    let dateFormatee =
      dateActuelle.getFullYear() +
      "-" +
      ("0" + (dateActuelle.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + dateActuelle.getDate()).slice(-2);

    let formData = {
      titre: titreTask,
      description: editorRef.current.getContent(),
      entreprise_id: user.gest_com_entreprise_id,
      date_debut: dateFormatee,
      date_fin: dateFin,
      employe_id: [selectedMember.id][0],
    };

    axios
      .post(`${url}/api/projets/${idProject}/taches`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getAllTask();
        setTitreTask("");
        editorRef.current.setContent("");
        setDateFin("");
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

  return (
    <>
      <div className="showModalTask " onClick={() => setShowTask(false)}>
        <div
          className="formModalCreatePost "
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="headCreateTask pb-4">
            <div className="icone">
              <FontAwesomeIcon
                icon={faSquarePlus}
                className="add h-7 w-7 faSquarePlus"
              />
            </div>
            <div className="titreTask">
              <input
                type="text"
                value={titreTask}
                onChange={(e) => setTitreTask(e.target.value)}
                placeholder="Titre"
                className="input pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
              />
            </div>
            <div className="close">
              <FontAwesomeIcon
                onClick={closeTask}
                icon={faXmark}
                className="h-7 w-7 ml-5 add cursor-pointer transition duration-200 ease-in-out hover:text-gray-500 hover:scale-110"
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
                  value={dateFin}
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
          <div className="section mt-5 flex items-center">
            <div className="relative w-full">
              <div className="label">Assigner à un membre :</div>
              <div className="flex mt-2 items-center relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="input pl-3 pr-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                  value={selectedMember ? selectedMember.email : searchTerm}
                  onChange={handleSearchChange}
                />
                <FontAwesomeIcon
                  icon={faXmark}
                  className="absolute right-3 text-gray-400 cursor-pointer transition duration-200 hover:text-[rgba(0, 184, 148,1.0)] hover:scale-125"
                  onClick={() => handleRemoveMember()}
                />
              </div>

              {isDropdownOpen && (
                <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((user, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200"
                        onClick={() => handleOptionSelect(user)}
                      >
                        {user.email}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      Aucune option disponible
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="mt-5">
            <button
              disabled={!titreTask || !dateFin || !selectedMember}
              onClick={createTask}
              className="btnInviter"
            >
              Créer une tâche
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
