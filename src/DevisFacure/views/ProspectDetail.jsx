import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faTrash,
  faPencil,
  faPenToSquare,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";

function ProspectDetail() {
  const entityString = localStorage.getItem("entity");
  let entity = JSON.parse(entityString);
  const { id } = useParams(); // Récupérer l'ID de l'URL
  const navigate = useNavigate();
  const [prospect, setProspect] = useState(null);
  const [activeTab, setActiveTab] = useState("info"); // Définir l'onglet actif
  const [isNoteOpen, setIsNoteOpen] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("dataKey");
    if (storedData) {
      const prospects = JSON.parse(storedData);
      const foundProspect = prospects.find((p) => p.id === parseInt(id));
      setProspect(foundProspect);
    }
  }, [id]);

  if (!prospect) return <div>Chargement...</div>;

  const handleTabClick = (tab) => setActiveTab(tab);
  const handleNoteToggle = () => setIsNoteOpen(!isNoteOpen);

  const handleDelete = () => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      const storedData = localStorage.getItem("dataKey");
      if (storedData) {
        const prospects = JSON.parse(storedData);
        const updatedProspects = prospects.filter((p) => p.id !== parseInt(id));

        // Vérifiez si l'utilisateur a été retiré
        console.log("Updated Prospects: ", updatedProspects);

        localStorage.setItem("dataKey", JSON.stringify(updatedProspects));
        navigate(`${entity}/prospect`); // Rediriger après suppression
      }
    }
  };

  return (
    <div>
      <nav className="rounded-md flex justify-between items-center p-4 bg-slate-600 text-white">
        <div>
          <Link to="/ProspectDetail" className="text-lg">
            Client N° {prospect.id}
          </Link>
        </div>
        <div className="flex space-x-4">
          <Link to={`/NouveauDevis/${prospect.id}`}>
            <FontAwesomeIcon
              icon={faPencil}
              className="text-emerald-300 pr-1"
            />{" "}
            Nouvelle facture
          </Link>
          <Link to={`/NouveauDevis/${prospect.id}`}>
            <FontAwesomeIcon
              icon={faPencil}
              className="text-emerald-300 pr-1"
            />{" "}
            Nouveau devis
          </Link>
          <Link to={`/edit/${prospect.id}`}>
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="text-emerald-300 pr-1"
            />{" "}
            Modifier
          </Link>
          <button onClick={handleDelete}>
            <FontAwesomeIcon
              icon={faTrash}
              className="text-emerald-300 hover:text-red-500 pr-1"
            />{" "}
            Supprimer
          </button>
        </div>
      </nav>

      {/* Le reste de votre code pour l'affichage des informations */}
      {/* Barre des onglets */}
      <div className="my-3">
        <p className="text-3xl">{prospect.nom_societe}</p>
        <p className="text-2xl">{prospect.nom}</p>
      </div>

      {/* Barre des onglets */}
      <nav className="flex space-x-4 border-b border-slate-300">
        <div
          onClick={() => handleTabClick("info")}
          className={`cursor-pointer py-2 ${
            activeTab === "info" ? "border-b-2 border-emerald-300" : ""
          }`}
        >
          Informations
        </div>
        <div
          onClick={() => handleTabClick("factures")}
          className={`cursor-pointer py-2 ${
            activeTab === "factures" ? "border-b-2 border-emerald-300" : ""
          }`}
        >
          Factures
        </div>

        <div
          onClick={() => handleTabClick("devis")}
          className={`cursor-pointer py-2 ${
            activeTab === "devis" ? "border-b-2 border-emerald-300" : ""
          }`}
        >
          Devis
        </div>

        <div
          onClick={() => handleTabClick("remarque")}
          className={`cursor-pointer py-2 ${
            activeTab === "remarque" ? "border-b-2 border-emerald-300" : ""
          }`}
        >
          Remarque
        </div>
      </nav>

      {/* Contenu des onglets */}
      <div className="py-4">
        {activeTab === "info" && (
          <div>
            <h2 className="text-xl mb-4">Informations</h2>
            <div className="grid grid-cols-2 gap-y-2 text-slate-600">
              <div className="text-slate-600">Adresse de facturation :</div>
              <div>{prospect.adresse}</div>
              <div className="text-slate-600">Email :</div>
              <div>{prospect.email}</div>
              <div className="text-slate-600">Téléphone :</div>
              <div>{prospect.telephone}</div>
            </div>
          </div>
        )}
        {activeTab === "factures" && (
          <div>
            <h2 className="text-xl">Factures</h2>
            <p>Aucune facture pour le moment.</p>
          </div>
        )}
        {activeTab === "devis" && (
          <div>
            <h2 className="text-xl">Estimation</h2>
            <p>Aucune estimation pour le moment.</p>
          </div>
        )}
        {activeTab === "remarque" && (
          <div>
            <h2 className="text-xl mb-4">Remarque</h2>
            <button
              onClick={handleNoteToggle}
              className="px-4 py-2 rounded-md mb-4"
            >
              {isNoteOpen ? (
                "Annuler"
              ) : (
                <>
                  Ajouter{" "}
                  <FontAwesomeIcon
                    icon={faCirclePlus}
                    className="text-teal-600"
                  />
                </>
              )}
            </button>
            {isNoteOpen && (
              <div className="mt-4">
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Écrivez votre note ici..."
                  rows="4"
                ></textarea>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProspectDetail;
