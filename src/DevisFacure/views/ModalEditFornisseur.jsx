import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useGeonames from '../contextes/useGeonames';
import Select from 'react-select';

const ModalEditFournisseur = ({ isOpen, onClose, fournisseurToEdit, updateFournisseur }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const { countriesAndCities, loading, error } = useGeonames();
  const [filteredCities, setFilteredCities] = useState([]);
  const [pays, setPays] = useState(null);
  const [ville, setVille] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        nom_societe: '',
        email_societe: '',
        affilation_tva: '',
        numero_tva: '',
        cabisse: '',
        assurance: '',
        tel_societe: '',
        nom: '',
        email: '',
        sexe: '',
        telephone: '',
        site_web: '',
        adresse: '',
        ville: '',
        pays: '',
        numero_siren: '',
        numero_siret: '',
        piece_identite: '',
        contrats: '',
        confirmer: '',
        type: '',
      });
      setErrorMessage('');
    }
  }, [isOpen]);


  const [formData, setFormData] = useState({
    nom_societe: '',
    email_societe: '',
    affilation_tva: '',
    numero_tva: '',
    cabisse: '',
    assurance: '',
    tel_societe: '',
    nom: '',
    email: '',
    sexe: '',
    telephone: '',
    site_web: '',
    adresse: '',
    ville: '',
    pays: '',
    numero_siren: '',
    numero_siret: '',
    piece_identite: '',
    contrats: '',
    confirmer: '',
    type: '',
  });

  useEffect(() => {
    if (fournisseurToEdit && Object.keys(fournisseurToEdit).length > 0) {
      setFormData(fournisseurToEdit);
    }
  }, [fournisseurToEdit]);

  useEffect(() => {
    if (formData.type === "particulier") {
      setFormData(prev => ({
        ...prev,
        nom_societe: null,
        numero_siren: null,
        site_web: null,
      }));
    }
  }, [formData.type]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage("Veuillez entrer une adresse e-mail valide.");
      return;
    }

    if (
      (formData.type === "societe" || formData.type === "auto_entrepreneur") &&
      (!formData.nom_societe || !formData.nom_societe.trim())
    ) {
      setErrorMessage("Le nom de la société est requis pour ce type de fournisseur.");
      return;
    }

    if (
      formData.type === "particulier" &&
      (!formData.nom || !formData.nom.trim())
    ) {
      setErrorMessage("Le nom responsable est requis pour le type 'particulier'.");
      return;
    }

    updateFournisseur(formData);
    onClose();
  };

  if (!isOpen) return null;

  const handleClickOutside = (e) => {
    if (e.target.id === 'modal-background') {
      onClose();
      setErrorMessage("");
    }
  };

  const handleCountryChange = (selectedCountry) => {
    setFormData((prev) => ({
      ...prev,
      pays: selectedCountry ? selectedCountry.value : '',
      ville: '', // Réinitialiser la ville lorsque le pays change
    }));

    // Mettre à jour les villes filtrées
    const country = countriesAndCities.find((c) => c.pays === selectedCountry.value);
    setFilteredCities(country ? country.villes : []);
  };


  const handleCityChange = (selectedCity) => {
    setFormData((prev) => ({
      ...prev,
      ville: selectedCity ? selectedCity.value : '',
    }));
  };


  return (
    <div
      className={`mt-16 fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center ${isOpen ? 'block' : 'hidden'
        }`}
      onClick={handleClickOutside}
      id="modal-background"
    >
      <div className="bg-white w-3/4 md:w-2/3 lg:w-1/2 p-8 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 text-3xl mr-5"
        >
          &times;
        </button>

        <h2 className="text-xl mx-2">Modifier le fournisseur</h2>

        <form className="grid grid-cols-1 lg:grid-cols-1 gap-4 mt-2" onSubmit={handleSubmit}>
          <div>
            <div className="flex space-x-2">
              <div className="flex-1 p-1">
                <div
                  type="button"
                  name="type"
                  value="societe"
                  onClick={() => setFormData((prev) => ({ ...prev, type: 'societe' }))}
                  className={`cursor-pointer px-4 py-2 border rounded-lg ${formData.type === "societe"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                    }`}
                >
                  Société
                </div>
              </div>
              <div className="flex-1 p-1">
                <div
                  type="button"
                  name="type"
                  value="auto_entrepreneur"
                  onClick={() => setFormData((prev) => ({ ...prev, type: 'auto_entrepreneur' }))}
                  className={`cursor-pointer px-4 py-2 border rounded-lg ${formData.type === "auto_entrepreneur"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                    }`}>
                  Auto-Entrepreneur
                </div>
              </div>
              <div className="flex-1 p-1">
                <div
                  type="button"
                  name="type"
                  value="particulier"
                  onClick={() => setFormData((prev) => ({ ...prev, type: 'particulier' }))}
                  className={`cursor-pointer px-4 py-2 border rounded-lg ${formData.type === "particulier"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-900"
                    }`}>
                  Particulier
                </div>
              </div>
            </div>
          </div>

          <div className="">

            <div>
              {errorMessage && (
                <span className="text-red-600 text-sm">{errorMessage}</span>
              )}
            </div>
            <div className='border rounded-t-xl overflow-y-auto max-h-[55vh]'>
              {formData.type == "societe" && (
                <>
                  <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                    <label className="block text-sm font-medium text-gray-700 my-2">Nom société</label>
                    <input
                      type="text"
                      name="nom_societe"
                      value={formData.nom_societe}
                      onChange={handleChange}
                      placeholder="Nom société"
                      className="w-full p-2 rounded text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                    <label className="block text-sm font-medium text-gray-700 my-2">Email société</label>
                    <input
                      type="text"
                      name="email_societe"
                      value={formData.email_societe}
                      onChange={handleChange}
                      placeholder="Email société"
                      className="w-full p-2 rounded text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 px-4 py-1 border-b rounded-t-xl">
                    <label className="block text-sm font-medium text-gray-700 my-2">Téléphone société</label>
                    <input
                      type="text"
                      name="tel_societe"
                      value={formData.tel_societe}
                      onChange={handleChange}
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
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Nom responsable"
                  className="w-full p-2 rounded text-sm"
                />
              </div>
              <div className="grid grid-cols-2 px-4 py-1 border-b">
                <label className="block text-sm font-medium text-gray-700 my-2">Email responsable</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email responsable"
                  className="w-full p-2 rounded text-sm"
                />
              </div>
              <div className="grid grid-cols-2 px-4 py-1 border-b">
                <label className="block text-sm font-medium text-gray-700 my-2">Téléphone responsable</label>
                <input
                  type="text"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="Télephone responsable"
                  className="w-full p-2 rounded text-sm"
                />
              </div>
              <div className="grid grid-cols-2 px-4 py-1 border-b">
                <label className="block text-sm font-medium text-gray-700 my-2">
                  Genre
                </label>
                <select
                  name="sexe"
                  value={formData.sexe}
                  onChange={handleChange}
                  className="w-full p-2 rounded text-sm">
                  <option value=""></option>
                  <option value="homme">Monsieur</option>
                  <option value="femme">Madame</option>
                  <option value="non_precise">Non précisé</option>
                </select>
              </div>
              {formData.type === "societe" && (
                <div className="grid grid-cols-2 px-4 py-1 border-b">
                  <label className="block text-sm font-medium text-gray-700 my-2">
                    Site Web
                  </label>
                  <input
                    type="text"
                    name="site_web"
                    value={formData.site_web}
                    onChange={handleChange}
                    className="w-full p-2 rounded text-sm"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 px-4 py-1 border-b">
                <label className="block text-sm font-medium text-gray-700 my-2">Adresse</label>
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  placeholder="Adresse"
                  className="w-full p-2 rounded text-sm"
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
                      <Select
                        value={formData.pays ? { value: formData.pays, label: formData.pays } : null}
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
                        value={formData.ville ? { value: formData.ville, label: formData.ville } : null}
                        options={filteredCities.map((city) => ({
                          value: city,
                          label: city,
                        }))}
                        onChange={handleCityChange}
                        isDisabled={!formData.pays}
                        placeholder={!formData.pays ? "Veuillez d'abord choisir un pays" : "Sélectionner une ville"}
                        className="basic-select"
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />

                    </div>
                  </>
                )}
              </div>
              {formData.type === "societe" && (
                <>
                  <div className="grid grid-cols-2 px-4 py-1 border-b">
                    <label className="block text-sm font-medium text-gray-700 my-2">Numéro SIREN</label>
                    <input
                      type="text"
                      name="numero_siren"
                      value={formData.numero_siren}
                      onChange={handleChange}
                      placeholder="Numéro SIREN"
                      className="w-full p-2 rounded text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 px-4 py-1 border-b">
                    <label className="block text-sm font-medium text-gray-700 my-2">Numéro SIRET</label>
                    <input
                      type="text"
                      name="numero_siret"
                      value={formData.numero_siret}
                      onChange={handleChange}
                      placeholder="Numéro SIRET"
                      className="w-full p-2 rounded text-sm"
                    />
                  </div>
                </>
              )}
              <div className="grid grid-cols-2 px-4 py-1 border-b">
                <label className="block text-sm font-medium text-gray-700 my-2">Piece d'identité</label>
                <input
                  type="text"
                  name="piece_identite"
                  value={formData.piece_identite}
                  onChange={handleChange}
                  placeholder="Piece d'identité"
                  className="w-full p-2 rounded text-sm"
                />
              </div>
              <div className="grid grid-cols-2 px-4 py-1 border-b">
                <label className="block text-sm font-medium text-gray-700 my-2">Affilation TVA</label>
                <select
                  name="affilation_tva"
                  value={formData.affilation_tva}
                  onChange={handleChange}
                  className="w-full p-2 rounded text-sm">
                  <option value="non">Non</option>
                  <option value="oui">Oui</option>
                </select>
              </div>
              {formData.affilation_tva === "oui" && (
                <div className="grid grid-cols-2 px-4 py-1 border-b">
                  <label className="block text-sm font-medium text-gray-700 my-2">Numero TVA</label>
                  <input
                    type="text"
                    name="numero_tva"
                    value={formData.numero_tva}
                    onChange={handleChange}
                    placeholder="Numero TVA"
                    className="w-full p-2 rounded text-sm"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 px-4 py-1 border-b">
                <label className="block text-sm font-medium text-gray-700 my-2">Cabisse</label>
                <input
                  type="text"
                  name="cabisse"
                  value={formData.cabisse}
                  onChange={handleChange}
                  placeholder="Cabisse"
                  className="w-full p-2 rounded text-sm"
                />
              </div>
              <div className="grid grid-cols-2 px-4 py-1 border-b">
                <label className="block text-sm font-medium text-gray-700 my-2">Assurance</label>
                <input
                  type="text"
                  name="assurance"
                  value={formData.assurance}
                  onChange={handleChange}
                  placeholder="Assurance"
                  className="w-full p-2 rounded text-sm"
                />
              </div>
              <div className="grid grid-cols-2 px-4 py-1 border-b">
                <label className="block text-sm font-medium text-gray-700 my-2">Contrats</label>
                <input
                  type="text"
                  name="contrats"
                  value={formData.contrats}
                  onChange={handleChange}
                  placeholder="contrats"
                  className="w-full p-2 rounded text-sm"
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <button
              type="submit"
              className="w-1/2 bg-blue-500 text-white p-2 rounded text-sm hover:bg-blue-600">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ModalEditFournisseur.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fournisseurToEdit: PropTypes.object,
  updateFournisseur: PropTypes.func.isRequired,
};

export default ModalEditFournisseur;
