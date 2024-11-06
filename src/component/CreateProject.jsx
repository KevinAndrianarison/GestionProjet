import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faXmark,
  faClock,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { faFontAwesome } from "@fortawesome/free-regular-svg-icons";
import { ShowContext } from "../contexte/useShow";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexte/useUser";
import { UrlContext } from "../contexte/useUrl";
import { MessageContext } from "../contexte/useMessage";
import axios from "axios";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { ProjectContext } from "../contexte/useProject";

export default function CreateProject() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermChef, setSearchTermChef] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedChefs, setSelectedChefs] = useState([]);
  const [
    selectedResponsablesHierarchiques,
    setSelectedResponsablesHierarchiques,
  ] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [userIdsResp, setUserIdsResp] = useState([]);
  const [userIdsChef, setUserIdsChef] = useState([]);
  const [isDropdownOpenMembers, setIsDropdownOpenMembers] = useState(false);
  const [isDropdownOpenChef, setIsDropdownOpenChef] = useState(false);
  const [idProjectLoad, setIdProjectLoad] = useState("");
  const [titreProjet, setTitreProjet] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [filteredOptionsChefs, setFilteredOptionsChefs] = useState([]);
  const [dateFin, setDateFin] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [ligneBudgetaire, setLigneBudgetaire] = useState("");
  const [clients, setClients] = useState("");
  const [refClient, setRefClient] = useState("");
  const [nbrJR, setNbrJR] = useState("");
  const [TJM, setTJM] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [stepOneDone, setStepOneDone] = useState(false);
  const [stepTwoDone, setStepTwoDone] = useState(false);
  const [stepThreeDone, setStepThreeDone] = useState(false);
  const [statusProjetId, setStatusProjetId] = useState("");
  const [filteredOptionsResponsables, setFilteredOptionsResponsables] =
    useState([]);
  const [searchTermResponsable, setSearchTermResponsable] = useState("");
  const [isDropdownOpenResponsable, setIsDropdownOpenResponsable] =
    useState(false);

  const editorRef = useRef("");

  const { ListeUser } = useContext(UserContext);
  const { url } = useContext(UrlContext);
  const { setShowcreateTask, setShowSpinner } = useContext(ShowContext);
  const { setMessageSucces, setMessageError } = useContext(MessageContext);
  const {
    getAllproject,
    getProjectWhenChef,
    getProjectWhenMembres,
    categorie,
    ListStatus,
    getAllStatus,
  } = useContext(ProjectContext);

  const userString = localStorage.getItem("user");
  let user = JSON.parse(userString);
  const tokenString = localStorage.getItem("token");
  let token = JSON.parse(tokenString);

  function closeCreateProject() {
    setShowcreateTask(false);
  }

  function handleCheckboxChange(event) {
    setIsChecked(event.target.checked);
  }

  useEffect(() => {
    getAllStatus();
  }, []);

  function handleSearchChange(event) {
    const value = event.target.value;
    setSearchTerm(value);
    setIsDropdownOpenMembers(value !== "");
    const options = ListeUser.filter((user) =>
      user.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(options);
  }

  function handleSearchChangeResponsables(event) {
    const value = event.target.value;
    setSearchTermResponsable(value);
    setIsDropdownOpenResponsable(value !== "");
    const options = ListeUser.filter((user) =>
      user.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptionsResponsables(options);
  }

  function handleSearchChangeChefs(event) {
    const value = event.target.value;
    setSearchTermChef(value);
    setIsDropdownOpenChef(value !== "");
    const options = ListeUser.filter(
      (user) =>
        user.valeur === "chef" &&
        user.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptionsChefs(options);
  }

  function handleOptionSelectChefs(option) {
    if (!selectedChefs.includes(option)) {
      setSelectedChefs([...selectedChefs, option]);
      setUserIdsChef([...userIdsChef, option.id]);
    }
    setSearchTermChef("");
    setIsDropdownOpenChef(false);
  }

  function handleOptionSelect(option) {
    if (!selectedMembers.includes(option)) {
      setSelectedMembers([...selectedMembers, option]);
      setUserIds([...userIds, option.id]);
    }
    setSearchTerm("");
    setIsDropdownOpenMembers(false);
  }

  function handleOptionSelectResp(option) {
    if (!selectedResponsablesHierarchiques.includes(option)) {
      setSelectedResponsablesHierarchiques([
        ...selectedResponsablesHierarchiques,
        option,
      ]);
      setUserIdsResp([...userIdsResp, option.id]);
    }
    setSearchTermResponsable("");
    setIsDropdownOpenResponsable(false);
  }

  function handleRemoveMember(member) {
    setSelectedMembers(selectedMembers.filter((m) => m !== member));
    setUserIds(userIds.filter((id) => id !== member.id));
  }
  function handleRemoveChefs(member) {
    setSelectedMembers(selectedChefs.filter((m) => m !== member));
    setUserIdsChef(userIdsChef.filter((id) => id !== member.id));
  }

  function handleRemoveResp(member) {
    setSelectedResponsablesHierarchiques(
      selectedResponsablesHierarchiques.filter((m) => m !== member)
    );
    setUserIdsResp(userIdsResp.filter((id) => id !== member.id));
  }

  function addmembres(id) {
    let formData = {
      role: "membre",
      gest_proj_projet_id: id,
      gest_com_utilisateur_ids: userIds,
    };
    axios
      .post(`${url}/api/projets/role-utilisateurs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {})
      .catch((err) => {
        console.error(err);
      });
  }
  function addChefs(id) {
    let formData;
    let idChefs;
    idChefs = [...userIdsChef, user.id];
    if (user.role === "admin") {
      if (!isChecked) {
        formData = {
          role: "chef",
          gest_proj_projet_id: id,
          gest_com_utilisateur_ids: userIdsChef,
        };
      }
      if (isChecked) {
        formData = {
          role: "chef",
          gest_proj_projet_id: id,
          gest_com_utilisateur_ids: idChefs,
        };
      }
    } else {
      formData = {
        role: "chef",
        gest_proj_projet_id: id,
        gest_com_utilisateur_ids: idChefs,
      };
    }

    axios
      .post(`${url}/api/projets/role-utilisateurs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {})
      .catch((err) => {
        console.error(err);
      });
  }

  function createProjetsetwo() {
    if (userIds.length !== 0) {
      addmembres(idProjectLoad);
    }
    if (userIdsChef.length !== 0) {
      addChefs(idProjectLoad);
    }
    if (userIdsResp.length !== 0) {
      addResp(idProjectLoad);
    }
    setStepTwoDone(true);
    if (stepOneDone && stepThreeDone) {
      setShowcreateTask(false);
    }
  }

  function addResp(id) {
    let formData = {
      role: "resp",
      gest_proj_projet_id: id,
      gest_com_utilisateur_ids: userIdsResp,
    };
    axios
      .post(`${url}/api/projets/role-utilisateurs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {})
      .catch((err) => {
        console.error(err);
      });
  }

  function createProjet() {
    setShowSpinner(true);
    let statusIfNotselect;
    if (statusProjetId === "") {
      statusIfNotselect = ListStatus[0].id;
    }
    let formData = {
      nom: titreProjet,
      description: editorRef.current.getContent(),
      entreprise_id: user.gest_com_entreprise_id,
      date_debut: dateDebut,
      date_fin: dateFin,
      ligne_budgetaire: ligneBudgetaire,
      reference_client: refClient,
      client: clients,
      nb_jour: nbrJR,
      taux_j_moyen: TJM,
      gest_proj_statuts_projet_id: Number(statusProjetId) || statusIfNotselect,
    };
    axios
      .post(`${url}/api/projets`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (userIds.length !== 0) {
          addmembres(response.data.projet.id);
        }
        if (userIdsChef.length !== 0) {
          addChefs(response.data.projet.id);
        }
        if (userIdsResp.length !== 0) {
          addResp(response.data.projet.id);
        }
        // if (categorie === "Tous les projets") {
        //   getAllproject();
        // }
        // if (categorie === "Mes projets") {
        //   getProjectWhenChef();
        // }
        // if (categorie === "Les projets dont je fait partie") {
        //   getProjectWhenMembres();
        // }
        setTitreProjet("");
        setLigneBudgetaire("");
        setClients("");
        setRefClient("");
        setNbrJR("");
        setTJM("");
        editorRef.current.setContent("");
        setDateFin("");
        setDateDebut("");
        setMessageSucces(response.data.message);
        setShowcreateTask(false);
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
  function createProjetAndCreateNew() {
    setShowSpinner(true);
    let statusIfNotselect;
    if (statusProjetId === "") {
      statusIfNotselect = ListStatus[0].id;
    }
    let formData = {
      nom: titreProjet,
      description: editorRef.current.getContent(),
      entreprise_id: user.gest_com_entreprise_id,
      date_debut: dateDebut,
      date_fin: dateFin,
      ligne_budgetaire: ligneBudgetaire,
      reference_client: refClient,
      client: clients,
      nb_jour: nbrJR,
      taux_j_moyen: TJM,
      gest_proj_statuts_projet_id: Number(statusProjetId) || statusIfNotselect,
    };
    axios
      .post(`${url}/api/projets`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (userIds.length !== 0) {
          addmembres(response.data.projet.id);
        }
        if (userIdsChef.length !== 0) {
          addChefs(response.data.projet.id);
        }
        if (userIdsResp.length !== 0) {
          addResp(response.data.projet.id);
        }
        // if (categorie === "Tous les projets") {
        //   getAllproject();
        // }
        // if (categorie === "Mes projets") {
        //   getProjectWhenChef();
        // }
        // if (categorie === "Les projets dont je fait partie") {
        //   getProjectWhenMembres();
        // }
        setTitreProjet("");
        setLigneBudgetaire("");
        setClients("");
        setRefClient("");
        setNbrJR("");
        setTJM("");
        editorRef.current.setContent("");
        setDateFin("");
        setDateDebut("");
        setMessageSucces(response.data.message);
        setShowcreateTask(false);
        setShowSpinner(false);
        setTimeout(() => {
          setShowcreateTask(true);
        }, 2000);
        setTimeout(() => {
          setMessageSucces("");
        }, 5000);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  function createProjetFirstStep() {
    let statusIfNotselect;
    if (statusProjetId === "") {
      statusIfNotselect = ListStatus[0].id;
    }
    let formData = {
      nom: titreProjet,
      description: editorRef.current.getContent(),
      entreprise_id: user.gest_com_entreprise_id,
      date_debut: dateDebut,
      date_fin: dateFin,
      ligne_budgetaire: ligneBudgetaire,
      reference_client: refClient,
      client: clients,
      gest_proj_statuts_projet_id: Number(statusProjetId) || statusIfNotselect,
    };
    axios
      .post(`${url}/api/projets`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setIdProjectLoad(response.data.projet.id);
        setStepOneDone(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function createProjetStepThree() {
    let formData = {
      nb_jour: nbrJR,
      taux_j_moyen: TJM,
    };
    axios
      .put(`${url}/api/projets/${idProjectLoad}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setStepThreeDone(true);
        if (stepOneDone && stepTwoDone) {
          setShowcreateTask(false);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <>
      <div className="showModal" onClick={closeCreateProject}>
        <div
          className="formModalCreatePost text-xs"
          onClick={(e) => e.stopPropagation()}
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
                value={titreProjet}
                onChange={(e) => setTitreProjet(e.target.value)}
                placeholder="Titre du projet"
                className="input pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
              />
            </div>
            <div>
              <FontAwesomeIcon
                onClick={closeCreateProject}
                icon={faXmark}
                className="h-7 w-7 ml-5 add cursor-pointer transition duration-200 ease-in-out hover:text-gray-500 hover:scale-110"
              />
            </div>
          </div>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <h1 className="font-bold text-xl">
                  <FontAwesomeIcon icon={faFontAwesome} className="mr-2" />
                  Etape 01
                </h1>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pb-2">
                  <div className="section mt-2">
                    <div className="dateInputs w-full flex flex-row flex-wrap">
                      <div className="inputGroup w-60 mb-5 mr-5">
                        <label className="input flex items-center font-medium text-gray-700 mb-1">
                          <FontAwesomeIcon
                            icon={faClock}
                            className="w-4 h-4 mr-2"
                          />
                          Date de début
                        </label>
                        <input
                          type="date"
                          value={dateDebut}
                          onChange={(e) => setDateDebut(e.target.value)}
                          className="input pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                        />
                      </div>
                      <div className="inputGroup w-60 mb-5 mr-5">
                        <label className="input flex items-center font-medium text-gray-700 mb-1">
                          <FontAwesomeIcon
                            icon={faClock}
                            className="w-4 h-4 mr-2"
                          />
                          Date limite
                        </label>
                        <input
                          type="date"
                          value={dateFin}
                          onChange={(e) => setDateFin(e.target.value)}
                          className="input pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                        />
                      </div>
                      <div className="inputGroup w-60 mb-5 mr-5">
                        <label className="input flex items-center font-medium text-gray-700 mb-1">
                          <FontAwesomeIcon
                            icon={faSpinner}
                            className="w-4 h-4 mr-2"
                          />
                          Statut du projet
                        </label>
                        <select
                          value={statusProjetId}
                          onChange={(e) => setStatusProjetId(e.target.value)}
                          className="input pl-3 w-52 pr-3 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                        >
                          {ListStatus.map((list) => (
                            <option key={list.id} value={list.id}>
                              {list.valeur}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="label">Description :</div>

                  <div className="editor  mt-2">
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
                  <div className="flex justify-between flex-wrap">
                    <div className="w-80">
                      <div className="label mt-5">Ligne budgetaire :</div>
                      <input
                        type="text"
                        onChange={(e) => setLigneBudgetaire(e.target.value)}
                        value={ligneBudgetaire}
                        className="mt-2 input pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                      />
                    </div>
                    <div className="w-80">
                      <div className="label mt-5">Clients :</div>
                      <input
                        type="text"
                        onChange={(e) => setClients(e.target.value)}
                        value={clients}
                        className="mt-2 input pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                      />
                    </div>
                    <div className="w-80">
                      <div className="label mt-5">Référence client :</div>
                      <input
                        type="text"
                        onChange={(e) => setRefClient(e.target.value)}
                        value={refClient}
                        className="mt-2 input pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 items-end">
                    {!stepOneDone && (
                      <button
                        onClick={createProjetFirstStep}
                        disabled={!titreProjet}
                        className="border bg-blue-500 rounded text-white px-5 py-2"
                      >
                        Enregistrer
                      </button>
                    )}
                    {stepOneDone && (
                      <p className="text-xs">
                        Vous avez terminé la première étape ! ✅
                      </p>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <h1 className="font-bold text-xl mt-2">
                  <FontAwesomeIcon icon={faFontAwesome} className="mr-2" />
                  Etape 02
                </h1>
              </AccordionTrigger>
              <AccordionContent>
                <div>
                  <div className="mt-2 section flex items-center">
                    <div className="relative w-full">
                      <div className="label">Ajouter des membres :</div>

                      <div className="flex mt-2 items-center relative">
                        <input
                          type="text"
                          placeholder="Rechercher..."
                          className="input pl-3 pr-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                          value={searchTerm}
                          onChange={handleSearchChange}
                        />
                      </div>

                      {isDropdownOpenMembers && (
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
                  {selectedMembers.length > 0 && (
                    <div className="">
                      <div className="flex flex-wrap">
                        {selectedMembers.map((member, index) => (
                          <div
                            key={index}
                            className="mr-5 input text-black w-60 mt-2 bg-gray-200 rounded-md px-4 py-2 flex justify-between items-center"
                          >
                            {member.email}
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
                  <div className="section mt-5 flex items-center">
                    <div className="relative w-full">
                      <div className="label w-full">
                        Ajouter des responsable hierarchique :
                      </div>

                      <div className="flex mt-2 items-center relative">
                        <input
                          type="text"
                          placeholder="Rechercher..."
                          className="input pl-3 pr-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                          value={searchTermResponsable}
                          onChange={handleSearchChangeResponsables}
                        />
                      </div>

                      {isDropdownOpenResponsable && (
                        <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
                          {filteredOptionsResponsables.length > 0 ? (
                            filteredOptionsResponsables.map((user, index) => (
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

                  {selectedResponsablesHierarchiques.length > 0 && (
                    <div className="">
                      <div className="flex flex-wrap">
                        {selectedResponsablesHierarchiques.map(
                          (member, index) => (
                            <div
                              key={index}
                              className="mr-5 input text-black w-60 mt-2 bg-gray-200 rounded-md px-4 py-2 flex justify-between items-center"
                            >
                              {member.email}
                              <FontAwesomeIcon
                                icon={faXmark}
                                className="cursor-pointer text-red-500 hover:text-red-700"
                                onClick={() => handleRemoveResp(member)}
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  <div className="section mt-5 flex items-center">
                    <div className="relative w-full">
                      <div className="label w-full">
                        Ajouter des chefs de projet :
                      </div>

                      <div className="flex mt-2 items-center relative">
                        <input
                          type="text"
                          placeholder="Rechercher..."
                          className="input pl-3 pr-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                          value={searchTermChef}
                          onChange={handleSearchChangeChefs}
                        />
                      </div>

                      {isDropdownOpenChef && (
                        <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
                          {filteredOptionsChefs.length > 0 ? (
                            filteredOptionsChefs.map((user, index) => (
                              <div
                                key={index}
                                className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200"
                                onClick={() => handleOptionSelectChefs(user)}
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
                    <div>
                      <div className="flex flex-wrap">
                        {selectedChefs.map((member, index) => (
                          <div
                            key={index}
                            className="mr-5 input text-black w-60 mt-2 bg-gray-200 rounded-md px-4 py-2 flex justify-between items-center"
                          >
                            {member.email}
                            <FontAwesomeIcon
                              icon={faXmark}
                              className="cursor-pointer text-red-500 hover:text-red-700"
                              onClick={() => handleRemoveChefs(member)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {user.role === "admin" && (
                    <div className=" mt-5 flex items-center font-bold">
                      <input
                        type="checkbox"
                        className="mr-2 "
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                      />
                      Je veux être parmi les chefs de ce projet
                    </div>
                  )}
                  <div className="flex justify-end mt-2">
                    {!stepTwoDone && (
                      <button
                        onClick={createProjetsetwo}
                        disabled={!idProjectLoad}
                        className="border bg-blue-500 rounded text-white px-5 py-2"
                      >
                        Enregistrer
                      </button>
                    )}
                    {stepTwoDone && (
                      <p className="text-xs">
                        Vous avez terminé la deuxième étape ! ✅
                      </p>
                    )}
                  </div>

                  {/* <div className="section mt-5 flex items-center">
                        <div className="relative w-full">
                          <div className="label w-full">
                            Ajouter des ressources materielle :
                          </div>
          
                          <div className="flex mt-2 items-center relative">
                            <input
                              type="text"
                              placeholder="Rechercher..."
                              className="input pl-3 pr-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                              value={searchTerm}
                              onChange={handleSearchChange}
                            />
                            <FontAwesomeIcon
                              icon={faPlus}
                              className="absolute right-3 text-gray-400 cursor-pointer transition duration-200 hover:text-[rgba(0, 184, 148,1.0)] hover:scale-125"
                              onClick={() => handleOptionSelect({ email: searchTerm })}
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
                      </div> */}
                  {/* {selectedMembers.length > 0 && (
                        <div className="">
                          <div className="flex flex-wrap">
                            {selectedMembers.map((member, index) => (
                              <div
                                key={index}
                                className="mr-5 input text-black w-60 mt-2 bg-gray-200 rounded-md px-4 py-2 flex justify-between items-center"
                              >
                                {member.email}
                                <FontAwesomeIcon
                                  icon={faXmark}
                                  className="cursor-pointer text-red-500 hover:text-red-700"
                                  onClick={() => handleRemoveMember(member)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )} */}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                {" "}
                <h1 className="font-bold text-xl mt-2">
                  <FontAwesomeIcon icon={faFontAwesome} className="mr-2" />
                  Etape 03
                </h1>
              </AccordionTrigger>
              <AccordionContent>
                <div>
                  <div className="flex flex-wrap items-end">
                    <div className="w-52 mr-2">
                      <div className="label mt-5">NB jours :</div>
                      <input
                        type="number"
                        value={nbrJR}
                        onChange={(e) => setNbrJR(e.target.value)}
                        className="mt-2 input pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                      />
                    </div>
                    <div className="w-52 mr-2">
                      <div className="label mt-5">
                        Taux Journalier Moyen HT (€) :
                      </div>
                      <input
                        type="number"
                        value={TJM}
                        onChange={(e) => setTJM(e.target.value)}
                        className="mt-2 input pl-3 pr-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
                      />
                    </div>
                    {!stepThreeDone && (
                      <button
                        onClick={createProjetStepThree}
                        disabled={!idProjectLoad}
                        className="mt-4 h-8 rounded bg-blue-500 text-white w-52 mr-2"
                      >
                        Enregistrer
                      </button>
                    )}

                    {TJM && nbrJR && (
                      <div className="mt-5 w-52 flex items-end text-gray-900 text-xl">
                        <div className="mr-2">Total :</div>
                        <div className="text-blue-500 font-bold">
                          {TJM * nbrJR} €
                        </div>
                      </div>
                    )}
                  </div>
                  {stepThreeDone && (
                    <p className="text-xs mt-2">
                      Vous avez terminé la troixième étape ! ✅
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {!stepOneDone && !stepTwoDone && !stepThreeDone && (
            <div className="mt-2 flex justify-between flex-wrap">
              <button
                onClick={createProjet}
                disabled={!titreProjet}
                className="mt-2 font-bold rounded bg-yellow-500  py-2 px-5 py-1"
              >
                Enregistrer le projet
              </button>
              <button
                disabled={!titreProjet}
                onClick={createProjetAndCreateNew}
                className="mt-2 font-bold rounded bg-yellow-500  py-2 px-5 py-1"
              >
                Enregistrer et créer un nouveau projet
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
