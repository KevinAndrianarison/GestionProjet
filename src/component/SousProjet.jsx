import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSliders } from "@fortawesome/free-solid-svg-icons";
import Tippy from "@tippyjs/react";
import { ShowContext } from "../contexte/useShow";
import { UrlContext } from "../contexte/useUrl";
import { MessageContext } from "../contexte/useMessage";
import { ProjectContext } from "../contexte/useProject";
import { EtapeContext } from "../contexte/useEtape";
import axios from "axios";

export default function SousProjet() {
  return <p>Sous-projet</p>;
  const { setShowSpinner, setShowDeleteEtape } = useContext(ShowContext);
  const { url } = useContext(UrlContext);
  const { setMessageSucces, setMessageError } = useContext(MessageContext);
  const { idProjet } = useContext(ProjectContext);
  const { listEtape, getAlletapeByProjets, setIdEtape, idEtape } =
    useContext(EtapeContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateDebutModif, setDateDebutModif] = useState("");
  const [dateFinModif, setDateFinModif] = useState("");
  const [descriptionModif, setDescriptionModif] = useState("");
  const [nomModif, setNomModif] = useState("");

  function toggleModal(id) {
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .get(`${url}/api/projets/etapes/etape/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setIdEtape(response.data.id);
        setDateDebutModif(response.data.date_debut);
        setDateFinModif(response.data.date_fin);
        setDescriptionModif(response.data.description);
        setNomModif(response.data.nom);
        setShowSpinner(false);
        setIsModalOpen(true);
      })
      .catch((err) => {
        console.error(err);
        setShowSpinner(false);
      });
  }

  function putEtap() {
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    let formData = {
      nom: nomModif,
      description: descriptionModif,
      date_fin: dateFinModif,
      date_debut: dateDebutModif,
    };
    axios
      .put(`${url}/api/projets/etapes/${idEtape}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getAlletapeByProjets();
        setDateDebutModif("");
        setDateFinModif("");
        setDescriptionModif("");
        setNomModif("");
        setMessageSucces(response.data.message);
        setIsModalOpen(false);
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

  function close() {
    setIsModalOpen(false);
  }

  const closeModalOnOutsideClick = (e) => {
    if (e.target.id === "modal-background") {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    getAlletapeByProjets();
  }, []);

  function showDeleteEtape(id) {
    setIdEtape(id);
    setShowDeleteEtape(true);
  }

  function createGradeEtapes() {
    let formData = {
      nom: nom,
      description: description,
      date_fin: dateFin,
      date_debut: dateDebut,
      gest_proj_projet_id: idProjet,
    };
    setShowSpinner(true);
    const tokenString = localStorage.getItem("token");
    let token = JSON.parse(tokenString);
    axios
      .post(`${url}/api/projets/etapes`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        getAlletapeByProjets();
        setMessageSucces(response.data.message);
        setDateDebut("");
        setNom("");
        setDescription("");
        setDateFin("");
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
      <div className="text-xs p-2">
        <h1 className="font-bold">Créer une grande étape :</h1>
        <div className="flex mt-2 items-end flex-wrap">
          <div>
            <label>Nom de la grande étape</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Nom de la grande étape"
              className="mt-1 mr-2 pl-3 pr-3 block w-60 h-8 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
            />
          </div>
          <div className="mt-2">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 mr-2 pl-3 pr-3 block w-60 min-h-8 h-8 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
            ></textarea>
          </div>
          <div className="mt-2 ">
            <label>Date de debut</label>
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="mt-1 mr-2 pl-3 pr-3 block w-60 h-8 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
            />
          </div>
          <div className="mt-2 ">
            <label>Date de fin réel</label>
            <input
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              className="mt-1 mr-2 pl-3 pr-3 block w-60 h-8 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
            />
          </div>
          <button
            disabled={!nom || !dateDebut}
            onClick={createGradeEtapes}
            className="border mt-2 px-5 bg-blue-500 text-white h-8 rounded"
          >
            Enregistrer
          </button>
        </div>
        <div className="mt-5">
          <div className="border flex justify-between px-3 py-2 font-bold">
            <h1 className="w-[20%] px-1">Nom</h1>
            <h1 className="w-[45%] px-1">Description</h1>
            <h1 className="w-[10%] hidden sm:block">Date debut</h1>
            <h1 className="w-[10%] hidden sm:block">Date fin réel</h1>
            <div className="flex justify-evenly w-[10%]">
              <h1 className="w-5 mr-1"></h1>
              <h1 className="w-5"></h1>
            </div>
          </div>
          {listEtape.map((list, index) => (
            <div key={list.id} className="max-h-[60vh] overflow-y-auto">
              <div className="border  flex justify-between px-3 py-2">
                <h1 className="w-[20%] truncate px-1">{list.nom}</h1>
                <h1 className="w-[45%] truncate px-1">{list.description}</h1>
                <h1 className="w-[10%] hidden sm:block">{list.date_debut}</h1>
                <h1 className="w-[10%] hidden sm:block">{list.date_fin}</h1>
                <div className="flex justify-evenly w-[10%] cursor-pointer">
                  <Tippy content="Modifier">
                    <FontAwesomeIcon
                      icon={faSliders}
                      className="w-5 text-gray-500 mr-1 focus:outline-none"
                      onClick={() => toggleModal(list.id)}
                    />
                  </Tippy>
                  <Tippy content="Supprimer">
                    <FontAwesomeIcon
                      onClick={() => {
                        showDeleteEtape(list.id);
                      }}
                      icon={faTrash}
                      className="w-5 text-red-500 focus:outline-none"
                    />
                  </Tippy>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div
          id="modal-background"
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center"
          onClick={closeModalOnOutsideClick}
        >
          <div className="bg-white rounded p-6 w-[90%] sm:w-[50%]">
            <h2 className="text-sm font-bold mb-4">Modifier la grande étape</h2>
            <div className="text-xs">
              <label>Nom de la grande étape</label>
              <input
                type="text"
                placeholder="Nom de la grande étape"
                value={nomModif}
                onChange={(e) => setNomModif(e.target.value)}
                className="mt-1 mb-4 pl-3 pr-3 block w-full h-8 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
              />
            </div>
            <div className="text-xs">
              <label>Description</label>
              <textarea
                value={descriptionModif}
                onChange={(e) => setDescriptionModif(e.target.value)}
                className="mt-1 mb-4 pl-3 pr-3 block w-full min-h-20 h-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
              ></textarea>
            </div>
            <div className="text-xs">
              <label>Date de début</label>
              <input
                type="date"
                value={dateDebutModif}
                onChange={(e) => setDateDebutModif(e.target.value)}
                className="mt-1 mb-4 pl-3 pr-3 block w-full h-8 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
              />
            </div>
            <div className="text-xs">
              <label>Date de fin réel</label>
              <input
                type="date"
                value={dateFinModif}
                onChange={(e) => setDateFinModif(e.target.value)}
                className="mt-1 mb-4 pl-3 pr-3 block w-full h-8 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[rgba(45, 52, 54,1.0)] focus:ring-2 focus:ring-inset focus:ring-[rgba(0, 184, 148,1.0)] focus:outline-none"
              />
            </div>
            <div className="flex justify-end text-xs">
              <button
                className="px-5 bg-blue-500 text-white h-8 rounded mr-2"
                onClick={putEtap}
              >
                Sauvegarder
              </button>
              <button
                className="px-5 bg-gray-500 text-white h-8 rounded"
                onClick={close}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
