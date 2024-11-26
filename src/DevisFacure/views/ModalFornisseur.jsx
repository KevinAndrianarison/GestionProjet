import { useState } from 'react';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';

const ModalFornisseur = ({ isOpen, onClose, addFournisseur }) => {
  const [nom_societe, setNomSociete] = useState('');
  const [email_societe, setEmailSociete] = useState('');
  const [affilation_tva, setAffiliationTVA] = useState('');
  const [numero_tva, setNumeroTVA] = useState('');
  const [cabisse, setCabisse] = useState('');
  const [assurance, setAssurance] = useState('');
  const [tel_societe, setTelSociete] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [sexe, setSexe] = useState('');
  const [telephone, setTelephone] = useState('');
  const [site_web, setSiteWeb] = useState('');
  const [adresse, setAdresse] = useState('');
  const [ville, setVille] = useState('');
  const [pays, setPays] = useState('');
  const [numero_siren, setNumeroSiren] = useState('');
  const [numero_siret, setNumeroSiret] = useState('');
  const [type_fournisseur, setTypeFournisseur] = useState('societe');
  const [piece_identite, setPieceIdentite] = useState('');
  const [contrats, setContrats] = useState('');
  const [confirmer, setConfirmer] = useState('');
  const [errorMessage, setErrorMessage] = useState("");

  const resetFournisseurFields = () => {
    setNomSociete("");
    setEmailSociete("");
    setAffiliationTVA("");
    setNumeroTVA("");
    setCabisse("");
    setAssurance("");
    setTelSociete("");
    setNom("");
    setEmail("");
    setSexe("");
    setTelephone("");
    setSiteWeb("");
    setAdresse("");
    setVille("");
    setPays("");
    setNumeroSiren("");
    setNumeroSiret("");
    setTypeFournisseur("societe");
    setPieceIdentite("");
    setContrats("");
    setConfirmer("");
    setErrorMessage("");
  };

  const handleAddFournisseur = () => {
    setErrorMessage("");
    if (!email.includes("@") || !email.includes(".")) {
      setErrorMessage("Veuillez entrer une adresse e-mail valide.");
      return;
    }

    const newFournisseur = {
      nom_societe,
      email_societe,
      affilation_tva,
      numero_tva,
      cabisse,
      assurance,
      tel_societe,
      nom,
      email,
      sexe,
      telephone,
      site_web,
      adresse,
      ville,
      pays,
      numero_siren,
      numero_siret,
      piece_identite,
      contrats,
      confirmer,
      type: type_fournisseur,
    };

    if (
      (type_fournisseur === "societe" || type_fournisseur === "auto_entrepreneur") &&
      (!newFournisseur.nom_societe || !newFournisseur.nom_societe.trim())
    ) {
      setErrorMessage("Le nom de la société est requis pour ce type de fournisseur.");
      return;
    }

    if (
      type_fournisseur === "particulier" &&
      (!newFournisseur.nom || !newFournisseur.nom.trim())
    ) {
      setErrorMessage("Le nom responsable est requis pour le type 'particulier'.");
      return;
    }

    addFournisseur(newFournisseur);
    resetFournisseurFields();

    Swal.fire({
      title: "Succès!",
      text: "Fournisseur ajouté avec succès!",
      icon: "success",
      confirmButtonText: "OK",
    });
    onClose();
  };


  const handleClickOutside = (e) => {
    if (e.target.id === 'modal-background') {
      onClose();
      resetFournisseurFields();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center ${isOpen ? 'block' : 'hidden'
        }`}
      onClick={handleClickOutside}
      id="modal-background">
      <div className="bg-white w-3/4 md:w-2/3 lg:w-1/2 p-8 rounded-lg shadow-lg relative">
        <button
          onClick={() => { onClose(); resetFournisseurFields() }}
          className="absolute top-2 right-2 text-red-500 text-3xl mr-5">
          &times;
        </button>
        <h2 className="text-xl mx-2">Nouveau fournisseur</h2>
        <form className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div className="mx-2">
            <label className="block text-sm font-medium text-gray-700 my-2">Type de fournisseur</label>
            <div className="flex space-x-4">
              <label>
                <input
                  type="radio"
                  value="societe"
                  checked={type_fournisseur === "societe"}
                  onChange={() => setTypeFournisseur("societe")}
                  className="mr-2"
                />
                Société
              </label>
              <label>
                <input
                  type="radio"
                  value="particulier"
                  checked={type_fournisseur === "particulier"}
                  onChange={() => setTypeFournisseur("particulier")}
                  className="mr-2"
                />
                Particulier
              </label>
              <label>
                <input
                  type="radio"
                  value="auto_entrepreneur"
                  checked={type_fournisseur === "auto_entrepreneur"}
                  onChange={() => setTypeFournisseur("auto_entrepreneur")}
                  className="mr-2"
                />
                Auto entrepreneur
              </label>
            </div>
          </div>
              {errorMessage && (
                <span className="text-red-600 text-sm">{errorMessage}</span>
              )}
          <div className='rounded-lg shadow-lg w-full overflow-y-auto max-h-[75vh]'>
            <div className="">
              <div className='border rounded-t-xl'>
                {type_fournisseur !== "particulier" && (
                  <>
                    <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                      <label className="block text-sm font-medium text-gray-700 my-2">Nom société</label>
                      <input
                        type="text"
                        value={nom_societe}
                        onChange={(e) => setNomSociete(e.target.value)}
                        placeholder="Nom de la société"
                        className="w-full p-2 rounded text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                      <label className="block text-sm font-medium text-gray-700 my-2">Email société</label>
                      <input
                        type="text"
                        value={email_societe}
                        onChange={(e) => setEmailSociete(e.target.value)}
                        placeholder="Email de la société"
                        className="w-full p-2 rounded text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                      <label className="block text-sm font-medium text-gray-700 my-2">Téléphone société</label>
                      <input
                        type="text"
                        value={tel_societe}
                        onChange={(e) => setTelSociete(e.target.value)}
                        placeholder="Téléphone société"
                        className="w-full p-2 rounded text-sm"
                      />
                    </div>
                  </>
                )}
                <div className="grid grid-cols-2 px-4 py-1 border-b">
                  <label className="block text-sm font-medium text-gray-700 my-2">Nom responsable</label>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Nom responsable"
                    className="w-full p-2 rounded text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 px-4 py-1 border-b">
                  <label className="block text-sm font-medium text-gray-700 my-2">Email responsable</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email responsable"
                    className="w-full p-2 rounded text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 px-4 py-1 border-b">
                  <label className="block text-sm font-medium text-gray-700 my-2">Téléphone responsable</label>
                  <input
                    type="text"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    placeholder="Téléphone responsable"
                    className="w-full p-2 rounded text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 px-4 py-1 border-b">
                  <label className="block text-sm font-medium text-gray-700 my-2">Genre responsable</label>
                  <select
                    value={sexe}
                    onChange={(e) => setSexe(e.target.value)}
                    className="w-full p-2 rounded text-sm">
                    <option value="">Non precisé</option>
                    <option value="homme">Monsieur</option>
                    <option value="femme">Madame</option>
                  </select>
                </div>
                {type_fournisseur !== "particulier" && (
                  <div className="grid grid-cols-2 px-4 py-1 border-b">
                    <label className="block text-sm font-medium text-gray-700 my-2">
                      Site Web
                    </label>
                    <input
                      type="text"
                      value={site_web}
                      onChange={(e) => setSiteWeb(e.target.value)}
                      placeholder="Site Web"
                      className="w-full p-2 rounded text-sm"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 px-4 py-1 border-b">
                  <label className="block text-sm font-medium text-gray-700 my-2">Adresse</label>
                  <input
                    type="text"
                    value={adresse}
                    onChange={(e) => setAdresse(e.target.value)}
                    placeholder="Adresse"
                    className="w-full p-2 rounded text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 px-4 py-1 border-b">
                  <label className="block text-sm font-medium text-gray-700 my-2">Ville</label>
                  <input
                    type="text"
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    placeholder="Ville"
                    className="w-full p-2 rounded text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 px-4 py-1 border-b">
                  <label className="block text-sm font-medium text-gray-700 my-2">Pays</label>
                  <input
                    type="text"
                    value={pays}
                    onChange={(e) => setPays(e.target.value)}
                    placeholder="Pays"
                    className="w-full p-2 rounded text-sm"
                  />
                </div>
                {type_fournisseur !== "particulier" && (
                  <div className="grid grid-cols-2 px-4 py-1 border-b">
                    <label className="block text-sm font-medium text-gray-700 my-2">Numéro SIREN</label>
                    <input
                      type="text"
                      value={numero_siren}
                      onChange={(e) => setNumeroSiren(e.target.value)}
                      placeholder="Numéro SIREN"
                      className="w-full p-2 rounded text-sm"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 px-4 py-1 border-b">
                  <label className="block text-sm font-medium text-gray-700 my-2">Piece d'identité</label>
                  <input
                    type="text"
                    value={piece_identite}
                    onChange={(e) => setPieceIdentite(e.target.value)}
                    placeholder="Piece d'identité"
                    className="w-full p-2 rounded text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 px-4 py-1 border-b">
                  <label className="block text-sm font-medium text-gray-700 my-2">Affilation TVA</label>
                  <select
                    value={affilation_tva}
                    onChange={(e) => setAffiliationTVA(e.target.value)}
                    className="w-full p-2 rounded text-sm">
                    <option value="non">Non</option>
                    <option value="oui">Oui</option>
                  </select>
                </div>
                {affilation_tva === "oui" && (
                <div className="grid grid-cols-2 px-4 py-1 border-b">
                  <label className="block text-sm font-medium text-gray-700 my-2">Numero TVA</label>
                  <input
                    type="text"
                    value={numero_tva}
                    onChange={(e) => setNumeroTVA(e.target.value)}
                    placeholder="numero_tva"
                    className="w-full p-2 rounded text-sm"
                  />
                </div>
                 )}
                <div className="grid grid-cols-2 px-4 py-1 border-b">
                  <label className="block text-sm font-medium text-gray-700 my-2">Cabisse</label>
                  <input
                    type="text"
                    value={cabisse}
                    onChange={(e) => setCabisse(e.target.value)}
                    placeholder="cabisse"
                    className="w-full p-2 rounded text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 px-4 py-1 border-b">
                  <label className="block text-sm font-medium text-gray-700 my-2">Assurance</label>
                  <input
                    type="text"
                    value={assurance}
                    onChange={(e) => setAssurance(e.target.value)}
                    placeholder="assurance"
                    className="w-full p-2 rounded text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 px-4 py-1 border-b">
                  <label className="block text-sm font-medium text-gray-700 my-2">Contrats</label>
                  <input
                    type="text"
                    value={contrats}
                    onChange={(e) => setContrats(e.target.value)}
                    placeholder="contrats"
                    className="w-full p-2 rounded text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 px-4 py-1 border-b">
                  <label className="block text-sm font-medium text-gray-700 my-2">Confirmation</label>
                  <input
                    type="text"
                    value={confirmer}
                    onChange={(e) => setConfirmer(e.target.value)}
                    placeholder="confirmer"
                    className="w-full p-2 rounded text-sm"
                  />
                </div>
              </div>
              <div className="lg:col-span-1 mt-6">
                <button
                  type="button"
                  onClick={handleAddFournisseur}
                  className="w-1/2 bg-blue-500 text-white p-2 rounded text-sm hover:bg-blue-600"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

ModalFornisseur.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  addFournisseur: PropTypes.func.isRequired,
};

export default ModalFornisseur;