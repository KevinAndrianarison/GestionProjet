import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarClient from "./NavbarClient";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // États pour les informations de l'utilisateur
  const [nom, setNom] = useState("");
  const [nom_societe, setNomSociete] = useState("");
  const [email, setEmail] = useState("");
  const [sexe, setSexe] = useState("");
  const [telephone, setTelephone] = useState("");
  const [site_web, setSiteWeb] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [pays, setPays] = useState("");
  const [numero_siren, setNumeroSiren] = useState("");
  const [typeClient, setTypeClient] = useState("societe"); // Valeur par défaut
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Récupérer les données de l'utilisateur à partir du localStorage
    const prospects = JSON.parse(localStorage.getItem("dataKey")) || [];
    const user = prospects.find((prospect) => prospect.id === parseInt(id));

    if (user) {
      setNom(user.nom);
      setNomSociete(user.nom_societe || ""); // Assurez-vous que ce champ existe dans votre objet
      setEmail(user.email || "");
      setSexe(user.sexe || "");
      setTelephone(user.telephone || "");
      setSiteWeb(user.site_web || "");
      setAdresse(user.adresse || "");
      setVille(user.ville || "");
      setPays(user.pays || "");
      setNumeroSiren(user.numero_siren || "");
      setTypeClient(user.type_client || "societe"); // Assurez-vous que ce champ existe
    } else {
      navigate("/"); // Rediriger vers la liste si l'utilisateur n'est pas trouvé
    }
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(""); // Réinitialiser le message d'erreur

    if (!nom || !email) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    // Récupérer et mettre à jour la liste des prospects
    const prospects = JSON.parse(localStorage.getItem("dataKey")) || [];
    const updatedProspects = prospects.map((prospect) => {
      if (prospect.id === parseInt(id)) {
        return {
          ...prospect,
          nom,
          nom_societe,
          email,
          sexe,
          telephone,
          site_web,
          adresse,
          ville,
          pays,
          numero_siren,
          typeClient, // Mettez à jour le type de client
        };
      }
      return prospect;
    });

    // Sauvegarder les données mises à jour dans le localStorage
    localStorage.setItem("dataKey", JSON.stringify(updatedProspects));
    navigate(`/ProspectDetail/${id}`);
  };

  return (
    <div className="">
      <NavbarClient />

      <h2 className="text-xl py-2">Modifier le client</h2>
      {errorMessage && <span className="text-red-600">{errorMessage}</span>}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Nom de société
          </label>
          <input
            type="text"
            value={nom_societe}
            onChange={(e) => setNomSociete(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Sexe
          </label>
          <input
            type="text"
            value={sexe}
            onChange={(e) => setSexe(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Téléphone
          </label>
          <input
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Site web
          </label>
          <input
            type="url"
            value={site_web}
            onChange={(e) => setSiteWeb(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Adresse
          </label>
          <input
            type="text"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Ville
          </label>
          <input
            type="text"
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Pays
          </label>
          <input
            type="text"
            value={pays}
            onChange={(e) => setPays(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Numéro SIREN
          </label>
          <input
            type="text"
            value={numero_siren}
            onChange={(e) => setNumeroSiren(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default EditUser;
