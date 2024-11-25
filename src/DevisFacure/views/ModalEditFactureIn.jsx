import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ModalEditFactureIn = ({ isOpen, onClose, factureToEdit, updateFacture }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    numero: '',
    montant_ht: '',
    montant_ttc: '',
    prix_tva: '',
    pourcentage_tva: '',
    date_facturation: '',
    date_enregistrement: '',
    type_assigner: '',
    validation: '',
    piece_jointe: '',
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        numero: '',
        montant_ht: '',
        montant_ttc: '',
        prix_tva: '',
        pourcentage_tva: '',
        date_facturation: '',
        date_enregistrement: '',
        type_assigner: '',
        validation: '',
        piece_jointe: '',
      });
      setErrorMessage('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (factureToEdit) {
      setFormData(factureToEdit);
    }
  }, [factureToEdit]);

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
    updateFacture(formData);
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

        <h2 className="text-xl mx-2">Modifier la facture</h2>
        <form
          className="grid grid-cols-1 lg:grid-cols-1 gap-6 overflow-y-auto max-h-[75vh]"
          onSubmit={handleSubmit}
        >
          <div>
          {errorMessage && (
              <span className="text-red-600 text-sm">{errorMessage}</span>
            )}
            <div className="grid grid-cols-2 px-4 py-3 border-b">
              <label className="block text-sm font-medium text-gray-700 my-2">
                Numéro de facture
              </label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                placeholder="Numéro de facture"
                className="w-full p-2 rounded text-sm"
              />
            </div>

            <div className="grid grid-cols-2 px-4 py-3 border-b">
              <label className="block text-sm font-medium text-gray-700 my-2">
                Montant HT
              </label>
              <input
                type="text"
                name="montant_ht"
                value={formData.montant_ht}
                onChange={handleChange}
                placeholder="montant_ht"
                className="w-full p-2 rounded text-sm"
              />
            </div>

            <div className="grid grid-cols-2 px-4 py-3 border-b">
              <label className="block text-sm font-medium text-gray-700 my-2">
                Pourcentage TVA
              </label>
              <input
                type="text"
                name="pourcentage_tva"
                value={formData.pourcentage_tva}
                onChange={handleChange}
                placeholder="pourcentage_tva"
                className="w-full p-2 rounded text-sm"
              />
            </div>
            <div className="grid grid-cols-2 px-4 py-3 border-b">
              <label className="block text-sm font-medium text-gray-700 my-2">
                prix_tva
              </label>
              <input
                type="text"
                name="prix_tva"
                value={formData.prix_tva}
                onChange={handleChange}
                placeholder="prix_tva"
                className="w-full p-2 rounded text-sm"
              />
            </div>

            <div className="grid grid-cols-2 px-4 py-3 border-b">
              <label className="block text-sm font-medium text-gray-700 my-2">
                Montant TTC
              </label>
              <input
                type="text"
                name="montant_ttc"
                value={formData.montant_ttc}
                onChange={handleChange}
                placeholder="Numéro de facture"
                className="w-full p-2 rounded text-sm"
              />
            </div>

            <div className="grid grid-cols-2 px-4 py-3 border-b">
              <label className="block text-sm font-medium text-gray-700 my-2">
                Date de facturation
              </label>
              <input
                type="date"
                name="date_facturation"
                value={formData.date_facturation}
                onChange={handleChange}
                className="w-full p-2 rounded text-sm"
              />
            </div>
            <div className="grid grid-cols-2 px-4 py-3 border-b">
              <label className="block text-sm font-medium text-gray-700 my-2">
                date_enregistrement
              </label>
              <input
                type="text"
                name="date_enregistrement"
                value={formData.date_enregistrement}
                onChange={handleChange}
                placeholder="Montant"
                className="w-full p-2 rounded text-sm"
              />
            </div>
            <div className="grid grid-cols-2 px-4 py-3 border-b">
              <label className="block text-sm font-medium text-gray-700 my-2">
                type_assigner
              </label>
              <input
                type="text"
                name="type_assigner"
                value={formData.type_assigner}
                onChange={handleChange}
                placeholder="Nom du client"
                className="w-full p-2 rounded text-sm"
              />
            </div>
            <div className="grid grid-cols-2 px-4 py-3 border-b">
              <label className="block text-sm font-medium text-gray-700 my-2">
                validation
              </label>
              <input
                type="text"
                name="validation"
                value={formData.validation}
                onChange={handleChange}
                placeholder="validation"
                className="w-full p-2 rounded text-sm"
              />
            </div>
            <div className="grid grid-cols-2 px-4 py-3 border-b">
              <label className="block text-sm font-medium text-gray-700 my-2">
              piece_jointe
              </label>
              <input
                type="text"
                name="piece_jointe"
                value={formData.piece_jointe}
                onChange={handleChange}
                placeholder="piece_jointe"
                className="w-full p-2 rounded text-sm"
              />
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

ModalEditFactureIn.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  factureToEdit: PropTypes.object,
  updateFacture: PropTypes.func.isRequired,
};

export default ModalEditFactureIn;
