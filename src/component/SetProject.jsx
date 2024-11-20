import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState, useEffect } from "react";
import { ProjectContext } from "../contexte/useProject";
import axios from "axios";
import { UrlContext } from "../contexte/useUrl";
import { MessageContext } from "../contexte/useMessage";
import { ShowContext } from "../contexte/useShow";
import { UserContext } from "../contexte/useUser";
import "../styles/SetProject.css";

export default function SetProject() {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedResp, setSelectedResp] = useState([]);
  const [selectedChefs, setSelectedChefs] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [userIdsResp, setUserIdsResp] = useState([]);
  const [userIdsChef, setUserIdsChef] = useState([]);
  const [searchTermChef, setSearchTermChef] = useState("");
  const [searchTermMembre, setSearchTermMembre] = useState("");
  const [searchTermResp, setSearchTermResp] = useState("");
  const [isDropdownOpenChef, setIsDropdownOpenChef] = useState(false);
  const [isDropdownOpenMembre, setIsDropdownOpenMembre] = useState(false);
  const [isDropdownOpenresp, setIsDropdownOpenResp] = useState(false);
  const [filteredOptionsMembre, setFilteredOptionsMembre] = useState([]);
  const [filteredOptionsResp, setFilteredOptionsResp] = useState([]);
  const [filteredOptionsChef, setFilteredOptionsChef] = useState([]);

  const { idProjet, getOneProjet } = useContext(ProjectContext);
  const { url } = useContext(UrlContext);
  const { setShowSpinner, setShowSetProject } = useContext(ShowContext);
  const { ListeUser, getAllUser } = useContext(UserContext);

  useEffect(() => {
    getAllUser();
  }, []);

  function handleSearchChangeChef(event) {
    const value = event.target.value;
    setSearchTermChef(value);
    setIsDropdownOpenChef(value !== "");
    const options = ListeUser.filter(
      (user) =>
        (user.grade === "chef" || user.role === "admin") &&
        user.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptionsChef(options);
  }

  function handleSearchChangeMembre(event) {
    const value = event.target.value;
    setSearchTermMembre(value);
    setIsDropdownOpenMembre(value !== "");
    const options = ListeUser.filter((user) =>
      user.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptionsMembre(options);
  }

  function handleSearchChangeResp(event) {
    const value = event.target.value;
    setSearchTermResp(value);
    setIsDropdownOpenResp(value !== "");
    const options = ListeUser.filter((user) =>
      user.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptionsResp(options);
  }

  function fetchPOST(formData) {
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .post(`${url}/api/projets/role-utilisateurs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getOneProjet(idProjet);
        setShowSetProject(false);
        setShowSpinner(false);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  function addNewmembresandChefs() {
    if (userIds.length !== 0) {
      setShowSpinner(true);
      let formData = {
        role: "membre",
        gest_proj_projet_id: idProjet,
        gest_com_utilisateur_ids: userIds,
      };
      fetchPOST(formData);
    }
    if (userIdsChef.length !== 0) {
      setShowSpinner(true);
      let formData = {
        role: "chef",
        gest_proj_projet_id: idProjet,
        gest_com_utilisateur_ids: userIdsChef,
      };
      fetchPOST(formData);
    }
    if (userIdsResp.length !== 0) {
      setShowSpinner(true);
      let formData = {
        role: "resp",
        gest_proj_projet_id: idProjet,
        gest_com_utilisateur_ids: userIdsResp,
      };
      fetchPOST(formData);
    }
  }

  function handleRemoveMember(member) {
    setSelectedMembers(selectedMembers.filter((m) => m !== member));
    setUserIds(userIds.filter((id) => id !== member.id));
  }

  function handleRemoveResp(member) {
    setSelectedResp(selectedResp.filter((m) => m !== member));
    setUserIds(userIdsResp.filter((id) => id !== member.id));
  }

  function handleRemoveChefs(member) {
    setSelectedChefs(selectedChefs.filter((m) => m !== member));
    setUserIdsChef(userIdsChef.filter((id) => id !== member.id));
  }

  function handleOptionSelect(option) {
    if (!selectedMembers.includes(option)) {
      setSelectedMembers([...selectedMembers, option]);
      setUserIds([...userIds, option.id]);
    }
    setSearchTermMembre("");
    setIsDropdownOpenMembre(false);
  }

  function handleOptionSelectResp(option) {
    if (!selectedResp.includes(option)) {
      setSelectedResp([...selectedResp, option]);
      setUserIdsResp([...userIdsResp, option.id]);
    }
    setSearchTermResp("");
    setIsDropdownOpenResp(false);
  }

  function handleOptionSelectChef(option) {
    if (!selectedChefs.includes(option)) {
      setSelectedChefs([...selectedChefs, option]);
      setUserIdsChef([...userIdsChef, option.id]);
    }
    setSearchTermChef("");
    setIsDropdownOpenChef(false);
  }

  return (
    <>
      <div className="showModals" onClick={() => setShowSetProject(false)}>
        <div
          className="formModalCreatePosts text-xs"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="section mt-5 flex items-center">
            <div className="relative w-full">
              <div className="label  w-full">
                Ajouter des nouveau chef de projet :
              </div>
              <div className="flex mt-2 items-center relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTermChef}
                  onChange={handleSearchChangeChef}
                  className="input pl-3 pr-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                />
                <FontAwesomeIcon
                  onClick={() => {
                    setSearchTermChef("");
                    setIsDropdownOpenChef(false);
                  }}
                  icon={faXmark}
                  className=" h-3 w-3 relative text-gray-400 cursor-pointer right-5"
                />
              </div>
              {isDropdownOpenChef && (
                <div className="absolute max-h-[100px] overflow-y-auto mt-1 w-full rounded-md bg-white shadow-lg z-10">
                  {filteredOptionsChef.length > 0 ? (
                    filteredOptionsChef.map((user, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200"
                        onClick={() => handleOptionSelectChef(user)}
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
          {selectedChefs.length > 0 && (
            <div className="mt-2 ">
              <div className="flex flex-wrap wrap justify-between">
                {selectedChefs.map((member, index) => (
                  <div
                    key={index}
                    className="input text-black w-60 mt-2 bg-gray-200 rounded-md px-4 py-2 flex justify-between items-center"
                  >
                    {member.email}
                    <FontAwesomeIcon
                      icon={faXmark}
                      onClick={() => handleRemoveChefs(member)}
                      className="cursor-pointer text-red-500 hover:text-red-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="section mt-2  flex items-center">
            <div className="relative w-full">
              <div className="label w-full">Ajouter des nouveaux membres :</div>
              <div className="flex mt-2 items-center relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTermMembre}
                  onChange={handleSearchChangeMembre}
                  className="input pl-3 pr-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                />
                <FontAwesomeIcon
                  onClick={() => {
                    setSearchTermMembre("");
                    setIsDropdownOpenMembre(false);
                  }}
                  icon={faXmark}
                  className=" h-3 w-3 relative text-gray-400 cursor-pointer right-5"
                />
              </div>
              {isDropdownOpenMembre && (
                <div className="absolute max-h-[100px] overflow-y-auto mt-1 w-full rounded-md bg-white shadow-lg z-10">
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
          <div className="section mt-2  flex items-center">
            <div className="relative w-full">
              <div className="label w-full">
                Ajouter des nouveaux responsable hiérarchique :
              </div>
              <div className="flex mt-2 items-center relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTermResp}
                  onChange={handleSearchChangeResp}
                  className="input pl-3 pr-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                />
                <FontAwesomeIcon
                  onClick={() => {
                    setSearchTermResp("");
                    setIsDropdownOpenResp(false);
                  }}
                  icon={faXmark}
                  className=" h-3 w-3 relative text-gray-400 cursor-pointer right-5"
                />
              </div>
              {isDropdownOpenresp && (
                <div className="absolute max-h-[100px] overflow-y-auto mt-1 w-full rounded-md bg-white shadow-lg z-10">
                  {filteredOptionsResp.length > 0 ? (
                    filteredOptionsResp.map((user, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200"
                        onClick={() => handleOptionSelectResp(user)}
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

          {selectedResp.length > 0 && (
            <div className="mt-2 ">
              <div className="flex flex-wrap wrap justify-between">
                {selectedResp.map((member, index) => (
                  <div
                    key={index}
                    className="input text-black w-60 mt-2 bg-gray-200 rounded-md px-4 py-2 flex justify-between items-center"
                  >
                    {member.email}
                    <FontAwesomeIcon
                      icon={faXmark}
                      onClick={() => handleRemoveResp(member)}
                      className="cursor-pointer text-red-500 hover:text-red-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex w-full  justify-between flex-wrap">
            <div className="w-52 mt-2">
              <button
                onClick={addNewmembresandChefs}
                className="input btnInviter"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
