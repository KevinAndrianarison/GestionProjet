import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { ProjectContext } from "../contexte/useProject";
import axios from "axios";
import { UrlContext } from "../contexte/useUrl";
import { MessageContext } from "../contexte/useMessage";
import { ShowContext } from "../contexte/useShow";
import { UserContext } from "../contexte/useUser";
import "../styles/SetProject.css";

export default function SetProject() {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [chefDeProjet, setChefDeProjet] = useState("");

  const [searchTermChef, setSearchTermChef] = useState("");
  const [searchTermMembre, setSearchTermMembre] = useState("");
  const [isDropdownOpenChef, setIsDropdownOpenChef] = useState(false);
  const [isDropdownOpenMembre, setIsDropdownOpenMembre] = useState(false);

  const { idProjet, getOneProjet, getAllproject, getProjectWhenMembres } =
    useContext(ProjectContext);
  const { setMessageSucces, setMessageError } = useContext(MessageContext);
  const { url } = useContext(UrlContext);
  const { setShowSpinner, setShowSetProject } = useContext(ShowContext);
  const { ListeUser } = useContext(UserContext);

  const filteredOptionsChef = ListeUser.filter((user) =>
    user.email.toLowerCase().includes(searchTermChef.toLowerCase())
  );

  const filteredOptionsMembre = ListeUser.filter((user) =>
    user.email.toLowerCase().includes(searchTermMembre.toLowerCase())
  );

  function handleSearchChangeChef(event) {
    const value = event.target.value;
    setSearchTermChef(value);
    setIsDropdownOpenChef(value !== "");
  }

  function handleSearchChangeMembre(event) {
    const value = event.target.value;
    setSearchTermMembre(value);
    setIsDropdownOpenMembre(value !== "");
  }

  function addNewmembres() {
    let formData = {
      membres: userIds,
    };

    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .put(`${url}/api/projets`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getOneProjet(idProjet);
        setSelectedMembers([]);
        setMessageSucces(response.data.message);
        setShowSpinner(false);
        setTimeout(() => {
          setMessageSucces("");
        }, 5000);
        getProjectWhenMembres();
        getAllproject();
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  function handleAddChefDeProjet(selectedChef) {
    if (selectedChef) {
      setChefDeProjet(selectedChef);
      setIsDropdownOpenChef(false);
      setSearchTermChef("");
      let formData = {
        chef_id: selectedChef.id,
      };
      setShowSpinner(true);
      const tokenString = localStorage.getItem("token");
      let token = JSON.parse(tokenString);
      axios
        .put(`${url}/api/entreprises/projets/chefs/${idProjet}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          getOneProjet(idProjet);
          setMessageSucces(response.data.message);
          setShowSpinner(false);
          setTimeout(() => {
            setMessageSucces("");
          }, 5000);
        })
        .catch((err) => {
          setMessageError(err.response.data.error);
          setShowSpinner(false);
          setTimeout(() => {
            setMessageError("");
          }, 5000);
        });
    }
  }

  function handleRemoveMember(member) {
    setSelectedMembers(selectedMembers.filter((m) => m !== member));
    setUserIds(userIds.filter((id) => id !== member.id));
  }

  function handleOptionSelect(option) {
    if (!selectedMembers.includes(option)) {
      setSelectedMembers([...selectedMembers, option]);
      setUserIds([...userIds, option.id]);
    }
    setSearchTermMembre("");
    setIsDropdownOpenMembre(false);
  }

  return (
    <>
      <div className="showModals" onClick={() => setShowSetProject(false)}>
        <div
          className="formModalCreatePosts"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="section mt-5 flex items-center">
            <div className="relative w-full">
              <div className="label">Ajouter un nouveau chef de projet :</div>
              <div className="flex mt-2 items-center relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTermChef}
                  onChange={handleSearchChangeChef}
                  className="input pl-3 pr-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                />
                <FontAwesomeIcon
                  icon={faPlus}
                  onClick={handleAddChefDeProjet}
                  className="absolute right-3 text-gray-400 cursor-pointer transition duration-200 hover:text-[rgba(0, 184, 148,1.0)] hover:scale-125"
                />
              </div>
              {isDropdownOpenChef && (
                <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
                  {filteredOptionsChef.length > 0 ? (
                    filteredOptionsChef.map((user, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200"
                        onClick={() => handleAddChefDeProjet(user)}
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
          <div className="section mt-2  flex items-center">
            <div className="relative w-full">
              <div className="label">Ajouter des nouveaux membres :</div>
              <div className="flex mt-2 items-center relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTermMembre}
                  onChange={handleSearchChangeMembre}
                  className="input pl-3 pr-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                />
                <FontAwesomeIcon
                  icon={faPlus}
                  onClick={() =>
                    handleOptionSelect({ email: searchTermMembre })
                  }
                  className="absolute right-3 text-gray-400 cursor-pointer transition duration-200 hover:text-[rgba(0, 184, 148,1.0)] hover:scale-125"
                />
              </div>
              {isDropdownOpenMembre && (
                <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
                  {filteredOptionsMembre.length > 0 ? (
                    filteredOptionsMembre.map((user, index) => (
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

          {selectedMembers.length > 0 && (
            <div className="mt-2 ">
              <div className="flex flex-wrap wrap justify-between">
                {selectedMembers.map((member, index) => (
                  <div
                    key={index}
                    className="input text-black w-60 mt-2 bg-gray-200 rounded-md px-4 py-2 flex justify-between items-center"
                  >
                    {member.email}
                    <FontAwesomeIcon
                      icon={faXmark}
                      onClick={() => handleRemoveMember(member)}
                      className="cursor-pointer text-red-500 hover:text-red-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex w-full  justify-between flex-wrap">
            <div className="w-52 mt-2">
              <button onClick={addNewmembres} className="input btnInviter">
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
