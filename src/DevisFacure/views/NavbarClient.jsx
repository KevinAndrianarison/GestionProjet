import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faTrash,
  faPencil,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

function NavbarClient() {
  const { id } = useParams(); // Récupérer l'ID de l'URL
  const [prospect, setProspect] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("dataKey"); // Récupérer les données du localStorage
    if (storedData) {
      const prospects = JSON.parse(storedData); // Convertir les données en objet JavaScript
      const foundProspect = prospects.find((p) => p.id === parseInt(id)); // Chercher le prospect correspondant à l'ID
      setProspect(foundProspect); // Mettre à jour l'état avec le prospect trouvé
    }
  }, [id]);

  // Rendu alternatif si le prospect n'est pas trouvé
  return (
    <nav className="rounded-md flex justify-between items-center p-4 bg-slate-600 text-white">
      <div>
        <Link to="/" className="text-lg">
          {prospect ? `Client N° ${prospect.id}` : "Client non trouvé"}
        </Link>
      </div>
      <div className="flex space-x-4">
        <Link to={`/NouveauDevis/${id}`}>
          <FontAwesomeIcon
            icon={faPenToSquare}
            className="text-emerald-300 pr-1"
          />
          Nouvelle facture
        </Link>

        <Link to={`/NouveauDevis/${id}`}>
          <FontAwesomeIcon
            icon={faPenToSquare}
            className="text-emerald-300 pr-1"
          />
          Nouveau devis
        </Link>

        {prospect && ( // Vérifiez si le prospect existe avant d'afficher le lien Modifier
          <Link to={`/edit/${prospect.id}`}>
            <FontAwesomeIcon
              icon={faPencil}
              className="text-emerald-300 pr-1"
            />
            Modifier
          </Link>
        )}
      </div>
    </nav>
  );
}

export default NavbarClient;
