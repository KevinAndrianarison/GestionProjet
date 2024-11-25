import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ModalEditFournisseur = ({ isOpen, onClose, fournisseurToEdit, updateFournisseur }) => {
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        nom_societe: '',
        note: '',
        nom: '',
        email: '',
        sexe: '',
        telephone: '',
        site_web: '',
        adresse: '',
        ville: '',
        pays: '',
        numero_siren: '',
        type: '',
      });
      setErrorMessage('');
    }
  }, [isOpen]);
  

  const [formData, setFormData] = useState({
    nom_societe: '',
    note: '',
    nom: '',
    email: '',
    sexe: '',
    telephone: '',
    site_web: '',
    adresse: '',
    ville: '',
    pays: '',
    numero_siren: '',
    type: '',
  }); 

  useEffect(() => {
    if (fournisseurToEdit) {
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

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center ${isOpen ? 'block' : 'hidden'
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
        <form
          className="grid grid-cols-1 lg:grid-cols-1 gap-6 overflow-y-auto max-h-[75vh]"
          onSubmit={handleSubmit}
        >
          <div className="">
            <div className="mx-2 my-4">
              <label className="block text-sm font-medium text-gray-700 my-2">Type de fournisseur</label>
              <div className="flex space-x-4">
                <label>
                  <input
                    type="radio"
                    name="type"
                    value="societe"
                    checked={formData.type === "societe"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Société
                </label>
                <label>
                  <input
                    type="radio"
                    name="type"
                    value="particulier"
                    checked={formData.type === "particulier"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Particulier
                </label>
                <label>
                  <input
                    type="radio"
                    name="type"
                    value="auto_entrepreneur"
                    checked={formData.type === "auto_entrepreneur"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Auto Entrepreneur
                </label>
              </div>
            </div>
            <div>
              {errorMessage && (
                <span className="text-red-600 text-sm">{errorMessage}</span>
              )}
            </div>
            <div className='border rounded-t-xl'>
              {formData.type !== "particulier" && (
                <div className="grid grid-cols-2 px-4 py-3 border-b rounded-t-xl">
                  <label className="block text-sm font-medium text-gray-700 my-2">Nom de la société</label>
                  <input
                    type="text"
                    name="nom_societe"
                    value={formData.nom_societe}
                    onChange={handleChange}
                    placeholder="Nom de la société"
                    className="w-full p-2 rounded text-sm"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 px-4 py-3 border-b">
                <label className="block text-sm font-medium text-gray-700 my-2">Nom responsable</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Nom"
                  className="w-full p-2 rounded text-sm"
                />
              </div>
              <div className="grid grid-cols-2 px-4 py-3 border-b">
                <label className="block text-sm font-medium text-gray-700 my-2">Email responsable</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full p-2 rounded text-sm"
                />
              </div>
              <div className="grid grid-cols-2 px-4 py-3 border-b">
                <label className="block text-sm font-medium text-gray-700 my-2">Téléphone responsable</label>
                <input
                  type="text"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="Téléphone"
                  className="w-full p-2 rounded text-sm"
                />
              </div>
              <div className="grid grid-cols-2 px-4 py-3 border-b">
                <label className="block text-sm font-medium text-gray-700 my-2">
                  Genre responsable
                </label>
                <select
                  name="sexe"
                  value={formData.sexe}
                  onChange={handleChange}
                  className="w-full p-2 rounded text-sm">
                  <option value="">Non précisé</option>
                  <option value="homme">Monsieur</option>
                  <option value="femme">Madame</option>
                </select>
              </div>
              {formData.type !== "particulier" && (
                <div className="grid grid-cols-2 px-4 py-3 border-b">
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
              <div className="grid grid-cols-2 px-4 py-3 border-b">
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
              <div className="grid grid-cols-2 px-4 py-3 border-b">
                <label className="block text-sm font-medium text-gray-700 my-2">Ville</label>
                <input
                  type="text"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  placeholder="Ville"
                  className="w-full p-2 rounded text-sm"
                />
              </div>
              <div className="grid grid-cols-2 px-4 py-3 border-b">
                <label className="block text-sm font-medium text-gray-700 my-2">Pays</label>
                <input
                  type="text"
                  name="pays"
                  value={formData.pays}
                  onChange={handleChange}
                  placeholder="Pays"
                  className="w-full p-2 rounded text-sm"
                />
              </div>
              {formData.type !== "particulier" && (
                <div className="grid grid-cols-2 px-4 py-3 border-b">
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
              )}
              <div className="grid grid-cols-2 px-4 py-3 border-b">
                  <label className="block text-sm font-medium text-gray-700 my-2">Note</label>
                  <input
                    type="text"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Note"
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
