import { useState } from 'react';
import PropTypes from 'prop-types';
import useGeonames from '../contextes/useGeonames';
import Select from 'react-select';

const ModalFornisseur = ({ isOpen, onClose, addFournisseur }) => {
  const { countriesAndCities, loading, error } = useGeonames();
  const [filteredCities, setFilteredCities] = useState([]);


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
      ville: ville?.value,
      pays: pays?.value,
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


    onClose();
  };


  const handleClickOutside = (e) => {
    if (e.target.id === 'modal-background') {
      onClose();
      resetFournisseurFields();
    }
  };

  const handleCountryChange = (selectedCountry) => {
    setPays(selectedCountry);
    setVille(null);
    const country = countriesAndCities.find((c) => c.pays === selectedCountry.value);
    setFilteredCities(country ? country.villes : []);
  };

  return (
    <div
      className={`mt-16 fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center ${isOpen ? 'block' : 'hidden'
        }`}
      onClick={handleClickOutside}
      id="modal-background">
      <div className="bg-white w-3/4 md:w-2/3 lg:w-1/2 p-6 rounded-lg shadow-lg relative">
        <div >
          <div >
            <button
              onClick={() => { onClose(); resetFournisseurFields() }}
              className="absolute top-2 right-2 text-red-500 text-3xl mr-5">
              &times;
            </button>
            <h2 className="text-xl mx-2">Nouveau fournisseur</h2>
          </div>
        </div>

        <form className="grid grid-cols-1 lg:grid-cols-1 gap-4 mt-2">
          <div>
            <div className="flex space-x-2">
              <div className="flex-1 p-1">
                <div
                  onClick={() => setTypeFournisseur("societe")}
                  className={`cursor-pointer px-4 py-2 border rounded-lg ${type_fournisseur === "societe"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                    }`}
                >
                  Société
                </div>
              </div>
              <div className="flex-1 p-1">
                <div
                  onClick={() => setTypeFournisseur("auto_entrepreneur")}
                  className={`cursor-pointer px-4 py-2 border rounded-lg ${type_fournisseur === "auto_entrepreneur"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                    }`}
                >
                  Auto-Entrepreneur
                </div>
              </div>
              <div className="flex-1 p-1">
                <div
                  onClick={() => setTypeFournisseur("particulier")}
                  className={`cursor-pointer px-4 py-2 border rounded-lg ${type_fournisseur === "particulier"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                    }`}
                >
                  Particulier
                </div>
              </div>
            </div>
          </div>
          {errorMessage && (
            <span className="text-red-600 text-sm">{errorMessage}</span>
          )}
          <div className='border rounded-t-xl overflow-y-auto max-h-[55vh] rounded-lg shadow-md w-full'>
            {type_fournisseur === "societe" && (
              <>
                <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                  <label className="block text-sm font-medium text-gray-700 my-2">Dénomination de la société</label>
                  <input
                    type="text"
                    value={nom_societe}
                    onChange={(e) => setNomSociete(e.target.value)}
                    className="w-full p-2 rounded text-sm"
                    placeholder='Dénomination de la société'
                  />
                </div>
                <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                  <label className="block text-sm font-medium text-gray-700 my-2">Email de la société</label>
                  <input
                    type="text"
                    value={email_societe}
                    onChange={(e) => setEmailSociete(e.target.value)}
                    className="w-full p-2 rounded text-sm"
                    placeholder='Email de la société'
                  />
                </div>
                <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                  <label className="block text-sm font-medium text-gray-700 my-2">{type_fournisseur === "societe" ? "Téléphone du contact" : "Numéro de téléphone"}</label>
                  <input
                    type="text"
                    value={tel_societe}
                    onChange={(e) => setTelSociete(e.target.value)}
                    className="w-full p-2 rounded text-sm"
                    placeholder='Téléphone de la société'
                  />
                </div>
              </>
            )}
            <div className="grid grid-cols-2 px-4 py-1 border-b">
              <label className="block text-sm font-medium text-gray-700 my-2">
                {type_fournisseur === "societe" ? "Nom complet du contact" : "Nom complet"}
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="w-full p-2 rounded text-sm"
                placeholder={type_fournisseur === "societe" ? "Nom complet du contact" : "Nom complet"}

              />
            </div>
            <div className="grid grid-cols-2 px-4 py-1 border-b">
              <label className="block text-sm font-medium text-gray-700 my-2">{type_fournisseur === "societe" ? "Email du contact" : "Adresse e-mail"}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded text-sm"
                placeholder={type_fournisseur === "societe" ? "Email du contact" : "Adresse e-mail"}
              />
            </div>
            <div className="grid grid-cols-2 px-4 py-1 border-b">
              <label className="block text-sm font-medium text-gray-700 my-2">{type_fournisseur === "societe" ? "Téléphone du contact" : "Numéro de téléphone"}</label>
              <input
                type="text"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="w-full p-2 rounded text-sm"
                placeholder={type_fournisseur === "societe" ? "Téléphone du contact" : "Numéro de téléphone"}
              />
            </div>
            <div className="grid grid-cols-2 px-4 py-1 border-b">
              <label className="block text-sm font-medium text-gray-700 my-2">Genre responsable</label>
              <select
                value={sexe}
                onChange={(e) => setSexe(e.target.value)}
                className="w-full p-2 rounded text-sm  text-gray-700">
                <option value=""></option>
                <option value="homme">Masculin</option>
                <option value="femme">Féminin</option>
                <option value="non_precise">Non précisé</option>
              </select>
            </div>
            {type_fournisseur === "societe" && (
              <>
                <div className="grid grid-cols-2 px-4 py-1 border-b">
                  <label className="block text-sm font-medium text-gray-700 my-2">
                    Site Web
                  </label>
                  <input
                    type="text"
                    value={site_web}
                    onChange={(e) => setSiteWeb(e.target.value)}
                    className="w-full p-2 rounded text-sm"
                    placeholder='Site Web'
                  />
                </div>
                <div className="grid grid-cols-2 px-4 py-1 border-b">
              <label className="block text-sm font-medium text-gray-700 my-2">Affilation TVA</label>
              <select
                value={affilation_tva}
                onChange={(e) => setAffiliationTVA(e.target.value)}
                className="w-full p-2 rounded text-sm  text-gray-700">
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
                  className="w-full p-2 rounded text-sm"
                  placeholder='Numéro TVA'
                />
              </div>
            )}

              </>
            )}
            <div className="grid grid-cols-2 px-4 py-1 border-b">
              <label className="block text-sm font-medium text-gray-700 my-2">Adresse</label>
              <input
                type="text"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                className="w-full p-2 rounded text-sm"
                placeholder='Adresse'
              />
            </div>
            <div>
              {loading && <p>Chargement...</p>}
              {error && <p>{error}</p>}

              {!loading && !error && (
                <>
                  {/* Select pour les pays */}
                  <div className="grid grid-cols-2 px-4 py-1 border-b">
                    <label className="block text-sm font-medium text-gray-700 my-2">
                      Pays
                    </label>
                    <Select value={pays}
                      options={countriesAndCities.map((country) => ({
                        value: country.pays,
                        label: country.pays,
                      }))}
                      onChange={handleCountryChange}
                      placeholder="Sélectionnez un pays"
                      className="basic-select"
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 px-4 py-1 border-b">
                    <label className="block text-sm font-medium text-gray-700 my-2">Ville</label>
                    <Select
                      options={filteredCities.map((city) => ({
                        value: city,
                        label: city,
                      }))}
                      value={ville}
                      onChange={(selectedCity) => setVille(selectedCity)}
                      isDisabled={!pays}
                      placeholder={!pays ? "Veuillez d'abord choisir un pays" : "Sélectionner une ville"}
                      className="w-full rounded text-sm"
                    />
                  </div>
                </>
              )}
            </div>

            {type_fournisseur === "societe" && (
              <>
              <div className="grid grid-cols-2 px-4 py-1 border-b">
                <label className="block text-sm font-medium text-gray-700 my-2">Numéro SIREN</label>
                <input
                  type="text"
                  value={numero_siren}
                  onChange={(e) => setNumeroSiren(e.target.value)}
                  className="w-full p-2 rounded text-sm"
                  placeholder='Numéro SIREN'
                />
              </div>
              <div className="grid grid-cols-2 px-4 py-1 border-b">
              <label className="block text-sm font-medium text-gray-700 my-2">Numéro SIRET</label>
              <input
                type="text"
                value={numero_siret}
                onChange={(e) => setNumeroSiret(e.target.value)}
                className="w-full p-2 rounded text-sm"
                placeholder='Numéro SIRET'
              />
            </div>
            </>
            )}
            <div className="grid grid-cols-2 px-4 py-1 border-b">
              <label className="block text-sm font-medium text-gray-700 my-2">Piece d'identité</label>
              <input
                type="text"
                value={piece_identite}
                onChange={(e) => setPieceIdentite(e.target.value)}
                className="w-full p-2 rounded text-sm"
                placeholder="Piece d'identité"
              />
            </div>
            
            <div className="grid grid-cols-2 px-4 py-1 border-b">
              <label className="block text-sm font-medium text-gray-700 my-2">Cabisse</label>
              <input
                type="text"
                value={cabisse}
                onChange={(e) => setCabisse(e.target.value)}
                className="w-full p-2 rounded text-sm"
                placeholder='Cabisse'
              />
            </div>
            <div className="grid grid-cols-2 px-4 py-1 border-b">
              <label className="block text-sm font-medium text-gray-700 my-2">Assurance</label>
              <input
                type="text"
                value={assurance}
                onChange={(e) => setAssurance(e.target.value)}
                className="w-full p-2 rounded text-sm"
                placeholder='Assurance'
              />
            </div>
            <div className="grid grid-cols-2 px-4 py-1 border-b">
              <label className="block text-sm font-medium text-gray-700 my-2">Contrats</label>
              <input
                type="text"
                value={contrats}
                onChange={(e) => setContrats(e.target.value)}
                className="w-full p-2 rounded text-sm"
                placeholder='Contrats'
              />
            </div>
          </div>
          <div className="lg:col-span-1">
            <button
              type="button"
              onClick={handleAddFournisseur}
              className="w-1/2 bg-blue-500 text-white p-2 rounded text-sm hover:bg-blue-600"
            >
              Enregistrer
            </button>
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